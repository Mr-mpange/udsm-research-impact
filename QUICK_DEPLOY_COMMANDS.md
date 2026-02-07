# Quick Deploy Commands - Copy & Paste

## 🚀 Deploy Edge Function in 5 Commands

Copy and paste these commands one by one in your terminal:

---

### 1️⃣ Install Supabase CLI
```bash
npm install -g supabase
```
⏱️ Takes 1-2 minutes

---

### 2️⃣ Login to Supabase
```bash
supabase login
```
⏱️ Opens browser, login, then return to terminal

---

### 3️⃣ Link Your Project
```bash
supabase link --project-ref jyxoltkvmtyfbfysbknb
```
⏱️ Enter your database password when asked

**Where to find password:**
- Dashboard: https://supabase.com/dashboard/project/jyxoltkvmtyfbfysbknb
- Settings → Database → Password

---

### 4️⃣ Deploy the Function
```bash
supabase functions deploy research-advisor
```
⏱️ Takes 30 seconds

**Expected output:**
```
✓ Deployed function research-advisor
Function URL: https://jyxoltkvmtyfbfysbknb.supabase.co/functions/v1/research-advisor
```

---

### 5️⃣ Set API Key

**If using Lovable:**
```bash
supabase secrets set LOVABLE_API_KEY=your_lovable_key_here
```

**If using Google Gemini:**
```bash
supabase secrets set GEMINI_API_KEY=your_gemini_key_here
```

⚠️ **Replace `your_..._key_here` with your actual API key!**

---

## ✅ Verify It Worked

### Check Dashboard:
1. Go to: https://supabase.com/dashboard/project/jyxoltkvmtyfbfysbknb
2. Click: **Edge Functions**
3. See: `research-advisor` with status **Active** ✅

### Test Chatbot:
1. Open: http://localhost:8081/
2. Click: Blue AI button (bottom-right)
3. Type: "Hello"
4. Get: AI response! 🎉

---

## 🆘 Troubleshooting

### If "command not found: supabase"
Use `npx` instead:
```bash
npx supabase login
npx supabase link --project-ref jyxoltkvmtyfbfysbknb
npx supabase functions deploy research-advisor
npx supabase secrets set LOVABLE_API_KEY=your_key
```

### If "password incorrect"
Reset password:
1. Dashboard → Settings → Database
2. Click "Reset Database Password"
3. Copy new password
4. Try again

### If deployment fails
Check you're in project root:
```bash
# Should see supabase/functions/ folder
dir supabase\functions
```

---

## 📝 All Commands (Copy All at Once)

```bash
# Install CLI
npm install -g supabase

# Login (opens browser)
supabase login

# Link project (enter password when asked)
supabase link --project-ref jyxoltkvmtyfbfysbknb

# Deploy function
supabase functions deploy research-advisor

# Set API key (choose one and replace with your key)
supabase secrets set LOVABLE_API_KEY=your_actual_key_here
```

---

## 🎯 Total Time: ~5 minutes

1. Install CLI: 1-2 min
2. Login: 30 sec
3. Link project: 30 sec
4. Deploy: 30 sec
5. Set key: 10 sec

**Then test the chatbot!** 🚀

---

## 💡 Need API Key First?

### Google Gemini (FREE):
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy key (starts with `AIza...`)

### Lovable Gateway:
1. Visit: https://lovable.dev
2. Sign up/login
3. Settings → API Keys
4. Generate key

---

**Ready? Start with command #1!** ⬆️
