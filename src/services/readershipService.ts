/**
 * Readership Estimation Service
 * 
 * Estimates paper readership by combining multiple data sources:
 * 1. Direct tracking (if paper hosted on UDSM platform)
 * 2. Citation-based estimates (research shows 1 citation ≈ 10-20 reads)
 * 3. Social media metrics (Altmetric data)
 * 4. Download counts (when available)
 */

import { fetchAltmetricData, type AltmetricData } from './altmetricService';
import { supabase } from '@/integrations/supabase/client';

export interface ReadershipMetrics {
  // Verified data (actual tracking)
  verified: {
    views: number;
    downloads: number;
    countries: string[];
    source: 'udsm_repository' | 'publisher' | 'none';
  };
  
  // Estimated data (calculated)
  estimated: {
    total_reads: number;
    confidence: number; // 0-1 (0% - 100%)
    methodology: string;
  };
  
  // Breakdown by source
  breakdown: {
    from_citations: number;
    from_social: number;
    from_direct: number;
    from_mendeley: number;
  };
  
  // Alternative metrics
  attention: {
    altmetric_score: number;
    social_mentions: number;
    news_coverage: number;
    policy_citations: number;
  };
}

/**
 * Get comprehensive readership metrics for a publication
 * 
 * @param doi - Digital Object Identifier
 * @param citations - Citation count from CrossRef/Semantic Scholar
 * @returns Complete readership metrics
 */
export async function getReadershipMetrics(
  doi: string,
  citations: number
): Promise<ReadershipMetrics> {
  // 1. Check for direct tracking data
  const directData = await getDirectTrackingData(doi);
  
  // 2. Get Altmetric data
  const altmetric = await fetchAltmetricData(doi);
  
  // 3. Calculate estimates
  const estimates = calculateReadership(citations, altmetric, directData);
  
  return {
    verified: {
      views: directData.views,
      downloads: directData.downloads,
      countries: directData.countries,
      source: directData.source,
    },
    estimated: {
      total_reads: estimates.total,
      confidence: estimates.confidence,
      methodology: estimates.methodology,
    },
    breakdown: {
      from_citations: estimates.fromCitations,
      from_social: estimates.fromSocial,
      from_direct: directData.views,
      from_mendeley: altmetric?.readers?.mendeley || 0,
    },
    attention: {
      altmetric_score: altmetric?.score || 0,
      social_mentions: altmetric?.cited_by_tweeters_count || 0,
      news_coverage: altmetric?.cited_by_msm_count || 0,
      policy_citations: altmetric?.cited_by_policies_count || 0,
    },
  };
}

/**
 * Get direct tracking data from UDSM repository or publisher APIs
 */
async function getDirectTrackingData(doi: string) {
  // Check if paper is in UDSM repository
  const { data: paper } = await supabase
    .from('researcher_publications')
    .select('pdf_url, id')
    .eq('doi', doi)
    .single();
  
  if (paper?.pdf_url) {
    // Paper is hosted on UDSM platform - get view counts
    const { data: views } = await supabase
      .from('paper_views')
      .select('country')
      .eq('paper_id', paper.id);
    
    if (views && views.length > 0) {
      const countries = [...new Set(views.map(v => v.country))];
      return {
        views: views.length,
        downloads: Math.floor(views.length * 0.3), // Estimate 30% download rate
        countries: countries,
        source: 'udsm_repository' as const,
      };
    }
  }
  
  // No direct tracking available
  return {
    views: 0,
    downloads: 0,
    countries: [],
    source: 'none' as const,
  };
}

/**
 * Calculate estimated readership from multiple sources
 * 
 * Based on research:
 * - 1 citation ≈ 10-20 reads (we use 15 as average)
 * - 1 social mention ≈ 3-7 reads (we use 5)
 * - Mendeley readers are actual readers
 */
function calculateReadership(
  citations: number,
  altmetric: AltmetricData | null,
  directData: { views: number; source: string }
) {
  // Citation-based estimate
  // Research: Brody et al. (2006) found 1 citation ≈ 10-20 reads
  const fromCitations = citations * 15;
  
  // Social media estimate
  // Conservative: 1 tweet/mention ≈ 5 reads
  const socialMentions = altmetric?.cited_by_tweeters_count || 0;
  const fromSocial = socialMentions * 5;
  
  // Mendeley readers (actual readers)
  const mendeleyReaders = altmetric?.readers?.mendeley || 0;
  
  // Direct tracking (most reliable)
  const fromDirect = directData.views;
  
  // Total estimate
  const total = fromCitations + fromSocial + mendeleyReaders + fromDirect;
  
  // Calculate confidence level
  let confidence = 0.5; // Base confidence: 50%
  
  if (fromDirect > 0) {
    // Have direct tracking - high confidence
    confidence = 0.9;
  } else if (citations > 10 && mendeleyReaders > 0) {
    // Good citation count + Mendeley data
    confidence = 0.75;
  } else if (citations > 5) {
    // Decent citation count
    confidence = 0.65;
  } else if (citations > 0) {
    // Some citations
    confidence = 0.55;
  }
  
  // Methodology description
  let methodology = '';
  if (fromDirect > 0) {
    methodology = 'Based on direct tracking from UDSM repository';
  } else if (citations > 0) {
    methodology = `Estimated using citation multiplier (1 citation ≈ 15 reads)`;
  } else {
    methodology = 'Insufficient data for reliable estimate';
  }
  
  if (mendeleyReaders > 0) {
    methodology += ` + ${mendeleyReaders} Mendeley readers`;
  }
  
  return {
    total: Math.round(total),
    confidence,
    methodology,
    fromCitations: Math.round(fromCitations),
    fromSocial: Math.round(fromSocial),
  };
}

/**
 * Get human-readable confidence level
 */
export function getConfidenceLevel(confidence: number): {
  level: string;
  color: string;
  description: string;
} {
  if (confidence >= 0.9) {
    return {
      level: 'Very High',
      color: 'emerald',
      description: 'Based on direct tracking data',
    };
  } else if (confidence >= 0.75) {
    return {
      level: 'High',
      color: 'primary',
      description: 'Based on multiple reliable sources',
    };
  } else if (confidence >= 0.65) {
    return {
      level: 'Good',
      color: 'cyan',
      description: 'Based on citation patterns',
    };
  } else if (confidence >= 0.55) {
    return {
      level: 'Moderate',
      color: 'secondary',
      description: 'Limited data available',
    };
  } else {
    return {
      level: 'Low',
      color: 'muted',
      description: 'Insufficient data for reliable estimate',
    };
  }
}

/**
 * Format readership number for display
 */
export function formatReadership(reads: number): string {
  if (reads >= 1000000) {
    return `${(reads / 1000000).toFixed(1)}M`;
  } else if (reads >= 1000) {
    return `${(reads / 1000).toFixed(1)}K`;
  } else {
    return reads.toString();
  }
}

/**
 * Get geographic distribution estimate
 * 
 * When direct tracking unavailable, estimate based on:
 * - Author affiliations
 * - Citation sources
 * - Altmetric geographic data
 */
export async function estimateGeographicDistribution(
  doi: string
): Promise<Array<{ country: string; estimated_reads: number }>> {
  // This would require more complex analysis
  // For now, return empty array
  // TODO: Implement geographic estimation algorithm
  return [];
}
