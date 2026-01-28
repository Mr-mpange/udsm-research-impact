import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, FileText, ExternalLink, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { usePublicationSearch, type SearchFilters } from '@/hooks/usePublicationSearch';

const quartileColors: Record<string, string> = {
  'Q1': 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
  'Q2': 'bg-primary/20 text-primary border-primary/30',
  'Q3': 'bg-secondary/20 text-secondary border-secondary/30',
  'Q4': 'bg-muted text-muted-foreground border-border',
};

export default function PublicationSearch() {
  const { results, isSearching, totalCount, search, getAllPublications, getDistinctJournals, getYearRange } = usePublicationSearch();
  
  const [filters, setFilters] = useState<SearchFilters>({ query: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [journals, setJournals] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState({ min: 2000, max: new Date().getFullYear() });
  const [selectedYearRange, setSelectedYearRange] = useState<[number, number]>([2000, new Date().getFullYear()]);
  const [citationRange, setCitationRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    const init = async () => {
      await getAllPublications();
      const fetchedJournals = await getDistinctJournals();
      setJournals(fetchedJournals);
      const range = await getYearRange();
      setYearRange(range);
      setSelectedYearRange([range.min, range.max]);
    };
    init();
  }, []);

  const handleSearch = () => {
    const searchFilters: SearchFilters = {
      query: filters.query,
      yearFrom: selectedYearRange[0],
      yearTo: selectedYearRange[1],
      quartile: filters.quartile,
      minCitations: citationRange[0],
      maxCitations: citationRange[1] === 1000 ? undefined : citationRange[1],
      journal: filters.journal,
    };
    search(searchFilters);
  };

  const handleClearFilters = () => {
    setFilters({ query: '' });
    setSelectedYearRange([yearRange.min, yearRange.max]);
    setCitationRange([0, 1000]);
    getAllPublications();
  };

  const activeFiltersCount = [
    filters.quartile,
    filters.journal,
    selectedYearRange[0] !== yearRange.min || selectedYearRange[1] !== yearRange.max,
    citationRange[0] > 0 || citationRange[1] < 1000,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search publications by title, journal..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            'Search'
          )}
        </Button>

        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 min-w-5 p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Publications</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Quartile Filter */}
              <div className="space-y-2">
                <Label>Journal Quartile</Label>
                <Select
                  value={filters.quartile || 'all'}
                  onValueChange={(value) => setFilters({ ...filters, quartile: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select quartile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Quartiles</SelectItem>
                    <SelectItem value="Q1">Q1 - Top 25%</SelectItem>
                    <SelectItem value="Q2">Q2 - Top 50%</SelectItem>
                    <SelectItem value="Q3">Q3 - Top 75%</SelectItem>
                    <SelectItem value="Q4">Q4 - Bottom 25%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Journal Filter */}
              <div className="space-y-2">
                <Label>Journal</Label>
                <Select
                  value={filters.journal || 'all'}
                  onValueChange={(value) => setFilters({ ...filters, journal: value === 'all' ? undefined : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select journal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Journals</SelectItem>
                    {journals.map(journal => (
                      <SelectItem key={journal} value={journal}>{journal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Range */}
              <div className="space-y-2">
                <Label>Publication Year: {selectedYearRange[0]} - {selectedYearRange[1]}</Label>
                <Slider
                  min={yearRange.min}
                  max={yearRange.max}
                  step={1}
                  value={selectedYearRange}
                  onValueChange={(value) => setSelectedYearRange(value as [number, number])}
                  className="py-2"
                />
              </div>

              {/* Citation Range */}
              <div className="space-y-2">
                <Label>Citations: {citationRange[0]} - {citationRange[1] === 1000 ? '1000+' : citationRange[1]}</Label>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={citationRange}
                  onValueChange={(value) => setCitationRange(value as [number, number])}
                  className="py-2"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={handleClearFilters}>
                  Clear All
                </Button>
                <Button className="flex-1" onClick={() => { handleSearch(); setShowFilters(false); }}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{totalCount} publication{totalCount !== 1 ? 's' : ''} found</span>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="w-3 h-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Results List */}
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-3">
          {results.map((pub, index) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="glass-panel p-4 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    <h4 className="font-medium text-foreground line-clamp-1">{pub.title}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    {pub.journal && (
                      <>
                        <BookOpen className="w-3 h-3" />
                        <span className="line-clamp-1">{pub.journal}</span>
                      </>
                    )}
                    {pub.year && <span>• {pub.year}</span>}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {pub.quartile && (
                      <Badge variant="outline" className={quartileColors[pub.quartile] || ''}>
                        {pub.quartile}
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      {pub.citations || 0} citations
                    </Badge>
                    {pub.co_authors && pub.co_authors.length > 0 && (
                      <Badge variant="outline" className="text-muted-foreground">
                        {pub.co_authors.length} co-author{pub.co_authors.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>

                {pub.doi && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => window.open(`https://doi.org/${pub.doi}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}

          {results.length === 0 && !isSearching && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No publications found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
