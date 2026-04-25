# 🔌 API Reference

## Tavily API

### Search Endpoint

```bash
POST https://api.tavily.com/search
```

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "api_key": "tvly-...",
  "query": "your research query",
  "search_depth": "advanced",
  "include_answer": true,
  "include_images": false,
  "max_results": 10,
  "time_range": "week"
}
```

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `api_key` | string | required | Your Tavily API key |
| `query` | string | required | Search query |
| `search_depth` | string | "basic" | "basic" or "advanced" |
| `include_answer` | boolean | false | Include AI-generated answer |
| `max_results` | number | 5 | Max results (1-20) |
| `time_range` | string | null | "day", "week", "month", "year" |
| `include_domains` | array | null | Prioritize specific domains |
| `exclude_domains` | array | null | Exclude specific domains |

**Response**:
```json
{
  "answer": "AI-generated summary...",
  "query": "your query",
  "results": [
    {
      "title": "Article Title",
      "url": "https://example.com",
      "content": "Snippet...",
      "score": 0.95,
      "published_date": "2026-04-20"
    }
  ]
}
```

---

## Firecrawl API

### Scrape Endpoint

```bash
POST https://api.firecrawl.dev/v1/scrape
```

**Headers**:
```
Content-Type: application/json
Authorization: Bearer fc-...
```

**Body**:
```json
{
  "url": "https://example.com",
  "formats": ["markdown"],
  "onlyMainContent": true,
  "timeout": 30000
}
```

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | string | required | URL to scrape |
| `formats` | array | ["markdown"] | Output formats |
| `onlyMainContent` | boolean | true | Strip nav/ads |
| `timeout` | number | 30000 | Timeout in ms |
| `waitFor` | number | 0 | Wait for JS render |

**Response**:
```json
{
  "success": true,
  "data": {
    "markdown": "# Title\nContent...",
    "html": "<html>...",
    "metadata": {
      "title": "Page Title",
      "description": "Meta description"
    }
  }
}
```

### Search Endpoint

```bash
POST https://api.firecrawl.dev/v1/search
```

**Body**:
```json
{
  "query": "search query",
  "limit": 5
}
```

---

## TwitterAPI.io

### Advanced Search

```bash
GET https://api.twitterapi.io/twitter/tweet/advanced_search
```

**Headers**:
```
x-api-key: YOUR_API_KEY
```

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | required | Search query |
| `queryType` | string | "Latest" | "Latest" or "Top" |
| `startDate` | string | null | YYYY-MM-DD |
| `endDate` | string | null | YYYY-MM-DD |
| `minRetweets` | number | null | Minimum retweets |
| `minLikes` | number | null | Minimum likes |
| `minReplies` | number | null | Minimum replies |

**Response**:
```json
{
  "tweets": [
    {
      "id": "1234567890",
      "text": "Tweet text...",
      "author": {
        "userName": "username",
        "name": "Display Name"
      },
      "likes": 100,
      "retweets": 50,
      "replies": 20,
      "createdAt": "2026-04-25T10:00:00Z",
      "url": "https://x.com/username/status/1234567890"
    }
  ]
}
```

### User Info

```bash
GET https://api.twitterapi.io/twitter/user/info?userName={username}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "id": "44196397",
    "name": "Elon Musk",
    "userName": "elonmusk",
    "followersCount": 180000000,
    "followingCount": 500,
    "statusesCount": 50000,
    "isVerified": true,
    "createdAt": "2009-06-01"
  }
}
```

### User Timeline

```bash
GET https://api.twitterapi.io/twitter/user/last_tweets?userName={username}
```

### Trends

```bash
GET https://api.twitterapi.io/twitter/trends?woeid=1
```

**Note**: `woeid=1` is worldwide. Other WOEIDs available.

---

## X/Twitter Search Operators

| Operator | Example | Description |
|----------|---------|-------------|
| `from:` | `from:openai` | Tweets from user |
| `to:` | `to:openai` | Replies to user |
| `@` | `@openai` | Mentions user |
| `#` | `#AI` | Hashtag |
| `""` | `"GPT Image"` | Exact phrase |
| `filter:links` | `AI filter:links` | Only tweets with links |
| `min_retweets:` | `min_retweets:50` | Minimum retweets |
| `min_likes:` | `min_likes:100` | Minimum likes |
| `lang:` | `AI lang:en` | Language filter |

---

## Error Handling

| Service | Error Code | Meaning | Action |
|---------|------------|---------|--------|
| Tavily | 400 | Invalid parameters | Check request body |
| Tavily | 429 | Rate limited | Wait and retry |
| Firecrawl | 400 | Bad request | Check URL format |
| Firecrawl | 403 | Access denied | URL may block bots |
| Firecrawl | 404 | Page not found | URL may be stale |
| TwitterAPI.io | 400 | Invalid query | Check query syntax |
| TwitterAPI.io | 429 | Rate limited | Reduce request frequency |
| TwitterAPI.io | 500 | Server error | Retry after delay |

## Rate Limits

| Service | Limit | Reset |
|---------|-------|-------|
| Tavily | 100 req/min | Per minute |
| Firecrawl | 500 req/min | Per minute |
| TwitterAPI.io | 1000+ req/sec | Per second |
