import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Link as LinkIcon, Users, Zap, Globe, ArrowRight, Star } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-glow rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
              <LinkIcon className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              LinkHub
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create your personalized link hub and share all your social media profiles, websites, and content in one beautiful place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="gradient"
              className="text-lg px-8"
              onClick={() => navigate('/auth')}
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8"
              onClick={() => {
                const element = document.getElementById('features');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Easy Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Create your profile in minutes. Add your links, customize your page, and start sharing with the world.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Built for speed and performance. Your profile loads instantly, ensuring your visitors never have to wait.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Custom URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Get your own custom URL like linkhub.com/yourusername. Professional, memorable, and easy to share.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Why Choose <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">LinkHub</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4 text-left">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Beautiful Design</h3>
                <p className="text-muted-foreground">
                  Modern, responsive design that looks great on all devices. Dark and light mode support included.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">SEO Optimized</h3>
                <p className="text-muted-foreground">
                  Your profile is optimized for search engines and social media sharing with proper meta tags.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Free Forever</h3>
                <p className="text-muted-foreground">
                  Start with our free plan and upgrade when you need more features. No hidden costs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Analytics Ready</h3>
                <p className="text-muted-foreground">
                  Track clicks and engagement on your links to understand your audience better.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of creators, influencers, and professionals who trust LinkHub to showcase their online presence.
              </p>
              <Button 
                size="lg" 
                variant="gradient"
                className="text-lg px-8"
                onClick={() => navigate('/auth')}
              >
                Create Your LinkHub
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2024 LinkHub. Made with ❤️ for creators everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
