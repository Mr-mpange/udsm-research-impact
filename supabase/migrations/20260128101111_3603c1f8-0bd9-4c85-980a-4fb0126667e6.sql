-- Create notifications table for real-time alerts
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('citation', 'collaboration_request', 'collaboration_accepted', 'team_invite', 'team_joined')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- System can insert notifications (via edge functions with service role)
CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create research teams table
CREATE TABLE public.research_teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on research_teams
ALTER TABLE public.research_teams ENABLE ROW LEVEL SECURITY;

-- Create team members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.research_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Enable RLS on team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create collaboration requests table
CREATE TABLE public.collaboration_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  team_id UUID REFERENCES public.research_teams(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on collaboration_requests
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Create citation snapshots for tracking citation history
CREATE TABLE public.citation_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  publication_id UUID NOT NULL REFERENCES public.researcher_publications(id) ON DELETE CASCADE,
  citations INTEGER NOT NULL DEFAULT 0,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(publication_id, snapshot_date)
);

-- Enable RLS on citation_snapshots
ALTER TABLE public.citation_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for research_teams
CREATE POLICY "Users can view public teams or teams they belong to"
  ON public.research_teams FOR SELECT
  USING (
    is_public = true OR 
    owner_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.team_members WHERE team_id = research_teams.id AND user_id = auth.uid())
  );

CREATE POLICY "Users can create teams"
  ON public.research_teams FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners can update their teams"
  ON public.research_teams FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Team owners can delete their teams"
  ON public.research_teams FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS Policies for team_members
CREATE POLICY "Users can view team members of their teams"
  ON public.team_members FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.research_teams rt WHERE rt.id = team_members.team_id AND rt.is_public = true)
  );

CREATE POLICY "Team owners and admins can add members"
  ON public.team_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members tm 
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid() 
      AND tm.role IN ('owner', 'admin')
    )
    OR EXISTS (
      SELECT 1 FROM public.research_teams rt
      WHERE rt.id = team_members.team_id AND rt.owner_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can remove members"
  ON public.team_members FOR DELETE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.team_members tm 
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id = auth.uid() 
      AND tm.role IN ('owner', 'admin')
    )
  );

-- RLS Policies for collaboration_requests
CREATE POLICY "Users can view requests involving them"
  ON public.collaboration_requests FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create requests"
  ON public.collaboration_requests FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Request recipients can update status"
  ON public.collaboration_requests FOR UPDATE
  USING (auth.uid() = to_user_id);

-- RLS Policies for citation_snapshots
CREATE POLICY "Users can view snapshots for their publications"
  ON public.citation_snapshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.researcher_publications rp 
      WHERE rp.id = citation_snapshots.publication_id 
      AND rp.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all snapshots"
  ON public.citation_snapshots FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert snapshots for their publications"
  ON public.citation_snapshots FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.researcher_publications rp 
      WHERE rp.id = citation_snapshots.publication_id 
      AND rp.user_id = auth.uid()
    )
  );

-- Create full-text search index on publications
CREATE INDEX idx_publications_fts ON public.researcher_publications 
  USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(journal, '')));

-- Add triggers for updated_at
CREATE TRIGGER update_research_teams_updated_at
  BEFORE UPDATE ON public.research_teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collaboration_requests_updated_at
  BEFORE UPDATE ON public.collaboration_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();