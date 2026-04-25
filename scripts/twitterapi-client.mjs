#!/usr/bin/env node
/**
 * TwitterAPI.io Client Module
 * Standalone client for X/Twitter data extraction
 * 
 * Usage:
 *   TWITTERAPI_IO_KEY=your_key node twitterapi-client.mjs <command> [args]
 * 
 * Commands:
 *   search <query>          Advanced tweet search
 *   user <username>         Get user info + timeline
 *   timeline <username>       Get user's recent tweets
 *   followers <username>    Get user's followers
 *   following <username>    Get user's following
 *   mentions <username>     Get mentions of user
 *   trends                  Get trending topics
 *   tweet <tweetId>         Get tweet by ID + replies
 *   thread <tweetId>        Get full thread context
 * 
 * Examples:
 *   TWITTERAPI_IO_KEY=xxx node twitterapi-client.mjs search "AI agents filter:links min_retweets:10"
 *   TWITTERAPI_IO_KEY=xxx node twitterapi-client.mjs user elonmusk
 *   TWITTERAPI_IO_KEY=xxx node twitterapi-client.mjs trends
 */

const API_KEY = process.env.TWITTERAPI_IO_KEY || 'new1_bf27f4bde5fb4c84946de020b09ea1ff';
const BASE_URL = 'https://api.twitterapi.io';

if (!API_KEY) {
  console.error('❌ TWITTERAPI_IO_KEY environment variable required');
  process.exit(1);
}

// ─── API CLIENT ───
async function api(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    headers: { 'x-api-key': API_KEY },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  return response.json();
}

// ─── COMMANDS ───
const commands = {
  async search(query, options = {}) {
    console.log(`🔍 Searching: "${query}"`);
    const data = await api('/twitter/tweet/advanced_search', {
      query,
      queryType: options.queryType || 'Latest',
      startDate: options.startDate,
      endDate: options.endDate,
      minRetweets: options.minRetweets || 5,
      minLikes: options.minLikes || 20,
      minReplies: options.minReplies,
    });

    const tweets = data.tweets || [];
    console.log(`\n📊 Results: ${tweets.length} tweets\n`);

    for (const tweet of tweets.slice(0, 10)) {
      console.log('─'.repeat(60));
      console.log(`👤 @${tweet.author?.userName} | ${tweet.createdAt}`);
      console.log(`📝 ${tweet.text?.slice(0, 200)}${tweet.text?.length > 200 ? '...' : ''}`);
      console.log(`❤️ ${tweet.likes || 0} | 🔄 ${tweet.retweets || 0} | 💬 ${tweet.replies || 0}`);
      if (tweet.url) console.log(`🔗 ${tweet.url}`);
    }

    // Summary stats
    const totalLikes = tweets.reduce((s, t) => s + (t.likes || 0), 0);
    const totalRTs = tweets.reduce((s, t) => s + (t.retweets || 0), 0);
    console.log(`\n📈 Total Engagement: ❤️ ${totalLikes} | 🔄 ${totalRTs}`);

    return data;
  },

  async user(username) {
    console.log(`👤 Getting user: @${username}`);
    const result = await api('/twitter/user/info', { userName: username });
    const user = result.data || result;
    console.log(`\n📋 Profile:`);
    console.log(`  Name: ${user.name || 'N/A'}`);
    console.log(`  Bio: ${(user.description || '').slice(0, 100)}`);
    console.log(`  Followers: ${(user.followersCount || 0).toLocaleString()}`);
    console.log(`  Following: ${(user.followingCount || 0).toLocaleString()}`);
    console.log(`  Tweets: ${(user.statusesCount || 0).toLocaleString()}`);
    console.log(`  Verified: ${user.isVerified ? '✅' : '❌'}`);
    console.log(`  Created: ${user.createdAt || 'N/A'}`);

    // Get recent tweets
    console.log(`\n🐦 Recent Tweets:`);
    const timeline = await api('/twitter/user/last_tweets', { userName: username });
    for (const tweet of (timeline.tweets || []).slice(0, 5)) {
      console.log(`  • ${(tweet.text || '').slice(0, 80)}... (❤️ ${tweet.likes || 0})`);
    }

    return { user, timeline };
  },

  async timeline(username) {
    console.log(`🐦 Timeline for @${username}`);
    const data = await api('/twitter/user/timeline', { userName: username });
    const tweets = data.tweets || [];
    
    for (const tweet of tweets.slice(0, 10)) {
      console.log('─'.repeat(60));
      console.log(`${tweet.createdAt}`);
      console.log(`${tweet.text}`);
      console.log(`❤️ ${tweet.likes || 0} | 🔄 ${tweet.retweets || 0}`);
    }
    
    return data;
  },

  async followers(username) {
    console.log(`👥 Followers of @${username}`);
    const data = await api('/twitter/user/followers', { userName: username });
    const users = data.users || [];
    
    console.log(`\nFound ${users.length} followers:\n`);
    for (const user of users.slice(0, 10)) {
      console.log(`  • @${user.userName} — ${user.name} (${user.followersCount?.toLocaleString()} followers)`);
    }
    
    return data;
  },

  async following(username) {
    console.log(`👥 @${username} is following:`);
    const data = await api('/twitter/user/followings', { userName: username });
    const users = data.users || [];
    
    for (const user of users.slice(0, 10)) {
      console.log(`  • @${user.userName} — ${user.name}`);
    }
    
    return data;
  },

  async mentions(username) {
    console.log(`💬 Mentions of @${username}`);
    const data = await api('/twitter/user/mentions', { userName: username });
    const tweets = data.tweets || [];
    
    for (const tweet of tweets.slice(0, 10)) {
      console.log(`  • @${tweet.author?.userName}: ${tweet.text?.slice(0, 80)}...`);
    }
    
    return data;
  },

  async trends() {
    console.log(`🔥 Trending Topics`);
    const data = await api('/twitter/trends', { woeid: '1' });  // 1 = worldwide
    const trends = data.trends || [];
    
    for (const trend of trends.slice(0, 15)) {
      const t = trend.trend || trend;
      console.log(`  ${t.rank || '?'}. ${t.name} (${t.tweetCount?.toLocaleString() || 'N/A'} tweets)`);
    }
    
    return data;
  },

  async tweet(tweetId) {
    console.log(`📝 Tweet: ${tweetId}`);
    const data = await api('/twitter/tweets', { tweet_ids: tweetId });
    const tweet = data.tweets?.[0];
    
    if (!tweet) {
      console.log('Tweet not found');
      return null;
    }

    console.log(`\n@${tweet.author?.userName}:`);
    console.log(`${tweet.text}`);
    console.log(`\n❤️ ${tweet.likes || 0} | 🔄 ${tweet.retweets || 0} | 💬 ${tweet.replies || 0}`);
    console.log(`📅 ${tweet.createdAt}`);

    // Get replies
    console.log(`\n💬 Replies:`);
    try {
      const replies = await api('/twitter/tweets/replies', { tweetId });
      for (const reply of (replies.tweets || []).slice(0, 5)) {
        console.log(`  @${reply.author?.userName}: ${reply.text?.slice(0, 80)}...`);
      }
    } catch {
      console.log('  (No replies loaded)');
    }

    return tweet;
  },

  async thread(tweetId) {
    console.log(`🧵 Thread context for: ${tweetId}`);
    const data = await api('/twitter/tweets/thread-context', { tweetId });
    const tweets = data.tweets || [];
    
    console.log(`\nThread has ${tweets.length} tweets:\n`);
    for (const tweet of tweets) {
      console.log('─'.repeat(60));
      console.log(`@${tweet.author?.userName} | ${tweet.createdAt}`);
      console.log(`${tweet.text?.slice(0, 150)}...`);
    }
    
    return data;
  },
};

// ─── CLI ───
async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  
  if (!cmd || cmd === 'help') {
    console.log(`
TwitterAPI.io Client

Commands:
  search <query>       Advanced tweet search
  user <username>      Get user profile + recent tweets
  timeline <username>  Get full timeline
  followers <username> Get followers list
  following <username> Get following list
  mentions <username>  Get mentions
  trends               Get trending topics
  tweet <id>           Get tweet + replies
  thread <id>          Get thread context

Environment:
  TWITTERAPI_IO_KEY    Your API key (required)

Examples:
  TWITTERAPI_IO_KEY=xxx node twitterapi-client.mjs search "AI agents"
  TWITTERAPI_IO_KEY=xxx node twitterapi-client.mjs user elonmusk
  TWITTERAPI_IO_KEY=xxx node twitterapi-client.mjs trends
`);
    return;
  }

  const handler = commands[cmd];
  if (!handler) {
    console.error(`Unknown command: ${cmd}`);
    console.error('Run with no args for help');
    process.exit(1);
  }

  try {
    await handler(args[0], { 
      startDate: process.env.START_DATE,
      endDate: process.env.END_DATE,
      minRetweets: process.env.MIN_RETWEETS,
      minLikes: process.env.MIN_LIKES,
    });
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
