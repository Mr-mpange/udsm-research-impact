-- FIX: Add moderator role and remove researcher role
-- Run this in Supabase SQL Editor NOW

-- Step 1: Check current state
SELECT 
  '=== CURRENT ROLES ===' as step;

SELECT 
  au.email,
  ur.role,
  ur.id as role_id
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE au.email = 'resercher-udsm@gmail.com';

-- Step 2: DELETE researcher role
DELETE FROM user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'resercher-udsm@gmail.com')
AND role = 'researcher';

-- Step 3: INSERT moderator role (if not exists)
INSERT INTO user_roles (user_id, role)
SELECT 
  id,
  'moderator'::app_role
FROM auth.users
WHERE email = 'resercher-udsm@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 4: Verify the fix
SELECT 
  '=== AFTER FIX ===' as step;

SELECT 
  au.email,
  ur.role,
  CASE 
    WHEN ur.role = 'moderator' THEN '✅ CORRECT - Will redirect to /moderator'
    ELSE '❌ WRONG - Will redirect to /dashboard'
  END as status
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE au.email = 'resercher-udsm@gmail.com';


    "email": "resercher-udsm@gmail.com",
-- Step 5: Final check
SELECT 
  '=== FINAL VERIFICATION ===' as step;

SELECT 
  COUNT(*) as total_roles,
  STRING_AGG(role::text, ', ') as all_roles,
  CASE 
    WHEN 'moderator' = ANY(ARRAY_AGG(role::text)) THEN '✅ HAS MODERATOR ROLE'
    ELSE '❌ NO MODERATOR ROLE'
  END as has_moderator
FROM user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'resercher-udsm@gmail.com');
