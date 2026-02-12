import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, ExternalLink, Eye, Globe, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { trackPaperView, trackPaperDownload, getPaperReadership } from '@/services/trackingService';
import PublicHeader from '@/components/PublicHeader';

export default function PaperView() {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<any>(null);
  const [readership, setReadership] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewStartTime] = useState(Date.now());

  useEffect(() => {
    if (paperId) {
      loadPaper();
      trackView();
      loadReadership();
    }
  }, [paperId]);

  const loadPaper = async () => {
    try {
      const { data, error } = await supabase
        .from('researcher_publications')
        .select(`
          *,
          profiles:user_id (
            display_name,
            institution
          )
        `)
        .eq('id', paperId)
        .single();

      if (error) throw error;
      setPaper(data);
    } catch (error) {
      console.error('Error loading paper:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    if (paperId) {
      await trackPaperView(paperId);
    }
  };

  const loadReadership = async () => {
    if (paperId) {
      const stats = await getPaperReadership(paperId);
      setReadership(stats);
    }
  };

  const handleDownload = async () => {
    if (paperId && paper?.pdf_url) {
      await trackPaperDownload(paperId);
      window.open(paper.pdf_url, '_blank');
      
      // Reload readership stats
      setTimeout(loadReadership, 1000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading paper...</div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Paper Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested paper could not be found.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-8"
            >
              {/* Title */}
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                {paper.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {paper.quartile && (
                  <Badge variant="secondary">{paper.quartile}</Badge>
                )}
                {paper.year && (
                  <span className="text-sm text-muted-foreground">{paper.year}</span>
                )}
                {paper.journal && (
                  <span className="text-sm text-muted-foreground">• {paper.journal}</span>
                )}
              </div>

              {/* Author */}
              {paper.profiles && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">Author</p>
                  <p className="font-medium text-foreground">
                    {paper.profiles.display_name}
                  </p>
                  {paper.profiles.institution && (
                    <p className="text-sm text-muted-foreground">
                      {paper.profiles.institution}
                    </p>
                  )}
                </div>
              )}

              {/* Abstract */}
              {paper.abstract && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Abstract</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {paper.abstract}
                  </p>
                </div>
              )}

              {/* Keywords */}
              {paper.keywords && paper.keywords.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {paper.keywords.map((keyword: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
                {paper.pdf_url && (
                  <Button onClick={handleDownload} className="gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                )}
                {paper.doi && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://doi.org/${paper.doi}`, '_blank')}
                    className="gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Publisher Site
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Readership Stats */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-6 sticky top-24"
            >
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Readership Statistics
              </h3>

              {readership ? (
                <div className="space-y-4">
                  {/* Total Views */}
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Total Views</span>
                      <Eye className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {readership.total_views.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {readership.unique_visitors} unique visitors
                    </p>
                  </div>

                  {/* Downloads */}
                  <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Downloads</span>
                      <Download className="w-4 h-4 text-secondary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {readership.total_downloads.toLocaleString()}
                    </p>
                  </div>

                  {/* Countries */}
                  <div className="p-4 rounded-lg bg-cyan/10 border border-cyan/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Countries Reached</span>
                      <Globe className="w-4 h-4 text-cyan" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {readership.countries_reached}
                    </p>
                  </div>

                  {/* Citations */}
                  <div className="p-4 rounded-lg bg-emerald/10 border border-emerald/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Citations</span>
                      <TrendingUp className="w-4 h-4 text-emerald" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {paper.citations || 0}
                    </p>
                  </div>

                  {/* Top Countries */}
                  {readership.by_country && readership.by_country.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Top Countries
                      </h4>
                      <div className="space-y-2">
                        {readership.by_country.slice(0, 5).map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{item.country}</span>
                            <span className="font-medium text-foreground">{item.views}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      <strong>Real-time tracking:</strong> These statistics are updated in real-time as researchers worldwide view and download this paper.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Loading readership data...
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
