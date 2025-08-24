import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLinkRedirect } from '@/hooks/useLinkRedirect';
import { ExternalLink, Link as LinkIcon, ArrowLeft } from 'lucide-react';

export default function LinkRedirect() {
  const { username, linkname } = useParams<{ username: string; linkname: string }>();
  const navigate = useNavigate();
  const { loading, notFound, redirectUrl } = useLinkRedirect(username || '', linkname || '');

  // Set document title
  useEffect(() => {
    if (username && linkname) {
      document.title = `${username}/${linkname} | LinkHub`;
    }
  }, [username, linkname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to {linkname}...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="text-center max-w-md">
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <LinkIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Link Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The link "{linkname}" doesn't exist for user @{username} or has been removed.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => navigate(`/${username}`)}
                  variant="gradient"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  View Profile
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // This should rarely be seen since we redirect immediately
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="text-center max-w-md">
        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExternalLink className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
            <p className="text-muted-foreground mb-6">
              You should be redirected to {linkname} shortly.
            </p>
            
            {redirectUrl && (
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => window.open(redirectUrl, '_blank', 'noopener,noreferrer')}
                  variant="gradient"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Click here if not redirected
                </Button>
                <Button 
                  onClick={() => navigate(`/${username}`)}
                  variant="outline"
                  size="sm"
                >
                  Back to Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
