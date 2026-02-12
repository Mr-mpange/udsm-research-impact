# Research Impact Tracking - Technical Documentation

## Mission Statement

**The Challenge**: "The research published by UDSM journals is read across the globe, but evidencing global visibility and impact remains to be a challenge."

**Our Solution**: Track and visualize UDSM's global academic footprint through verifiable, real-time data from multiple authoritative sources.

---

## What We Track

### 1. Citation Data (Primary Metric)
**Why Citations?**
- Gold standard for academic impact
- Every citation = confirmed engagement with research
- Verifiable and standardized across disciplines
- Available through public APIs

**Data Sources:**
- **CrossRef API**: 130M+ publications, real-time citation counts
- **Semantic Scholar API**: 200M+ papers, citation relationships

**Update Frequency:** Daily via Supabase Edge Functions

---

### 2. Alternative Metrics (Broader Impact)
**Altmetric Integration:**
- Social media mentions (Twitter, Facebook, Reddit)
- News outlet coverage
- Policy document citations
- Wikipedia references
- Blog mentions
- Mendeley readers

**Why Altmetric?**
- Captures non-academic impact
- Shows real-world influence
- Tracks public engagement
- Free API available

---

### 3. Collaboration Networks
**What We Track:**
- Co-authorship patterns
- International partnerships
- Cross-institutional research
- Geographic distribution of collaborators

**Data Source:** Publication metadata + ORCID profiles

---

### 4. Publication Metrics
**Tracked Metrics:**
- H-Index (researcher impact)
- Journal quartiles (Q1-Q4)
- Publication trends over time
- Research topic distribution

---

## Why Not Direct Readership?

### The Challenge

Direct readership tracking requires:
1. Access to publisher platforms (Nature, PLOS, Elsevier, etc.)
2. Analytics integration on journal websites
3. Visitor geolocation data
4. Download/view tracking systems

### Why We Can't Do This

**Publisher Control:**
- UDSM papers are published on external platforms
- We don't control those websites
- Publishers rarely share detailed readership data

**Privacy Laws:**
- GDPR restricts tracking
- Cookie consent required
- IP geolocation has legal implications

**Technical Barriers:**
- Each publisher has different systems
- No standardized readership API
- Data is proprietary

### Our Approach: Citations as Proxy

**Why Citations Work:**
1. **Verifiable**: Every citation is documented
2. **Standardized**: Same metric across all disciplines
3. **Meaningful**: Confirms research was read AND used
4. **Available**: Public APIs provide real-time data
5. **Reliable**: Can't be gamed or manipulated easily

**Research Shows:**
- High citation count correlates with high readership
- Citations indicate deeper engagement than views
- More valuable for measuring academic impact

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    UDSM Research Platform                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Database                          │
│  • researcher_publications (DOIs, titles, metadata)          │
│  • citation_snapshots (historical citation data)             │
│  • profiles (researcher info, H-Index)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase Edge Functions (Daily)                 │
│  • citation-updater: Fetches latest citation counts          │
│  • orcid-sync: Imports publications from ORCID               │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  CrossRef API    │  │ Semantic Scholar │
        │  (Citations)     │  │     (Citations)  │
        └──────────────────┘  └──────────────────┘
                    │
                    ▼
        ┌──────────────────┐
        │  Altmetric API   │
        │  (Social Impact) │
        └──────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Display                          │
│  • 3D Globe: Geographic visualization                        │
│  • Charts: Citation trends, H-Index growth                   │
│  • AI Predictions: Future impact forecasts                   │
│  • Collaboration Networks: Partnership maps                  │
└─────────────────────────────────────────────────────────────┘
```

---

## API Integration Details

### CrossRef API
```typescript
// Fetch citation count for a DOI
const response = await fetch(
  `https://api.crossref.org/works/${doi}`
);
const data = await response.json();
const citations = data.message['is-referenced-by-count'];
```

**Rate Limit:** Polite pool (50 requests/second with email)
**Cost:** Free
**Coverage:** 130M+ publications

### Semantic Scholar API
```typescript
// Fetch paper details
const response = await fetch(
  `https://api.semanticscholar.org/v1/paper/${doi}`
);
const data = await response.json();
const citations = data.numCitedBy;
```

**Rate Limit:** 100 requests/5 minutes
**Cost:** Free
**Coverage:** 200M+ papers

### Altmetric API
```typescript
// Fetch alternative metrics
const response = await fetch(
  `https://api.altmetric.com/v1/doi/${doi}`
);
const data = await response.json();
const score = data.score; // 0-100+
const mentions = data.cited_by_tweeters_count;
```

**Rate Limit:** Reasonable use
**Cost:** Free (basic)
**Coverage:** 20M+ tracked outputs

---

## Impact Calculation

### Combined Impact Score
```typescript
function calculateCombinedImpact(
  citations: number,
  altmetric: AltmetricData | null
): number {
  // Citations: 70% weight
  const citationScore = Math.min(70, citations * 0.5);
  
  // Altmetric: 30% weight
  const altmetricScore = (altmetric?.score || 0) * 0.3;
  
  return citationScore + altmetricScore;
}
```

### H-Index Calculation
```typescript
// Sort publications by citation count (descending)
const sorted = publications.sort((a, b) => b.citations - a.citations);

// H-Index: largest number h such that h papers have ≥ h citations
let hIndex = 0;
for (let i = 0; i < sorted.length; i++) {
  if (sorted[i].citations >= i + 1) {
    hIndex = i + 1;
  } else {
    break;
  }
}
```

---

## Future Enhancements

### Potential Additions

1. **Google Scholar Integration**
   - More comprehensive citation data
   - Profile metrics
   - Requires scraping (no official API)

2. **ResearchGate Stats**
   - Reads and recommendations
   - Requires API access or scraping

3. **Institutional Repository**
   - Host PDFs on UDSM platform
   - Track downloads directly
   - Full control over analytics

4. **Publisher Partnerships**
   - Negotiate data sharing agreements
   - Access to readership statistics
   - Requires institutional relationships

---

## Conclusion

While direct readership tracking would be ideal, our citation-based approach provides:

✅ **Verifiable Data**: From authoritative sources
✅ **Real-Time Updates**: Daily citation counts
✅ **Broader Impact**: Alternative metrics included
✅ **Reliable Evidence**: Can't be manipulated
✅ **Global Visibility**: Shows worldwide influence

This addresses the mission of "evidencing global visibility and impact" through the most reliable data available to academic institutions.
