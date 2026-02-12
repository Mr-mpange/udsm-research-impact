/**
 * Altmetric API Integration
 * 
 * Altmetric tracks attention to research outputs across:
 * - Social media (Twitter, Facebook, Reddit, etc.)
 * - News outlets
 * - Policy documents
 * - Wikipedia citations
 * - Blog mentions
 * - Video platforms
 * 
 * This provides a broader view of research impact beyond traditional citations.
 */

export interface AltmetricData {
  doi: string;
  altmetric_id?: number;
  score?: number;
  readers?: {
    mendeley?: number;
    citeulike?: number;
    connotea?: number;
  };
  cited_by_posts_count?: number;
  cited_by_tweeters_count?: number;
  cited_by_msm_count?: number; // Mainstream media
  cited_by_policies_count?: number;
  cited_by_wikipedia_count?: number;
  images?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  details_url?: string;
}

/**
 * Fetch Altmetric data for a DOI
 * 
 * Free API - no authentication required
 * Rate limit: Reasonable use (no official limit stated)
 * 
 * @param doi - Digital Object Identifier (e.g., "10.1038/nature12345")
 * @returns Altmetric data or null if not found
 */
export async function fetchAltmetricData(doi: string): Promise<AltmetricData | null> {
  if (!doi) return null;

  try {
    // Altmetric free API endpoint
    const response = await fetch(
      `https://api.altmetric.com/v1/doi/${encodeURIComponent(doi)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    // 404 means no Altmetric data exists for this DOI (not an error)
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error(`Altmetric API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Altmetric data:', error);
    return null;
  }
}

/**
 * Fetch Altmetric data for multiple DOIs
 * 
 * @param dois - Array of DOIs
 * @returns Map of DOI to Altmetric data
 */
export async function fetchBulkAltmetricData(
  dois: string[]
): Promise<Map<string, AltmetricData>> {
  const results = new Map<string, AltmetricData>();

  // Process in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < dois.length; i += batchSize) {
    const batch = dois.slice(i, i + batchSize);
    
    const promises = batch.map(async (doi) => {
      const data = await fetchAltmetricData(doi);
      if (data) {
        results.set(doi, data);
      }
    });

    await Promise.all(promises);
    
    // Small delay between batches to be respectful of API
    if (i + batchSize < dois.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Calculate a combined impact score
 * 
 * Combines traditional citations with alternative metrics
 * 
 * @param citations - Traditional citation count
 * @param altmetric - Altmetric data
 * @returns Combined impact score (0-100)
 */
export function calculateCombinedImpact(
  citations: number,
  altmetric: AltmetricData | null
): number {
  // Base score from citations (70% weight)
  const citationScore = Math.min(70, citations * 0.5);

  // Altmetric score (30% weight)
  let altmetricScore = 0;
  if (altmetric) {
    // Altmetric score is already 0-100, scale to 30%
    altmetricScore = (altmetric.score || 0) * 0.3;
  }

  return Math.round(citationScore + altmetricScore);
}

/**
 * Get human-readable impact summary
 * 
 * @param altmetric - Altmetric data
 * @returns Summary string
 */
export function getImpactSummary(altmetric: AltmetricData | null): string {
  if (!altmetric) {
    return 'No alternative metrics available';
  }

  const parts: string[] = [];

  if (altmetric.cited_by_tweeters_count) {
    parts.push(`${altmetric.cited_by_tweeters_count} tweets`);
  }

  if (altmetric.cited_by_msm_count) {
    parts.push(`${altmetric.cited_by_msm_count} news outlets`);
  }

  if (altmetric.cited_by_policies_count) {
    parts.push(`${altmetric.cited_by_policies_count} policy documents`);
  }

  if (altmetric.readers?.mendeley) {
    parts.push(`${altmetric.readers.mendeley} Mendeley readers`);
  }

  if (parts.length === 0) {
    return 'Limited attention tracked';
  }

  return parts.join(', ');
}

/**
 * Get attention level category
 * 
 * @param score - Altmetric score
 * @returns Category: 'exceptional', 'high', 'good', 'average', 'low'
 */
export function getAttentionLevel(score: number | undefined): string {
  if (!score) return 'low';
  
  if (score >= 100) return 'exceptional';
  if (score >= 50) return 'high';
  if (score >= 20) return 'good';
  if (score >= 5) return 'average';
  return 'low';
}
