import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock publication data
const publications = [
  {
    id: '1',
    title: 'Climate Change Impact on Agricultural Productivity in East Africa',
    journal: 'Nature Climate Change',
    year: 2024,
    citations: 47,
    quartile: 'Q1',
    doi: '10.1038/s41558-024-0001',
  },
  {
    id: '2',
    title: 'Machine Learning for Malaria Prediction Models',
    journal: 'The Lancet Digital Health',
    year: 2024,
    citations: 32,
    quartile: 'Q1',
    doi: '10.1016/S2589-7500(24)00001',
  },
  {
    id: '3',
    title: 'Sustainable Water Management in Urban Tanzania',
    journal: 'Water Resources Research',
    year: 2023,
    citations: 89,
    quartile: 'Q1',
    doi: '10.1029/2023WR034567',
  },
  {
    id: '4',
    title: 'Renewable Energy Adoption Patterns in Sub-Saharan Africa',
    journal: 'Energy Policy',
    year: 2023,
    citations: 56,
    quartile: 'Q1',
    doi: '10.1016/j.enpol.2023.001',
  },
  {
    id: '5',
    title: 'Biodiversity Conservation Strategies in the Serengeti',
    journal: 'Conservation Biology',
    year: 2022,
    citations: 124,
    quartile: 'Q1',
    doi: '10.1111/cobi.2022.0001',
  },
];

const yearlyData = [
  { year: '2019', publications: 3, citations: 45 },
  { year: '2020', publications: 5, citations: 120 },
  { year: '2021', publications: 7, citations: 210 },
  { year: '2022', publications: 8, citations: 340 },
  { year: '2023', publications: 11, citations: 520 },
  { year: '2024', publications: 6, citations: 380 },
];

export default function PublicationTimeline() {
  const getQuartileColor = (q: string) => {
    switch (q) {
      case 'Q1': return 'bg-emerald/20 text-emerald border-emerald/30';
      case 'Q2': return 'bg-primary/20 text-primary border-primary/30';
      case 'Q3': return 'bg-secondary/20 text-secondary border-secondary/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart */}
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

      {/* Publication List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Recent Publications</h3>
        {publications.map((pub, index) => (
          <motion.div
            key={pub.id}
            className="glass-panel p-4 hover:bg-muted/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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
                  {pub.journal} • {pub.year}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getQuartileColor(pub.quartile)}`}>
                    {pub.quartile}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {pub.citations} citations
                  </span>
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    DOI <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
