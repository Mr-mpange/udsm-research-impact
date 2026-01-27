import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type AppRole = 'admin' | 'moderator' | 'user' | 'researcher';

export function useUserRole() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    if (!user) {
      setRoles([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (!error && data) {
      setRoles(data.map(r => r.role as AppRole));
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const isAdmin = roles.includes('admin');
  const isModerator = roles.includes('moderator');
  const isResearcher = roles.includes('researcher');

  const hasRole = useCallback((role: AppRole) => roles.includes(role), [roles]);

  return {
    roles,
    isAdmin,
    isModerator,
    isResearcher,
    hasRole,
    isLoading,
    refreshRoles: fetchRoles
  };
}
