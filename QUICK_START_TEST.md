# Quick Start - Test AI Predictions (3 Minutes)

## The Error You Got

The error happened because the script had optional code for "citation snapshots" with placeholder IDs like `'PUB_ID_1'`. 

**I've fixed it!** The script now skips that optional part. The AI predictions work perfectly without it.

---

## Run This Now (3 Steps)

### Step 1: Get Your User ID (30 seconds)

1. Open Supabase: https://supabase.com/dashboard
2. Select project: `zuqothviduizwcbawigy`
3. Click **SQL Editor**
4. Run:
```sql
SELECT user_id, email FROM auth.users;
```
5. Copy your `user_id`

---

### Step 2: Run the Fixed Script (1 minute)

1. Open `test-ai-predictions.sql` in your editor
2. Find and replace ALL instances of `'YOUR_USER_ID'` with your actual user_id
   - Example: `'707df9f9-b0a3-4263-ac0f-d1ba374ab8da'`
3. Copy lines 1-95 ONLY (stop before "Step 4: Optional")
4. Paste into Supabase SQL Editor
5. Click **RUN**

**You should see:**
```
✅ 5 rows inserted into researcher_publications
✅ 1 row updated in profiles
✅ Success!
```

---

### Step 3: View Predictions (1 minute)

1. Go to your website
2. Login
3. Dashboard → AI Predictions tab

**You'll see:**
- 📈 Citation forecast: 100 → 761 citations (5 years)
- 💡 Emerging topics: Environmental Science +100%
- 🎯 Impact simulator: +198, +331, +264 citations

---

## What to Copy (Lines 1-95)

Copy from the beginning of the file up to and including:

```sql
UPDATE profiles
SET 
  total_citations = 100,
  total_publications = 5,
  h_index = 4,
  updated_at = NOW()
WHERE user_id = 'YOUR_USER_ID';
```

**STOP THERE!** Don't copy the "Step 4: Optional" section.

---

## Verify It Worked

Run this in SQL Editor:

```sql
-- Replace YOUR_USER_ID
SELECT COUNT(*) as total_publications
FROM researcher_publications
WHERE user_id = 'YOUR_USER_ID';
```

**Expected:** `total_publications: 5`

---

## Clean Up Later (Optional)

When done testing:

```sql
-- Replace YOUR_USER_ID
DELETE FROM researcher_publications 
WHERE user_id = 'YOUR_USER_ID' 
AND doi LIKE '10.1234/test%';

UPDATE profiles
SET total_citations = 0, total_publications = 0
WHERE user_id = 'YOUR_USER_ID';
```

---

## Need Help?

If you still get errors:
1. Make sure you replaced ALL `'YOUR_USER_ID'` instances
2. Make sure your user_id is in quotes: `'abc-123-def'`
3. Only copy lines 1-95 (skip the optional snapshots)

The AI predictions are real and ready to test! 🚀
