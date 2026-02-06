# Citation Auto-Update Implementation Checklist

## ✅ Completed

### Core Implementation
- [x] Created citation service (`src/services/citationService.ts`)
  - [x] CrossRef API integration
  - [x] Semantic Scholar API integration
  - [x] Batch processing with rate limiting
  - [x] Error handling and fallbacks

- [x] Updated citation tracker hook (`src/hooks/useCitationTracker.tsx`)
  - [x] `updateCitationsFromAPIs()` function
  - [x] `updateSinglePublication()` function
  - [x] Automatic snapshot creation

- [x] Enhanced UI component (`src/components/citations/CitationImpactTracker.tsx`)
  - [x] "Auto-Update All" button
  - [x] Individual refresh icons
  - [x] Toast notifications
  - [x] Loading states

- [x] Created Edge Function (`supabase/functions/citation-updater/index.ts`)
  - [x] Serverless citation updater
  - [x] Batch processing
  - [x] Rate limiting
  - [x] Error handling

- [x] Database migration (`supabase/migrations/20260206120000_add_citation_metadata.sql`)
  - [x] Added `citation_source` column
  - [x] Added `last_citation_update` column
  - [x] Added `semantic_scholar_id` column
  - [x] Created performance indexes

- [x] Documentation
  - [x] Feature documentation (`docs/CITATION_AUTO_UPDATE.md`)
  - [x] Setup guide (`docs/CITATION_SETUP_GUIDE.md`)
  - [x] Flow diagram (`docs/CITATION_FLOW_DIAGRAM.md`)
  - [x] Implementation summary (`CITATION_UPDATE_SUMMARY.md`)

- [x] Tests
  - [x] Unit tests for citation service
  - [x] Mock API responses
  - [x] Error handling tests

## 📋 To Do (Deployment Steps)

### 1. Database Setup
- [ ] Apply the migration to your Supabase database
  ```bash
  supabase db push
  ```
  Or manually run the SQL in Supabase Dashboard

- [ ] Verify new columns exist
  ```sql
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'researcher_publications' 
  AND column_name IN ('citation_source', 'last_citation_update', 'semantic_scholar_id');
  ```

### 2. Frontend Testing
- [ ] Start the development server
  ```bash
  npm run dev
  ```

- [ ] Navigate to Citation Impact Tracker

- [ ] Test "Auto-Update All" button
  - [ ] Verify loading state appears
  - [ ] Check toast notification shows results
  - [ ] Confirm citations are updated in UI

- [ ] Test individual refresh icons
  - [ ] Click refresh on a single publication
  - [ ] Verify loading spinner on that publication
  - [ ] Check citation count updates

- [ ] Verify error handling
  - [ ] Test with publications without DOI
  - [ ] Test with invalid/non-existent publications

### 3. Edge Function Deployment (Optional)
- [ ] Deploy the function
  ```bash
  supabase functions deploy citation-updater
  ```

- [ ] Test the function manually
  ```bash
  supabase functions invoke citation-updater
  ```

- [ ] Check function logs
  ```bash
  supabase functions logs citation-updater
  ```

- [ ] Verify database updates after function runs

### 4. Scheduled Updates Setup (Optional)
- [ ] Enable pg_cron extension in Supabase Dashboard
  - Go to Database > Extensions
  - Search for "pg_cron"
  - Enable it

- [ ] Create cron job
  ```sql
  SELECT cron.schedule(
    'daily-citation-update',
    '0 2 * * *',
    $$
    SELECT net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/citation-updater',
      headers := jsonb_build_object(
        'Authorization', 'Bearer YOUR_ANON_KEY'
      )
    );
    $$
  );
  ```

- [ ] Verify cron job is scheduled
  ```sql
  SELECT * FROM cron.job;
  ```

### 5. Testing & Validation
- [ ] Test with real publications
  - [ ] Publications with DOI
  - [ ] Publications without DOI
  - [ ] Mix of both

- [ ] Verify API responses
  - [ ] Check browser network tab for API calls
  - [ ] Verify CrossRef responses
  - [ ] Verify Semantic Scholar responses

- [ ] Check database updates
  ```sql
  SELECT 
    title,
    citations,
    citation_source,
    last_citation_update
  FROM researcher_publications
  WHERE last_citation_update IS NOT NULL
  ORDER BY last_citation_update DESC
  LIMIT 5;
  ```

- [ ] Verify snapshots are created
  ```sql
  SELECT 
    rp.title,
    cs.citations,
    cs.snapshot_date
  FROM citation_snapshots cs
  JOIN researcher_publications rp ON cs.publication_id = rp.id
  ORDER BY cs.created_at DESC
  LIMIT 5;
  ```

### 6. Performance Testing
- [ ] Test with small dataset (5-10 publications)
- [ ] Test with medium dataset (20-50 publications)
- [ ] Test with large dataset (100+ publications)
- [ ] Monitor API rate limits
- [ ] Check for timeout issues

### 7. Error Monitoring
- [ ] Set up error logging
- [ ] Monitor Supabase logs
- [ ] Check browser console for errors
- [ ] Test error scenarios:
  - [ ] Network failures
  - [ ] Invalid DOIs
  - [ ] API rate limits
  - [ ] Database errors

## 🔧 Configuration Options

### Adjust Rate Limiting
Edit `src/services/citationService.ts`:
```typescript
// Line ~115
const batchSize = 5;  // Change to 3 for slower processing

// Line ~120
await new Promise(resolve => setTimeout(resolve, 200));  // Increase to 500ms
```

### Change API Priority
Edit `src/services/citationService.ts` in `fetchCitationCount()`:
```typescript
// Swap order to prefer Semantic Scholar
// Move Semantic Scholar API call before CrossRef
```

### Customize Update Frequency
Edit cron schedule:
```sql
-- Weekly instead of daily
'0 2 * * 0'  -- Every Sunday at 2 AM

-- Twice daily
'0 2,14 * * *'  -- 2 AM and 2 PM
```

## 📊 Monitoring & Maintenance

### Regular Checks
- [ ] Monitor citation update success rate
- [ ] Check API error logs weekly
- [ ] Review snapshot data for anomalies
- [ ] Verify cron job execution (if scheduled)

### Monthly Tasks
- [ ] Review API usage and rate limits
- [ ] Check for API changes or deprecations
- [ ] Update documentation if needed
- [ ] Optimize batch size based on usage

### Quarterly Tasks
- [ ] Analyze citation trends
- [ ] Review and optimize database indexes
- [ ] Consider adding new data sources
- [ ] Update tests with new edge cases

## 🚀 Future Enhancements

### Potential Additions
- [ ] Google Scholar integration
- [ ] Scopus/Web of Science support
- [ ] Email notifications for citation mil