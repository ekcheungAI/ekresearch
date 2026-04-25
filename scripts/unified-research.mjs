#!/usr/bin/env node
/**
 * 🏆 Golden Standard Research System — Unified Research Script
 * 
 * Combines Tavily (discovery) + Firecrawl (deep extraction) + TwitterAPI.io (social)
 * into a single, comprehensive research pipeline.
 * 
 * Usage:
 *   FIRECRAWL_API_KEY=fc-... TAVILY_API_KEY=tvly-... TWITTERAPI_IO_KEY=... \
 *     node unified-research.mjs "your research query" [--template=news|company|market|financial|competitive|person]
 */

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY || 'fc-b632870979a7489f8d5d56230f1cad01';
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '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';
const TWITTERAPI_IO_KEY = process.env.TWITTERAPI_IO_KEY || 'new1_bf27f4bde5fb4c84946de020b09ea1ff';

// ─── CONFIG ───
const CONFIG = {
  tavily: {
    deep: true,
    includeAnswer: true,
    maxResults: 10,
    timeRange: 'week', // day, week, month, year
  },
  firecrawl: {
    formats: ['markdown'],
    onlyMainContent: true,
    timeout: 30000,
  },
  twitter: {
    minRetweets: 5,
    minLikes: 20,
    maxTweets: 50,
  }
};

// ─── PHASE 1: TAVILY DISCOVERY ───
async function tavilySearch(query, options = {}) {
  console.log(`🔍 [Phase 1] Tavily discovery: "${query}"`);
  
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      search_depth: options.deep ?? CONFIG.tavily.deep ? 'advanced' : 'basic',
      include_answer: options.includeAnswer ?? CONFIG.tavily.includeAnswer,
      include_images: false,
      max_results: options.maxResults ?? CONFIG.tavily.maxResults,
      time_range: options.timeRange ?? CONFIG.tavily.timeRange,
    }),
  });

  if (!response.ok) throw new Error(`Tavily error: ${response.status}`);
  const data = await response.json();
  
  console.log(`   📚 Found ${data.results?.length || 0} sources`);
  if (data.answer) console.log(`   🤖 AI Summary: ${data.answer.slice(0, 200)}...`);
  
  return {
    query,
    answer: data.answer,
    results: data.results?.map(r => ({
      title: r.title,
      url: r.url,
      content: r.content,
      score: r.score,
      publishedDate: r.published_date,
    })) || [],
  };
}

// ─── PHASE 2: FIRECRAWL DEEP EXTRACTION ───
async function firecrawlScrape(url, options = {}) {
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      url,
      formats: options.formats ?? CONFIG.firecrawl.formats,
      onlyMainContent: options.onlyMainContent ?? CONFIG.firecrawl.onlyMainContent,
      timeout: options.timeout ?? CONFIG.firecrawl.timeout,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Firecrawl error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(`Firecrawl scrape failed: ${data.error || 'unknown'}`);
  }

  return {
    url,
    title: data.data?.metadata?.title || '',
    description: data.data?.metadata?.description || '',
    markdown: data.data?.markdown || '',
    html: data.data?.html || '',
    links: data.data?.links || [],
  };
}

async function deepExtract(urls) {
  console.log(`🔬 [Phase 2] Deep extraction of ${urls.length} sources`);
  const extracted = [];
  
  for (const url of urls) {
    try {
      console.log(`   Scraping: ${url}`);
      const result = await firecrawlScrape(url);
      extracted.push(result);
      console.log(`   ✅ ${result.title || url} (${result.markdown?.length || 0} chars)`);
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`);
    }
  }
  
  return extracted;
}

// ─── PHASE 3: TWITTER SOCIAL CONTEXT ───
async function twitterSearch(query, options = {}) {
  if (!TWITTERAPI_IO_KEY) {
    console.log(`⚠️  [Phase 3] TwitterAPI.io key not set — skipping social context`);
    return null;
  }

  console.log(`🐦 [Phase 3] Twitter social context: "${query}"`);
  
  const params = new URLSearchParams({
    query: query.slice(0, 500),
    ...(options.startDate && { startDate: options.startDate }),
    ...(options.endDate && { endDate: options.endDate }),
    ...(options.minRetweets && { minRetweets: String(options.minRetweets) }),
    ...(options.minLikes && { minLikes: String(options.minLikes) }),
  });

    const response = await fetch(
      `https://api.twitterapi.io/twitter/tweet/advanced-search?${params}`,
      {
        headers: { 'x-api-key': TWITTERAPI_IO_KEY },
      }
    );

  if (!response.ok) {
    console.log(`   ⚠️ Twitter search failed: ${response.status}`);
    return null;
  }

  const data = await response.json();
  const tweets = data.tweets || [];
  
  console.log(`   📊 Found ${tweets.length} tweets`);
  
  // Calculate sentiment metrics
  const totalLikes = tweets.reduce((sum, t) => sum + (t.likes || 0), 0);
  const totalRetweets = tweets.reduce((sum, t) => sum + (t.retweets || 0), 0);
  const totalReplies = tweets.reduce((sum, t) => sum + (t.replies || 0), 0);
  
  return {
    query,
    tweetCount: tweets.length,
    totalEngagement: { likes: totalLikes, retweets: totalRetweets, replies: totalReplies },
    topTweets: tweets.slice(0, 5).map(t => ({
      text: t.text?.slice(0, 200),
      author: t.author?.userName,
      likes: t.likes,
      retweets: t.retweets,
      createdAt: t.createdAt,
      url: t.url,
    })),
    hashtags: extractHashtags(tweets),
    mentions: extractMentions(tweets),
  };
}

function extractHashtags(tweets) {
  const tagCounts = {};
  for (const tweet of tweets) {
    const tags = tweet.text?.match(/#\w+/g) || [];
    for (const tag of tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
}

function extractMentions(tweets) {
  const mentionCounts = {};
  for (const tweet of tweets) {
    const mentions = tweet.text?.match(/@\w+/g) || [];
    for (const m of mentions) {
      mentionCounts[m] = (mentionCounts[m] || 0) + 1;
    }
  }
  return Object.entries(mentionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([mention, count]) => ({ mention, count }));
}

// ─── PHASE 4: SYNTHESIS ───
function synthesize(tavilyData, firecrawlData, twitterData) {
  console.log(`🧠 [Phase 4] Synthesizing research...`);
  
  const sources = firecrawlData.map(d => ({
    url: d.url,
    title: d.title,
    description: d.description,
    contentLength: d.markdown?.length || 0,
  }));

  const keyClaims = extractKeyClaims(firecrawlData);
  
  return {
    query: tavilyData.query,
    aiSummary: tavilyData.answer,
    sourceCount: sources.length,
    sources,
    keyClaims,
    socialContext: twitterData ? {
      tweetVolume: twitterData.tweetCount,
      engagement: twitterData.totalEngagement,
      topHashtags: twitterData.hashtags,
      topMentions: twitterData.mentions,
      topTweets: twitterData.topTweets,
    } : null,
    confidence: calculateConfidence(sources.length, keyClaims.length, twitterData),
  };
}

function extractKeyClaims(extractedData) {
  // Simple extraction: look for sentences with numbers, dates, or strong assertions
  const claims = [];
  for (const data of extractedData) {
    if (!data.markdown) continue;
    const sentences = data.markdown.split(/[.!?]+/).filter(s => s.length > 50);
    for (const sentence of sentences.slice(0, 20)) {
      // Look for sentences with numbers, percentages, dollar signs, or dates
      if (/\d|%|\$|20\d\d|billion|million|thousand/i.test(sentence)) {
        claims.push({
          text: sentence.trim().slice(0, 200),
          source: data.url,
          sourceTitle: data.title,
        });
      }
    }
  }
  return claims.slice(0, 15); // Top 15 claims
}

function calculateConfidence(sourceCount, claimCount, twitterData) {
  let score = 0;
  if (sourceCount >= 3) score += 3;
  else if (sourceCount >= 2) score += 2;
  else score += 1;
  
  if (claimCount >= 10) score += 2;
  else if (claimCount >= 5) score += 1;
  
  if (twitterData && twitterData.tweetCount > 20) score += 2;
  else if (twitterData) score += 1;
  
  if (score >= 6) return 'HIGH';
  if (score >= 4) return 'MEDIUM';
  return 'LOW';
}

// ─── PHASE 5: OUTPUT ───
function formatReport(research) {
  const report = {
    metadata: {
      query: research.query,
      generatedAt: new Date().toISOString(),
      confidence: research.confidence,
      sourceCount: research.sourceCount,
    },
    executiveSummary: research.aiSummary,
    keyFindings: research.keyClaims.map((claim, i) => ({
      id: i + 1,
      claim: claim.text,
      source: claim.source,
      sourceTitle: claim.sourceTitle,
    })),
    sources: research.sources,
    socialContext: research.socialContext,
    qualityAssessment: {
      confidence: research.confidence,
      triangulation: research.sourceCount >= 2 ? 'YES' : 'NO',
      socialCoverage: research.socialContext ? 'YES' : 'NO',
      goldenStandard: research.confidence === 'HIGH' && research.sourceCount >= 3,
    },
  };
  
  return report;
}

function printReport(report) {
  console.log('\n' + '='.repeat(70));
  console.log('🏆 GOLDEN STANDARD RESEARCH REPORT');
  console.log('='.repeat(70));
  console.log(`Query: ${report.metadata.query}`);
  console.log(`Generated: ${report.metadata.generatedAt}`);
  console.log(`Confidence: ${report.metadata.confidence}`);
  console.log(`Sources: ${report.metadata.sourceCount}`);
  console.log(`Golden Standard: ${report.qualityAssessment.goldenStandard ? '✅ YES' : '❌ NO'}`);
  console.log('\n' + '-'.repeat(70));
  console.log('EXECUTIVE SUMMARY');
  console.log('-'.repeat(70));
  console.log(report.executiveSummary || 'No AI summary available.');
  
  console.log('\n' + '-'.repeat(70));
  console.log(`KEY FINDINGS (${report.keyFindings.length})`);
  console.log('-'.repeat(70));
  for (const finding of report.keyFindings) {
    console.log(`\n${finding.id}. ${finding.claim}`);
    console.log(`   📎 ${finding.sourceTitle || finding.source}`);
  }
  
  if (report.socialContext) {
    console.log('\n' + '-'.repeat(70));
    console.log('SOCIAL CONTEXT (X/Twitter)');
    console.log('-'.repeat(70));
    console.log(`Tweet Volume: ${report.socialContext.tweetVolume}`);
    console.log(`Engagement: ${JSON.stringify(report.socialContext.engagement)}`);
    console.log(`Top Hashtags: ${report.socialContext.topHashtags.map(h => h.tag).join(', ')}`);
  }
  
  console.log('\n' + '-'.repeat(70));
  console.log('SOURCE INVENTORY');
  console.log('-'.repeat(70));
  for (const source of report.sources) {
    console.log(`• ${source.title || 'Untitled'}`);
    console.log(`  ${source.url}`);
  }
  
  console.log('\n' + '='.repeat(70));
}

// ─── MAIN ───
async function main() {
  const query = process.argv[2];
  if (!query) {
    console.log('Usage: node unified-research.mjs "your research query"');
    process.exit(1);
  }

  console.log('🏆 Starting Golden Standard Research...\n');

  try {
    // Phase 1: Discovery
    const tavilyData = await tavilySearch(query);
    
    // Phase 2: Deep Extraction (top 5 URLs)
    const topUrls = tavilyData.results.slice(0, 5).map(r => r.url);
    const firecrawlData = await deepExtract(topUrls);
    
    // Phase 3: Social Context
    const twitterData = await twitterSearch(query, {
      minRetweets: CONFIG.twitter.minRetweets,
      minLikes: CONFIG.twitter.minLikes,
    });
    
    // Phase 4: Synthesis
    const research = synthesize(tavilyData, firecrawlData, twitterData);
    
    // Phase 5: Output
    const report = formatReport(research);
    printReport(report);
    
    // Also save JSON
    const fs = await import('fs');
    const filename = `research-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved to: ${filename}`);
    
  } catch (err) {
    console.error('❌ Research failed:', err.message);
    process.exit(1);
  }
}

main();
