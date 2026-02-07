# Quick Test Guide: AI Predictions

## 🚀 Your dev server is running at: http://localhost:8081/

---

## ✅ Test Checklist

### 1. Test Citation Forecast
- [ ] Sign in to your account
- [ ] Go to Dashboard → AI Predictions tab
- [ ] Check if the **Citation Forecast** chart appears
- [ ] Verify it shows 5-year projection (2026-2030)
- [ ] Look for confidence bands (upper/lower bounds)
- [ ] Hover over chart to see tooltip with values

**Expected Result:** Interactive area chart with blue gradient showing predicted citations

---

### 2. Test Emerging Topics
- [ ] Scroll to **Emerging Research Topics** panel
- [ ] Check if topics are listed with growth rates
- [ ] Verify confidence percentages (0-100%)
- [ ] Look for animated progress bars

**Expected Result:** List of research topics with growth rates like "+45% growth"

---

### 3. Test Partner Recommendations
- [ ] Find **Strategic Partner Recommendations** panel
- [ ] Check if collaborators are suggested
- [ ] Verify match scores (percentage)
- [ ] Read recommendation reasons

**Expected Result:** List of potential collaborators with match percentages

---

### 4. Test Impact Simulator
- [ ] Locate **Impact Simulator** panel (gold border)
- [ ] Check 3 scenarios:
  - Increase Publication Rate +30%
  - Focus on High-Impact Journals
  - Expand International Collaborations
- [ ] Verify each shows potential citation impact

**Expected Result:** 3 scenario cards with predicted citation gains

---

### 5. Test AI Advisor Chatbot
- [ ] Click the **blue floating button** (bottom-right corner)
- [ ] Chat panel should open
- [ ] Try asking: "What's UDSM's global impact index?"
- [ ] Expected answer: "78.4"
- [ ] Try: "Which countries engage most with UDSM research?"
- [ ] Expected: List of China, USA, UK, India, South Africa
- [ ] Click suggested questions
- [ ] Check if responses stream in real-time

**Expected Result:** AI responds with UDSM research data and insights

---

### 6. Test Chat History (If Signed In)
- [ ] In chat panel, click **History icon** (top-right)
- [ ] Check if previous conversations are saved
- [ ] Click a conversation to load it
- [ ] Click "New Conversation" button

**Expected Result:** Saved conversations appear in history panel

---

## 🎯 What Each Feature Does

### Citation Forecast
**Purpose:** Predicts how many citations you'll get in the next 5 years
**Helps with:** Planning research goals, justifying funding, tracking progress

### Emerging Topics
**Purpose:** Identifies which research areas are growing fastest
**Helps with:** Resource allocation, spotting trends, strategic planning

### Partner Recommendations
**Purpose:** Suggests collaborators based on research overlap
**Helps with:** Building networks, finding co-authors, expanding reach

### Impact Simulator
**Purpose:** Shows "what-if" scenarios for different strategies
**Helps with:** Decision making, prioritizing actions, setting goals

### AI Advisor
**Purpose:** Answers questions about research data instantly
**Helps with:** Quick insights, data exploration, strategic advice

---

## 🔍 Sample Questions for AI Advisor

Try these questions to test the AI:

```
1. "What's UDSM's total citation count?"
   → Should answer: 156,789

2. "Which research theme has the most papers?"
   → Should answer: Health Sciences (678 papers)

3. "What's the H-Index growth rate?"
   → Should answer: 12.5%

4. "Which countries read UDSM papers most?"
   → Should list: China, USA, UK, India, South Africa

5. "What are the emerging topics for 2025-2027?"
   → Should mention: AI in Healthcare, Climate Adaptation, etc.

6. "Who are the top UDSM authors?"
   → Should list: Prof. Amani Mwangi, Prof. Joseph Kimathi, etc.

7. "What percentage of papers are Q1?"
   → Should answer: 28% (423 papers)

8. "Suggest collaboration partners"
   → Should mention: NUS Singapore, ETH Zurich, University of Tokyo
```

---

## 🐛 Troubleshooting

### No predictions showing?
- Check if you have publications added to your profile
- Verify database connection (check .env file)
- Look for errors in browser console (F12)

### AI Advisor not responding?
- Check if LOVABLE_API_KEY is set in Supabase
- Verify internet connection
- Check browser console for errors

### Charts not rendering?
- Ensure you have citation data in database
- Check if Recharts library is installed
- Verify browser supports modern JavaScript

---

## 📊 Expected Data Flow

```
User Profile
    ↓
Publications Table
    ↓
Citation Snapshots
    ↓
AI Algorithms
    ↓
Predictions Display
```

---

## 🎨 Visual Indicators

- **Blue gradient** = Citation forecast
- **Green text** = Growth/positive trends
- **Purple icon** = Partner recommendations
- **Gold border** = Impact simulator
- **Floating blue button** = AI chat

---

## ✨ Success Criteria

You'll know it's working when:
✓ Charts render smoothly
✓ Growth rates show percentages
✓ Match scores appear for partners
✓ AI responds to questions
✓ Data updates in real-time
✓ No console errors

---

**Ready to test? Open http://localhost:8081/ and start exploring!**
