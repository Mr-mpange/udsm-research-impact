# 🚀 Deploy AI with Real Data - Step by Step

## Issue: Access Denied

You're getting an access error because you need to login to Supabase CLI first.

---

## ✅ Solution: Login First, Then Deploy

### Step 1: Login to Supabase
```bash
npx supabase login
```

This will:
- Open your browser
- Ask you to authorize the CLI
- Generate an access token

### Step 2: Link Your Project
```bash
npx supabase link --project-ref jyxoltkvmtyfbfysbknb
```

When prompted for database password, enter your Supabase database password.

### Step 3: Set Gemini API Key
```bash
npx supabase secrets set GEMINI_API_KEY=AIzaSyAWSIYXnhmoHDDVfPKfHABuhFrwaY5W8nA
```

### Step 4: Deploy Edge Function
```bash
npx supabase functions deploy research-advisor
```

---

## 🎯 Alternative: Deploy via Supabase Dashboard

If CLI doesn't work, you can deploy manually:

### Option A: Set Secret via Dashboard

1. Go to: https://supabase.com/dashboard/project/jyxoltkvmtyfbfysbknb/settings/vault
2. Click "New Secret"
3. Name: `GEMINI_API_KEY`
4. Value: `AIzaSyAWSIYXnhmoHDDVfPKfHABuhFrwaY5W8nA`
5. Click "Add Secret"

### Option B: Deploy Function via Dashboard

1. Go to: https://supabase.com/dashboard/project/jyxoltkvmtyfbfysbknb/functions
2. Click "Deploy a new function"
3. Name: `research-advisor`
4. Copy the code from: `supabase/functions/research-advisor/index.ts`
5. Click "Deploy"

---

## 🔍 What This Will Fix

Once deployed, the AI will:
- ✅ Use your Gemini API key (no more Lovable credits needed)
- ✅ Fetch real data from your database
- ✅ Stop using mock data (156,789 citations, etc.)
- ✅ Show actual partner institutions
- ✅ Display real publication counts

---

## 🧪 Test After Deployment

1. Open: http://localhost:8080
2. Click the AI chatbot button (bottom-right)
3. Ask: "Tell me about UDSM's research metrics"
4. Expected: Real data from database or acknowledgment of limited data
5. NOT expected: "156,789 citations" or fake statistics

---

## ⚡ Quick Start

Run these commands one by one:

```bash
# 1. Login
npx supabase login

# 2. Link project (enter your DB password when asked)
npx supabase link --project-ref jyxoltkvmtyfbfysbknb

# 3. Set API key
npx supabase secrets set GEMINI_API_KEY=AIzaSyAWSIYXnhmoHDDVfPKfHABuhFrwaY5W8nA

# 4. Deploy
npx supabase functions deploy research-advisor

# 5. Verify
npx supabase functions list
```

---

## 🐛 Troubleshooting

### "Access denied" error
**Solution:** Run `npx supabase login` first

### "Database password required"
**Solution:** Get it from Supabase dashboard → Settings → Database

### "Function already exists"
**Solution:** That's OK! It will update the existing function

### Still seeing mock data after deploy
**Solution:** 
- Clear browser cache (Ctrl+Shift+R)
- Wait 1-2 minutes for deployment to propagate
- Check logs: `npx supabase functions logs research-advisor`

---

## 📞 Need Help?

If CLI doesn't work, use the **Dashboard method** above - it's easier and works the same way!
