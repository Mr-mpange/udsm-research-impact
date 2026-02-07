import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, BookOpen, Users, TrendingUp, Building2, 
  Search, BarChart3, Link2, FileText,
  UserPlus, Bell, Shield, Brain, Network
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserMenu from '@/components/auth/UserMenu';
import PublicationTimeline from '@/components/profile/PublicationTimeline';
import CollaborationMap from '@/components/profile/CollaborationMap';
import HIndexChart from '@/components/profile/HIndexChart';
import OrcidSync from '@/components/profile/OrcidSync';
import PublicationSearch from '@/components/publications/PublicationSearch';
import ResearchTeamsPanel from '@/components/teams/ResearchTeamsPanel';
import CitationImpactTracker from '@/components/citations/CitationImpactTracker';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import CollaborationNetwork from '@/components/CollaborationNetwork';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';

type TabId = 'overview' | 'analytics' | 'collaboration' | 'ai-predictions' | 'publications' | 'search' | 'teams' | 'citations' | 'collaborations' | 'orcid';

const tabs = [
  { id: 'overview' as TabId, label: 'Overview', icon: BarChart3 },
  { id: 'analytics' as TabId, label: 'Analytics', icon: TrendingUp },
  { id: 'collaboration' as TabId, label: 'Collaboration', icon: Network },
  { id: 'ai-predictions' as TabId, label: 'AI Predictions', icon: Brain },
  { id: 'publications' as TabId, label: 'Publications', icon: BookOpen },
  { id: 'search' as TabId, label: 'Search', icon: Search },
  { id: 'teams' as TabId, label: 'Teams', icon: Users },
  { id: 'citations' as TabId, label: 'Impact', icon: Award },
  { id: 'orcid' as TabId, label: 'ORCID', icon: Link2 },
];

export default function Dashboard() {
  const { user, profile, isLoading } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const initials = profile.display_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'R';

  const handleOrcidSyncComplete = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-50 glass-panel m-4 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-cyan text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-display font-bold text-lg text-foreground">
                  {profile.display_name || 'Researcher Dashboard'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {profile.institution || 'Your research hub'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Admin Access Button */}
              {isAdmin && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Button>
              )}
              
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-4 mr-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">H-Index: {profile.h_index || 0}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10">
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium text-foreground">{profile.total_citations?.toLocaleString() || 0} Citations</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan/10">
                  <BookOpen className="w-4 h-4 text-cyan" />
                  <span className="text-sm font-medium text-foreground">{profile.total_publications || 0} Papers</span>
                </div>
              </div>
              <NotificationsPanel />
              <UserMenu onOpenProfile={() => setActiveTab('overview')} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Vertical Sidebar Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="glass-panel p-4 sticky top-28">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 min-w-0">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard 
                        icon={Award} 
                        label="H-Index" 
                        value={profile.h_index || 0} 
                        trend=""
                        color="primary"
                      />
                      <StatCard 
                        icon={TrendingUp} 
                        label="Citations" 
                        value={profile.total_citations?.toLocaleString() || '0'} 
                        trend=""
                        color="secondary"
                      />
                      <StatCard 
                        icon={BookOpen} 
                        label="Publications" 
                        value={profile.total_publications || 0} 
                        trend=""
                        color="cyan"
                      />
                      <StatCard 
                        icon={Users} 
                        label="Co-Authors" 
                        value="0" 
                        trend=""
                        color="emerald"
                      />
                    </div>

                    {/* Institution Info */}
                    <div className="glass-panel p-6">
                      <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                        <Building2 className="w-4 h-4" />
                        Affiliation
                      </h3>
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
                          </a>
                        )}
                      </div>
                    </div>

                    {/* H-Index Chart */}
                    <div className="glass-panel p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        H-Index Growth
                      </h3>
                      <HIndexChart />
                    </div>

                    {/* Bio */}
                    <div className="glass-panel p-6">
                      <h3 className="font-semibold text-foreground mb-2">Biography</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.bio || 'No biography added yet. Update your profile to add one.'}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="glass-panel p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Research Analytics
                    </h3>
                    <AnalyticsCharts />
                  </div>
                )}
                
                {activeTab === 'collaboration' && (
                  <div className="glass-panel p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Network className="w-5 h-5" />
                      Collaboration Network
                    </h3>
                    <CollaborationNetwork />
                  </div>
                )}
                
                {activeTab === 'ai-predictions' && (
                  <div className="glass-panel p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI-Powered Predictions
                    </h3>
                    <PredictiveAnalytics />
                  </div>
                )}

                {activeTab === 'publications' && (
                  <div className="glass-panel p-6">
                    <PublicationTimeline />
                  </div>
                )}
                
                {activeTab === 'search' && (
                  <div className="glass-panel p-6">
                    <PublicationSearch />
                  </div>
                )}
                
                {activeTab === 'teams' && (
                  <div className="glass-panel p-6">
                    <ResearchTeamsPanel />
                  </div>
                )}
                
                {activeTab === 'citations' && (
                  <div className="glass-panel p-6">
                    <CitationImpactTracker />
                  </div>
                )}
                
                {activeTab === 'collaborations' && (
                  <div className="glass-panel p-6">
                    <CollaborationMap />
                  </div>
                )}
                
                {activeTab === 'orcid' && (
                  <div className="glass-panel p-6">
                    <OrcidSync 
                      currentOrcidId={profile.orcid_id} 
                      onSyncComplete={handleOrcidSyncComplete} 
                    />
                  </div>
                )}
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  color 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number; 
  trend: string;
  color: 'primary' | 'secondary' | 'cyan' | 'emerald';
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    cyan: 'bg-cyan/10 text-cyan',
    emerald: 'bg-emerald/10 text-emerald',
  };

  return (
    <motion.div 
      className="glass-panel p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xs text-emerald mt-1">{trend}</p>
    </motion.div>
  );
}
