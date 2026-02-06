-- Add citation metadata columns to researcher_publications
ALTER TABLE public.researcher_publications 
ADD COLUMN IF NOT EXISTS citation_source TEXT,
ADD COLUMN IF NOT EXISTS last_citation_update TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS semantic_scholar_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_publications_doi ON public.researcher_publications(doi) WHERE doi IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_publications_last_update ON public.researcher_publications(last_citation_update);

-- Add comment for documentation
COMMENT ON COLUMN public.researcher_publications.citation_source IS 'Source of citation data: crossref, semanticscholar, or manual';
COMMENT ON COLUMN public.researcher_publications.last_citation_update IS 'Timestamp of last citation count update from external APIs';
COMMENT ON COLUMN public.researcher_publications.semantic_scholar_id IS 'Semantic Scholar paper ID for faster lookups';
