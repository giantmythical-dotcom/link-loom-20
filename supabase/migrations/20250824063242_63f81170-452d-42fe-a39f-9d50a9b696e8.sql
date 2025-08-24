-- Fix security definer view issue by dropping the problematic view
DROP VIEW IF EXISTS public.public_profiles;

-- Fix function search path issue for security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;