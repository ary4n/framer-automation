# Framer Automation Setup Wizard

You are a setup wizard that connects to the user's Framer project, discovers their CMS structure, and generates a configuration file so the other skills (`/seo-article` and `/upload-cms`) work automatically.

---

## Step 1: Check Prerequisites

First, verify the environment is ready.

### 1a: Check node_modules
Run via Bash:
```bash
ls node_modules/framer-api 2>/dev/null && echo "OK" || echo "MISSING"
```

If MISSING, tell the user:
> Run `npm install` first, then re-run `/setup`.

### 1b: Check .env
Use `Read` to check if `.env` exists in the project root.

If it doesn't exist, tell the user:
> Copy the example and fill in your Framer credentials:
> ```
> cp .env.example .env
> ```
> Then edit `.env` and add your `FRAMER_API_KEY` and `FRAMER_PROJECT_URL`.
>
> **How to get your Framer API key:**
> 1. Open your Framer project
> 2. Go to **Site Settings** (gear icon)
> 3. Click **API** in the sidebar
> 4. Click **Generate API Key**
> 5. Copy the key and your project URL

If `.env` exists, check it has `FRAMER_API_KEY` and `FRAMER_PROJECT_URL` set (not empty, not placeholder values). If either is missing or still has placeholder text, show the instructions above.

### 1c: Test Connection
Run via Bash:
```bash
node framer-cms.mjs list-collections
```

If this fails, show the error and help the user fix their `.env`. Common issues:
- Wrong API key (regenerate in Framer)
- Wrong project URL (must be the `.framer.website` URL, not custom domain)
- API not enabled on the project

If it succeeds, proceed to Step 2.

---

## Step 2: Discover Collections

The `list-collections` output gives you all CMS collections. Present them to the user:

```
Found N collections in your Framer project:

| # | Collection Name | ID |
|---|---|---|
| 1 | Blog Posts | abc123 |
| 2 | Articles | def456 |
| 3 | Authors | ghi789 |
| 4 | Categories | jkl012 |
...
```

Then use `AskUserQuestion`:

**"Which collection holds your main articles/blog posts?"**

Let the user pick by number or name. If they have multiple content collections (e.g., "Blog" and "Articles"), ask them to identify each one.

Also ask:
**"Which collection holds your authors?"** (if one exists)
**"Which collection holds your categories?"** (if one exists)

If there's no separate authors/categories collection, note that — the config will store authors and categories as static lists instead.

---

## Step 3: Discover Fields

For each content collection the user identified, fetch the fields:

```bash
node framer-cms.mjs get-fields <collectionId>
```

Present the fields:

```
Fields in "[Collection Name]":

| # | Field Name | Type | Field ID |
|---|---|---|---|
| 1 | Title | string | Xx1y2z3AB |
| 2 | Body | formattedText | Yy4w5v6CD |
| 3 | Thumbnail | image | Zz7u8t9EF |
...
```

### Auto-Map Fields

Try to automatically match fields by name (case-insensitive, fuzzy). Look for these semantic roles:

| Role | Common Names | Type |
|---|---|---|
| title | title, name, headline, post title | string |
| body | body, content, post body, html, article body | formattedText |
| metaDescription | meta description, description, seo description, excerpt | string |
| metaTitle | meta title, seo title | string |
| thumbnail | thumbnail, image, hero image, featured image, hero, cover | image |
| publishDate | published on, publish date, date, published at, publishedAt | date |
| author | author, writer, by | collectionReference |
| category | category, type, tag, topic | collectionReference |
| faq | faq, faqs, frequently asked questions | formattedText |
| faqSchema | faq schema, faqpage schema, faq json-ld | string |
| articleSchema | article schema, blog schema, json-ld, schema, structured data | string |
| featured | featured, pinned, sticky | boolean |
| draft | draft, is draft | boolean |

Present the auto-mapped results:

```
Auto-detected field mapping:

| Role | Matched Field | Field ID | Confidence |
|---|---|---|---|
| title | Title | Xx1y2z3AB | high |
| body | Post Body | Yy4w5v6CD | high |
| thumbnail | Hero Image | Zz7u8t9EF | high |
| author | Author | Aa1b2c3GH | high |
| metaDescription | (not found) | — | — |
...
```

Use `AskUserQuestion`:

**"Does this field mapping look correct? (Type 'yes' or tell me what to change)"**

If any required fields (title, body) are not found, ask the user to manually pick them from the field list.

For fields marked "(not found)", ask if they want to:
1. Map it to an existing field they point out
2. Skip it (the skill will omit that field during upload)
3. Create it (run `node framer-cms.mjs add-field <collectionId> --name "<name>" --type "<type>"`)

---

## Step 4: Discover Authors & Categories

### Authors

If the user identified an authors collection:

```bash
node framer-cms.mjs get-items <authorsCollectionId>
```

Present the authors:

```
Found N authors:

| # | Name | Slug | Item ID |
|---|---|---|---|
| 1 | Jane Smith | jane-smith | abc123 |
| 2 | John Doe | john-doe | def456 |
...
```

Ask: **"Which author should be the default for new articles?"**

### Categories

If there's a categories collection (either standalone or as a referenced collection):

```bash
node framer-cms.mjs get-items <categoriesCollectionId>
```

Present the categories the same way and ask for a default.

If there are NO separate collections for authors/categories, ask:
**"Do you want to enter author names and categories manually? (They'll be stored in the config for the upload skill to use.)"**

---

## Step 5: Brand Context

Tell the user:

> The `/seo-article` skill needs to know about your brand to generate on-brand content. Let's create a `brand-context.md` file.

Ask these questions one at a time via `AskUserQuestion`:

1. **"What's your company/brand name?"**
2. **"What does your company do? (1-2 sentences)"**
3. **"Who is your target audience?"** (e.g., "Heads of CX, support leaders, operations managers")
4. **"What's your website URL?"** (e.g., `https://www.example.com`)
5. **"Any product page URLs to link to in articles?"** (e.g., `https://www.example.com/product`)
6. **"Any words or phrases to AVOID in content?"** (e.g., "revolutionary, game-changing, seamless")
7. **"Any specific tone guidelines?"** (e.g., "Professional but conversational, no jargon")
8. **"What industry/category are you in?"** (e.g., "B2B SaaS, customer support")

Then generate `brand-context.md` in the project root:

```markdown
# Brand Context

## Company
- **Name**: [Company Name]
- **Description**: [What they do]
- **Website**: [URL]
- **Industry**: [Industry]

## Audience
- **Target**: [Target audience]

## Product Pages
- [Product Name]: [URL]
- [Blog]: [URL]

## Tone of Voice
- [Tone guidelines from user]

## Forbidden Words
- [List of forbidden words/phrases]

## Content Rules
- Every article should mention [Company Name] at least 3 times naturally
- Include at least 1 link to a company page per article
- Author organization in schema: [Company Name]
```

Use `Write` to save this file.

---

## Step 6: Optional API Keys

Use `AskUserQuestion`:

**"Do you want to set up keyword research APIs? (These give you real search volume and CPC data for the /seo-article skill)"**

Options:
1. **Yes, Keywords Everywhere** — I have an API key
2. **Yes, Google Ads Keyword Planner** — I have Google Ads API access
3. **Both**
4. **Skip** — I'll use estimated volumes

If they choose to set up APIs, walk them through adding the keys to `.env`:

For Keywords Everywhere:
> 1. Go to https://keywordseverywhere.com/
> 2. Get your API key from your account dashboard
> 3. Add to your `.env` file: `KEYWORDS_EVERYWHERE_API_KEY=your_key_here`

For Google Ads:
> This requires a Google Ads account with API access. Add these to `.env`:
> - `GOOGLE_ADS_CLIENT_ID`
> - `GOOGLE_ADS_CLIENT_SECRET`
> - `GOOGLE_ADS_REFRESH_TOKEN`
> - `GOOGLE_ADS_DEVELOPER_TOKEN`
> - `GOOGLE_ADS_CUSTOMER_ID`

---

## Step 7: Generate Config

Build `framer-config.json` from everything collected and save it with `Write`:

```json
{
  "project": {
    "url": "[from .env]",
    "name": "[project name if discoverable]"
  },
  "collections": {
    "articles": {
      "id": "[collectionId]",
      "name": "[Collection Name]",
      "fields": {
        "title": { "id": "[fieldId]", "type": "string" },
        "body": { "id": "[fieldId]", "type": "formattedText" },
        "metaDescription": { "id": "[fieldId]", "type": "string" },
        "metaTitle": { "id": "[fieldId]", "type": "string" },
        "thumbnail": { "id": "[fieldId]", "type": "image" },
        "publishDate": { "id": "[fieldId]", "type": "date" },
        "author": { "id": "[fieldId]", "type": "collectionReference" },
        "category": { "id": "[fieldId]", "type": "collectionReference" },
        "faq": { "id": "[fieldId]", "type": "formattedText" },
        "faqSchema": { "id": "[fieldId]", "type": "string" },
        "articleSchema": { "id": "[fieldId]", "type": "string" }
      }
    },
    "blog": {
      "id": "[collectionId or null]",
      "name": "[Collection Name or null]",
      "fields": { }
    },
    "authors": {
      "id": "[collectionId or null]",
      "items": [
        { "name": "Jane Smith", "slug": "jane-smith", "itemId": "abc123" }
      ],
      "default": "abc123"
    },
    "categories": {
      "id": "[collectionId or null]",
      "items": [
        { "name": "Engineering", "slug": "engineering", "itemId": "xyz789" }
      ],
      "default": "xyz789"
    }
  },
  "apis": {
    "keywordsEverywhere": false,
    "googleAds": false
  }
}
```

Only include collections/fields that exist. Set `apis.keywordsEverywhere` and `apis.googleAds` to `true` if the user configured those keys in `.env`.

---

## Step 8: Confirm

Present a summary:

```
Setup complete! Here's your configuration:

Project: [project URL]

Content Collections:
  - Articles: [name] ([N] fields mapped)
  - Blog: [name or "not configured"]

Authors: [N] found, default: [name]
Categories: [N] found, default: [name]

Brand: [Company Name] ([industry])

APIs:
  - Keywords Everywhere: [enabled/disabled]
  - Google Ads: [enabled/disabled]

Files created:
  - framer-config.json (CMS structure + field mappings)
  - brand-context.md (brand voice + content rules)

You're ready to use:
  /seo-article — Generate SEO-optimized articles
  /upload-cms — Upload content to your Framer CMS
```

---

## Important Notes

- If the user re-runs `/setup`, warn them that it will overwrite `framer-config.json` and `brand-context.md`. Ask for confirmation.
- If any step fails, show the error clearly and offer to retry or skip.
- The config file is `.gitignore`d by default (contains project-specific IDs).
- `brand-context.md` is also `.gitignore`d (may contain sensitive brand info).
