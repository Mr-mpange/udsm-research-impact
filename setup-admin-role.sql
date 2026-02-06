-- Setup Admin Role for UDSM Research Platform
-- Run this in your Supabase SQL Editor after creating your user account

-- Step 1: Find your user ID
-- Go to Supabase Dashboard → Authentication → Users
-- Copy your User ID from the list

-- Step 2: Replace 'YOUR_USER_ID_HERE' with your actual user ID and run:

INSERT INTO user_roles (user_id, role)
VALUES (
  '41613b1d-1e71-44fb-8fa6-c76765fffc26',  -- Replace this with your user ID
  'admin'
)
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Verify the role was added
SELECT ur.*, p.email, p.display_name
FROM user_roles ur
JOIN profiles p ON p.user_id = ur.user_id
WHERE ur.role = 'admin';

-- Optional: Add other roles to your user
-- Uncomment and modify as needed:

-- INSERT INTO user_roles (user_id, role)
-- VALUES 
--   ('YOUR_USER_ID_HERE', 'researcher'),
--   ('YOUR_USER_ID_HERE', 'moderator')
-- ON CONFLICT (user_id, role) DO NOTHING;
