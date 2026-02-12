# Current Research Tracking Systems in Your Project

## ✅ What You Already Have

### 1. **Citation Tracking APIs** (IMPLEMENTED)
Your project already integrates with external APIs to track citations:

#### **CrossRef API**
- **Purpose**: Fetches citation counts using DOI
- **Location**: `src/services/citationService.ts`, `supabase/functions/citation-updater/index.ts`
- **Endpoint**: `https://api.crossref.org/works/{DOI}`
- **Data**: Citation counts, publication metadata
- **Status**: ✅ Fully implemented

#### **Semantic Scholar API**
- **Purpose**: Fetches citation counts by title or DOI
- **Location**: `src/services/citationService.ts`
- **Endpoint**: `https://api.semanticscholar.org/`
- **Data**: Citation counts, paper IDs, metadata
- **Status**: ✅ Fully implemented

### 2. **Database Tables** (IMPLEMENTED)
You have database tables to store research data:

#### **researcher_publications**
- Stores: DOI, title, citations, journal, year
- Tracks: `citation_source` (crossref/semanticscholar/manual)
- Updates: `last_citation_update` timestamp
- Has: `semantic_scholar_id` for faster lookups

#### **partner_institutions**
- Stores: Institution names, countries, collaboration data
- Can track: Geographic distribution of partners

### 3. **Citation Auto-Update System** (IMPLEMENTED)
- **Edge Function**: `supabase/functions/citation-updater/index.ts`
- **Features**:
  - Automatically fetches latest citations from CrossRef and Semantic Scholar
  - Updates database with new citation counts
  - Records citation source and timestamp
  - Can be triggered manually or scheduled

### 4. **Analytics Components** (IMPLEMENTED)
- `AnalyticsCharts.tsx` - Visualizes research metrics
- `PredictiveAnalytics.tsx` - Forecasts trends
- `AdminAnalytics.tsx` - System-wide insights
- `CitationImpactTracker.tsx` - Citation monitoring

### 5. **ORCID Integration** (IMPLEMENTED)
- Syncs researcher profiles with ORCID
- Can import publications and citations
- Location: `src/components/profile/OrcidSync.tsx`

---

## ❌ What You DON'T Have Yet

### 1. **Geographic Visitor Tracking**
You currently do NOT track:
- Which countries visit your website
- Real-time visitor analytics
- Page views by country
- User engagement by region

**Why**: No Google Analytics or similar tracking installed

### 2. **Real Country Metrics Data**
The `countryMetrics` array in `src/data/researchData.ts` is EMPTY:
```typescript
export const countryMetrics: CountryMetrics[] = [];
```

This means:
- The 3D globe shows no real data
- Country leaderboard is empty
- No geographic distribution of research impact

### 3. **Altmetric/PlumX Integration**
Not tracking:
- Social media mentions
- News coverage
- Policy citations
- Downloads from repositories

### 4. **Repository Analytics**
Not integrated with:
- ResearchGate
- Academia.edu
- Institutional repositories
- arXiv, bioRxiv, etc.

---

## 🎯 How to Track "Which Countries Use/See Your Research"

### Option 1: **Add Google Analytics** (Recommended)
**What it tracks:**
- Visitor countries in real-time
- Page views by country
- User engagement metrics
- Traffic sources

**Implementation:**
1. Create Google Analytics account
2. Get tracking ID (GA4)
3. Add tracking code to `index.html`
4. View geographic data in GA dashboard

### Option 2: **Use Citation APIs** (Already Working!)
**What it tracks:**
- Where your papers are being cited (by analyzing citing papers' author affiliations)
- Citation counts by country (requires parsing author data)

**Current Status:**
- ✅ CrossRef API - Can get citing papers
- ✅ Semantic Scholar API - Can get author affiliations
- ❌ Not parsing country data yet

### Option 3: **Populate Country Metrics from Database**
**What to do:**
1. Query `researcher_publications` table
2. Extract country data from:
   - Author affiliations
   - Partner institutions
   - Collaboration data
3. Populate `countryMetrics` array
4. Display on 3D globe

### Option 4: **Add Repository Analytics**
**Integrate with:**
- ResearchGate API (if available)
- Figshare API
- Zenodo API
- Institutional repository APIs

---

## 📊 Current Data Flow

```
1. Researcher uploads publication → Database
2. Citation updater runs → Fetches from CrossRef/Semantic Scholar
3. Database updated with citation counts
4. Dashboard displays analytics
```

**Missing:**
```
5. Geographic data extraction → NOT IMPLEMENTED
6. Visitor tracking → NOT IMPLEMENTED
7. Country metrics calculation → NOT IMPLEMENTED
```

---

## 🚀 Recommended Next Steps

### Immediate (Easy):
1. **Add Google Analytics** - Track website visitors by country
2. **Populate country metrics** - Extract from existing database data
3. **Parse citation sources** - Get countries from citing papers

### Short-term (Medium):
1. **Create geographic analytics dashboard**
2. **Add country-based filtering**
3. **Show "Top Countries" widget**

### Long-term (Advanced):
1. **Integrate Altmetric API**
2. **Add repository analytics**
3. **Create real-time geographic heatmap**

---

## 💡 Quick Win: Use What You Have

You can already track research impact by country using:

1. **Partner Institutions Table**
   - Query: `SELECT country, COUNT(*) FROM partner_institutions GROUP BY country`
   - Shows: Which countries you collaborate with

2. **Citation Source Analysis**
   - Parse CrossRef citing papers
   - Extract author affiliations
   - Map to countries

3. **ORCID Data**
   - ORCID profiles include country
   - Can track where researchers citing you are located

---

## 📝 Summary

**You HAVE:**
- ✅ Citation tracking (CrossRef, Semantic Scholar)
- ✅ Database with publication data
- ✅ Auto-update system
- ✅ Analytics dashboards
- ✅ ORCID integration

**You NEED:**
- ❌ Google Analytics (for visitor tracking)
- ❌ Country metrics population (from existing data)
- ❌ Geographic data extraction (from citations)
- ❌ Real-time visitor analytics

**Bottom Line:**
Your system tracks **citation impact** well, but doesn't track **website visitors** or **geographic distribution** of research usage yet.
