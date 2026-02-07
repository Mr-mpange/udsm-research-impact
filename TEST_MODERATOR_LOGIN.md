# 🧪 Test Moderator Login - Step by Step

## Current Status
✅ Database confirmed: User has `moderator` and `researcher` roles  
✅ Code updated: AuthModal now checks for moderator role with detailed logging  
✅ Retry logic: Will attempt to fetch roles up to 5 times  

## Test Instructions

### Step 1: Open Browser Console
1. Press `F12` to open Developer Tools
2. Click on the **Console** tab
3. Keep it open during the entire test

### Step 2: Clear Everything
1. **Clear browser cache:**
   - Press `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Select "Cookies and other site data"
   - Click "Clear data"

2. **Or do a hard refresh:**
   - Press `Ctrl + F5`

### Step 3: Sign Out (if logged in)
1. Click your profile icon in the top right
2. Click "Sign Out"

### Step 4: Sign In
1. Click "Sign In" button
2. Enter credentials:
   - **Email:** `resercher-udsm@gmail.com`
   - **Password:** `11111111`
3. Click "Sign In"

### Step 5: Watch the Console
You should see these logs in order:

```
🔍 Starting role check for user: 707df9f9-b0a3-4263-ac0f-d1ba374ab8da resercher-udsm@gmail.com
📡 Attempt 1/5 to fetch roles...
Response: { data: [{role: "moderator"}, {role: "researcher"}], error: null }
✅ Roles found: [{role: "moderator"}, {role: "researcher"}]
🎭 Role check results:
  - isAdmin: false
  - isModerator: true
  - all roles: ["moderator", "researcher"]
🛡️ Moderator detected → /moderator
🚀 Redirecting to: /moderator
```

### Step 6: Verify Redirect
After login, you should see:
- **URL:** `http://localhost:8080/moderator` (NOT `/dashboard`)
- **Page Title:** "Moderator Dashboard" with Shield icon 🛡️
- **4 Tabs:** Overview, Publications, Collaboration, Analytics
- **Stats:** System-wide data (not personal data)

## If It Still Goes to /dashboard

### Check Console Logs
Look for these issues:

1. **No roles found:**
   ```
   ⚠️ No roles found after all attempts
   ```
   → RLS policy issue or database connection problem

2. **Error fetching roles:**
   ```
   ❌ Error checking role: [error message]
   ```
   → Check the error message

3. **Roles found but isModerator is false:**
   ```
   ✅ Roles found: [...]
   - isModerator: false
   ```
   → Role data format issue

### Manual Database Check
Run this in Supabase SQL Editor:
```sql
SELECT 
  au.email,
  ur.role,
  ur.user_id
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE au.email = 'resercher-udsm@gmail.com';
```

Expected result:
```
email: resercher-udsm@gmail.com, role: moderator
email: resercher-udsm@gmail.com, role: researcher
```

### Check RLS Policy
Run this to verify the policy allows reading roles:
```sql
SELECT * FROM user_roles 
WHERE user_id = '707df9f9-b0a3-4263-ac0f-d1ba374ab8da';
```

If this returns empty when run as the authenticated user, there's an RLS issue.

## What Changed in the Code

### File: `src/components/auth/AuthModal.tsx`

**Key improvements:**
1. ✅ Increased wait time from 500ms to 800ms
2. ✅ Increased retry attempts from 3 to 5
3. ✅ Increased retry delay from 300ms to 500ms
4. ✅ Added detailed console logging at every step
5. ✅ Shows exact roles fetched from database
6. ✅ Shows which redirect path is chosen

## Next Steps

1. **Test now** with the console open
2. **Copy the console logs** and share them if it still doesn't work
3. The logs will tell us exactly where the issue is

## Expected Behavior Summary

| Role | Redirect URL | Dashboard Title | Tabs |
|------|-------------|-----------------|------|
| Admin | `/admin` | Admin Dashboard | 5 tabs |
| Moderator | `/moderator` | Moderator Dashboard | 4 tabs |
| Researcher | `/dashboard` | Researcher Dashboard | 9 tabs |

Your account has **moderator** role, so it should go to `/moderator`.
