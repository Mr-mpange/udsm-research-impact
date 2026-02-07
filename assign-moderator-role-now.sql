-- Quick script to assign moderator role
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zuqothviduizwcbawigy/editor

-- 1. Check current roles
SELECT 
  au.email,
  ur.role as current_role
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.user_id
ORDER BY au.email;

-- 2. Assign moderator role to resercher-udsm@gmail.com
-- (This will give them BOTH researcher AND moderator roles)
INSERT INTO user_roles (user_id, role)
SELECT 
  id,
  'moderator'
FROM auth.users
WHERE email = 'resercher-udsm@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM user_roles WHERE user_id = auth.users.id AND role = 'moderator'
);

-- 3. Verify the role was assigned
SELECT 
  '=== AFTER ASSIGNMENT ===' as info;

SELECT 
  au.email,
  ur.role,
  'Access /moderator dashboard' as can_access
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE au.email = 'resercher-udsm@gmail.com'
ORDER BY ur.role;

-- 4. Show all roles for this user
SELECT 
  '=== ALL ROLES FOR resercher-udsm@gmail.com ===' as info;

SELECT 
  role
FROM user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'resercher-udsm@gmail.com');

SELECT '✅ Moderator role assigned! Now login and go to /moderator' as result;
