#!/usr/bin/env node
/**
 * Basic Firecrawl Web Agent research script
 * Usage: FIRECRAWL_API_KEY=fc-... node firecrawl-basic-research.mjs "your research query"
 */

import { createAgent } from '@firecrawl/agent-core';

const apiKey = process.env.FIRECRAWL_API_KEY || 'fc-b632870979a7489f8d5d56230f1cad01';
const query = process.argv[2] || 'Get the latest news about AI';

async function main() {
  const agent = createAgent({
    firecrawlApiKey: apiKey,
    model: { provider: 'google', model: 'gemini-3-flash-preview' },
  });

  console.log(`🔍 Researching: ${query}\n`);
  
  const result = await agent.run({
    prompt: query,
    format: 'json',
  });

  console.log('📊 Result:');
  console.log(result.text);
  console.log(`\n⏱️  Duration: ${result.durationMs}ms`);
  console.log(`🤖 Model: ${result.model}`);
  console.log(`🔢 Tokens: ${result.usage.totalTokens}`);
}

main().catch(console.error);
