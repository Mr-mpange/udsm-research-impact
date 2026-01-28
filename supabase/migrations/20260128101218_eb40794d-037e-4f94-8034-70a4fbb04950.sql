-- Drop the overly permissive policy
DROP POLICY "Service role can insert notifications" ON public.notifications;

-- Notifications will be inserted by authenticated users (for their own notifications) or via edge functions with service role key
-- This policy allows users to insert notifications to other users (for collaboration requests, etc.)
CREATE POLICY "Authenticated users can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);