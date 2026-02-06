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
} from 'recharts';
import { TrendingUp, Lightbulb, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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

function CitationForecast({ data }: { data: any[] }) {
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
          Citation Forecast (Next 5 Years)
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6 ml-12">
        AI-powered prediction based on your publication history
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

function EmergingTopics({ data }: { data: any[] }) {
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
        High-growth areas in your research portfolio
      </p>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Not enough data to identify trends. Add more publications.
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((topic, index) => (
            <motion.div
              key={topic.topic}
              className="p-4 rounded-lg bg-muted/50 border border-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground text-sm">{topic.topic}</span>
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
      )}
    </motion.div>
  );
}

function PartnerRecommendations({ data }: { data: any[] }) {
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
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No collaborator recommendations available yet.
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((partner, index) => (
            <motion.div
              key={partner.userId || index}
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
      )}
    </motion.div>
  );
}

function ScenarioSimulator({ publications }: { publications: any[] }) {
  const currentYear = new Date().getFullYear();
  const currentCitations = publications.length > 0 ? publications[0].predicted : 0;
  const futureYear = currentYear + 5;
  const futureCitations = publications.length > 0 ? publications[publications.length - 1].predicted : 0;
  const growthPercent = currentCitations > 0 ? ((futureCitations - currentCitations) / currentCitations * 100).toFixed(0) : 0;

  const scenarios = [
    { 
      name: 'Increase Publication Rate +30%', 
      rankingChange: `+${Math.round(Number(growthPercent) * 0.3)} citations`,
      impact: 'positive',
      description: 'Publishing more frequently accelerates citation growth'
    },
    { 
      name: 'Focus on High-Impact Journals', 
      rankingChange: `+${Math.round(Number(growthPercent) * 0.5)} citations`,
      impact: 'positive',
      description: 'Targeting Q1 journals significantly boosts visibility'
    },
    { 
      name: 'Expand International Collaborations', 
      rankingChange: `+${Math.round(Number(growthPercent) * 0.4)} citations`,
      impact: 'positive',
      description: 'Cross-border partnerships increase global reach'
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
          Impact Simulator
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6 ml-12">
        "What-if" scenarios based on your data
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
              <p className="font-medium text-foreground text-sm">{scenario.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {scenario.description}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-display font-bold text-emerald">
                {scenario.rankingChange}
              </span>
              <p className="text-xs text-muted-foreground">Potential Impact</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function PredictiveAnalytics() {
  const { user } = useAuth();
  const [citationForecast, setCitationForecast] = useState<any[]>([]);
  const [emergingTopics, setEmergingTopics] = useState<any[]>([]);
  const [partnerRecommendations, setPartnerRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generatePredictions();
    }
  }, [user]);

  const generatePredictions = async () => {
    try {
      setIsLoading(true);

      // Fetch user's publications and citation history
      const { data: publications, error: pubError } = await supabase
        .from('researcher_publications')
        .select('*')
        .eq('user_id', user!.id)
        .order('year', { ascending: true });

      if (pubError) throw pubError;

      if (publications && publications.length > 0) {
        // Get publication IDs for citation snapshots
        const pubIds = publications.map(p => p.id);
        const { data: snapshots } = await supabase
          .from('citation_snapshots')
          .select('*')
          .in('publication_id', pubIds)
          .order('snapshot_date', { ascending: true });

        // Generate predictions
        const forecast = predictCitationGrowth(publications, snapshots || []);
        setCitationForecast(forecast);

        const topics = identifyEmergingTopics(publications);
        setEmergingTopics(topics);

        const partners = await recommendCollaborators(publications);
        setPartnerRecommendations(partners);
      } else {
        // Empty state
        setCitationForecast([]);
        setEmergingTopics([]);
        setPartnerRecommendations([]);
      }
    } catch (error) {
      console.error('Error generating predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prediction Algorithm 1: Citation Growth Forecast
  const predictCitationGrowth = (publications: any[], snapshots: any[]) => {
    const currentYear = new Date().getFullYear();
    const totalCitations = publications.reduce((sum, pub) => sum + (pub.citations || 0), 0);
    
    // Calculate historical growth rate
    let growthRate = 0.15; // Default 15% annual growth
    
    if (snapshots.length > 1) {
      // Calculate actual growth rate from snapshots
      const oldestSnapshot = snapshots[0];
      const newestSnapshot = snapshots[snapshots.length - 1];
      const timeSpan = (new Date(newestSnapshot.snapshot_date).getTime() - 
                       new Date(oldestSnapshot.snapshot_date).getTime()) / 
                       (1000 * 60 * 60 * 24 * 365); // years
      
      if (timeSpan > 0) {
        const citationGrowth = newestSnapshot.citations - oldestSnapshot.citations;
        growthRate = citationGrowth / (oldestSnapshot.citations * timeSpan);
      }
    } else if (publications.length > 1) {
      // Estimate from publication years
      const recentPubs = publications.filter(p => p.year >= currentYear - 3);
      const olderPubs = publications.filter(p => p.year < currentYear - 3);
      
      if (olderPubs.length > 0) {
        const recentAvg = recentPubs.reduce((sum, p) => sum + (p.citations || 0), 0) / recentPubs.length;
        const olderAvg = olderPubs.reduce((sum, p) => sum + (p.citations || 0), 0) / olderPubs.length;
        growthRate = (recentAvg - olderAvg) / (olderAvg || 1) / 3; // 3 year span
      }
    }

    // Ensure reasonable growth rate (between 5% and 50%)
    growthRate = Math.max(0.05, Math.min(0.5, growthRate));

    // Generate 5-year forecast
    const forecast = [];
    let predictedCitations = totalCitations;
    
    for (let year = 0; year <= 5; year++) {
      const yearLabel = (currentYear + year).toString();
      
      if (year === 0) {
        // Current year
        forecast.push({
          year: yearLabel,
          predicted: totalCitations,
          lower: totalCitations,
          upper: totalCitations
        });
      } else {
        // Future years with uncertainty
        predictedCitations = predictedCitations * (1 + growthRate);
        const uncertainty = predictedCitations * 0.15 * year; // Uncertainty increases over time
        
        forecast.push({
          year: yearLabel,
          predicted: Math.round(predictedCitations),
          lower: Math.round(predictedCitations - uncertainty),
          upper: Math.round(predictedCitations + uncertainty)
        });
      }
    }

    return forecast;
  };

  // Prediction Algorithm 2: Identify Emerging Topics
  const identifyEmergingTopics = (publications: any[]) => {
    const currentYear = new Date().getFullYear();
    
    // Group publications by journal
    const journalMap = new Map<string, { recent: number; older: number; citations: number }>();
    
    publications.forEach(pub => {
      const journal = pub.journal || 'Other';
      const isRecent = pub.year >= currentYear - 2;
      const existing = journalMap.get(journal) || { recent: 0, older: 0, citations: 0 };
      
      if (isRecent) {
        existing.recent++;
      } else {
        existing.older++;
      }
      existing.citations += pub.citations || 0;
      
      journalMap.set(journal, existing);
    });

    // Calculate growth rate for each journal
    const topics = Array.from(journalMap.entries())
      .map(([journal, data]) => {
        const growthRate = data.older > 0 
          ? ((data.recent - data.older) / data.older) * 100 
          : data.recent * 50; // High growth if new topic
        
        const confidence = Math.min(0.95, (data.recent + data.older) / publications.length);
        
        return {
          topic: journal,
          growthRate: Math.max(0, Math.round(growthRate)),
          confidence: confidence,
          totalPapers: data.recent + data.older
        };
      })
      .filter(t => t.growthRate > 0)
      .sort((a, b) => b.growthRate - a.growthRate)
      .slice(0, 5);

    return topics;
  };

  // Prediction Algorithm 3: Recommend Collaborators
  const recommendCollaborators = async (userPublications: any[]) => {
    try {
      // Extract user's research areas (journals)
      const userJournals = new Set(userPublications.map(p => p.journal).filter(Boolean));
      
      // Fetch other researchers' publications
      const { data: otherPubs } = await supabase
        .from('researcher_publications')
        .select('user_id, journal, citations')
        .neq('user_id', user!.id)
        .limit(500);

      if (!otherPubs || otherPubs.length === 0) {
        return [];
      }

      // Score researchers by journal overlap
      const researcherScores = new Map<string, { score: number; journals: Set<string>; citations: number }>();
      
      otherPubs.forEach(pub => {
        if (!pub.journal) return;
        
        const existing = researcherScores.get(pub.user_id) || { 
          score: 0, 
          journals: new Set(), 
          citations: 0 
        };
        
        existing.journals.add(pub.journal);
        existing.citations += pub.citations || 0;
        
        // Increase score if journal matches
        if (userJournals.has(pub.journal)) {
          existing.score += 1;
        }
        
        researcherScores.set(pub.user_id, existing);
      });

      // Get top researchers
      const topResearchers = Array.from(researcherScores.entries())
        .filter(([_, data]) => data.score > 0)
        .sort((a, b) => b[1].score - a[1].score)
        .slice(0, 5);

      // Fetch researcher profiles
      const researcherIds = topResearchers.map(([id]) => id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name, institution')
        .in('user_id', researcherIds);

      if (!profiles) return [];

      // Build recommendations
      const recommendations = topResearchers.map(([userId, data]) => {
        const profile = profiles.find(p => p.user_id === userId);
        const matchScore = data.score / userJournals.size;
        
        return {
          institution: profile?.display_name || profile?.institution || 'Unknown Researcher',
          score: Math.min(1, matchScore),
          reason: `${data.score} shared research areas, ${data.citations} total citations`,
          userId: userId
        };
      });

      return recommendations;
    } catch (error) {
      console.error('Error recommending collaborators:', error);
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel p-6 h-[400px] flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Generating predictions...</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (citationForecast.length === 0) {
    return (
      <div className="glass-panel p-6 text-center">
        <p className="text-muted-foreground">No publication data available for predictions. Add publications to see AI-powered insights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CitationForecast data={citationForecast} />
        <EmergingTopics data={emergingTopics} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PartnerRecommendations data={partnerRecommendations} />
        <ScenarioSimulator publications={citationForecast} />
      </div>
    </div>
  );
}
