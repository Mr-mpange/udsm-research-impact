# Citation Auto-Update Feature - Implementation Summary

## Overview
Added comprehensive citation count auto-update functionality that fetches real-time citation data from CrossRef and Semantic Scholar APIs.

## Files Created

### 1. Core Service
- **`src/services/citationService.ts`**
  - Fetches citations from CrossRef API (DOI-based)
  - Fetches citations from Semantic Scholar API (DOI or title search)
  - Batch processing with rate limiting
  - Returns highest citation count from multiple sources

### 2. Edge Function
- **`supabase/functions/citation-updater/index.ts`**
  - Serverless function for scheduled citation updates
  - Processes all publications in database
  - Can be triggered via cron jobs or webhooks
  - Automatically creates snapshots

### 3. Database Migration
- **`supabase/migrations/20260206120000_add_citation_metadata.sql`**
  - Adds `citation_source` column (tracks data source)
  - Adds `last_citation_update` column (tracks update timestamp)
  - Adds `semantic_scholar_id` column (caches paper ID)
  - Creates indexes for performance

### 4. Documentation
- **`docs/CITATION_AUTO_UPDATE.md`** - Complete feature documentation
- **`docs/CITATION_SETUP_GUIDE.md`** - Step-by-step setup instructions

### 5. Tests
- **`src/services/__tests__/citationService.test.ts`**
  - Unit tests for citation service
  - Mocks API responses
  - Tests error handling

## Files Modified

### 1. Citation Tracker Hook
- **`src/hooks/useCitationTracker.tsx`**
  - Added `updateCitationsFromAPIs()` - Bulk update all publications
  - Added `updateSinglePublication()` - Update individual publication
  - Integrated with citation service
  - Automatic snapshot creation

### 2. Citation Impact Tracker UI
- **`src/components/citations/CitationImpactTracker.tsx`**
  - Added "Auto-Update All" button
  - Added refresh icon for individual publications
  - Toast notifications for update results
  - Loading states and error handling
  - Updated tips section

## Key Features

### 1. Multiple Update Methods
- **Bulk Update**: Update all publications at once via UI
- **Individual Update**: Update single publication via refresh icon
- **Scheduled Update**: Automatic updates via Edge Function

### 2. Smart API Selection
- Tries CrossRef first if DOI is available (most reliable)
- Falls back to Semantic Scholar (works with or without DOI)
- Returns highest citation count when multiple sources available

### 3. Rate Limiting
- Processes 5 publications per batch
- 300ms delay between requests
- Respects API rate limits automatically

### 4. Historical Tracking
- Automatically creates snapshots when citations update
- Tracks citation source (CrossRef vs Semantic Scholar)
- Records update timestamps

## Usage

### Frontend (User Interface)
```typescript
// In Citation Impact Tracker component
1. Click "Auto-Update All" button to update all publications
2. Click refresh icon next to individual publication for targeted update
3. View results in toast notifications
```

### Programmatic (Developers)
```typescript
import { useCitationTracker } from '@/hooks/useCitationTracker';

const { updateCitationsFromAPIs, updateSinglePublication } = useCitationTracker();

// Update all
const result = await updateCitationsFromAPIs();
console.log(`Updated ${result.updated} publications`);

// Update one
const result = await updateSinglePublication(publicationId);
console.log(`New count: ${result.citationData?.count}`);
```

### Edge Function (Scheduled)
```bash
# Deploy
supabase functions deploy citation-updater

# Test
supabase functions invoke citation-updater

# Schedule (via pg_cron)
SELECT cron.schedule('daily-citation-update', '0 2 * * *', $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/citation-updater',
    headers := '{"Authorization": "Bearer YOUR_KEY"}'::jsonb
  );
$$);
```

## API Integration

### CrossRef API
- **Endpoint**: `https://api.crossref.org/works/{doi}`
- **Rate Limit**: ~50 requests/second
- **Best for**: Publications with DOI
- **Returns**: `is-referenced-by-count`

### Semantic Scholar API
- **Endpoint**: `https://api.semanticscholar.org/graph/v1/paper/`
- **Rate Limit**: 100 requests per 5 minutes
- **Best for**: All publications (DOI or title search)
- **Returns**: `citationCount` and `paperId`

## Database Schema Changes

```sql
-- New columns in researcher_publications
citation_source TEXT              -- 'crossref', 'semanticscholar', or 'manual'
last_citation_update TIMESTAMPTZ  -- When citations were last updated
semantic_scholar_id TEXT          -- Semantic Scholar paper ID

-- New indexes
idx_publications_doi              -- Fast DOI lookups
idx_publications_last_update      -- Track update recency
```

## Next Steps

### 1. Apply Migration
```bash
supabase db push
```

### 2. Test the Feature
- Navigate to Citation Impact Tracker
- Click "Auto-Update All"
- Verify citations are updated

### 3. Deploy Edge Function (Optional)
```bash
supabase functions deploy citation-updater
```

### 4. Set Up Scheduled Updates (Optional)
- Enable pg_cron extension in Supabase
- Run the cron schedule SQL (see setup guide)

## Benefits

1. **Automated Updates**: No manual citation tracking needed
2. **Multiple Sources**: Combines data from CrossRef and Semantic Scholar
3. **Historical Tracking**: Automatic snapshot creation for trend analysis
4. **Flexible**: Works with or without DOI
5. **Scalable**: Batch processing with rate limiting
6. **Reliable**: Error handling and fallback mechanisms

## Future Enhancements

- Google Scholar integration (requires scraping or API key)
- Scopus/Web of Science support (requires institutional access)
- Configurable update frequency per publication
- Email notifications for citation milestones
- Citation velocity tracking (citations per month)
- Automatic DOI lookup for publications without DOI
