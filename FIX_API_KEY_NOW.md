# Fix API Key - Quick Guide

## 🔍 Current Problem

You have `LOVABLE_API_KEY` set in Supabase, but the value is just "Lovable" which is **not a valid API key**.

A real API key should be much longer, like:
```
lv_1234567890abcdefghijklmnopqrstuvwxyz...  (40+ characters)
```

---

## ✅ Solution: Use Google Gemini (FREE)

I've updated the Edge Function to support **both** Gemini and Lovable. Let's use Gemini since it's free!

---

## 🚀 Step-by-Step Fix

### Step 1: Get Google Gemini API Key (5 minutes)

1. **Open this link:** https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click** "Create API Key" button
4. **Copy** the key (starts with `AIza...`)

**Example key:**
```
AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### Step 2: Add Key to Supabase (2 minutes)

1. **Go to:** https://supabase.com/dashboard/project/jyxoltkvmtyfbfysbknb
2. **Click:** Settings (left sidebar)
3. **Click:** Edge Functions
4. **Click:** Secrets tab
5. **Click:** "Add Secret" or "New Secret" button
6. **Fill in:**
   - Name: `GEMINI_API_KEY`
   - Value: Paste your Gemini key
7. **Click:** Save

---

### Step 3: Deploy Updated Edge Function (1 minute)

Open your terminal and run:

```bash
supabase functions deploy research-advisor
```

**If you haven't linked the project yet:**
```bash
supabase login
supabase link --project-ref jyxoltkvmtyfbfysbknb
supabase functions deploy research-advisor
```

---

### Step 4: Test the Chatbot (30 seconds)

1. **Open:** http://localhost:8081/
2. **Click:** Blue AI button (bottom-right)
3. **Type:** "Hello, can you help me?"
4. **See:** AI response! 🎉

---

## 🎯 What I Changed

### Before:
```typescript
// Only worked with Lovable
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
if (!LOVABLE_API_KEY) {
  throw new Error("LOVABLE_API_KEY is not configured");
}
```

### After:
```typescript
// Works with BOTH Gemini and Lovable
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

if (GEMINI_API_KEY) {
  // Use Gemini (FREE)
} else if (LOVABLE_API_KEY) {
  // Use Lovable (fallback)
}
```

**Now it tries Gemini first, then falls back to Lovable!**

---

## 📊 Visual Guide

### Current Secrets in Supabase:
```
❌ LOVABLE_API_KEY = "Lovable"  (Invalid - too short)
```

### After You Add Gemini:
```
✅ GEMINI_API_KEY = "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  (Valid!)
❌ LOVABLE_API_KEY = "Lovable"  (Still invalid, but not used)
```

---

## 🆘 Troubleshooting

### Issue 1: "Cannot find Gemini API key page"
**Solution:**
- Make sure you're signed in to Google
- Try this direct link: https://aistudio.google.com/app/apikey
- Or search "Google AI Studio API key"

### Issue 2: "Gemini API key not working"
**Check:**
- Key starts with `AIza`
- Key is 39 characters long
- No extra spaces when pasting
- Wait 1-2 minutes after adding secret

### Issue 3: "Deployment failed"
**Solution:**
```bash
# Make sure you're in project root
cd path/to/your/project

# Try with npx
npx supabase functions deploy research-advisor
```

### Issue 4: "Still getting errors in chatbot"
**Check:**
1. Gemini key is added in Supabase Dashboard
2. Edge Function is deployed (check Dashboard → Edge Functions)
3. Wait 2-3 minutes for changes to propagate
4. Refresh your browser (Ctrl+F5)

---

## ✅ Quick Checklist

- [ ] Got Gemini API key from Google
- [ ] Added `GEMINI_API_KEY` secret in Supabase
- [ ] Deployed Edge Function with `supabase functions deploy`
- [ ] Tested chatbot at http://localhost:8081/
- [ ] Chatbot responds successfully!

---

## 💡 Why Gemini Instead of Lovable?

| Feature | Google Gemini | Lovable Gateway |
|---------|--------------|-----------------|
| **Cost** | FREE | Paid |
| **Free Tier** | 60 requests/min | Unknown |
| **Setup** | Easy | Requires account |
| **Quality** | Excellent | Excellent |
| **Speed** | Fast | Fast |

**Gemini is free and works great!**

---

## 🎯 Summary

**What you need to do:**

1. ✅ Get Gemini key: https://makersuite.google.com/app/apikey
2. ✅ Add to Supabase: Settings → Edge Functions → Secrets
3. ✅ Deploy: `supabase functions deploy research-advisor`
4. ✅ Test: Click blue AI button

**Total time: ~10 minutes**

---

## 📝 Copy-Paste Commands

```bash
# If not logged in yet
supabase login
supabase link --project-ref jyxoltkvmtyfbfysbknb

# Deploy the updated function
supabase functions deploy research-advisor

# Verify deployment
# Go to: https://supabase.com/dashboard/project/jyxoltkvmtyfbfysbknb
# Check: Edge Functions → research-advisor should be Active
```

---

## 🎉 After Setup

Your chatbot will:
- ✅ Use Google Gemini AI (free)
- ✅ Answer questions about research
- ✅ Help analyze your data
- ✅ Provide research insights
- ✅ Work without any fake UDSM data

**Ready to fix it? Start with Step 1!** 🚀
