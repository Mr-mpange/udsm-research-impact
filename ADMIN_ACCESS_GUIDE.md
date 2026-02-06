# Admin Dashboard Access Guide

## Issues Fixed

### Sign-in Redirect Issue ✅
**Problem**: After signing in, users stayed on the home page instead of being redirected to their dashboard.

**Solution**: Updated `AuthModal.tsx` to automatically redirect users based on their role:
- **Admin users** → Redirected to `/admin` (Admin Dashboard)
- **Regular users** → Redirected to `/dashboard` (Personal Dashboard)

## Admin Dashboard

### Does it exist?
**Yes!** The admin dashboard exists at `/admin` route.

### Automatic Redirect for Admins
When you sign in with an admin account, you'll be **automatically redirected to the admin dashboard** - no need to click any buttons!

### How to Get Admin Access

The admin dashboard requires special permissions. You need to add the 'admin' role to your user in the `user_roles` table:

```sql
-- First, sign up/sign in to create your user account
-- Then run this SQL in your Supabase SQL Editor:

INSERT INTO user_roles (user_id, role)
VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with your actual user ID from auth.users
  'admin'
);
```

To find your user ID:
1. Sign in to your application
2. Go to Supabase Dashboard → Authentication → Users
3. Copy your User ID
4. Run the SQL above with your ID

### Admin Dashboard Features

Once you have admin access and sign in, you'll be **automatically taken to the admin dashboard** where you can:

- **Analytics Tab**: View university-wide research metrics and trends
- **User Management Tab**: Manage researchers, assign roles, view user activity
- **Reports Tab**: Generate and export institutional reports

### Quick Access Links

Even if you're on another page, admin users will see:
- **"Admin Panel" button** in the personal dashboard header
- **"Admin" button** in the main site header
- Direct navigation to `/admin` anytime

### Navigation Routes

- **Home**: `/` - Public landing page with global research visualization
- **Dashboard**: `/dashboard` - Personal researcher dashboard (requires login)
- **Admin**: `/admin` - Admin dashboard (requires login + admin role)
- **Research Network**: `/research` - Collaboration network visualization

### User Roles

The system supports multiple roles:
- `admin` - Full access to admin dashboard and user management
- `moderator` - Can moderate content and assist with user issues
- `researcher` - Standard researcher account (default)
- `user` - Basic user account

Roles are managed in the `user_roles` table and checked via the `useUserRole` hook.
