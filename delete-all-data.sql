-- ⚠️ WARNING: This will DELETE ALL DATA but keep users and their roles!
-- Run these commands in Supabase SQL Editor
-- All users will remain with their roles, but all research data will be deleted

-- Step 1: Delete all citation snapshots
DELETE FROM citation_snapshots;

-- Step 2: Delete all publications
DELETE FROM researcher_publications;

-- Step 3: Delete all chat history
DELETE FROM chat_history;

-- Step 4: Delete all saved dashboards
DELETE FROM saved_dashboards;

-- Step 5: Delete all notifications
DELETE FROM notifications;

-- Step 6: Delete all collaboration requests
DELETE FROM collaboration_requests;

-- Step 7: Delete all team members
DELETE FROM team_members;

-- Step 8: Delete all research teams
DELETE FROM research_teams;

-- Step 9: Keep all user_roles (no deletion)
-- Step 10: Keep all profiles but reset their stats to zero
UPDATE profiles 
SET 
  h_index = 0,
  total_citations = 0,
  total_publications = 0;

-- Verify deletion - should show 0 or very small numbers
SELECT 
  (SELECT COUNT(*) FROM researcher_publications) as publications,
  (SELECT COUNT(*) FROM profiles) as profiles,
  (SELECT COUNT(*) FROM citation_snapshots) as snapshots,
  (SELECT COUNT(*) FROM chat_history) as chats;
