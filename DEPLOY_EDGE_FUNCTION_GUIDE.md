# Deploy Edge Function - Step by Step Guide

## 🎯 What We're Doing

We need to:
1. Install Supabase CLI
2. Login to Supabase
3. Link your project
4. Deploy the Edge Function
5. Set the API key

---

## � Prerequisites

### Get an API Key First:

**Option 1: Google Gemini (FREE - Recommended)**
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

**Option 2: Lovable AI Gateway**
1. Go to: https://lovable.dev
2. Sign up/login
3. Settings → API Keys
4. Generate key

---

## 🚀 Step-by-Step Deployment

### Step 1: Install Supabase CLI

Open your terminal (Command Prompt or PowerShell) and run:

```bash
npm install -g supabase
```

**Wait for it to finish installing...**

---

### Step 2: Login to Supabase

```bash
supabase login
```

**What happens:**
- Opens browser for authentication
- Login with your Supabase account
- Returns to terminal when done

---

### Step 3: Link Your Project

```bash
supabase link --project-ref jyxoltkvmtyfbfysbknb
```

**What it asks:**
- Database password (from your Supabase project settings)

**Where to find password:**
1. Go to: https://supabase.com/dashboard/project/jyxoltkvmtyfbfysbknb
2. Settings → Database
3. Copy the password (or reset if forgotten)

---

### Step 4: Deploy the Edge Function

```bash
supabase functions deploy research-advisor
```

**What happens:**
- Uploads the code from `supabase/functions/research-advisor/`
- Deploys to Supabase servers
- Returns a URL when done

**Expected output:**
```
Deploying function research-advisor...
Function URL: https://jyxoltkvmtyfbfysbknb.supabase.co/functions/v1/research-advisor
Deployed successfully!
```

---

### Step 5: Set the API Key

**If using Google Gemini:**
```bash
supabase secrets set GEMINI_API_KEY=your_gemini_key_here
```

**If using Lovable Gateway:**
```bash
supabase secrets set LOVABLE_API_KEY=your_lovable_key_here
```

**Replace `your_..._key_here` with your actual API key!**

---

## ✅ Verify Deployment

### Check if it worked:

1. Go to: https://supabase.com/dashboard/project/jyxoltkvmtyfbfysbknb
2. Click: **Edge Functions** (left sidebar)
3. You should see: `research-advisor` function listed
4. Status should be: **Active** ✅

---

## 🧪 Test the Chatbot

1. Open: http://localhost:8081/
2. Click the **blue AI chat button** (bottom-right)
3. Type: "Hello, can you help me?"
4. You should get an AI response!

---

## 🔧 If Using Google Gemini Instead

If you want to use Google Gemini API instead of Lovable, you need to update the Edge Function code first.

### Update the Code:

I can help you change the Edge Function to use Gemini directly. Just let me know!

**Changes needed:**
1. Update API endpoint
2. Change request format
3. Update secret name

---

## 📊 Complete Command Summary

```bash
# 1. Install CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link project
supabase link --project-ref jyxoltkvmtyfbfysbknb

# 4. Deploy function
supabase functions deploy research-advisor

# 5. Set API key (choose one)
supabase secrets set LOVABLE_API_KEY=your_key_here
# OR
supabase secrets set GEMINI_API_KEY=your_key_here
```

---

## ⚠️ Common Issues

### Issue 1: "Command not found: supabase"
**Solution:** 
```bash
# Try with npx
npx supabase login
npx supabase link --project-ref jyxoltkvmtyfbfysbknb
npx supabase functions deploy research-advisor
```

### Issue 2: "Database password incorrect"
**Solution:**
1. Go to Supabase Dashboard
2. Settings → Database
3. Click "Reset Database Password"
4. Use the new password

### Issue 3: "Function deployment failed"
**Solution:**
- Check internet connection
- Verify you're in the project root directory
- Make sure `supabase/functions/research-advisor/index.ts` exists

### Issue 4: "API key not working"
**Solution:**
- Verify the key is correct
- Check if you set the right secret name (LOVABLE_API_KEY or GEMINI_API_KEY)
- Wait 1-2 minutes for secrets to propagate

---

## 🎯 Alternative: Use Supabase Dashboard

If CLI doesn't work, you can deploy via Dashboard:

### Step 1: Go to Dashboard
https://supabase.com/dashboard/project/jyxoltkvmtyfbfysbknb

### Step 2: Edge Functions
Click "Edge Functions" in left sidebar

### Step 3: Create Function
1. Click "Create a new function"
2. Name: `research-advisor`
3. Copy-paste code from `supabase/functions/research-advisor/index.ts`
4. Click "Deploy"

### Step 4: Set Secrets
1. Go to: Settings → Edge Functions → Secrets
2. Add secret: `LOVABLE_API_KEY` or `GEMINI_API_KEY`
3. Paste your API key
4. Save

---

## � Which Method Should You Use?

### CLI Method (Recommended):
✅ Faster for updates
✅ Can deploy from terminal
✅ Better for development
❌ Requires CLI installation

### Dashboard Method:
✅ No installation needed
✅ Visual interface
✅ Good for one-time setup
❌ Slower for updates

---

## 🚀 Quick Start (Copy-Paste)

Open your terminal in the project folder and run these commands one by one:

```bash
# Install CLI
npm install -g supabase

# Login (opens browser)
supabase login

# Link project (enter password when asked)
supabase link --project-ref jyxoltkvmtyfbfysbknb

# Deploy function
supabase functions deploy research-advisor

# Set API key (replace with your actual key)
supabase secrets set LOVABLE_API_KEY=your_actual_key_here
```

---

## ✅ Success Checklist

After running all commands, verify:

- [ ] CLI installed successfully
- [ ] Logged in to Supabase
- [ ] Project linked
- [ ] Function deployed (check dashboard)
- [ ] API key set (check secrets in dashboard)
- [ ] Chatbot responds when tested

---

## 🆘 Need Help?

**If you get stuck:**
1. Share the error message
2. Tell me which step failed
3. I'll help you troubleshoot!

**Want to use Gemini instead of Lovable?**
- Let me know and I'll update the Edge Function code for you

---

## 📝 Summary

**To answer your question:**
- ❌ Cannot use SQL Editor for Edge Functions
- ✅ Must use Supabase CLI or Dashboard
- ✅ Commands provided above will work
- ✅ Takes about 5-10 minutes total

**Ready to deploy? Start with Step 1!** 🚀
