# Citation Auto-Update Feature

## Overview

The Citation Auto-Update feature automatically fetches and updates citation counts for your publications from external academic APIs, including CrossRef and Semantic Scholar.

## Features

### 1. **Automatic Citation Updates**
- Fetches real-time citation counts from CrossRef (via DOI) and Semantic Scholar (via DOI or title search)
- Automatically selects the highest citation count when multiple sources are available
- Updates publication records and creates historical snapshots

### 2. **Multiple Update Methods**

#### Bulk Update (UI)
- Click "Auto-Update All" button in the Citation Impact Tracker
- Updates all publications in a single batch operation
- Shows progress and results via toast notifications

#### Individual Update (UI)
- Click the refresh icon next to any publication
- Updates only that specific publication
- Useful for targeted updates after recent citations

#### Scheduled Updates (Edge Function)
- Deploy the `citation-updater` Edge Function for automated updates
- Can be triggered via cron jobs or webhooks
- Processes all publications in the database

### 3. **Data Sources**

#### CrossRef API
- **Best for**: Publications with DOI
- **Endpoint**: `https://api.crossref.org/works/{doi}`
- **Rate Limit**: Polite pool (50 requests/second with proper headers)
- **Citation Field**: `is-referenced-by-count`

#### Semantic Scholar API
- **Best for**: Publications without DOI or as fallback
- **Endpoint**: `https://api.semanticscholar.org/graph/v1/paper/`
- **Rate Limit**: 100 requests/5 minutes (public API)
- **Citation Field**: `citationCount`
- **Search**: Can search by DOI or title

## Usage

### Frontend Integration

```typescript
import { useCitationTracker } from '@/hooks/useCitationTracker';

function MyComponent() {
  const { updateCitationsFromAPIs, updateSinglePublication } = useCitationTracker();

  // Update all publications
  const handleUpdateAll = async () => {
    const result = await updateCitationsFromAPIs();
    console.log(`Updated ${result.updated} publications`);
  };

  // Update single publication
  const handleUpdateOne = async (pubId: string) => {
    const result = await updateSinglePublication(pubId);
    console.log(`New count: ${result.citationData?.count}`);
  };
}
```

### Direct Service Usage

```typescript
import { fetchCitationCount, batchFetchCitations } from '@/services/citationService';

// Fetch for single publication
const citationData = await fetchCitationCount({
  doi: '10.1234/example',
  title: 'My Research Paper',
  year: 2024
});

// Batch fetch for multiple publications
const publications = [
  { doi: '10.1234/example1', title: 'Paper 1' },
  { doi: '10.1234/example2', title: 'Paper 2' }
];
const results = await batchFetchCitations(publications);
```

## Deployment

### Edge Function Setup

1. **Deploy the function**:
```bash
supabase functions deploy citation-updater
```

2. **Set up environment variables** (already configured in Supabase):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Schedule automatic updates** using Supabase Cron:
```sql
-- Run daily at 2 AM
SELECT cron.schedule(
  'daily-citation-update',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/citation-updater',
    headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  );
  $$
);
```

### Manual Trigger

```bash
curl -X POST \
  'https://your-project.supabase.co/functions/v1/citation-updater' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

## Database Schema

### New Columns in `researcher_publications`

```sql
citation_source TEXT              -- 'crossref', 'semanticscholar', or 'manual'
last_citation_update TIMESTAMPTZ  -- When citations were last updated
semantic_scholar_id TEXT          -- Semantic Scholar paper ID for caching
```

### Citation Snapshots

Historical citation data is automatically recorded in `citation_snapshots` table whenever citations are updated.

## Rate Limiting & Best Practices

### Rate Limits
- **CrossRef**: ~50 requests/second (polite pool)
- **Semantic Scholar**: 100 requests per 5 minutes

### Implementation
- Batch processing with 300ms delays between requests
- Processes 5 publications at a time
- Automatic retry logic for failed requests

### Best Practices
1. **Use DOIs when available** - More accurate and faster lookups
2. **Schedule updates during off-peak hours** - Reduces API load
3. **Monitor update logs** - Check Edge Function logs for errors
4. **Update periodically, not continuously** - Daily or weekly is sufficient

## Troubleshooting

### No citations found
- **Check DOI format**: Must be valid and registered with CrossRef
- **Verify publication exists**: Search manually on Semantic Scholar
- **Check API status**: Both APIs may have temporary outages

### Rate limit errors
- **Reduce batch size**: Lower from 5 to 3 publications per batch
- **Increase delays**: Change from 300ms to 500ms between requests
- **Use scheduled updates**: Spread updates over time instead of bulk

### Incorrect citation counts
- **Multiple sources**: System picks highest count, which may vary
- **Update lag**: External APIs may not reflect latest citations immediately
- **Manual override**: You can manually edit citation counts if needed

## API Documentation

- **CrossRef API**: https://api.crossref.org/swagger-ui/index.html
- **Semantic Scholar API**: https://api.semanticscholar.org/api-docs/

## Future Enhancements

- [ ] Support for Google Scholar (requires scraping or API key)
- [ ] Support for Scopus and Web of Science (requires institutional access)
- [ ] Configurable update frequency per publication
- [ ] Email notifications for significant citation increases
- [ ] Citation velocity tracking (citations per month)
- [ ] Automatic DOI lookup for publications without DOI
