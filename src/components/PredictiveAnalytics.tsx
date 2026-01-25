import { motion } from 'framer-motion';
import { predictions } from '@/data/researchData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Lightbulb, Users, AlertCircle } from 'lucide-react';

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

function CitationForecast() {
  const data = predictions.citationGrowth.map(item => ({
    year: item.year.toString(),
    predicted: item.predicted,
    lower: item.lower,
    upper: item.upper
  }));

  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 rounded-lg bg-primary/20 text-primary">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground">
          Citation Forecast (2025-2029)
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6 ml-12">
        ML-powered prediction with confidence intervals
      </p>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
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
              dataKey="upper"
              stroke="transparent"
              fill="url(#confidenceGradient)"
              name="Upper Bound"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="transparent"
              fill="hsl(222 47% 6%)"
              name="Lower Bound"
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#3b82f6"
              strokeWidth={3}
              strokeDasharray="8 4"
              fill="url(#forecastGradient)"
              name="Predicted"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function EmergingTopics() {
  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground">
          Emerging Research Topics
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6 ml-12">
        High-growth areas for strategic investment
      </p>
      <div className="space-y-4">
        {predictions.emergingTopics.map((topic, index) => (
          <motion.div
            key={topic.topic}
            className="p-4 rounded-lg bg-muted/50 border border-border"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">{topic.topic}</span>
              <span className="text-sm text-emerald font-semibold">
                +{topic.growthRate}% growth
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-cyan rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.confidence * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {(topic.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PartnerRecommendations() {
  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 rounded-lg bg-purple/20 text-purple">
          <Users className="w-5 h-5" />
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground">
          Strategic Partner Recommendations
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6 ml-12">
        AI-identified collaboration opportunities
      </p>
      <div className="space-y-4">
        {predictions.partnerRecommendations.map((partner, index) => (
          <motion.div
            key={partner.institution}
            className="p-4 rounded-lg bg-gradient-to-r from-muted/50 to-transparent border border-border hover:border-primary/30 transition-colors cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">
                {partner.institution}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary font-semibold">
                  {(partner.score * 100).toFixed(0)}% match
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{partner.reason}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ScenarioSimulator() {
  const scenarios = [
    { 
      name: 'Open Access +20%', 
      rankingChange: '+5 positions',
      impact: 'positive',
      description: 'Increasing open access publications improves global visibility'
    },
    { 
      name: 'Asia Collaboration x2', 
      rankingChange: '+8 positions',
      impact: 'positive',
      description: 'Doubling Asian partnerships expands research network reach'
    },
    { 
      name: 'Q1 Publications +30%', 
      rankingChange: '+12 positions',
      impact: 'positive',
      description: 'Higher quality journal targeting elevates institutional prestige'
    },
  ];

  return (
    <motion.div
      className="glass-panel-gold p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground">
          Ranking Impact Simulator
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6 ml-12">
        "What-if" analysis for strategic planning
      </p>
      <div className="space-y-3">
        {scenarios.map((scenario, index) => (
          <motion.div
            key={scenario.name}
            className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <div>
              <p className="font-medium text-foreground">{scenario.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {scenario.description}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-display font-bold text-emerald">
                {scenario.rankingChange}
              </span>
              <p className="text-xs text-muted-foreground">QS/THE Impact</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function PredictiveAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CitationForecast />
        <EmergingTopics />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PartnerRecommendations />
        <ScenarioSimulator />
      </div>
    </div>
  );
}
