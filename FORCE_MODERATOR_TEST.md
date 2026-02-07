# 🔧 Force Moderator Redirect Test

Since the automatic redirect isn't working, let's test if the moderator page itself works.

## Test 1: Direct URL Access

1. **Sign in normally** (even if it goes to `/dashboard`)
2. **Manually change the URL** in the browser address bar to:
   ```
   http://localhost:8080/moderator
   ```
3. Press Enter

### Expected Results:

**If you see "Access Denied":**
- The `useUserRole` hook is not detecting your moderator role
- This means the problem is in role detection, not the redirect

**If you see the Moderator Dashboard:**
- The page works fine
- The problem is ONLY in the AuthModal redirect logic
- The role detection works when the page loads

## Test 2: Check Role Detection in Browser Console

1. Sign in (go to `/dashboard`)
2. Open browser console (F12)
3. Type this and press Enter:
   ```javascript
   fetch('https://zuqothviduizwcbawigy.supabase.co/rest/v1/user_roles?select=role', {
     headers: {
       'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cW90aHZpZHVpendjYmF3aWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMjI0NzksImV4cCI6MjA1MjU5ODQ3OX0.xvJqKPzqQYqLqQqLqQqLqQqLqQqLqQqLqQqLqQqLqQ',
       'Authorization': 'Bearer ' + (await supabase.auth.getSession()).data.session.access_token
     }
   }).then(r => r.json()).then(console.log)
   ```

This will show you what roles the API returns.

## Test 3: Add Debug Button to Dashboard

Let me create a temporary debug component you can add to test the redirect.

Add this to `src/pages/Dashboard.tsx` after the header, around line 100:

```tsx
{/* TEMPORARY DEBUG BUTTON */}
<div className="fixed bottom-4 right-4 z-50">
  <Button 
    onClick={async () => {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      console.log('Current user roles:', roles);
      alert('Roles: ' + JSON.stringify(roles));
      
      const isModerator = roles?.some(r => r.role === 'moderator');
      if (isModerator) {
        console.log('You ARE a moderator, redirecting...');
        window.location.href = '/moderator';
      } else {
        alert('You are NOT a moderator');
      }
    }}
    className="bg-red-500 hover:bg-red-600"
  >
    🐛 Test Moderator Redirect
  </Button>
</div>
```

Don't forget to import supabase at the top:
```tsx
import { supabase } from '@/integrations/supabase/client';
```

Then:
1. Sign in
2. Click the red debug button
3. It will show your roles and try to redirect

## Test 4: Check if Role is Being Cached

The issue might be that the role is cached from a previous session.

1. **Clear all site data:**
   - Open DevTools (F12)
   - Go to Application tab
   - Click "Clear site data"
   - Click "Clear all"

2. **Sign out completely**

3. **Close the browser tab**

4. **Open a new tab**

5. **Sign in again**

## Most Likely Issue

Based on the code, I suspect the issue is:

**The `user` object in the AuthModal useEffect might not be updating correctly.**

The useEffect has `[shouldRedirect, user, onClose]` as dependencies. If `user` is null when `shouldRedirect` becomes true, the effect won't run.

Let me create a fix for this...
