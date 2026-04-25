/**
 * Academic Research Module — OpenAlex + Semantic Scholar Integration
 * 
 * Provides peer-reviewed paper discovery, citation analysis, and
 * academic source extraction for the Golden Standard Research System.
 * 
 * APIs:
 *   - OpenAlex: Free, no key needed (polite user-agent required)
 *   - Semantic Scholar: Free tier (rate limited)
 *   - Crossref: Free, no key needed
 */

const OPENALEX_BASE = "https://api.openalex.org";
const SEMANTIC_SCHOLAR_BASE = "https://api.semanticscholar.org/graph/v1";
const CROSSREF_BASE = "https://api.crossref.org";

// ─── OpenAlex API ───

/**
 * Search for academic papers on OpenAlex
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Object[]>} Array of paper objects
 */
export async function openalexSearch(query, options = {}) {
  const params = new URLSearchParams({
    search: query,
    "per-page": String(options.limit || 10),
    page: String(options.page || 1),
    ...(options.fromYear && { "filter": `from_publication_date:${options.fromYear}-01-01` }),
    ...(options.toYear && { "filter": `to_publication_date:${options.toYear}-12-31` }),
    ...(options.openAccess && { "filter": "has_open_access:true" }),
  });

  const url = `${OPENALEX_BASE}/works?${params}`;
  
  const response = await fetch(url, {
    headers: {
      "User-Agent": "EKResearch/1.0 (mailto:ek@ekcheung.com)",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`OpenAlex error: ${response.status}`);
  }

  const data = await response.json();
  return (data.results || []).map(normalizeOpenAlexPaper);
}

/**
 * Get a single work by ID from OpenAlex
 */
export async function openalexGetWork(workId) {
  const url = `${OPENALEX_BASE}/works/${workId}`;
  
  const response = await fetch(url, {
    headers: {
      "User-Agent": "EKResearch/1.0 (mailto:ek@ekcheung.com)",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`OpenAlex error: ${response.status}`);
  }

  const data = await response.json();
  return normalizeOpenAlexPaper(data);
}

/**
 * Get author information from OpenAlex
 */
export async function openalexGetAuthor(authorId) {
  const url = `${OPENALEX_BASE}/authors/${authorId}`;
  
  const response = await fetch(url, {
    headers: {
      "User-Agent": "EKResearch/1.0 (mailto:ek@ekcheung.com)",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`OpenAlex error: ${response.status}`);
  }

  return await response.json();
}

function normalizeOpenAlexPaper(raw) {
  const authors = (raw.authorships || []).map(a => ({
    name: a.author?.display_name || "Unknown",
    orcid: a.author?.orcid || null,
    institutions: (a.institutions || []).map(i => i.display_name),
  }));

  const primaryLocation = raw.primary_location || {};
  const source = primaryLocation.source || {};

  return {
    id: raw.id,
    doi: raw.doi,
    title: raw.display_name,
    abstract: raw.abstract,
    authors,
    year: raw.publication_year,
    citedByCount: raw.cited_by_count || 0,
    concepts: (raw.concepts || []).map(c => c.display_name),
    openAccess: raw.open_access?.is_oa || false,
    openAccessUrl: raw.open_access?.oa_url || null,
    pdfUrl: primaryLocation.pdf_url || null,
    landingPageUrl: primaryLocation.landing_page_url || null,
    journal: source.display_name,
    type: raw.type,
    source: "openalex",
    raw,
  };
}

// ─── Semantic Scholar API ───

/**
 * Search for papers on Semantic Scholar
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Object[]>} Array of paper objects
 */
export async function semanticScholarSearch(query, options = {}) {
  const fields = [
    "title",
    "authors",
    "year",
    "citationCount",
    "referenceCount",
    "abstract",
    "venue",
    "publicationTypes",
    "openAccessPdf",
    "externalIds",
  ].join(",");

  const params = new URLSearchParams({
    query,
    fields,
    limit: String(options.limit || 10),
    ...(options.fromYear && { "publicationDateOrYear": `${options.fromYear}:2026` }),
  });

  const url = `${SEMANTIC_SCHOLAR_BASE}/paper/search?${params}`;
  
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Semantic Scholar rate limit exceeded. Wait a few seconds and retry.");
    }
    throw new Error(`Semantic Scholar error: ${response.status}`);
  }

  const data = await response.json();
  return (data.data || []).map(normalizeSemanticScholarPaper);
}

/**
 * Get paper details by ID
 */
export async function semanticScholarGetPaper(paperId) {
  const fields = [
    "title",
    "authors",
    "year",
    "citationCount",
    "referenceCount",
    "abstract",
    "venue",
    "publicationTypes",
    "openAccessPdf",
    "externalIds",
    "citations",
    "references",
  ].join(",");

  const url = `${SEMANTIC_SCHOLAR_BASE}/paper/${paperId}?fields=${fields}`;
  
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Semantic Scholar error: ${response.status}`);
  }

  const data = await response.json();
  return normalizeSemanticScholarPaper(data);
}

function normalizeSemanticScholarPaper(raw) {
  return {
    id: raw.paperId || raw.externalIds?.DOI,
    doi: raw.externalIds?.DOI,
    title: raw.title,
    abstract: raw.abstract,
    authors: (raw.authors || []).map(a => ({
      name: a.name,
      authorId: a.authorId,
    })),
    year: raw.year,
    citedByCount: raw.citationCount || 0,
    referenceCount: raw.referenceCount || 0,
    venue: raw.venue,
    publicationTypes: raw.publicationTypes || [],
    openAccessPdf: raw.openAccessPdf?.url || null,
    source: "semantic_scholar",
    raw,
  };
}

// ─── Crossref API ───

/**
 * Search for DOIs and metadata on Crossref
 */
export async function crossrefSearch(query, options = {}) {
  const params = new URLSearchParams({
    query,
    rows: String(options.limit || 10),
    ...(options.fromYear && { "filter": `from-pub-date:${options.fromYear}` }),
    ...(options.toYear && { "filter": `until-pub-date:${options.toYear}` }),
  });

  const url = `${CROSSREF_BASE}/works?${params}`;
  
  const response = await fetch(url, {
    headers: {
      "User-Agent": "EKResearch/1.0 (mailto:ek@ekcheung.com)",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Crossref error: ${response.status}`);
  }

  const data = await response.json();
  return (data.message?.items || []).map(normalizeCrossrefWork);
}

/**
 * Get work by DOI
 */
export async function crossrefGetDoi(doi) {
  const url = `${CROSSREF_BASE}/works/${encodeURIComponent(doi)}`;
  
  const response = await fetch(url, {
    headers: {
      "User-Agent": "EKResearch/1.0 (mailto:ek@ekcheung.com)",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Crossref error: ${response.status}`);
  }

  const data = await response.json();
  return normalizeCrossrefWork(data.message);
}

function normalizeCrossrefWork(raw) {
  const authors = (raw.author || []).map(a => ({
    name: [a.given, a.family].filter(Boolean).join(" "),
    orcid: a.ORCID,
    affiliation: (a.affiliation || []).map(af => af.name),
  }));

  return {
    id: raw.DOI,
    doi: raw.DOI,
    title: raw.title?.[0],
    authors,
    year: raw.published?.["date-parts"]?.[0]?.[0] || raw.created?.["date-parts"]?.[0]?.[0],
    journal: raw["container-title"]?.[0],
    type: raw.type,
    page: raw.page,
    volume: raw.volume,
    issue: raw.issue,
    url: raw.URL,
    source: "crossref",
    raw,
  };
}

// ─── Unified Academic Search ───

/**
 * Search across all academic APIs and merge results
 */
export async function academicSearch(query, options = {}) {
  const results = {
    query,
    sources: {},
    papers: [],
    stats: {},
  };

  // Search OpenAlex (always works, no key needed)
  try {
    const openalexResults = await openalexSearch(query, options);
    results.sources.openalex = openalexResults.length;
    results.papers.push(...openalexResults);
  } catch (err) {
    results.sources.openalex = `Error: ${err.message}`;
  }

  // Search Semantic Scholar (may rate limit)
  try {
    const ssResults = await semanticScholarSearch(query, { ...options, limit: Math.min(options.limit || 10, 5) });
    results.sources.semantic_scholar = ssResults.length;
    results.papers.push(...ssResults);
  } catch (err) {
    results.sources.semantic_scholar = `Error: ${err.message}`;
  }

  // Deduplicate by DOI
  const seen = new Set();
  results.papers = results.papers.filter(p => {
    const key = p.doi || p.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by citation count
  results.papers.sort((a, b) => (b.citedByCount || 0) - (a.citedByCount || 0));

  // Stats
  results.stats = {
    total: results.papers.length,
    openAccess: results.papers.filter(p => p.openAccess || p.openAccessPdf).length,
    withAbstract: results.papers.filter(p => p.abstract).length,
    avgCitations: Math.round(
      results.papers.reduce((s, p) => s + (p.citedByCount || 0), 0) / results.papers.length
    ) || 0,
    yearRange: {
      min: Math.min(...results.papers.map(p => p.year).filter(Boolean)),
      max: Math.max(...results.papers.map(p => p.year).filter(Boolean)),
    },
  };

  return results;
}

// ─── Citation Formatting ───

/**
 * Format a paper as APA citation
 */
export function formatAPA(paper) {
  const authors = (paper.authors || [])
    .map(a => {
      const name = a.name || "";
      const parts = name.split(" ");
      if (parts.length > 1) {
        const last = parts[parts.length - 1];
        const initials = parts.slice(0, -1).map(p => p[0]).join(".");
        return `${last}, ${initials}.`;
      }
      return name;
    })
    .join(", ");

  const year = paper.year || "n.d.";
  const title = paper.title || "Untitled";
  const journal = paper.journal || paper.venue || "";
  const doi = paper.doi ? `https://doi.org/${paper.doi}` : "";

  if (journal) {
    return `${authors} (${year}). ${title}. *${journal}*. ${doi}`;
  }
  return `${authors} (${year}). ${title}. ${doi}`;
}

/**
 * Format a paper as BibTeX entry
 */
export function formatBibTeX(paper) {
  const key = paper.doi || paper.id?.split("/").pop() || "unknown";
  const authors = (paper.authors || [])
    .map(a => a.name)
    .join(" and ");
  const year = paper.year || "n.d.";
  const title = paper.title || "Untitled";
  const journal = paper.journal || paper.venue || "";

  let entry = `@article{${key},\n`;
  entry += `  title = {${title}},\n`;
  entry += `  author = {${authors}},\n`;
  entry += `  year = {${year}},\n`;
  if (journal) entry += `  journal = {${journal}},\n`;
  if (paper.doi) entry += `  doi = {${paper.doi}},\n`;
  if (paper.url) entry += `  url = {${paper.url}},\n`;
  entry += `}`;

  return entry;
}

// ─── CLI Export ───

if (import.meta.url === `file://${process.argv[1]}`) {
  const query = process.argv[2];
  if (!query) {
    console.log("Usage: node academic-research.mjs \"your research query\"");
    process.exit(1);
  }

  console.log(`🔬 Academic Research: "${query}"\n`);

  academicSearch(query, { limit: 10 })
    .then(results => {
      console.log(`📊 Found ${results.stats.total} papers`);
      console.log(`   Open Access: ${results.stats.openAccess}`);
      console.log(`   With Abstract: ${results.stats.withAbstract}`);
      console.log(`   Avg Citations: ${results.stats.avgCitations}`);
      console.log(`   Year Range: ${results.stats.yearRange.min}-${results.stats.yearRange.max}`);
      console.log("");

      console.log("📚 Top Papers:\n");
      for (let i = 0; i < Math.min(5, results.papers.length); i++) {
        const p = results.papers[i];
        console.log(`${i + 1}. ${p.title}`);
        console.log(`   Authors: ${p.authors.map(a => a.name).join(", ")}`);
        console.log(`   Year: ${p.year} | Citations: ${p.citedByCount} | Source: ${p.source}`);
        console.log(`   Open Access: ${p.openAccess || p.openAccessPdf ? "✅" : "❌"}`);
        if (p.abstract) {
          console.log(`   Abstract: ${p.abstract.slice(0, 150)}...`);
        }
        console.log(`   APA: ${formatAPA(p)}`);
        console.log("");
      }
    })
    .catch(err => {
      console.error("❌ Error:", err.message);
      process.exit(1);
    });
}
