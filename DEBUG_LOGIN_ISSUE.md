# 🐛 Debug Login Redirect Issue

## Problem
User with moderator role is redirecting to `/dashboard` instead of `/moderator` after login.

## Database Status
✅ Confirmed: User has `moderator` role in database  
✅ RLS Policy: Allows user to read their own roles  

## Possible Causes

### 1. Code Not Deployed / Browser Cache
The updated `AuthModal.tsx` might not be running.

**Solution:**
```bash
# Stop the dev server (Ctrl+C)
# Clear node cache
npm run dev
```

Then in browser:
- Press `Ctrl + Shift + Delete`
- Clear cache and cookies
- Hard refresh: `Ctrl + F5`

### 2. Console Logs Not Showing
If you don't see the emoji logs (🔍, 📡, ✅, 🛡️), the new code isn't running.

**Check:**
1. Open browser console (F12)
2. Sign in
3. Look for logs starting with emojis

**If no logs appear:**
- The file wasn't saved
- The dev server didn't reload
- Browser is using cached version

### 3. Role Fetch Failing Silently
The role query might be returning empty due to timing.

**Check console for:**
```
📡 Attempt 1/5 to fetch roles...
Response: { data: null, error: ... }
```

or

```
⚠️ No roles found after all attempts
```

### 4. Window.location.href Not Working
The redirect might be blocked or overridden.

**Check console for:**
```
🚀 Redirecting to: /moderator
```

Then check if URL actually changes to `/moderator` or stays at `/` then goes to `/dashboard`.

## Step-by-Step Debug Process

### Step 1: Verify Code is Running
1. Open `src/components/auth/AuthModal.tsx`
2. Find line with: `console.log('🔍 Starting role check for user:'`
3. Make sure this line exists
4. Save the file
5. Check terminal - should see "HMR update" or similar

### Step 2: Test Login with Console Open
1. Open browser console (F12 → Console tab)
2. Clear console (trash icon)
3. Sign out if logged in
4. Sign in with: `resercher-udsm@gmail.com` / `11111111`
5. **IMMEDIATELY** look at console

### Step 3: Analyze Console Output

**Scenario A: No logs at all**
```
(empty console)
```
→ Code not running. Restart dev server.

**Scenario B: Logs show moderator detected**
```
🔍 Starting role check...
✅ Roles found: [{role: "moderator"}]
🛡️ Moderator detected → /moderator
🚀 Redirecting to: /moderator
```
→ Code is correct but redirect is being overridden. Check for other redirects.

**Scenario C: Logs show no roles**
```
📡 Attempt 1/5 to fetch roles...
Response: { data: [], error: null }
⚠️ No roles found after all attempts
👤 Regular user → /dashboard
```
→ RLS policy issue or timing issue. Need to increase wait time.

**Scenario D: Logs show error**
```
❌ Error checking role: [error message]
```
→ Database connection issue or RLS policy blocking access.

### Step 4: Manual Override Test

Add this temporary code to `AuthModal.tsx` line 90 (after the try block starts):

```typescript
// TEMPORARY DEBUG - FORCE MODERATOR REDIRECT
console.log('🧪 FORCING MODERATOR REDIRECT FOR TEST');
onClose();
setTimeout(() => {
  window.location.href = '/moderator';
}, 300);
return;
```

This will bypass all role checking and force redirect to `/moderator`.

**If this works:**
→ The redirect mechanism works, but role detection is failing.

**If this doesn't work:**
→ Something else is intercepting the redirect.

## Quick Fix: Direct URL Test

1. Sign in normally (even if it goes to `/dashboard`)
2. Manually type in browser: `http://localhost:8080/moderator`
3. Press Enter

**If you see the Moderator Dashboard:**
→ The page works, only the redirect is broken.

**If you see "Access Denied":**
→ The `useUserRole` hook is not detecting moderator role.

## Next Steps

Please provide:
1. ✅ Screenshot of browser console after login
2. ✅ What URL you end up at after login
3. ✅ Result of manually navigating to `/moderator`
4. ✅ Output of this SQL query:
   ```sql
   SELECT role FROM user_roles 
   WHERE user_id = '707df9f9-b0a3-4263-ac0f-d1ba374ab8da';
   ```

This will help identify exactly where the issue is.
