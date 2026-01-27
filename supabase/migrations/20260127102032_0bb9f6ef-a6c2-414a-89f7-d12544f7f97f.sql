-- Add policy for admins to view all researcher publications
CREATE POLICY "Admins can view all publications"
ON public.researcher_publications
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to view all chat history
CREATE POLICY "Admins can view all chat history"
ON public.chat_history
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to view all saved dashboards
CREATE POLICY "Admins can view all dashboards"
ON public.saved_dashboards
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to manage user roles
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));