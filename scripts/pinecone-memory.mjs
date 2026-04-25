/**
 * Pinecone Vector Memory Module
 * 
 * Stores research findings as embeddings for semantic search
 * and knowledge retrieval across research sessions.
 * 
 * Uses Pinecone serverless (free tier: 1 pod, 100k vectors)
 */

const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "pcsk_32HjJT_KNCsFeCDjS4tQGEkJhELj93nAh4xs7pd6yK7M9TB9BBnj4q7RP1kMt1MqdfxRUt";
const PINECONE_BASE = "https://api.pinecone.io";

// ─── Index Management ───

/**
 * List all Pinecone indexes
 */
export async function listIndexes() {
  const response = await fetch(`${PINECONE_BASE}/indexes`, {
    headers: {
      "Api-Key": PINECONE_API_KEY,
      "X-Pinecone-API-Version": "2024-10",
    },
  });

  if (!response.ok) {
    throw new Error(`Pinecone error: ${response.status}`);
  }

  const data = await response.json();
  return data.indexes || [];
}

/**
 * Create a new index for research storage
 */
export async function createIndex(name = "ekresearch", dimension = 1536) {
  const body = {
    name,
    dimension,
    metric: "cosine",
    spec: {
      serverless: {
        cloud: "aws",
        region: "us-east-1",
      },
    },
  };

  const response = await fetch(`${PINECONE_BASE}/indexes`, {
    method: "POST",
    headers: {
      "Api-Key": PINECONE_API_KEY,
      "X-Pinecone-API-Version": "2024-10",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json();
    if (err.message?.includes("already exists")) {
      return { message: "Index already exists", name };
    }
    throw new Error(`Pinecone create error: ${err.message || response.status}`);
  }

  return await response.json();
}

/**
 * Get index details
 */
export async function describeIndex(name = "ekresearch") {
  const response = await fetch(`${PINECONE_BASE}/indexes/${name}`, {
    headers: {
      "Api-Key": PINECONE_API_KEY,
      "X-Pinecone-API-Version": "2024-10",
    },
  });

  if (!response.ok) {
    throw new Error(`Pinecone error: ${response.status}`);
  }

  return await response.json();
}

// ─── Vector Operations ───

/**
 * Generate a simple embedding (placeholder — replace with OpenAI or local model)
 * For production, use OpenAI text-embedding-3-small or similar
 */
export function generateEmbedding(text) {
  // Simple hash-based embedding for demo
  // In production, replace with: OpenAI embeddings API
  const words = text.toLowerCase().split(/\s+/);
  const dim = 1536;
  const vec = new Array(dim).fill(0);
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(j);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dim;
    vec[idx] += 1;
  }

  // Normalize
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  if (norm > 0) {
    return vec.map(v => v / norm);
  }
  return vec;
}

/**
 * Store a research finding
 */
export async function storeResearch(id, text, metadata = {}, indexName = "ekresearch") {
  const host = await getIndexHost(indexName);
  const embedding = generateEmbedding(text);

  const response = await fetch(
    `https://${host}/vectors/upsert`,
    {
      method: "POST",
      headers: {
        "Api-Key": PINECONE_API_KEY,
        "X-Pinecone-API-Version": "2024-10",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vectors: [
          {
            id,
            values: embedding,
            metadata: {
              text: text.slice(0, 1000),
              ...metadata,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Pinecone upsert error: ${err.message || response.status}`);
  }

  return { success: true, id };
}

async function getIndexHost(indexName) {
  const response = await fetch(`${PINECONE_BASE}/indexes/${indexName}`, {
    headers: {
      "Api-Key": PINECONE_API_KEY,
      "X-Pinecone-API-Version": "2024-10",
    },
  });

  if (!response.ok) {
    throw new Error(`Pinecone error: ${response.status}`);
  }

  const data = await response.json();
  return data.host;
}

/**
 * Search research findings by semantic similarity
 */
export async function searchResearch(
  query,
  topK = 5,
  indexName = "ekresearch"
  async search(query, topK = 5, indexName = "ekresearch") {
    const host = await this.getIndexHost(indexName);
    const embedding = this.generateEmbedding(query);

    const response = await fetch(
      `https://${host}/query`,
      {
        method: "POST",
        headers: {
          "Api-Key": this.apiKey,
          "X-Pinecone-API-Version": "2024-10",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vector: embedding,
          topK,
          includeMetadata: true,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Pinecone query error: ${err.message || response.status}`);
    }

    const data = await response.json();
    return (data.matches || []).map(m => ({
      id: m.id,
      score: m.score,
      text: m.metadata?.text || "",
      ...m.metadata,
    }));
  }

  async getIndexHost(indexName) {
    const response = await fetch(`${this.baseUrl}/indexes/${indexName}`, {
      headers: {
        "Api-Key": this.apiKey,
        "X-Pinecone-API-Version": "2024-10",
      },
    });

    if (!response.ok) {
      throw new Error(`Pinecone error: ${response.status}`);
    }

    const data = await response.json();
    return data.host;
  }

/**
 * Delete a vector by ID
 */
  async delete(id, indexName = "ekresearch") {
    const host = await this.getIndexHost(indexName);
    const response = await fetch(
      `https://${host}/vectors/delete`,
      {
        method: "POST",
        headers: {
          "Api-Key": this.apiKey,
          "X-Pinecone-API-Version": "2024-10",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [id] }),
      }
    );

    if (!response.ok) {
      throw new Error(`Pinecone delete error: ${response.status}`);
    }

    return { success: true, id };
  }

// ─── Research Memory Management ───

/**
 * Store a complete research finding
 */
export async function storeFinding(finding) {
  const id = `finding_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const text = `${finding.title || ""} ${finding.summary || ""} ${finding.claims?.join(" ") || ""}`;

  return storeResearch(id, text, {
    type: "finding",
    title: finding.title,
    query: finding.query,
    sources: finding.sources?.map(s => s.url).join(", "),
    confidence: finding.confidence,
  });
}

/**
 * Store an academic paper
 */
export async function storePaper(paper) {
  const id = `paper_${paper.doi || paper.id?.replace(/[^a-zA-Z0-9]/g, "_")}`;
  const text = `${paper.title} ${paper.abstract || ""} ${paper.authors?.map(a => a.name).join(" ") || ""}`;

  return storeResearch(id, text, {
    type: "paper",
    title: paper.title,
    authors: paper.authors?.map(a => a.name).join(", "),
    year: paper.year,
    doi: paper.doi,
    citations: paper.citedByCount,
    source_api: paper.source,
  });
}

/**
 * Query past research on a topic
 */
export async function queryMemory(query, topK = 5) {
  const results = await searchResearch(query, topK);
  return results.map(r => ({
    id: r.id,
    relevance: Math.round(r.score * 100),
    text: r.text,
    metadata: Object.fromEntries(
      Object.entries(r).filter(([k]) => !["id", "score", "text"].includes(k))
    ),
  }));
}

// ─── CLI Export ───

if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];

  switch (command) {
    case "init":
      console.log("🌲 Initializing Pinecone index...");
      createIndex()
        .then(r => console.log("✅ Index ready:", r.name || r.message))
        .catch(err => console.error("❌ Error:", err.message));
      break;

    case "list":
      console.log("📋 Listing indexes...");
      listIndexes()
        .then(indexes => {
          for (const idx of indexes) {
            console.log(`  - ${idx.name} (${idx.dimension}d, ${idx.metric})`);
          }
        })
        .catch(err => console.error("❌ Error:", err.message));
      break;

    case "store":
      const text = process.argv[3];
      if (!text) {
        console.log("Usage: node pinecone-memory.mjs store \"text to store\"");
        process.exit(1);
      }
      console.log("💾 Storing research...");
      storeResearch(`mem_${Date.now()}`, text, { type: "manual" })
        .then(r => console.log("✅ Stored:", r.id))
        .catch(err => console.error("❌ Error:", err.message));
      break;

    case "query":
      const query = process.argv[3];
      if (!query) {
        console.log("Usage: node pinecone-memory.mjs query \"search query\"");
        process.exit(1);
      }
      console.log(`🔍 Searching memory for: "${query}"\n`);
      queryMemory(query)
        .then(results => {
          for (const r of results) {
            console.log(`[${r.relevance}%] ${r.text.slice(0, 100)}...`);
            console.log(`     Type: ${r.metadata.type} | ID: ${r.id}`);
            console.log("");
          }
        })
        .catch(err => console.error("❌ Error:", err.message));
      break;

    default:
      console.log(`
Pinecone Memory Module

Commands:
  init              — Create the ekresearch index
  list              — List all indexes
  store "text"      — Store research in memory
  query "question"  — Search past research

Examples:
  node pinecone-memory.mjs init
  node pinecone-memory.mjs store "GPT-4 has 1.76T parameters"
  node pinecone-memory.mjs query "GPT parameter count"
`);
  }
}
