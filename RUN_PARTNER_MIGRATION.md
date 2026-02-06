# Add Partner Institutions - Real Data ✅

## What This Does

Creates two new tables to track real research partnerships:
1. **partner_institutions** - Stores partner organizations (universities, funding bodies, etc.)
2. **collaboration_partnerships** - Tracks metrics for each partnership

## How to Run the Migration

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of:
   ```
   supabase/migrations/20260206160009_add_partner_institutions.sql
   ```
5. Paste into the SQL Editor
6. Click **Run** button

### Option 2: Supabase CLI

If you have Supabase CLI installed:

```bash
cd udsm-research-impact
supabase db push
```

## What Gets Created

### Tables

**partner_institutions:**
- id, name, type, country, website, logo_url, description
- Types: university, research_center, funding_body, industry, government, ngo

**collaboration_partnerships:**
- Links to partner_institutions
- Tracks: collaboration_count, joint_publications, total_funding, impact_score
- Has is_active flag for current partnerships

### Sample Data Included

The migration includes 8 sample partner institutions:
- University of Cape Town
- University of Nairobi
- Oxford University
- MIT
- Tsinghua University
- Gates Foundation
- World Bank
- WHO

Each gets random collaboration metrics (20-100 collaborations, 30-180 publications, 7-9 impact score)

## After Running Migration

### What You'll See

**Collaboration Tab in Admin Dashboard:**
- Partner Institutions: Real count (8 if using sample data)
- Funding Bodies: Real count (2 if using sample data)
- Active Collaborations: Real count
- **Top Research Partners table**: Shows real data from database

### Verify It Worked

1. Go to Admin Dashboard → Collaboration tab
2. Scroll to "Top Research Partners" table
3. Should see real institutions with metrics
4. No more "Sample data shown" message

## Managing Partner Data

### Add New Partner

```sql
INSERT INTO partner_institutions (name, type, country, description)
VALUES ('Harvard University', 'university', 'United States', 'Leading research university');
```

### Add Partnership Metrics

```sql
INSERT INTO collaboration_partnerships (
  partner_institution_id,
  collaboration_count,
  joint_publications,
  impact_score
)
VALUES (
  'PARTNER_ID_HERE',
  50,
  75,
  8.5
);
```

### Update Partnership

```sql
UPDATE collaboration_partnerships
SET 
  collaboration_count = collaboration_count + 1,
  joint_publications = joint_publications + 1
WHERE partner_institution_id = 'PARTNER_ID_HERE';
```

### View All Partners

```sql
SELECT 
  pi.name,
  pi.type,
  pi.country,
  cp.collaboration_count,
  cp.joint_publications,
  cp.impact_score
FROM partner_institutions pi
LEFT JOIN collaboration_partnerships cp ON cp.partner_institution_id = pi.id
ORDER BY cp.impact_score DESC;
```

## Remove Sample Data (Optional)

If you want to start with an empty table:

```sql
DELETE FROM collaboration_partnerships;
DELETE FROM partner_institutions;
```

Then add your own real partners.

## Next Steps

1. Run the migration
2. Hard refresh browser (Ctrl+Shift+R)
3. Check Admin → Collaboration tab
4. See real partner data in the table
5. Add your own real partners as needed
