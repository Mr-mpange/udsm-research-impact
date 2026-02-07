# 👥 User Setup Guide

## 📊 Current Users

You have **2 users** in your database:

### 1. Admin User
- **Email:** `admin-udsm@gmail.com`
- **User ID:** `bddc08bb-ee0b-40eb-b224-e4d44dea8d52`
- **Status:** ✅ Email Verified
- **Created:** 2026-02-07 10:28:35
- **Role to Assign:** `admin`

### 2. Researcher User
- **Email:** `resercher-udsm@gmail.com` (note: typo in email)
- **User ID:** `707df9f9-b0a3-4263-ac0f-d1ba374ab8da`
- **Status:** ✅ Email Verified
- **Created:** 2026-02-07 10:29:09
- **Role to Assign:** `researcher`

---

## 🚀 Assign Roles

### Step 1: Run the SQL Script

1. Go to: https://supabase.com/dashboard/project/zuqothviduizwcbawigy/editor
2. Copy the SQL from `assign-user-roles.sql`
3. Paste and execute

### Step 2: What the Script Does

1. ✅ Shows current users
2. ✅ Checks existing roles
3. ✅ Deletes old roles (if any)
4. ✅ Assigns `admin` role to admin-udsm@gmail.com
5. ✅ Assigns `researcher` role to resercher-udsm@gmail.com
6. ✅ Creates profiles if they don't exist
7. ✅ Verifies everything is set up correctly

---

## 🔐 Login Credentials

### Admin Account
```
Email: admin-udsm@gmail.com
Password: [Your password]
Role: admin
```

**Admin can:**
- Access admin dashboard
- Manage users
- View analytics
- Manage publications
- Full system access

### Researcher Account
```
Email: resercher-udsm@gmail.com
Password: [Your password]
Role: researcher
```

**Researcher can:**
- Upload publications
- View their profile
- Track citations
- Collaborate with others
- Use AI chatbot

---

## 🧪 Test the Setup

### 1. Test Admin Login
```bash
# Open your app
http://localhost:8080

# Click "Sign In"
# Use: admin-udsm@gmail.com
# Should see "Admin Dashboard" option
```

### 2. Test Researcher Login
```bash
# Open your app
http://localhost:8080

# Click "Sign In"
# Use: resercher-udsm@gmail.com
# Should see researcher features
```

### 3. Verify Roles in Database
```sql
-- Run in Supabase SQL Editor
SELECT 
  au.email,
  ur.role,
  p.display_name
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.user_id
LEFT JOIN profiles p ON au.id = p.user_id;
```

Expected result:
```
admin-udsm@gmail.com    | admin      | Admin User
resercher-udsm@gmail.com | researcher | Researcher User
```

---

## 📝 User Roles Explained

### Available Roles:
1. **admin** - Full system access
2. **moderator** - Can moderate content
3. **researcher** - Standard researcher access
4. **user** - Basic access

### Role Hierarchy:
```
admin > moderator > researcher > user
```

---

## 🔧 Manage Users

### Add More Users

Users can sign up at: http://localhost:8080

Then assign roles:
```sql
-- Assign role to a user
INSERT INTO user_roles (user_id, role)
SELECT id, 'researcher'
FROM auth.users
WHERE email = 'newuser@example.com';
```

### Change User Role
```sql
UPDATE user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);
```

### Remove User Role
```sql
DELETE FROM user_roles
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);
```

---

## ✅ Quick Verification

Run this to see all users with roles:
```sql
SELECT 
  au.email,
  COALESCE(ur.role, 'No Role') as role,
  p.display_name,
  p.department,
  CASE 
    WHEN au.email_confirmed_at IS NOT NULL THEN '✅'
    ELSE '❌'
  END as verified
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.user_id
LEFT JOIN profiles p ON au.id = p.user_id
ORDER BY au.created_at;
```

---

## 🎯 Next Steps

1. ✅ Run `assign-user-roles.sql` to assign roles
2. ✅ Test login with both accounts
3. ✅ Verify admin can access admin dashboard
4. ✅ Verify researcher can upload publications
5. ✅ Add more users as needed

---

## 📞 Troubleshooting

### Issue: Can't see admin dashboard
**Solution:** Check if role is assigned:
```sql
SELECT role FROM user_roles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin-udsm@gmail.com');
```

### Issue: Profile not showing
**Solution:** Create profile manually:
```sql
INSERT INTO profiles (user_id, email, display_name)
SELECT id, email, 'Display Name'
FROM auth.users
WHERE email = 'your-email@example.com';
```

### Issue: Wrong role assigned
**Solution:** Update role:
```sql
UPDATE user_roles
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin-udsm@gmail.com');
```

---

**Run `assign-user-roles.sql` now to set up your users!** 🚀
