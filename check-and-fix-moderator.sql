-- Check and fix moderator role assignment
-- Run this in Supabase SQL Editor

-- Step 1: Check current roles
SELECT 
  '=== CURRENT USER ROLES ===' as step;

SELECT 
  au.email,
  ur.role,
  au.id as user_id
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.user_id
ORDER BY au.email;

-- Step 2: Assign moderator role to resercher-udsm@gmail.com
SELECT 
  '=== ASSIGNING MODERATOR ROLE ===' as step;

INSERT INTO user_roles (user_id, role)
SELECT 
  id,
  'moderator'::app_role
FROM auth.users
WHERE email = 'resercher-udsm@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Verify assignment
SELECT 
  '=== VERIFICATION ===' as step;

SELECT 
  au.email,
  ur.role,
  'Can access /moderator' as access
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE au.email = 'resercher-udsm@gmail.com'
ORDER BY ur.role;

-- Step 4: Show what the useUserRole hook will see
SELECT 
  '=== WHAT THE APP WILL SEE ===' as step;

SELECT 
  role,
  CASE 
    WHEN role = 'admin' THEN 'isAdmin = true'
    WHEN role = 'moderator' THEN 'isModerator = true'
    WHEN role = 'researcher' THEN 'isResearcher = true'
    ELSE 'isUser = true'
  END as hook_result
FROM user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'resercher-udsm@gmail.com');
