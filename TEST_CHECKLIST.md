# Testing Checklist

## Before Testing
- [ ] Make sure you have Supabase configured
- [ ] Database tables are set up (profiles, user_roles, etc.)
- [ ] Application is running (`npm run dev`)

## Test 1: Regular User Sign-in
- [ ] Go to home page (/)
- [ ] Click "Sign In" button
- [ ] Enter regular user credentials (no admin role)
- [ ] Click "Sign In"
- [ ] **Expected**: Automatically redirected to `/dashboard`
- [ ] **Expected**: See personal research dashboard with tabs: Overview, Publications, Search, Teams, Impact, Network, ORCID
- [ ] **Expected**: No "Admin Panel" button visible

## Test 2: Admin User Sign-in
- [ ] Sign out if logged in
- [ ] Go to home page (/)
- [ ] Click "Sign In" button
- [ ] Enter admin user credentials (has admin role in user_roles table)
- [ ] Click "Sign In"
- [ ] **Expected**: Automatically redirected to `/admin`
- [ ] **Expected**: See admin dashboard with tabs: Analytics, User Management, Reports
- [ ] **Expected**: See university-wide stats (Total Researchers, Publications, etc.)

## Test 3: Navigation - Public User
- [ ] Sign out if logged in
- [ ] Go to home page (/)
- [ ] **Expected**: See navigation: Global Impact, Research Network, Analytics Demo, Collaboration Demo, Predictions Demo
- [ ] **Expected**: See "Sign In" button
- [ ] **Expected**: No "My Dashboard" or "Admin" buttons

## Test 4: Navigation - Regular User
- [ ] Sign in as regular user
- [ ] Go to home page (/)
- [ ] **Expected**: See navigation: Global Impact, Research Network, My Dashboard
- [ ] **Expected**: No demo tabs visible
- [ ] **Expected**: No "Admin" button
- [ ] Click "My Dashboard"
- [ ] **Expected**: Navigate to `/dashboard`

## Test 5: Navigation - Admin User
- [ ] Sign in as admin user
- [ ] Go to home page (/)
- [ ] **Expected**: See navigation: Global Impact, Research Network, My Dashboard, Admin
- [ ] **Expected**: No demo tabs visible
- [ ] Click "Admin"
- [ ] **Expected**: Navigate to `/admin`
- [ ] Click "My Dashboard"
- [ ] **Expected**: Navigate to `/dashboard`

## Test 6: Admin Panel Button in Dashboard
- [ ] Sign in as admin user
- [ ] Navigate to `/dashboard`
- [ ] **Expected**: See "Admin Panel" button in header
- [ ] Click "Admin Panel"
- [ ] **Expected**: Navigate to `/admin`

## Test 7: Sign Up Flow
- [ ] Sign out if logged in
- [ ] Click "Sign In" button
- [ ] Click "Don't have an account? Sign up"
- [ ] Enter name, email, password
- [ ] Click "Create Account"
- [ ] **Expected**: Account created successfully
- [ ] **Expected**: Automatically redirected to `/dashboard` (new users are not admin by default)

## Test 8: Mobile Navigation
- [ ] Resize browser to mobile size (or use mobile device)
- [ ] Click hamburger menu
- [ ] **Expected**: See appropriate navigation items based on auth status
- [ ] Test navigation works correctly

## Setting Up Admin Role

If you need to test admin functionality:

1. Sign up/sign in to create your account
2. Go to Supabase Dashboard → Authentication → Users
3. Copy your User ID
4. Go to Supabase SQL Editor
5. Run:
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```
6. Sign out and sign in again
7. Should redirect to `/admin`

## Common Issues

### Issue: Not redirecting after sign-in
- Check browser console for errors
- Verify Supabase connection is working
- Check that user_roles table exists

### Issue: Admin user not going to admin dashboard
- Verify admin role is in user_roles table
- Check SQL query: `SELECT * FROM user_roles WHERE user_id = 'YOUR_USER_ID';`
- Sign out and sign in again

### Issue: Navigation items not showing correctly
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors
