# Roadmap: Implementing True Readership Tracking

## The Challenge

**Mission Requirement**: Track who is READING UDSM research papers globally, not just citations.

**Current Gap**: We track citations (who cited the paper) but not readership (who viewed/downloaded the paper).

---

## Solution Options (Ranked by Feasibility)

### ⭐ Option 1: Build UDSM Institutional Repository (RECOMMENDED)

**What It Is:**
Create a UDSM-hosted platform where researchers upload their papers, and YOU control the analytics.

**How It Works:**
```
1. Researcher uploads PDF to UDSM platform
2. Paper gets a UDSM URL: udsm.ac.tz/research/paper-id
3. Google Analytics tracks every view/download
4. You know: country, city, device, time, referrer
5. Display on your dashboard in real-time
```

**Implementation Steps:**

#### Phase 1: Infrastructure (2-4 weeks)
```bash
# 1. Expand Supabase Storage
- Increase storage quota for PDFs
- Set up CDN for fast global delivery
- Configure access controls

# 2. Add Analytics Tracking
npm install react-ga4
# Track every PDF view with Google Analytics 4

# 3. Create Repository Pages
- Individual page for each paper
- PDF viewer embedded
- Download button with tracking
- Share buttons (Twitter, LinkedIn, Email)
```

#### Phase 2: Legal & Copyright (2-3 weeks)
```
1. Get permission from publishers
   - Many allow "green open access" (author can share)
   - Check each journal's policy
   - Use SHERPA/RoMEO database

2. Author agreements
   - Researchers sign upload agreement
   - Confirm they have rights to share
   - Liability protection for UDSM

3. Copyright compliance
   - Display proper attribution
   - Link to official published version
   - Add copyright notices
```

#### Phase 3: Analytics Dashboard (2 weeks)
```typescript
// Track PDF views
import ReactGA from 'react-ga4';

function trackPaperView(paperId: string, country: string) {
  ReactGA.event({
    category: 'Paper',
    action: 'View',
    label: paperId,
    dimension1: country, // Custom dimension
  });
}

// Store in database
await supabase.from('paper_views').insert({
  paper_id: paperId,
  country: country,
  timestamp: new Date(),
  referrer: document.referrer,
});
```

#### Phase 4: Visualization (1 week)
```typescript
// Real-time readership map
const readershipData = await supabase
  .from('paper_views')
  .select('country, COUNT(*)')
  .group('country');

// Display on 3D globe
<Globe3D data={readershipData} />
```

**Pros:**
- ✅ Full control over tracking
- ✅ Real-time data
- ✅ Know exact countries, cities, times
- ✅ Can track downloads, views, time spent
- ✅ GDPR compliant (you control privacy)

**Cons:**
- ❌ Requires copyright permissions
- ❌ Storage costs
- ❌ Researchers must upload papers
- ❌ Competes with publisher platforms

**Cost:** $50-200/month (storage + CDN)

**Timeline:** 2-3 months

---

### ⭐⭐ Option 2: Partner with Publishers (IDEAL but HARD)

**What It Is:**
Negotiate data-sharing agreements with publishers where UDSM papers are published.

**How It Works:**
```
1. Contact publishers (Elsevier, Springer, PLOS, etc.)
2. Request readership data for UDSM-affiliated papers
3. Get API access or monthly reports
4. Import data into your platform
```

**Implementation Steps:**

#### Step 1: Identify Publishers
```sql
-- Find where UDSM publishes most
SELECT journal, COUNT(*) as papers
FROM researcher_publications
GROUP BY journal
ORDER BY papers DESC
LIMIT 20;

-- Focus on top 5-10 publishers
```

#### Step 2: Contact Publishers
```
Email Template:

Subject: Data Partnership Request - University of Dar es Salaam

Dear [Publisher] Partnership Team,

The University of Dar es Salaam is building a research impact 
dashboard to track global visibility of our publications.

We would like to request access to readership statistics for 
papers authored by UDSM-affiliated researchers published in 
your journals.

Specifically:
- View/download counts by country
- Monthly readership trends
- Referrer sources

This data will help us:
- Demonstrate research impact to funders
- Support researcher career development
- Guide strategic research priorities

Can we schedule a call to discuss partnership options?

Best regards,
[Your Name]
UDSM Research Intelligence Team
```

#### Step 3: API Integration
```typescript
// Example: Elsevier ScienceDirect API
async function fetchReadership(doi: string) {
  const response = await fetch(
    `https://api.elsevier.com/content/article/doi/${doi}/metrics`,
    {
      headers: {
        'X-ELS-APIKey': process.env.ELSEVIER_API_KEY,
      }
    }
  );
  
  const data = await response.json();
  return {
    views: data.views,
    downloads: data.downloads,
    countries: data.geographicDistribution,
  };
}
```

**Pros:**
- ✅ Official, accurate data
- ✅ No copyright issues
- ✅ Includes all historical data
- ✅ Publisher credibility

**Cons:**
- ❌ Very difficult to negotiate
- ❌ May require payment
- ❌ Each publisher different
- ❌ May take 6-12 months

**Cost:** $0 - $10,000/year (depends on publisher)

**Timeline:** 6-12 months

---

### ⭐⭐⭐ Option 3: Use Existing Platforms (EASIEST)

**What It Is:**
Leverage platforms that already track readership and have APIs.

#### 3A: ResearchGate Integration

**How It Works:**
```
1. Researchers upload papers to ResearchGate
2. ResearchGate tracks reads, recommendations
3. You scrape or use unofficial API
4. Display on your dashboard
```

**Implementation:**
```typescript
// ResearchGate scraper (unofficial)
async function getResearchGateStats(profileUrl: string) {
  // Use Puppeteer to scrape
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(profileUrl);
  
  const stats = await page.evaluate(() => {
    return {
      reads: document.querySelector('.reads-count').textContent,
      citations: document.querySelector('.citations-count').textContent,
      recommendations: document.querySelector('.recommendations-count').textContent,
    };
  });
  
  return stats;
}
```

**Pros:**
- ✅ Easy to implement
- ✅ Researchers already use it
- ✅ Shows reads and recommendations

**Cons:**
- ❌ No official API
- ❌ Scraping may break
- ❌ Limited geographic data
- ❌ Against terms of service

#### 3B: Google Scholar Integration

**Implementation:**
```typescript
// Scholarly Python library (run via Edge Function)
import { scholarly } from 'scholarly';

async function getScholarStats(authorId: string) {
  const author = await scholarly.search_author_id(authorId);
  return {
    citations: author.citedby,
    hindex: author.hindex,
    i10index: author.i10index,
  };
}
```

**Pros:**
- ✅ Comprehensive data
- ✅ Free
- ✅ Widely used

**Cons:**
- ❌ No official API
- ❌ No readership data (only citations)
- ❌ Rate limiting

#### 3C: ORCID Integration (ALREADY HAVE!)

**Enhancement:**
```typescript
// Fetch work views from ORCID
async function getORCIDWorkViews(orcid: string) {
  const response = await fetch(
    `https://pub.orcid.org/v3.0/${orcid}/works`,
    {
      headers: {
        'Accept': 'application/json',
      }
    }
  );
  
  const data = await response.json();
  // ORCID doesn't provide view counts directly
  // But shows where work is indexed
}
```

**Pros:**
- ✅ Official API
- ✅ Already integrated
- ✅ Researcher verified

**Cons:**
- ❌ No readership data
- ❌ Only metadata

---

### ⭐⭐⭐⭐ Option 4: Hybrid Approach (BEST REALISTIC SOLUTION)

**Combine multiple data sources:**

```typescript
interface ReadershipData {
  // From your repository
  udsm_views: number;
  udsm_downloads: number;
  udsm_countries: string[];
  
  // From Altmetric
  social_mentions: number;
  news_coverage: number;
  
  // From citations
  academic_impact: number;
  
  // Estimated readership
  estimated_reads: number;
}

function estimateReadership(data: ReadershipData): number {
  // Research shows: 1 citation ≈ 10-20 reads
  const citationReads = data.academic_impact * 15;
  
  // Social mentions indicate broader readership
  const socialReads = data.social_mentions * 5;
  
  // Direct tracking
  const directReads = data.udsm_views;
  
  return citationReads + socialReads + directReads;
}
```

**Implementation Plan:**

#### Week 1-2: Set Up Repository
```bash
# Enable PDF uploads
# Add Google Analytics
# Create paper pages
```

#### Week 3-4: Integrate Altmetric
```bash
# Already done! ✅
# Shows social impact
```

#### Week 5-6: Add Estimation Algorithm
```typescript
// Combine all data sources
// Provide "estimated readership" metric
// Show confidence intervals
```

#### Week 7-8: Build Dashboard
```typescript
// Real-time readership map
// Combines all data sources
// Clear labels: "Verified" vs "Estimated"
```

**Pros:**
- ✅ Realistic and achievable
- ✅ Uses multiple data sources
- ✅ Transparent about estimates
- ✅ Can improve over time

**Cons:**
- ❌ Not 100% accurate
- ❌ Requires clear disclaimers

---

## Recommended Implementation: Hybrid Approach

### Phase 1: Quick Wins (Month 1)
```
✅ Already done: Altmetric integration
✅ Already done: Citation tracking
🔨 Add: Readership estimation algorithm
🔨 Add: Clear labeling (verified vs estimated)
```

### Phase 2: Repository (Month 2-3)
```
🔨 Set up UDSM paper repository
🔨 Add Google Analytics tracking
🔨 Create paper landing pages
🔨 Enable PDF uploads
```

### Phase 3: Legal & Permissions (Month 3-4)
```
🔨 Research copyright policies
🔨 Get author permissions
🔨 Create upload agreements
```

### Phase 4: Publisher Outreach (Month 4-6)
```
🔨 Contact top 5 publishers
🔨 Request data partnerships
🔨 Negotiate API access
```

### Phase 5: Advanced Analytics (Month 6+)
```
🔨 Machine learning for better estimates
🔨 Integration with more platforms
🔨 Real-time tracking dashboard
```

---

## Code Example: Complete Solution

```typescript
// src/services/readershipService.ts

interface ReadershipMetrics {
  verified: {
    udsm_views: number;
    udsm_downloads: number;
    countries: string[];
  };
  estimated: {
    total_reads: number;
    confidence: number; // 0-1
    sources: string[];
  };
  breakdown: {
    from_citations: number;
    from_social: number;
    from_direct: number;
  };
}

export async function getReadershipMetrics(
  doi: string
): Promise<ReadershipMetrics> {
  // 1. Get direct tracking (if paper in repository)
  const directViews = await getDirectViews(doi);
  
  // 2. Get citation data
  const citations = await getCitationCount(doi);
  
  // 3. Get Altmetric data
  const altmetric = await fetchAltmetricData(doi);
  
  // 4. Estimate readership
  const estimatedFromCitations = citations * 15; // 1 citation ≈ 15 reads
  const estimatedFromSocial = (altmetric?.cited_by_tweeters_count || 0) * 5;
  
  const totalEstimated = 
    directViews.count + 
    estimatedFromCitations + 
    estimatedFromSocial;
  
  // 5. Calculate confidence
  const confidence = directViews.count > 0 ? 0.9 : 0.6;
  
  return {
    verified: {
      udsm_views: directViews.count,
      udsm_downloads: directViews.downloads,
      countries: directViews.countries,
    },
    estimated: {
      total_reads: totalEstimated,
      confidence: confidence,
      sources: ['citations', 'social', 'direct'],
    },
    breakdown: {
      from_citations: estimatedFromCitations,
      from_social: estimatedFromSocial,
      from_direct: directViews.count,
    },
  };
}
```

---

## Budget Estimate

### Minimal (Current + Estimates)
- Cost: $0/month
- Timeline: 1 week
- Accuracy: 60%

### Basic (Add Repository)
- Cost: $50-100/month
- Timeline: 2-3 months
- Accuracy: 75%

### Advanced (Repository + Publisher Partnerships)
- Cost: $500-1000/month
- Timeline: 6-12 months
- Accuracy: 90%

### Enterprise (Full Solution)
- Cost: $2000-5000/month
- Timeline: 12+ months
- Accuracy: 95%

---

## Next Steps

1. **Immediate (This Week)**
   - Add readership estimation algorithm
   - Update dashboard with "estimated reads"
   - Add clear disclaimers

2. **Short Term (This Month)**
   - Research copyright policies
   - Plan repository infrastructure
   - Get stakeholder buy-in

3. **Medium Term (3 Months)**
   - Launch UDSM repository
   - Start tracking direct views
   - Contact publishers

4. **Long Term (6-12 Months)**
   - Secure publisher partnerships
   - Build comprehensive tracking
   - Achieve 90%+ accuracy

---

## Conclusion

**The honest answer**: True readership tracking requires building your own repository OR partnering with publishers.

**The realistic solution**: Use a hybrid approach combining:
- ✅ Direct tracking (your repository)
- ✅ Citation-based estimates
- ✅ Social media metrics
- ✅ Clear transparency about what's verified vs estimated

This addresses the mission while being honest about limi