import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Building2, 
  Globe,
  Award
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

export default function AdminAnalytics() {
  const [realStats, setRealStats] = useState({
    totalUsers: 0,
    totalPublications: 0,
    avgHIndex: 0
  });

  useEffect(() => {
    async function fetchRealStats() {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('h_index, total_publications');

      if (profiles) {
        const totalUsers = profiles.length;
        const totalPublications = profiles.reduce((acc, p) => acc + (p.total_publications || 0), 0);
        const avgHIndex = profiles.length > 0 
          ? profiles.reduce((acc, p) => acc + (p.h_index || 0), 0) / profiles.length 
          : 0;

        setRealStats({ totalUsers, totalPublications, avgHIndex: Math.round(avgHIndex * 10) / 10 });
      }
    }

    fetchRealStats();
  }, []);

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
