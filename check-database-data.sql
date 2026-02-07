-- Check what real data exists in the database
-- Run this in Supabase SQL Editor to see current data

-- 1. Check Publications
SELECT 
  COUNT(*) as total_publications,
  SUM(citations) as total_citations,
  ROUND(AVG(citations)) as avg_citations
FROM researcher_publications;

-- 2. Check Partner Institutions
SELECT 
  COUNT(*) as total_partners,
  STRING_AGG(name, ', ') as partner_names
FROM partner_institutions;

-- 3. Check Active Researchers
SELECT 
  COUNT(*) as total_researchers
FROM profiles;

-- 4. Check Collaboration Data
SELECT 
  pi.name as partner,
  cp.collaboration_count,
  cp.joint_publications,
  cp.impact_score
FROM collaboration_partnerships cp
JOIN partner_institutions pi ON cp.partner_institution_id = pi.id
ORDER BY cp.collaboration_count DESC
LIMIT 10;

-- 5. Sample Publications (if any)
SELECT 
  title,
  citations,
  year,
  created_at
FROM researcher_publications
ORDER BY citations DESC
LIMIT 5;
