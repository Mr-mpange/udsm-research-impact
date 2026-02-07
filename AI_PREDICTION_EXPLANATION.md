# AI Prediction Feature - Complete Guide

## 🎯 What Does the AI Prediction Feature Do?

The AI Prediction feature in your UDSM Research Intelligence Platform provides **data-driven forecasting and strategic insights** to help researchers and institutions make informed decisions about their research direction, collaborations, and resource allocation.

---

## 🧠 Core AI Capabilities

### 1. **Citation Forecast (Next 5 Years)**
**What it does:**
- Predicts how many citations your publications will receive over the next 5 years
- Uses historical citation data and publication patterns to generate forecasts
- Shows confidence intervals (upper/lower bounds) to indicate prediction uncertainty

**How it helps:**
- Plan long-term research impact goals
- Identify if your current trajectory meets institutional targets
- Justify funding requests with projected impact metrics
- Compare predicted vs. actual performance over time

**Algorithm:**
```
- Analyzes historical growth rate from citation snapshots
- Calculates annual growth percentage (5%-50% range)
- Projects forward 5 years with increasing uncertainty
- Displays as interactive area chart with confidence bands
```

---

### 2. **Emerging Research Topics**
**What it does:**
- Identifies research areas showing high growth in your publication portfolio
- Analyzes journal distribution and publication frequency trends
- Calculates growth rates and confidence scores for each topic

**How it helps:**
- Discover which research areas are gaining momentum
- Allocate resources to high-growth topics
- Identify potential "hot topics" before they peak
- Adjust research strategy based on emerging trends

**Algorithm:**
```
- Groups publications by journal/topic
- Compares recent publications (last 2 years) vs. older ones
- Calculates growth rate: (recent - older) / older * 100
- Ranks topics by growth rate and confidence level
```

---

### 3. **Strategic Partner Recommendations**
**What it does:**
- Identifies potential collaborators based on research overlap
- Scores researchers/institutions by journal alignment
- Considers citation impact and research area synergy

**How it helps:**
- Find collaborators with complementary expertise
- Expand international research networks
- Increase chances of high-impact joint publications
- Build strategic partnerships for grant applications

**Algorithm:**
```
- Extracts your research areas (journals)
- Searches database for other researchers in same journals
- Scores by: journal overlap + citation count
- Ranks top 5 potential collaborators with match percentage
```

---

### 4. **Impact Simulator (What-If Scenarios)**
**What it does:**
- Simulates the impact of different research strategies
- Shows potential citation gains from various actions
- Provides "what-if" analysis for strategic planning

**Scenarios analyzed:**
1. **Increase Publication Rate +30%** → Shows potential citation boost
2. **Focus on High-Impact Journals** → Estimates Q1 journal impact
3. **Expand International Collaborations** → Projects global reach benefits

**How it helps:**
- Make data-driven decisions about research strategy
- Prioritize actions with highest potential impact
- Justify strategic investments to leadership
- Set realistic goals based on predicted outcomes

---

## 🤖 AI Research Advisor Chatbot

### What it does:
- **Interactive AI assistant** powered by Google Gemini AI
- Answers questions about UDSM research metrics in real-time
- Provides strategic insights and recommendations
- Saves conversation history for logged-in users

### Example Questions You Can Ask:
```
✓ "Which UDSM papers influence Europe most?"
✓ "Which topics should we invest in for 2027 impact?"
✓ "Suggest new collaboration targets in Asia."
✓ "What's our current Q1 publication trend?"
✓ "Which authors have the highest h-index growth?"
```

### How it helps:
- Get instant answers without manual data analysis
- Explore research data conversationally
- Receive personalized recommendations
- Access institutional knowledge 24/7

---

## 📊 Real Data Sources

The AI predictions use **real data** from your Supabase database:

1. **researcher_publications** table
   - Publication titles, years, journals
   - Citation counts per paper
   - Author information

2. **citation_snapshots** table
   - Historical citation tracking
   - Time-series data for trend analysis
   - Growth rate calculations

3. **profiles** table
   - Researcher affiliations
   - H-index and total citations
   - Institutional data

---

## 🎨 User Interface

### Dashboard Access:
1. Sign in to your account
2. Navigate to **Dashboard**
3. Click **"AI Predictions"** tab in the sidebar
4. View 4 interactive panels:
   - Citation Forecast (chart)
   - Emerging Topics (growth bars)
   - Partner Recommendations (match scores)
   - Impact Simulator (scenario cards)

### AI Advisor Access:
- **Floating blue button** in bottom-right corner (visible on all pages)
- Click to open chat interface
- Type questions or click suggested prompts
- View conversation history (if signed in)

---

## 🔬 Technical Implementation

### Frontend (React + TypeScript):
- **Component:** `src/components/PredictiveAnalytics.tsx`
- **Algorithms:** Client-side prediction calculations
- **Charts:** Recharts library for visualizations
- **State:** React hooks for data management

### Backend (Supabase Edge Function):
- **Function:** `supabase/functions/research-advisor/index.ts`
- **AI Model:** Google Gemini 3 Flash Preview
- **API:** Lovable AI Gateway
- **Streaming:** Real-time response streaming

### Database:
- **Tables:** researcher_publications, citation_snapshots, profiles
- **Queries:** Optimized for prediction algorithms
- **Real-time:** Live data updates

---

## 💡 Key Benefits

### For Individual Researchers:
✓ Predict future citation impact
✓ Identify trending research topics
✓ Find collaboration opportunities
✓ Plan career trajectory

### For Research Institutions:
✓ Strategic resource allocation
✓ Identify high-potential research areas
✓ Track institutional impact trends
✓ Support funding decisions

### For Administrators:
✓ Data-driven policy making
✓ Performance forecasting
✓ Partnership development
✓ Competitive analysis

---

## 🚀 How to Test

### Test Citation Forecast:
1. Add publications to your profile (with citation counts)
2. Navigate to Dashboard → AI Predictions
3. View the 5-year forecast chart
4. Check confidence intervals

### Test Emerging Topics:
1. Add publications in different journals
2. Vary publication years (recent vs. older)
3. View growth rate calculations
4. Check confidence scores

### Test Partner Recommendations:
1. Ensure other users have publications
2. Add publications in overlapping journals
3. View match percentages
4. Check recommendation reasons

### Test AI Advisor:
1. Click floating blue button (bottom-right)
2. Ask: "What's UDSM's global impact index?"
3. Try suggested questions
4. Test conversation history (if signed in)

---

## 📈 Sample Predictions

### Example Citation Forecast:
```
Year 2026: 1,234 citations (predicted)
Year 2027: 1,420 citations (+15% growth)
Year 2028: 1,633 citations (+15% growth)
Year 2029: 1,878 citations (+15% growth)
Year 2030: 2,160 citations (+15% growth)
```

### Example Emerging Topic:
```
Topic: "Nature Communications"
Growth Rate: +45%
Confidence: 87%
Reason: 3 recent papers vs. 1 older paper
```

### Example Partner Recommendation:
```
Institution: "Prof. John Smith"
Match Score: 92%
Reason: "5 shared research areas, 3,456 total citations"
```

---

## 🔧 Configuration

### Environment Variables Required:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_key
LOVABLE_API_KEY=your_lovable_key (for AI chat)
```

### Database Setup:
- Run migrations in `supabase/migrations/`
- Ensure tables have proper RLS policies
- Add sample data for testing

---

## 📝 Summary

The AI Prediction feature transforms raw research data into **actionable intelligence** through:

1. **Predictive Analytics** - Forecast future impact
2. **Trend Analysis** - Identify emerging opportunities
3. **Network Intelligence** - Find strategic partners
4. **Scenario Planning** - Simulate strategy outcomes
5. **Conversational AI** - Get instant insights

**Bottom Line:** It helps researchers and institutions make smarter, data-driven decisions about their research strategy, collaborations, and resource allocation.

---

## 🌐 Live Demo

**Server running at:** http://localhost:8081/

**Test it now:**
1. Sign in to your account
2. Go to Dashboard
3. Click "AI Predictions" tab
4. Explore the predictions!

---

*Generated: February 7, 2026*
*Platform: UDSM Research Intelligence Platform*
