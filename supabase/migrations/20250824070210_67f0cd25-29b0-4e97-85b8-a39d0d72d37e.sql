-- Add slug column to documents table for custom URLs
ALTER TABLE public.documents 
ADD COLUMN slug text;

-- Create unique constraint on user_id + slug combination
CREATE UNIQUE INDEX idx_documents_user_slug 
ON public.documents (user_id, slug) 
WHERE slug IS NOT NULL AND is_active = true;

-- Add index for better performance on slug lookups
CREATE INDEX idx_documents_slug 
ON public.documents (slug) 
WHERE slug IS NOT NULL AND is_active = true;