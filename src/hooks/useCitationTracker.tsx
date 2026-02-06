import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { fetchCitationCount, batchFetchCitations, type PublicationIdentifiers } from '@/services/citationService';

export interface CitationSnapshot {
  id: string;
  publication_id: string;
  citations: number;
  snapshot_date: string;
  created_at: string;
}

export interface PublicationWithHistory {
  id: string;
  title: string;
  journal: string | null;
  year: number | null;
  current_citations: number;
  snapshots: CitationSnapshot[];
  growth_rate: number; // percentage change
  trend: 'up' | 'down' | 'stable';
}

export function useCitationTracker() {
  const [publications, setPublications] = useState<PublicationWithHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchCitationHistory = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);

    // Fetch user's publications
    const { data: pubs, error: pubError } = await supabase
      .from('researcher_publications')
      .select('id, title, journal, year, citations')
      .eq('user_id', user.id)
      .order('citations', { ascending: false });

    if (pubError) {
      console.error('Error fetching publications:', pubError);
      setIsLoading(false);
      return;
    }

    if (!pubs?.length) {
      setPublications([]);
      setIsLoading(false);
      return;
    }

    // Fetch citation snapshots
    const pubIds = pubs.map(p => p.id);
    const { data: snapshots, error: snapError } = await supabase
      .from('citation_snapshots')
      .select('*')
      .in('publication_id', pubIds)
      .order('snapshot_date', { ascending: true });

    if (snapError) {
      console.error('Error fetching snapshots:', snapError);
    }

    const snapshotMap = new Map<string, CitationSnapshot[]>();
    (snapshots || []).forEach(s => {
      const existing = snapshotMap.get(s.publication_id) || [];
      snapshotMap.set(s.publication_id, [...existing, s]);
    });

    // Calculate growth rates and trends
    const enrichedPubs: PublicationWithHistory[] = pubs.map(pub => {
      const pubSnapshots = snapshotMap.get(pub.id) || [];
      const currentCitations = pub.citations || 0;
      
      let growthRate = 0;
      let trend: 'up' | 'down' | 'stable' = 'stable';

      if (pubSnapshots.length >= 2) {
        const oldestSnapshot = pubSnapshots[0];
        const latestSnapshot = pubSnapshots[pubSnapshots.length - 1];
        const oldValue = oldestSnapshot.citations;
        const newValue = latestSnapshot.citations;
        
        if (oldValue > 0) {
          growthRate = ((newValue - oldValue) / oldValue) * 100;
        } else if (newValue > 0) {
          growthRate = 100;
        }
        
        trend = growthRate > 5 ? 'up' : growthRate < -5 ? 'down' : 'stable';
      } else if (pubSnapshots.length === 1) {
        // Compare with current citation count
        const snapshotValue = pubSnapshots[0].citations;
        if (snapshotValue > 0) {
          growthRate = ((currentCitations - snapshotValue) / snapshotValue) * 100;
        } else if (currentCitations > 0) {
          growthRate = 100;
        }
        trend = growthRate > 5 ? 'up' : growthRate < -5 ? 'down' : 'stable';
      }

      return {
        id: pub.id,
        title: pub.title,
        journal: pub.journal,
        year: pub.year,
        current_citations: currentCitations,
        snapshots: pubSnapshots,
        growth_rate: Math.round(growthRate * 10) / 10,
        trend,
      };
    });

    setPublications(enrichedPubs);
    setIsLoading(false);
  }, [user]);

  const recordSnapshot = async (publicationId: string, citations: number) => {
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('citation_snapshots')
      .upsert(
        {
          publication_id: publicationId,
          citations,
          snapshot_date: today,
        },
        {
          onConflict: 'publication_id,snapshot_date',
        }
      );

    if (error) {
      console.error('Error recording snapshot:', error);
      return { error };
    }

    return { error: null };
  };

  const recordAllSnapshots = async () => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data: pubs, error: fetchError } = await supabase
      .from('researcher_publications')
      .select('id, citations')
      .eq('user_id', user.id);

    if (fetchError) {
      return { error: fetchError };
    }

    const today = new Date().toISOString().split('T')[0];
    const snapshots = (pubs || []).map(p => ({
      publication_id: p.id,
      citations: p.citations || 0,
      snapshot_date: today,
    }));

    if (snapshots.length === 0) {
      return { error: null };
    }

    const { error } = await supabase
      .from('citation_snapshots')
      .upsert(snapshots, { onConflict: 'publication_id,snapshot_date' });

    if (error) {
      console.error('Error recording snapshots:', error);
      return { error };
    }

    await fetchCitationHistory();
    return { error: null };
  };

  const updateCitationsFromAPIs = async () => {
    if (!user) return { error: new Error('Not authenticated'), updated: 0 };

    // Fetch publications with DOI and title
    const { data: pubs, error: fetchError } = await supabase
      .from('researcher_publications')
      .select('id, title, doi, year, co_authors, citations')
      .eq('user_id', user.id);

    if (fetchError) {
      return { error: fetchError, updated: 0 };
    }

    if (!pubs || pubs.length === 0) {
      return { error: null, updated: 0 };
    }

    // Prepare identifiers for batch fetch
    const identifiers: PublicationIdentifiers[] = pubs.map(p => ({
      doi: p.doi || undefined,
      title: p.title,
      year: p.year || undefined,
    }));

    // Fetch citations from external APIs
    const citationResults = await batchFetchCitations(identifiers);

    // Update publications with new citation counts
    const updates: Array<{ id: string; citations: number }> = [];
    const snapshots: Array<{ publication_id: string; citations: number; snapshot_date: string }> = [];
    const today = new Date().toISOString().split('T')[0];

    pubs.forEach((pub) => {
      const key = pub.doi || pub.title;
      const citationData = citationResults.get(key);

      if (citationData && citationData.count !== pub.citations) {
        updates.push({
          id: pub.id,
          citations: citationData.count,
        });

        snapshots.push({
          publication_id: pub.id,
          citations: citationData.count,
          snapshot_date: today,
        });
      }
    });

    // Batch update
    if (updates.length > 0) {
      for (const update of updates) {
        await supabase
          .from('researcher_publications')
          .update({ citations: update.citations })
          .eq('id', update.id);
      }

      // Record snapshots
      await supabase
        .from('citation_snapshots')
        .upsert(snapshots, { onConflict: 'publication_id,snapshot_date' });

      await fetchCitationHistory();
    }

    return { error: null, updated: updates.length };
  };

  const updateSinglePublication = async (publicationId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data: pub, error: fetchError } = await supabase
      .from('researcher_publications')
      .select('id, title, doi, year, citations')
      .eq('id', publicationId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !pub) {
      return { error: fetchError || new Error('Publication not found') };
    }

    const citationData = await fetchCitationCount({
      doi: pub.doi || undefined,
      title: pub.title,
      year: pub.year || undefined,
    });

    if (!citationData) {
      return { error: new Error('Could not fetch citation data from external APIs') };
    }

    // Update publication
    const { error: updateError } = await supabase
      .from('researcher_publications')
      .update({ citations: citationData.count })
      .eq('id', publicationId);

    if (updateError) {
      return { error: updateError };
    }

    // Record snapshot
    const today = new Date().toISOString().split('T')[0];
    await supabase
      .from('citation_snapshots')
      .upsert({
        publication_id: publicationId,
        citations: citationData.count,
        snapshot_date: today,
      }, { onConflict: 'publication_id,snapshot_date' });

    await fetchCitationHistory();
    return { error: null, citationData };
  };

  const getAggregateStats = useCallback(() => {
    const totalCitations = publications.reduce((acc, p) => acc + p.current_citations, 0);
    const avgGrowth = publications.length > 0
      ? publications.reduce((acc, p) => acc + p.growth_rate, 0) / publications.length
      : 0;
    
    const trending = publications.filter(p => p.trend === 'up').length;
    const declining = publications.filter(p => p.trend === 'down').length;
    const stable = publications.filter(p => p.trend === 'stable').length;

    return {
      totalCitations,
      avgGrowth: Math.round(avgGrowth * 10) / 10,
      trending,
      declining,
      stable,
      totalPublications: publications.length,
    };
  }, [publications]);

  return {
    publications,
    isLoading,
    fetchCitationHistory,
    recordSnapshot,
    recordAllSnapshots,
    updateCitationsFromAPIs,
    updateSinglePublication,
    getAggregateStats,
  };
}
