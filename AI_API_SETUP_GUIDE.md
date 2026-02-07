# AI API Setup Guide - Gemini & Alternatives

## 🤖 Current Situation

Your AI chatbot uses **Lovable AI Gateway** which provides access to Google Gemini AI, but the API key is **NOT configured** yet.

### What's Missing:
```env
# This is missing from your .env file:
LOVABLE_API_KEY=your_key_here
```

### Where It's Used:
- **AI Research Advisor chatbot** (blue floating button)
- Supabase Edge Function: `supabase/functions/research-advisor/index.ts`
- Model: Google Gemini 3 Flash Preview

---

## 🔑 Option 1: Use Lovable AI Gateway (Current Setup)

### What is Lovable AI Gateway?
- Managed AI service by Lovable.dev
- Provides access to multiple AI models (Gemini, GPT, Claude)
- Handles authentication, rate limiting, billing
- Easiest option if you have a Lovable account

### How to Get API Key:
1. Go to https://lovable.dev
2. Sign up or log in to your account
3. Navigate to Settings → API Keys
4. Generate a new API key
5. Copy the key

### How to Configure:
```bash
# Add to Supabase Edge Function secrets (not .env)
# This needs to be set in Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/jyxoltkvmtyfbfysbknb
2. Click: Settings → Edge Functions → Secrets
3. Add secret: LOVABLE_API_KEY = your_key_here
4. Save
```

### Cost:
- Check Lovable.dev pricing
- Usually pay-per-use or subscription
- Free tier may be available

---

## 🔑 Option 2: Use Google Gemini API Directly (Recommended)

### Why Direct Gemini?
- ✅ Free tier available (60 requests/minute)
- ✅ No middleman (Lovable gateway)
- ✅ Direct from Google
- ✅ More control

### How to Get Gemini API Key:
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### Update Edge Function:


Replace the Edge Function code with direct Gemini API:

```typescript
// supabase/functions/research-advisor/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Convert messages to Gemini format
    const userMessage = messages[messages.length - 1].content;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Research advisor error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

### Configure in Supabase:
```bash
# Add to Supabase Edge Function secrets:
GEMINI_API_KEY = your_google_api_key_here
```

---

## 🔑 Option 3: Use OpenAI GPT API

### How to Get OpenAI API Key:
1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key

### Update Edge Function:

```typescript
// supabase/functions/research-advisor/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Research advisor error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

### Cost:
- GPT-3.5-Turbo: ~$0.002 per 1K tokens
- GPT-4: ~$0.03 per 1K tokens
- Free trial credits available

---

## 🔑 Option 4: Use Anthropic Claude API

### How to Get Claude API Key:
1. Go to: https://console.anthropic.com/
2. Sign up for API access
3. Generate API key
4. Copy the key

### Update Edge Function:

```typescript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-3-sonnet-20240229",
    messages: messages,
    max_tokens: 1024,
    stream: true,
  }),
});
```

---

## 🆓 Option 5: Free Alternatives (No API Key Needed)

### A. Use Ollama (Local AI)
Run AI models locally on your machine:

```bash
# Install Ollama
# Windows: Download from https://ollama.ai

# Run a model
ollama run llama2

# Create local API endpoint
# Update Edge Function to point to: http://localhost:11434/api/chat
```

### B. Use Hugging Face Inference API
Free tier available:

```typescript
const response = await fetch(
  "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
  {
    headers: { Authorization: `Bearer ${HF_API_KEY}` },
    method: "POST",
    body: JSON.stringify({ inputs: userMessage }),
  }
);
```

Get free API key: https://huggingface.co/settings/tokens

---

## 📊 Comparison Table

| Option | Cost | Setup Difficulty | Performance | Free Tier |
|--------|------|------------------|-------------|-----------|
| Lovable Gateway | $$ | Easy | Excellent | Maybe |
| Google Gemini | Free/$ | Easy | Excellent | ✅ Yes |
| OpenAI GPT | $$ | Easy | Excellent | Trial |
| Anthropic Claude | $$ | Easy | Excellent | Limited |
| Ollama (Local) | Free | Medium | Good | ✅ Yes |
| Hugging Face | Free/$ | Easy | Good | ✅ Yes |

---

## 🚀 Quick Start: Google Gemini (Recommended)

### Step 1: Get API Key
```
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
```

### Step 2: Add to Supabase
```
1. Go to: https://supabase.com/dashboard/project/jyxoltkvmtyfbfysbknb
2. Settings → Edge Functions → Secrets
3. Add: GEMINI_API_KEY = your_key_here
4. Save
```

### Step 3: Update Edge Function
I can help you update the code to use Gemini directly if you want!

### Step 4: Test
```
1. Open http://localhost:8081/
2. Click blue AI chat button
3. Ask: "What's UDSM's global impact?"
4. Should get AI response
```

---

## 🔧 Current Status

### What Works WITHOUT AI API:
✅ H-Index chart (uses database)
✅ AI Predictions (client-side algorithms)
✅ Citation forecasts (calculated locally)
✅ Emerging topics (analyzed from your data)
✅ Partner recommendations (database queries)
✅ All dashboard features

### What NEEDS AI API:
❌ AI Chatbot (blue floating button)
❌ Conversational Q&A
❌ Natural language queries

---

## 💡 My Recommendation

**Use Google Gemini API directly:**

### Why?
1. ✅ **Free tier** - 60 requests/minute
2. ✅ **No middleman** - Direct from Google
3. ✅ **Easy setup** - Just need API key
4. ✅ **Good performance** - Fast responses
5. ✅ **Reliable** - Google infrastructure

### Steps:
1. Get Gemini API key (5 minutes)
2. Add to Supabase secrets (2 minutes)
3. I'll update the Edge Function code (1 minute)
4. Test the chatbot (1 minute)

**Total time: ~10 minutes**

---

## 🆘 Need Help?

Let me know which option you want to use and I can:
1. Update the Edge Function code
2. Help configure the API keys
3. Test the integration
4. Debug any issues

**Which AI API would you like to use?**
- Google Gemini (recommended, free)
- OpenAI GPT (paid, excellent)
- Keep Lovable Gateway (if you have account)
- Local Ollama (free, runs on your PC)
- Other?

---

*Note: The AI chatbot is optional. All core features (predictions, analytics, charts) work without it!*
