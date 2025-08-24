import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useDocumentRedirect = () => {
  const { username, linkname } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkDocumentRedirect = async () => {
      if (!username || !linkname) {
        setError('Invalid URL parameters');
        setLoading(false);
        return;
      }

      try {
        // First check if it's a document ID
        const { data: document, error: docError } = await supabase
          .from('documents')
          .select(`
            *,
            profiles!inner(username)
          `)
          .eq('id', linkname)
          .eq('is_active', true)
          .eq('profiles.username', username)
          .maybeSingle();

        if (docError) throw docError;

        if (document) {
          // Redirect to the actual PDF file
          const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(document.file_path);
          
          window.location.href = urlData.publicUrl;
          return;
        }

        // If not a document, it might be a social link, so continue with social link logic
        setError('Document not found');
      } catch (error) {
        console.error('Error checking document redirect:', error);
        setError('An error occurred while checking the document');
      } finally {
        setLoading(false);
      }
    };

    checkDocumentRedirect();
  }, [username, linkname]);

  return { loading, error };
};