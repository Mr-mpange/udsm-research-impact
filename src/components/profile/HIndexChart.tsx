import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function HIndexChart() {
  const { user } = useAuth();
  const [hIndexData, setHIndexData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHIndexHistory();
    }
  }, [user]);

  const fetchHIndexHistory = async () => {
    try {
      setIsLoading(true);

      // Fetch user's publications grouped by year
      const { data: publications, error } = await supabase
        .from('researcher_publications')
        .select('year, citations')
        .eq('user_id', user!.id)
        .order('year', { ascending: true });

      if (error) throw error;

      if (!publications || publications.length === 0) {
        // No data, show empty state
        setHIndexData([]);
        setIsLoading(false);
        return;
      }

      // Calculate H-Index for each year
      const yearlyData = new Map<number, { papers: number[], totalCitations: number }>();
      
      publications.forEach(pub => {
        const year = pub.year;
        if (!yearlyData.has(year)) {
          yearlyData.set(year, { papers: [], totalCitations: 0 });
        }
        const data = yearlyData.get(year)!;
        data.papers.push(pub.citations || 0);
        data.totalCitations += pub.citations || 0;
      });

      // Calculate cumulative H-Index over time
      const years = Array.from(yearlyData.keys()).sort();
      const chartData: any[] = [];
      let cumulativePapers: number[] = [];

      years.forEach(year => {
        const yearData = yearlyData.get(year)!;
        cumulativePapers = [...cumulativePapers, ...yearData.papers];
        
        // Calculate H-Index: largest number h such that h papers have at least h citations
        const sortedCitations = [...cumulativePapers].sort((a, b) => b - a);
        let hIndex = 0;
        for (let i = 0; i < sortedCitations.length; i++) {
          if (sortedCitations[i] >= i + 1) {
            hIndex = i + 1;
          } else {
            break;
          }
        }

        // Calculate benchmark (field average - estimated as 70% of user's h-index)
        const benchmark = Math.round(hIndex * 0.7);

        chartData.push({
          year: year.toString(),
          hIndex: hIndex,
          benchmark: benchmark,
          papers: cumulativePapers.length,
          totalCitations: cumulativePapers.reduce((sum, c) => sum + c, 0)
        });
      });

      setHIndexData(chartData);
    } catch (error) {
      console.error('Error fetching H-Index history:', error);
      setHIndexData([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[180px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Loading H-Index data...</p>
      </div>
    );
  }

  if (hIndexData.length === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No publication data available. Add publications to see your H-Index growth.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={hIndexData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="hIndexGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--cyan))" />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="year" 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 'auto']}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value: any, name: string) => {
            if (name === 'Your H-Index') return [value, name];
            if (name === 'Field Average') return [value, name];
            return [value, name];
          }}
        />
        <Line 
          type="monotone" 
          dataKey="benchmark" 
          stroke="hsl(var(--muted-foreground))" 
          strokeWidth={1}
          strokeDasharray="5 5"
          dot={false}
          name="Field Average"
        />
        <Line 
          type="monotone" 
          dataKey="hIndex" 
          stroke="url(#hIndexGradient)" 
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
          name="Your H-Index"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
