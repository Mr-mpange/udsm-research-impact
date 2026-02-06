# Citation Auto-Update Setup Guide

## Quick Start

### 1. Apply Database Migration

Run the migration to add citation metadata columns:

```bash
# If using Supabase CLI
supabase db push

# Or apply manually in Supabase Dashboard > SQL Editor
```

The migration file is located at:
`supabase/migrations/20260206120000_add_citation_metadata.sql`

### 2. Test the Feature (Frontend)

The feature is already integrated into the Citation Impact Tracker component. To use it:

1. Navigate to the Dashboard
2. Go to the Citation Impact Tracker section
3. Click **"Auto-Update All"** to update all publications
4. Or click the refresh icon next to individual publications

### 3. Deploy Edge Function (Optional - for scheduled updates)

```bash
# Deploy the citation updater function
supabase functions deploy citation-updater

# Test the function
supabase functions invoke citation-updater
```

### 4. Set Up Scheduled Updates (Optional)

To automatically update citations daily:

1. Go to Supabase Dashboard > Database > Extensions
2. Enable the `pg_cron` extension
3. Run this SQL in the SQL Editor:

```sql
SELECT cron.schedule(
  'daily-citation-update',
  '0 2 * * *',  -- Run at 2 AM daily
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/citation-updater',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.anon_key')
    )
  );
  $$
);
```

Replace `YOUR_PROJECT_REF` with your actual Supabase project reference.

## How It Works

### Data Flow

1. **User triggers update** (via UI button or scheduled job)
2. **System fetches publications** from database
3. **For each publication**:
   - Try CrossRef API if DOI exists
   - Try Semantic Scholar API (by DOI or title)
   - Select highest citation count
4. **Update database** with new counts
5. **Create snapshot** for historical tracking
6. **Show results** to user

### API Priority

1. **CrossRef** (if DOI available) - Most reliable for DOI-based lookups
2. **Semantic Scholar** (fallback) - Works with or without DOI

### Rate Limiting

- Processes 5 publications per batch
- 300ms delay between requests
- Respects API rate limits automatically

## Testing

### Test with Sample Data

```typescript
// In browser console or test file
import { fetchCitationCount } from '@/services/citationService';

// Test with a known DOI
const result = await fetchCitationCount({
  doi: '10.1038/nature12373',
  title: 'Sample Paper',
  year: 2013
});

console.log(result);
// Expected: { source: 'crossref', count: XXX, lastUpdated: '...' }
```

### Verify Database Updates

```sql
-- Check recent updates
SELECT 
  title,
  citations,
  citation_source,
  last_citation_update
FROM researcher_publications
WHERE last_citation_update IS NOT NULL
ORDER BY last_citation_update DESC
LIMIT 10;

-- Check snapshots
SELECT 
  rp.title,
  cs.citations,
  cs.snapshot_date
FROM citation_snapshots cs
JOIN researcher_publications rp ON cs.publication_id = rp.id
ORDER BY cs.snapshot_date DESC
LIMIT 10;
```

## Troubleshooting

### "No publications to update"
- Make sure you have publications in the database
- Check that publications have either DOI or title

### "Update failed" error
- Check browser console for detailed error messages
- Verify API endpoints are accessible (not blocked by firewall)
- Check Supabase logs for backend errors

### Citations not updating
- Verify DOI format is correct (e.g., "10.1234/example")
- Check if publication exists in CrossRef/Semantic Scholar
- Try manual search on https://www.semanticscholar.org/

### Edge Function not working
- Check function logs: `supabase functions logs citation-updater`
- Verify environment variables are set
- Test with: `supabase functions invoke citation-updater`

## Configuration

### Adjust Rate Limiting

Edit `src/services/citationService.ts`:

```typescript
// Change batch size (default: 5)
const batchSize = 3;

// Change delay (default: 200ms)
await new Promise(resolve => setTimeout(resolve, 500));
```

### Change API Priority

Edit `src/services/citationService.ts` in `fetchCitationCount()`:

```typescript
// To prefer Semantic Scholar over CrossRef
// Swap the order of API calls
```

## Support

For issues or questions:
1. Check the main documentation: `docs/CITATION_AUTO_UPDATE.md`
2. Review API documentation:
   - CrossRef: https://api.crossref.org/swagger-ui/index.html
   - Semantic Scholar: https://api.semanticscholar.org/api-docs/
3. Check Supabase logs for backend errors
