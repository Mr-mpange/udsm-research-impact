@echo off
echo ========================================
echo  Setup New Supabase Project
echo ========================================
echo.
echo Project ID: zuqothviduizwcbawigy
echo.

echo Step 1: Login to Supabase...
call npx supabase login

echo.
echo Step 2: Link to new project...
call npx supabase link --project-ref zuqothviduizwcbawigy

echo.
echo Step 3: Run database migrations...
call npx supabase db push

echo.
echo Step 4: Set Gemini API key...
call npx supabase secrets set GEMINI_API_KEY=AIzaSyAWSIYXnhmoHDDVfPKfHABuhFrwaY5W8nA

echo.
echo Step 5: Deploy edge functions...
call npx supabase functions deploy research-advisor
call npx supabase functions deploy orcid-sync
call npx supabase functions deploy citation-updater

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next: Update .env with correct anon key from:
echo https://supabase.com/dashboard/project/zuqothviduizwcbawigy/settings/api
echo.
pause
