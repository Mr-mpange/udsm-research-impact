# 📋 Dashboard Routes Comparison

## 🔗 Routes:

### 1. Researcher Dashboard
- **Route:** `/dashboard`
- **File:** `src/pages/Dashboard.tsx`
- **Access:** All authenticated users (researcher, moderator, admin)

### 2. Moderator Dashboard
- **Route:** `/moderator`
- **File:** `src/pages/Moderator.tsx`
- **Access:** Only moderators and admins

### 3. Admin Dashboard
- **Route:** `/admin`
- **File:** `src/pages/Admin.tsx`
- **Access:** Only admins

---

## 📊 What Each Dashboard Shows:

### Researcher Dashboard (`/dashboard`)

**Header:**
- Title: "Research Dashboard" (user's name)
- Icon: User profile icon

**Tabs:**
1. **Overview** - Personal research overview
2. **Analytics** - Personal analytics charts
3. **Collaboration** - Personal collaboration map
4. **AI Predictions** - Personal predictions
5. **Publications** - Upload and manage publications
6. **Search** - Search publications
7. **Teams** - Join research teams
8. **Citations** - Track citations
9. **Collaborations** - Collaboration network
10. **ORCID** - Sync with ORCID

**Features:**
- Personal profile
- Upload publications
- Track own citations
- Join teams
- View own analytics
- ORCID sync

---

### Moderator Dashboard (`/moderator`)

**Header:**
- Title: "Moderator Dashboard"
- Icon: Shield icon (secondary color)
- Extra button: "Admin Dashboard" (if user is also admin)

**Stats Cards:**
1. Total Publications (all users)
2. Active Researchers (all users)
3. Research Teams (all teams)
4. Avg. Citations (all publications)

**Tabs:**
1. **Overview** - System overview
   - Quick Actions (Review, Manage Teams, Reports)
   - Recent Activity
   - System status

2. **Publications** - Publication management
   - Review system (placeholder)
   - All publications count

3. **Collaboration** - Collaboration network
   - University-wide network visualization
   - All partnerships

4. **Analytics** - System analytics
   - University-wide charts
   - Research metrics

**Features:**
- View all publications
- Monitor all researchers
- Manage teams
- View system analytics
- Collaboration oversight
- Content moderation (coming soon)

---

### Admin Dashboard (`/admin`)

**Header:**
- Title: "Admin Dashboard"
- Icon: Shield icon (primary color)

**Stats Cards:**
1. Active Researchers
2. Total Publications
3. Avg. H-Index
4. Total Citations

**Tabs:**
1. **Analytics** - Full system analytics
2. **Collaboration** - University-wide network
3. **AI Predictions** - Predictive analytics
4. **User Management** - Manage users, assign roles
5. **Reports** - Generate reports

**Features:**
- Full user management
- Assign/remove roles
- Delete users
- View audit logs
- System reports
- All analytics
- Full system access

---

## 🎯 Key Differences:

### Researcher vs Moderator:

| Feature | Researcher (`/dashboard`) | Moderator (`/moderator`) |
|---------|---------------------------|--------------------------|
| **Focus** | Personal data | System-wide data |
| **Publications** | Own publications | All publications |
| **Analytics** | Own metrics | All metrics |
| **Teams** | Join teams | Manage teams |
| **Users** | View own profile | View all researchers |
| **Upload** | Can upload | Can review |
| **Moderation** | No | Yes (coming soon) |
| **Stats** | Personal stats | System stats |

### Visual Differences:

**Researcher Dashboard:**
```
┌─────────────────────────────────────┐
│  👤 John Doe's Research Dashboard   │
├─────────────────────────────────────┤
│ Personal Stats:                     │
│ • My H-Index: 12                    │
│ • My Citations: 234                 │
│ • My Publications: 15               │
├─────────────────────────────────────┤
│ Tabs: Overview | Analytics | ...    │
│ (Personal data only)                │
└─────────────────────────────────────┘
```

**Moderator Dashboard:**
```
┌─────────────────────────────────────┐
│  🛡️ Moderator Dashboard             │
├─────────────────────────────────────┤
│ System Stats:                       │
│ • Total Publications: 150           │
│ • Active Researchers: 45            │
│ • Research Teams: 12                │
│ • Avg. Citations: 18                │
├─────────────────────────────────────┤
│ Tabs: Overview | Publications | ... │
│ (System-wide data)                  │
└─────────────────────────────────────┘
```

---

## 🧪 How to Test the Difference:

### Step 1: Login as Researcher
```
Email: resercher-udsm@gmail.com
Role: researcher (only)
```

**Navigate to:** `http://localhost:8080/dashboard`

**You'll see:**
- Personal profile
- Own publications
- Own analytics
- "My Dashboard" in header

### Step 2: Assign Moderator Role
```sql
-- Run this SQL
INSERT INTO user_roles (user_id, role)
SELECT id, 'moderator'
FROM auth.users
WHERE email = 'resercher-udsm@gmail.com';
```

### Step 3: Login Again as Moderator
```
Email: resercher-udsm@gmail.com
Role: researcher + moderator
```

**Navigate to:** `http://localhost:8080/moderator`

**You'll see:**
- System-wide stats
- All publications
- All researchers
- "Moderator Dashboard" in header

### Step 4: Compare Side by Side

**Open two browser windows:**

Window 1: `http://localhost:8080/dashboard`
- Personal researcher view
- Own data only

Window 2: `http://localhost:8080/moderator`
- System moderator view
- All data

---

## 📝 Navigation Links:

### Researcher sees:
```
Header:
- Global Impact
- Research Network
- My Dashboard → /dashboard
- [Avatar Menu]
  - My Dashboard → /dashboard
  - My Publications
  - Settings
  - Sign Out
```

### Moderator sees:
```
Header:
- Global Impact
- Research Network
- Moderator → /moderator
- [Avatar Menu]
  - Moderator Dashboard → /moderator
  - My Profile → /dashboard
  - My Publications
  - Settings
  - Sign Out
```

### Admin sees:
```
Header:
- Global Impact
- Research Network
- Admin → /admin
- [Avatar Menu]
  - Admin Dashboard → /admin
  - My Profile → /dashboard
  - My Publications
  - Settings
  - Sign Out
```

---

## ✅ Summary:

**Routes are DIFFERENT:**
- `/dashboard` = Researcher (personal data)
- `/moderator` = Moderator (system data)
- `/admin` = Admin (full control)

**Content is DIFFERENT:**
- Researcher: Personal profile, own publications
- Moderator: System overview, all publications
- Admin: User management, full system

**Navigation is DIFFERENT:**
- Researcher: "My Dashboard" button
- Moderator: "Moderator" button
- Admin: "Admin" button

**The dashboards are completely different pages with different content!** ✅
