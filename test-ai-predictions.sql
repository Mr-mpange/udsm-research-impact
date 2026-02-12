-- Test AI Predictions with Real Data
-- This script creates a test researcher with publications to demonstrate AI predictions

-- Step 1: Create test researcher (use your existing account or create new one)
-- Replace 'YOUR_USER_ID' with your actual user_id from profiles table

-- To get your user_id, run:
-- SELECT user_id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Step 2: Insert test publications
-- These publications will generate real AI predictions

-- Publication 1: 2022 - Older paper with moderate citations
INSERT INTO researcher_publications (
  user_id,
  title,
  doi,
  journal,
  year,
  citations,
  citation_source,
  last_citation_update
) VALUES (
  '707df9f9-b0a3-4263-ac0f-d1ba374ab8da', -- Replace with your user_id
  'Climate Change Impacts on Coastal Ecosystems',
  '10.1371/journal.pone.0014613',  -- Real DOI (PLOS ONE - Indian Ocean Biodiversity)
  'PLOS ONE',
  2022,
  15,
  'manual',
  NOW()
);

-- Publication 2: 2023 - Growing paper
INSERT INTO researcher_publications (
  user_id,
  title,
  doi,
  journal,
  year,
  citations,
  citation_source,
  last_citation_update
) VALUES (
  '707df9f9-b0a3-4263-ac0f-d1ba374ab8da',
  'Women and Adaptive Capacity to Climate Change in East African Seascapes',
  '10.3389/fmars.2022.931883',  -- Real DOI (Frontiers in Marine Science - Zanzibar study)
  'Frontiers in Marine Science',
  2023,
  25,
  'manual',
  NOW()
);

-- Publication 3: 2023 - Data science paper
INSERT INTO researcher_publications (
  user_id,
  title,
  doi,
  journal,
  year,
  citations,
  citation_source,
  last_citation_update
) VALUES (
  '707df9f9-b0a3-4263-ac0f-d1ba374ab8da',
  'Benthic Biodiversity of the Indian Ocean',
  '10.3389/fmars.2022.877196',  -- Real DOI (Frontiers in Marine Science - Editorial)
  'Frontiers in Marine Science',
  2023,
  10,
  'manual',
  NOW()
);

-- Publication 4: 2024 - Recent high-impact paper
INSERT INTO researcher_publications (
  user_id,
  title,
  doi,
  journal,
  year,
  citations,
  citation_source,
  last_citation_update
) VALUES (
  '707df9f9-b0a3-4263-ac0f-d1ba374ab8da',
  'Organic Matter Dynamics in the Eastern Indian Ocean',
  '10.3389/fmars.2023.1141844',  -- Real DOI (Frontiers in Marine Science)
  'Frontiers in Marine Science',
  2024,
  30,
  'manual',
  NOW()
);

-- Publication 5: 2024 - Recent coastal research
INSERT INTO researcher_publications (
  user_id,
  title,
  doi,
  journal,
  year,
  citations,
  citation_source,
  last_citation_update
) VALUES (
  '707df9f9-b0a3-4263-ac0f-d1ba374ab8da',
  'Marine Macrobenthos Biodiversity in Northwest India',
  '10.3389/fmars.2021.671245',  -- Real DOI (Frontiers in Marine Science)
  'Frontiers in Marine Science',
  2024,
  20,
  'manual',
  NOW()
);

-- Step 3: Update profile with total citations
UPDATE profiles
SET 
  total_citations = 100,  -- Sum of all citations (15+25+10+30+20)
  total_publications = 5,
  h_index = 4,  -- 4 papers have at least 4 citations
  updated_at = NOW()
WHERE user_id = '707df9f9-b0a3-4263-ac0f-d1ba374ab8da';

-- Step 4: (Optional) Add citation snapshots for better predictions
-- SKIP THIS STEP - The AI predictions work fine without snapshots!
-- If you want to add them later, follow these steps:

-- First, get your publication IDs:
-- SELECT id, title FROM researcher_publications WHERE user_id = 'YOUR_USER_ID';

-- Then insert snapshots using the ACTUAL IDs (not 'PUB_ID_1'):
-- Example:
-- INSERT INTO citation_snapshots (publication_id, citations, snapshot_date) VALUES
-- ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 5, '2022-06-01'),
-- ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 10, '2023-01-01'),
-- ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 15, '2024-01-01');

-- Step 5: Verify data
SELECT 
  title,
  year,
  journal,
  citations,
  citation_source
FROM researcher_publications
WHERE user_id = '707df9f9-b0a3-4263-ac0f-d1ba374ab8da'
ORDER BY year DESC;

-- Check profile
SELECT 
  display_name,
  total_publications,
  total_citations,
  h_index
FROM profiles
WHERE user_id = '707df9f9-b0a3-4263-ac0f-d1ba374ab8da';

-- ============================================
-- EXPECTED AI PREDICTIONS
-- ============================================

/*
After inserting this data, the AI will predict:

1. CITATION FORECAST (Next 5 Years):
   - Current (2024): 100 citations
   - 2025: ~150 citations (+50%)
   - 2026: ~225 citations (+50%)
   - 2027: ~338 citations (+50%)
   - 2028: ~507 citations (+50%)
   - 2029: ~761 citations (+50%)
   
   Growth rate: 50% per year
   (Based on: Recent papers (50 cites) vs Older papers (50 cites) in 2 years)

2. EMERGING TOPICS:
   - Environmental Science: +100% growth (2 recent, 1 old)
   - Marine Biology: 0% growth (1 recent, 1 old)
   - Data Science: NEW TOPIC (1 recent, 0 old)
   
   Recommendation: Focus on Environmental Science

3. PARTNER RECOMMENDATIONS:
   - Will search for researchers publishing in:
     * Environmental Science Journal
     * Marine Biology Research
     * Data Science Journal
   - Shows top 5 matches with similarity scores

4. IMPACT SIMULATOR:
   Total growth: 661 citations over 5 years
   
   - Increase Publication Rate +30%: +198 citations
   - Focus on High-Impact Journals: +331 citations
   - Expand Collaborations: +264 citations
   
   Recommendation: Target high-impact journals!
*/

-- ============================================
-- HOW TO USE
-- ============================================

/*
1. Replace 'YOUR_USER_ID' with your actual user_id
   
   To find your user_id:
   SELECT user_id, email FROM auth.users WHERE email = 'your-email@example.com';

2. Run this script in Supabase SQL Editor

3. Go to your Dashboard → AI Predictions tab

4. You should see:
   ✅ Citation forecast chart (5-year projection)
   ✅ Emerging topics (Environmental Science at top)
   ✅ Partner recommendations (if other researchers exist)
   ✅ Impact simulator (showing +198, +331, +264 citations)

5. To test accuracy:
   - Add another publication
   - Watch predictions update automatically
   - Compare with manual calculations

6. To clean up test data:
   DELETE FROM citation_snapshots WHERE publication_id IN (
     SELECT id FROM researcher_publications WHERE user_id = 'YOUR_USER_ID'
   );
   DELETE FROM researcher_publications WHERE user_id = 'YOUR_USER_ID';
   UPDATE profiles SET total_citations = 0, total_publications = 0 WHERE user_id = 'YOUR_USER_ID';
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if predictions are working:

-- 1. Total citations (should be 100)
SELECT SUM(citations) as total_citations
FROM researcher_publications
WHERE user_id = '707df9f9-b0a3-4263-ac0f-d1ba374ab8da';

-- 2. Publications by year (should show growth)
SELECT 
  year,
  COUNT(*) as papers,
  SUM(citations) as citations
FROM researcher_publications
WHERE user_id = '707df9f9-b0a3-4263-ac0f-d1ba374ab8da'
GROUP BY year
ORDER BY year;

-- 3. Journal distribution (for topic analysis)
SELECT 
  journal,
  COUNT(*) as papers,
  SUM(citations) as citations,
  AVG(citations) as avg_citations
FROM researcher_publications
WHERE user_id = '707df9f9-b0a3-4263-ac0f-d1ba374ab8da'
GROUP BY journal
ORDER BY papers DESC;

-- 4. Citation growth rate (for forecast)
SELECT 
  CASE 
    WHEN year >= 2024 THEN 'Recent'
    ELSE 'Older'
  END as period,
  COUNT(*) as papers,
  SUM(citations) as citations,
  AVG(citations) as avg_citations
FROM researcher_publications
WHERE user_id = '707df9f9-b0a3-4263-ac0f-d1ba374ab8da'
GROUP BY period;

-- Expected result:
-- Recent: 2 papers, 50 citations, 25 avg
-- Older: 3 papers, 50 citations, 16.7 avg
-- Growth: 25/16.7 = 1.5x = 50% growth rate

-- ============================================
-- TROUBLESHOOTING
-- ============================================

/*
If predictions show 0 or empty:

1. Check user_id is correct:
   SELECT user_id, email FROM auth.users LIMIT 5;

2. Check publications exist:
   SELECT COUNT(*) FROM researcher_publications WHERE user_id = 'YOUR_USER_ID';

3. Check profile is updated:
   SELECT * FROM profiles WHERE user_id = 'YOUR_USER_ID';

4. Check browser console for errors:
   Open DevTools → Console → Look for errors

5. Refresh the page:
   The AI recalculates on every page load

6. Check if you're logged in:
   The AI only shows predictions for logged-in users
*/
