# Global Impact Visualization & Tracking Connection

## How Global Impact Shows Real Tracking Data

The 3D globe and global impact visualizations are **directly connected** to the tracking system. Here's exactly how:

---

## The Connection: Tracking → Database → Globe

### Step 1: Someone Views a Paper
```
Person in Germany views paper
            ↓
Tracking service detects:
├─ Country: "Germany"
├─ City: "Berlin"
├─ Latitude: 52.5200
└─ Longitude: 13.4050
            ↓
Saved to database:
paper_views table
```

### Step 2: Data Aggregated
```sql
-- Query runs to aggregate views by country
SELECT 
  country,
  COUNT(*) as total_views,
  COUNT(DISTINCT session_id) as unique_visitors,
  AVG(latitude) as lat,
  AVG(longitude) as lng
FROM paper_views
GROUP BY country;
```

**Result:**
```
Country        | Views | Visitors | Lat     | Lng
---------------|-------|----------|---------|--------
United States  | 145   | 98       | 37.0902 | -95.7129
United Kingdom | 98    | 67       | 51.5074 | -0.1278
Tanzania       | 67    | 45       | -6.3690 | 34.8888
Germany        | 34    | 23       | 52.5200 | 13.4050
Kenya          | 28    | 19       | -1.2921 | 36.8219
```

### Step 3: Displayed on Globe
```typescript
// Globe3D.tsx component
const countryMetrics = await fetchReadershipData();

// countryMetrics = [
//   { country: 'United States', reads: 145, lat: 37.09, lng: -95.71 },
//   { country: 'United Kingdom', reads: 98, lat: 51.50, lng: -0.12 },
//   ...
// ]

// Convert to 3D points on globe
const points = countryMetrics.map(country => ({
  position: latLngToVector3(country.lat, country.lng, 2.02),
  size: Math.log(country.reads) * 0.5, // Bigger = more views
  color: getColorByViews(country.reads),
  data: country
}));
```

---

## Real-Time Updates

### How It Works:

**1. New View Happens:**
```
Someone in Japan views paper
        ↓
paper_views table updated
        ↓
Japan view count: 5 → 6
```

**2. Dashboard Refreshes:**
```
User refreshes dashboard
        ↓
Query runs: SELECT * FROM readership_by_country
        ↓
New data fetched
        ↓
Globe updates: Japan point gets bigger
```

**3. Visual Change:**
```
Before:
🌍 Japan: Small dot (5 views)

After:
🌍 Japan: Slightly bigger dot (6 views)
```

---

## Globe Visualization Features

### 1. Point Size = View Count

```typescript
// Bigger points = more views
const pointSize = Math.log(viewCount + 1) * 0.5;

Examples:
├─ 1 view: Small dot (●)
├─ 10 views: Medium dot (●)
├─ 100 views: Large dot (●)
└─ 1000 views: Very large dot (●)
```

### 2. Point Color = Activity Level

```typescript
// Color intensity = recent activity
const color = viewCount > 100 ? 'bright blue' :
              viewCount > 50  ? 'medium blue' :
              viewCount > 10  ? 'light blue' :
                                'pale blue';

Examples:
├─ 1-10 views: Pale blue (low activity)
├─ 11-50 views: Light blue
├─ 51-100 views: Medium blue
└─ 100+ views: Bright blue (high activity)
```

### 3. Hover = Details

```typescript
// When user hovers over a point
<Tooltip>
  <strong>{country}</strong>
  <br />
  Views: {totalViews}
  <br />
  Unique Visitors: {uniqueVisitors}
  <br />
  Downloads: {downloads}
  <br />
  Latest: {lastViewTime}
</Tooltip>
```

**Example:**
```
🇺🇸 United States
Views: 145
Unique Visitors: 98
Downloads: 45
Latest: 2 minutes ago
```

### 4. Flight Paths = Connections

```typescript
// Show connections from UDSM to reading countries
const flightPaths = countries.map(country => ({
  start: { lat: -6.7924, lng: 39.2083 }, // UDSM, Tanzania
  end: { lat: country.lat, lng: country.lng },
  intensity: country.views / maxViews
}));
```

**Visual:**
```
        🇺🇸 USA (145 views)
       /
      /
UDSM ●────── 🇬🇧 UK (98 views)
      \
       \
        🇰🇪 Kenya (28 views)
```

---

## Dashboard Integration

### Homepage Globe (Public View)

**Data Source:** Aggregated from ALL papers

```typescript
// Fetch global statistics
const globalStats = await supabase
  .from('readership_by_country')
  .select('*')
  .order('total_views', { ascending: false });

// Display on globe
<Globe3D data={globalStats} />
```

**Shows:**
- Total views from all UDSM papers
- All countries that have viewed any paper
- Aggregate statistics

### Researcher Dashboard (Personal View)

**Data Source:** Only THEIR papers

```typescript
// Fetch researcher's statistics
const myStats = await supabase
  .from('paper_views')
  .select('country, COUNT(*)')
  .in('paper_id', myPaperIds)
  .group('country');

// Display on globe
<Globe3D data={myStats} />
```

**Shows:**
- Views only for their papers
- Countries that viewed their research
- Personal impact

### Admin Dashboard (Institutional View)

**Data Source:** ALL papers + filters

```typescript
// Fetch with filters
const stats = await supabase
  .from('readership_by_country')
  .select('*')
  .gte('timestamp', startDate)
  .lte('timestamp', endDate);

// Display on globe
<Globe3D data={stats} />
```

**Shows:**
- Institutional-wide statistics
- Time-filtered data
- Department breakdowns

---

## Real Example: Complete Flow

### Scenario: Paper Gets 100 Views from 10 Countries

**Day 1: Paper Uploaded**
```
Researcher uploads "Climate Change in Tanzania"
        ↓
Paper ID: abc-123
URL: /paper/abc-123
        ↓
Globe shows: No activity yet
```

**Day 2: First Views**
```
5 people in USA view paper
3 people in UK view paper
2 people in Tanzania view paper
        ↓
Database updated:
├─ USA: 5 views
├─ UK: 3 views
└─ Tanzania: 2 views
        ↓
Globe updates:
├─ 🇺🇸 USA: Small dot appears
├─ 🇬🇧 UK: Small dot appears
└─ 🇹🇿 Tanzania: Small dot appears
```

**Day 7: Growing Impact**
```
Total views: 50
Countries: 8
        ↓
Globe shows:
├─ 🇺🇸 USA: Medium dot (15 views)
├─ 🇬🇧 UK: Medium dot (12 views)
├─ 🇹🇿 Tanzania: Medium dot (10 views)
├─ 🇰🇪 Kenya: Small dot (5 views)
├─ 🇩🇪 Germany: Small dot (3 views)
├─ 🇫🇷 France: Small dot (2 views)
├─ 🇨🇦 Canada: Small dot (2 views)
└─ 🇦🇺 Australia: Small dot (1 view)
```

**Day 30: Viral Paper**
```
Total views: 234
Countries: 23
        ↓
Globe shows:
├─ 🇺🇸 USA: Large dot (45 views) - Bright blue
├─ 🇬🇧 UK: Large dot (32 views) - Bright blue
├─ 🇹🇿 Tanzania: Medium dot (28 views) - Medium blue
├─ ... 20 more countries with varying sizes
        ↓
Flight paths animate from UDSM to all countries
Pulses show recent activity
```

---

## Statistics Panel Connection

### Real-Time Stats Display

**On Paper Page:**
```
┌─────────────────────────────────┐
│  📊 Readership Statistics       │
├─────────────────────────────────┤
│  👁️ Total Views: 234           │  ← FROM: COUNT(*) FROM paper_views
│     156 unique visitors         │  ← FROM: COUNT(DISTINCT session_id)
├─────────────────────────────────┤
│  📥 Downloads: 67               │  ← FROM: COUNT(*) FROM paper_downloads
├─────────────────────────────────┤
│  🌍 Countries Reached: 23       │  ← FROM: COUNT(DISTINCT country)
├─────────────────────────────────┤
│  📈 Citations: 45               │  ← FROM: researcher_publications.citations
├─────────────────────────────────┤
│  Top Countries:                  │  ← FROM: GROUP BY country ORDER BY views
│  🇺🇸 USA: 45 views              │
│  🇬🇧 UK: 32 views               │
│  🇹🇿 Tanzania: 28 views         │
└─────────────────────────────────┘
```

**Every number comes from actual tracking data!**

---

## Analytics Charts Connection

### Citation Trends Chart

**Data Source:**
```sql
SELECT 
  snapshot_date,
  citations
FROM citation_snapshots
WHERE publication_id = 'abc-123'
ORDER BY snapshot_date;
```

**Chart Shows:**
```
Citations Over Time:
250│                                    ●
200│                              ●
150│                        ●
100│                  ●
 50│            ●
  0└────────────────────────────────────
    Jan   Mar   May   Jul   Sep   Nov
```

### Geographic Distribution Chart

**Data Source:**
```sql
SELECT 
  country,
  COUNT(*) as views
FROM paper_views
WHERE paper_id = 'abc-123'
GROUP BY country
ORDER BY views DESC
LIMIT 10;
```

**Chart Shows:**
```
Top 10 Countries:
USA         ████████████████████ 45
UK          ██████████████ 32
Tanzania    ████████████ 28
Kenya       ████████ 18
Germany     ██████ 15
...
```

### Monthly Readership Chart

**Data Source:**
```sql
SELECT 
  DATE_TRUNC('month', timestamp) as month,
  COUNT(*) as views
FROM paper_views
WHERE paper_id = 'abc-123'
GROUP BY month
ORDER BY month;
```

**Chart Shows:**
```
Monthly Views:
500│     ███
400│     ███ ███
300│ ███ ███ ███ ███
200│ ███ ███ ███ ███ ███
100│ ███ ███ ███ ███ ███ ███
  0└────────────────────────────
    Jan Feb Mar Apr May Jun
```

---

## Live Activity Feed

### Real-Time Updates

**Implementation:**
```typescript
// Poll for new views every 30 seconds
useEffect(() => {
  const interval = setInterval(async () => {
    const recentViews = await supabase
      .from('paper_views')
      .select('country, city, timestamp')
      .gte('timestamp', new Date(Date.now() - 60000)) // Last minute
      .order('timestamp', { ascending: false });
    
    setLiveActivity(recentViews);
  }, 30000);
  
  return () => clearInterval(interval);
}, []);
```

**Display:**
```
┌─────────────────────────────────────────┐
│  🔴 Live Activity                       │
├─────────────────────────────────────────┤
│  • Paper viewed in Germany (just now)   │
│  • Paper downloaded in USA (1 min ago)  │
│  • Paper viewed in Kenya (2 min ago)    │
│  • Paper viewed in UK (3 min ago)       │
└─────────────────────────────────────────┘
```

---

## Summary: The Complete Connection

### Tracking Flow:
```
1. Someone views paper
        ↓
2. Country/city detected
        ↓
3. Saved to database
        ↓
4. Aggregated by country
        ↓
5. Displayed on globe
        ↓
6. Shown in statistics
        ↓
7. Included in charts
        ↓
8. Exported in reports
```

### Data Flow:
```
paper_views table
        ↓
    ┌───┴───┐
    │       │
    ▼       ▼
  Globe   Stats
    │       │
    │       ▼
    │    Charts
    │       │
    └───┬───┘
        ▼
    Reports
```

### Everything is Connected:
- ✅ Globe shows WHERE people are reading
- ✅ Stats show HOW MANY are reading
- ✅ Charts show WHEN they're reading
- ✅ Reports show TRENDS over time
- ✅ All from SAME tracking data

**The global impact visualization is a DIRECT reflection of actual readership tracking!** 🌍

No fake data, no estimates - everything you see on the globe represents real people who actually viewed UDSM research papers.
