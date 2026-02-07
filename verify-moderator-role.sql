-- Verify moderator role for resercher-udsm@gmail.com
-- Run this in Supabase SQL Editor

-- 1. Check the user exists
SELECT 
  '=== USER CHECK ===' as step;

SELECT 
  id,
  email,
  created_at
FROM auth.users
WHERE email = 'resercher-udsm@gmail.com';

-- 2. Check ALL roles for this user
SELECT 
  '=== ALL ROLES FOR THIS USER ===' as step;

SELECT 
  ur.role,
  ur.user_id,
  ur.id as role_id,
  au.email
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE au.email = 'resercher-udsm@gmail.com';

-- 3. Check if moderator role specifically exists
SELECT 
  '=== MODERATOR ROLE CHECK ===' as step;

SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 
      FROM user_roles ur
      JOIN auth.users au ON ur.user_id = au.id
      WHERE au.email = 'resercher-udsm@gmail.com' 
      AND ur.role = 'moderator'
    ) THEN '✅ MODERATOR ROLE EXISTS'
    ELSE '❌ MODERATOR ROLE MISSING'
  END as status;

-- 4. If missing, add it
-- Uncomment these lines if the role is missing:

-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'moderator'::app_role
-- FROM auth.users
-- WHERE email = 'resercher-udsm@gmail.com'
-- ON CONFLICT (user_id, role) DO NOTHING;

-- 5. Final verification
SELECT 
  '=== FINAL VERIFICATION ===' as step;

SELECT 
  au.email,
  array_agg(ur.role ORDER BY ur.role) as all_roles,
  CASE 
    WHEN 'moderator' = ANY(array_agg(ur.role)) THEN '✅ Can access /moderator'
    ELSE '❌ Cannot access /moderator'
  END as access_status
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.user_id
WHERE au.email = 'resercher-udsm@gmail.com'
GROUP BY au.email;
