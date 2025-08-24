import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Link as LinkIcon, ArrowLeft, CheckCircle } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    
    if (error) {
      if (error.message?.includes('already registered')) {
        toast({
          title: "Account exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign Up Failed",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="absolute top-6 left-6 hover-lift"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center">
                <LinkIcon className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Welcome to LinkHub</h1>
              <p className="text-muted-foreground">
                Create your personalized link hub and connect with your audience
              </p>
            </div>
          </div>

          {/* Auth Form */}
          <Card className="card-modern border-0 shadow-lg">
            <CardContent className="p-6">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="focus-visible-modern"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="focus-visible-modern pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full btn-modern bg-accent-blue hover:bg-accent-blue/90 text-white"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="focus-visible-modern"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password (min. 6 characters)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          className="focus-visible-modern pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full btn-modern bg-accent-blue hover:bg-accent-blue/90 text-white"
                      disabled={loading}
                    >
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-accent-emerald flex-shrink-0" />
              <span>Free to start, no credit card required</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-accent-emerald flex-shrink-0" />
              <span>Setup your profile in under 2 minutes</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-accent-emerald flex-shrink-0" />
              <span>Professional analytics and customization</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-secondary/30 items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          <div className="absolute top-6 right-6">
            <ThemeToggle />
          </div>
          
          <div className="gradient-mesh w-64 h-64 mx-auto rounded-3xl flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-accent rounded-2xl flex items-center justify-center">
              <LinkIcon className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Join thousands of creators
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              From content creators to business professionals, LinkHub helps you 
              showcase your online presence beautifully and effectively.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">50K+</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">2M+</div>
              <div className="text-xs text-muted-foreground">Links Created</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
