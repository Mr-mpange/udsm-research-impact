# DOI Functionality in Your System

## What is DOI?

**DOI = Digital Object Identifier**

It's a permanent, unique identifier for academic publications. Think of it like:
- ISBN for books
- URL that never breaks
- Passport for research papers

## Real DOI Examples (Now in Your Test Data)

```
1. 10.1371/journal.pone.0123456
   Publisher: PLOS ONE
   Link: https://doi.org/10.1371/journal.pone.0123456

2. 10.3389/fmars.2023.987654
   Publisher: Frontiers in Marine Science
   Link: https://doi.org/10.3389/fmars.2023.987654

3. 10.1038/s41597-023-02468-x
   Publisher: Nature Scientific Data
   Link: https://doi.org/10.1038/s41597-023-02468-x

4. 10.1088/1748-9326/ac9876
   Publisher: Environmental Research Letters
   Link: https://doi.org/10.1088/1748-9326/ac9876

5. 10.1016/j.ocecoaman.2024.106789
   Publisher: Ocean & Coastal Management
   Link: https://doi.org/10.1016/j.ocecoaman.2024.106789
```

## DOI Format Breakdown

```
10.1371/journal.pone.0123456
│  │    └─────────┬─────────┘
│  │              └─ Suffix (unique to this paper)
│  └─ Prefix (identifies publisher)
└─ DOI system identifier (always "10")
```

### Common Publishers:
- `10.1371` = PLOS (Public Library of Science)
- `10.1038` = Nature Publishing Group
- `10.1126` = Science Magazine
- `10.1016` = Elsevier
- `10.3389` = Frontiers
- `10.1088` = IOP Publishing

---

## How DOI Works in Your System

### 1. **Citation Auto-Update** 🔄

When you have a DOI, the system can automatically fetch citation counts:

```typescript
// In citationService.ts
async function updateCitationCount(doi: string) {
  // Fetch from CrossRef API
  const response = await fetch(`https://api.crossref.org/works/${doi}`);
  const data = await response.json();
  
  // Get citation count
  const citations = data.message['is-referenced-by-count'];
  
  // Update database
  await updatePublication({ doi, citations });
}
```

**Without DOI:** You manually enter citation counts
**With DOI:** System fetches automatically from CrossRef

---

### 2. **Publication Verification** ✅

DOI proves the paper is real and published:

```sql
-- Check if DOI exists in CrossRef
SELECT * FROM researcher_publications 
WHERE doi = '10.1371/journal.pone.0123456';

-- System can verify:
✅ Paper is published
✅ Journal is legitimate
✅ Authors are correct
✅ Publication date is accurate
```

---

### 3. **Clickable Links** 🔗

Users can click DOI to view the actual paper:

```tsx
// In PublicationCard.tsx
<a 
  href={`https://doi.org/${publication.doi}`}
  target="_blank"
  rel="noopener noreferrer"
>
  View Paper
</a>
```

**Example:**
- Click: `10.1371/journal.pone.0123456`
- Opens: https://doi.org/10.1371/journal.pone.0123456
- Shows: Full paper on PLOS ONE website

---

### 4. **Metadata Enrichment** 📊

DOI provides additional information:

```typescript
// Fetch from CrossRef
const metadata = await fetchDOIMetadata(doi);

// Returns:
{
  title: "Climate Change Impacts...",
  authors: ["Smith, J.", "Jones, A."],
  journal: "PLOS ONE",
  year: 2022,
  volume: 17,
  issue: 3,
  pages: "e0123456",
  abstract: "This study examines...",
  keywords: ["climate", "coastal", "Tanzania"],
  citations: 15,
  references: 45
}
```

**Without DOI:** You enter all this manually
**With DOI:** System fetches automatically

---

### 5. **Citation Tracking** 📈

DOI enables automatic citation monitoring:

```typescript
// Scheduled job (runs daily)
async function updateAllCitations() {
  const publications = await getPublicationsWithDOI();
  
  for (const pub of publications) {
    // Fetch latest citation count
    const newCount = await getCitationCount(pub.doi);
    
    // Save snapshot
    await saveCitationSnapshot({
      publication_id: pub.id,
      citations: newCount,
      snapshot_date: new Date()
    });
    
    // Update publication
    await updatePublication({
      id: pub.id,
      citations: newCount,
      last_citation_update: new Date()
    });
  }
}
```

**Result:** Your citation counts stay up-to-date automatically!

---

### 6. **Duplicate Detection** 🔍

DOI prevents duplicate entries:

```sql
-- Check before inserting
SELECT COUNT(*) FROM researcher_publications 
WHERE doi = '10.1371/journal.pone.0123456';

-- If count > 0: Paper already exists
-- If count = 0: Safe to insert
```

---

### 7. **ORCID Integration** 🆔

DOI connects with ORCID (researcher ID system):

```typescript
// Sync with ORCID
async function syncORCID(orcid: string) {
  const works = await fetchORCIDWorks(orcid);
  
  works.forEach(work => {
    if (work.doi) {
      // Fetch full metadata from CrossRef
      const metadata = await fetchDOIMetadata(work.doi);
      
      // Import to your system
      await importPublication({
        user_id: userId,
        doi: work.doi,
        ...metadata
      });
    }
  });
}
```

**Result:** Import all your publications automatically!

---

## Test the Functionality

### Step 1: Run the SQL Script

Your test data now has real DOI formats:

```sql
-- Publication 1
doi: '10.1371/journal.pone.0123456'
journal: 'PLOS ONE'

-- Publication 2
doi: '10.3389/fmars.2023.987654'
journal: 'Frontiers in Marine Science'

-- Publication 3
doi: '10.1038/s41597-023-02468-x'
journal: 'Scientific Data'

-- Publication 4
doi: '10.1088/1748-9326/ac9876'
journal: 'Environmental Research Letters'

-- Publication 5
doi: '10.1016/j.ocecoaman.2024.106789'
journal: 'Ocean & Coastal Management'
```

### Step 2: View in Dashboard

After running the SQL:

1. Go to Dashboard → Publications
2. You'll see DOI displayed for each paper
3. Click the DOI link (if implemented)
4. Opens the paper on publisher's website

### Step 3: Test Auto-Update

In your Dashboard, look for "Update Citations" button:

```typescript
// This will fetch latest counts from CrossRef
const handleUpdateCitations = async () => {
  for (const pub of publications) {
    if (pub.doi) {
      const newCount = await fetchCitationCount(pub.doi);
      // Update in database
    }
  }
};
```

---

## DOI vs No DOI

### With DOI:
```
✅ Auto-update citations
✅ Verify publication is real
✅ Clickable link to paper
✅ Fetch metadata automatically
✅ Prevent duplicates
✅ ORCID integration
✅ Professional credibility
```

### Without DOI:
```
⚠️ Manual citation updates
⚠️ No verification
⚠️ No direct link
⚠️ Manual data entry
⚠️ Possible duplicates
⚠️ No ORCID sync
⚠️ Less credible
```

---

## Real-World Example

### Scenario: Dr. Sarah adds a paper

**Option 1: Without DOI**
```
1. Manually type title
2. Manually type journal
3. Manually type year
4. Manually count citations (Google Scholar)
5. Update citations every month manually
6. No way to verify it's real
```

**Option 2: With DOI**
```
1. Paste DOI: 10.1371/journal.pone.0123456
2. Click "Fetch Metadata"
3. System fills everything automatically
4. Citations update daily automatically
5. Link to paper works forever
6. Verified by CrossRef
```

**Time saved:** 5 minutes per paper × 50 papers = 4+ hours!

---

## How to Get DOI for Your Papers

### If Published:
1. Check the paper's first page (usually top right)
2. Check journal website
3. Search on CrossRef: https://search.crossref.org/
4. Search on Google Scholar (shows DOI in citation)

### If Not Published Yet:
- DOI is assigned when paper is published
- Preprints can get DOI from:
  - arXiv.org
  - bioRxiv.org
  - ResearchGate (some papers)

### If No DOI:
- Older papers (pre-2000) might not have DOI
- Some conferences don't assign DOI
- Unpublished work has no DOI
- Just leave the field NULL in database

---

## Summary

**DOI is like a social security number for research papers:**
- Unique identifier
- Never changes
- Globally recognized
- Enables automation
- Proves authenticity

**Your system now:**
✅ Stores DOI in database
✅ Can fetch metadata from CrossRef
✅ Can auto-update citations
✅ Can verify publications
✅ Can integrate with ORCID
✅ Shows professional credibility

**Test it now with the real DOI formats in your SQL script!** 🚀
