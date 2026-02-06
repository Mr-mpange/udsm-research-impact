import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PublicationRecord {
  id: string;
  title: string;
  doi: string | null;
  year: number | null;
  citations: number;
}

async function fetchCrossRefCitations(doi: string): Promise<number | null> {
  try {
    const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.message?.['is-referenced-by-count'] || 0;
  } catch {
    return null;
  }
}

async function fetchSemanticScholarCitations(
  title: string,
  doi?: string
): Promise<number | null> {
  try {
    let url: string;
    if (doi) {
      url = `https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(doi)}?fields=citationCount`;
    } else {
      const searchUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(title)}&fields=citationCount&limit=1`;
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) return null;
      const searchData = await searchResponse.json();
      if (!searchData.data || searchData.data.length === 0) return null;
      return searchData.data[0].citationCount || 0;
    }

    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data.citationCount || 0;
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all publications that need updating (older than 24 hours or never updated)
    const { data: publications, error: fetchError } = await supabaseClient
      .from('researcher_publications')
      .select('id, title, doi, year, citations')
      .order('created_at', { ascending: false });

    if (fetchError) {
      throw fetchError;
    }

    const updates: Array<{ id: string; citations: number; source: string }> = [];
    const snapshots: Array<{ publication_id: string; citations: number; snapshot_date: string }> = [];
    const today = new Date().toISOString().split('T')[0];

    // Process publications in batches
    for (const pub of publications as PublicationRecord[]) {
      let newCitationCount: number | null = null;
      let source = 'unknown';

      // Try CrossRef first if DOI exists
      if (pub.doi) {
        newCitationCount = await fetchCrossRefCitations(pub.doi);
        if (newCitationCount !== null) {
          source = 'crossref';
        }
      }

      // Try Semantic Scholar if CrossRef failed or no DOI
      if (newCitationCount === null) {
        newCitationCount = await fetchSemanticScholarCitations(pub.title, pub.doi || undefined);
        if (newCitationCount !== null) {
          source = 'semanticscholar';
        }
      }

      // Update if we got a result and it's different from current
      if (newCitationCount !== null && newCitationCount !== pub.citations) {
        updates.push({
          id: pub.id,
          citations: newCitationCount,
          source,
        });

        snapshots.push({
          publication_id: pub.id,
          citations: newCitationCount,
          snapshot_date: today,
        });
      }

      // Rate limiting - wait 300ms between requests
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Batch update publications
    if (updates.length > 0) {
      for (const update of updates) {
        await supabaseClient
          .from('researcher_publications')
          .update({ citations: update.citations })
          .eq('id', update.id);
      }

      // Record snapshots
      await supabaseClient
        .from('citation_snapshots')
        .upsert(snapshots, { onConflict: 'publication_id,snapshot_date' });
    }

    return new Response(
      JSON.stringify({
        success: true,
        updated: updates.length,
        total: publications?.length || 0,
        updates: updates.map(u => ({ id: u.id, citations: u.citations, source: u.source })),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
