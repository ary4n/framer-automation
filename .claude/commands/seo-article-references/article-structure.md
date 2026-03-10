# Article Structure Template

## HEADING STRUCTURE

### H1 (title field only, NOT in content HTML)
- 60-70 characters including spaces
- Title case or sentence case

### H2 (Major Sections) — 5-7 total
- Question-based preferred ("What is...", "How does...", "Why should...")
- 50-80 characters
- EVERY H2 MUST be immediately followed by a 40-60 word direct answer paragraph (2-3 sentences, plain text, no bold/italics — this is the AI extraction target)
- Each H2+answer block must function as a **standalone answer** — extractable without any other section
- No forward/backward references like "as mentioned above" or "we'll cover this later"
- Each H2 answer block must restate the core entity/topic name (not use pronouns like "it" or "this")

### H3 (Subsections) — 2-4 per H2 where needed
- Customer-centric or descriptive
- 40-60 characters

### H4 — Use sparingly, maximum 2-3 in entire article

## WORD COUNT
- Total: 1,200-1,500 words (target: 1,350 words)
- Reading time: Maximum 6 minutes (250 words/minute)

## AEO OPTIMIZATION (LLM/AI Search Pickup)

Every article must include these 3 elements at the top of the body content, BEFORE the narrative introduction.

### 1. Definition-Style Opening (REQUIRED)
- The FIRST paragraph must follow the pattern: "[Topic] is/are [definition]."
- 2-3 sentences, 40-60 words. Plain text, no bold/italics.
- Include 1-2 specific numbers or benchmarks.
- This is the #1 extraction target for AI citations.

### 2. Bullet-Point Summary (REQUIRED)
- Immediately after the definition paragraph, add a `<ul>` with 4-5 key takeaway bullets.
- Each bullet: 15-25 words, includes a specific number or actionable insight.

### 3. Last Updated Freshness Signal (REQUIRED)
- Immediately after the bullet summary: `<p><em>Last updated: [Month] [Year]</em></p>`

### 4. Structure Order
```
<p>[Definition-style answer — 40-60 words with "[Topic] is..." pattern]</p>
<ul>
<li>Key point 1 with specific metric</li>
<li>Key point 2 with specific metric</li>
<li>Key point 3 with actionable insight</li>
<li>Key point 4 with actionable insight</li>
</ul>
<p><em>Last updated: [Month] [Year]</em></p>
<p>[Narrative introduction — 80-100 words, the "hook" paragraph]</p>
<h2>...</h2>
```

## ARTICLE BLUEPRINT

**Note**: Replace `[Brand]` with the company name from `brand-context.md` throughout.

<p>[DEFINITION ANSWER: 40-60 words — "[Topic] is [definition]" pattern with 1-2 specific numbers]</p>
<ul>
<li>[Key point with metric — 15-25 words]</li>
<li>[Key point with metric — 15-25 words]</li>
<li>[Key point with actionable insight — 15-25 words]</li>
<li>[Key point with actionable insight — 15-25 words]</li>
</ul>
<p><em>Last updated: [Month] [Year]</em></p>

<p>[NARRATIVE INTRODUCTION: 80-100 words]</p>
<p>[Problem statement — 2-3 sentences]</p>
<p>[Solution overview — 2-3 sentences.]</p>

<h2>What is [Topic]?</h2>
<p>[40-60 word DIRECT ANSWER — plain paragraph, standalone-extractable.]</p>
<p>[100-120 words expansion with stats]</p>
<p>[DEFINITION BLOCK: <strong>[Key Term]</strong>: [plain-language definition in 15-25 words]]</p>

<h2>How Does [Aspect] Work?</h2>
<p>[40-60 word direct answer — standalone-extractable, restates topic name]</p>
<h3>[Subsection 1]</h3>
<p>[50-70 words]</p>
<h3>[Subsection 2]</h3>
<p>[50-70 words]</p>
<blockquote><p>"[Expert quote — real, verified, from Source Bank]"</p><p>— [Name], [Title], [Company]</p></blockquote>

<h2>What [Use Cases/Features]?</h2>
<p>[40-60 word direct answer — standalone-extractable]</p>
<ol>
<li><strong>Task name.</strong> Description with specific benefit and metric in 30-50 words.</li>
<li><strong>Task name.</strong> Description with metric in 30-50 words.</li>
<li><strong>Task name.</strong> Description with metric in 30-50 words.</li>
</ol>

<h2>What Results Can You Expect?</h2>
<p>[40-60 word direct answer — standalone-extractable]</p>
<p>[Metrics as flowing prose, NOT a table. Each metric gets its own sentence with before-after comparison. 3-5 metrics across 1-2 paragraphs, 80-120 words total. Every metric attributed.]</p>
<p>[40-60 word paragraph explaining what these numbers mean in practice]</p>

<h2>[Additional Section]</h2>
<p>[40-60 word direct answer — standalone-extractable]</p>
<p>[100-120 words content]</p>

<h2>[Brand]'s Take on [Topic]</h2>
<p>[BRANDED PERSPECTIVE: 80-120 words. Start with "At [Brand], we've seen..." Include a contrarian or opinionated take. Mention [Brand] 2-3 times. End with a link to a company page from brand-context.md.]</p>

<h2>Key Takeaways</h2>
<ul>
<li>[15-25 words with specific number/metric — actionable insight]</li>
<li>[15-25 words with specific number/metric]</li>
<li>[15-25 words with specific number/metric]</li>
</ul>

<h2>Frequently Asked Questions</h2>
<h3>[Cost/pricing question]?</h3>
<p>[40-60 word self-contained direct answer. First sentence answers the question.]</p>
<h3>[Implementation/timeline question]?</h3>
<p>[40-60 word self-contained direct answer]</p>
<h3>[Capability question]?</h3>
<p>[40-60 word self-contained direct answer]</p>
<h3>[Integration/compatibility question]?</h3>
<p>[40-60 word self-contained direct answer]</p>
<h3>[Comparison question]?</h3>
<p>[40-60 word self-contained direct answer]</p>
<h3>[ROI/value question]?</h3>
<p>[40-60 word self-contained direct answer]</p>

<p>[CONCLUSION: 120-150 words]</p>
<p>[Summary — 50-60 words]</p>
<p>[Forward-looking benefit — 40-50 words]</p>
<p><strong>[CTA — 30-40 words with clear next step]</strong></p>

## WORD BUDGET BY SECTION

| Section | Words | % |
|---|---|---|
| AEO Block (definition + bullet summary + updated line) | 100-140 | 8% |
| Narrative Introduction | 80-100 | 7% |
| H2 Section 1 (with answer block + definitions) | 170-210 | 14% |
| H2 Section 2 (with H3 subsections + expert quote) | 150-180 | 12% |
| H2 Section 3 (with numbered list) | 180-210 | 14% |
| H2 Section 4 (with attributed metrics) | 130-160 | 11% |
| H2 Section 5 | 100-130 | 9% |
| Key Takeaways | 60-80 | 5% |
| FAQ (5-7 questions) | 250-350 | 22% |
| Conclusion | 120-150 | 10% |
| TOTAL | 1,200-1,500 | 100% |

## PARAGRAPH RULES
- 40-80 words per paragraph, 2-4 sentences
- Max 3 consecutive paragraphs without a visual break
- Visual break every 200-250 words
- No paragraph longer than 80 words

## CONTENT DENSITY & READABILITY
- Flesch Reading Ease target: 60+ (8th-10th grade level)
- Average sentence length: 15-25 words
- Passive voice: < 10%
- Numbers always as numerals: 40%, $2.10, 5 minutes
- Acronyms spelled out on first use
- Bold for emphasis: max 1-2 per section

### Inline Source Attribution (REQUIRED)
Every factual claim must have an inline textual attribution.
- Pattern: `"According to [Source Name](URL), [claim with specific number]"`
- Minimum: 4-6 attributed claims per article
- **ANTI-HALLUCINATION**: Only cite sources you can name with confidence. If unsure, use hedged language.

### Statistics Density (REQUIRED)
- Minimum: 6-8 specific numbers/percentages per article
- Never write "significant improvement" — write "42% improvement (Source)" when you have the data
- **ANTI-HALLUCINATION**: If you can't confidently source a number, use qualitative language instead

### Expert Quotes (REQUIRED)
- 1-2 expert quotes per article from the Source Bank
- Format: `<blockquote><p>"[Quote]"</p><p>— [Name], [Title], [Company]</p></blockquote>`
- **NEVER fabricate a quote and attribute it to a real person**
- If no real quote found, skip entirely

### Definition Blocks for Key Terms
- Pattern: `<strong>[Term]</strong>: [definition in 15-25 words]`
- Place immediately after the term's first use

## METRICS/COMPARISON FORMAT (NO TABLES)
- Write all comparisons as flowing prose, NOT tables
- Each metric gets its own sentence
- 3-5 before-after metrics as natural sentences
- DO NOT use HTML table tags

## LINKING RULES

### External Source Links
- Wrap every cited source in `<a>` with `target="_blank" rel="noopener"`
- Every named source/report must be linked at least once

### Internal Cross-Links
- Link to other articles where relevant. Use relative paths from the CMS.
- No `target="_blank"` on internal links.
- Minimum: 1-2 cross-links per article

### Company Backlinks
- Read `brand-context.md` for product page URLs
- Every article must include at least 1 link to a company page
- Use `target="_blank" rel="noopener"`
- Place naturally — no standalone "visit us" CTAs

### Link Density
- Target: 5-8 total links per article
- Max 1 link per paragraph

## LLM SEARCH RULES

### Freshness Signal (REQUIRED)
Include the current year in the definition-style opening. LLMs favour recently dated content.

### Entity Density (REQUIRED)
The company name (from `brand-context.md`) must appear at least 5 times:
1. Once in the answer capsule
2. 2-3 times in the branded take section
3. Once in the Conclusion CTA
4. Once in a body section

### Section Order with Branded Take
1. What is [Topic]?
2. How does [Aspect] work?
3. [Use cases / features]
4. [Results / benchmarks]
5. [Additional section if needed]
6. **[Brand]'s Take on [Topic]** <- second-to-last H2
7. Key Takeaways
8. Frequently Asked Questions

## FAQ RULES
- 5-7 questions per article (minimum 5)
- Self-contained answers — no "as discussed above"
- First sentence directly answers the question
- Match real search query patterns
- 40-60 words each

## POST-GENERATION AEO CHECKLIST

### Structure Checks
- [ ] Definition opening with "[Topic] is..." pattern and year
- [ ] 4+ bullet summary points at top
- [ ] "Last updated [Month Year]" visible text
- [ ] 5-7 FAQ questions with self-contained answers
- [ ] 5+ company name mentions in body
- [ ] Each H2 answer block is standalone-extractable
- [ ] No paragraph exceeds 80 words
- [ ] `dateModified` in Article schema

### Citation & Evidence Checks
- [ ] 4+ inline source attributions
- [ ] 6+ specific numerals/statistics
- [ ] 1-2 expert quotes present (or explicitly skipped)
- [ ] Every statistic traces to the Source Bank
- [ ] Every attribution is a real source
- [ ] Expert quotes are real or omitted
- [ ] No unsourced specific numbers
- [ ] Definition blocks for technical terms
