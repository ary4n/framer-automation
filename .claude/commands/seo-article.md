# SEO Article Generator

You are an SEO content pipeline that analyzes keywords, researches competitors, generates AEO-optimized articles, validates facts, and exports production-ready content.

**Before doing anything**, read these files:
1. `framer-config.json` in the project root — for CMS structure and API availability. If it doesn't exist, tell the user to run `/setup` first.
2. `brand-context.md` in the project root — for company name, tone, audience, forbidden words. If it doesn't exist, warn the user and ask for basic brand info inline.
3. `.claude/commands/seo-article-references/keyword-scoring-rules.md`
4. `.claude/commands/seo-article-references/article-structure.md`
5. `.claude/commands/seo-article-references/fact-validation-rules.md`

Read `framer-config.json` to check:
- `apis.keywordsEverywhere` — whether Keywords Everywhere API is available
- `apis.googleAds` — whether Google Ads Keyword Planner is available
- `collections.articles.id` — the articles collection ID (for cross-link fetching)

Read `brand-context.md` to extract:
- `companyName` — used throughout for entity mentions, schema, branded sections
- `website` — for internal links and schema URLs
- `productPages` — for backlinks in articles
- `audience` — for tone targeting
- `forbiddenWords` — words to never use
- `toneGuidelines` — writing style rules

---

## Step 1: Gather Input

The user may provide input as the argument: $ARGUMENTS

**If $ARGUMENTS is a URL** (starts with `http://` or `https://`):
- Use `WebFetch` to scrape the URL. Ask for: page title, meta description, all H1/H2/H3 headings, and the main body content (first 8000 chars).
- Proceed to Step 2 (URL mode).

**If $ARGUMENTS is a file path** (ends in `.csv`, `.txt`, or `.md`):
- Use `Read` to load the file, extract keywords (one per line, or comma-separated).
- Proceed to Step 2 (Keywords mode).

**If $ARGUMENTS starts with "research"** (e.g., "research: zendesk, freshdesk, intercom"):
- Extract the keyword list or competitor names from the argument.
- Proceed to Step 2, Research mode.

**If $ARGUMENTS is text** (not a URL, file path, or research command):
- Treat as seed keywords (comma-separated).
- Proceed to Step 2 (Keywords mode).

**If $ARGUMENTS is empty**, ask the user:

Use `AskUserQuestion` with options:
1. **Analyze a URL** — Scrape a webpage and identify keyword opportunities
2. **Provide keywords** — Give a list of seed keywords to expand and score
3. **Keyword research** — Pull real search volume, CPC, and competition for specific keywords

---

## Step 2: Keyword Analysis & Scoring

Using the scoring rules from `keyword-scoring-rules.md`, perform the analysis.

### Keyword Data Enrichment (if APIs are configured)

Check `framer-config.json` for which APIs are available.

#### If Google Ads is available (`apis.googleAds: true`)

Read `.env` for Google Ads credentials. Use the google-ads-keywords CLI (if it exists in the project root):

**For keyword suggestions**:
```bash
node google-ads-keywords.mjs suggestions "keyword1" "keyword2"
```

**For exact metrics**:
```bash
node google-ads-keywords.mjs metrics "keyword1" "keyword2"
```

Use Google Ads as the primary source for volume and competition.

#### If Keywords Everywhere is available (`apis.keywordsEverywhere: true`)

Read `.env` for the `KEYWORDS_EVERYWHERE_API_KEY`. Use it in requests:

```bash
curl -s -X POST "https://api.keywordseverywhere.com/v1/get_keyword_data" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $KEYWORDS_EVERYWHERE_API_KEY" \
  -d "country=us&currency=usd&dataSource=gkp$(printf '&kw[]=%s' "keyword1" "keyword2")"
```

**Important**: Read the API key from `.env` — never hardcode it.

Max 100 keywords per request. Returns `vol`, `cpc`, and `competition` (0-1 scale).

#### If NO APIs are configured

Use estimated volumes based on the keyword scoring rules. Note to the user that results would be more accurate with API keys configured (they can run `/setup` to add them).

#### Combining Sources (when both available)
- Use Google Ads volume as primary (authoritative source with exact figures)
- Use Keywords Everywhere CPC as secondary reference
- Flag discrepancies if KE volume differs from Google Ads by more than 2x

### Research Mode (keyword research only - no article generation)

This mode pulls raw keyword metrics and presents them as a formatted report.

**Gathering keywords to research:**

Ask the user what they want to research. Common patterns:
- **Competitor alternatives**: Auto-generate variations: `[name] alternative`, `[name] alternatives`, `[name] competitor`, `[name] competitors`, `[name] vs`, `[name] replacement`, `alternative to [name]`, `best [name] alternatives`
- **Competitor vs**: Generate head-to-head: `[name] vs [other name]` for every pair
- **Category tools**: Auto-generate: `best [category] tools`, `best [category] software`, `best [category] platforms`, `top [category] tools`
- **Raw keyword list**: Look up specific keywords
- **Topic variations**: Generate common search variations

When the user provides competitors, generate all groups in a single batch. Infer the product category from the competitor names.

**Presenting results:**

Group results by brand/topic:

```
### [Brand/Topic] (total: X/mo)
| Keyword | Vol/mo | CPC | Competition |
|---------|--------|-----|-------------|
| keyword phrase | 590 | $10.19 | 0.38 |
```

Sort by volume descending. Show a Ranking by Opportunity summary.

After presenting, use `AskUserQuestion`:
1. **Generate articles for top keywords**
2. **Research more keywords**
3. **Done**

### URL Mode
1. Summarize the page in 2-3 sentences.
2. Generate Page Insights (Working Well + Areas for Improvement).
3. Generate 20-35 keyword opportunities.

### Keywords Mode
1. Expand using strategies from the scoring rules.
2. Score all expanded keywords on both SEO and AEO dimensions.

### Cluster keywords into 3-6 thematic groups

---

## Step 3: Present Keywords & Selection

Display keywords grouped by cluster with scoring. Number them sequentially.

Use `AskUserQuestion`:
**"Which keywords would you like to generate articles for?"**

Options:
1. **All critical + high**
2. **All critical**
3. **All**
4. *(User types specific numbers)*

Then ask:
**"Run competitor analysis before generating?"**
1. **Yes**
2. **No, generate directly**

---

## Step 4: Competitor Analysis (if selected)

Ask for up to 10 competitor article URLs. For each:
1. `WebFetch` to scrape content.
2. Analyze and identify: Table Stakes, Opportunities, Content Gaps, Weaknesses, Unique Angles, Claims to Validate/Challenge, Unanswered Questions.

Ask which gaps/angles to target.

---

## Step 4b: LLM Search Competitive Check

For each keyword, use `WebSearch`:
1. The keyword as-is
2. `"[keyword]" site:perplexity.ai OR site:reddit.com`

Identify: currently cited pages, answer format, missing angles.

Read `brand-context.md` for the company name — check if the brand is mentioned anywhere in AI results. If not, note it as an opportunity.

---

## Step 5: Article Generation

For each selected keyword, generate one article following `article-structure.md`.

### Pre-Generation: Get Brand Context

Read `brand-context.md` for:
- Company name (for branded sections and entity mentions)
- Target audience (for tone)
- Forbidden words (to avoid)
- Tone guidelines
- Product page URLs (for backlinks)
- Website URL (for internal links)

### Pre-Generation: Fetch Existing Articles for Cross-Links

Read the articles collection ID from `framer-config.json`, then:

```bash
node framer-cms.mjs get-items [articles_collection_id]
```

Build a reference map of `{ slug: title }` for cross-linking. Read `brand-context.md` for the website URL to construct full paths. Only link to articles that actually exist in the CMS.

---

### Step 5a: Pre-Generation Research (Source Bank)

**This is the core anti-hallucination mechanism. Research first, write second.**

For each keyword, run 2-3 WebSearches:
1. `"[keyword]" statistics data 2025 2026`
2. `"[keyword]" expert quote OR "said" OR "noted" industry leader`
3. `"[keyword]" research study report findings`

Build a Source Bank:
- 6-10 verified statistics with source name, year, and URL
- 1-3 real expert quotes with name, title, company
- 3-5 citable reports/studies with publisher and URL

---

### Article Output

Each article must include:
- **Title**: 60-70 character H1 (NOT in the HTML body)
- **Meta Description**: 150-160 characters
- **HTML Content**: Full article body using h2, h3, h4, p, ul, ol, li, strong, blockquote tags. NO h1 tag. NO table tags.
- **FAQ Schema**: 5-7 question/answer pairs (40-60 word answers)
- **Article Schema**: JSON-LD with `dateModified` set to today
- **Target Keyword**: The keyword this article targets

### Generation Rules

Follow the article blueprint from `article-structure.md` exactly:
- 5-7 H2 sections, all question-based
- 40-60 word direct answer paragraph immediately after EVERY H2
- 1 metrics section with 3-5 before-after comparisons as prose (NO tables)
- 1 numbered list section with bold headers (3-6 items)
- 1-2 expert quotes from the Source Bank (blockquote format)
- Key Takeaways: 3-5 bullets, 15-25 words each with metrics
- FAQ: 5-7 questions with 40-60 word self-contained answers
- Conclusion: 120-150 words with CTA
- Total: 1,200-1,500 words (target: 1,350)
- Visual break every 200-250 words
- No paragraph exceeds 80 words
- All numbers as numerals
- 4-6 inline source attributions
- 6-8 specific statistics from the Source Bank

### Branded Section (REQUIRED)

Every article must include a branded perspective section. Read `brand-context.md` for the company name.

- Position as the **second-to-last H2**, just before Key Takeaways
- H2 format: `<h2>[Company Name]'s Take on [Topic]</h2>`
- 80-120 words. First-person plural ("We've seen...", "At [Company]...")
- Offer a concrete, opinionated perspective
- Mention the company name 2-3 times in this section
- End with 1 sentence linking back to a company page (from `brand-context.md` product pages)

### Entity Density Check (post-generation)
Count occurrences of the company name (from `brand-context.md`). Must be at least 5 mentions. If fewer, add natural mentions.

### Linking Requirement
- Every named source/report must be hyperlinked
- 1-2 cross-links to other articles (using slugs from the CMS fetch)
- At least 1 backlink to a company page (from `brand-context.md` product pages)
- Use the website URL from `brand-context.md` to construct internal link paths
- External links: `target="_blank" rel="noopener"`
- Internal links: no `target="_blank"`

### Statistics Requirement
- Draw ONLY from the Source Bank
- Inline source attribution for every stat
- If not in the Source Bank, use hedged language

### Expert Quote Requirement
- 1-2 from Source Bank. Format: blockquote with name, title, company
- If none found, skip entirely — never fabricate

### Tone of Voice
Read `brand-context.md` for forbidden words and tone guidelines. Apply them throughout. Also invoke the `/copywriting` skill if available for additional tone guidance.

### Article Schema Generation

Read `brand-context.md` for company name and website URL:

```json
{
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "datePublished": "[today ISO 8601]",
  "dateModified": "[today ISO 8601]",
  "author": {"@type": "Organization", "name": "[company name from brand-context]"},
  "publisher": {"@type": "Organization", "name": "[company name]", "@id": "[website URL]/#org"},
  "mainEntityOfPage": "[website URL]/articles/[slug]"
}
```

### AEO Checklist (post-generation)

Run through the checklist from `article-structure.md`. Auto-fix what's possible, flag the rest.

---

## Step 6: Fact Validation & Citation Verification

Follow `fact-validation-rules.md`. For each article:
1. Extract claims, classify types, score specificity
2. Verify high-specificity claims via WebSearch + WebFetch
3. Auto-fix when confident, flag the rest
4. Present validation summary

---

## Step 7: Export

Present a summary of all articles, then use `AskUserQuestion`:

1. **Markdown files** — Save as .md files
2. **HTML files** — Save as .html files
3. **Both Markdown + HTML**
4. **Upload to CMS** — Use the /upload-cms flow

### Markdown Export
Convert HTML to markdown, save as `[slug].md`.

### HTML Export
Save raw HTML as `[slug].html`.

### CMS Upload
Tell the user to run `/upload-cms` with the article details.

### llms-full.txt Update (run after each export)

Read `brand-context.md` for website URL and company name. Append to `llms-full.txt`:

```
## [Article Title]
URL: [website URL]/articles/[slug]
Updated: [YYYY-MM-DD]
Keywords: [target keyword], [2-3 related terms]

[Plain text version — max 1,200 words]

---
```

If `llms-full.txt` doesn't exist, create it with:
```
# [Company Name] - Full Article Content
# Used by AI search engines and LLM crawlers
# Updated: [date]
# Site: [website URL]
```

---

## Step 8: Final Summary

Present generated articles, validation results, AEO optimization summary, and next steps.

---

## Important Notes

- **All brand info comes from `brand-context.md`** — never hardcode company names, URLs, or product pages
- **All CMS IDs come from `framer-config.json`** — never hardcode collection or field IDs
- **All API keys come from `.env`** — never hardcode API keys
- When generating articles, you ARE the LLM — generate content directly
- Use `WebFetch` for URL scraping, `WebSearch` for research, `Write` for file export
- The Source Bank (Step 5a) is the anti-hallucination backbone
- Process keywords sequentially — generate, validate, then move to next
