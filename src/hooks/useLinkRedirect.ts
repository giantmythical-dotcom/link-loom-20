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
        
        // Get user_id first from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('username', username)
          .maybeSingle();

        if (profileError || !profileData) {
          console.log('Profile not found for username:', username);
          setNotFound(true);
          setLoading(false);
          return;
        }

        // Now check for document with this user_id (first by slug, then by ID)
        let document = null;
        let docError = null;
        
        // First try to find by slug
        const { data: docBySlug, error: slugError } = await supabase
          .from('documents')
          .select('*')
          .eq('slug', linkIdentifier)
          .eq('user_id', profileData.user_id)
          .eq('is_active', true)
          .eq('is_public', true)
          .maybeSingle();
          
        if (slugError && slugError.code !== 'PGRST116') throw slugError;
        
        if (docBySlug) {
          document = docBySlug;
        } else {
          // If not found by slug, try by document ID (only if linkIdentifier is a valid UUID)
          const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(linkIdentifier);

          if (isValidUUID) {
            const { data: docById, error: idError } = await supabase
              .from('documents')
              .select('*')
              .eq('id', linkIdentifier)
              .eq('user_id', profileData.user_id)
              .eq('is_active', true)
              .eq('is_public', true)
              .maybeSingle();

            if (idError && idError.code !== 'PGRST116') throw idError;
            document = docById;
            docError = idError;
          }
        }
          
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

          // Track document access (we can create a document_views table later, for now we'll skip this)
          // TODO: Implement document access tracking when document_views table is created

          // Delay redirect to see console logs
          setTimeout(() => {
            window.location.href = urlData.publicUrl;
          }, 1000);
          return;
        }

        // If not a document, find the specific social link
        // We'll match by icon type or title (case-insensitive)
        const { data: linksData, error: linksError } = await supabase
          .from('social_links')
          .select('id, url, title, icon')
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

        // Track the click analytics for social links (best effort, don't block redirect)
        try {
          await supabase
            .from('link_clicks')
            .insert({
              link_id: matchingLink.id,
              clicked_at: new Date().toISOString(),
              user_agent: navigator.userAgent,
              referrer: document.referrer || null
            });
        } catch (error) {
          // Silently fail if analytics tracking is not available (e.g., for anonymous users with RLS)
          console.log('Click tracking not available for this user:', error);
        }

        // Perform the redirect after tracking analytics
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
