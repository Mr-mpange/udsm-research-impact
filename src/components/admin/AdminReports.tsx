import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  Calendar, 
  Building2, 
  Users,
  BookOpen,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ReportType = 'researchers' | 'publications' | 'departments';

export default function AdminReports() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const { toast } = useToast();

  async function generateReport(type: ReportType) {
    setIsGenerating(true);
    
    try {
      let data: Record<string, unknown>[] = [];
      let filename = '';
      let headers: string[] = [];

      switch (type) {
        case 'researchers':
          const { data: researchers, error: resError } = await supabase
            .from('profiles')
            .select('display_name, email, department, institution, h_index, total_citations, total_publications, orcid_id, created_at');
          
          if (resError) throw resError;
          data = researchers || [];
          headers = ['Name', 'Email', 'Department', 'Institution', 'H-Index', 'Citations', 'Publications', 'ORCID', 'Joined'];
          filename = `researchers_report_${new Date().toISOString().split('T')[0]}.csv`;
          break;

        case 'publications':
          const { data: publications, error: pubError } = await supabase
            .from('researcher_publications')
            .select('title, journal, year, citations, quartile, doi, created_at');
          
          if (pubError) throw pubError;
          data = publications || [];
          headers = ['Title', 'Journal', 'Year', 'Citations', 'Quartile', 'DOI', 'Added Date'];
          filename = `publications_report_${new Date().toISOString().split('T')[0]}.csv`;
          break;

        case 'departments':
          const { data: deptData, error: deptError } = await supabase
            .from('profiles')
            .select('department, h_index, total_citations, total_publications');
          
          if (deptError) throw deptError;
          
          // Aggregate by department
          const deptMap = new Map<string, { count: number; avgHIndex: number; totalCitations: number; totalPubs: number }>();
          (deptData || []).forEach(p => {
            const dept = p.department || 'Unknown';
            const existing = deptMap.get(dept) || { count: 0, avgHIndex: 0, totalCitations: 0, totalPubs: 0 };
            existing.count++;
            existing.avgHIndex += (p.h_index || 0);
            existing.totalCitations += (p.total_citations || 0);
            existing.totalPubs += (p.total_publications || 0);
            deptMap.set(dept, existing);
          });

          data = Array.from(deptMap.entries()).map(([dept, stats]) => ({
            department: dept,
            researchers: stats.count,
            avg_h_index: Math.round((stats.avgHIndex / stats.count) * 10) / 10,
            total_citations: stats.totalCitations,
            total_publications: stats.totalPubs
          }));
          headers = ['Department', 'Researchers', 'Avg H-Index', 'Total Citations', 'Total Publications'];
          filename = `department_report_${new Date().toISOString().split('T')[0]}.csv`;
          break;
      }

      // Generate CSV
      const csvRows = [headers.join(',')];
      data.forEach(row => {
        const values = Object.values(row).map(v => {
          const str = String(v ?? '');
          return str.includes(',') ? `"${str}"` : str;
        });
        csvRows.push(values.join(','));
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Report Generated',
        description: `${filename} has been downloaded`
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate report'
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const reportTypes = [
    {
      id: 'researchers' as ReportType,
      title: 'Researchers Report',
      description: 'Complete list of all registered researchers with their metrics',
      icon: Users,
      color: 'primary'
    },
    {
      id: 'publications' as ReportType,
      title: 'Publications Report',
      description: 'All publications with journal, citations, and quartile data',
      icon: BookOpen,
      color: 'cyan'
    },
    {
      id: 'departments' as ReportType,
      title: 'Department Analysis',
      description: 'Aggregated statistics by department',
      icon: Building2,
      color: 'secondary'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="glass-panel p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-foreground">Report Period:</span>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTypes.map((report, index) => (
          <motion.div
            key={report.id}
            className="glass-panel p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`w-12 h-12 rounded-xl bg-${report.color}/20 flex items-center justify-center mb-4`}>
              <report.icon className={`w-6 h-6 text-${report.color}`} />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              {report.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {report.description}
            </p>
            <Button
              onClick={() => generateReport(report.id)}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-primary to-cyan hover:opacity-90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </>
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="glass-panel p-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Report Summary
        </h3>
        <p className="text-sm text-muted-foreground">
          Reports are generated in CSV format for easy import into Excel, Google Sheets, or other data analysis tools. 
          The data includes all available metrics from the platform's database.
        </p>
        <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Reports are generated based on the current database state. 
            For historical data or custom date ranges, please contact the system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
