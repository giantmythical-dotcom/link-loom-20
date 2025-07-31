import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { supabase } from '@/integrations/supabase/client';
import type { Profile, SocialLink } from '@/hooks/useProfile';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'link', label: 'Link', icon: '🔗' },
  { value: 'github', label: 'GitHub', icon: '💻' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'youtube', label: 'YouTube', icon: '📺' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'phone', label: 'Phone', icon: '📱' },
  { value: 'website', label: 'Website', icon: '🌐' },
  { value: 'resume', label: 'Resume', icon: '📄' },
];

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username.toLowerCase())
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setNotFound(true);
          setLoading(false);
          return;
        }

        if (!profileData) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setProfile(profileData);

        // Fetch social links
        const { data: linksData, error: linksError } = await supabase
          .from('social_links')
          .select('*')
          .eq('user_id', profileData.user_id)
          .eq('is_active', true)
          .order('position');

        if (linksError) {
          console.error('Error fetching links:', linksError);
        } else {
          setSocialLinks(linksData || []);
        }
      } catch (error) {
        console.error('Error:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  // Set document title and meta tags
  useEffect(() => {
    if (profile) {
      document.title = `${profile.display_name || profile.username} | LinkHub`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          profile.bio || `Check out ${profile.display_name || profile.username}'s links on LinkHub`
        );
      }

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${profile.display_name || profile.username} | LinkHub`);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', 
          profile.bio || `Check out ${profile.display_name || profile.username}'s links on LinkHub`
        );
      }

      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage && profile.avatar_url) {
        ogImage.setAttribute('content', profile.avatar_url);
      }
    }
  }, [profile]);

  const handleLinkClick = (url: string, title: string) => {
    // Track click analytics here if needed
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <LinkIcon className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => window.location.href = '/'} variant="gradient">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Avatar className="w-32 h-32 mx-auto mb-6 ring-4 ring-primary/20">
            <AvatarImage src={profile.avatar_url || ''} />
            <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
              {profile.display_name?.[0]?.toUpperCase() || profile.username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {profile.display_name || profile.username}
          </h1>
          
          <p className="text-muted-foreground mb-1">@{profile.username}</p>
          
          {profile.bio && (
            <p className="text-lg text-foreground/80 max-w-md mx-auto mt-4">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {socialLinks.length === 0 ? (
            <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-0">
              <CardContent className="pt-0">
                <LinkIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No links to display</p>
              </CardContent>
            </Card>
          ) : (
            socialLinks.map((link, index) => (
              <Card 
                key={link.id} 
                className="overflow-hidden bg-card/80 backdrop-blur-sm border-0 hover:bg-card/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleLinkClick(link.url, link.title)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                      <span className="text-2xl">
                        {ICON_OPTIONS.find(option => option.value === link.icon)?.icon || '🔗'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-muted-foreground text-sm truncate">
                        {link.url.replace(/^https?:\/\//, '')}
                      </p>
                    </div>
                    
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <footer className="text-center mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Powered by{' '}
            <a 
              href="/" 
              className="text-primary hover:text-primary-glow transition-colors font-medium"
            >
              LinkHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}