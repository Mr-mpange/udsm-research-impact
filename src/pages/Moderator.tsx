import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  FileText, 
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Network,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import UserMenu from '@/components/auth/UserMenu';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import CollaborationNetwork from '@/components/CollaborationNetwork';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

export default function Moderator() {
  const { user, isLoading: authLoading } = useAuth();
  const { isModerator, isAdmin, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPublications: 0,
    pendingReviews: 0,
    totalResearchers: 0,
    activeTeams: 0,
    avgCitations: 0,
    recentActivity: 0
  });

  useEffect(() => {
    async function fetchModeratorStats() {
      if (!isModerator && !isAdmin) return;

      try {
        // Fetch publications
        const { count: pubCount } = await supabase
          .from('researcher_publications')
          .select('*', { count: 'exact', head: true });

        // Fetch researchers
        const { count: researcherCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch research teams
        const { count: teamCount } = await supabase
          .from('research_teams')
          .select('*', { count: 'exact', head: true });

        // Calculate average citations
        const { data: publications } = await supabase
          .from('researcher_publications')
          .select('citations');
        
        const avgCitations = publications && publications.length > 0
          ? Math.round(publications.reduce((sum, p) => sum + (p.citations || 0), 0) / publications.length)
          : 0;

        setStats({
          totalPublications: pubCount || 0,
          pendingReviews: 0, // Placeholder - implement review system
          totalResearchers: researcherCount || 0,
          activeTeams: teamCount || 0,
          avgCitations: avgCitations,
          recentActivity: 0 // Placeholder
        });
      } catch (error) {
        console.error('Error fetching moderator stats:', error);
      }
    }

    fetchModeratorStats();
  }, [isModerator, isAdmin]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-xl font-display font-bold text-foreground mb-2">
            Authentication Required
          </h1>
          <p className="text-muted-foreground mb-4">
            Please sign in to access the moderator dashboard.
          </p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  if (!isModerator && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-display font-bold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access the moderator dashboard.
          </p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Publications', value: stats.totalPublications, icon: BookOpen, color: 'primary' },
    { label: 'Active Researchers', value: stats.totalResearchers, icon: Users, color: 'cyan' },
    { label: 'Research Teams', value: stats.activeTeams, icon: Network, color: 'secondary' },
    { label: 'Avg. Citations', value: stats.avgCitations, icon: TrendingUp, color: 'emerald' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              <Shield className="w-8 h-8 text-secondary" />
              Moderator Dashboard
            </h1>
            <p className="text-muted-foreground">
              Content moderation and research oversight
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline"
                className="gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Button>
            )}
            <NotificationsPanel />
            <UserMenu onOpenProfile={() => navigate('/dashboard')} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-panel p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${stat.color}/20`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                </div>
                <div>
                  <p className="font-display font-bold text-2xl text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass-panel p-1">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="publications" className="gap-2">
              <FileText className="w-4 h-4" />
              Publications
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="gap-2">
              <Network className="w-4 h-4" />
              Collaboration
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6">
              {/* Quick Actions */}
              <div className="glass-panel p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <FileText className="w-6 h-6" />
                    <span>Review Publications</span>
                    <span className="text-xs text-muted-foreground">
                      {stats.pendingReviews} pending
                    </span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Users className="w-6 h-6" />
                    <span>Manage Teams</span>
                    <span className="text-xs text-muted-foreground">
                      {stats.activeTeams} active
                    </span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <BarChart3 className="w-6 h-6" />
                    <span>View Reports</span>
                    <span className="text-xs text-muted-foreground">
                      Generate insights
                    </span>
                  </Button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-panel p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">System is running smoothly</p>
                      <p className="text-xs text-muted-foreground">All services operational</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{stats.totalPublications} publications tracked</p>
                      <p className="text-xs text-muted-foreground">Across all researchers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Users className="w-5 h-5 text-cyan-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{stats.totalResearchers} active researchers</p>
                      <p className="text-xs text-muted-foreground">Contributing to the platform</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="publications">
            <div className="glass-panel p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Publication Management
              </h3>
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Publication review system coming soon
                </p>
                <p className="text-sm text-muted-foreground">
                  Currently showing {stats.totalPublications} publications in the system
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collaboration">
            <div className="glass-panel p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Network className="w-5 h-5" />
                Collaboration Network
              </h3>
              <CollaborationNetwork />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
