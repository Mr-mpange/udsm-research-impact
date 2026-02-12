# How Users See and Use the System

## 🎯 Complete User Journey

---

## For Researchers: How to Share Your Paper

### Step 1: Upload Your Paper
```
1. Login to your account
2. Go to Dashboard → Publications tab
3. Click "Add Publication" button
4. Fill in the form:
   - Title
   - Journal
   - Year
   - DOI (optional)
   - Upload PDF
5. Click "Save"
```

### Step 2: Get Your Paper's Public URL
```
After upload, your paper automatically gets a URL:

https://your-site.com/paper/abc-123-def-456

This URL is:
✅ Permanent (never changes)
✅ Public (anyone can view without login)
✅ Shareable (email, social media, etc.)
✅ Trackable (every view is recorded)
```

### Step 3: View Your Paper Page
```
In your Dashboard → Publications tab:

┌─────────────────────────────────────────────────┐
│  📄 Climate Change in Tanzania                  │
│     Nature • 2024 • Q1                          │
│     👁️ 234 views • 📥 67 downloads • 📈 45 cit │
│     🌍 23 countries                             │
│                                                 │
│     [👁️ View Paper & Statistics]  [Edit] [Del] │
└─────────────────────────────────────────────────┘

Click "View Paper & Statistics" button
```

### Step 4: Share the Link
```
Share your paper URL via:
├─ Email to colleagues
├─ Twitter/LinkedIn
├─ ResearchGate profile
├─ Conference presentations
├─ University website
└─ Academic networks
```

---

## For Readers: How to View Papers

### Step 1: Click the Link
```
Someone shares a link with you:
https://your-site.com/paper/abc-123

You click it → Paper page opens
```

### Step 2: Paper Page Loads
```
┌─────────────────────────────────────────────────────────────┐
│  [← Back]                                                   │
│                                                             │
│  Climate Change Impacts on Coastal Ecosystems in Tanzania  │
│  Nature • 2024 • Q1                                        │
│  Author: Dr. John Doe (UDSM)                               │
│                                                             │
│  Abstract:                                                  │
│  This study examines the effects of climate change on      │
│  coastal ecosystems in Tanzania...                         │
│                                                             │
│  Keywords: [climate] [Tanzania] [coastal] [ecosystems]     │
│                                                             │
│  [📥 Download PDF] [🔗 View on Publisher Site]            │
└─────────────────────────────────────────────────────────────┘
```

### Step 3: See Real-Time Statistics (Sidebar)
```
┌─────────────────────────────────┐
│  📊 Readership Statistics       │
├─────────────────────────────────┤
│  👁️ Total Views                 │
│     234                          │
│     156 unique visitors          │
├─────────────────────────────────┤
│  📥 Downloads                    │
│     67                           │
├─────────────────────────────────┤
│  🌍 Countries Reached            │
│     23                           │
├─────────────────────────────────┤
│  📈 Citations                    │
│     45                           │
├─────────────────────────────────┤
│  Top Countries:                  │
│  🇺🇸 USA: 45 views              │
│  🇬🇧 UK: 32 views               │
│  🇹🇿 Tanzania: 28 views         │
│  🇰🇪 Kenya: 18 views            │
│  🇩🇪 Germany: 15 views          │
└─────────────────────────────────┘
```

### Step 4: Download PDF (Optional)
```
Click "Download PDF" button
        ↓
PDF opens in new tab
        ↓
Download is tracked
        ↓
Statistics update: Downloads: 67 → 68
```

---

## What Happens Behind the Scenes (Automatic)

### When Someone Views Your Paper:

```
1. Visitor clicks your paper link
        ↓
2. System detects their location
   - Country: "United States"
   - City: "New York"
        ↓
3. Creates unique session ID
   - Tracks unique visitors
        ↓
4. Saves to database
   - paper_views table
        ↓
5. Statistics update in real-time
   - Total views: +1
   - Countries: +1 (if new country)
        ↓
6. Globe visualization updates
   - New point appears on map
        ↓
7. You see it in your dashboard
   - "Paper viewed in USA (2 min ago)"
```

---

## Where Users See Papers

### 1. Dashboard → Publications Tab
```
Your own papers with "View Paper & Statistics" button
```

### 2. Dashboard → Search Tab
```
Search all papers → Click "View Paper" button
```

### 3. Homepage (Public)
```
Featured papers → Click to view
```

### 4. Direct Link
```
https://your-site.com/paper/{paper-id}
Anyone can access without login
```

### 5. Admin Dashboard
```
All institutional papers with statistics
```

---

## Real Example: Complete Flow

### Day 1: Upload
```
Dr. Jane uploads paper:
"Marine Biodiversity in the Indian Ocean"

System creates:
├─ Paper ID: a1b2c3d4-e5f6-7890
├─ Public URL: /paper/a1b2c3d4-e5f6-7890
├─ PDF stored in Supabase
└─ Metadata in database

Dr. Jane shares link on Twitter
```

### Day 2: First Views
```
5 people click the link:
├─ 2 from USA
├─ 2 from UK
└─ 1 from Tanzania

Paper page shows:
├─ Total Views: 5
├─ Unique Visitors: 5
├─ Countries: 3
└─ Downloads: 0

Globe shows:
├─ 🇺🇸 USA: Small dot
├─ 🇬🇧 UK: Small dot
└─ 🇹🇿 Tanzania: Small dot
```

### Day 7: Growing
```
Total views: 50
Countries: 8

Dr. Jane's dashboard shows:
├─ "Paper viewed in Germany (just now)"
├─ "Paper downloaded in Kenya (5 min ago)"
└─ "Paper viewed in Canada (10 min ago)"

Paper page shows:
├─ Total Views: 50
├─ Unique Visitors: 35
├─ Downloads: 12
└─ Countries: 8
```

### Day 30: Viral
```
Total views: 234
Countries: 23
Downloads: 67

Paper page shows:
├─ Top Countries:
│  🇺🇸 USA: 45 views
│  🇬🇧 UK: 32 views
│  🇹🇿 Tanzania: 28 views
│  🇰🇪 Kenya: 18 views
│  🇩🇪 Germany: 15 views

Globe shows:
├─ Large dots on all continents
├─ Flight paths from Tanzania
└─ Real-time activity feed
```

---

## Mobile Experience

### On Phone/Tablet:
```
Paper page is fully responsive:

┌─────────────────────┐
│  [← Back]           │
│                     │
│  Paper Title        │
│  Nature • 2024      │
│                     │
│  Abstract...        │
│                     │
│  [Download PDF]     │
│                     │
│  📊 Statistics      │
│  Views: 234         │
│  Downloads: 67      │
│  Countries: 23      │
│                     │
│  Top Countries:     │
│  🇺🇸 USA: 45       │
│  🇬🇧 UK: 32        │
└─────────────────────┘
```

---

## Privacy & Tracking

### What We Track:
```
✅ Country (e.g., "United States")
✅ City (e.g., "New York")
✅ Session ID (anonymous)
✅ Timestamp
✅ Referrer (where they came from)
```

### What We DON'T Track:
```
❌ Names
❌ Email addresses
❌ Exact GPS location
❌ Personal information
❌ Browsing history
```

### Privacy Notice on Paper Page:
```
"We collect anonymous usage statistics (country, city, 
session) to measure research impact. No personal 
information is collected."
```

---

## For Admins: Institutional View

### Admin Dashboard Shows:
```
┌──────────────────────────────────────────────────┐
│  🏛️ UDSM Research Intelligence                  │
├──────────────────────────────────────────────────┤
│  Total Researchers: 156                          │
│  Total Publications: 1,234                       │
│  Total Views: 45,678                             │
│  Total Downloads: 15,234                         │
│  Countries Reached: 89                           │
├──────────────────────────────────────────────────┤
│  🌍 Global Impact Map                            │
│  [Interactive 3D Globe]                          │
├──────────────────────────────────────────────────┤
│  📊 Top Performing Papers                        │
│  1. Climate Change... - 2,345 views              │
│  2. Marine Biology... - 1,890 views              │
│  3. Data Science... - 1,567 views                │
├──────────────────────────────────────────────────┤
│  🔴 Live Activity                                │
│  • Paper viewed in Germany (just now)            │
│  • Paper downloaded in USA (1 min ago)           │
│  • Paper viewed in Kenya (2 min ago)             │
└──────────────────────────────────────────────────┘
```

---

## Key Features Users Will See

### 1. Beautiful Paper Pages
- Clean, professional design
- Easy to read on any device
- Fast loading
- Real-time statistics

### 2. Automatic Tracking
- No manual work required
- Updates in real-time
- Privacy-compliant
- Accurate data

### 3. Global Visualization
- 3D globe showing worldwide reach
- Country-level statistics
- Activity feed
- Flight path animations

### 4. Researcher Dashboard
- Personal statistics
- Publication management
- AI predictions
- Export reports

### 5. Public Access
- No login required to view papers
- Share links anywhere
- SEO-friendly URLs
- Fast page loads

---

## Summary: How It All Works

### For Researchers:
```
1. Upload paper → Get public URL
2. Share URL → People view it
3. Check dashboard → See statistics
4. Export reports → Share with stakeholders
```

### For Readers:
```
1. Click link → Paper page opens
2. Read abstract → Download PDF
3. See statistics → Understand impact
```

### For Admins:
```
1. View dashboard → See all papers
2. Check globe → See global reach
3. Generate reports → Share with university
4. Monitor activity → Track growth
```

### Automatic (No User Action):
```
1. Someone views paper → Location detected
2. Saved to database → Statistics update
3. Globe updates → Dashboard updates
4. Reports update → Everyone sees it
```

---

## Getting Started

### For New Researchers:
```
1. Create account (email + password)
2. Complete profile (name, institution)
3. Upload first paper
4. Share the link
5. Watch the statistics grow!
```

### For Existing Papers:
```
1. Upload your published papers
2. Add DOI (for citation tracking)
3. System fetches citations automatically
4. Share links to track readership
```

---

## Support & Help

### If You Need Help:
```
1. Check this guide
2. Contact admin
3. Check Supabase logs
4. Review documentation
```

### Common Questions:

**Q: How do I get my paper's URL?**
A: Dashboard → Publications → Click "View Paper & Statistics"

**Q: Can anyone view my paper?**
A: Yes, the URL is public. Anyone can view without login.

**Q: How accurate is the tracking?**
A: Very accurate. Every view is recorded in real-time.

**Q: Can I see who viewed my paper?**
A: You see country/city, but not personal information (privacy).

**Q: How often do citations update?**
A: Automatically every 24 hours from CrossRef/Semantic Scholar.

**Q: Can I delete a paper?**
A: Yes, from Dashboard → Publications → Delete button.

---

## The Complete Picture

```
RESEARCHER                    SYSTEM                      READER
    │                           │                           │
    │ 1. Upload paper            │                           │
    ├──────────────────────────>│                           │
    │                           │                           │
    │ 2. Get public URL          │                           │
    │<──────────────────────────┤                           │
    │                           │                           │
    │ 3. Share link              │                           │
    │────────────────────────────┼──────────────────────────>│
    │                           │                           │
    │                           │ 4. Track view             │
    │                           │<──────────────────────────┤
    │                           │                           │
    │                           │ 5. Update stats           │
    │                           │                           │
    │ 6. View dashboard          │                           │
    │<──────────────────────────┤                           │
    │                           │                           │
    │ 7. See statistics          │                           │
    │   "Viewed in USA"          │                           │
    │                           │                           │
```

**Everything is connected. Everything is automatic. Everything is real-time.** 🚀

