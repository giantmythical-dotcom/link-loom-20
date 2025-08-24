import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Link as LinkIcon, Users, Zap, Globe, ArrowRight, Star, TrendingUp, Heart, Shield, Sparkles } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary-glow/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20 animate-slide-up">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow animate-pulse-glow">
              <LinkIcon className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="gradient-text animate-slide-in">
              LinkHub
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-10 max-w-3xl mx-auto font-light leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Create your personalized link hub and share all your social media profiles, websites, and content in one <span className="gradient-text font-medium">beautiful place</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-zoom-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg" 
              variant="gradient"
              className="text-lg px-10 py-4 btn-glow hover:scale-105 transition-transform duration-300"
              onClick={() => navigate('/auth')}
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-10 py-4 glass hover:scale-105 transition-all duration-300 hover:shadow-elegant"
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
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 scroll-fade-in">
          <Card className="glass border-0 card-elevated group hover:shadow-glow transition-all duration-500">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold">Easy Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-lg leading-relaxed">
                Create your profile in minutes. Add your links, customize your page, and start sharing with the world.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass border-0 card-elevated group hover:shadow-glow transition-all duration-500" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-lg leading-relaxed">
                Built for speed and performance. Your profile loads instantly, ensuring your visitors never have to wait.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass border-0 card-elevated group hover:shadow-glow transition-all duration-500" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold">Custom URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-lg leading-relaxed">
                Get your own custom URL like linkhub.com/yourusername. Professional, memorable, and easy to share.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="text-center mb-20 scroll-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 leading-tight">
            Why Choose <span className="gradient-text">LinkHub</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="flex items-start gap-6 text-left group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:shadow-glow transition-all duration-300">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">Beautiful Design</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Modern, responsive design that looks great on all devices. Dark and light mode support included.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 text-left group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:shadow-glow transition-all duration-300">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">SEO Optimized</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Your profile is optimized for search engines and social media sharing with proper meta tags.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 text-left group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:shadow-glow transition-all duration-300">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">Free Forever</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Start with our free plan and upgrade when you need more features. No hidden costs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 text-left group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:shadow-glow transition-all duration-300">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">Analytics Ready</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Track clicks and engagement on your links to understand your audience better.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center scroll-fade-in">
          <Card className="glass border-primary/20 max-w-3xl mx-auto card-elevated group hover:shadow-glow">
            <CardContent className="p-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Ready to get started?</h3>
              <p className="text-muted-foreground text-xl mb-8 leading-relaxed">
                Join thousands of creators, influencers, and professionals who trust LinkHub to showcase their online presence.
              </p>
              <Button 
                size="lg" 
                variant="gradient"
                className="text-xl px-12 py-5 btn-glow hover:scale-105 transition-all duration-300 group-hover:animate-pulse-glow"
                onClick={() => navigate('/auth')}
              >
                Create Your LinkHub
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-border/30 mt-20 glass relative z-10">
        <div className="container mx-auto px-4 py-10 text-center">
          <p className="text-muted-foreground text-lg">
            © 2024 LinkHub. Made with <span className="text-red-500 animate-pulse">❤️</span> for creators everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
