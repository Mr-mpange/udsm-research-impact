# Readership Tracking - Deployment Guide

## ✅ What We Just Built

### Phase 2 Implementation: Direct Readership Tracking

**New Features:**
1. ✅ Database tables for tracking views and downloads
2. ✅ Tracking service with geolocation
3. ✅ Paper view page with real-time statistics
4. ✅ Route configuration

---

## 🚀 Deployment Steps

### Step 1: Run Database Migration

```bash
# Push the new migration to Supabase
npx supabase db push

# Or if using Supabase CLI
supabase migration up
```

**This creates:**
- `paper_views` table
- `paper_downloads` table
- `readership_by_country` view
- Row Level Security policies

### Step 2: Install Dependencies

```bash
# Install UUID library for session tracking
npm install uuid
npm install --save-dev @types/uuid
```

### Step 3: Test Locally

```bash
# Start development server
npm run dev

# Navigate to a paper
# URL: http://localhost:8080/paper/{paper-id}
```

### Step 4: Deploy to Production

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Or deploy to Vercel/Netlify
# (automatic deployment on git push)
```

---

## 📊 How It Works

### 1. User Visits Paper Page

```
User clicks paper → /paper/abc-123 → PaperView component loads
```

### 2. Automatic Tracking

```typescript
// Automatically tracks:
- Country (via IP geolocation)
- City
- Referrer (where they came from)
- User agent (browser/device)
- Session ID (unique visitor)
- Timestamp
```

### 3. Real-Time Statistics

```
Paper View Page shows:
├─ Total Views: 234
├─ Unique Visitors: 156
├─ Downloads: 67
├─ Countries Reached: 23
└─ Top Countries:
   ├─ USA: 45 views
   ├─ UK: 32 views
   └─ Tanzania: 28 views
```

---

## 🔗 Integration with Existing System

### Update PublicationCard Component

Add "View Paper" button:

```typescript
// In src/components/publications/PublicationCard.tsx

import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

// Inside component:
const navigate = useNavigate();

// Add button:
{publication.pdf_url && (
  <Button
    variant="outline"
    size="sm"
    onClick={() => navigate(`/paper/${publication.id}`)}
    className="gap-2"
  >
    <Eye className="w-4 h-4" />
    View Paper
  </Button>
)}
```

### Update Dashboard to Show Readership

```typescript
// In src/pages/Dashboard.tsx

import { getGlobalReadership } from '@/services/trackingService';

// Fetch readership data:
const [readership, setReadership] = useState([]);

useEffect(() => {
  async function loadReadership() {
    const data = await getGlobalReadership();
    setReadership(data);
  }
  loadReadership();
}, []);

// Display in dashboard:
<div className="glass-panel p-6">
  <h3>Global Readership</h3>
  {readership.map(item => (
    <div key={item.country}>
      {item.country}: {item.total_views} views
    </div>
  ))}
</div>
```

---

## 🌍 Geolocation API

### Current: ipapi.co (Free Tier)

**Limits:**
- 1,000 requests/day
- No API key required
- Includes country, city, lat/lng

**Upgrade Options:**

#### Option 1: ipapi.co Paid ($10/month)
- 30,000 requests/month
- More reliable
- Better accuracy

#### Option 2: ipgeolocation.io ($15/month)
- 50,000 requests/month
- More features
- Better support

#### Option 3: MaxMind GeoIP2 ($0)
- Free database download
- Self-hosted
- No API limits
- Requires monthly updates

### Implementing MaxMind (Recommended for Scale)

```bash
# Install MaxMind library
npm install maxmind

# Download database (free)
# https://dev.maxmind.com/geoip/geolite2-free-geolocation-data
```

```typescript
// src/services/geoip.ts
import maxmind from 'maxmind';

let lookup: any;

export async function initGeoIP() {
  lookup = await maxmind.open('./GeoLite2-City.mmdb');
}

export function getCountryFromIP(ip: string) {
  const result = lookup.get(ip);
  return {
    country: result?.country?.names?.en || 'Unknown',
    city: result?.city?.names?.en || 'Unknown',
  };
}
```

---

## 📈 Analytics Dashboard

### Add to Admin Dashboard

```typescript
// src/pages/Admin.tsx

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

function ReadershipAnalytics() {
  const [stats, setStats] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    totalDownloads: 0,
    countriesReached: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    // Total views
    const { count: views } = await supabase
      .from('paper_views')
      .select('*', { count: 'exact', head: true });

    // Unique visitors
    const { data: sessions } = await supabase
      .from('paper_views')
      .select('session_id');
    const unique = new Set(sessions?.map(s => s.session_id)).size;

    // Downloads
    const { count: downloads } = await supabase
      .from('paper_downloads')
      .select('*', { count: 'exact', head: true });

    // Countries
    const { data: countries } = await supabase
      .from('paper_views')
      .select('country');
    const countriesCount = new Set(countries?.map(c => c.country)).size;

    setStats({
      totalViews: views || 0,
      uniqueVisitors: unique,
      totalDownloads: downloads || 0,
      countriesReached: countriesCount,
    });
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Total Views" value={stats.totalViews} />
      <StatCard title="Unique Visitors" value={stats.uniqueVisitors} />
      <StatCard title="Downloads" value={stats.totalDownloads} />
      <StatCard title="Countries" value={stats.countriesReached} />
    </div>
  );
}
```

---

## 🔒 Privacy & GDPR Compliance

### What We Track (Privacy-Friendly)

✅ **We DO track:**
- Country (not exact location)
- City (general area)
- Session ID (anonymous)
- Hashed IP (not actual IP)

❌ **We DON'T track:**
- Personal information
- Email addresses
- Names
- Exact GPS coordinates

### GDPR Compliance

Add privacy notice to paper view page:

```typescript
<div className="text-xs text-muted-foreground p-4 bg-muted/50 rounded-lg">
  <strong>Privacy Notice:</strong> We collect anonymous usage statistics 
  (country, city, session) to measure research impact. No personal 
  information is collected. See our{' '}
  <a href="/privacy" className="underline">Privacy Policy</a>.
</div>
```

### Cookie Consent (Optional)

```bash
npm install react-cookie-consent
```

```typescript
import CookieConsent from 'react-cookie-consent';

<CookieConsent>
  This website uses cookies to enhance user experience and track 
  anonymous usage statistics.
</CookieConsent>
```

---

## 📊 Testing the Implementation

### Test 1: View Tracking

```bash
# 1. Start dev server
npm run dev

# 2. Upload a paper with PDF
# 3. Navigate to /paper/{paper-id}
# 4. Check Supabase database:
SELECT * FROM paper_views ORDER BY timestamp DESC LIMIT 10;

# Expected: New row with your country/city
```

### Test 2: Download Tracking

```bash
# 1. Click "Download PDF" button
# 2. Check database:
SELECT * FROM paper_downloads ORDER BY timestamp DESC LIMIT 10;

# Expected: New download record
```

### Test 3: Statistics Display

```bash
# 1. Refresh paper page
# 2. Check sidebar shows:
   - Total Views: 1
   - Downloads: 1
   - Countries: 1
```

---

## 🚨 Troubleshooting

### Problem: "paper_views table does not exist"

**Solution:**
```bash
# Run migration
npx supabase db push

# Or manually create tables in Supabase SQL Editor
# Copy contents of: supabase/migrations/20260212120000_add_readership_tracking.sql
```

### Problem: "Cannot read property 'country' of undefined"

**Solution:**
Geolocation API might be rate-limited or blocked.

```typescript
// Add fallback in trackingService.ts
async function getVisitorCountry() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || 'Unknown',
        city: data.city || 'Unknown',
      };
    }
  } catch (error) {
    console.error('Geolocation error:', error);
  }
  
  // Fallback
  return { country: 'Unknown', city: 'Unknown' };
}
```

### Problem: "Route not found"

**Solution:**
Make sure you added the route to App.tsx:

```typescript
<Route path="/paper/:paperId" element={<PaperView />} />
```

---

## 📈 Next Steps

### Week 1: Deploy & Test
- ✅ Deploy to production
- ✅ Test with real papers
- ✅ Monitor for errors

### Week 2: Enhance UI
- Add readership charts
- Show trending papers
- Add geographic heatmap

### Week 3: Legal Compliance
- Add privacy policy
- Implement cookie consent
- Get copyright permissions

### Week 4: Scale
- Upgrade geolocation API
- Optimize database queries
- Add caching

---

## 💰 Cost Estimate

### Current Setup (Free Tier)
- Supabase: Free (up to 500MB database)
- ipapi.co: Free (1,000 requests/day)
- Hosting: Free (GitHub Pages/Vercel)

**Total: $0/month**

### Scaled Setup (1000+ papers, 10K+ views/month)
- Supabase Pro: $25/month
- ipapi.co Paid: $10/month
- CDN (Cloudflare): Free

**Total: $35/month**

---

## ✅ Success Criteria

After deployment, you should have:

1. ✅ Real-time view tracking for all papers
2. ✅ Geographic distribution data
3. ✅ Download statistics
4. ✅ Privacy-compliant implementation
5. ✅ Beautiful paper view pages
6. ✅ Admin analytics dashboard

**You now have TRUE readership tracking!** 🎉

---

## 📞 Support

If you encounter issues:
1. Check Supabase logs
2. Check browser console
3. Verify database migration ran
4. Test geolocation API manually

**The system is ready to deploy!**
