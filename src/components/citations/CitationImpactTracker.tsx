import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart3, RefreshCw, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useCitationTracker, type PublicationWithHistory } from '@/hooks/useCitationTracker';
import { format, parseISO } from 'date-fns';

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColors = {
  up: 'text-emerald-500',
  down: 'text-destructive',
  stable: 'text-muted-foreground',
};

interface PublicationChartProps {
  publication: PublicationWithHistory;
}

function PublicationChart({ publication }: PublicationChartProps) {
  const chartData = publication.snapshots.map(s => ({
    date: format(parseISO(s.snapshot_date), 'MMM dd'),
    citations: s.citations,
  }));

  // Add current value if different from last snapshot
  if (chartData.length > 0) {
    const lastValue = chartData[chartData.length - 1].citations;
    if (lastValue !== publication.current_citations) {
      chartData.push({
        date: 'Now',
        citations: publication.current_citations,
      });
    }
  }

  if (chartData.length < 2) {
    return (
      <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">
        Not enough data for chart
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={80}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={`gradient-${publication.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="citations"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill={`url(#gradient-${publication.id})`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function CitationImpactTracker() {
  const { 
    publications, 
    isLoading, 
    fetchCitationHistory, 
    recordAllSnapshots, 
    getAggregateStats 
  } = useCitationTracker();
  const [isRecording, setIsRecording] = useState(false);
  const [selectedPub, setSelectedPub] = useState<PublicationWithHistory | null>(null);

  useEffect(() => {
    fetchCitationHistory();
  }, []);

  const handleRecordSnapshots = async () => {
    setIsRecording(true);
    await recordAllSnapshots();
    setIsRecording(false);
  };

  const stats = getAggregateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Citation Impact Tracker</h2>
          <p className="text-sm text-muted-foreground">Monitor your research impact over time</p>
        </div>
        <Button onClick={handleRecordSnapshots} disabled={isRecording}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isRecording ? 'animate-spin' : ''}`} />
          {isRecording ? 'Recording...' : 'Record Snapshot'}
        </Button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Award className="w-4 h-4" />
            <span className="text-xs">Total Citations</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalCitations.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs">Avg. Growth</span>
          </div>
          <p className={`text-2xl font-bold ${stats.avgGrowth >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
            {stats.avgGrowth >= 0 ? '+' : ''}{stats.avgGrowth}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-4"
        >
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Trending Up</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.trending}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">Publications</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalPublications}</p>
        </motion.div>
      </div>

      {/* Publications List */}
      <div className="glass-panel p-4">
        <h3 className="font-medium text-foreground mb-4">Publication Performance</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : publications.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No publications to track</p>
            <p className="text-sm text-muted-foreground/70">
              Import your publications to start tracking citation impact
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {publications.map((pub, index) => {
                const TrendIcon = trendIcons[pub.trend];
                const trendColor = trendColors[pub.trend];

                return (
                  <motion.div
                    key={pub.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedPub(selectedPub?.id === pub.id ? null : pub)}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground line-clamp-1">{pub.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {pub.journal && (
                            <span className="text-xs text-muted-foreground">{pub.journal}</span>
                          )}
                          {pub.year && (
                            <span className="text-xs text-muted-foreground">• {pub.year}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">
                            {pub.current_citations}
                          </p>
                          <p className="text-xs text-muted-foreground">citations</p>
                        </div>
                        <div className={`flex items-center gap-1 ${trendColor}`}>
                          <TrendIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {pub.growth_rate >= 0 ? '+' : ''}{pub.growth_rate}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Inline Chart */}
                    {selectedPub?.id === pub.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border"
                      >
                        <PublicationChart publication={pub} />
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>{pub.snapshots.length} data points</span>
                          {pub.snapshots.length > 0 && (
                            <span>
                              First recorded: {format(parseISO(pub.snapshots[0].snapshot_date), 'MMM dd, yyyy')}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Tips */}
      <div className="glass-panel p-4 border-primary/20">
        <h4 className="text-sm font-medium text-foreground mb-2">💡 Tracking Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Record snapshots regularly (weekly/monthly) to track trends accurately</li>
          <li>• Sync your ORCID profile to keep publication data up to date</li>
          <li>• Publications with high growth rates may indicate emerging research impact</li>
        </ul>
      </div>
    </div>
  );
}
