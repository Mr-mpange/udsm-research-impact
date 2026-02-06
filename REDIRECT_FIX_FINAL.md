# Redirect Fix - Final Solution

## Problem
After signing in, users were not being redirected to their dashboard. They stayed on the home page.

## Root Cause
The issue was with the redirect timing and React Router navigation:
1. The auth state wasn't fully updated when trying to navigate
2. React Router's `navigate()` wasn't triggering a full page reload
3. The Dashboard/Admin pages check for `user` state, which wasn't immediately available

## Solution Implemented

### Changed Approach:
Instead of using React Router's `navigate()`, now using `window.location.href` for a full page reload.

### How It Works:
1. User submits sign-in form
2. Authentication completes successfully
3. `setShouldRedirect(true)` triggers the useEffect
4. useEffect waits for `user` to be available from auth context
5. Checks user's role in the database
6. Closes the modal
7. Uses `window.location.href` to redirect (full page reload)
   - Admin users → `/admin`
   - Regular users → `/dashboard`

### Key Changes in `AuthModal.tsx`:

```typescript
// Added state for redirect trigger
const [shouldRedirect, setShouldRedirect] = useState(false);

// Added useEffect to handle redirect after auth state updates
useEffect(() => {
  if (shouldRedirect && user) {
    const checkRoleAndRedirect = async () => {
      // Check admin role
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      const isAdmin = roles?.some(r => r.role === 'admin');
      
      // Close modal
      onClose();
      
      // Full page redirect
      setTimeout(() => {
        if (isAdmin) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }, 300);
    };
    
    checkRoleAndRedirect();
  }
}, [shouldRedirect, user, onClose]);

// In handleSubmit, trigger redirect after successful auth
const handleSubmit = async (e: React.FormEvent) => {
  // ... auth logic ...
  
  // Trigger redirect via useEffect
  setShouldRedirect(true);
};
```

## Why This Works

1. **Waits for auth state**: useEffect only runs when `user` is available
2. **Full page reload**: `window.location.href` ensures fresh auth state on target page
3. **Proper timing**: 300ms delay allows modal to close smoothly
4. **Role-based routing**: Checks database for admin role before redirecting

## Testing

### Test Regular User:
1. Sign in with regular account (no admin role)
2. Should redirect to `/dashboard`
3. Should see personal research dashboard

### Test Admin User:
1. Sign in with admin account (has admin role in user_roles table)
2. Should redirect to `/admin`
3. Should see admin dashboard

### If Still Not Working:

1. **Check browser console** for errors
2. **Verify Supabase connection** is working
3. **Check user_roles table** exists and has correct data:
   ```sql
   SELECT * FROM user_roles WHERE user_id = 'YOUR_USER_ID';
   ```
4. **Clear browser cache** and try again
5. **Check base URL** in vite.config.ts matches your deployment

## Files Modified

- `src/components/auth/AuthModal.tsx` - Complete rewrite of redirect logic

## Next Steps

1. Test the sign-in flow
2. Verify redirect works for both regular and admin users
3. Check that the correct dashboard loads after redirect
