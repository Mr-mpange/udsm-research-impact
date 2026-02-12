# Testing Readership Tracking System

## Step 1: Verify Database Tables

Run this in Supabase SQL Editor:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('paper_views', 'paper_downloads');

-- Expected result: 2 rows (paper_views, paper_downloads)
```

## Step 2: Get a Paper ID for Testing

```sql
-- Get any paper ID from your database
SELECT id, title, pdf_url 
FROM researcher_publications 
LIMIT 1;

-- Copy the 'id' value (UUID format)
```

## Step 3: Test Manual Tracking

Insert a test view:

```sql
-- Replace 'YOUR_PAPER_ID' with actual paper ID from Step 2
INSERT INTO paper_views (
  paper_id,
  country,
  city,
  session_id,
  timestamp
) VALUES (
  'YOUR_PAPER_ID',
  'Tanzania',
  'Dar es Salaam',
  'test-session-123',
  NOW()
);

-- Check if it was inserted
SELECT * FROM paper_views ORDER BY timestamp DESC LIMIT 1;
```

## Step 4: Test the View

```sql
-- Check the readership_by_country view
SELECT * FROM readership_by_country;

-- Expected: Shows Tanzania with 1 view
```

## Step 5: Test in Browser

1. **Start dev server:**
```bash
npm run dev
```

2. **Navigate to paper page:**
```
http://localhost:8080/paper/YOUR_PAPER_ID
```
(Replace YOUR_PAPER_ID with the ID from Step 2)

3. **What you should see:**
- Paper title and details
- Sidebar with statistics:
  - Total Views: 1 (or more)
  - Downloads: 0
  - Countries Reached: 1
  - Top Countries: Tanzania

4. **Check database again:**
```sql
SELECT 
  country,
  city,
  timestamp
FROM paper_views 
ORDER BY timestamp DESC 
LIMIT 5;

-- Should show your new view with your actual country
```

## Step 6: Test Download Tracking

1. Click "Download PDF" button on paper page
2. Check database:

```sql
SELECT * FROM paper_downloads ORDER BY timestamp DESC LIMIT 1;

-- Should show new download record
```

3. Refresh paper page - Downloads count should increase

## Step 7: Test Multiple Views

1. Open paper page in different browsers:
   - Chrome
   - Firefox
   - Edge
   - Incognito mode

2. Each should create a new view with different session_id

3. Check statistics:
```sql
SELECT 
  COUNT(*) as total_views,
  COUNT(DISTINCT session_id) as unique_visitors,
  COUNT(DISTINCT country) as countries
FROM paper_views;
```

## Expected Results

✅ **After all tests:**
- paper_views table has multiple rows
- paper_downloads table has at least 1 row
- Paper page shows real-time statistics
- Different browsers = different session IDs
- Country is detected automatically

## Troubleshooting

### Problem: "Cannot read property 'country'"

**Solution:** Geolocation API might be blocked. Check browser console.

Add this to test without geolocation:

```sql
-- Manually insert test data
INSERT INTO paper_views (paper_id, country, city, session_id)
VALUES ('YOUR_PAPER_ID', 'USA', 'New York', 'test-123');
```

### Problem: "Paper not found"

**Solution:** Make sure paper has pdf_url:

```sql
-- Check paper
SELECT id, title, pdf_url FROM researcher_publications WHERE id = 'YOUR_PAPER_ID';

-- If pdf_url is null, add one:
UPDATE researcher_publications 
SET pdf_url = 'https://example.com/paper.pdf'
WHERE id = 'YOUR_PAPER_ID';
```

### Problem: "Route not found"

**Solution:** Make sure you added the route to App.tsx:

```typescript
<Route path="/paper/:paperId" element={<PaperView />} />
```

## Success Criteria

✅ Tables created in database
✅ Can insert views manually
✅ Paper page loads without errors
✅ Statistics display correctly
✅ Country is detected automatically
✅ Download tracking works
✅ Multiple views tracked separately

---

## Quick Test Commands

```bash
# 1. Install dependencies
npm install uuid @types/uuid

# 2. Start server
npm run dev

# 3. Open browser
# Navigate to: http://localhost:8080/paper/[paper-id]

# 4. Check console for errors
# Press F12 → Console tab

# 5. Verify tracking in Supabase
# SQL Editor → SELECT * FROM paper_views;
```

---

## What to Look For

**In Browser:**
- Paper page loads
- Sidebar shows "Readership Statistics"
- Numbers update in real-time
- No console errors

**In Database:**
- New rows in paper_views
- Country/city populated
- Timestamp is recent
- Session ID is unique

**Success!** 🎉 Your readership tracking is working!
