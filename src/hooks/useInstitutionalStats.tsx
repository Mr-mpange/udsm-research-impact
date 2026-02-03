import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface InstitutionalStats {
  totalPublications: number;
  totalCitations: number;
  totalResearchers: number;
  avgHIndex: number;
  trendingPublications: number;
  recentActivity: number;
}

export function useInstitutionalStats() {
  const [stats, setStats] = useState<InstitutionalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Fetch aggregate publication stats
      const { data: pubData, error: pubError } = await supabase
        .from('researcher_publications')
        .select('citations');

      if (pubError) throw pubError;

      const totalPublications = pubData?.length || 0;
      const totalCitations = pubData?.reduce((sum, p) => sum + (p.citations || 0), 0) || 0;

      // Fetch researcher profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('h_index, updated_at');

      if (profileError) throw profileError;

      const totalResearchers = profileData?.length || 0;
      const avgHIndex = totalResearchers > 0
        ? Math.round(profileData.reduce((sum, p) => sum + (p.h_index || 0), 0) / totalResearchers)
        : 0;

      // Recent activity (profiles updated in last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentActivity = profileData?.filter(p => 
        new Date(p.updated_at) > weekAgo
      ).length || 0;

      // Get trending publications (with snapshots showing growth)
      const { data: snapshotData, error: snapError } = await supabase
        .from('citation_snapshots')
        .select('publication_id');

      const trendingPublications = snapError ? 0 : 
        new Set(snapshotData?.map(s => s.publication_id)).size;

      setStats({
        totalPublications,
        totalCitations,
        totalResearchers,
        avgHIndex,
        trendingPublications,
        recentActivity,
      });
    } catch (error) {
      console.error('Error fetching institutional stats:', error);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    refetch: fetchStats,
    isAuthenticated: !!user,
  };
}
