# Quick Reference Guide

## Authentication & Navigation

### Sign In Flow (NOW FIXED ✅)
1. Click "Sign In" button on home page
2. Enter your credentials
3. **Automatically redirected based on your role:**
   - **Admin users** → `/admin` (Admin Dashboard)
   - **Regular users** → `/dashboard` (Personal Dashboard)

### Available Routes

- `/` - Home page (public)
- `/dashboard` - Personal researcher dashboard (requires login)
- `/admin` - Admin dashboard (requires login + admin role) **← Auto-redirect for admins!**
- `/research` - Research collaboration network (public)

## Getting Admin Access

1. Create an account and sign in
2. Get your User ID from Supabase Dashboard → Authentication → Users
3. Run this SQL in Supabase SQL Editor:
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('YOUR_USER_ID', 'admin');
   ```
4. Sign out and sign in again - **you'll be automatically taken to the admin dashboard!**

## Admin Features

### Automatic Redirect
- Admin users are automatically redirected to `/admin` on sign-in
- No need to click any buttons or navigate manually

### Quick Access
Admin users can access the admin panel from anywhere:
- "Admin Panel" button in personal dashboard
- "Admin" button in main site header
- Direct URL: `/admin`

## User Roles

- **Admin**: Full access to admin dashboard
- **Moderator**: Content moderation
- **Researcher**: Standard account (default)
- **User**: Basic access
