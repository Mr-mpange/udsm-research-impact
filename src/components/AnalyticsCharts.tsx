import { motion } from 'framer-motion';
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
import { 
  citationTrends, 
  quartileDistribution, 
  topicDistribution,
  monthlyReadership 
} from '@/data/researchData';

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

function CitationTrendChart() {
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
        10-year citation and publication analysis
      </p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={citationTrends}>
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

function QuartileDistributionChart() {
  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
        Journal Quartile Distribution
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Publication quality metrics
      </p>
      <div className="h-[280px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={quartileDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="count"
              nameKey="quartile"
            >
              {quartileDistribution.map((_, index) => (
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
        {quartileDistribution.map((item, index) => (
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

function TopicRadarChart() {
  const radarData = topicDistribution.map(item => ({
    topic: item.topic.split(' ')[0],
    fullTopic: item.topic,
    papers: item.papers,
    citations: item.citations / 100
  }));

  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3 className="font-display font-semibold text-lg text-foreground mb-1">
        Research Discipline Strength
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Topic influence radar analysis
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

function MonthlyReadershipChart() {
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
        Global reads and downloads this year
      </p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyReadership}>
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CitationTrendChart />
      <QuartileDistributionChart />
      <TopicRadarChart />
      <MonthlyReadershipChart />
    </div>
  );
}
