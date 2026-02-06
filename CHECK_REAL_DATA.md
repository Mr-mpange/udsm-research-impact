# How to Verify Real Data

## The Admin Dashboard IS Using Real Data

The stats you see are **actually from your Supabase database**. Here's how to verify:

### Check Your Database:

1. **Go to Supabase Dashboard**
2. **Open SQL Editor**
3. **Run these queries:**

```sql
-- Check total researchers
SELECT COUNT(*) as total_researchers FROM profiles;

-- Check active researchers (last 30 days)
SELECT COUNT(*) as active_researchers 
FROM profiles 
WHERE updated_at > NOW() - INTERVAL '30 days';

-- Check total publications
SELECT COUNT(*) as total_publications FROM researcher_publications;

-- Check average H-Index
SELECT AVG(h_index) as avg_h_index FROM profiles;

-- Check total citations
SELECT SUM(total_citations) as total_citations FROM profiles;
```

### What You're Seeing:

If you see **4523 publications**, that means:
- Your database actually has 4523 records in `researcher_publications` table
- This could be from:
  - Test data you added
  - Sample data from migrations
  - Real publications if you imported data

### To See Your Actual Data:

```sql
-- See all publications
SELECT * FROM researcher_publications LIMIT 10;

-- See all researchers
SELECT display_name, total_publications, total_citations, h_index 
FROM profiles 
LIMIT 10;
```

### If You Want to Start Fresh:

```sql
-- Clear all publications (CAREFUL - this deletes data!)
DELETE FROM researcher_publications;

-- Clear all profiles except yours
DELETE FROM profiles WHERE user_id != 'YOUR_USER_ID';
```

### To Add Test Data:

```sql
-- Add a few test publications
INSERT INTO researcher_publications (user_id, title, journal, year, citations, doi)
VALUES 
  ('YOUR_USER_ID', 'Test Paper 1', 'Nature', 2023, 10, '10.1234/test1'),
  ('YOUR_USER_ID', 'Test Paper 2', 'Science', 2022, 5, '10.1234/test2'),
  ('YOUR_USER_ID', 'Test Paper 3', 'Cell', 2021, 8, '10.1234/test3');
```

## The Code IS Correct

The Admin.tsx file is fetching real data:

```typescript
// This fetches REAL counts from your database
const [usersRes, pubsRes] = await Promise.all([
  supabase.from('profiles').select('id, h_index, total_citations', { count: 'exact' }),
  supabase.from('researcher_publications').select('id', { count: 'exact', head: true })
]);

// These are REAL numbers from your database
setStats({
  totalUsers: usersRes.count || 0,  // Real count
  totalPublications: pubsRes.count || 0,  // Real count
  avgHIndex: /* calculated from real data */,
  totalCitations: /* sum of real data */
});
```

## Why You Might See Large Numbers:

1. **Sample data in migrations** - Check your migration files
2. **Test data** - Someone added test records
3. **Imported data** - Data was imported from another source
4. **Real data** - If this is a production database

## To Verify It's Real:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh admin page
4. Look for Supabase API calls
5. Check the response - you'll see the actual data being fetched

## The "+8% from last month" Text

That's just a label/description text, not calculated. If you want real growth percentages, I can implement that by:
1. Storing historical snapshots
2. Comparing current vs last month
3. Calculating actual percentage change

Would you like me to implement real growth percentage calculations?
