# 🔑 Setup Gemini API Key

## Your Gemini API Key
```
AIzaSyAWSIYXnhmoHDDVfPKfHABuhFrwaY5W8nA
```

## Steps to Configure

### 1. Link to Supabase Project
```bash
npx supabase link --project-ref jyxoltkvmtyfbfysbknb
```

### 2. Set the Gemini API Key as a Secret
```bash
npx supabase secrets set GEMINI_API_KEY=AIzaSyAWSIYXnhmoHDDVfPKfHABuhFrwaY5W8nA
```

### 3. Deploy the Edge Function
```bash
npx supabase functions deploy research-advisor
```

### 4. Test the Chatbot
Open http://localhost:8080 and click the AI chatbot button.

## That's it!

The AI will now use your Gemini API key and real database data.
