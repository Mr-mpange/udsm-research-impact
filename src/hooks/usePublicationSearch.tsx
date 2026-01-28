import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Publication {
  id: string;
  user_id: string;
  title: string;
  journal: string | null;
  year: number | null;
  citations: number | null;
  quartile: string | null;
  doi: string | null;
  co_authors: string[] | null;
  created_at: string;
}

export interface SearchFilters {
  query: string;
  yearFrom?: number;
  yearTo?: number;
  quartile?: string;
  minCitations?: number;
  maxCitations?: number;
  journal?: string;
}

export function usePublicationSearch() {
  const [results, setResults] = useState<Publication[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useAuth();

  const search = useCallback(async (filters: SearchFilters, page = 0, pageSize = 20) => {
    if (!user) return;

    setIsSearching(true);
    
    try {
      let query = supabase
        .from('researcher_publications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      // Full-text search on title and journal
      if (filters.query && filters.query.trim()) {
        query = query.or(`title.ilike.%${filters.query}%,journal.ilike.%${filters.query}%`);
      }

      // Year range filter
      if (filters.yearFrom) {
        query = query.gte('year', filters.yearFrom);
      }
      if (filters.yearTo) {
        query = query.lte('year', filters.yearTo);
      }

      // Quartile filter
      if (filters.quartile) {
        query = query.eq('quartile', filters.quartile);
      }

      // Citation range filter
      if (filters.minCitations !== undefined) {
        query = query.gte('citations', filters.minCitations);
      }
      if (filters.maxCitations !== undefined) {
        query = query.lte('citations', filters.maxCitations);
      }

      // Journal filter
      if (filters.journal) {
        query = query.ilike('journal', `%${filters.journal}%`);
      }

      // Pagination and ordering
      query = query
        .order('year', { ascending: false })
        .order('citations', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Search error:', error);
        setResults([]);
        setTotalCount(0);
      } else {
        setResults(data || []);
        setTotalCount(count || 0);
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
      setTotalCount(0);
    } finally {
      setIsSearching(false);
    }
  }, [user]);

  const getAllPublications = useCallback(async () => {
    if (!user) return;

    setIsSearching(true);
    const { data, error, count } = await supabase
      .from('researcher_publications')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('year', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching publications:', error);
    } else {
      setResults(data || []);
      setTotalCount(count || 0);
    }
    setIsSearching(false);
  }, [user]);

  const getDistinctJournals = useCallback(async (): Promise<string[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('researcher_publications')
      .select('journal')
      .eq('user_id', user.id)
      .not('journal', 'is', null);

    if (error) {
      console.error('Error fetching journals:', error);
      return [];
    }

    const journals = [...new Set(data?.map(d => d.journal).filter(Boolean) as string[])];
    return journals.sort();
  }, [user]);

  const getYearRange = useCallback(async (): Promise<{ min: number; max: number }> => {
    if (!user) return { min: 2000, max: new Date().getFullYear() };

    const { data, error } = await supabase
      .from('researcher_publications')
      .select('year')
      .eq('user_id', user.id)
      .not('year', 'is', null)
      .order('year', { ascending: true });

    if (error || !data?.length) {
      return { min: 2000, max: new Date().getFullYear() };
    }

    const years = data.map(d => d.year).filter(Boolean) as number[];
    return {
      min: Math.min(...years),
      max: Math.max(...years),
    };
  }, [user]);

  return {
    results,
    isSearching,
    totalCount,
    search,
    getAllPublications,
    getDistinctJournals,
    getYearRange,
  };
}
