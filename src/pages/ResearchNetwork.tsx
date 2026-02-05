import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  Download, 
  Quote, 
  Filter, 
  Calendar,
  Award,
  Users,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  X,
  FileText,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PublicHeader from '@/components/PublicHeader';

interface Publication {
  id: string;
  title: string;
  abstract: string | null;
  journal: string | null;
  year: number | null;
  citations: number | null;
  quartile: string | null;
  doi: string | null;
  co_authors: string[] | null;
  keywords: string[] | null;
  pdf_url: string | null;
  user_id: string;
}

interface AuthorInfo {
  display_name: string | null;
  institution: string | null;
}

type CitationFormat = 'apa' | 'mla' | 'chicago' | 'bibtex';

export default function ResearchNetwork() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [authors, setAuthors] = useState<Record<string, AuthorInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [quartileFilter, setQuartileFilter] = useState<string>('all');
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [citationFormat, setCitationFormat] = useState<CitationFormat>('apa');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPublications();
  }, []);

  async function fetchPublications() {
    setIsLoading(true);
    
    const { data: pubs, error } = await supabase
      .from('researcher_publications')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load publications'
      });
      setIsLoading(false);
      return;
    }

    setPublications(pubs || []);

    // Fetch author info for all publications
    const userIds = [...new Set((pubs || []).map(p => p.user_id))];
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name, institution')
        .in('user_id', userIds);

      const authorMap: Record<string, AuthorInfo> = {};
      profiles?.forEach(p => {
        authorMap[p.user_id] = {
          display_name: p.display_name,
          institution: p.institution
        };
      });
      setAuthors(authorMap);
    }

    setIsLoading(false);
  }

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = 
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.abstract?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesYear = yearFilter === 'all' || pub.year?.toString() === yearFilter;
    const matchesQuartile = quartileFilter === 'all' || pub.quartile === quartileFilter;

    return matchesSearch && matchesYear && matchesQuartile;
  });

  const years = [...new Set(publications.map(p => p.year).filter(Boolean))].sort((a, b) => (b || 0) - (a || 0));
  const quartiles = ['Q1', 'Q2', 'Q3', 'Q4'];

  function generateCitation(pub: Publication, format: CitationFormat): string {
    const author = authors[pub.user_id]?.display_name || 'Unknown Author';
    const year = pub.year || 'n.d.';
    const title = pub.title;
    const journal = pub.journal || 'Unknown Journal';

    switch (format) {
      case 'apa':
        return `${author} (${year}). ${title}. *${journal}*.${pub.doi ? ` https://doi.org/${pub.doi}` : ''}`;
      case 'mla':
        return `${author}. "${title}." *${journal}*, ${year}.${pub.doi ? ` doi:${pub.doi}` : ''}`;
      case 'chicago':
        return `${author}. "${title}." ${journal} (${year}).${pub.doi ? ` https://doi.org/${pub.doi}` : ''}`;
      case 'bibtex':
        const key = author.split(' ')[0]?.toLowerCase() || 'unknown';
        return `@article{${key}${year},
  author = {${author}},
  title = {${title}},
  journal = {${journal}},
  year = {${year}}${pub.doi ? `,\n  doi = {${pub.doi}}` : ''}
}`;
      default:
        return '';
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
    toast({
      title: 'Citation copied',
      description: 'Citation has been copied to your clipboard'
    });
  }

  function handleDownload(pub: Publication) {
    if (pub.pdf_url) {
      window.open(pub.pdf_url, '_blank');
    } else if (pub.doi) {
      window.open(`https://doi.org/${pub.doi}`, '_blank');
    } else {
      toast({
        variant: 'destructive',
        title: 'No download available',
        description: 'This publication does not have a downloadable file'
      });
    }
  }

  const quartileColors: Record<string, string> = {
    'Q1': 'bg-emerald/20 text-emerald border-emerald/30',
    'Q2': 'bg-primary/20 text-primary border-primary/30',
    'Q3': 'bg-secondary/20 text-secondary border-secondary/30',
    'Q4': 'bg-muted text-muted-foreground border-muted'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[100px]" />
      </div>

      <PublicHeader />

      <main className="relative container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Research Network
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover, read, and cite cutting-edge research from UDSM scholars worldwide
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="glass-panel p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search publications by title, journal, abstract, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 text-lg"
              />
            </div>
            
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="h-12 gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="flex flex-wrap gap-4">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {years.map(year => (
                        <SelectItem key={year} value={year!.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={quartileFilter} onValueChange={setQuartileFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Award className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Quartile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Quartiles</SelectItem>
                      {quartiles.map(q => (
                        <SelectItem key={q} value={q}>{q}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {(yearFilter !== 'all' || quartileFilter !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setYearFilter('all');
                        setQuartileFilter('all');
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear filters
                    </Button>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {filteredPublications.length} publication{filteredPublications.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Publications Grid */}
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="animate-pulse text-muted-foreground">Loading publications...</div>
              </motion.div>
            ) : filteredPublications.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  No publications found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            ) : (
              filteredPublications.map((pub, index) => (
                <motion.div
                  key={pub.id}
                  className="glass-panel p-6 hover:bg-muted/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="font-display font-semibold text-lg text-foreground mb-2 hover:text-primary cursor-pointer"
                          onClick={() => setSelectedPublication(pub)}>
                        {pub.title}
                      </h3>

                      {/* Author & Journal */}
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {authors[pub.user_id]?.display_name || 'Unknown Author'}
                        </span>
                        {pub.journal && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {pub.journal}
                            </span>
                          </>
                        )}
                        {pub.year && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {pub.year}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Abstract Preview */}
                      {pub.abstract && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {pub.abstract}
                        </p>
                      )}

                      {/* Keywords */}
                      {pub.keywords && pub.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {pub.keywords.slice(0, 5).map((keyword, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {pub.keywords.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{pub.keywords.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Metrics Row */}
                      <div className="flex flex-wrap items-center gap-3">
                        {pub.quartile && (
                          <Badge variant="outline" className={quartileColors[pub.quartile]}>
                            {pub.quartile}
                          </Badge>
                        )}
                        {pub.citations !== null && pub.citations > 0 && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Quote className="w-4 h-4" />
                            {pub.citations} citations
                          </span>
                        )}
                        {pub.doi && (
                          <a
                            href={`https://doi.org/${pub.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            <Globe className="w-4 h-4" />
                            DOI
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setSelectedPublication(pub)}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleDownload(pub)}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          setSelectedPublication(pub);
                          setShowCitationModal(true);
                        }}
                      >
                        <Quote className="w-4 h-4" />
                        Cite
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Publication Detail Modal */}
      <Dialog open={!!selectedPublication && !showCitationModal} onOpenChange={(open) => !open && setSelectedPublication(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="font-display text-xl pr-8">
              {selectedPublication?.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              {/* Author & Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {selectedPublication && authors[selectedPublication.user_id]?.display_name}
                </span>
                {selectedPublication?.journal && (
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {selectedPublication.journal}
                  </span>
                )}
                {selectedPublication?.year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedPublication.year}
                  </span>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {selectedPublication?.quartile && (
                  <Badge variant="outline" className={quartileColors[selectedPublication.quartile]}>
                    {selectedPublication.quartile} Journal
                  </Badge>
                )}
                {selectedPublication?.citations != null && (
                  <Badge variant="outline">
                    {selectedPublication.citations} Citations
                  </Badge>
                )}
              </div>

              {/* Abstract */}
              {selectedPublication?.abstract && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Abstract</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedPublication.abstract}
                  </p>
                </div>
              )}

              {/* Co-Authors */}
              {selectedPublication?.co_authors && selectedPublication.co_authors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Co-Authors</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPublication.co_authors.map((author, i) => (
                      <Badge key={i} variant="secondary">{author}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              {selectedPublication?.keywords && selectedPublication.keywords.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPublication.keywords.map((keyword, i) => (
                      <Badge key={i} variant="outline">{keyword}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* DOI */}
              {selectedPublication?.doi && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">DOI</h4>
                  <a
                    href={`https://doi.org/${selectedPublication.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://doi.org/{selectedPublication.doi}
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  className="gap-2"
                  onClick={() => selectedPublication && handleDownload(selectedPublication)}
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowCitationModal(true)}
                >
                  <Quote className="w-4 h-4" />
                  Generate Citation
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Citation Modal */}
      <Dialog open={showCitationModal} onOpenChange={setShowCitationModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Generate Citation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Format Selector */}
            <div className="flex gap-2">
              {(['apa', 'mla', 'chicago', 'bibtex'] as CitationFormat[]).map((format) => (
                <Button
                  key={format}
                  variant={citationFormat === format ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCitationFormat(format)}
                >
                  {format.toUpperCase()}
                </Button>
              ))}
            </div>

            {/* Citation Text */}
            <div className="relative">
              <pre className="glass-panel p-4 text-sm text-foreground whitespace-pre-wrap font-mono overflow-x-auto">
                {selectedPublication && generateCitation(selectedPublication, citationFormat)}
              </pre>
              <Button
                size="sm"
                className="absolute top-2 right-2 gap-1"
                onClick={() => selectedPublication && copyToClipboard(generateCitation(selectedPublication, citationFormat))}
              >
                {copiedCitation ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}