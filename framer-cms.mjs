#!/usr/bin/env node

/**
 * framer-cms.mjs — CLI utility for Framer CMS operations via framer-api.
 *
 * Subcommands:
 *   list-collections                              List all collections
 *   get-items <collectionId>                      Get all items in a collection
 *   upsert-item <collectionId> --json-file <path> Create or update an item (from file)
 *   upsert-item <collectionId> --json '<json>'    Create or update an item (inline)
 *   remove-items <collectionId> --ids id1,id2     Delete items by ID
 *   upload-image --url <url> [--name <name>]      Upload image, returns asset JSON
 *   add-field <collectionId> --name <n> --type <t> Add a field to a collection
 *   get-fields <collectionId>                     List all fields in a collection
 *   publish                                       Publish and deploy to custom domains
 *
 *   Canvas / Node operations:
 *   get-node <nodeId>                             Get a node by ID
 *   get-children <nodeId>                         Get direct children of a node
 *   get-canvas-root                               Get the canvas root node + children
 *   get-nodes-by-type <type>                      Find all nodes of a given type (e.g. Text, Frame)
 *   get-text <nodeId>                             Get text content of a text node
 *   set-text <nodeId> --text <t>                  Set plain text on a node
 *   set-text <nodeId> --html <h>                  Set HTML on a node
 *   set-text <nodeId> --html-file <path>          Set HTML from file on a node
 *   set-attributes <nodeId> --json <json>         Set attributes on a node
 *   set-attributes <nodeId> --json-file <path>    Set attributes from file on a node
 *   create-frame [--parent-id <id>] [--json <a>]  Create a frame node
 *
 * Reads FRAMER_API_KEY and FRAMER_PROJECT_URL from .env in the script's directory.
 * All output is JSON to stdout. Errors go to stderr as JSON with exit code 1.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { connect } from "framer-api";

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- .env parser (no dotenv dependency) ---
function loadEnv() {
  try {
    const envPath = resolve(__dirname, ".env");
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env not found — rely on existing env vars
  }
}

loadEnv();

const API_KEY = process.env.FRAMER_API_KEY;
const PROJECT_URL = process.env.FRAMER_PROJECT_URL;

if (!API_KEY || !PROJECT_URL) {
  console.error(
    JSON.stringify({
      error: "Missing FRAMER_API_KEY or FRAMER_PROJECT_URL in .env or environment",
    })
  );
  process.exit(1);
}

// --- Helpers ---
function ok(data) {
  console.log(JSON.stringify(data, null, 2));
}

function fail(msg, details) {
  console.error(JSON.stringify({ error: msg, ...(details && { details }) }));
  process.exit(1);
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

// --- Subcommands ---

async function listCollections(framer) {
  const collections = await framer.getCollections();
  ok(
    collections.map((c) => ({
      id: c.id,
      name: c.name,
    }))
  );
}

async function getItems(framer, collectionId) {
  if (!collectionId) fail("Missing <collectionId> argument");
  const collections = await framer.getCollections();
  const col = collections.find((c) => c.id === collectionId);
  if (!col) fail(`Collection '${collectionId}' not found`);
  const items = await col.getItems();
  ok(
    items.map((item) => ({
      id: item.id,
      slug: item.slug,
      fieldData: item.fieldData,
    }))
  );
}

async function upsertItem(framer, collectionId, flags) {
  if (!collectionId) fail("Missing <collectionId> argument");

  let payload;
  if (flags["json-file"]) {
    const filePath = resolve(flags["json-file"]);
    try {
      payload = JSON.parse(readFileSync(filePath, "utf-8"));
    } catch (e) {
      fail(`Failed to read/parse JSON file: ${filePath}`, e.message);
    }
  } else if (flags["json"]) {
    try {
      payload = JSON.parse(flags["json"]);
    } catch (e) {
      fail("Failed to parse inline --json", e.message);
    }
  } else {
    fail("Provide --json-file <path> or --json '<json>'");
  }

  const collections = await framer.getCollections();
  const col = collections.find((c) => c.id === collectionId);
  if (!col) fail(`Collection '${collectionId}' not found`);

  // Build the item input
  const item = {};
  if (payload.id) item.id = payload.id;
  if (payload.slug) item.slug = payload.slug;
  if (payload.draft !== undefined) item.draft = payload.draft;
  if (payload.fieldData) item.fieldData = payload.fieldData;

  // For creates, slug is required
  if (!item.id && !item.slug) {
    fail("New items require a 'slug' field in the payload");
  }

  await col.addItems([item]);

  // Fetch the updated/created item to return it
  const items = await col.getItems();
  const match = item.id
    ? items.find((i) => i.id === item.id)
    : items.find((i) => i.slug === item.slug);

  ok({
    success: true,
    item: match
      ? { id: match.id, slug: match.slug, fieldData: match.fieldData }
      : { slug: item.slug, note: "Item added but could not be re-fetched" },
  });
}

async function removeItems(framer, collectionId, flags) {
  if (!collectionId) fail("Missing <collectionId> argument");
  const idsStr = flags["ids"];
  if (!idsStr) fail("Provide --ids id1,id2,...");
  const ids = idsStr.split(",").map((s) => s.trim()).filter(Boolean);
  if (ids.length === 0) fail("No valid IDs provided");

  const collections = await framer.getCollections();
  const col = collections.find((c) => c.id === collectionId);
  if (!col) fail(`Collection '${collectionId}' not found`);

  await col.removeItems(ids);
  ok({ success: true, removedIds: ids });
}

async function uploadImage(framer, flags) {
  const url = flags["url"];
  if (!url) fail("Provide --url <imageUrl>");
  const name = flags["name"] || "uploaded-image";

  // Plugin API expects { image: urlString, name: optionalName }
  const asset = await framer.uploadImage({ image: url, name });
  ok({
    success: true,
    asset: {
      id: asset.id,
      url: asset.url,
      thumbnailUrl: asset.thumbnailUrl,
    },
  });
}

async function addField(framer, collectionId, flags) {
  if (!collectionId) fail("Missing <collectionId> argument");
  const name = flags["name"];
  const type = flags["type"] || "string";
  if (!name) fail("Provide --name <fieldName>");

  const collections = await framer.getCollections();
  const col = collections.find((c) => c.id === collectionId);
  if (!col) fail(`Collection '${collectionId}' not found`);

  const fields = await col.addFields([{ type, name }]);
  ok({
    success: true,
    fields: fields.map((f) => ({ id: f.id, name: f.name, type: f.type })),
  });
}

async function getFields(framer, collectionId) {
  if (!collectionId) fail("Missing <collectionId> argument");
  const collections = await framer.getCollections();
  const col = collections.find((c) => c.id === collectionId);
  if (!col) fail(`Collection '${collectionId}' not found`);

  const fields = await col.getFields();
  ok(fields.map((f) => ({ id: f.id, name: f.name, type: f.type })));
}

async function getNode(framer, nodeId) {
  if (!nodeId) fail("Missing <nodeId> argument");
  const node = await framer.getNode(nodeId);
  if (!node) fail(`Node '${nodeId}' not found`);
  ok({ id: node.id, name: node.name, type: node.type, attributes: node.attributes ?? null });
}

async function getChildren(framer, nodeId) {
  if (!nodeId) fail("Missing <nodeId> argument");
  const node = await framer.getNode(nodeId);
  if (!node) fail(`Node '${nodeId}' not found`);
  const children = await node.getChildren();
  ok(children.map((c) => ({ id: c.id, name: c.name, type: c.type })));
}

async function getCanvasRoot(framer) {
  const root = await framer.getCanvasRoot();
  if (!root) fail("Could not retrieve canvas root");
  const children = await root.getChildren();
  ok({ id: root.id, name: root.name, type: root.type, children: children.map((c) => ({ id: c.id, name: c.name, type: c.type })) });
}

async function getNodesByType(framer, nodeType) {
  if (!nodeType) fail("Missing <type> argument (e.g. Text, Frame)");
  const nodes = await framer.getNodesWithType(nodeType);
  ok(nodes.map((n) => ({ id: n.id, name: n.name, type: n.type })));
}

async function getText(framer, nodeId) {
  if (!nodeId) fail("Missing <nodeId> argument");
  const node = await framer.getNode(nodeId);
  if (!node) fail(`Node '${nodeId}' not found`);
  const text = await node.getText();
  ok({ id: nodeId, text });
}

async function setText(framer, nodeId, flags) {
  if (!nodeId) fail("Missing <nodeId> argument");
  const text = flags["text"];
  const htmlFile = flags["html-file"];
  const html = flags["html"];
  if (text === undefined && !htmlFile && !html) fail("Provide --text <text>, --html <html>, or --html-file <path>");
  const node = await framer.getNode(nodeId);
  if (!node) fail(`Node '${nodeId}' not found`);
  if (htmlFile) {
    const content = readFileSync(resolve(htmlFile), "utf-8");
    await node.setHTML(content);
  } else if (html) {
    await node.setHTML(html);
  } else {
    await node.setText(text);
  }
  ok({ success: true, nodeId });
}

async function setAttributes(framer, nodeId, flags) {
  if (!nodeId) fail("Missing <nodeId> argument");
  let attrs;
  if (flags["json-file"]) {
    try {
      attrs = JSON.parse(readFileSync(resolve(flags["json-file"]), "utf-8"));
    } catch (e) {
      fail(`Failed to read/parse JSON file`, e.message);
    }
  } else if (flags["json"]) {
    try {
      attrs = JSON.parse(flags["json"]);
    } catch (e) {
      fail("Failed to parse --json", e.message);
    }
  } else {
    fail("Provide --json <attrs> or --json-file <path>");
  }
  const node = await framer.getNode(nodeId);
  if (!node) fail(`Node '${nodeId}' not found`);
  await node.setAttributes(attrs);
  ok({ success: true, nodeId });
}

async function createFrame(framer, flags) {
  let attrs = {};
  if (flags["json"]) {
    try { attrs = JSON.parse(flags["json"]); } catch (e) { fail("Failed to parse --json", e.message); }
  } else if (flags["json-file"]) {
    try { attrs = JSON.parse(readFileSync(resolve(flags["json-file"]), "utf-8")); } catch (e) { fail("Failed to read/parse JSON file", e.message); }
  }
  const parentId = flags["parent-id"] || null;
  const node = await framer.createFrameNode(attrs, parentId);
  ok({ success: true, node: { id: node.id, name: node.name, type: node.type } });
}

async function createPage(framer, flags) {
  const path = flags["path"];
  if (!path) fail("Provide --path <pagePath> (e.g. /llms-txt)");
  const page = await framer.createWebPage(path);
  ok({ success: true, page: { id: page.id, path: page.path } });
}

async function addTextToPage(framer, flags) {
  const pageId = flags["page-id"];
  const htmlFile = flags["html-file"];
  const text = flags["text"];
  if (!pageId) fail("Provide --page-id <id>");

  const node = await framer.createTextNode({}, pageId);
  if (!node) fail("Failed to create text node");

  if (htmlFile) {
    const html = readFileSync(resolve(htmlFile), "utf-8");
    await node.setHTML(html);
  } else if (text) {
    await node.setText(text);
  }

  ok({ success: true, nodeId: node.id });
}

async function setCustomCode(framer, flags) {
  const location = flags["location"] || "headEnd";
  const htmlContent = flags["html"];
  const htmlFile = flags["html-file"];
  let html;
  if (htmlFile) {
    html = readFileSync(resolve(htmlFile), "utf-8");
  } else if (htmlContent) {
    html = htmlContent;
  } else {
    fail("Provide --html '<code>' or --html-file <path>");
  }
  await framer.setCustomCode({ html, location });
  ok({ success: true, location });
}

async function getCustomCode(framer) {
  const code = await framer.getCustomCode();
  ok(code);
}

async function publish(framer) {
  // framer.publish() (creates new snapshot) is currently broken in the Server API beta.
  // Instead: get the latest deployment and re-deploy it to the custom domain.
  // This triggers Framer to re-render the site with the current CMS state.
  const deployments = await framer.getDeployments();
  if (!deployments || deployments.length === 0) {
    fail("No deployments found. Publish from Framer desktop app at least once first.");
  }
  const latestId = deployments[0].id;
  const result = await framer.deploy(latestId);
  ok({
    success: true,
    deploymentId: latestId,
    hostnames: (result || []).map((h) => ({
      hostname: h.hostname,
      type: h.type,
      isPublished: h.isPublished,
    })),
  });
}

// --- Main ---
async function main() {
  const args = process.argv.slice(2);
  const { positional, flags } = parseArgs(args);
  const command = positional[0];

  if (!command) {
    fail(
      "No command provided. Use: list-collections | get-items | upsert-item | remove-items | upload-image | publish | get-node | get-children | get-canvas-root | get-nodes-by-type | get-text | set-text | set-attributes | create-frame"
    );
  }

  let framer;
  try {
    framer = await connect(PROJECT_URL, API_KEY);
  } catch (e) {
    fail("Failed to connect to Framer project", e.message);
  }

  try {
    switch (command) {
      case "list-collections":
        await listCollections(framer);
        break;
      case "get-items":
        await getItems(framer, positional[1]);
        break;
      case "upsert-item":
        await upsertItem(framer, positional[1], flags);
        break;
      case "remove-items":
        await removeItems(framer, positional[1], flags);
        break;
      case "upload-image":
        await uploadImage(framer, flags);
        break;
      case "add-field":
        await addField(framer, positional[1], flags);
        break;
      case "get-fields":
        await getFields(framer, positional[1]);
        break;
      case "get-node":
        await getNode(framer, positional[1]);
        break;
      case "get-children":
        await getChildren(framer, positional[1]);
        break;
      case "get-canvas-root":
        await getCanvasRoot(framer);
        break;
      case "get-nodes-by-type":
        await getNodesByType(framer, positional[1]);
        break;
      case "get-text":
        await getText(framer, positional[1]);
        break;
      case "set-text":
        await setText(framer, positional[1], flags);
        break;
      case "set-attributes":
        await setAttributes(framer, positional[1], flags);
        break;
      case "create-frame":
        await createFrame(framer, flags);
        break;
      case "create-page":
        await createPage(framer, flags);
        break;
      case "add-text-to-page":
        await addTextToPage(framer, flags);
        break;
      case "set-custom-code":
        await setCustomCode(framer, flags);
        break;
      case "get-custom-code":
        await getCustomCode(framer);
        break;
      case "publish":
        await publish(framer);
        break;
      default:
        fail(`Unknown command: '${command}'`);
    }
  } finally {
    await framer.disconnect();
  }
}

main().catch((e) => {
  fail("Unexpected error", e.message);
});
