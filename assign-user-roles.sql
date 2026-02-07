-- Assign roles to users based on their email
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zuqothviduizwcbawigy/editor

-- 1. Check current users
SELECT 
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at;

-- 2. Check current roles
SELECT 
  ur.user_id,
  ur.role,
  au.email
FROM user_roles ur
LEFT JOIN auth.users au ON ur.user_id = au.id;

-- 3. Delete existing roles (if any)
DELETE FROM user_roles;

-- 4. Assign ADMIN role to admin-udsm@gmail.com
INSERT INTO user_roles (user_id, role)
SELECT 
  id,
  'admin'
FROM auth.users
WHERE email = 'admin-udsm@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM user_roles WHERE user_id = auth.users.id
);

-- 5. Assign RESEARCHER role to resercher-udsm@gmail.com
INSERT INTO user_roles (user_id, role)
SELECT 
  id,
  'researcher'
FROM auth.users
WHERE email = 'resercher-udsm@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM user_roles WHERE user_id = auth.users.id
);

-- 6. Verify roles assigned
SELECT 
  '=== ROLES ASSIGNED ===' as info;

SELECT 
  au.email,
  ur.role,
  au.created_at
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
ORDER BY au.created_at;

-- 7. Check if profiles exist
SELECT 
  '=== PROFILES STATUS ===' as info;

SELECT 
  au.email,
  CASE 
    WHEN p.id IS NOT NULL THEN '✅ Profile exists'
    ELSE '❌ No profile'
  END as profile_status,
  p.display_name,
  p.department
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.user_id
ORDER BY au.created_at;

-- 8. Create profiles if they don't exist
INSERT INTO profiles (user_id, email, display_name, institution)
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN au.email = 'admin-udsm@gmail.com' THEN 'Admin User'
    WHEN au.email = 'resercher-udsm@gmail.com' THEN 'Researcher User'
    ELSE 'User'
  END,
  'University of Dar es Salaam'
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.user_id = au.id
);

-- 9. Final verification
SELECT 
  '=== FINAL STATUS ===' as info;

SELECT 
  au.email,
  p.display_name,
  ur.role,
  p.department,
  p.institution,
  CASE 
    WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Verified'
    ELSE '❌ Not Verified'
  END as email_status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.user_id
LEFT JOIN user_roles ur ON au.id = ur.user_id
ORDER BY au.created_at;

SELECT '✅ Roles assigned successfully!' as result;
