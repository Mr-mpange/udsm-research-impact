# Test AI Chatbot - Complete Guide

## ✅ Prerequisites Check

Before testing, verify:
- [x] Dev server running at http://localhost:8081/ ✅
- [ ] Edge Function deployed to Supabase
- [ ] GEMINI_API_KEY added to Supabase secrets
- [ ] Browser open

---

## 🧪 Test Steps

### Step 1: Open the Application

1. **Open your browser**
2. **Go to:** http://localhost:8081/
3. **You should see:** The UDSM Research Intelligence Platform homepage

---

### Step 2: Find the AI Chatbot Button

Look for a **blue floating button** in the bottom-right corner of the screen.

```
                                    [💬]  ← Blue button with bot icon
                                          (bottom-right corner)
```

**If you don't see it:**
- Scroll down the page
- Check if it's hidden behind other elements
- Try refreshing the page (F5)

---

### Step 3: Open the Chatbot

1. **Click** the blue floating button
2. **A chat panel should appear** on the right side
3. **You should see:**
   ```
   ✨ AI Research Advisor
   
   🤖 Hello! I'm your Research Intelligence Advisor.
      I can help you analyze your publications, citations,
      and research impact. Ask me anything about your
      research data!
   
   [Type your message here...] [Send]
   ```

---

### Step 4: Test with Simple Questions

Try these questions one by one:

#### Test 1: Basic Greeting
**Type:** `Hello`
**Expected:** AI responds with a greeting

#### Test 2: Research Question
**Type:** `How is H-Index calculated?`
**Expected:** AI explains H-Index calculation

#### Test 3: Help Request
**Type:** `Can you help me improve my citation count?`
**Expected:** AI provides suggestions

#### Test 4: Data Analysis
**Type:** `What metrics should I track for my research?`
**Expected:** AI lists important metrics

---

## ✅ Success Indicators

### If It's Working:
- ✅ Chat panel opens when you click the button
- ✅ You see the welcome message
- ✅ You can type in the input field
- ✅ AI responds to your messages (may take 2-5 seconds)
- ✅ Responses appear word-by-word (streaming)
- ✅ No error messages

### Example Successful Response:
```
You: Hello

🤖 AI: Hello! I'm here to help you with your research 
      analysis. I can assist you with understanding 
      your H-Index, citation metrics, publication trends,
      and strategies to improve your research impact.
      What would you like to know?
```

---

## ❌ Common Issues & Solutions

### Issue 1: Button Not Visible
**Symptoms:** Can't find the blue floating button

**Solutions:**
- Refresh page (Ctrl+F5)
- Check bottom-right corner
- Scroll to bottom of page
- Try different browser

---

### Issue 2: Chat Opens But No Welcome Message
**Symptoms:** Panel opens but empty

**Solutions:**
- Check browser console (F12) for errors
- Refresh the page
- Clear browser cache

---

### Issue 3: Error Message Appears
**Symptoms:** See error like "Failed to get AI response"

**Possible Errors:**

#### Error: "GEMINI_API_KEY is not configured"
**Solution:**
1. Verify key is added in Supabase Dashboard
2. Check spelling: `GEMINI_API_KEY` (exact)
3. Wait 2-3 minutes for secrets to propagate
4. Redeploy Edge Function

#### Error: "AI gateway error"
**Solution:**
1. Check Gemini API key is valid
2. Verify key has no extra spaces
3. Check Gemini API quota (should be 60/min free)
4. Try generating a new key

#### Error: "Rate limit exceeded"
**Solution:**
- Wait 1 minute
- You've hit the free tier limit (60 requests/min)
- Try again

---

### Issue 4: No Response After Typing
**Symptoms:** Message sent but AI doesn't respond

**Solutions:**
1. **Check browser console (F12):**
   - Look for red errors
   - Check Network tab for failed requests

2. **Verify Edge Function:**
   - Go to: https://supabase.com/dashboard/project/jyxoltkvmtyfbfysbknb
   - Edge Functions → research-advisor
   - Check status is "Active"
   - Check logs for errors

3. **Test Edge Function directly:**
   ```bash
   curl -X POST \
     https://jyxoltkvmtyfbfysbknb.supabase.co/functions/v1/research-advisor \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"Hello"}]}'
   ```

---

### Issue 5: Slow Response
**Symptoms:** Takes 10+ seconds to respond

**Possible Causes:**
- First request (cold start) - normal
- Gemini API slow - wait and retry
- Network issues - check connection

**Normal Response Time:**
- First message: 3-10 seconds (cold start)
- Subsequent messages: 1-3 seconds

---

## 🔍 Debug Checklist

If chatbot doesn't work, check these in order:

### 1. Frontend (Browser)
- [ ] Dev server running (http://localhost:8081/)
- [ ] Blue button visible
- [ ] Chat panel opens
- [ ] No console errors (F12)

### 2. Edge Function (Supabase)
- [ ] Function deployed (check Dashboard)
- [ ] Status is "Active"
- [ ] No errors in logs
- [ ] Recent deployment time

### 3. API Key (Secrets)
- [ ] GEMINI_API_KEY exists in secrets
- [ ] Key is valid (starts with AIza)
- [ ] No extra spaces in key
- [ ] Key has API access enabled

### 4. Network
- [ ] Internet connection working
- [ ] Can access Supabase dashboard
- [ ] Can access Google AI Studio
- [ ] No firewall blocking requests

---

## 📊 Test Results Template

Copy this and fill it out:

```
## Test Results

Date: [Today's date]
Time: [Current time]

### Environment
- Dev Server: [ ] Running / [ ] Not running
- Browser: [Chrome/Firefox/Edge/etc.]
- URL: http://localhost:8081/

### Test 1: Button Visibility
- Blue button visible: [ ] Yes / [ ] No
- Location: [ ] Bottom-right / [ ] Other / [ ] Not found

### Test 2: Chat Panel
- Panel opens: [ ] Yes / [ ] No
- Welcome message: [ ] Yes / [ ] No
- Input field: [ ] Yes / [ ] No

### Test 3: AI Response
- Sent message: [What you typed]
- Got response: [ ] Yes / [ ] No
- Response time: [X seconds]
- Response quality: [ ] Good / [ ] Poor / [ ] Error

### Errors (if any)
[Paste any error messages here]

### Console Errors (F12)
[Paste any red errors from browser console]

### Edge Function Status
- Deployed: [ ] Yes / [ ] No
- Active: [ ] Yes / [ ] No
- Last deployed: [Time]

### API Key Status
- GEMINI_API_KEY set: [ ] Yes / [ ] No
- Key format: [ ] Correct (AIza...) / [ ] Wrong
```

---

## 🎯 Quick Test Script

**Do this in order:**

1. ✅ Open http://localhost:8081/
2. ✅ Click blue button (bottom-right)
3. ✅ Type: "Hello"
4. ✅ Press Send or Enter
5. ✅ Wait 3-5 seconds
6. ✅ Check if AI responds

**If all steps work → SUCCESS! 🎉**
**If any step fails → Note which step and check solutions above**

---

## 📸 What Success Looks Like

```
┌──────────────────────────────────────┐
│ ✨ AI Research Advisor        [×]    │
│ Powered by Google Gemini             │
├──────────────────────────────────────┤
│                                      │
│  🤖 Hello! I'm your Research         │
│     Intelligence Advisor...          │
│                                      │
│  👤 Hello                            │
│                                      │
│  🤖 Hello! I'm here to help you     │
│     with your research analysis.     │
│     I can assist you with...         │
│                                      │
├──────────────────────────────────────┤
│ Ask about research impact... [Send] │
└──────────────────────────────────────┘
```

---

## 🆘 Still Not Working?

### Share These Details:

1. **What step failed?** (Button not visible? No response? Error?)
2. **Error message?** (Copy exact text)
3. **Browser console errors?** (F12 → Console tab → copy red errors)
4. **Edge Function status?** (Active/Inactive in Dashboard)
5. **When did you deploy?** (How long ago?)

**I'll help you troubleshoot!**

---

## ✅ After Successful Test

Once it works:

1. **Try different questions:**
   - "What is citation impact?"
   - "How can I improve my H-Index?"
   - "Explain research metrics"

2. **Test conversation history:**
   - Ask multiple questions
   - Check if context is maintained

3. **Test edge cases:**
   - Very long questions
   - Multiple rapid messages
   - Special characters

---

**Ready to test? Open http://localhost:8081/ and follow the steps!** 🚀

Let me know the results!
