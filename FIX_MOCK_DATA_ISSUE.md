# 🔧 Fix Mock Data Issue in AI Chatbot

## ❌ The Problem You're Seeing

When you ask the AI chatbot questions, it responds with **FAKE/MOCK DATA** like:

```
Jambo! I am the UDSM Research Intelligence Advisor...

Based on our 2024 performance metrics:
- Global Impact Index: 78.4 ❌ FAKE
- Total Citations: 156,789 ❌ FAKE
- Health Sciences: 678 papers, 23,456 citations ❌ FAKE
- Prof. Mwangi, Dr. Hassan ❌ FAKE NAMES
```

**This is happening because the OLD edge function is still deployed!**

---

## ✅ The Solution

I've already updated the code to use REAL data from your database, but you need to **DEPLOY** it.

### What Was Changed:

1. **Edge Function Updated** (`supabase/functions/research-advisor/index.ts`)
   - Now fetches real data from database before each response
   - Includes actual metrics in AI context
   - Instructs AI to NEVER make up numbers

2. **Data Sources Connected:**
   - `researcher_publications` → Real publications & citations
   - `partner_institutions` → Real partner universities  
   - `profiles` → Real researcher count
   - `collaboration_partnerships` → Real collaboration data

---

## 🚀 Deploy the Fix NOW

### Option 1: Quick Deploy (Recommended)

```bash
# Run the deployment script
deploy-ai-real-data.bat
```

### Option 2: Manual Deploy

```bash
# Deploy the updated edge function
supabase functions deploy research-advisor

# Verify deployment
supabase functions list
```

---

## 🧪 Test After Deployment

1. **Open your app:** http://localhost:8080 (or production URL)

2. **Click the AI chatbot button** (bottom-right corner)

3. **Ask a test question:**
   ```
   "Tell me about UDSM's research metrics"
   ```

4. **Expected Response (with real data):**
   ```
   Based on our current database, UDSM has 8 partner institutions 
   including University of Cape Town, Oxford University, MIT...
   
   [Uses REAL numbers from your database]
   ```

5. **Expected Response (if database is empty):**
   ```
   The database is currently being populated with research data. 
   While I don't have specific numbers yet, I can help you 
   understand research metrics...
   
   [Acknowledges limited data, doesn't make up numbers]
   ```

---

## 📊 Current Database Status

Based on your migrations, you should have:

✅ **8 Partner Institutions** (from migration):
- University of Cape Town
- University of Nairobi  
- Oxford University
- MIT
- Tsinghua University
- Gates Foundation
- World Bank
- WHO

✅ **Collaboration Data** (sample data inserted)

❓ **Publications** - Check if any exist:
```sql
SELECT COUNT(*) FROM researcher_publications;
```

❓ **Researchers** - Check if any exist:
```sql
SELECT COUNT(*) FROM profiles;
```

---

## 🔍 Where Mock Data Was Coming From

### 1. Old System Prompt (FIXED ✅)
**Before:**
```typescript
const systemPrompt = `You are the UDSM Research Intelligence Advisor...
UDSM Research Overview (2024):
- Global Impact Index: 78.4
- Total Citations: 156,789
...`;
```

**After:**
```typescript
function buildSystemPrompt(realData: any) {
  return `You are a helpful research advisor...
  
  REAL UDSM DATA (Use this information when relevant):
  - Total Publications: ${realData.totalPublications}
  - Total Citations: ${realData.totalCitations}
  - Partner Institutions: ${realData.totalPartners}
  ...`;
}
```

### 2. Frontend Mock Data (Still exists but NOT used by AI)
The file `src/data/researchData.ts` contains mock data for:
- Dashboard visualizations
- Charts and graphs
- Demo purposes

**This is OK** - it's only for UI display, not AI responses.

---

## ⚠️ Important Notes

### The AI Will NOT Use Mock Data After Deployment

Once deployed, the AI will:
- ✅ Fetch real data from database on every request
- ✅ Use only actual numbers in responses
- ✅ Acknowledge when data is limited
- ✅ Never hallucinate statistics

### The Frontend Still Shows Mock Data

The dashboard charts and visualizations use `src/data/researchData.ts` for demo purposes. This is separate from the AI chatbot and is intentional for now.

---

## 🎯 Action Items

### Immediate (Do Now):
1. ✅ **Deploy the edge function**
   ```bash
   supabase functions deploy research-advisor
   ```

2. ✅ **Test the chatbot** with questions about UDSM metrics

3. ✅ **Verify** it uses real data or acknowledges limited data

### Short-term (Next Steps):
1. **Add real publications** to the database
   - Use ORCID sync feature
   - Manual entry via Supabase dashboard
   - Bulk import via SQL

2. **Add real researcher profiles**
   - Encourage faculty to sign up
   - Import from existing systems

3. **Update collaboration data**
   - Add actual partnership metrics
   - Link publications to partners

---

## 🐛 Troubleshooting

### Issue: Still seeing mock data after deployment
**Solution:**
```bash
# Force redeploy
supabase functions deploy research-advisor --no-verify-jwt

# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### Issue: "Error fetching real data"
**Solution:**
```bash
# Check logs
supabase functions logs research-advisor

# Verify database connection
supabase db remote status
```

### Issue: AI says "database is being populated"
**Solution:** This is correct! Add real data:
```sql
-- Check current data
SELECT COUNT(*) FROM researcher_publications;
SELECT COUNT(*) FROM partner_institutions;

-- Add sample publication
INSERT INTO researcher_publications (user_id, title, citations, year)
VALUES ('your-user-id', 'Sample Paper', 10, 2024);
```

---

## ✅ Success Criteria

After deployment, you should see:

✅ No more "156,789 citations"  
✅ No more "Prof. Mwangi" or fake names  
✅ No more "78.4 Global Impact Index"  
✅ Real numbers from your database  
✅ Or honest acknowledgment of limited data  

---

## 🚀 Ready to Fix?

**Run this command now:**
```bash
supabase functions deploy research-advisor
```

Then test at: http://localhost:8080

**Questions? Check the logs:**
```bash
supabase functions logs research-advisor --tail
```
