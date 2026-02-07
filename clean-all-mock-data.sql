-- Clean all mock/test data from database
-- Run this in Supabase SQL Editor

-- 1. Check what data exists
SELECT 'Publications' as table_name, COUNT(*) as count FROM researcher_publications
UNION ALL
SELECT 'Profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'Partner Institutions', COUNT(*) FROM partner_institutions
UNION ALL
SELECT 'Collaborations', COUNT(*) FROM collaboration_partnerships
UNION ALL
SELECT 'Chat History', COUNT(*) FROM chat_history
UNION ALL
SELECT 'Saved Dashboards', COUNT(*) FROM saved_dashboards
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'Research Teams', COUNT(*) FROM research_teams;

-- 2. Delete all test/mock data (CAREFUL - this deletes everything!)
-- Uncomment the lines below to actually delete:

-- DELETE FROM citation_snapshots;
-- DELETE FROM researcher_publications;
-- DELETE FROM collaboration_partnerships;
-- DELETE FROM partner_institutions;
-- DELETE FROM team_members;
-- DELETE FROM research_teams;
-- DELETE FROM collaboration_requests;
-- DELETE FROM notifications;
-- DELETE FROM saved_dashboards;
-- DELETE FROM chat_history;
-- DELETE FROM user_roles;
-- DELETE FROM profiles;

-- 3. Verify all tables are empty
SELECT 'Publications' as table_name, COUNT(*) as count FROM researcher_publications
UNION ALL
SELECT 'Profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'Partner Institutions', COUNT(*) FROM partner_institutions
UNION ALL
SELECT 'Collaborations', COUNT(*) FROM collaboration_partnerships;
