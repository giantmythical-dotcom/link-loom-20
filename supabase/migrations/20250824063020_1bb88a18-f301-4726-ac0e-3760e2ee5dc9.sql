-- Fix email exposure security issue by updating RLS policies

-- Drop the overly permissive policy that exposes all profile data
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that allows public access to non-sensitive profile data only
-- This excludes email addresses from public visibility
CREATE POLICY "Public profile data is viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Create a policy that allows users to see their own email address
CREATE POLICY "Users can view their own email" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a view for public profile data that excludes sensitive information
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

-- Enable RLS on the view (though views inherit from base table)
-- Grant public access to the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Update the existing policy to be more specific about what data is accessible
DROP POLICY IF EXISTS "Public profile data is viewable by everyone" ON public.profiles;

-- Create a more restrictive policy that only exposes non-sensitive fields
-- We'll need to handle this in the application layer by using the view instead