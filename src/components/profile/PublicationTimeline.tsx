import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import PublicationUpload from '@/components/publications/PublicationUpload';

interface Publication {
  id: string;
  title: string;
  journal: string | null;
  year: number | null;
  citations: number | null;
  quartile: string | null;
  doi: string | null;
  abstract: string | null;
}

export default function PublicationTimeline() {
  const { user } = useAuth();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [yearlyData, setYearlyData] = useState<{ year: string; publications: number; citations: number }[]>([]);

  const fetchPublications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('researcher_publications')
      .select('id, title, journal, year, citations, quartile, doi, abstract')
      .eq('user_id', user.id)
      .order('year', { ascending: false });

    if (!error && data) {
      setPublications(data);
      
      // Calculate yearly data
      const yearMap = new Map<number, { publications: number; citations: number }>();
      data.forEach(pub => {
        const year = pub.year || new Date().getFullYear();
        const existing = yearMap.get(year) || { publications: 0, citations: 0 };
        yearMap.set(year, {
          publications: existing.publications + 1,
          citations: existing.citations + (pub.citations || 0),
        });
      });

      const sortedYears = Array.from(yearMap.entries())
        .sort((a, b) => a[0] - b[0])
        .slice(-6)
        .map(([year, data]) => ({
          year: year.toString(),
          ...data,
        }));

      setYearlyData(sortedYears);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPublications();
  }, [user]);

  const getQuartileColor = (q: string | null) => {
    switch (q) {
      case 'Q1': return 'bg-emerald/20 text-emerald border-emerald/30';
      case 'Q2': return 'bg-primary/20 text-primary border-primary/30';
      case 'Q3': return 'bg-secondary/20 text-secondary border-secondary/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <PublicationUpload onSuccess={fetchPublications} />

      {/* Chart */}
      {yearlyData.length > 0 && (
        <div className="glass-panel p-4">
          <h3 className="font-semibold text-foreground mb-4">Publication & Citation Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={yearlyData}>
              <defs>
                <linearGradient id="pubGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="citeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="year" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="publications" 
                stroke="hsl(var(--primary))" 
                fill="url(#pubGradient)"
                strokeWidth={2}
                name="Publications"
              />
              <Area 
                type="monotone" 
                dataKey="citations" 
                stroke="hsl(var(--secondary))" 
                fill="url(#citeGradient)"
                strokeWidth={2}
                name="Citations"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Publication List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">
          Your Publications ({publications.length})
        </h3>
        
        {publications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No publications yet. Add your first publication above!</p>
          </div>
        ) : (
          publications.map((pub, index) => (
            <motion.div
              key={pub.id}
              className="glass-panel p-4 hover:bg-muted/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm line-clamp-2">
                    {pub.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pub.journal || 'Unknown journal'} • {pub.year || 'Year unknown'}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    {pub.quartile && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getQuartileColor(pub.quartile)}`}>
                        {pub.quartile}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {pub.citations || 0} citations
                    </span>
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        DOI <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
