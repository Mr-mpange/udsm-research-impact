import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

export interface ResearchTeam {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  profile?: {
    display_name: string | null;
    email: string;
    institution: string | null;
  };
}

export interface CollaborationRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  team_id: string | null;
  message: string | null;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
}

export function useResearchTeams() {
  const [teams, setTeams] = useState<ResearchTeam[]>([]);
  const [myTeams, setMyTeams] = useState<ResearchTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { createNotification } = useNotifications();

  const fetchTeams = useCallback(async () => {
    if (!user) {
      setTeams([]);
      setMyTeams([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Fetch all accessible teams
    const { data: allTeams, error: teamsError } = await supabase
      .from('research_teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (teamsError) {
      console.error('Error fetching teams:', teamsError);
    } else {
      setTeams(allTeams || []);
    }

    // Fetch teams where user is a member
    const { data: memberships } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id);

    const memberTeamIds = memberships?.map(m => m.team_id) || [];
    const ownedTeams = (allTeams || []).filter(t => t.owner_id === user.id);
    const memberTeams = (allTeams || []).filter(t => memberTeamIds.includes(t.id));
    
    setMyTeams([...new Map([...ownedTeams, ...memberTeams].map(t => [t.id, t])).values()]);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const createTeam = async (name: string, description: string, isPublic: boolean) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('research_teams')
      .insert({
        name,
        description,
        owner_id: user.id,
        is_public: isPublic,
      })
      .select()
      .single();

    if (error) {
      return { error, data: null };
    }

    // Add owner as team member
    await supabase
      .from('team_members')
      .insert({
        team_id: data.id,
        user_id: user.id,
        role: 'owner',
      });

    await fetchTeams();
    return { error: null, data };
  };

  const updateTeam = async (teamId: string, updates: Partial<ResearchTeam>) => {
    const { error } = await supabase
      .from('research_teams')
      .update(updates)
      .eq('id', teamId);

    if (!error) {
      await fetchTeams();
    }
    return { error };
  };

  const deleteTeam = async (teamId: string) => {
    const { error } = await supabase
      .from('research_teams')
      .delete()
      .eq('id', teamId);

    if (!error) {
      await fetchTeams();
    }
    return { error };
  };

  const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId);

    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }

    // Fetch profiles for members
    const userIds = data.map(m => m.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, display_name, email, institution')
      .in('user_id', userIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, p]));
    
    return data.map(member => ({
      ...member,
      role: member.role as 'owner' | 'admin' | 'member',
      profile: profileMap.get(member.user_id),
    }));
  };

  const inviteToTeam = async (teamId: string, toUserId: string, message?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Create collaboration request
    const { error: requestError } = await supabase
      .from('collaboration_requests')
      .insert({
        from_user_id: user.id,
        to_user_id: toUserId,
        team_id: teamId,
        message,
        status: 'pending',
      });

    if (requestError) {
      return { error: requestError };
    }

    // Get team name for notification
    const team = teams.find(t => t.id === teamId);
    
    // Send notification
    await createNotification(
      toUserId,
      'team_invite',
      'Team Invitation',
      `You've been invited to join the research team "${team?.name || 'a team'}"`,
      { team_id: teamId, from_user_id: user.id }
    );

    return { error: null };
  };

  const respondToRequest = async (requestId: string, accept: boolean) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Get the request details
    const { data: request, error: fetchError } = await supabase
      .from('collaboration_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError || !request) {
      return { error: fetchError || new Error('Request not found') };
    }

    // Update request status
    const { error: updateError } = await supabase
      .from('collaboration_requests')
      .update({ status: accept ? 'accepted' : 'declined' })
      .eq('id', requestId);

    if (updateError) {
      return { error: updateError };
    }

    if (accept && request.team_id) {
      // Add user to team
      await supabase
        .from('team_members')
        .insert({
          team_id: request.team_id,
          user_id: user.id,
          role: 'member',
        });

      // Notify the requester
      await createNotification(
        request.from_user_id,
        'team_joined',
        'Invitation Accepted',
        'Your team invitation was accepted!',
        { team_id: request.team_id }
      );

      await fetchTeams();
    }

    return { error: null };
  };

  const getPendingRequests = async (): Promise<CollaborationRequest[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('collaboration_requests')
      .select('*')
      .eq('to_user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
      return [];
    }

    return data.map(r => ({
      ...r,
      status: r.status as 'pending' | 'accepted' | 'declined',
    }));
  };

  const leaveTeam = async (teamId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', user.id);

    if (!error) {
      await fetchTeams();
    }
    return { error };
  };

  return {
    teams,
    myTeams,
    isLoading,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamMembers,
    inviteToTeam,
    respondToRequest,
    getPendingRequests,
    leaveTeam,
    refetch: fetchTeams,
  };
}
