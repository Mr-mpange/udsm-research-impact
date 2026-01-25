import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  Award,
  Globe,
  FileText,
  Download,
  Eye
} from 'lucide-react';
import { kpiData, countryMetrics } from '@/data/researchData';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  delay?: number;
  variant?: 'default' | 'gold' | 'primary';
}

function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon: Icon,
  delay = 0,
  variant = 'default'
}: MetricCardProps) {
  const changeColors = {
    positive: 'text-emerald',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  return (
    <motion.div
      className={`stat-card ${variant === 'gold' ? 'glass-panel-gold' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${
          variant === 'gold' 
            ? 'bg-secondary/20 text-secondary' 
            : variant === 'primary'
            ? 'bg-primary/20 text-primary'
            : 'bg-muted text-muted-foreground'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${changeColors[changeType]}`}>
            <TrendingUp className="w-3 h-3" />
            <span className="font-medium">{change}</span>
          </div>
        )}
      </div>
      <div className="metric-value text-foreground mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="metric-label">{title}</div>
    </motion.div>
  );
}

export default function KPIMetrics() {
  const totalReads = countryMetrics.reduce((acc, c) => acc + c.reads, 0);
  const totalDownloads = countryMetrics.reduce((acc, c) => acc + c.downloads, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Global Impact Index"
        value={kpiData.globalImpactIndex}
        change="+12.5%"
        changeType="positive"
        icon={Award}
        delay={0}
        variant="gold"
      />
      <MetricCard
        title="Total Citations"
        value={kpiData.totalCitations}
        change="+18.2%"
        changeType="positive"
        icon={BookOpen}
        delay={0.1}
        variant="primary"
      />
      <MetricCard
        title="Research Papers"
        value={kpiData.totalPapers}
        change="+10.8%"
        changeType="positive"
        icon={FileText}
        delay={0.2}
      />
      <MetricCard
        title="International Partners"
        value={kpiData.internationalCollaborations}
        change="+23.4%"
        changeType="positive"
        icon={Users}
        delay={0.3}
      />
      <MetricCard
        title="Q1 Publications"
        value={kpiData.q1Publications}
        change="+15.6%"
        changeType="positive"
        icon={Award}
        delay={0.4}
      />
      <MetricCard
        title="Global Reads"
        value={totalReads}
        change="+28.3%"
        changeType="positive"
        icon={Eye}
        delay={0.5}
      />
      <MetricCard
        title="Downloads"
        value={totalDownloads}
        change="+21.7%"
        changeType="positive"
        icon={Download}
        delay={0.6}
      />
      <MetricCard
        title="Active Countries"
        value={countryMetrics.length}
        change="+3"
        changeType="positive"
        icon={Globe}
        delay={0.7}
      />
    </div>
  );
}
