import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Json } from '@/integrations/supabase/types';

export interface DashboardConfig {
  activeTab?: string;
  selectedMetrics?: string[];
  dateRange?: { start: string; end: string };
  chartTypes?: Record<string, string>;
  filters?: Record<string, string | string[]>;
}

export interface SavedDashboard {
  id: string;
  name: string;
  config: DashboardConfig;
  created_at: string;
  updated_at: string;
}

export function useSavedDashboards() {
  const { user } = useAuth();
  const [dashboards, setDashboards] = useState<SavedDashboard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboards = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('saved_dashboards')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setDashboards(data.map(d => ({
        ...d,
        config: (d.config as unknown as DashboardConfig) || {}
      })));
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  const saveDashboard = useCallback(async (name: string, config: DashboardConfig) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('saved_dashboards')
      .insert({
        user_id: user.id,
        name,
        config: config as unknown as Json
      })
      .select()
      .single();

    if (!error && data) {
      const newDashboard: SavedDashboard = {
        ...data,
        config: (data.config as unknown as DashboardConfig) || {}
      };
      setDashboards(prev => [newDashboard, ...prev]);
      return data.id;
    }
    return null;
  }, [user]);

  const updateDashboard = useCallback(async (
    dashboardId: string,
    updates: { name?: string; config?: DashboardConfig }
  ) => {
    if (!user) return;

    const updateData: { name?: string; config?: Json; updated_at: string } = {
      updated_at: new Date().toISOString()
    };
    
    if (updates.name) updateData.name = updates.name;
    if (updates.config) updateData.config = updates.config as unknown as Json;

    const { error } = await supabase
      .from('saved_dashboards')
      .update(updateData)
      .eq('id', dashboardId)
      .eq('user_id', user.id);

    if (!error) {
      setDashboards(prev => 
        prev.map(d => 
          d.id === dashboardId 
            ? { ...d, ...updates, updated_at: new Date().toISOString() }
            : d
        )
      );
    }
  }, [user]);

  const deleteDashboard = useCallback(async (dashboardId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('saved_dashboards')
      .delete()
      .eq('id', dashboardId)
      .eq('user_id', user.id);

    if (!error) {
      setDashboards(prev => prev.filter(d => d.id !== dashboardId));
    }
  }, [user]);

  return {
    dashboards,
    isLoading,
    saveDashboard,
    updateDashboard,
    deleteDashboard,
    refreshDashboards: fetchDashboards
  };
}
