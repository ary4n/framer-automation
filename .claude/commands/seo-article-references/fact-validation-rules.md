# Fact Validation Rules

## CLAIM TYPES

When extracting claims from an article, classify each as:

- **statistic**: Numbers, percentages, metrics (e.g., "30% reduction", "73% of customers")
- **comparison**: Relative claims (e.g., "faster than", "more efficient", "better than")
- **attribution**: Statements attributed to sources (e.g., "According to Gartner...")
- **time-bound**: Time-specific claims (e.g., "by 2025", "in recent years", "since 2020")
- **definitive**: Absolute statements (e.g., "always", "never", "the best", "the only")

## SPECIFICITY SCORING (1-5)

- **5**: Very specific (exact percentage, named source, specific year)
- **4**: Specific (general percentage range, industry name)
- **3**: Moderately specific (claims about trends, general categories)
- **2**: Vague (uses words like "many", "most", "often")
- **1**: Very vague (generic statements, truisms)

## CLAIM EXTRACTION RULES

- Extract 10-20 claims maximum (prioritize high-specificity)
- Include ALL statistics and numbers
- Include ALL attributed statements
- Skip obvious truisms ("customers want good service")
- Skip opinions clearly marked as such
- Skip hypothetical examples

## VALIDATION STATUS

- **verified**: Claim is accurate and well-supported by authoritative sources
- **outdated**: Data is from before 2023 or the situation has changed significantly
- **contradicted**: Sources directly contradict this claim
- **unverifiable**: Cannot find evidence; may be fabricated or too specific to verify
- **misleading**: Technically true but missing crucial context

## RECOMMENDATIONS

- **keep**: Claim is fine as-is
- **add_citation**: Add a source reference inline (e.g., "according to [Source Year]")
- **update_outdated**: Replace with current data from a newer source
- **add_context**: Add qualifying context to prevent misinterpretation
- **remove_unverifiable**: Consider removing — likely fabricated or unsupported

## AUTHORITY DOMAIN SCORING

When evaluating sources, prioritize by domain authority:

### Tier 4 (Highest Authority)
- .gov domains
- .edu domains
- gartner.com, forrester.com, mckinsey.com
- harvard.edu, mit.edu, stanford.edu

### Tier 3
- deloitte.com, pwc.com, accenture.com
- hbr.org
- bloomberg.com, reuters.com

### Tier 2
- techcrunch.com, wired.com, forbes.com
- Major SaaS vendor blogs (zendesk.com, salesforce.com, hubspot.com, etc.)

### Tier 1 (Default)
- All other domains

## SOURCE QUALITY CALCULATION

Base score: 5/10, then adjust:
- +1 to +4 based on domain authority tier
- +2 if source is from the current year
- +1 if source is from last year
- -2 if source is more than 3 years old
- +1 if methodology is mentioned
- Clamp to range 1-10

## CRITICAL ISSUE THRESHOLDS (block publishing)

- ANY contradicted claims present
- More than 30% of claims are unverifiable
- ANY high-specificity (score 4-5) unverifiable claims (likely fabricated stats)

## WARNING THRESHOLDS (warn but allow)

- Any outdated claims
- Any misleading claims
- More than 2 unverifiable claims

## AUTO-FIX RULES

Only auto-fix when ALL conditions are met:
- Recommendation is "add_citation" or "update_outdated"
- Suggested replacement text is available
- Confidence score >= 7 out of 10

All other fixes require user review.

## SENSITIVE CLAIMS

Flag for extra scrutiny any claims containing:
compliance, HIPAA, GDPR, PCI, SOX, legal, lawsuit, regulation, fine, penalty, security, breach, liability, guarantee, certified, accredited
