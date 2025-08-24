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
import { ExternalLink, Link as LinkIcon, Share2, Heart, Copy } from 'lucide-react';

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
          console.error('Profile error details:', {
            message: profileError.message,
            code: profileError.code,
            details: profileError.details,
            hint: profileError.hint
          });
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

        // Track profile view (only for anonymous users - authenticated users are tracked elsewhere)
        // This helps avoid double-counting when profile owners view their own profile
        try {
          // Check if we have an authenticated session
          const { data: { session } } = await supabase.auth.getSession();

          // Only track for anonymous users or if viewing someone else's profile
          if (!session || session.user.id !== profileData.user_id) {
            await supabase
              .from('profile_views')
              .insert({
                profile_id: profileData.id,
                viewed_at: new Date().toISOString(),
                user_agent: navigator.userAgent,
                referrer: document.referrer || null
              });
          }
        } catch (error) {
          // Silently fail if profile_views table doesn't exist or RLS prevents access
          console.log('Profile view tracking not available:', error);
        }

        // Fetch social links
        const { data: linksData, error: linksError } = await supabase
          .from('social_links')
          .select('*')
          .eq('user_id', profileData.user_id)
          .eq('is_active', true)
          .order('position');

        if (linksError) {
          console.error('Error fetching links:', linksError);
          console.error('Links error details:', {
            message: linksError.message,
            code: linksError.code,
            details: linksError.details,
            hint: linksError.hint
          });
          // Don't fail the entire profile if social links can't be fetched
          setSocialLinks([]);
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
    
    // Track click analytics in the database (best effort, don't block link opening)
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
      // Silently fail if analytics tracking is not available (e.g., for anonymous users with RLS)
      console.log('Click tracking not available for this user:', error);
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
        // Show some feedback that URL was copied
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="container-modern py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Profile Header Skeleton */}
            <div className="text-center space-y-6">
              <Skeleton className="w-32 h-32 rounded-full mx-auto" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-64 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
                <Skeleton className="h-4 w-80 mx-auto" />
              </div>
            </div>

            {/* Links Skeleton */}
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="card-modern">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <LinkIcon className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => window.location.href = '/'} className="bg-accent-blue hover:bg-accent-blue/90 text-white">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container-modern py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-foreground">LinkHub</span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
                className="btn-modern"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container-modern py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <Avatar className="w-32 h-32 border-4 border-accent-blue/20 shadow-lg">
                <AvatarImage src={profile.avatar_url || ''} />
                <AvatarFallback className="text-4xl bg-gradient-accent text-white">
                  {profile.display_name?.[0]?.toUpperCase() || profile.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* Decorative elements */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent-emerald rounded-full opacity-80"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-accent-orange rounded-full opacity-60"></div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">
                  {profile.display_name || profile.username}
                </h1>
                
                <Badge variant="secondary" className="text-base px-4 py-1">
                  @{profile.username}
                </Badge>
              </div>
              
              {profile.bio && (
                <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  {profile.bio}
                </p>
              )}
              
              {/* Stats */}
              <div className="flex items-center justify-center gap-8 pt-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg text-foreground">{socialLinks.length}</div>
                  <div className="text-muted-foreground">Links</div>
                </div>
                <div className="w-px h-8 bg-border"></div>
                <div className="text-center">
                  <div className="font-bold text-lg text-foreground">1.2K</div>
                  <div className="text-muted-foreground">Views</div>
                </div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            {socialLinks.length === 0 ? (
              <Card className="card-modern">
                <CardContent className="p-12 text-center">
                  <LinkIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No links to display</h3>
                  <p className="text-muted-foreground">This profile hasn't added any links yet.</p>
                </CardContent>
              </Card>
            ) : (
              socialLinks.map((link, index) => (
                <Card 
                  key={link.id} 
                  className={`card-modern group cursor-pointer hover-lift transition-all duration-300 ${
                    clickedLinks.has(link.id) ? 'scale-95 bg-accent-blue/5 border-accent-blue/30' : ''
                  }`}
                  onClick={() => handleLinkClick(link.id, link.url, link.title)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                        clickedLinks.has(link.id) ? 'animate-pulse' : ''
                      }`}>
                        <span className="text-2xl">
                          {ICON_OPTIONS.find(option => option.value === link.icon)?.icon || '🔗'}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-accent-blue transition-colors duration-300 mb-1">
                          {link.title}
                        </h3>
                        <p className="text-muted-foreground text-sm truncate">
                          {link.url.replace(/^https?:\/\//, '')}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-accent-blue transition-colors duration-300" />
                      </div>
                    </div>
                    
                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-lg bg-accent-blue/5 scale-0 group-active:scale-100 transition-transform duration-200 pointer-events-none"></div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
              <div className="w-6 h-6 bg-gradient-accent rounded-lg flex items-center justify-center">
                <LinkIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">LinkHub</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Create your own link hub in minutes
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/'}
              className="btn-modern"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
