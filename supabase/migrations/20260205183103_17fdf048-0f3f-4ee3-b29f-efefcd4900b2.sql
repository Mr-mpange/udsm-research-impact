-- Make publications publicly readable for the research network
-- Add a policy for public SELECT access to researcher_publications
CREATE POLICY "Anyone can view publications in research network"
ON public.researcher_publications
FOR SELECT
USING (true);

-- Add abstract column for rich publication metadata
ALTER TABLE public.researcher_publications 
ADD COLUMN IF NOT EXISTS abstract TEXT,
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}';