@echo off
echo ========================================
echo  Setting Gemini API Key in Supabase
echo ========================================
echo.

echo Your Gemini API Key: AIzaSyAWSIYXnhmoHDDVfPKfHABuhFrwaY5W8nA
echo.

echo Step 1: Linking to Supabase project...
call npx supabase link --project-ref jyxoltkvmtyfbfysbknb

echo.
echo Step 2: Setting GEMINI_API_KEY secret...
call npx supabase secrets set GEMINI_API_KEY=AIzaSyAWSIYXnhmoHDDVfPKfHABuhFrwaY5W8nA

echo.
echo Step 3: Deploying edge function with new key...
call npx supabase functions deploy research-advisor

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo The AI chatbot will now use your Gemini API key.
echo Test it at: http://localhost:8080
echo.
pause
