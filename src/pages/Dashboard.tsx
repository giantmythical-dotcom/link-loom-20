import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { toast } from '@/hooks/use-toast';
import { 
  LogOut, 
  User, 
  Link as LinkIcon, 
  Plus, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Upload,
  Eye,
  GripVertical
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

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

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { profile, socialLinks, loading, createProfile, updateProfile, addSocialLink, updateSocialLink, deleteSocialLink, uploadAvatar } = useProfile();
  
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkIcon, setLinkIcon] = useState('link');
  
  const [editingLink, setEditingLink] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Username is required",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingProfile(true);
    const { error } = await createProfile(username.trim(), displayName.trim() || undefined);
    
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile created!",
        description: "Your profile has been successfully created.",
      });
    }
    setIsCreatingProfile(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await updateProfile({
      display_name: displayName.trim(),
      bio: bio.trim(),
    });
    
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
      setIsEditingProfile(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle.trim() || !linkUrl.trim()) {
      toast({
        title: "Error",
        description: "Title and URL are required",
        variant: "destructive",
      });
      return;
    }

    const { error } = await addSocialLink({
      title: linkTitle.trim(),
      url: linkUrl.trim(),
      icon: linkIcon,
      position: socialLinks.length,
      is_active: true,
    });
    
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add link",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Link added!",
        description: "Your link has been successfully added.",
      });
      setIsAddingLink(false);
      setLinkTitle('');
      setLinkUrl('');
      setLinkIcon('link');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    const { error } = await uploadAvatar(file);
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload avatar",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Avatar updated!",
        description: "Your avatar has been successfully updated.",
      });
    }
  };

  const handleDeleteLink = async (id: string) => {
    const { error } = await deleteSocialLink(id);
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete link",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Link deleted!",
        description: "Your link has been successfully deleted.",
      });
    }
  };

  const handleToggleLink = async (id: string, isActive: boolean) => {
    const { error } = await updateSocialLink(id, { is_active: isActive });
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update link",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Create Your Profile
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Welcome to LinkHub!</CardTitle>
              <CardDescription>
                Let's set up your profile to get started. Choose a unique username that will be part of your public profile URL.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="your-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Your profile will be available at: {window.location.origin}/{username}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name (optional)</Label>
                  <Input
                    id="display-name"
                    placeholder="Your Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="gradient"
                  disabled={isCreatingProfile}
                >
                  {isCreatingProfile ? "Creating Profile..." : "Create Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/${profile.username}`)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            <ThemeToggle />
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.avatar_url || ''} />
                      <AvatarFallback className="text-2xl">
                        {profile.display_name?.[0]?.toUpperCase() || profile.username[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 cursor-pointer">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                        <Upload className="w-4 h-4" />
                      </div>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <h3 className="font-semibold text-lg">
                      {profile.display_name || profile.username}
                    </h3>
                    <Badge variant="secondary">@{profile.username}</Badge>
                    {profile.bio && (
                      <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>
                    )}
                  </div>
                </div>

                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-display-name">Display Name</Label>
                        <Input
                          id="edit-display-name"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Your display name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-bio">Bio</Label>
                        <Textarea
                          id="edit-bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell people about yourself..."
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" variant="gradient">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    Social Links
                  </CardTitle>
                  <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
                    <DialogTrigger asChild>
                      <Button variant="gradient" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Link
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Link</DialogTitle>
                        <DialogDescription>
                          Add a social media link or any other URL you want to share
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddLink} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="link-title">Title</Label>
                          <Input
                            id="link-title"
                            value={linkTitle}
                            onChange={(e) => setLinkTitle(e.target.value)}
                            placeholder="e.g., My GitHub"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="link-url">URL</Label>
                          <Input
                            id="link-url"
                            type="url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://github.com/yourusername"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="link-icon">Icon</Label>
                          <Select value={linkIcon} onValueChange={setLinkIcon}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ICON_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <span>{option.icon}</span>
                                    <span>{option.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsAddingLink(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" variant="gradient">
                            Add Link
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {socialLinks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No links added yet</p>
                    <p className="text-sm">Add your first social media link or website</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-secondary/5 hover:bg-secondary/10 transition-colors"
                      >
                        <div className="cursor-grab hover:cursor-grabbing">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>
                        
                        <div className="text-xl">
                          {ICON_OPTIONS.find(option => option.value === link.icon)?.icon || '🔗'}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium truncate">{link.title}</h4>
                            {!link.is_active && (
                              <Badge variant="secondary" className="text-xs">Hidden</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={link.is_active}
                            onCheckedChange={(checked) => handleToggleLink(link.id, checked)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(link.url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLink(link.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}