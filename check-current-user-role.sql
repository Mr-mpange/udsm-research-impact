-- Check the current logged-in user's role
-- Run this in Supabase SQL Editor

-- 1. List all users with their roles
SELECT 
  au.email,
  ur.role,
  p.display_name,
  au.id as user_id,
  CASE WHEN ur.role IS NULL THEN 'No Role Assigned' ELSE 'Has Role' END as status
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.user_id
LEFT JOIN profiles p ON au.id = p.user_id
ORDER BY au.created_at DESC;

-- 2. Check if moderator role exists for any user
SELECT 
  '=== MODERATOR USERS ===' as info;

SELECT 
  au.email,
  ur.role,
  au.id
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role = 'moderator';

-- 3. If no moderators, assign one
-- Uncomment to assign moderator role to resercher-udsm@gmail.com:

-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'moderator'
-- FROM auth.users
-- WHERE email = 'resercher-udsm@gmail.com'
-- AND NOT EXISTS (
--   SELECT 1 FROM user_roles WHERE user_id = auth.users.id AND role = 'moderator'
-- );
