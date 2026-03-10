# Keyword Scoring Rules

## KEYWORD SCORING SYSTEM

Every keyword must be scored on TWO dimensions: SEO (traditional search) and AEO (answer engines like ChatGPT, Perplexity, Google AI Overviews).

### SEO METRICS

**estimated_volume** (search demand):
- When API data is available, use real monthly search volume: high (1000+), medium (100-999), low (<100)
- When estimating without data:
  - "high": 1-2 word head terms, popular question formats, generic industry terms
  - "medium": 2-3 word qualified phrases, specific topics, "best X for Y"
  - "low": 4+ word long-tail, hyper-specific scenarios, niche combinations

**competition** (ranking difficulty):
- When API data is available, use real competition score: high (0.66+), medium (0.33-0.65), low (<0.33)
- When estimating without data:
  - "high": Generic terms dominated by major brands (Forbes, HubSpot, Wikipedia), many paid ads, deep 5k+ word content
  - "medium": Mix of brands and blogs, 2-3 word phrases with qualifiers, moderate content depth
  - "low": Long-tail 4+ words, forums ranking (Reddit, Quora), thin/old content, few paid ads

**serp_features** (list all applicable):
- "featured_snippet" — question format keywords, answer box opportunity
- "people_also_ask" — related questions appear in SERP
- "video" — "how to" keywords, tutorials, demonstrations
- "image_pack" — visual topics (design, products, food)
- "comparison_table" — "X vs Y", "best X" keywords
- "local_pack" — location-based services
- "knowledge_panel" — entity/brand queries
- "top_stories" — trending/news topics

**commercial_intent** (1-10):
- 9-10: Buying words ("buy", "pricing", "cost", "demo", "sign up")
- 6-8: Research/comparison ("best", "review", "vs", "pros and cons", "top")
- 3-5: Educational ("how to", "what is", "guide", "tutorial")
- 1-2: Navigational/definitional ("login", "meaning", "definition")

**traditional_intent**: "informational" | "navigational" | "commercial" | "transactional"

### AEO METRICS

**question_format_score** (1-10):
- 9-10: Natural question syntax ("How does X work?", "What is X?")
- 7-8: Implied question ("X explained", "best X for Y", "X benefits")
- 4-6: Topic-based ("X guide", "X tips", "X strategies")
- 1-3: Keyword-only, no question structure ("customer service AI")

**answer_extractability** (1-10):
- 9-10: Single definitive answer in 1-2 sentences (definitions, facts)
- 7-8: Answerable in a paragraph with 2-3 key points
- 4-6: Needs full paragraph or multiple steps to answer
- 1-3: Highly contextual, opinion-based, no single answer

**voice_search_friendly** (boolean):
- true: Natural conversational language, how people actually speak, complete question, 5-15 words
- false: Keyword-stuffed, unnatural phrasing, abbreviated, overly technical

**entity_recognition** (1-10):
- 9-10: Multiple specific entities (brand names, products, technologies)
- 5-8: One clear entity or product category
- 1-4: Vague/generic terms, no specific entities

**citation_likelihood** (1-10):
- 9-10: Factual definitions, data-driven, how-to with clear steps, industry standards
- 5-8: Helpful explanations, comparison guides, process descriptions
- 1-4: Opinions, promotional content, vague advice

### OVERALL PRIORITY FORMULA

- **critical**: (High OR Medium SEO Volume) AND (AEO scores averaging 8+) — gold keywords
- **high**: (Medium Volume + AEO 6-10) OR (High Volume + AEO 5-7)
- **medium**: (Low Volume + AEO 8-10) OR (Medium Volume + AEO 3-5)
- **low**: Low Volume AND AEO averaging below 5

### RECOMMENDED CONTENT FORMAT

- **hybrid_comprehensive**: High SEO + High AEO — answer immediately then expand with depth
- **answer_optimized**: Medium SEO + High AEO — FAQ format, conversational, direct answers
- **comprehensive_guide**: High SEO + Low AEO — traditional long-form, backlink-focused
- **quick_answer**: Low SEO + High AEO — short, direct, voice-optimized
- **comparison_table**: Any comparison keyword ("X vs Y", "best X") — structured comparison

### KEYWORD EXPANSION STRATEGIES

Use these methods to expand seed keywords:
1. **Question expansion**: How/What/Why/When/Which/Best variations
2. **Comparison**: "X vs Y", "X or Y", "difference between"
3. **Problem-solution**: "how to fix", "solve", "improve", "optimize"
4. **Modifier expansion**: Industry, size, feature, location, price qualifiers
5. **Entity-rich**: Brand mentions, technology names, integrations, platforms

### VALIDATION RULES

Only include keywords that:
- Use natural language (not keyword-stuffed)
- Have clear search intent
- Are specific enough (not too vague like "software" or "AI")
- Align with the business/page goals
- Could support helpful content creation

Do NOT include:
- Unnatural multi-word stuffing
- Single vague words
- Branded terms you don't own
- Random word combinations with no clear intent

---

## KEYWORD CLUSTERING

Group ALL keywords into 3-6 thematic clusters. Each cluster:
- **cluster_name**: Short label (2-4 words)
- **theme**: One sentence describing what keywords have in common
- **keywords**: Array of keyword strings (every keyword in exactly one cluster)
- **average_seo_volume**: Most common volume level
- **average_aeo_score**: Mean of AEO metrics / 4, rounded to 1 decimal
