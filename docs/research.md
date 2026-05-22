# Compensation Intelligence - Research & Product Decisions

## Mandatory Research & Competitor Analysis

Before architecture and implementation, we evaluated four major platforms in the compensation space to understand market gaps and user needs.

### Key Observations
1. **Levels.fyi:** The gold standard for tech. High focus on structured level mapping (e.g., L3/L4) across different companies. Very reliable for top-tier tech, but less comprehensive outside the US/Big Tech.
2. **6figr:** Highly analytical and data-driven, providing deep insights and predictive modeling, but the UX can feel overwhelming. Good focus on Indian market data.
3. **AmbitionBox:** Excellent for broad company reviews and generic salary ranges in India. However, it lacks strict level-to-level mapping (often just uses raw job titles like "Software Engineer"), making precise compensation comparisons difficult.
4. **Glassdoor:** The most widespread but the least reliable for high-end tech compensation. Relies heavily on user-input text strings and aggregates massive ranges (e.g., $80k - $250k) that provide very low signal.

### Feature Comparison Sheet

| Feature | Levels.fyi | 6figr | AmbitionBox | Glassdoor | Build? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Standardized Levels (L3-L8)** | Yes | Partial | No | No | **Yes** |
| **Total Comp Breakdown (Base/Bonus/Equity)** | Yes | Yes | Partial | Partial | **Yes** |
| **Visual 1v1 Comparisons** | Yes | Yes | No | No | **Yes** |
| **Confidence Scoring / Duplicate Prevention** | Yes (Internal) | Yes | Unknown | No | **Yes** |
| **Broad Industry Reviews / Culture** | No | No | Yes | Yes | **No (Out of Scope)** |
| **Social / Blind-style Chat** | No | No | No | No | **No (Out of Scope)** |

## Platform Engineering Decisions

When evaluating these solutions, it became clear that users prioritize reliable, structured compensation data over anecdotal forum posts when making strict career and negotiation decisions.

### Why Levels Matter
Titles in the tech industry are wildly inconsistent. A "Software Engineer II" at one company might be considered a Junior, while at another, it represents a mid-to-senior role. 

**Decision:** We abstracted and enforced a standardized level system (`L3` through `L8`).
- Ensures apples-to-apples comparison.
- Prevents data dilution from vanity titles.

### Why Normalization Matters
In a crowdsourced intelligence platform, company names suffer from high entropy ("Google", "google", "Google Inc", "Google LLC").
- **Decision:** All incoming records run through a strict normalizer that trims, lowercases, and strips legal corporate suffixes repeatedly. This ensures all "Google" records group effectively when calculating median comps and level distributions, fundamentally preventing split-brain analytics.

### Confidence Scoring System
Data integrity is the largest risk in crowdsourced platforms.
- **Decision:** A 0 to 1 `confidence_score` is automatically assigned based on heuristic validation:
  - Penalizes mismatching YOE (Years of Experience) for senior levels.
  - Penalizes unrealistic base-to-stock ratios.
  - Allows the platform to flag or filter "unreliable" data natively.


