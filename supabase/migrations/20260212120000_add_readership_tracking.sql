-- Add readership tracking tables
-- Only creates new tables, doesn't modify existing ones

-- Table: paper_views (NEW)
CREATE TABLE IF NOT EXISTS public.paper_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID REFERENCES public.researcher_publications(id) ON DELETE CASCADE,
  country VARCHAR(100),
  city VARCHAR(100),
  referrer TEXT,
  user_agent TEXT,
  ip_hash VARCHAR(64),
  session_id VARCHAR(100),
  view_duration INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Table: paper_downloads (NEW)
CREATE TABLE IF NOT EXISTS public.paper_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID REFERENCES public.researcher_publications(id) ON DELETE CASCADE,
  country VARCHAR(100),
  city VARCHAR(100),
  ip_hash VARCHAR(64),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_paper_views_paper ON public.paper_views(paper_id);
CREATE INDEX IF NOT EXISTS idx_paper_views_country ON public.paper_views(country);
CREATE INDEX IF NOT EXISTS idx_paper_views_timestamp ON public.paper_views(timestamp);
CREATE INDEX IF NOT EXISTS idx_paper_downloads_paper ON public.paper_downloads(paper_id);

-- View: readership_by_country (NEW)
CREATE OR REPLACE VIEW public.readership_by_country AS
SELECT 
  paper_id,
  country,
  COUNT(*) as total_views,
  COUNT(DISTINCT session_id) as unique_visitors
FROM public.paper_views
WHERE country IS NOT NULL
GROUP BY paper_id, country;

-- Enable RLS
ALTER TABLE public.paper_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all to read, anyone to write for tracking)
DROP POLICY IF EXISTS "Anyone can view paper_views" ON public.paper_views;
CREATE POLICY "Anyone can view paper_views" ON public.paper_views FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert paper_views" ON public.paper_views;
CREATE POLICY "Anyone can insert paper_views" ON public.paper_views FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view paper_downloads" ON public.paper_downloads;
CREATE POLICY "Anyone can view paper_downloads" ON public.paper_downloads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert paper_downloads" ON public.paper_downloads;
CREATE POLICY "Anyone can insert paper_downloads" ON public.paper_downloads FOR INSERT WITH CHECK (true);
