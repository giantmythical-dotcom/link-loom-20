-- Add customization fields to documents table for shareable links
ALTER TABLE public.documents 
ADD COLUMN custom_title text,
ADD COLUMN custom_icon text DEFAULT 'file-text',
ADD COLUMN is_public boolean DEFAULT true;

-- Create index for better performance on public documents
CREATE INDEX idx_documents_public ON public.documents(is_public, is_active);

-- Update RLS policies to handle public visibility
DROP POLICY IF EXISTS "Documents are viewable by everyone" ON public.documents;

-- Create new policy for public documents only
CREATE POLICY "Public active documents are viewable by everyone" 
ON public.documents 
FOR SELECT 
USING (is_active = true AND is_public = true);

-- Keep the existing policy for users managing their own documents
-- CREATE POLICY "Users can manage their own documents" already exists