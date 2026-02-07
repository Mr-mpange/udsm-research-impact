# Quick Test Checklist ✅

## 🚀 Test Your AI Chatbot in 5 Steps

### Step 1: Open Application
```
Open: http://localhost:8081/
Status: [ ] Done
```

### Step 2: Find Blue Button
```
Look: Bottom-right corner
See: Blue floating button with bot icon 💬
Status: [ ] Found / [ ] Not found
```

### Step 3: Open Chat
```
Click: Blue button
See: Chat panel appears on right
Status: [ ] Opened / [ ] Error
```

### Step 4: Send Message
```
Type: "Hello"
Press: Enter or Send button
Status: [ ] Sent
```

### Step 5: Check Response
```
Wait: 3-5 seconds
See: AI responds with text
Status: [ ] Working ✅ / [ ] Error ❌
```

---

## ✅ If All Steps Work:

**SUCCESS!** Your AI chatbot is working! 🎉

Try these questions:
- "How is H-Index calculated?"
- "What metrics should I track?"
- "Help me improve my citations"

---

## ❌ If Something Failed:

### Button Not Found?
- Refresh page (Ctrl+F5)
- Check bottom-right corner
- Scroll to bottom

### Chat Opens But No Response?
1. Open browser console (F12)
2. Look for red errors
3. Share the error message

### Error Message Appears?
**Copy the exact error and share it**

Common errors:
- "GEMINI_API_KEY is not configured" → Check Supabase secrets
- "AI gateway error" → Check API key is valid
- "Rate limit exceeded" → Wait 1 minute

---

## 🔍 Quick Debug

### Check These:
1. Dev server running? → http://localhost:8081/ loads?
2. Edge Function deployed? → Check Supabase Dashboard
3. API key added? → Check Supabase → Settings → Secrets
4. Waited 2-3 minutes? → Secrets need time to propagate

---

## 📝 Test Results

**Fill this out:**

```
Date: ___________
Time: ___________

✅ Step 1 (Open app): [ ] Pass / [ ] Fail
✅ Step 2 (Find button): [ ] Pass / [ ] Fail  
✅ Step 3 (Open chat): [ ] Pass / [ ] Fail
✅ Step 4 (Send message): [ ] Pass / [ ] Fail
✅ Step 5 (Get response): [ ] Pass / [ ] Fail

Error (if any): _______________________

Overall: [ ] Working ✅ / [ ] Not working ❌
```

---

## 🎯 What to Share If It Doesn't Work

1. Which step failed? (1, 2, 3, 4, or 5)
2. Error message? (exact text)
3. Browser console errors? (F12 → Console)
4. Edge Function status? (Active/Inactive)

---

**Start testing now!** Open http://localhost:8081/ 🚀
