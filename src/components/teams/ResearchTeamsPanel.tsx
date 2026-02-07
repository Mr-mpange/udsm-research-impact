import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Settings, UserPlus, LogOut, Trash2, Globe, Lock, Crown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useResearchTeams, type ResearchTeam, type TeamMember, type CollaborationRequest } from '@/hooks/useResearchTeams';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TeamDetailsProps {
  team: ResearchTeam;
  onClose: () => void;
}

function TeamDetails({ team, onClose }: TeamDetailsProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const { getTeamMembers, inviteToTeam, leaveTeam, deleteTeam } = useResearchTeams();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const teamMembers = await getTeamMembers(team.id);
      setMembers(teamMembers);
      setIsLoading(false);
    };
    load();
  }, [team.id]);

  const isOwner = team.owner_id === user?.id;

  const handleInvite = async () => {
    if (!inviteEmail) return;

    // Find user by email
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', inviteEmail)
      .maybeSingle();

    if (!profile) {
      toast({
        variant: "destructive",
        title: "User not found",
        description: "No user found with that email address.",
      });
      return;
    }

    const { error } = await inviteToTeam(team.id, profile.user_id, inviteMessage);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send invitation.",
      });
    } else {
      setInviteEmail('');
      setInviteMessage('');
      toast({
        title: "Invitation sent!",
        description: "The user has been invited to join the team.",
      });
    }
  };

  const handleLeave = async () => {
    if (confirm('Are you sure you want to leave this team?')) {
      await leaveTeam(team.id);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      await deleteTeam(team.id);
      onClose();
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-3 h-3 text-secondary" />;
      case 'admin': return <Shield className="w-3 h-3 text-primary" />;
      default: return null;
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {team.is_public ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          {team.name}
        </DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="members" className="mt-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="members">Members</TabsTrigger>
          {isOwner && <TabsTrigger value="invite">Invite</TabsTrigger>}
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          {team.description && (
            <p className="text-sm text-muted-foreground">{team.description}</p>
          )}

          <ScrollArea className="h-60">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="space-y-2">
                {members.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {(member.profile?.display_name || member.profile?.email || '?')[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium truncate">
                          {member.profile?.display_name || member.profile?.email}
                        </span>
                        {getRoleIcon(member.role)}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.profile?.institution || 'No institution'}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex gap-2 pt-4 border-t">
            {!isOwner && (
              <Button variant="outline" className="flex-1" onClick={handleLeave}>
                <LogOut className="w-4 h-4 mr-2" />
                Leave Team
              </Button>
            )}
            {isOwner && (
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Team
              </Button>
            )}
          </div>
        </TabsContent>

        {isOwner && (
          <TabsContent value="invite" className="space-y-4">
            <div className="space-y-2">
              <Label>Researcher Email</Label>
              <Input
                placeholder="researcher@university.edu"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Personal Message (optional)</Label>
              <Textarea
                placeholder="I'd like to invite you to collaborate on..."
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                rows={3}
              />
            </div>
            <Button className="w-full" onClick={handleInvite}>
              <UserPlus className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </TabsContent>
        )}
      </Tabs>
    </DialogContent>
  );
}

export default function ResearchTeamsPanel() {
  const { myTeams, teams, isLoading, createTeam, getPendingRequests, respondToRequest } = useResearchTeams();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<ResearchTeam | null>(null);
  const [pendingRequests, setPendingRequests] = useState<CollaborationRequest[]>([]);
  
  // Form state
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [newTeamPublic, setNewTeamPublic] = useState(false);

  useEffect(() => {
    const loadRequests = async () => {
      const requests = await getPendingRequests();
      setPendingRequests(requests);
    };
    loadRequests();
  }, []);

  const handleCreateTeam = async () => {
    if (!newTeamName) return;
    
    const { error } = await createTeam(newTeamName, newTeamDesc, newTeamPublic);
    if (!error) {
      setNewTeamName('');
      setNewTeamDesc('');
      setNewTeamPublic(false);
      setShowCreateDialog(false);
    }
  };

  const handleRequest = async (requestId: string, accept: boolean) => {
    await respondToRequest(requestId, accept);
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Research Teams</h2>
          <p className="text-sm text-muted-foreground">Collaborate with other researchers</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Research Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Team Name</Label>
                <Input
                  placeholder="e.g., Climate Research Group"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the team's research focus..."
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Public Team</Label>
                  <p className="text-xs text-muted-foreground">Anyone can discover this team</p>
                </div>
                <Switch checked={newTeamPublic} onCheckedChange={setNewTeamPublic} />
              </div>
              <Button className="w-full" onClick={handleCreateTeam}>
                Create Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="glass-panel p-4 border-secondary/30">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-secondary" />
            Pending Invitations
          </h3>
          <div className="space-y-2">
            {pendingRequests.map(request => (
              <div key={request.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">Team invitation</p>
                  {request.message && (
                    <p className="text-xs text-muted-foreground">{request.message}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleRequest(request.id, false)}>
                    Decline
                  </Button>
                  <Button size="sm" onClick={() => handleRequest(request.id, true)}>
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Teams */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">My Teams</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : myTeams.length === 0 ? (
          <div className="glass-panel p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">You haven't joined any teams yet</p>
            <p className="text-sm text-muted-foreground/70">Create a team or join an existing one</p>
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {myTeams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel p-4 hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => setSelectedTeam(team)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{team.name}</h4>
                          {team.is_public ? (
                            <Globe className="w-3 h-3 text-muted-foreground" />
                          ) : (
                            <Lock className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                        {team.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{team.description}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Discover Public Teams */}
      {teams.filter(t => t.is_public && !myTeams.find(mt => mt.id === t.id)).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Discover Teams</h3>
          <div className="grid gap-3">
            {teams
              .filter(t => t.is_public && !myTeams.find(mt => mt.id === t.id))
              .slice(0, 5)
              .map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium text-foreground">{team.name}</h4>
                        {team.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{team.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Team Details Dialog */}
      {selectedTeam && (
        <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
          <TeamDetails team={selectedTeam} onClose={() => setSelectedTeam(null)} />
        </Dialog>
      )}
    </div>
  );
}
