import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Download, 
  Shield, 
  TrendingUp,
  BookOpen,
  Building2,
  UserCog,
  Brain,
  Network,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AdminUserManagement from '@/components/admin/AdminUserManagement';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminReports from '@/components/admin/AdminReports';
import CollaborationNetwork from '@/components/CollaborationNetwork';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPublications: 0,
    totalChatSessions: 0,
    totalDashboards: 0,
    avgHIndex: 0,
    totalCitations: 0,
    activeResearchers: 0
  });

  useEffect(() => {
    async function fetchStats() {
      if (!isAdmin) return;

      try {
        console.log('Fetching admin stats from database...');
        
        // Fetch counts with no cache
        const [usersRes, pubsRes, chatsRes, dashboardsRes] = await Promise.all([
          supabase.from('profiles').select('id, h_index, total_citations, updated_at', { count: 'exact' }),
          supabase.from('researcher_publications').select('id', { count: 'exact', head: true }),
          supabase.from('chat_history').select('id', { count: 'exact', head: true }),
          supabase.from('saved_dashboards').select('id', { count: 'exact', head: true })
        ]);

        console.log('Database results:', {
          users: usersRes.count,
          publications: pubsRes.count,
          chats: chatsRes.count,
          dashboards: dashboardsRes.count
        });

        // Calculate average H-Index and total citations
        const profiles = usersRes.data || [];
        const avgHIndex = profiles.length > 0
          ? profiles.reduce((sum, p) => sum + (p.h_index || 0), 0) / profiles.length
          : 0;
        
        const totalCitations = profiles.reduce((sum, p) => sum + (p.total_citations || 0), 0);
        
        // Count active researchers (updated in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activeResearchers = profiles.filter(p => 
          p.updated_at && new Date(p.updated_at) > thirtyDaysAgo
        ).length;

        setStats({
          totalUsers: usersRes.count || 0,
          totalPublications: pubsRes.count || 0,
          totalChatSessions: chatsRes.count || 0,
          totalDashboards: dashboardsRes.count || 0,
          avgHIndex: Math.round(avgHIndex * 10) / 10,
          totalCitations: totalCitations,
          activeResearchers: activeResearchers
        });
        
        console.log('Stats updated:', {
          totalPublications: pubsRes.count || 0,
          avgHIndex: Math.round(avgHIndex * 10) / 10,
          totalCitations: totalCitations
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    }

    fetchStats();
  }, [isAdmin]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log('Manual refresh triggered...');
      
      const [usersRes, pubsRes, chatsRes, dashboardsRes] = await Promise.all([
        supabase.from('profiles').select('id, h_index, total_citations, updated_at', { count: 'exact' }),
        supabase.from('researcher_publications').select('id', { count: 'exact', head: true }),
        supabase.from('chat_history').select('id', { count: 'exact', head: true }),
        supabase.from('saved_dashboards').select('id', { count: 'exact', head: true })
      ]);

      const profiles = usersRes.data || [];
      const avgHIndex = profiles.length > 0
        ? profiles.reduce((sum, p) => sum + (p.h_index || 0), 0) / profiles.length
        : 0;
      
      const totalCitations = profiles.reduce((sum, p) => sum + (p.total_citations || 0), 0);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeResearchers = profiles.filter(p => 
        p.updated_at && new Date(p.updated_at) > thirtyDaysAgo
      ).length;

      setStats({
        totalUsers: usersRes.count || 0,
        totalPublications: pubsRes.count || 0,
        totalChatSessions: chatsRes.count || 0,
        totalDashboards: dashboardsRes.count || 0,
        avgHIndex: Math.round(avgHIndex * 10) / 10,
        totalCitations: totalCitations,
        activeResearchers: activeResearchers
      });
      
      console.log('Refreshed stats:', {
        publications: pubsRes.count,
        citations: totalCitations,
        hIndex: Math.round(avgHIndex * 10) / 10
      });
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

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
            Please sign in to access the admin dashboard.
          </p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-display font-bold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-4">
            You don't have permission to access the admin dashboard.
          </p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Active Researchers', value: stats.activeResearchers, icon: Users, color: 'primary', total: stats.totalUsers },
    { label: 'Total Publications', value: stats.totalPublications, icon: BookOpen, color: 'cyan' },
    { label: 'Avg. H-Index', value: stats.avgHIndex, icon: TrendingUp, color: 'secondary' },
    { label: 'Total Citations', value: stats.totalCitations.toLocaleString(), icon: BarChart3, color: 'emerald' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              University-wide research analytics and user management
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
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
                    {stat.total && ` (${stat.total} total)`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="glass-panel p-1">
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="gap-2">
              <Network className="w-4 h-4" />
              Collaboration
            </TabsTrigger>
            <TabsTrigger value="ai-predictions" className="gap-2">
              <Brain className="w-4 h-4" />
              AI Predictions
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <UserCog className="w-4 h-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <Download className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="collaboration">
            <div className="glass-panel p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Network className="w-5 h-5" />
                University-wide Collaboration Network
              </h3>
              <CollaborationNetwork />
            </div>
          </TabsContent>

          <TabsContent value="ai-predictions">
            <div className="glass-panel p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Predictive Analytics & Insights
              </h3>
              <PredictiveAnalytics />
            </div>
          </TabsContent>

          <TabsContent value="users">
            <AdminUserManagement />
          </TabsContent>

          <TabsContent value="reports">
            <AdminReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
