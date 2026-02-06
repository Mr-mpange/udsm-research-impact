import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const COLORS = {
  primary: '#3b82f6',
  secondary: '#fbbf24',
  cyan: '#06b6d4',
  emerald: '#10b981',
  purple: '#8b5cf6',
  coral: '#f97316'
};

const QUARTILE_COLORS = ['#3b82f6', '#06b6d4', '#fbbf24', '#f97316'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  
  return (
    <div className="glass-panel px-4 py-3">
      <p className="font-display font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="text-foreground font-medium">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function CitationTrendChart({ data }: { data: any[] }) {
  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
        Citation Growth Trend
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Your citation and publication history
      </p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="citationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="paperGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 18%)" />
            <XAxis 
              dataKey="year" 
              stroke="hsl(215 20% 65%)"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(215 20% 65%)"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="citations"
              stroke={COLORS.primary}
              strokeWidth={2}
              fill="url(#citationGradient)"
              name="Citations"
            />
            <Area
              type="monotone"
              dataKey="papers"
              stroke={COLORS.secondary}
              strokeWidth={2}
              fill="url(#paperGradient)"
              name="Papers"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function QuartileDistributionChart({ data }: { data: any[] }) {
  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
        Publication Impact Distribution
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Based on citation counts
      </p>
      <div className="h-[280px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="count"
              nameKey="quartile"
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={QUARTILE_COLORS[index]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        {data.map((item, index) => (
          <div key={item.quartile} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: QUARTILE_COLORS[index] }}
            />
            <span className="text-sm text-muted-foreground">
              {item.quartile} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TopicRadarChart({ data }: { data: any[] }) {
  const radarData = data.map(item => ({
    topic: item.topic.split(' ')[0],
    fullTopic: item.topic,
    papers: item.papers,
    citations: item.citations / 10 // Scale down for better visualization
  }));

  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
        Research Focus Areas
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Top journals by publication count
      </p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(222 47% 18%)" />
            <PolarAngleAxis 
              dataKey="topic" 
              stroke="hsl(215 20% 65%)"
              fontSize={11}
            />
            <PolarRadiusAxis 
              stroke="hsl(215 20% 65%)"
              fontSize={10}
            />
            <Radar
              name="Papers"
              dataKey="papers"
              stroke={COLORS.primary}
              fill={COLORS.primary}
              fillOpacity={0.3}
            />
            <Radar
              name="Citations"
              dataKey="citations"
              stroke={COLORS.secondary}
              fill={COLORS.secondary}
              fillOpacity={0.3}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function MonthlyReadershipChart({ data }: { data: any[] }) {
  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
        Monthly Engagement
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Estimated reads and downloads this year
      </p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 18%)" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(215 20% 65%)"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(215 20% 65%)"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="reads" 
              fill={COLORS.primary} 
              name="Reads"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="downloads" 
              fill={COLORS.cyan} 
              name="Downloads"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default function AnalyticsCharts() {
  const { user } = useAuth();
  const [citationTrends, setCitationTrends] = useState<any[]>([]);
  const [quartileDistribution, setQuartileDistribution] = useState<any[]>([]);
  const [topicDistribution, setTopicDistribution] = useState<any[]>([]);
  const [monthlyReadership, setMonthlyReadership] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);

      // Fetch user's publications
      const { data: publications, error } = await supabase
        .from('researcher_publications')
        .select('*')
        .eq('user_id', user!.id)
        .order('year', { ascending: true });

      if (error) throw error;

      if (publications && publications.length > 0) {
        // Process citation trends by year
        const trendsByYear = processCitationTrends(publications);
        setCitationTrends(trendsByYear);

        // Process quartile distribution
        const quartiles = processQuartileDistribution(publications);
        setQuartileDistribution(quartiles);

        // Process topic distribution (from keywords or journals)
        const topics = processTopicDistribution(publications);
        setTopicDistribution(topics);

        // Generate monthly readership (simulated from citations)
        const monthly = generateMonthlyReadership(publications);
        setMonthlyReadership(monthly);
      } else {
        // Set empty data if no publications
        setCitationTrends([]);
        setQuartileDistribution([]);
        setTopicDistribution([]);
        setMonthlyReadership([]);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processCitationTrends = (publications: any[]) => {
    const yearMap = new Map<number, { citations: number; papers: number }>();

    publications.forEach(pub => {
      const year = pub.year || new Date().getFullYear();
      const existing = yearMap.get(year) || { citations: 0, papers: 0 };
      yearMap.set(year, {
        citations: existing.citations + (pub.citations || 0),
        papers: existing.papers + 1
      });
    });

    return Array.from(yearMap.entries())
      .map(([year, data]) => ({
        year: year.toString(),
        citations: data.citations,
        papers: data.papers
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  };

  const processQuartileDistribution = (publications: any[]) => {
    const quartileCounts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    
    publications.forEach(pub => {
      // Estimate quartile based on citations (simple heuristic)
      const citations = pub.citations || 0;
      if (citations > 50) quartileCounts.Q1++;
      else if (citations > 20) quartileCounts.Q2++;
      else if (citations > 5) quartileCounts.Q3++;
      else quartileCounts.Q4++;
    });

    const total = publications.length || 1;
    return [
      { quartile: 'Q1', count: quartileCounts.Q1, percentage: Math.round((quartileCounts.Q1 / total) * 100) },
      { quartile: 'Q2', count: quartileCounts.Q2, percentage: Math.round((quartileCounts.Q2 / total) * 100) },
      { quartile: 'Q3', count: quartileCounts.Q3, percentage: Math.round((quartileCounts.Q3 / total) * 100) },
      { quartile: 'Q4', count: quartileCounts.Q4, percentage: Math.round((quartileCounts.Q4 / total) * 100) },
    ];
  };

  const processTopicDistribution = (publications: any[]) => {
    const journalMap = new Map<string, { papers: number; citations: number }>();

    publications.forEach(pub => {
      const journal = pub.journal || 'Other';
      const existing = journalMap.get(journal) || { papers: 0, citations: 0 };
      journalMap.set(journal, {
        papers: existing.papers + 1,
        citations: existing.citations + (pub.citations || 0)
      });
    });

    return Array.from(journalMap.entries())
      .map(([topic, data]) => ({
        topic: topic.length > 30 ? topic.substring(0, 30) + '...' : topic,
        papers: data.papers,
        citations: data.citations
      }))
      .sort((a, b) => b.papers - a.papers)
      .slice(0, 6); // Top 6 journals
  };

  const generateMonthlyReadership = (publications: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    // Simulate monthly data based on total citations
    const totalCitations = publications.reduce((sum, pub) => sum + (pub.citations || 0), 0);
    const avgPerMonth = Math.floor(totalCitations / 12);

    return months.map((month, index) => ({
      month,
      reads: avgPerMonth + Math.floor(Math.random() * avgPerMonth * 0.3),
      downloads: Math.floor(avgPerMonth * 0.6) + Math.floor(Math.random() * avgPerMonth * 0.2)
    }));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-panel p-6 h-[380px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading analytics...</div>
          </div>
        ))}
      </div>
    );
  }

  if (citationTrends.length === 0) {
    return (
      <div className="glass-panel p-6 text-center">
        <p className="text-muted-foreground">No publication data available yet. Add publications to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CitationTrendChart data={citationTrends} />
      <QuartileDistributionChart data={quartileDistribution} />
      <TopicRadarChart data={topicDistribution} />
      <MonthlyReadershipChart data={monthlyReadership} />
    </div>
  );
}
