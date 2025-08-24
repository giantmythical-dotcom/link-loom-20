import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Link as LinkIcon, 
  Users, 
  Zap, 
  Globe, 
  ArrowRight, 
  Star, 
  CheckCircle, 
  BarChart3, 
  Palette,
  Shield,
  Sparkles,
  ExternalLink,
  TrendingUp
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container-modern py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground">LinkHub</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="btn-modern"
            >
              Sign In
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="section-padding relative">
        <div className="gradient-mesh absolute inset-0 opacity-50"></div>
        <div className="container-modern relative">
          <div className="text-center max-w-4xl mx-auto space-y-content">
            <div className="space-y-6">
              <h1 className="text-display font-bold text-foreground">
                Your personal link hub,
                <span className="gradient-text"> beautifully simple</span>
              </h1>
              
              <p className="text-subtitle text-muted-foreground max-w-2xl mx-auto">
                Create a stunning profile page that showcases all your links in one place. 
                Perfect for creators, professionals, and businesses.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button 
                size="lg" 
                className="btn-modern bg-accent-blue hover:bg-accent-blue/90 text-white px-8"
                onClick={() => navigate('/auth')}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="btn-modern"
                onClick={() => {
                  const element = document.getElementById('features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                See How It Works
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent-emerald" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent-emerald" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent-emerald" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container-modern">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-foreground">2M+</div>
              <div className="text-sm text-muted-foreground">Links Created</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-foreground">4.9/5</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding">
        <div className="container-modern">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-title font-bold text-foreground mb-4">
              Everything you need to shine online
            </h2>
            <p className="text-muted-foreground">
              Powerful features designed to help you create the perfect link hub for your audience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-modern group">
              <CardHeader className="text-center">
                <div className="w-14 h-14 bg-accent-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-blue/20 transition-colors">
                  <Zap className="w-7 h-7 text-accent-blue" />
                </div>
                <CardTitle className="text-xl">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Optimized for speed with instant loading times. Your audience will never have to wait.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-modern group">
              <CardHeader className="text-center">
                <div className="w-14 h-14 bg-accent-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-emerald/20 transition-colors">
                  <Palette className="w-7 h-7 text-accent-emerald" />
                </div>
                <CardTitle className="text-xl">Fully Customizable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Personalize your profile with custom themes, colors, and layouts that match your brand.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-modern group">
              <CardHeader className="text-center">
                <div className="w-14 h-14 bg-accent-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-orange/20 transition-colors">
                  <BarChart3 className="w-7 h-7 text-accent-orange" />
                </div>
                <CardTitle className="text-xl">Analytics Built-in</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center leading-relaxed">
                  Track clicks, views, and engagement with detailed analytics to understand your audience.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-modern">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-title font-bold text-foreground mb-4">
              Loved by creators worldwide
            </h2>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent-orange text-accent-orange" />
              ))}
              <span className="ml-2 text-muted-foreground">4.9/5 from 1,000+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-orange text-accent-orange" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  "LinkHub completely transformed how I share my content. The design is beautiful and my engagement has increased significantly!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    S
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Sarah Chen</div>
                    <div className="text-sm text-muted-foreground">Content Creator</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-orange text-accent-orange" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  "As a musician, I needed a clean way to share my links. LinkHub's customization options are perfect for my brand."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    M
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Marcus Rodriguez</div>
                    <div className="text-sm text-muted-foreground">Musician</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-orange text-accent-orange" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  "The analytics feature helped me understand my audience better. Simple, powerful, and exactly what I needed."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    A
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Alex Thompson</div>
                    <div className="text-sm text-muted-foreground">Digital Marketer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding">
        <div className="container-modern">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-title font-bold text-foreground mb-4">
              Ready to create your LinkHub?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of creators who use LinkHub to showcase their online presence.
            </p>
            <Button 
              size="lg" 
              className="btn-modern bg-accent-blue hover:bg-accent-blue/90 text-white px-8"
              onClick={() => navigate('/auth')}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container-modern">
          <div className="text-center text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-accent rounded-lg flex items-center justify-center">
                <LinkIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">LinkHub</span>
            </div>
            <p>© 2024 LinkHub. Made with ❤️ for creators everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
