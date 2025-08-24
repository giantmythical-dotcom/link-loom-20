import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import type { Profile, SocialLink } from '@/hooks/useProfile';
import { ExternalLink, Link as LinkIcon, Share2, BarChart3, TrendingUp } from 'lucide-react';

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
  const [clickedLinks, setClickedLinks] = useState<Set<string>>(new Set());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  const handleLinkClick = async (linkId: string, url: string, title: string) => {
    // Add visual feedback
    setClickedLinks(prev => new Set(prev).add(linkId));

    // Track click analytics in the database
    try {
      await supabase
        .from('link_clicks')
        .insert({
          link_id: linkId,
          clicked_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
          referrer: document.referrer || null
        });
    } catch (error) {
      console.error('Failed to track click:', error);
    }

    // Open the link
    window.open(url, '_blank', 'noopener,noreferrer');

    // Remove visual feedback after animation
    setTimeout(() => {
      setClickedLinks(prev => {
        const newSet = new Set(prev);
        newSet.delete(linkId);
        return newSet;
      });
    }, 1000);
  };

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/${profile?.username}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.display_name || profile?.username}'s LinkHub`,
          text: profile?.bio || `Check out ${profile?.display_name || profile?.username}'s links`,
          url: profileUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copy to clipboard
      try {
        await navigator.clipboard.writeText(profileUrl);
        // Could show a toast here if toast hook was available
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
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
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-primary-glow/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="container max-w-2xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <Avatar className="w-40 h-40 mx-auto mb-8 ring-4 ring-primary/30 shadow-glow hover:scale-105 transition-transform duration-300">
            <AvatarImage src={profile.avatar_url || ''} />
            <AvatarFallback className="text-5xl bg-gradient-primary text-primary-foreground">
              {profile.display_name?.[0]?.toUpperCase() || profile.username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text leading-tight">
            {profile.display_name || profile.username}
          </h1>
          
          <p className="text-muted-foreground mb-2 text-lg">@{profile.username}</p>
          
          {profile.bio && (
            <p className="text-xl text-foreground/90 max-w-lg mx-auto mt-6 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {socialLinks.length === 0 ? (
            <Card className="glass border-0 p-10 text-center">
              <CardContent className="pt-0">
                <LinkIcon className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-40" />
                <p className="text-muted-foreground text-lg">No links to display</p>
              </CardContent>
            </Card>
          ) : (
            socialLinks.map((link, index) => (
              <Card 
                key={link.id} 
                className="glass border-0 card-elevated group cursor-pointer transform hover:scale-[1.02] transition-all duration-300 hover:shadow-glow"
                onClick={() => handleLinkClick(link.url, link.title)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                      <span className="text-3xl">
                        {ICON_OPTIONS.find(option => option.value === link.icon)?.icon || '🔗'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl group-hover:text-primary transition-colors duration-300 mb-2">
                        {link.title}
                      </h3>
                      <p className="text-muted-foreground text-base truncate">
                        {link.url.replace(/^https?:\/\//, '')}
                      </p>
                    </div>
                    
                    <ExternalLink className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <footer className="text-center mt-16 pt-10 border-t border-border/30 glass">
          <p className="text-base text-muted-foreground">
            Powered by{' '}
            <a 
              href="/" 
              className="link-hover text-primary font-semibold"
            >
              LinkHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
