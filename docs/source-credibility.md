# 🎯 Source Credibility Guide

## The Tier System

Not all sources are equal. This guide helps you identify which sources to trust for different types of claims.

## Tier 1: Primary Sources (Highest Trust)

**Definition**: The people or organizations who created the thing being researched.

### For AI/ML Research
| Source Type | Examples | Why Trust? |
|-------------|----------|------------|
| Official documentation | openai.com, anthropic.com | Source of truth |
| Research papers | arXiv, NeurIPS, ICML | Peer-reviewed science |
| API documentation | docs.openai.com, docs.anthropic.com | Exact capabilities |
| Official blogs | blog.openai.com | Announcements, roadmaps |
| GitHub repositories | github.com/openai | Code, issues, PRs |

### For Design Research
| Source Type | Examples | Why Trust? |
|-------------|----------|------------|
| Design system docs | developer.apple.com, m3.material.io | Official guidelines |
| Tool documentation | help.figma.com, docs.framer.com | How it actually works |
| Award archives | awwwards.com/winners | Judged by experts |
| Creator portfolios | Personal websites | Original work |

### For Financial Research
| Source Type | Examples | Why Trust? |
|-------------|----------|------------|
| SEC filings | sec.gov/edgar | Legally required, audited |
| Earnings calls | Company investor relations | Management directly |
| Official reports | Annual reports, 10-K, 10-Q | Audited financials |

## Tier 2: Expert Practitioners (High Trust)

**Definition**: People who use the thing extensively in production.

### For AI/ML Research
| Source Type | Examples | Why Trust? |
|-------------|----------|------------|
| ML engineers at top labs | Google DeepMind, Meta AI | Build with it daily |
| Technical reviewers | Papers With Code, ML engineering blogs | Rigorous analysis |
| Open source maintainers | Hugging Face, LangChain | Know the edge cases |
| Startup founders using it | AI-native companies | Production experience |

### For Design Research
| Source Type | Examples | Why Trust? |
|-------------|----------|------------|
| Design engineers | Vercel, Linear, Notion teams | Ship production UI |
| Design tool makers | Figma, Framer, Rive | Know the medium |
| Design educators | Refactoring UI, DesignCode | Teach best practices |
| Senior designers at top companies | Apple, Google, Airbnb | Industry experience |

### For Financial Research
| Source Type | Examples | Why Trust? |
|-------------|----------|------------|
| Analysts at major banks | Goldman, Morgan Stanley | Professional coverage |
| Independent researchers | Muddy Waters, Citron | Contrarian analysis |
| Industry specialists | Sector-focused funds | Deep domain knowledge |

## Tier 3: Informed Community (Medium Trust)

**Definition**: Active community members with demonstrated expertise.

### For AI/ML Research
| Source Type | Examples | Why Trust? |
|-------------|----------|------------|
| Active GitHub contributors | Issue reporters, PR authors | Hands-on experience |
| Technical blog writers | Personal ML blogs | Documented experiments |
| Conference speakers | NeurIPS, ICML presenters | Peer-recognized |
| Online course creators | Fast.ai, DeepLearning.AI | Teaching expertise |

### For Design Research
| Source Type | Examples | Why Trust? |
|-------------|----------|------------|
| Community curators | Dribbble top 100, Behance | Trend recognition |
| Design Twitter/X threads | High-engagement technical threads | Viral for a reason |
| Newsletter writers | Design newsletters | Curated insights |
| Discord/Slack communities | Design system communities | Practitioner discussions |

## Tier 4: General Media (Context Only)

**Definition**: Publications that cover the topic but don't specialize.

### Examples
- TechCrunch, The Verge, Ars Technica
- General news outlets (NYT, WSJ tech sections)
- Business publications (Forbes, Fortune)

**Use for**: Broader context, public perception, market timing
**Don't use for**: Technical accuracy, detailed specifications

## Tier 5: Social Buzz (Signal Only)

**Definition**: Social media sentiment, memes, viral content.

### Examples
- X/Twitter threads (non-expert)
- Reddit discussions
- Hacker News comments
- YouTube videos

**Use for**: Early signals, public sentiment, emerging trends
**Don't use for**: Factual claims, technical accuracy

---

## The "Who Actually Built This?" Test

Before trusting any source, ask these questions:

| Question | What It Reveals | Action |
|----------|-----------------|--------|
| Did they build it? | Creators have deepest knowledge | **Priority source** |
| Did they break it? | Security researchers find real limits | **Critical perspective** |
| Did they benchmark it? | Numbers beat opinions | **Data-backed claims** |
| Did they ship with it? | Production reveals edge cases | **Real-world validation** |
| Are they paid to say it? | Sponsored content is biased | **Flag as conflict** |
| Do they cite sources? | Transparent research is trustworthy | **Verify citations** |

---

## Bias Detection Checklist

Every source has bias. The question is whether you can identify and account for it.

### Company Blog / Press Release
- **Bias**: Positive toward company
- **Use for**: Official announcements, roadmap, capabilities
- **Don't use for**: Comparisons, limitations, competitor analysis

### Paid Review / Sponsored Content
- **Bias**: Positive toward sponsor
- **Use for**: Feature overview, use cases
- **Don't use for**: Critical analysis, benchmarks, recommendations

### Affiliate Content
- **Bias**: Recommends products with affiliate links
- **Use for**: Product discovery
- **Don't use for**: Unbiased comparison

### Community Forum / Reddit
- **Bias**: Enthusiasts over-represented
- **Use for**: Edge cases, workarounds, community sentiment
- **Don't use for**: General population preferences

### Academic Paper
- **Bias**: Positive results more likely to be published
- **Use for**: Methodology, rigorous analysis
- **Don't use for**: Real-world applicability (check if replicated)

---

## Cross-Verification Strategy

Never trust a single source for important claims.

### The Triangulation Rule
Every significant claim must be supported by **at least 2 independent sources** from **different tiers**.

**Good triangulation**:
- Tier 1 (official docs) + Tier 2 (expert blog)
- Tier 2 (ML engineer) + Tier 3 (GitHub issue)
- Tier 1 (SEC filing) + Tier 2 (analyst report)

**Bad triangulation**:
- Tier 4 (TechCrunch) + Tier 5 (Twitter thread)
- Tier 4 (Forbes) + Tier 4 (Business Insider)
- Tier 5 (Reddit) + Tier 5 (Hacker News)

### Verification Workflow

```
Claim found in Source A
    ↓
Search for same claim in Source B (different tier)
    ↓
If confirmed → HIGH confidence
If contradicted → Investigate further
If not found → MEDIUM confidence (single source)
```

---

## Source Inventory Template

For every research project, maintain a source inventory:

```
| Source | URL | Tier | Date | Bias | Claims Verified |
|--------|-----|------|------|------|-----------------|
| OpenAI Blog | ... | T1 | 2026-04 | Company + | 3/3 |
| Ars Technica | ... | T4 | 2026-04 | Neutral | 2/3 |
| @karpathy thread | ... | T2 | 2026-04 | Personal | 1/1 |
```

---

## Golden Standard Checklist

Before delivering research:

- [ ] **Tier 1-2 sources** used for factual claims
- [ ] **Tier 1 source** found for core topic (official docs, papers)
- [ ] **Tier 2 sources** found for practical perspective
- [ ] **Tier 3-4 sources** used for context, not facts
- [ ] **Tier 5 sources** used for sentiment only
- [ ] **Bias flagged** for all Tier 4-5 sources
- [ ] **Sponsored content identified**
- [ ] **Contrarian views** from credible sources included
- [ ] **All claims triangulated** (2+ sources)
- [ ] **Source inventory** documented

**If all 10 boxes checked, your research is credible.**
