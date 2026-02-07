# 🚀 Deploy AI Chatbot with Real Data Integration

## ✅ What Was Fixed

The AI chatbot was using mock/fake data in responses. Now it's been updated to:

1. **Fetch real data from Supabase database** before each response
2. **Include actual metrics** in the AI context (publications, citations, partners, etc.)
3. **Prevent hallucination** by instructing AI to use ONLY real data
4. **Gracefully handle empty database** by acknowledging limited data

---

## 📊 Real Data Sources

The AI now fetches and uses:

- ✅ **Total Publications** from `researcher_publications` table
- ✅ **Total Citations** (sum of all publication citations)
- ✅ **Average Citations per Paper**
- ✅ **Active Researchers** from `profiles` table
- ✅ **Partner Institutions** from `partner_institutions` table
- ✅ **Top 5 Partners** with collaboration data

---

## 🔧 How It Works

### Before (Mock Data):
```
AI: "UDSM has 156,789 citations across 4,523 papers..." ❌ FAKE
```

### After (Real Data):
```
AI: "Based on our database, UDSM currently has 8 partner institutions 
including University of Cape Town, Oxford University..." ✅ REAL
```

---

## 📝 Deployment Steps

### 1. Deploy the Updated Edge Function

```bash
# Deploy the research-advisor function with real data integration
supabase functions deploy research-advisor
```

### 2. Verify Environment Variables

Make sure these are set in Supabase:

```bash
# Check secrets
supabase secrets list

# Required secrets:
# - SUPABASE_URL (auto-set)
# - SUPABASE_SERVICE_ROLE_KEY (auto-set)
# - LOVABLE_API_KEY or GEMINI_API_KEY (for AI)
```

### 3. Test the Updated Function

```bash
# Run the test script
node test-ai-chatbot.js
```

Or test manually:
1. Open http://localhost:8080
2. Click the AI chatbot button (bottom-right)
3. Ask: "Tell me about UDSM's research metrics"
4. Verify it uses real numbers from your database

---

## 🎯 Expected Behavior

### If Database Has Data:
```
User: "How many publications does UDSM have?"

AI: "Based on our current database, UDSM has [X] publications 
with a total of [Y] citations, averaging [Z] citations per paper. 
We're actively collaborating with [N] partner institutions..."
```

### If Database Is Empty:
```
User: "How many publications does UDSM have?"

AI: "The database is currently being populated with research data. 
While I don't have specific numbers yet, I can help you understand 
how to track and improve your research metrics..."
```

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] AI responds without errors
- [ ] AI mentions actual database numbers (not mock data)
- [ ] If database is empty, AI acknowledges it gracefully
- [ ] No made-up statistics like "156,789 citations"
- [ ] Partner institution names match your database
- [ ] Response is relevant and helpful

---

## 📈 Adding Real Data

To populate the database with real research data:

### Option 1: Manual Entry
1. Go to Supabase Dashboard → Table Editor
2. Add publications to `researcher_publications`
3. Add partners to `partner_institutions`

### Option 2: Bulk Import
```sql
-- Example: Insert publications
INSERT INTO researcher_publications (user_id, title, doi, citations, year)
VALUES 
  ('user-uuid', 'Research Paper Title', '10.1234/example', 45, 2024),
  ('user-uuid', 'Another Paper', '10.1234/example2', 32, 2023);

-- Example: Insert partners (already done in migration)
-- See: supabase/migrations/20260206160009_add_partner_institutions.sql
```

### Option 3: ORCID Sync
Use the ORCID sync feature in the app to automatically import publications from researcher ORCID profiles.

---

## 🐛 Troubleshooting

### Issue: AI still uses mock data
**Solution:** Redeploy the edge function
```bash
supabase functions deploy research-advisor --no-verify-jwt
```

### Issue: "Error fetching real data"
**Solution:** Check database permissions and RLS policies
```bash
# View logs
supabase functions logs research-advisor
```

### Issue: Empty response
**Solution:** Verify API keys are set
```bash
supabase secrets list
```

---

## 🎉 Benefits

✅ **Accurate Information** - No more fake statistics  
✅ **Trust & Credibility** - Users see real institutional data  
✅ **Dynamic Updates** - AI context updates as database grows  
✅ **Transparent** - AI acknowledges when data is limited  
✅ **Scalable** - Automatically includes new data as it's added  

---

## 📚 Next Steps

1. **Deploy the function** using the command above
2. **Test thoroughly** with various questions
3. **Populate database** with real research data
4. **Monitor usage** via Supabase logs
5. **Collect feedback** from researchers

---

**Ready to deploy? Run:**
```bash
supabase functions deploy research-advisor
```

Then test at: http://localhost:8080 (or your production URL)
