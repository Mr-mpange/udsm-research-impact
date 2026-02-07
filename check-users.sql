-- Check all users in the database
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zuqothviduizwcbawigy/editor

-- 1. Check Auth Users (from Supabase Auth)
SELECT 
  '=== AUTH USERS ===' as info,
  COUNT(*) as total_users
FROM auth.users;

-- 2. List all auth users with details
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN 'Verified'
    ELSE 'Not Verified'
  END as status
FROM auth.users
ORDER BY created_at DESC;

-- 3. Check Profiles (from your app)
SELECT 
  '=== USER PROFILES ===' as info,
  COUNT(*) as total_profiles
FROM profiles;

-- 4. List all profiles with details
SELECT 
  p.id,
  p.user_id,
  p.display_name,
  p.email,
  p.department,
  p.institution,
  p.orcid_id,
  p.h_index,
  p.total_citations,
  p.total_publications,
  p.created_at,
  au.email as auth_email
FROM profiles p
LEFT JOIN auth.users au ON p.user_id = au.id
ORDER BY p.created_at DESC;

-- 5. Check User Roles
SELECT 
  '=== USER ROLES ===' as info,
  COUNT(*) as total_roles
FROM user_roles;

-- 6. List users with their roles
SELECT 
  ur.user_id,
  ur.role,
  au.email,
  p.display_name,
  au.created_at
FROM user_roles ur
LEFT JOIN auth.users au ON ur.user_id = au.id
LEFT JOIN profiles p ON ur.user_id = p.user_id
ORDER BY au.created_at DESC;

-- 7. Summary by role
SELECT 
  role,
  COUNT(*) as count
FROM user_roles
GROUP BY role
ORDER BY count DESC;

-- 8. Users without profiles
SELECT 
  '=== USERS WITHOUT PROFILES ===' as info,
  COUNT(*) as count
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.user_id = au.id
);

-- 9. List users without profiles
SELECT 
  au.id,
  au.email,
  au.created_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.user_id = au.id
)
ORDER BY au.created_at DESC;

-- 10. Complete user overview
SELECT 
  au.email,
  p.display_name,
  p.department,
  p.institution,
  p.h_index,
  p.total_citations,
  p.total_publications,
  COALESCE(ur.role, 'No Role') as role,
  au.created_at as registered_at,
  au.last_sign_in_at,
  CASE 
    WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Verified'
    ELSE '❌ Not Verified'
  END as email_status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.user_id
LEFT JOIN user_roles ur ON au.id = ur.user_id
ORDER BY au.created_at DESC;
