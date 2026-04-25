# 🧠 Research Methodology

## The Golden Standard 6-Phase Pipeline

### Phase 1: DISCOVERY (Tavily)

**Goal**: Find the best sources, not just the most popular ones.

```
Input: Research query
Output: Curated list of top sources + AI summary

Actions:
- Tavily advanced search with "include_answer: true"
- Extract top 5-10 authoritative URLs
- Capture AI-generated summary for context
- Identify key entities, dates, and themes
```

**Best Practices**:
- Use `search_depth: "advanced"` for research tasks
- Set `include_answer: true` for AI synthesis
- Use `max_results: 10` for broad topics, `5` for narrow ones
- Filter by `time_range` for recency ("day", "week", "month")
- Use `include_domains` to prioritize trusted sources

### Phase 2: DEEP EXTRACTION (Firecrawl)

**Goal**: Extract complete, structured content from discovered sources.

```
Input: URLs from Phase 1
Output: Full structured content from each source

Actions:
- Scrape each URL with onlyMainContent=true
- Use query parameter for targeted extraction
- Handle pagination for list pages
- Extract: title, author, date, key claims, data points
```

**Best Practices**:
- Use `query` parameter for targeted extraction (keeps context lean)
- Set `onlyMainContent: true` to strip nav/ads
- For lists: always ask about pagination in query
- Use `formats: ["markdown"]` for clean text extraction
- For JS-heavy sites: use `interact` tool for clicks/scrolls

### Phase 3: SOCIAL CONTEXT (TwitterAPI.io)

**Goal**: Capture community sentiment, expert opinions, and early signals.

```
Input: Key entities, hashtags, or topics from Phase 1-2
Output: Social sentiment, influencer opinions, trending angles

Actions:
- Advanced search for topic-related tweets
- Get user timelines for key influencers
- Analyze engagement metrics (likes, retweets, replies)
- Extract community sentiment and contrarian views
```

**Best Practices**:
- Use Advanced Search with boolean operators: `from:user`, `to:user`, `#hashtag`
- Filter by `min_retweets`, `min_likes` for quality signals
- Get user timelines for thought leaders on the topic
- Check `verified_followers` for credibility signals
- Use `tweet_thread_context` for deep dives into threads

### Phase 4: SYNTHESIS

**Goal**: Build a unified narrative from all sources.

```
Input: Structured data from all three sources
Output: Unified research document

Actions:
- Cross-reference claims across sources
- Identify consensus vs. dissent
- Build timeline of events (if applicable)
- Map relationships between entities
```

### Phase 5: VERIFICATION

**Goal**: Ensure every claim is backed by evidence.

```
Input: Synthesized research
Output: Fact-checked, confidence-scored report

Actions:
- Verify key claims against 2+ independent sources
- Flag single-source claims
- Check publication dates for recency
- Validate data points with primary sources
```

### Phase 6: OUTPUT

**Goal**: Deliver actionable, well-structured research.

```
Input: Verified research
Output: Golden Standard Research Report

Format:
- Executive Summary (3-5 bullets)
- Key Findings (structured by theme)
- Source Inventory (all sources with URLs, dates, credibility scores)
- Social Context (sentiment, key voices, trending angles)
- Data Points (numbers, dates, quotes — all cited)
- Confidence Assessment (high/medium/low per claim)
- Contrarian Views (dissenting opinions included)
- Recommended Actions (if applicable)
```

## Quality Standards

### The Golden Rules

1. **Triangulation Rule**: Every significant claim must be supported by at least 2 independent sources from different categories (web, social, data).

2. **Recency Rule**:
   - Breaking news: sources from last 24 hours
   - Trending topics: sources from last week
   - Industry analysis: sources from last 3 months
   - Historical context: sources can be older but must be authoritative

3. **Source Credibility Tiers**:
   - Tier 1 (Highest): Official filings, peer-reviewed journals, primary data
   - Tier 2 (High): Major news outlets, established analysts, official blogs
   - Tier 3 (Medium): Industry blogs, influencer threads, community discussions
   - Tier 4 (Context): Social sentiment, anecdotal evidence, opinion pieces

4. **Bias Detection**:
   - Always include contrarian viewpoints
   - Note source affiliations (company blog = biased toward company)
   - Flag single-source claims explicitly
   - Separate facts from opinions

5. **Completeness Checklist**:
   - [ ] All key entities identified and profiled
   - [ ] Timeline established (if applicable)
   - [ ] Data points extracted with units and dates
   - [ ] Social sentiment captured
   - [ ] Contrarian views included
   - [ ] Sources cited with URLs and dates
   - [ ] Confidence levels assigned
   - [ ] No placeholders or guessed data

## Advanced Techniques

### Recursive Deepening
When a source references another important source, automatically follow the link:
1. Extract all URLs from scraped content
2. Filter for relevant domains (exclude social media, ads)
3. Firecrawl the most promising 2-3 URLs
4. Add findings to synthesis

### Sentiment Triangulation
Don't just count positive/negative tweets:
1. Extract tweet text from TwitterAPI.io results
2. Categorize: enthusiastic, cautious, skeptical, hostile
3. Map sentiment to specific claims (not just general topic)

### Temporal Analysis
For time-sensitive research:
1. Tavily: search with time_range filters
2. TwitterAPI.io: search with startDate/endDate
3. Firecrawl: capture `published_date` from each source
4. Build chronological narrative

### Network Mapping
For understanding relationships:
1. TwitterAPI.io: get followers/following of key accounts
2. Tavily: search for partnerships, investments, affiliations
3. Firecrawl: extract "about us", "team", "investors" pages
4. Build relationship graph
