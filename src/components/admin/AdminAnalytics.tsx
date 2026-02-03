import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Building2, 
  Globe,
  Award,
  Activity,
  Clock,
  Crown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

// Aggregate mock data for institution-wide analytics
const monthlyGrowth = [
  { month: 'Jul', users: 45, publications: 89, citations: 234 },
  { month: 'Aug', users: 52, publications: 102, citations: 289 },
  { month: 'Sep', users: 61, publications: 98, citations: 312 },
  { month: 'Oct', users: 73, publications: 125, citations: 378 },
  { month: 'Nov', users: 82, publications: 134, citations: 412 },
  { month: 'Dec', users: 95, publications: 156, citations: 489 },
  { month: 'Jan', users: 108, publications: 178, citations: 534 }
];

const departmentData = [
  { name: 'Engineering', value: 678, fill: 'hsl(var(--primary))' },
  { name: 'Health Sciences', value: 523, fill: 'hsl(var(--cyan))' },
  { name: 'Natural Sciences', value: 456, fill: 'hsl(var(--secondary))' },
  { name: 'Social Sciences', value: 389, fill: 'hsl(var(--emerald))' },
  { name: 'Agriculture', value: 234, fill: 'hsl(var(--gold))' }
];

const journalQuartiles = [
  { quartile: 'Q1', count: 423, color: 'hsl(var(--emerald))' },
  { quartile: 'Q2', count: 567, color: 'hsl(var(--primary))' },
  { quartile: 'Q3', count: 389, color: 'hsl(var(--secondary))' },
  { quartile: 'Q4', count: 156, color: 'hsl(var(--muted-foreground))' }
];

interface TopResearcher {
  id: string;
  user_id: string;
  display_name: string;
  department: string | null;
  h_index: number;
  total_citations: number;
  total_publications: number;
}

interface RecentActivity {
  id: string;
  type: 'profile_update' | 'publication_added' | 'team_created' | 'chat_session';
  user_name: string;
  description: string;
  timestamp: string;
}

interface ModerationItem {
  id: string;
  type: 'publication' | 'team' | 'chat';
  title: string;
  user_name: string;
  created_at: string;
  status: 'pending' | 'approved' | 'flagged';
}

export default function AdminAnalytics() {
  const [realStats, setRealStats] = useState({
    totalUsers: 0,
    totalPublications: 0,
    avgHIndex: 0
  });
  const [topResearchers, setTopResearchers] = useState<TopResearcher[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setIsLoading(true);
    await Promise.all([
      fetchRealStats(),
      fetchTopResearchers(),
      fetchRecentActivity(),
      fetchModerationItems()
    ]);
    setIsLoading(false);
  }

  async function fetchRealStats() {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('h_index, total_publications, total_citations');

    if (profiles) {
      const totalUsers = profiles.length;
      const totalPublications = profiles.reduce((acc, p) => acc + (p.total_publications || 0), 0);
      const avgHIndex = profiles.length > 0 
        ? profiles.reduce((acc, p) => acc + (p.h_index || 0), 0) / profiles.length 
        : 0;

      setRealStats({ totalUsers, totalPublications, avgHIndex: Math.round(avgHIndex * 10) / 10 });
    }
  }

  async function fetchTopResearchers() {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, user_id, display_name, department, h_index, total_citations, total_publications')
      .order('h_index', { ascending: false })
      .limit(10);

    if (profiles) {
      setTopResearchers(profiles as TopResearcher[]);
    }
  }

  async function fetchRecentActivity() {
    // Fetch recent profile updates
    const { data: recentProfiles } = await supabase
      .from('profiles')
      .select('id, display_name, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5);

    // Fetch recent publications
    const { data: recentPubs } = await supabase
      .from('researcher_publications')
      .select('id, title, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(5);

    // Fetch recent teams
    const { data: recentTeams } = await supabase
      .from('research_teams')
      .select('id, name, created_at, owner_id')
      .order('created_at', { ascending: false })
      .limit(3);

    // Combine and sort activity
    const activities: RecentActivity[] = [];

    recentProfiles?.forEach(p => {
      activities.push({
        id: `profile-${p.id}`,
        type: 'profile_update',
        user_name: p.display_name || 'Unknown',
        description: 'Updated their profile',
        timestamp: p.updated_at
      });
    });

    recentPubs?.forEach(p => {
      activities.push({
        id: `pub-${p.id}`,
        type: 'publication_added',
        user_name: 'Researcher',
        description: `Added publication: ${p.title.substring(0, 40)}...`,
        timestamp: p.created_at
      });
    });

    recentTeams?.forEach(t => {
      activities.push({
        id: `team-${t.id}`,
        type: 'team_created',
        user_name: 'Researcher',
        description: `Created team: ${t.name}`,
        timestamp: t.created_at
      });
    });

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setRecentActivity(activities.slice(0, 10));
  }

  async function fetchModerationItems() {
    // Fetch recent publications for review
    const { data: pubs } = await supabase
      .from('researcher_publications')
      .select('id, title, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(5);

    // Fetch recent teams for review
    const { data: teams } = await supabase
      .from('research_teams')
      .select('id, name, created_at, owner_id')
      .order('created_at', { ascending: false })
      .limit(3);

    const items: ModerationItem[] = [];

    pubs?.forEach(p => {
      items.push({
        id: p.id,
        type: 'publication',
        title: p.title,
        user_name: 'Researcher',
        created_at: p.created_at,
        status: 'pending'
      });
    });

    teams?.forEach(t => {
      items.push({
        id: t.id,
        type: 'team',
        title: t.name,
        user_name: 'Owner',
        created_at: t.created_at,
        status: 'approved'
      });
    });

    setModerationItems(items);
  }

  async function handleDeletePublication(id: string) {
    const { error } = await supabase
      .from('researcher_publications')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete publication'
      });
    } else {
      toast({
        title: 'Success',
        description: 'Publication deleted'
      });
      setModerationItems(prev => prev.filter(item => item.id !== id));
    }
  }

  async function handleDeleteTeam(id: string) {
    const { error } = await supabase
      .from('research_teams')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete team'
      });
    } else {
      toast({
        title: 'Success',
        description: 'Team deleted'
      });
      setModerationItems(prev => prev.filter(item => item.id !== id));
    }
  }

  const activityIcons = {
    profile_update: Users,
    publication_added: BookOpen,
    team_created: Building2,
    chat_session: Activity
  };

  const activityColors = {
    profile_update: 'text-primary',
    publication_added: 'text-cyan',
    team_created: 'text-secondary',
    chat_session: 'text-emerald'
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          className="glass-panel p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Active Researchers</span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">
            {realStats.totalUsers || 156}
          </p>
          <p className="text-xs text-emerald mt-1">+12% from last month</p>
        </motion.div>

        <motion.div
          className="glass-panel p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-cyan/20">
              <BookOpen className="w-5 h-5 text-cyan" />
            </div>
            <span className="text-sm text-muted-foreground">Total Publications</span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">
            {realStats.totalPublications || 4523}
          </p>
          <p className="text-xs text-emerald mt-1">+8% from last month</p>
        </motion.div>

        <motion.div
          className="glass-panel p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-secondary/20">
              <Award className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-sm text-muted-foreground">Avg. H-Index</span>
          </div>
          <p className="font-display text-3xl font-bold text-foreground">
            {realStats.avgHIndex || 18.4}
          </p>
          <p className="text-xs text-emerald mt-1">+5% improvement</p>
        </motion.div>
      </div>

      {/* Top Researchers & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Researchers Leaderboard */}
        <motion.div
          className="glass-panel p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold" />
              Top Researchers
            </h3>
            <Button variant="ghost" size="sm" onClick={fetchTopResearchers}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {topResearchers.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No researchers found
                </p>
              ) : (
                topResearchers.map((researcher, index) => (
                  <motion.div
                    key={researcher.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-gold/20 text-gold' :
                      index === 1 ? 'bg-muted text-muted-foreground' :
                      index === 2 ? 'bg-secondary/20 text-secondary' :
                      'bg-muted/50 text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {researcher.display_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {researcher.department || 'No department'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{researcher.h_index || 0}</p>
                      <p className="text-xs text-muted-foreground">H-Index</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="glass-panel p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald" />
              Recent Activity
            </h3>
            <Button variant="ghost" size="sm" onClick={fetchRecentActivity}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity, index) => {
                  const Icon = activityIcons[activity.type];
                  const colorClass = activityColors[activity.type];
                  
                  return (
                    <motion.div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <div className={`p-2 rounded-lg bg-muted/50 ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{activity.user_name}</span>
                          {' '}{activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </motion.div>
      </div>

      {/* Moderation Tools */}
      <motion.div
        className="glass-panel p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-secondary" />
            Content Moderation
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-emerald border-emerald/30">
              {moderationItems.filter(i => i.status === 'approved').length} Approved
            </Badge>
            <Badge variant="outline" className="text-secondary border-secondary/30">
              {moderationItems.filter(i => i.status === 'pending').length} Pending
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          {moderationItems.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No items to moderate
            </p>
          ) : (
            moderationItems.slice(0, 5).map((item, index) => (
              <motion.div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <div className={`p-2 rounded-lg ${
                  item.type === 'publication' ? 'bg-cyan/20' :
                  item.type === 'team' ? 'bg-secondary/20' : 'bg-primary/20'
                }`}>
                  {item.type === 'publication' ? (
                    <BookOpen className="w-4 h-4 text-cyan" />
                  ) : item.type === 'team' ? (
                    <Building2 className="w-4 h-4 text-secondary" />
                  ) : (
                    <Activity className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • 
                    {' '}{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    item.status === 'approved' ? 'text-emerald border-emerald/30' :
                    item.status === 'flagged' ? 'text-destructive border-destructive/30' :
                    'text-secondary border-secondary/30'
                  }
                >
                  {item.status}
                </Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => {
                      if (item.type === 'publication') {
                        handleDeletePublication(item.id);
                      } else if (item.type === 'team') {
                        handleDeleteTeam(item.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Trends */}
        <div className="glass-panel p-6">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Growth Trends
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyGrowth}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--cyan))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--cyan))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorUsers)" 
                name="Researchers"
              />
              <Area 
                type="monotone" 
                dataKey="publications" 
                stroke="hsl(var(--cyan))" 
                fillOpacity={1} 
                fill="url(#colorPubs)" 
                name="Publications"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="glass-panel p-6">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan" />
            Publications by Department
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {departmentData.map((dept) => (
              <div key={dept.name} className="flex items-center gap-2 text-xs">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: dept.fill }}
                />
                <span className="text-muted-foreground">{dept.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journal Quartiles */}
      <div className="glass-panel p-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-secondary" />
          Journal Quartile Distribution
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={journalQuartiles} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="quartile" type="category" stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {journalQuartiles.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
