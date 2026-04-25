# 🔑 Keyword Strategy

## The "Expand & Contract" Method

Most people search the exact keyword and get average results. To find the **best** sources, you need to **expand** (broaden) and **contract** (focus) your search terms.

---

## Keyword Expansion (Broaden)

Find related terms, synonyms, and broader concepts.

### Example: GPT Image 2.0

| Base Term | Expanded Variants |
|-----------|-----------------|
| GPT Image 2.0 | "OpenAI image generation model" |
| | "DALL-E successor" |
| | "GPT-4o image capabilities" |
| | "OpenAI visual AI model" |
| | "ChatGPT image generation" |
| | "OpenAI multimodal model" |
| | "AI image model 2026" |

### Example: GPT 5.5 Performance

| Base Term | Expanded Variants |
|-----------|-----------------|
| GPT 5.5 | "OpenAI next generation model" |
| | "GPT-4.5 vs GPT-5 benchmark" |
| | "OpenAI model roadmap 2026" |
| | "Sam Altman GPT announcement" |
| | "OpenAI Orion model" |
| | "next-gen LLM performance" |

### Example: Bitcoin DeFi

| Base Term | Expanded Variants |
|-----------|-----------------|
| Bitcoin DeFi | "BTC layer 2 solutions" |
| | "Bitcoin smart contracts" |
| | "RGB protocol Bitcoin" |
| | "BitVM Bitcoin" |
| | "Bitcoin sidechains" |
| | "Stacks Bitcoin DeFi" |
| | "Bitcoin ordinals DeFi" |

---

## Keyword Contraction (Focus)

Drill down into specific aspects, comparisons, and technical details.

### Example: AI Agents

| Broad Term | Contracted Variants |
|------------|---------------------|
| AI agents | "autonomous agent frameworks 2026" |
| | "LangChain vs AutoGPT vs CrewAI" |
| | "agent orchestration patterns" |
| | "multi-agent systems production" |
| | "AI agent security vulnerabilities" |

### Example: Web Design

| Broad Term | Contracted Variants |
|------------|---------------------|
| web design | "dark mode design system tokens" |
| | "glassmorphism CSS implementation" |
| | "micro-interaction animation patterns" |
| | "responsive grid layout 2026" |
| | "accessibility-first design systems" |

---

## X/Twitter Search Operators

Twitter's search is powerful when you know the operators.

### Basic Operators

```
from:openai              → Tweets from OpenAI official account
to:openai                → Replies sent to OpenAI
@openai                  → Mentions of OpenAI
#OpenAI                  → Hashtag posts
"GPT Image"              → Exact phrase match
GPT Image                → Contains both words (any order)
GPT OR Image             → Contains either word
GPT -Image               → Contains GPT but NOT Image
```

### Advanced Operators

```
"GPT Image" filter:links           → Exact phrase + has link
from:karpathy "image"              → Karpathy talking about image
from:karpathy OR from:ylecun       → Either researcher
"GPT Image" min_retweets:50        → Viral tweets only
"GPT Image" min_likes:200          → Highly liked tweets
#OpenAI lang:en                    → English only
"GPT Image" since:2026-04-01     → After April 1
"GPT Image" until:2026-04-30     → Before April 30
```

### Engagement Filtering

```
min_retweets:10          → At least 10 retweets
min_likes:50             → At least 50 likes
min_replies:5            → At least 5 replies
```

### Content Type Filtering

```
filter:links             → Only tweets with URLs
filter:images            → Only tweets with images
filter:videos            → Only tweets with videos
filter:media             → Only tweets with any media
```

---

## Domain Filtering (Tavily)

Prioritize or exclude specific domains.

### Prioritize Trusted Sources

```json
{
  "api_key": "tvly-...",
  "query": "GPT Image 2.0",
  "include_domains": [
    "openai.com",
    "arxiv.org",
    "github.com",
    "huggingface.co",
    "paperswithcode.com"
  ]
}
```

### Exclude Low-Quality Sources

```json
{
  "api_key": "tvly-...",
  "query": "GPT Image 2.0",
  "exclude_domains": [
    "pinterest.com",
    "quora.com",
    "medium.com"
  ]
}
```

---

## The Viral Signal Detection Strategy

Not all popular content is good. But **viral technical content** usually means someone found something surprising.

### Tier 1: Expert Endorsement
```
from:karpathy OR from:ylecun OR from:goodfellow_ian "GPT Image"
```
→ If top researchers are talking about it, it's significant

### Tier 2: High-Engagement Technical Threads
```
"GPT Image" min_retweets:100 min_likes:500
```
→ Long threads with high engagement = deep analysis

### Tier 3: Early Signals
```
"GPT Image" min_retweets:10
```
→ Low follower count but high engagement ratio = quality content from unknown source

### Tier 4: Link-Backed Claims
```
"GPT Image" filter:links min_retweets:20
```
→ Tweets with links are usually backed by blog posts, papers, or demos

---

## Building a Search Query Matrix

For comprehensive research, build a matrix of queries:

### Example: Researching "GPT Image 2.0"

| Dimension | Query | Purpose |
|-----------|-------|---------|
| **Official** | `from:OpenAI "image"` | Official announcements |
| **Expert** | `from:karpathy "image generation"` | Researcher opinions |
| **Technical** | `"GPT Image" benchmark comparison` | Performance data |
| **Viral** | `"GPT Image" min_retweets:50` | Community reaction |
| **Critical** | `"GPT Image" problem issue limitation` | Contrarian views |
| **Use Case** | `"GPT Image" tutorial example demo` | Practical applications |

---

## Time-Based Research

### For Breaking News
```
"GPT Image" time_range: "day"
```

### For Trend Analysis
```
"GPT Image" time_range: "week"
```

### For Historical Context
```
"GPT Image" time_range: "month"
```

### For Comprehensive Research
```
"GPT Image" (no time filter)
```

---

## Combining Engines

### Tavily + X Combined Strategy

1. **Tavily discovery**: `GPT Image 2.0 OpenAI official`
2. **X expert search**: `from:karpathy OR from:gdb "image generation"`
3. **X viral search**: `"GPT Image" min_retweets:50`
4. **X critical search**: `"GPT Image" problem limitation`
5. **Firecrawl deep dive**: Scrape top 3 Tavily results + top 3 X threads

### Result
You get:
- Official documentation (Tavily → Firecrawl)
- Expert analysis (X search)
- Community sentiment (X viral)
- Known issues (X critical)
- Practical examples (X use cases)

---

## Keyword Expansion Checklist

Before starting research:

- [ ] Listed 5+ synonyms for the base term
- [ ] Identified official accounts/handles
- [ ] Identified 3+ expert voices
- [ ] Built search query matrix (6+ dimensions)
- [ ] Set engagement filters (min_retweets/likes)
- [ ] Set time filters (day/week/month)
- [ ] Planned domain prioritization
- [ ] Prepared contrarian search terms

**If all boxes checked, you'll find sources others miss.**
