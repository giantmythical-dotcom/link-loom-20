import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useLinkRedirect(username: string, linkIdentifier: string) {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      if (!username || !linkIdentifier) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // First check if it's a document ID
        console.log('Checking for document with ID:', linkIdentifier, 'for user:', username);
        
        const { data: document, error: docError } = await supabase
          .from('documents')
          .select(`
            *,
            profiles!inner(username)
          `)
          .eq('id', linkIdentifier)
          .eq('is_active', true)
          .eq('is_public', true)
          .eq('profiles.username', username)
          .maybeSingle();
          
        console.log('Document query result:', { document, docError });

        if (docError && docError.code !== 'PGRST116') throw docError;

        if (document) {
          console.log('Found document:', document);
          // Redirect to the actual PDF file
          const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(document.file_path);
          
          console.log('Document URL:', urlData.publicUrl);
          setRedirectUrl(urlData.publicUrl);
          
          // Delay redirect to see console logs
          setTimeout(() => {
            window.location.href = urlData.publicUrl;
          }, 2000);
          return;
        }

        // If not a document, get the user profile to get user_id for social links
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('username', username.toLowerCase())
          .maybeSingle();

        if (profileError || !profileData) {
          console.error('Profile not found:', profileError);
          setNotFound(true);
          setLoading(false);
          return;
        }

        // Then, find the specific social link
        // We'll match by icon type or title (case-insensitive)
        const { data: linksData, error: linksError } = await supabase
          .from('social_links')
          .select('url, title, icon')
          .eq('user_id', profileData.user_id)
          .eq('is_active', true);

        if (linksError) {
          console.error('Error fetching links:', linksError);
          setNotFound(true);
          setLoading(false);
          return;
        }

        if (!linksData || linksData.length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        // Find matching link by icon type or title
        const matchingLink = linksData.find(link => 
          link.icon.toLowerCase() === linkIdentifier.toLowerCase() ||
          link.title.toLowerCase().replace(/\s+/g, '-') === linkIdentifier.toLowerCase()
        );

        if (!matchingLink) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setRedirectUrl(matchingLink.url);
        
        // Perform the redirect after a short delay to allow for any analytics tracking
        setTimeout(() => {
          window.location.href = matchingLink.url;
        }, 100);

      } catch (error) {
        console.error('Error:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAndRedirect();
  }, [username, linkIdentifier]);

  return {
    loading,
    notFound,
    redirectUrl,
  };
}