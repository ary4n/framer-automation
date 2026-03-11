# Framer Automation

A Claude Code skill pack that automates SEO article generation and publishing to Framer CMS. Write, validate, and publish SEO-optimized articles directly from your terminal.

## What It Does

- **/setup** — Connects to your Framer project, auto-discovers your CMS collections, fields, authors, and categories. Generates a config file so everything else works automatically.
- **/seo-article** — Full SEO content pipeline: keyword analysis, competitor research, article generation with fact validation, and export to HTML/Markdown.
- **/upload-cms** — Uploads content to your Framer CMS with auto-generated meta titles, descriptions, FAQ schema, and article schema.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed
- A [Framer](https://www.framer.com/) project with CMS collections

## Installation

### 1. Clone the repo

```bash
git clone https://github.com/ary4n/framer-automation.git
cd framer-automation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get your Framer API key

1. Open your Framer project in the browser
2. Click the **gear icon** (Site Settings) in the top-right toolbar
3. In the left sidebar, scroll down and click **API**
4. If you don't see an API key yet, click **Generate API Key**
5. Copy the API key — you'll need it in the next step

> **Where exactly is it?** In the Framer editor, look for the gear icon (⚙️) in the top-right corner. That opens Site Settings. The **API** tab is in the left sidebar of that settings panel, near the bottom. If you don't see it, make sure you're on a Framer plan that supports CMS API access (any paid site plan).

> **Project URL:** You also need your project URL. This is the `.framer.website` URL (e.g. `https://your-project.framer.website`), **not** a custom domain. You can find it in **Site Settings → General**.

### 4. Set up your environment

```bash
cp .env.example .env
```

Open `.env` and fill in your credentials:

```
FRAMER_API_KEY=your_api_key_here
FRAMER_PROJECT_URL=https://your-project.framer.website
```

### 5. Open Claude Code

```bash
claude
```

### 6. Run the setup wizard

```
/setup
```

This will:
- Verify your Framer connection works
- Discover all your CMS collections and fields
- Ask you to map fields (title, body, author, etc.)
- Walk you through creating a `brand-context.md` for your company's tone and style
- Optionally configure keyword research APIs
- Generate `framer-config.json` with all your CMS mappings

### 7. You're ready

```
/seo-article          # Generate SEO articles
/upload-cms           # Upload content to Framer
```

## How It Works

### `/setup` (run once)

The setup wizard connects to your Framer project and auto-discovers your CMS structure. It creates two files:

- **`framer-config.json`** — Maps your collection IDs, field IDs, authors, and categories. The other skills read from this file instead of using hardcoded IDs.
- **`brand-context.md`** — Your company name, tone of voice, target audience, forbidden words, and product page URLs. The article generator uses this to write on-brand content.

Both files are `.gitignore`d since they contain project-specific configuration.

### `/seo-article`

A full content pipeline:

1. **Keyword analysis** — Accepts URLs, seed keywords, or runs keyword research. Scores every keyword on SEO and AEO (Answer Engine Optimization) dimensions.
2. **Competitor analysis** — Optionally scrapes competitor articles to find content gaps and unique angles.
3. **Article generation** — Writes 1,200-1,500 word articles with AEO optimization, fact-validated statistics, expert quotes, and structured FAQ sections.
4. **Fact validation** — Verifies every claim via web search. Auto-fixes what it can, flags the rest.
5. **Export** — Saves as Markdown, HTML, or uploads directly via `/upload-cms`.

### `/upload-cms`

Handles the CMS upload:

1. Reads your field mappings from `framer-config.json`
2. Builds the correct JSON payload for your collection
3. Auto-generates meta titles, descriptions, answer capsules, FAQ schema, and article schema
4. Uploads via the Framer API
5. Optionally publishes the site

## Optional: Keyword Research APIs

For real search volume and CPC data, you can configure these in `.env`:

### Keywords Everywhere

1. Get an API key at [keywordseverywhere.com](https://keywordseverywhere.com/)
2. Add to `.env`: `KEYWORDS_EVERYWHERE_API_KEY=your_key`

### Google Ads Keyword Planner

Requires a Google Ads account with API access. Add to `.env`:

```
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_REFRESH_TOKEN=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CUSTOMER_ID=
```

Without these APIs, the skill uses estimated keyword volumes based on heuristics. Still works, just less precise.

## Project Structure

```
framer-automation/
├── README.md                 # You're reading this
├── framer-cms.mjs            # CLI tool for Framer CMS operations
├── package.json              # Dependencies (just framer-api)
├── .env.example              # Template for environment variables
├── .gitignore                # Ignores .env, config, node_modules
├── .claude/
│   └── commands/
│       ├── setup.md          # /setup — Configuration wizard
│       ├── seo-article.md    # /seo-article — Article generator
│       ├── upload-cms.md     # /upload-cms — CMS uploader
│       └── seo-article-references/
│           ├── article-structure.md      # Article blueprint
│           ├── keyword-scoring-rules.md  # Keyword scoring system
│           └── fact-validation-rules.md  # Fact validation rules
├── framer-config.json        # Generated by /setup (gitignored)
└── brand-context.md          # Generated by /setup (gitignored)
```

## Troubleshooting

### "Missing FRAMER_API_KEY or FRAMER_PROJECT_URL"
Your `.env` file is missing or has empty values. Make sure both are set.

### "Collection not found"
The collection ID in your config doesn't match your Framer project. Re-run `/setup`.

### "Failed to connect to Framer project"
- Check your API key is correct (regenerate in Framer if needed)
- Make sure the project URL is the `.framer.website` URL, not a custom domain
- Make sure the API is enabled on your project

### Commands not showing up in Claude Code
Make sure you're running `claude` from inside the `framer-automation` directory. Claude Code looks for `.claude/commands/` relative to your working directory.

## Customization

### Article structure
Edit `.claude/commands/seo-article-references/article-structure.md` to change the article blueprint, word counts, section order, or formatting rules.

### Keyword scoring
Edit `.claude/commands/seo-article-references/keyword-scoring-rules.md` to adjust how keywords are scored and prioritized.

### Fact validation
Edit `.claude/commands/seo-article-references/fact-validation-rules.md` to change validation thresholds or authority domain rankings.

### Brand voice
Edit `brand-context.md` (generated by `/setup`) to update your company info, tone guidelines, or forbidden words at any time.

## License

MIT
