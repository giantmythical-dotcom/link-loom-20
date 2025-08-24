-- Ensure public_profiles view exists and is accessible
-- This fixes issues where the view might not exist or be accessible to anonymous users

-- Drop existing view if it exists
DROP VIEW IF EXISTS public.public_profiles;

-- Create the public_profiles view
CREATE OR REPLACE VIEW public.public_profiles AS 
SELECT 
  id,
  user_id,
  username,
  display_name,
  bio,
  avatar_url,
  created_at,
  updated_at
FROM public.profiles;

-- Grant access to anonymous and authenticated users
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Ensure the profiles table has proper RLS policies for public access
-- Drop conflicting policies first
DROP POLICY IF EXISTS "Public profile data is viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own email" ON public.profiles;

-- Create a policy that allows public access to the profiles table
-- This is needed for the view to work properly
CREATE POLICY "Profiles are publicly viewable" 
ON public.profiles 
FOR SELECT 
USING (true);
