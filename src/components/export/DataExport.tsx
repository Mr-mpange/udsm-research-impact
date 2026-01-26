import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, FileSpreadsheet, Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { countryMetrics, topAuthors, kpiData } from '@/data/researchData';

interface DataExportProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'pdf' | 'csv';
type ExportType = 'analytics' | 'publications' | 'collaborations' | 'full';

export default function DataExport({ isOpen, onClose }: DataExportProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [selectedType, setSelectedType] = useState<ExportType>('analytics');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const { toast } = useToast();

  const exportOptions = [
    { id: 'analytics', label: 'Research Analytics', description: 'KPIs, trends, and impact metrics' },
    { id: 'publications', label: 'Publication List', description: 'All publications with citations' },
    { id: 'collaborations', label: 'Collaboration Network', description: 'Partners and co-authors' },
    { id: 'full', label: 'Full Report', description: 'Complete research profile' },
  ] as const;

  const generateCSV = (type: ExportType): string => {
    let csvContent = '';
    
    switch (type) {
      case 'analytics':
        csvContent = 'Metric,Value\n';
        csvContent += `Global Impact Index,${kpiData.globalImpactIndex}\n`;
        csvContent += `H-Index Growth,${kpiData.hIndexGrowth}%\n`;
        csvContent += `Total Citations,${kpiData.totalCitations}\n`;
        csvContent += `Open Access Rate,${kpiData.openAccessPercentage}%\n`;
        csvContent += `Q1 Publications,${kpiData.q1Publications}\n`;
        break;
        
      case 'publications':
        csvContent = 'Author,H-Index,Citations,Papers\n';
        topAuthors.forEach(author => {
          csvContent += `"${author.name}",${author.hIndex},${author.citations},${author.papers}\n`;
        });
        break;
        
      case 'collaborations':
        csvContent = 'Country,Reads,Downloads,Citations,Collaborations\n';
        countryMetrics.forEach(country => {
          csvContent += `"${country.name}",${country.reads},${country.downloads},${country.citations},${country.collaborations}\n`;
        });
        break;
        
      case 'full':
        csvContent = '=== UDSM Research Analytics Report ===\n\n';
        csvContent += 'Key Performance Indicators\n';
        csvContent += `Global Impact Index,${kpiData.globalImpactIndex}\n`;
        csvContent += `H-Index Growth,${kpiData.hIndexGrowth}%\n\n`;
        csvContent += 'Top Authors\n';
        csvContent += 'Name,H-Index,Citations\n';
        topAuthors.slice(0, 5).forEach(a => {
          csvContent += `"${a.name}",${a.hIndex},${a.citations}\n`;
        });
        break;
    }
    
    return csvContent;
  };

  const generatePDFContent = (type: ExportType): string => {
    // Generate HTML content for PDF
    let content = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; }
          h1 { color: #1E40AF; border-bottom: 2px solid #1E40AF; padding-bottom: 10px; }
          h2 { color: #1E40AF; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #1E40AF; color: white; }
          tr:nth-child(even) { background-color: #f8f9fa; }
          .metric { display: inline-block; margin: 10px; padding: 20px; background: #f0f4ff; border-radius: 8px; }
          .metric-value { font-size: 28px; font-weight: bold; color: #1E40AF; }
          .metric-label { font-size: 14px; color: #666; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>🎓 UDSM Research Intelligence Report</h1>
        <p>Generated on ${new Date().toLocaleDateString('en-US', { 
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        })}</p>
    `;

    if (type === 'analytics' || type === 'full') {
      content += `
        <h2>📊 Key Performance Indicators</h2>
        <div>
          <div class="metric">
            <div class="metric-value">${kpiData.globalImpactIndex}</div>
            <div class="metric-label">Global Impact Index</div>
          </div>
          <div class="metric">
            <div class="metric-value">+${kpiData.hIndexGrowth}%</div>
            <div class="metric-label">H-Index Growth</div>
          </div>
          <div class="metric">
            <div class="metric-value">${kpiData.totalCitations.toLocaleString()}</div>
            <div class="metric-label">Total Citations</div>
          </div>
          <div class="metric">
            <div class="metric-value">${kpiData.openAccessPercentage}%</div>
            <div class="metric-label">Open Access Rate</div>
          </div>
        </div>
      `;
    }

    if (type === 'publications' || type === 'full') {
      content += `
        <h2>📚 Top Researchers</h2>
        <table>
          <tr><th>Researcher</th><th>Department</th><th>H-Index</th><th>Citations</th></tr>
          ${topAuthors.slice(0, 10).map(a => `
            <tr>
              <td>${a.name}</td>
              <td>${a.department}</td>
              <td>${a.hIndex}</td>
              <td>${a.citations.toLocaleString()}</td>
            </tr>
          `).join('')}
        </table>
      `;
    }

    if (type === 'collaborations' || type === 'full') {
      content += `
        <h2>🌍 Global Collaboration Partners</h2>
        <table>
          <tr><th>Country</th><th>Reads</th><th>Citations</th><th>Collaborations</th></tr>
          ${countryMetrics.slice(0, 10).map(c => `
            <tr>
              <td>${c.flag} ${c.name}</td>
              <td>${c.reads.toLocaleString()}</td>
              <td>${c.citations.toLocaleString()}</td>
              <td>${c.collaborations}</td>
            </tr>
          `).join('')}
        </table>
      `;
    }

    content += `
        <div class="footer">
          <p>University of Dar es Salaam • Research Intelligence Platform</p>
          <p>This report was automatically generated by the UDSM Research Analytics System</p>
        </div>
      </body>
      </html>
    `;

    return content;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (selectedFormat === 'csv') {
        const csvContent = generateCSV(selectedType);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `udsm_research_${selectedType}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // For PDF, we'll create an HTML file that can be printed as PDF
        const htmlContent = generatePDFContent(selectedType);
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      }

      setExportComplete(true);
      toast({
        title: "Export successful!",
        description: `Your ${selectedType} report has been generated.`,
      });

      setTimeout(() => {
        setExportComplete(false);
      }, 2000);
    } catch {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "There was an error generating your report.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Export Research Data
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Download analytics as PDF or CSV
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedFormat('pdf')}
                    className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                      selectedFormat === 'pdf'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <FileText className={`w-5 h-5 ${selectedFormat === 'pdf' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="text-left">
                      <p className="font-medium text-sm">PDF Report</p>
                      <p className="text-xs text-muted-foreground">Formatted document</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedFormat('csv')}
                    className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                      selectedFormat === 'csv'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <FileSpreadsheet className={`w-5 h-5 ${selectedFormat === 'csv' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="text-left">
                      <p className="font-medium text-sm">CSV File</p>
                      <p className="text-xs text-muted-foreground">Spreadsheet data</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Content Selection */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Report Content
                </label>
                <div className="space-y-2">
                  {exportOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedType(option.id)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        selectedType === option.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <p className="font-medium text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Button */}
              <Button
                className="w-full bg-gradient-to-r from-primary to-cyan hover:opacity-90"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : exportComplete ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isExporting ? 'Generating...' : exportComplete ? 'Exported!' : 'Export Report'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
