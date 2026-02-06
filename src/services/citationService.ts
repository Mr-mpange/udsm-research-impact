/**
 * Citation Service - Fetches citation counts from external APIs
 * Supports CrossRef and Semantic Scholar
 */

export interface CitationData {
  source: 'crossref' | 'semanticscholar' | 'manual';
  count: number;
  lastUpdated: string;
  doi?: string;
  paperId?: string;
}

export interface PublicationIdentifiers {
  doi?: string;
  title: string;
  authors?: string[];
  year?: number;
}

/**
 * Fetch citation count from CrossRef API
 */
export async function fetchCrossRefCitations(doi: string): Promise<number | null> {
  try {
    const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
    
    if (!response.ok) {
      console.warn(`CrossRef API error for DOI ${doi}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.message?.['is-referenced-by-count'] || 0;
  } catch (error) {
    console.error('Error fetching CrossRef citations:', error);
    return null;
  }
}

/**
 * Search for paper on Semantic Scholar and get citation count
 */
export async function fetchSemanticScholarCitations(
  identifiers: PublicationIdentifiers
): Promise<{ count: number; paperId?: string } | null> {
  try {
    let url: string;
    
    // Try DOI first if available
    if (identifiers.doi) {
      url = `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(identifiers.doi)}?fields=citationCount,paperId`;
    } else {
      // Search by title
      const searchUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(identifiers.title)}&fields=citationCount,paperId,title,year&limit=1`;
      const searchResponse = await fetch(searchUrl);
      
      if (!searchResponse.ok) {
        console.warn(`Semantic Scholar search error: ${searchResponse.status}`);
        return null;
      }

      const searchData = await searchResponse.json();
      if (!searchData.data || searchData.data.length === 0) {
        return null;
      }

      const paper = searchData.data[0];
      return {
        count: paper.citationCount || 0,
        paperId: paper.paperId,
      };
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Semantic Scholar API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return {
      count: data.citationCount || 0,
      paperId: data.paperId,
    };
  } catch (error) {
    console.error('Error fetching Semantic Scholar citations:', error);
    return null;
  }
}

/**
 * Fetch citations from multiple sources and return the best result
 */
export async function fetchCitationCount(
  identifiers: PublicationIdentifiers
): Promise<CitationData | null> {
  const results: CitationData[] = [];

  // Try CrossRef if DOI is available
  if (identifiers.doi) {
    const crossrefCount = await fetchCrossRefCitations(identifiers.doi);
    if (crossrefCount !== null) {
      results.push({
        source: 'crossref',
        count: crossrefCount,
        lastUpdated: new Date().toISOString(),
        doi: identifiers.doi,
      });
    }
  }

  // Try Semantic Scholar
  const semanticScholarResult = await fetchSemanticScholarCitations(identifiers);
  if (semanticScholarResult !== null) {
    results.push({
      source: 'semanticscholar',
      count: semanticScholarResult.count,
      lastUpdated: new Date().toISOString(),
      paperId: semanticScholarResult.paperId,
    });
  }

  // Return the result with highest citation count
  if (results.length === 0) {
    return null;
  }

  return results.reduce((best, current) => 
    current.count > best.count ? current : best
  );
}

/**
 * Batch fetch citations for multiple publications
 */
export async function batchFetchCitations(
  publications: PublicationIdentifiers[]
): Promise<Map<string, CitationData>> {
  const results = new Map<string, CitationData>();

  // Process in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < publications.length; i += batchSize) {
    const batch = publications.slice(i, i + batchSize);
    
    const promises = batch.map(async (pub) => {
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 200 * (i / batchSize)));
      
      const citationData = await fetchCitationCount(pub);
      if (citationData) {
        const key = pub.doi || pub.title;
        results.set(key, citationData);
      }
    });

    await Promise.all(promises);
  }

  return results;
}
