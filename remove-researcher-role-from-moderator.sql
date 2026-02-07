-- Remove researcher role from moderator account
-- This will leave ONLY the moderator role
-- Run this in Supabase SQL Editor

-- Step 1: Check current roles
SELECT 
  '=== BEFORE REMOVAL ===' as step;

SELECT 
  au.email,
  ur.role,
  ur.id as role_record_id
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE au.email = 'resercher-udsm@gmail.com'
ORDER BY ur.role;

-- Step 2: Remove the researcher role (keep moderator)
DELETE FROM user_roles
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'resercher-udsm@gmail.com'
)
AND role = 'researcher';

-- Step 3: Verify removal
SELECT 
  '=== AFTER REMOVAL ===' as step;

SELECT 
  au.email,
  ur.role,
  'Only moderator role remains' as status
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE au.email = 'resercher-udsm@gmail.com';

-- Step 4: Confirm what the app will see
SELECT 
  '=== WHAT THE APP WILL SEE ===' as step;

SELECT 
  role,
  CASE 
    WHEN role = 'moderator' THEN '✅ isModerator = true → Redirect to /moderator'
    ELSE 'Other role'
  END as app_behavior
FROM user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'resercher-udsm@gmail.com');

-- Step 5: Final summary
SELECT 
  '=== SUMMARY ===' as step;

SELECT 
  CASE 
    WHEN COUNT(*) = 1 AND MAX(role::text) = 'moderator' 
    THEN '✅ SUCCESS: User has ONLY moderator role'
    ELSE '⚠️ WARNING: User has multiple roles or no moderator role'
  END as result
FROM user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'resercher-udsm@gmail.com');
