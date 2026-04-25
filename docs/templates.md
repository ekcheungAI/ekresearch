# 📋 Research Templates

Pre-built research templates for common use cases. Each template specifies the exact pipeline configuration.

## Template A: Breaking News / Trending Topic

**Use Case**: Real-time events, product launches, viral trends

**Pipeline**:
```
Phase 1: Tavily search (time_range: "day", max_results: 10)
Phase 2: Firecrawl top 3 news sources
Phase 3: TwitterAPI.io search topic hashtag, filter min_retweets: 20
Phase 4: Synthesize timeline of events
Phase 5: Verify key facts against 2+ sources
```

**Output**: Executive summary + timeline + social sentiment

**Example**:
```bash
node scripts/unified-research.mjs "OpenAI GPT Image 2 launch"
```

---

## Template B: Company / Product Deep Dive

**Use Case**: Product analysis, competitive positioning, pricing research

**Pipeline**:
```
Phase 1: Tavily search company name + "review" + "analysis"
Phase 2: Firecrawl company website, pricing page, about page
Phase 3: TwitterAPI.io search company handle, CEO handle, #companyname
Phase 4: Synthesize: positioning, pricing, public sentiment, competitive landscape
Phase 5: Verify financial claims against official sources
```

**Output**: Company profile + sentiment analysis + competitive positioning

**Example**:
```bash
node scripts/unified-research.mjs "Vercel pricing review 2026"
```

---

## Template C: Industry / Market Research

**Use Case**: Market sizing, trend analysis, competitive landscape

**Pipeline**:
```
Phase 1: Tavily search "industry report 2026" + "market size" + "trends"
Phase 2: Firecrawl 3-5 authoritative reports
Phase 3: TwitterAPI.io search industry hashtag, key influencer timelines
Phase 4: Synthesize: market size, growth rate, key players, trends
Phase 5: Cross-reference market size claims
```

**Output**: Market overview + player analysis + trend forecast

**Example**:
```bash
node scripts/unified-research.mjs "vector database market size 2026"
```

---

## Template D: Investment / Financial Research

**Use Case**: Stock analysis, earnings research, analyst consensus

**Pipeline**:
```
Phase 1: Tavily search ticker + "earnings" + "analyst"
Phase 2: Firecrawl SEC filing, Yahoo Finance analyst page
Phase 3: TwitterAPI.io search $TICKER, fintwit influencers
Phase 4: Synthesize: financials, analyst consensus, social sentiment
Phase 5: Verify numbers against SEC filings (source of truth)
```

**Output**: Financial profile + analyst ratings + sentiment gauge

**Example**:
```bash
node scripts/unified-research.mjs "NVDA earnings analyst consensus"
```

---

## Template E: Competitive Analysis

**Use Case**: Compare products head-to-head

**Pipeline**:
```
Phase 1: Tavily search "top [category] tools 2026" + "comparison"
Phase 2: Firecrawl each competitor's pricing, features, docs
Phase 3: TwitterAPI.io search each competitor's handle + sentiment
Phase 4: Synthesize: feature matrix, pricing comparison, sentiment ranking
Phase 5: Verify feature claims against official docs
```

**Output**: Comparison matrix + sentiment ranking + recommendation

**Example**:
```bash
node scripts/unified-research.mjs "Vercel vs Netlify vs Cloudflare Pages"
```

---

## Template F: Person / Influencer Research

**Use Case**: Profile analysis, credibility check, content themes

**Pipeline**:
```
Phase 1: Tavily search person name + "background" + "interview"
Phase 2: Firecrawl personal website, LinkedIn, published articles
Phase 3: TwitterAPI.io get user timeline, follower analysis, engagement stats
Phase 4: Synthesize: background, expertise areas, influence metrics, content themes
Phase 5: Verify credentials against official sources
```

**Output**: Profile + influence score + content analysis

**Example**:
```bash
node scripts/twitterapi-client.mjs user elonmusk
node scripts/unified-research.mjs "Sam Altman background OpenAI"
```

---

## Template G: Design System Research

**Use Case**: Find best-in-class design patterns, components, systems

**Pipeline**:
```
Phase 1: Tavily search "awwwards [topic]" + "site:dribbble.com"
Phase 2: Firecrawl award-winning case studies
Phase 3: Firecrawl design system documentation (Apple, Google, Vercel)
Phase 4: TwitterAPI.io search designer threads with high engagement
Phase 5: Firecrawl Figma community files or design tool blogs
```

**Output**: Design examples + system documentation + community favorites

**Example**:
```bash
node scripts/unified-research.mjs "dark mode design system 2026 awwwards"
```

---

## Template H: Technology Deep Dive

**Use Case**: Evaluate new frameworks, tools, protocols

**Pipeline**:
```
Phase 1: Tavily search "[technology] documentation" + "github" + "benchmark"
Phase 2: Firecrawl official docs, GitHub README, benchmark results
Phase 3: TwitterAPI.io search core maintainer accounts + #technology
Phase 4: Firecrawl 2-3 technical blog posts with benchmarks
Phase 5: Verify claims against official docs
```

**Output**: Technical profile + benchmark comparison + community adoption

**Example**:
```bash
node scripts/unified-research.mjs "Rust vs Go performance benchmark 2026"
```
