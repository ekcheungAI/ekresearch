# 🏆 EK Research — Golden Standard Research System

> A multi-source research engine combining **Tavily** (discovery), **Firecrawl** (deep extraction), and **TwitterAPI.io** (social intelligence) for world-class research on any topic.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

## The Trinity Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    GOLDEN STANDARD RESEARCH                   │
│                                                               │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│   │   TAVILY     │  │  FIRECRAWL   │  │ TWITTERAPI   │    │
│   │  (Discovery) │  │  (Deep Dive) │  │   (Social)   │    │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│          │                 │                 │             │
│          ▼                 ▼                 ▼             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │           UNIFIED RESEARCH PIPELINE                 │  │
│   │  1. Discovery → 2. Extraction → 3. Synthesis      │  │
│   │  4. Verification → 5. Social Context → 6. Output    │  │
│   └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

```bash
# Node.js 18+ required
node --version  # v18.0.0 or higher

# API Keys (set as environment variables)
export FIRECRAWL_API_KEY="your_key"
export TAVILY_API_KEY="your_key"
export TWITTERAPI_IO_KEY="your_key"
```

### One-Line Research

```bash
# Full Trinity research (all 3 engines)
node scripts/unified-research.mjs "Bitcoin DeFi trends 2026"

# Twitter-only research
node scripts/twitterapi-client.mjs search "AI agents filter:links min_retweets:10"

# Firecrawl agent (deep structured extraction)
node scripts/firecrawl-basic-research.mjs "Get pricing for Vercel"
```

## Architecture

```
ekresearch/
├── scripts/              # Ready-to-use research scripts
│   ├── unified-research.mjs      # Full Trinity pipeline
│   ├── twitterapi-client.mjs     # X/Twitter research tool
│   ├── tavily-research.mjs       # Tavily + Firecrawl combo
│   └── firecrawl-basic-research.mjs  # Basic agent usage
├── skills/               # Research skill definitions
│   ├── golden-standard-research/  # Main research methodology
│   └── firecrawl-web-agent/     # Firecrawl agent docs
├── docs/                 # Documentation
│   ├── methodology.md     # Research framework
│   ├── templates.md       # Research templates by use case
│   └── api-reference.md   # API integration guide
├── .env.example          # Environment variables template
├── package.json           # Dependencies
└── README.md             # This file
```

## Research Methodology

### The 6-Phase Pipeline

| Phase | Engine | Action | Output |
|-------|--------|--------|--------|
| **1. Discovery** | Tavily | Broad search + AI summary | Curated source list |
| **2. Deep Extraction** | Firecrawl | Scrape top sources | Structured content |
| **3. Social Context** | TwitterAPI.io | Sentiment + trends | Community intelligence |
| **4. Synthesis** | All | Cross-reference claims | Unified narrative |
| **5. Verification** | All | Triangulate facts | Confidence scores |
| **6. Output** | All | Format report | Golden Standard Report |

### Research Templates

| Template | Use Case | Example Query |
|----------|----------|---------------|
| **Breaking News** | Trending topics | `"latest AI breakthrough"` |
| **Company Deep Dive** | Product analysis | `"Vercel pricing review 2026"` |
| **Market Research** | Industry sizing | `"vector database market size"` |
| **Financial** | Stock analysis | `"NVDA earnings analyst consensus"` |
| **Competitive** | Compare products | `"Vercel vs Netlify vs Cloudflare"` |
| **Person Research** | Influencer profile | `"@username expertise analysis"` |

## API Keys

| Service | Purpose | Get Key |
|---------|---------|---------|
| **Firecrawl** | Web scraping & extraction | [firecrawl.dev](https://firecrawl.dev) |
| **Tavily** | AI-powered search | [tavily.com](https://tavily.com) |
| **TwitterAPI.io** | X/Twitter data | [twitterapi.io](https://twitterapi.io) |

## Documentation

- [Research Methodology](./docs/methodology.md) — The full 6-phase framework
- [Research Templates](./docs/templates.md) — Pre-built templates by use case
- [API Reference](./docs/api-reference.md) — Integration details for all 3 engines
- [Keyword Strategy](./docs/keyword-strategy.md) — Expand & contract techniques
- [Source Credibility](./docs/source-credibility.md) — Tier system for vetting sources

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-research`)
3. Commit your changes (`git commit -m 'Add amazing research'`)
4. Push to the branch (`git push origin feature/amazing-research`)
5. Open a Pull Request

## License

MIT — see [LICENSE](./LICENSE) for details.

---

Built with 🔥 by the EK Research team.
