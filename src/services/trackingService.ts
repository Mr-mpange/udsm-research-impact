/**
 * Paper View Tracking Service
 * Tracks views and downloads of research papers
 */

import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Get or create session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('reader_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('reader_session_id', sessionId);
  }
  return sessionId;
}

// Hash IP address for privacy (client-side approximation)
function hashIP(ip: string): string {
  // Simple hash - in production, do this server-side
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// Get visitor country using IP geolocation API
async function getVisitorCountry(): Promise<{ country: string; city: string }> {
  try {
    // Use ipapi.co free API (1000 requests/day)
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || 'Unknown',
        city: data.city || 'Unknown',
      };
    }
  } catch (error) {
    console.error('Error getting location:', error);
  }
  
  return { country: 'Unknown', city: 'Unknown' };
}

/**
 * Track a paper view
 * Call this when a user views a paper page
 */
export async function trackPaperView(paperId: string): Promise<void> {
  try {
    const sessionId = getSessionId();
    const location = await getVisitorCountry();
    
    const { error } = await supabase.from('paper_views').insert({
      paper_id: paperId,
      country: location.country,
      city: location.city,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      session_id: sessionId,
      timestamp: new Date().toISOString(),
    });
    
    if (error) {
      console.error('Error tracking view:', error);
    }
  } catch (error) {
    console.error('Error in trackPaperView:', error);
  }
}

/**
 * Track a paper download
 * Call this when a user downloads a PDF
 */
export async function trackPaperDownload(paperId: string): Promise<void> {
  try {
    const location = await getVisitorCountry();
    
    const { error } = await supabase.from('paper_downloads').insert({
      paper_id: paperId,
      country: location.country,
      city: location.city,
      timestamp: new Date().toISOString(),
    });
    
    if (error) {
      console.error('Error tracking download:', error);
    }
  } catch (error) {
    console.error('Error in trackPaperDownload:', error);
  }
}

/**
 * Update view duration when user leaves
 * Call this on page unload
 */
export function trackViewDuration(paperId: string, startTime: number): void {
  const duration = Math.floor((Date.now() - startTime) / 1000); // seconds
  
  // Use sendBeacon for reliable tracking on page unload
  const data = JSON.stringify({
    paper_id: paperId,
    duration: duration,
  });
  
  navigator.sendBeacon('/api/track-duration', data);
}

/**
 * Get readership statistics for a paper
 */
export async function getPaperReadership(paperId: string) {
  try {
    // Get views
    const { data: views, error: viewsError } = await supabase
      .from('paper_views')
      .select('country, session_id, timestamp')
      .eq('paper_id', paperId);
    
    if (viewsError) throw viewsError;
    
    // Get downloads
    const { data: downloads, error: downloadsError } = await supabase
      .from('paper_downloads')
      .select('country, timestamp')
      .eq('paper_id', paperId);
    
    if (downloadsError) throw downloadsError;
    
    // Calculate statistics
    const uniqueVisitors = new Set(views?.map(v => v.session_id) || []).size;
    const countries = new Set(views?.map(v => v.country) || []);
    
    // Group by country
    const byCountry = (views || []).reduce((acc, view) => {
      const country = view.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total_views: views?.length || 0,
      unique_visitors: uniqueVisitors,
      total_downloads: downloads?.length || 0,
      countries_reached: countries.size,
      by_country: Object.entries(byCountry).map(([country, views]) => ({
        country,
        views,
      })).sort((a, b) => b.views - a.views),
    };
  } catch (error) {
    console.error('Error getting readership:', error);
    return null;
  }
}

/**
 * Get global readership statistics
 */
export async function getGlobalReadership() {
  try {
    const { data, error } = await supabase
      .from('readership_by_country')
      .select('*')
      .order('total_views', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting global readership:', error);
    return [];
  }
}
