# 👥 System Roles - UDSM Research Intelligence Platform

## 🎯 Available Roles

Your system has **4 roles** defined in the database:

### 1. 👑 Admin
**Role:** `admin`

**Permissions:**
- ✅ Full system access
- ✅ Manage all users
- ✅ View admin dashboard
- ✅ Access analytics and reports
- ✅ Manage publications (all users)
- ✅ Configure system settings
- ✅ View audit logs
- ✅ Manage partner institutions
- ✅ Moderate content
- ✅ Export data

**Use Case:** System administrators, IT staff

**Example Users:**
- admin-udsm@gmail.com

---

### 2. 🛡️ Moderator
**Role:** `moderator`

**Permissions:**
- ✅ Moderate user content
- ✅ Review publications
- ✅ Manage research teams
- ✅ View analytics (limited)
- ✅ Approve/reject submissions
- ✅ Manage notifications
- ❌ Cannot manage users
- ❌ Cannot access system settings

**Use Case:** Department heads, research coordinators

**Example Users:**
- moderator@udsm.ac.tz

---

### 3. 🔬 Researcher
**Role:** `researcher`

**Permissions:**
- ✅ Upload publications
- ✅ Manage own profile
- ✅ Track citations
- ✅ View analytics (own data)
- ✅ Collaborate with others
- ✅ Join research teams
- ✅ Use AI chatbot
- ✅ Export own data
- ✅ Sync with ORCID
- ❌ Cannot moderate content
- ❌ Cannot manage other users

**Use Case:** Faculty members, PhD students, researchers

**Example Users:**
- resercher-udsm@gmail.com
- researcher@udsm.ac.tz

---

### 4. 👤 User
**Role:** `user`

**Permissions:**
- ✅ View public data
- ✅ Browse publications
- ✅ View researcher profiles
- ✅ Use AI chatbot (limited)
- ✅ View analytics (public)
- ❌ Cannot upload publications
- ❌ Cannot create profile
- ❌ Limited access

**Use Case:** Visitors, external collaborators, students

**Example Users:**
- visitor@example.com

---

## 📊 Role Hierarchy

```
┌─────────────────────────────────────┐
│           ADMIN (Full Access)        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      MODERATOR (Content Control)     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│    RESEARCHER (Own Data + Upload)    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│       USER (View Only - Public)      │
└─────────────────────────────────────┘
```

---

## 🔧 Assign Roles

### Assign Admin Role
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@udsm.ac.tz';
```

### Assign Moderator Role
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'moderator'
FROM auth.users
WHERE email = 'moderator@udsm.ac.tz';
```

### Assign Researcher Role
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'researcher'
FROM auth.users
WHERE email = 'researcher@udsm.ac.tz';
```

### Assign User Role
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'user'
FROM auth.users
WHERE email = 'user@example.com';
```

---

## 📋 Check User Roles

### View All Users with Roles
```sql
SELECT 
  au.email,
  COALESCE(ur.role, 'No Role') as role,
  p.display_name,
  p.department
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.user_id
LEFT JOIN profiles p ON au.id = p.user_id
ORDER BY 
  CASE ur.role
    WHEN 'admin' THEN 1
    WHEN 'moderator' THEN 2
    WHEN 'researcher' THEN 3
    WHEN 'user' THEN 4
    ELSE 5
  END;
```

### Count Users by Role
```sql
SELECT 
  role,
  COUNT(*) as count
FROM user_roles
GROUP BY role
ORDER BY 
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'moderator' THEN 2
    WHEN 'researcher' THEN 3
    WHEN 'user' THEN 4
  END;
```

---

## 🎯 Recommended Setup

### For UDSM:

1. **Admins (1-3 users)**
   - IT administrators
   - System managers

2. **Moderators (5-10 users)**
   - Department heads
   - Research coordinators
   - Faculty deans

3. **Researchers (100+ users)**
   - All faculty members
   - PhD students
   - Research staff
   - Postdocs

4. **Users (unlimited)**
   - Visitors
   - External collaborators
   - Undergraduate students
   - Public viewers

---

## 🔐 Default Role

When a new user signs up, they get **NO ROLE** by default.

You must manually assign a role:
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'researcher'
FROM auth.users
WHERE email = 'newuser@udsm.ac.tz';
```

Or set up a trigger to auto-assign 'user' role on signup.

---

## ✅ Current Users

Based on your database:

| Email | Role | Status |
|-------|------|--------|
| admin-udsm@gmail.com | admin | ✅ To be assigned |
| resercher-udsm@gmail.com | researcher | ✅ To be assigned |

Run `assign-user-roles.sql` to assign these roles!

---

## 📝 Role Definitions in Code

The roles are defined in:
- **Database:** `supabase/migrations/20260126102824_453e7294-908c-4da1-9d69-ce491f3f8f29.sql`
- **Type:** `CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'researcher')`

---

**Summary:** 4 roles - admin, moderator, researcher, user 🎯
