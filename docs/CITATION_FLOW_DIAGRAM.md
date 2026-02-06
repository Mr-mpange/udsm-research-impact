# Citation Auto-Update Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │      Citation Impact Tracker Component                   │  │
│  │  ┌────────────────┐  ┌──────────────────────────────┐   │  │
│  │  │ Auto-Update    │  │ Individual Refresh Icons     │   │  │
│  │  │ All Button     │  │ (per publication)            │   │  │
│  │  └────────┬───────┘  └──────────┬───────────────────┘   │  │
│  └───────────┼────────────────────┼─────────────────────────┘  │
└──────────────┼────────────────────┼────────────────────────────┘
               │                    │
               ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    useCitationTracker Hook                      │
│  ┌──────────────────────────┐  ┌──────────────────────────┐   │
│  │ updateCitationsFromAPIs()│  │ updateSinglePublication()│   │
│  └────────────┬─────────────┘  └──────────┬───────────────┘   │
└───────────────┼────────────────────────────┼────────────────────┘
                │                            │
                ▼                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Citation Service                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐   │
│  │ batchFetchCitations()    │  │ fetchCitationCount()     │   │
│  └────────────┬─────────────┘  └──────────┬───────────────┘   │
└───────────────┼────────────────────────────┼────────────────────┘
                │                            │
                └────────────┬───────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
    ┌───────────────────┐     ┌──────────────────────┐
    │   CrossRef API    │     │ Semantic Scholar API │
    │                   │     │                      │
    │ DOI → Citations   │     │ DOI/Title → Citations│
    └───────────────────┘     └──────────────────────┘
                │                         │
                └────────────┬────────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │  Select Highest Count  │
                └────────────┬───────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase Database                            │
│  ┌──────────────────────────┐  ┌──────────────────────────┐   │
│  │ researcher_publications  │  │  citation_snapshots      │   │
│  │ - citations              │  │  - publication_id        │   │
│  │ - citation_source        │  │  - citations             │   │
│  │ - last_citation_update   │  │  - snapshot_date         │   │
│  └──────────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Update Flow Sequence

### 1. User-Initiated Update (UI)

```
User clicks "Auto-Update All"
    │
    ├─> useCitationTracker.updateCitationsFromAPIs()
    │       │
    │       ├─> Fetch all user publications from DB
    │       │
    │       ├─> citationService.batchFetchCitations()
    │       │       │
    │       │       ├─> For each publication:
    │       │       │   ├─> Try CrossRef API (if DOI exists)
    │       │       │   ├─> Try Semantic Scholar API
    │       │       │   └─> Return highest count
    │       │       │
    │       │       └─> Return Map<publicationKey, CitationData>
    │       │
    │       ├─> Update publications in DB
    │       │
    │       ├─> Create snapshots in DB
    │       │
    │       └─> Refresh UI data
    │
    └─> Show toast notification with results
```

### 2. Scheduled Update (Edge Function)

```
Cron Job triggers at 2 AM
    │
    ├─> POST /functions/v1/citation-updater
    │       │
    │       ├─> Fetch ALL publications from DB
    │       │
    │       ├─> For each publication:
    │       │   ├─> Try CrossRef API (if DOI)
    │       │   ├─> Try Semantic Scholar API
    │       │   ├─> Update if count changed
    │       │   └─> Wait 300ms (rate limiting)
    │       │
    │       ├─> Batch update publications
    │       │
    │       ├─> Create snapshots
    │       │
    │       └─> Return summary
    │
    └─> Log results
```

## Data Flow

### Input (Publication Data)
```
{
  id: "uuid",
  title: "Research Paper Title",
  doi: "10.1234/example",      // Optional but preferred
  year: 2024,
  citations: 10                 // Current count
}
```

### API Responses

#### CrossRef
```
GET https://api.crossref.org/works/10.1234/example
Response:
{
  message: {
    "is-referenced-by-count": 42,
    "DOI": "10.1234/example",
    ...
  }
}
```

#### Semantic Scholar
```
GET https://api.semanticscholar.org/graph/v1/paper/DOI:10.1234/example
Response:
{
  "paperId": "abc123",
  "citationCount": 45,
  "title": "Research Paper Title",
  ...
}
```

### Output (Citation Data)
```
{
  source: "semanticscholar",    // Which API provided the data
  count: 45,                     // Citation count (highest from all sources)
  lastUpdated: "2024-02-06T...", // ISO timestamp
  paperId: "abc123"              // Semantic Scholar ID (if available)
}
```

### Database Updates
```
researcher_publications:
  citations: 45
  citation_source: "semanticscholar"
  last_citation_update: "2024-02-06T..."
  semantic_scholar_id: "abc123"

citation_snapshots:
  publication_id: "uuid"
  citations: 45
  snapshot_date: "2024-02-06"
```

## Error Handling

```
Try CrossRef API
    │
    ├─ Success → Store result
    │
    └─ Failure → Log warning, continue
        │
        Try Semantic Scholar API
            │
            ├─ Success → Store result
            │
            └─ Failure → Log error
                │
                No results available
                    │
                    └─ Return null, skip update
```

## Rate Limiting Strategy

```
Publications: [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10]
                │
                ├─ Batch 1: [P1, P2, P3, P4, P5]
                │   ├─ Process P1 → Wait 200ms
                │   ├─ Process P2 → Wait 200ms
                │   ├─ Process P3 → Wait 200ms
                │   ├─ Process P4 → Wait 200ms
                │   └─ Process P5 → Wait 200ms
                │
                └─ Batch 2: [P6, P7, P8, P9, P10]
                    ├─ Process P6 → Wait 200ms
                    ├─ Process P7 → Wait 200ms
                    ├─ Process P8 → Wait 200ms
                    ├─ Process P9 → Wait 200ms
                    └─ Process P10 → Done
```

## Component Interaction

```
CitationImpactTracker.tsx
    │
    ├─ Displays publications list
    │
    ├─ "Auto-Update All" button
    │   └─> updateCitationsFromAPIs()
    │
    ├─ Individual refresh icons
    │   └─> updateSinglePublication(pubId)
    │
    └─ Shows toast notifications
        ├─ Success: "Updated X publications"
        └─ Error: "Update failed: [reason]"
```

## Performance Considerations

- **Batch Size**: 5 publications per batch (configurable)
- **Delay**: 200-300ms between requests (respects rate limits)
- **Parallel Processing**: Batches processed in parallel
- **Caching**: Semantic Scholar IDs cached for faster lookups
- **Indexing**: DOI and update timestamp indexed for performance
