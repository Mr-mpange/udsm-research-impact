# Complete System Workflow - End to End

## Overview: How Everything Works Together

This document explains the complete journey from paper upload to global readership tracking and analysis for all user roles.

---

## User Roles in the System

### 1. Public Visitor (No Login)
- Can view homepage with demo data
- Can view public paper pages
- Views are tracked anonymously

### 2. Researcher (Logged In)
- Upload publications
- View personal dashboard
- Track own paper statistics
- See AI predictions

### 3. Moderator (Special Access)
- All researcher permissions
- Can moderate content
- View department statistics

### 4. Admin (Full Access)
- All moderator permissions
- Manage users
- View institutional analytics
- Access all data

---

## Complete Workflow: From Upload to Global Tracking

### PHASE 1: Paper Upload (Researcher Role)

#### Step 1: Researcher Logs In
```
1. Visit: https://your-site.com
2. Click "Login" button
3. Enter credentials (Supabase Auth)
4. Redirected to Dashboard
```

#### Step 2: Upload Publication
```
Dashboard → Publications Tab → "Add Publication" button

Form Fields:
├─ Title (required)
├─ Journal (required)
├─ Year
├─ DOI (optional but recommended)
├─ Abstract
├─ Keywords (comma-separated)
├─ Co-authors (comma-separated)
├─ Quartile (Q1-Q4)
└─ PDF File (upload)
```

**What Happens Behind the Scenes:**
```typescript
// 1. PDF uploaded to Supabase Storage
const fileName = `${user.id}/${Date.now()}.pdf`;
await supabase.storage.from('publications').upload(fileName, pdfFile);

// 2. Get public URL
const pdfUrl = supabase.storage.from('publications').getPublicUrl(fileName);

// 3. Save to database
await supabase.from('researcher_publications').insert({
  user_id: user.id,
  title: "Paper Title",
  journal: "Nature",
  year: 2024,
  doi: "10.1038/nature12345",
  pdf_url: pdfUrl,
  citations: 0,
  created_at: NOW()
});

// 4. If DOI provided, fetch Altmetric data
if (doi) {
  const altmetric = await fetchAltmetricData(doi);
  // Store social impact metrics
}
```

**Database Tables Updated:**
- `researcher_publications` - New row added
- `profiles` - total_publications count increased

---

### PHASE 2: Automatic Citation Tracking

#### Daily Background Job (Supabase Edge Function)

**File:** `supabase/functions/citation-updater/index.ts`

```typescript
// Runs every 24 hours automatically
Deno.cron("Update citations", "0 0 * * *", async () => {
  // 1. Get all publications with DOIs
  const { data: publications } = await supabase
    .from('researcher_publications')
    .select('id, doi')
    .not('doi', 'is', null);

  // 2. For each publication
  for (const pub of publications) {
    // Fetch from CrossRef
    const crossrefCitations = await fetchCrossRefCitations(pub.doi);
    
    // Fetch from Semantic Scholar
    const scholarCitations = await fetchSemanticScholarCitations(pub.doi);
    
    // Use highest count
    const citations = Math.max(crossrefCitations, scholarCitations);
    
    // 3. Update database
    await supabase
      .from('researcher_publications')
      .update({ 
        citations: citations,
        last_citation_update: new Date()
      })
      .eq('id', pub.id);
    
    // 4. Save snapshot for trend analysis
    await supabase
      .from('citation_snapshots')
      .insert({
        publication_id: pub.id,
        citations: citations,
        snapshot_date: new Date()
      });
  }
  
  // 5. Update researcher profiles
  await updateResearcherMetrics();
});
```

**What Gets Updated:**
- Citation counts (daily)
- H-Index (recalculated)
- Total citations (sum of all papers)
- Citation snapshots (historical data)

---

### PHASE 3: Paper Goes Live (Public Access)

#### Step 1: Paper Page Created Automatically

**URL Generated:**
```
https://your-site.com/paper/{paper-id}
```

**Example:**
```
https://your-site.com/paper/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

#### Step 2: Researcher Shares Link

Researcher can share via:
- Email to colleagues
- Social media (Twitter, LinkedIn)
- Academic networks (ResearchGate)
- Conference presentations
- University website

---

### PHASE 4: Global Readership Tracking (Automatic)

#### Scenario: Someone in USA Reads the Paper

**Step 1: Visitor Clicks Link**
```
User in New York clicks:
https://your-site.com/paper/abc-123
```

**Step 2: Page Loads - Automatic Tracking Starts**

```typescript
// PaperView.tsx component loads
useEffect(() => {
  // 1. Track the view
  trackPaperView(paperId);
  
  // 2. Load paper details
  loadPaper();
  
  // 3. Load readership stats
  loadReadership();
}, [paperId]);
```

**Step 3: Geolocation Detection**

```typescript
// trackingService.ts
async function getVisitorCountry() {
  // Call IP geolocation API
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();
  
  return {
    country: data.country_name,  // "United States"
    city: data.city,             // "New York"
    latitude: data.latitude,     // 40.7128
    longitude: data.longitude    // -74.0060
  };
}
```

**Step 4: Session ID Created**

```typescript
// Generate unique session ID
function getSessionId() {
  let sessionId = sessionStorage.getItem('reader_session_id');
  if (!sessionId) {
    sessionId = uuidv4(); // "a1b2c3d4-e5f6-7890..."
    sessionStorage.setItem('reader_session_id', sessionId);
  }
  return sessionId;
}
```

**Step 5: View Recorded in Database**

```typescript
// Insert into paper_views table
await supabase.from('paper_views').insert({
  paper_id: 'abc-123',
  country: 'United States',
  city: 'New York',
  session_id: 'a1b2c3d4-e5f6-7890...',
  referrer: 'https://twitter.com/...',
  user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
  timestamp: '2024-02-12 14:30:00'
});
```

**Database State After View:**
```sql
-- paper_views table
id                  | paper_id | country        | city     | session_id | timestamp
--------------------|----------|----------------|----------|------------|-------------------
uuid-1              | abc-123  | United States  | New York | session-1  | 2024-02-12 14:30
```

---

### PHASE 5: Real-Time Statistics Display

#### What the Visitor Sees

**Paper Page Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Back Button]                                              │
│                                                             │
│  Paper Title: "Climate Change in Tanzania"                 │
│  Journal: Nature • 2024 • Q1                               │
│  Author: Dr. John Doe (UDSM)                               │
│                                                             │
│  Abstract: This study examines...                          │
│                                                             │
│  Keywords: [climate] [Tanzania] [coastal]                  │
│                                                             │
│  [Download PDF] [View on Publisher Site]                   │
└─────────────────────────────────────────────────────────────┘

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

#### Statistics Update in Real-Time

```typescript
// Every time someone views the page
const stats = await getPaperReadership(paperId);

// Returns:
{
  total_views: 234,
  unique_visitors: 156,
  total_downloads: 67,
  countries_reached: 23,
  by_country: [
    { country: 'United States', views: 45 },
    { country: 'United Kingdom', views: 32 },
    { country: 'Tanzania', views: 28 },
    ...
  ]
}
```

---

### PHASE 6: Download Tracking

#### Visitor Clicks "Download PDF"

**Step 1: Download Button Clicked**
```typescript
const handleDownload = async () => {
  // 1. Track the download
  await trackPaperDownload(paperId);
  
  // 2. Open PDF in new tab
  window.open(paper.pdf_url, '_blank');
  
  // 3. Reload statistics
  setTimeout(loadReadership, 1000);
};
```

**Step 2: Download Recorded**
```typescript
await supabase.from('paper_downloads').insert({
  paper_id: 'abc-123',
  country: 'United States',
  city: 'New York',
  timestamp: '2024-02-12 14:35:00'
});
```

**Step 3: Statistics Update**
```
Downloads: 67 → 68 ✅
```

---

### PHASE 7: Researcher Dashboard (Personal Analytics)

#### Researcher Views Their Dashboard

**URL:** `https://your-site.com/dashboard`

**Dashboard Tabs:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Overview] [Publications] [Analytics] [AI Predictions]     │
└─────────────────────────────────────────────────────────────┘
```

#### Overview Tab

```
┌──────────────────────────────────────────────────────────┐
│  Personal Metrics                                        │
├──────────────────────────────────────────────────────────┤
│  📚 Total Publications: 12                               │
│  📈 Total Citations: 234                                 │
│  🏆 H-Index: 8                                           │
│  🌍 Countries Reached: 45                                │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Recent Activity                                         │
├──────────────────────────────────────────────────────────┤
│  • Paper "Climate Change..." viewed in Germany (2 min ago)│
│  • Paper "Marine Biology..." downloaded in UK (15 min ago)│
│  • New citation from Nature journal (1 hour ago)         │
└──────────────────────────────────────────────────────────┘
```

#### Publications Tab

```
┌──────────────────────────────────────────────────────────┐
│  Your Publications                    [Add Publication]  │
├──────────────────────────────────────────────────────────┤
│  📄 Climate Change in Tanzania                           │
│     Nature • 2024 • Q1                                   │
│     👁️ 234 views • 📥 67 downloads • 📈 45 citations    │
│     🌍 23 countries                                      │
│     [View Paper] [Edit] [Delete]                         │
├──────────────────────────────────────────────────────────┤
│  📄 Marine Biodiversity Assessment                       │
│     Science • 2023 • Q1                                  │
│     👁️ 189 views • 📥 52 downloads • 📈 38 citations    │
│     🌍 18 countries                                      │
│     [View Paper] [Edit] [Delete]                         │
└──────────────────────────────────────────────────────────┘
```

#### Analytics Tab

**Geographic Distribution:**
```
┌──────────────────────────────────────────────────────────┐
│  🌍 Global Readership Map                                │
├──────────────────────────────────────────────────────────┤
│  [Interactive 3D Globe showing view locations]           │
│                                                          │
│  Top Countries:                                          │
│  🇺🇸 USA: 145 views (31%)                               │
│  🇬🇧 UK: 98 views (21%)                                 │
│  🇹🇿 Tanzania: 67 views (14%)                           │
│  🇰🇪 Kenya: 45 views (10%)                              │
│  🇩🇪 Germany: 34 views (7%)                             │
└──────────────────────────────────────────────────────────┘
```

**Citation Trends:**
```
┌──────────────────────────────────────────────────────────┐
│  📈 Citation Growth Over Time                            │
├──────────────────────────────────────────────────────────┤
│  [Line Chart]                                            │
│  250│                                              ●      │
│  200│                                        ●            │
│  150│                                  ●                  │
│  100│                            ●                        │
│   50│                      ●                              │
│    0└──────────────────────────────────────────────────  │
│      Jan   Mar   May   Jul   Sep   Nov   Jan            │
└──────────────────────────────────────────────────────────┘
```

**Readership Trends:**
```
┌──────────────────────────────────────────────────────────┐
│  👁️ Monthly Readership                                  │
├──────────────────────────────────────────────────────────┤
│  [Bar Chart]                                             │
│  500│     ███                                            │
│  400│     ███ ███                                        │
│  300│ ███ ███ ███ ███                                    │
│  200│ ███ ███ ███ ███ ███                                │
│  100│ ███ ███ ███ ███ ███ ███                            │
│    0└──────────────────────────────────────────────────  │
│      Jan Feb Mar Apr May Jun                            │
└──────────────────────────────────────────────────────────┘
```

#### AI Predictions Tab

```
┌──────────────────────────────────────────────────────────┐
│  🤖 Citation Forecast (Next 5 Years)                     │
├──────────────────────────────────────────────────────────┤
│  Current: 234 citations                                  │
│  2025: ~350 citations (+50%)                             │
│  2026: ~525 citations (+50%)                             │
│  2027: ~788 citations (+50%)                             │
│  2028: ~1,182 citations (+50%)                           │
│  2029: ~1,773 citations (+50%)                           │
│                                                          │
│  Confidence: 75% (based on 12 publications)              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  💡 Emerging Topics                                      │
├──────────────────────────────────────────────────────────┤
│  1. Climate Science: +150% growth                        │
│  2. Marine Biology: +80% growth                          │
│  3. Data Science: NEW TOPIC                              │
└──────────────────────────────────────────────────────────┘
```

---

### PHASE 8: Admin Dashboard (Institutional Analytics)

#### Admin Views System-Wide Statistics

**URL:** `https://your-site.com/admin`

**Admin Dashboard:**
```
┌──────────────────────────────────────────────────────────┐
│  🏛️ UDSM Research Intelligence - Admin Dashboard        │
├──────────────────────────────────────────────────────────┤
│  Institutional Metrics                                   │
│  ├─ Total Researchers: 156                               │
│  ├─ Total Publications: 1,234                            │
│  ├─ Total Citations: 12,456                              │
│  ├─ Total Views: 45,678                                  │
│  ├─ Total Downloads: 15,234                              │
│  └─ Countries Reached: 89                                │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  🌍 Global Impact Map                                    │
├──────────────────────────────────────────────────────────┤
│  [3D Globe showing all UDSM research views worldwide]    │
│                                                          │
│  Real-time Activity:                                     │
│  • Paper viewed in Germany (just now)                    │
│  • Paper downloaded in USA (1 min ago)                   │
│  • Paper viewed in Kenya (2 min ago)                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  📊 Top Performing Papers                                │
├──────────────────────────────────────────────────────────┤
│  1. "Climate Change..." - 2,345 views, 234 citations     │
│  2. "Marine Biology..." - 1,890 views, 189 citations     │
│  3. "Data Science..." - 1,567 views, 156 citations       │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  👥 Top Researchers                                      │
├──────────────────────────────────────────────────────────┤
│  1. Dr. John Doe - H-Index: 15, 45 papers                │
│  2. Dr. Jane Smith - H-Index: 12, 38 papers              │
│  3. Dr. Bob Johnson - H-Index: 10, 32 papers             │
└──────────────────────────────────────────────────────────┘
```

**Admin Analytics Queries:**

```sql
-- Total views by country
SELECT 
  country,
  COUNT(*) as total_views,
  COUNT(DISTINCT session_id) as unique_visitors
FROM paper_views
GROUP BY country
ORDER BY total_views DESC;

-- Most viewed papers
SELECT 
  p.title,
  COUNT(v.id) as views,
  COUNT(d.id) as downloads,
  p.citations
FROM researcher_publications p
LEFT JOIN paper_views v ON p.id = v.paper_id
LEFT JOIN paper_downloads d ON p.id = d.paper_id
GROUP BY p.id, p.title, p.citations
ORDER BY views DESC
LIMIT 10;

-- Daily activity
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_visitors,
  COUNT(DISTINCT country) as countries
FROM paper_views
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

---

### PHASE 9: Data Export & Reporting

#### Generate Reports for Stakeholders

**Admin → Export Data**

```typescript
// Export readership data
const exportData = async () => {
  const { data } = await supabase
    .from('paper_views')
    .select(`
      paper_id,
      researcher_publications(title, journal),
      country,
      city,
      timestamp
    `)
    .order('timestamp', { ascending: false });
  
  // Convert to CSV
  const csv = convertToCSV(data);
  
  // Download
  downloadFile(csv, 'udsm-readership-report.csv');
};
```

**Report Contents:**
```csv
Paper Title,Journal,Country,City,Views,Downloads,Citations,Date
"Climate Change in Tanzania",Nature,USA,New York,45,12,45,2024-02-12
"Climate Change in Tanzania",Nature,UK,London,32,8,45,2024-02-12
"Marine Biology Assessment",Science,Tanzania,Dar es Salaam,28,15,38,2024-02-12
...
```

---

## Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    RESEARCHER UPLOADS PAPER                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE DATABASE                               │
│  • researcher_publications (paper metadata)                  │
│  • Supabase Storage (PDF file)                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         AUTOMATIC BACKGROUND JOBS (Daily)                    │
│  • Fetch citations from CrossRef                             │
│  • Fetch citations from Semantic Scholar                     │
│  • Fetch Altmetric data (social impact)                      │
│  • Update H-Index                                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              PAPER PAGE GOES LIVE                            │
│  URL: /paper/{paper-id}                                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         GLOBAL VISITOR CLICKS LINK                           │
│  From: Email, Social Media, Conference, etc.                 │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         AUTOMATIC TRACKING (Real-time)                       │
│  1. Detect country/city (IP geolocation)                     │
│  2. Generate session ID (unique visitor)                     │
│  3. Record view in paper_views table                         │
│  4. Display statistics on page                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         VISITOR DOWNLOADS PDF                                │
│  • Track download in paper_downloads table                   │
│  • Update statistics                                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         ANALYTICS & DASHBOARDS                               │
│  • Researcher sees personal stats                            │
│  • Admin sees institutional stats                            │
│  • AI generates predictions                                  │
│  • Reports exported for stakeholders                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary: Complete System Flow

### For Researchers:
1. ✅ Upload paper with PDF
2. ✅ System tracks citations automatically
3. ✅ Paper gets public URL
4. ✅ Share link worldwide
5. ✅ View real-time readership statistics
6. ✅ See AI predictions
7. ✅ Export reports

### For Visitors:
1. ✅ Click paper link
2. ✅ View tracked automatically (country, city)
3. ✅ See paper details
4. ✅ Download PDF (tracked)
5. ✅ See real-time statistics

### For Admins:
1. ✅ View institutional dashboard
2. ✅ See global impact map
3. ✅ Analyze trends
4. ✅ Generate reports
5. ✅ Manage users
6. ✅ Monitor system health

### Automatic Background:
1. ✅ Daily citation updates
2. ✅ Altmetric data fetching
3. ✅ H-Index recalculation
4. ✅ AI prediction updates
5. ✅ Database optimization

**Everything works together seamlessly to provide complete research impact tracking!** 🚀
