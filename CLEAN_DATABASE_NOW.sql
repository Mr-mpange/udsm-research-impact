-- ⚠️ CLEAN ALL MOCK DATA FROM DATABASE
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zuqothviduizwcbawigy/editor

-- Step 1: Check current data
SELECT '=== CURRENT DATA COUNT ===' as info;

SELECT 'researcher_publications' as table_name, COUNT(*) as count FROM researcher_publications
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles  
UNION ALL
SELECT 'partner_institutions', COUNT(*) FROM partner_institutions
UNION ALL
SELECT 'collaboration_partnerships', COUNT(*) FROM collaboration_partnerships
UNION ALL
SELECT 'chat_history', COUNT(*) FROM chat_history
UNION ALL
SELECT 'saved_dashboards', COUNT(*) FROM saved_dashboards
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'research_teams', COUNT(*) FROM research_teams
UNION ALL
SELECT 'team_members', COUNT(*) FROM team_members
UNION ALL
SELECT 'citation_snapshots', COUNT(*) FROM citation_snapshots;

-- Step 2: DELETE ALL DATA (Uncomment to execute)
-- ⚠️ WARNING: This will delete ALL data from ALL tables!

-- Delete in correct order (respecting foreign keys)
DELETE FROM citation_snapshots;
DELETE FROM researcher_publications;
DELETE FROM team_members;
DELETE FROM collaboration_requests;
DELETE FROM research_teams;
DELETE FROM collaboration_partnerships;
DELETE FROM partner_institutions;
DELETE FROM notifications;
DELETE FROM saved_dashboards;
DELETE FROM chat_history;
DELETE FROM user_roles;
DELETE FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);
DELETE FROM audit_logs;

-- Step 3: Verify all tables are empty
SELECT '=== AFTER CLEANUP ===' as info;

SELECT 'researcher_publications' as table_name, COUNT(*) as count FROM researcher_publications
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'partner_institutions', COUNT(*) FROM partner_institutions
UNION ALL
SELECT 'collaboration_partnerships', COUNT(*) FROM collaboration_partnerships
UNION ALL
SELECT 'chat_history', COUNT(*) FROM chat_history
UNION ALL
SELECT 'saved_dashboards', COUNT(*) FROM saved_dashboards
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'research_teams', COUNT(*) FROM research_teams;

SELECT '✅ Database cleaned! All mock data removed.' as result;
