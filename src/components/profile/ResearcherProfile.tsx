import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Award, BookOpen, Users, TrendingUp, Building2, 
  ExternalLink, Edit2, Save, Loader2, Link2, Search, BarChart3, Lock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PublicationTimeline from './PublicationTimeline';
import CollaborationMap from './CollaborationMap';
import HIndexChart from './HIndexChart';
import OrcidSync from './OrcidSync';
import PublicationSearch from '@/components/publications/PublicationSearch';
import ResearchTeamsPanel from '@/components/teams/ResearchTeamsPanel';
import CitationImpactTracker from '@/components/citations/CitationImpactTracker';

interface ResearcherProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResearcherProfile({ isOpen, onClose }: ResearcherProfileProps) {
  const { profile, updateProfile } = useAuth();
  const { isAdmin, isModerator } = useUserRole();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'publications' | 'search' | 'teams' | 'citations' | 'collaborations' | 'orcid'>('overview');
  
  const [formData, setFormData] = useState({
    display_name: '',
    institution: '',
    department: '',
    orcid_id: '',
    bio: '',
  });

  // Role-based permissions
  const canEditName = true; // Everyone can edit their name
  const canEditInstitution = isAdmin; // Only admins can change institution
  const canEditDepartment = isAdmin || isModerator; // Admins and moderators
  const canEditOrcid = true; // Everyone can edit ORCID
  const canEditBio = true; // Everyone can edit bio

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        institution: profile.institution || '',
        department: profile.department || '',
        orcid_id: profile.orcid_id || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Only include fields the user has permission to edit
    const updates: any = {};
    if (canEditName) updates.display_name = formData.display_name;
    if (canEditInstitution) updates.institution = formData.institution;
    if (canEditDepartment) updates.department = formData.department;
    if (canEditOrcid) updates.orcid_id = formData.orcid_id;
    if (canEditBio) updates.bio = formData.bio;
    
    const { error } = await updateProfile(updates);
    setIsSaving(false);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
      setIsEditing(false);
    }
  };

  const handleOrcidSyncComplete = () => {
    // Refresh profile to get updated publication count
    window.location.reload();
  };

  if (!isOpen || !profile) return null;

  const initials = profile.display_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'R';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'publications', label: 'Publications' },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'citations', label: 'Impact', icon: BarChart3 },
    { id: 'collaborations', label: 'Network' },
    { id: 'orcid', label: 'ORCID', icon: Link2 },
  ] as const;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Panel */}
      <motion.div
        className="fixed right-0 top-0 bottom-0 w-full sm:max-w-3xl glass-panel z-50 overflow-y-auto"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-3 sm:p-6 z-10">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-cyan text-primary-foreground text-sm sm:text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                {isEditing ? (
                  <Input
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    className="text-base sm:text-xl font-display font-bold mb-1"
                  />
                ) : (
                  <h2 className="text-base sm:text-xl font-display font-bold text-foreground truncate">
                    {profile.display_name || 'Researcher'}
                  </h2>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {isEditing ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="hidden sm:flex">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Save</span></>}
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tabs - Horizontal scroll on mobile */}
          <div className="flex gap-1 mt-4 sm:mt-6 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Permissions Info - Show when editing */}
              {isEditing && (
                <div className="glass-panel p-4 bg-primary/5 border-primary/20">
                  <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Edit Permissions
                  </h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>✅ <strong>You can edit:</strong> Name, ORCID, Biography</p>
                    {isModerator && !isAdmin && <p>✅ <strong>Moderator:</strong> Can also edit Department</p>}
                    {isAdmin && <p>✅ <strong>Admin:</strong> Can edit all fields including Institution</p>}
                    {!isModerator && !isAdmin && (
                      <p>🔒 <strong>Locked:</strong> Institution and Department (contact admin to change)</p>
                    )}
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                  icon={Award} 
                  label="H-Index" 
                  value={profile.h_index || 0} 
                  color="primary"
                />
                <StatCard 
                  icon={TrendingUp} 
                  label="Citations" 
                  value={profile.total_citations?.toLocaleString() || '0'} 
                  color="secondary"
                />
                <StatCard 
                  icon={BookOpen} 
                  label="Publications" 
                  value={profile.total_publications || 0} 
                  color="cyan"
                />
                <StatCard 
                  icon={Users} 
                  label="Co-Authors" 
                  value="0" 
                  color="emerald"
                />
              </div>

              {/* Institution Info */}
              <div className="glass-panel p-4 space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Affiliation
                </h3>
                {isEditing ? (
                  <div className="space-y-3">
                    {/* Institution - Admin only */}
                    <div className="relative">
                      <Input
                        placeholder="Institution"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        disabled={!canEditInstitution}
                        className={!canEditInstitution ? 'bg-muted/50 cursor-not-allowed' : ''}
                      />
                      {!canEditInstitution && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Lock className="w-3 h-3" />
                          <span>Admin only</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Department - Admin & Moderator */}
                    <div className="relative">
                      <Input
                        placeholder="Department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        disabled={!canEditDepartment}
                        className={!canEditDepartment ? 'bg-muted/50 cursor-not-allowed' : ''}
                      />
                      {!canEditDepartment && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Lock className="w-3 h-3" />
                          <span>Moderator+</span>
                        </div>
                      )}
                    </div>
                    
                    {/* ORCID - Everyone */}
                    <Input
                      placeholder="ORCID ID"
                      value={formData.orcid_id}
                      onChange={(e) => setFormData({ ...formData, orcid_id: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground">{profile.institution || 'Not specified'}</p>
                    <p className="text-muted-foreground">{profile.department || 'Department not specified'}</p>
                    {profile.orcid_id && (
                      <a 
                        href={`https://orcid.org/${profile.orcid_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        ORCID: {profile.orcid_id}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* H-Index Chart */}
              <div className="glass-panel p-4">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  H-Index Growth
                </h3>
                <HIndexChart />
              </div>

              {/* Bio */}
              <div className="glass-panel p-4">
                <h3 className="font-semibold text-foreground mb-2">Biography</h3>
                {isEditing ? (
                  <textarea
                    className="w-full min-h-[100px] p-3 rounded-lg bg-muted border border-border text-foreground resize-none"
                    placeholder="Tell us about your research interests..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {profile.bio || 'No biography added yet.'}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'publications' && <PublicationTimeline />}
          {activeTab === 'search' && <PublicationSearch />}
          {activeTab === 'teams' && <ResearchTeamsPanel />}
          {activeTab === 'citations' && <CitationImpactTracker />}
          {activeTab === 'collaborations' && <CollaborationMap />}
          {activeTab === 'orcid' && (
            <OrcidSync 
              currentOrcidId={profile.orcid_id} 
              onSyncComplete={handleOrcidSyncComplete} 
            />
          )}
        </div>
      </motion.div>
    </>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  color: 'primary' | 'secondary' | 'cyan' | 'emerald';
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    cyan: 'bg-cyan/10 text-cyan',
    emerald: 'bg-emerald/10 text-emerald',
  };

  return (
    <div className="glass-panel p-3 sm:p-4">
      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-2 sm:mb-3`}>
        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
      </div>
      <p className="text-lg sm:text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
