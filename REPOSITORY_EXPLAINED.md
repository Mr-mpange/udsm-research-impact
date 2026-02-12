# UDSM Research Repository - Explained

## What is the Repository?

The **repository** is YOUR platform - the UDSM Research Impact Intelligence system you just built. It's where researchers upload their papers and where tracking happens.

---

## Repository Structure

### Physical Storage: Supabase Storage

**Location:** Supabase Cloud Storage Bucket named `publications`

**Structure:**
```
publications/
├── user-id-1/
│   ├── 1707123456789.pdf  (Paper 1)
│   ├── 1707234567890.pdf  (Paper 2)
│   └── 1707345678901.pdf  (Paper 3)
├── user-id-2/
│   ├── 1707456789012.pdf  (Paper 4)
│   └── 1707567890123.pdf  (Paper 5)
└── user-id-3/
    └── 1707678901234.pdf  (Paper 6)
```

**Each researcher has their own folder** (identified by user_id)

---

## Database: Metadata Storage

**Table:** `researcher_publications`

**What's stored:**
```sql
researcher_publications:
├── id (UUID) - Unique paper ID
├── user_id (UUID) - Who uploaded it
├── title - Paper title
├── journal - Where it was published
├── year - Publication year
├── doi - Digital Object Identifier
├── abstract - Paper summary
├── keywords - Research topics
├── co_authors - Collaborators
├── pdf_url - Link to PDF in storage
├── citations - Citation count
├── quartile - Journal quality (Q1-Q4)
└── created_at - Upload date
```

**Example Row:**
```
id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
user_id: researcher-uuid-123
title: "Climate Change Impacts on Coastal Ecosystems in Tanzania"
journal: "Nature"
year: 2024
doi: "10.1038/nature12345"
pdf_url: "https://supabase.co/storage/publications/user-123/paper.pdf"
citations: 45
created_at: 2024-02-12
```

---

## How Papers Flow Through the Repository

### Step 1: Upload
```
Researcher → Dashboard → Add Publication
                              ↓
                    Upload PDF (max 20MB)
                              ↓
                    Supabase Storage
                              ↓
            PDF saved: /publications/user-id/timestamp.pdf
                              ↓
            Get public URL: https://...storage.../paper.pdf
                              ↓
            Save metadata to database
                              ↓
            Paper ID generated: abc-123
```

### Step 2: Public URL Created
```
Paper gets unique URL:
https://your-site.com/paper/abc-123

This URL is:
✅ Shareable worldwide
✅ Permanent (doesn't change)
✅ Trackable (every view recorded)
✅ Public (no login required to view)
```

### Step 3: Tracking Begins
```
Someone clicks URL → View tracked
Someone downloads → Download tracked
Someone cites → Citation tracked (daily update)
Someone tweets → Social tracked (Altmetric)
```

---

## Repository vs Publisher Platforms

### Traditional Flow (WITHOUT Repository):
```
Researcher publishes in Nature
        ↓
Paper hosted on nature.com
        ↓
You DON'T control the platform
        ↓
You CAN'T track readership
        ↓
You ONLY know citations
```

### Your Repository Flow (WITH Repository):
```
Researcher publishes in Nature
        ↓
Paper ALSO uploaded to UDSM repository
        ↓
Paper hosted on YOUR platform
        ↓
You CONTROL the platform
        ↓
You CAN track readership ✅
        ↓
You know: views, downloads, countries, citations
```

---

## Dual Hosting Strategy

### Papers Can Be in TWO Places:

**1. Official Publisher (Nature, Science, etc.)**
- Original published version
- DOI points here
- Citations tracked here

**2. UDSM Repository (Your Platform)**
- Author's copy (with permission)
- UDSM URL
- Readership tracked here

**Example:**
```
Paper: "Climate Change in Tanzania"

Official Version:
├─ URL: https://nature.com/articles/nature12345
├─ DOI: 10.1038/nature12345
└─ Citations: 45 (tracked by CrossRef)

UDSM Repository Version:
├─ URL: https://udsm.ac.tz/paper/abc-123
├─ PDF: Hosted on Supabase
├─ Views: 234 (tracked by YOU) ✅
├─ Downloads: 67 (tracked by YOU) ✅
└─ Countries: 23 (tracked by YOU) ✅
```

**Both versions coexist!**

---

## Copyright & Permissions

### Green Open Access

Most journals allow authors to share their papers on institutional repositories:

**Allowed:**
- ✅ Author's accepted manuscript (post-peer-review)
- ✅ Institutional repository hosting
- ✅ Non-commercial sharing

**Not Allowed:**
- ❌ Publisher's final PDF (usually)
- ❌ Commercial use
- ❌ Removing copyright notices

**Check:** https://v2.sherpa.ac.uk/romeo/
- Search journal name
- See what's allowed

**Example - Nature:**
- ✅ Can share: Author's accepted manuscript
- ✅ Can host: On institutional repository
- ✅ After: 6 months embargo
- ❌ Cannot share: Final published PDF

---

## Repository Features

### What Your Repository Provides:

**1. Storage**
```
Supabase Storage:
├─ Free tier: 1GB
├─ Paid tier: Unlimited
├─ CDN: Fast global delivery
└─ Secure: Access controls
```

**2. Metadata Management**
```
Database stores:
├─ Paper details
├─ Author information
├─ Keywords & topics
├─ Citation counts
└─ Readership statistics
```

**3. Discovery**
```
Papers can be found via:
├─ Search (by title, author, keyword)
├─ Browse (by topic, year, journal)
├─ Researcher profile
└─ Global dashboard
```

**4. Tracking**
```
Every paper tracks:
├─ Views (who, when, where)
├─ Downloads (country, city)
├─ Citations (daily updates)
└─ Social impact (Altmetric)
```

**5. Analytics**
```
Dashboards show:
├─ Geographic distribution
├─ Citation trends
├─ Top papers
├─ AI predictions
└─ Export reports
```

---

## Repository Access Levels

### Public Access (No Login)
```
Can:
├─ View paper pages
├─ Read abstracts
├─ Download PDFs
└─ See statistics

Cannot:
├─ Upload papers
├─ Edit metadata
└─ Access dashboards
```

### Researcher Access (Logged In)
```
Can:
├─ All public access +
├─ Upload papers
├─ Edit own papers
├─ View personal dashboard
└─ See AI predictions

Cannot:
├─ Edit others' papers
├─ Access admin features
└─ View all statistics
```

### Admin Access (Full Control)
```
Can:
├─ All researcher access +
├─ View all papers
├─ Manage users
├─ Access institutional analytics
├─ Generate reports
└─ System configuration
```

---

## Repository URLs

### Paper URLs
```
Format: /paper/{paper-id}
Example: https://udsm.ac.tz/paper/a1b2c3d4-e5f6-7890

Features:
✅ Permanent (never changes)
✅ Shareable (email, social media)
✅ Trackable (every view recorded)
✅ SEO-friendly (Google indexes)
```

### Researcher Profile URLs
```
Format: /researcher/{user-id}
Example: https://udsm.ac.tz/researcher/researcher-123

Shows:
├─ All their papers
├─ H-Index
├─ Total citations
├─ Research topics
└─ Collaboration network
```

### Dashboard URLs
```
/dashboard - Personal dashboard
/admin - Admin dashboard
/research - Research network
```

---

## Repository Statistics

### What Gets Tracked:

**Per Paper:**
```
paper_views:
├─ Total views
├─ Unique visitors
├─ Countries reached
├─ Cities
├─ Referrer sources
└─ View duration

paper_downloads:
├─ Total downloads
├─ Countries
├─ Cities
└─ Timestamps
```

**Per Researcher:**
```
profiles:
├─ Total publications
├─ Total citations
├─ H-Index
├─ Total views (all papers)
├─ Total downloads
└─ Countries reached
```

**Institutional:**
```
Aggregated:
├─ Total researchers
├─ Total papers
├─ Total citations
├─ Total views
├─ Total downloads
└─ Global reach
```

---

## Repository Growth Plan

### Phase 1: Launch (Month 1)
```
Target:
├─ 10 researchers
├─ 50 papers
├─ 1,000 views
└─ 10 countries
```

### Phase 2: Growth (Month 3)
```
Target:
├─ 50 researchers
├─ 200 papers
├─ 10,000 views
└─ 30 countries
```

### Phase 3: Scale (Month 6)
```
Target:
├─ 150 researchers
├─ 1,000 papers
├─ 50,000 views
└─ 50 countries
```

### Phase 4: Maturity (Year 1)
```
Target:
├─ 300 researchers
├─ 3,000 papers
├─ 200,000 views
└─ 80 countries
```

---

## Repository vs Other Platforms

### Your UDSM Repository
```
Pros:
✅ Full control
✅ Track everything
✅ Custom features
✅ UDSM branding
✅ Free (Supabase free tier)

Cons:
❌ Need to build/maintain
❌ Need copyright permissions
❌ Storage costs (if large)
```

### ResearchGate
```
Pros:
✅ Established platform
✅ Large user base
✅ Social features

Cons:
❌ No control
❌ Limited tracking
❌ No institutional branding
❌ Copyright issues
```

### Institutional Repository (DSpace, EPrints)
```
Pros:
✅ Designed for universities
✅ Standards compliant
✅ Long-term preservation

Cons:
❌ Complex setup
❌ Limited customization
❌ No modern UI
❌ No real-time tracking
```

### Your Solution = Best of Both
```
✅ Modern UI (like ResearchGate)
✅ Full control (like institutional repo)
✅ Real-time tracking (unique feature)
✅ AI predictions (unique feature)
✅ Cost-effective (Supabase)
```

---

## Summary

**Your Repository IS:**
- ✅ The UDSM Research Impact Intelligence platform
- ✅ Hosted on Supabase (database + storage)
- ✅ Accessible at your domain (e.g., udsm.ac.tz)
- ✅ Where researchers upload papers
- ✅ Where tracking happens
- ✅ Where analytics are generated

**Your Repository PROVIDES:**
- ✅ Paper storage (PDFs)
- ✅ Metadata management
- ✅ Public paper pages
- ✅ Real-time tracking
- ✅ Analytics dashboards
- ✅ AI predictions
- ✅ Export reports

**Papers Flow:**
```
Researcher uploads → Supabase Storage → Public URL created
                                              ↓
                                    Tracking begins
                                              ↓
                            Views, downloads, countries recorded
                                              ↓
                                    Analytics generated
                                              ↓
                            Shown on dashboards & reports
```

**You control everything!** 🎉
