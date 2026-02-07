@echo off
echo ========================================
echo  Deploying AI Chatbot with Real Data
echo ========================================
echo.

echo Step 1: Linking to Supabase project...
call npx supabase link --project-ref jyxoltkvmtyfbfysbknb

echo.
echo Step 2: Deploying research-advisor edge function...
call npx supabase functions deploy research-advisor

echo.
echo Step 3: Checking deployment status...
call npx supabase functions list

echo.
echo ========================================
echo  Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Test the chatbot at your app URL
echo 2. Ask: "Tell me about UDSM's research metrics"
echo 3. Verify it uses real data from your database
echo.
echo To view logs:
echo   npx supabase functions logs research-advisor
echo.
pause
