# 📊 Check Supabase Logs

## How to View Supabase Logs

### Method 1: Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard/project/zuqothviduizwcbawigy
2. Click on **"Logs"** in the left sidebar
3. Select **"API"** logs
4. Filter by time: Last 1 hour
5. Look for queries to `user_roles` table

### Method 2: Check Recent Queries

Run this in Supabase SQL Editor to see if the role query is being executed:

```sql
-- This won't show actual logs, but will verify the data exists
SELECT 
  '=== CHECKING IF ROLE DATA IS ACCESSIBLE ===' as info;

-- Check if the user_roles table has data
SELECT 
  COUNT(*) as total_roles,
  COUNT(DISTINCT user_id) as total_users_with_roles
FROM user_roles;

-- Check the specific user's roles
SELECT 
  au.email,
  ur.role,
  ur.user_id,
  ur.created_at
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE au.email = 'resercher-udsm@gmail.com'
ORDER BY ur.role;

-- Check if RLS is blocking the query
SELECT 
  '=== RLS POLICY CHECK ===' as info;

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'user_roles';
```

## What to Look For in Supabase API Logs

When you sign in, you should see:

1. **Auth request:**
   ```
   POST /auth/v1/token?grant_type=password
   Status: 200
   ```

2. **Role query (this is what we need to see):**
   ```
   GET /rest/v1/user_roles?select=role&user_id=eq.707df9f9-b0a3-4263-ac0f-d1ba374ab8da
   Status: 200
   Response: [{"role":"moderator"}]
   ```

3. **If you see Status: 401 or empty response:**
   - RLS policy is blocking the query
   - User is not authenticated when query runs

## Check RLS Policy

The current policy is:
```sql
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
```

This means:
- ✅ User MUST be authenticated
- ✅ User can ONLY see their own roles
- ❌ If `auth.uid()` is null, query returns empty

## Test RLS Policy

Run this to test if RLS is working:

```sql
-- Test as the authenticated user
-- (Run this in Supabase SQL Editor while logged in as that user)

SELECT 
  '=== TESTING RLS AS AUTHENTICATED USER ===' as info;

-- This should return the roles
SELECT role 
FROM user_roles 
WHERE user_id = auth.uid();

-- This should return the user ID
SELECT auth.uid() as my_user_id;

-- If auth.uid() returns NULL, the user is not authenticated in the SQL editor
```

## Common Issues

### Issue 1: Query Happens Before Auth Completes
**Symptom:** Supabase logs show query with Status 401 or empty result  
**Cause:** The role query runs before the user is fully authenticated  
**Solution:** Increase the wait time in AuthModal (already set to 800ms)

### Issue 2: RLS Policy Too Strict
**Symptom:** Query returns empty even though data exists  
**Cause:** `auth.uid()` doesn't match `user_id`  
**Solution:** Check if user_id in database matches auth.uid()

### Issue 3: Multiple Rapid Queries
**Symptom:** Logs show 5 queries in quick succession, all returning empty  
**Cause:** Retry logic running but auth not ready  
**Solution:** Increase initial wait time before first attempt

## Quick Fix: Temporarily Disable RLS for Testing

**⚠️ ONLY FOR TESTING - DO NOT USE IN PRODUCTION**

```sql
-- Temporarily allow all authenticated users to see all roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view all roles (TEMP)" ON public.user_roles
  FOR SELECT TO authenticated USING (true);
```

Then test login. If it works, the issue is RLS timing.

To restore the secure policy:
```sql
DROP POLICY IF EXISTS "Users can view all roles (TEMP)" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
```

## What to Share

Please share:
1. Screenshot of Supabase Dashboard → Logs → API (filtered for last 10 minutes)
2. Any queries to `/rest/v1/user_roles`
3. The status codes (200, 401, etc.)
4. The response data

This will show us if the role query is even reaching the database.
