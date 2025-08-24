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
import { DocumentUpload } from '@/components/DocumentUpload';
import { DocumentsList } from '@/components/DocumentsList';
import { ProfileSkeleton, LinksSkeleton, DashboardHeaderSkeleton } from '@/components/DashboardSkeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useAnalytics } from '@/hooks/useAnalytics';
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
  GripVertical,
  BarChart3,
  Copy,
  TrendingUp,
  Star,
  Zap,
  Settings,
  Globe,
  FileText
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
  const { analytics, loading: analyticsLoading, error: analyticsError } = useAnalytics();
  
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
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'links' | 'analytics' | 'documents'>('links');

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

  // All the handler functions remain the same
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

  const handleCopyProfileUrl = async () => {
    const profileUrl = `${window.location.origin}/${profile?.username}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Copied!",
        description: "Profile URL copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  // Drag and drop handlers remain the same
  const handleDragStart = (e: React.DragEvent, linkId: string) => {
    setDraggedItem(linkId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, linkId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedItem !== linkId) {
      setDragOverItem(linkId);
    }
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = async (e: React.DragEvent, targetLinkId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetLinkId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedIndex = socialLinks.findIndex(link => link.id === draggedItem);
    const targetIndex = socialLinks.findIndex(link => link.id === targetLinkId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLinks = [...socialLinks];
    const [draggedLink] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, draggedLink);

    try {
      const updates = newLinks.map((link, index) => 
        updateSocialLink(link.id, { position: index })
      );
      await Promise.all(updates);
      
      toast({
        title: "Links reordered!",
        description: "Your link order has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder links",
        variant: "destructive",
      });
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-modern py-8">
          <DashboardHeaderSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
            <div className="lg:col-span-1">
              <ProfileSkeleton />
            </div>
            <div className="lg:col-span-3">
              <LinksSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-modern py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
                <LinkIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold">LinkHub</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-title font-bold text-foreground mb-2">
                Welcome to LinkHub!
              </h1>
              <p className="text-muted-foreground">
                Let's create your profile to get started. Choose a unique username that will be part of your public profile URL.
              </p>
            </div>

            <Card className="card-modern">
              <CardContent className="p-8">
                <form onSubmit={handleCreateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="your-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      required
                      className="focus-visible-modern"
                    />
                    <p className="text-sm text-muted-foreground">
                      Your profile will be available at: <span className="font-medium text-accent-blue">{window.location.origin}/{username}</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display Name (optional)</Label>
                    <Input
                      id="display-name"
                      placeholder="Your Display Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="focus-visible-modern"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full btn-modern bg-accent-blue hover:bg-accent-blue/90 text-white"
                    disabled={isCreatingProfile}
                  >
                    {isCreatingProfile ? "Creating Profile..." : "Create Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-modern py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
                <LinkIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-semibold">LinkHub</span>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/${profile.username}`)}
                className="btn-modern"
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
        </div>
      </header>

      <div className="container-modern py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="card-modern">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 border-4 border-accent-blue/20">
                      <AvatarImage src={profile.avatar_url || ''} />
                      <AvatarFallback className="text-2xl bg-gradient-accent text-white">
                        {profile.display_name?.[0]?.toUpperCase() || profile.username[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 cursor-pointer">
                      <div className="w-8 h-8 bg-accent-blue text-white rounded-full flex items-center justify-center hover:bg-accent-blue/90 transition-colors">
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
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {profile.display_name || profile.username}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      @{profile.username}
                    </Badge>
                    {profile.bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCopyProfileUrl}
                      className="w-full btn-modern"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Profile URL
                    </Button>
                    
                    <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full btn-modern">
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
                              className="focus-visible-modern"
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
                              className="focus-visible-modern"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" className="bg-accent-blue hover:bg-accent-blue/90 text-white">
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="card-modern">
              <CardContent className="p-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Links</span>
                    <span className="text-sm font-medium">{socialLinks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Links</span>
                    <span className="text-sm font-medium">{socialLinks.filter(link => link.is_active).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Clicks</span>
                    <span className="text-sm font-medium">
                      {analyticsLoading ? '...' : analytics.totalClicks}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Navigation Tabs */}
            <div className="flex gap-1 bg-muted p-1 rounded-lg border">
              <Button
                variant={activeTab === 'links' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('links')}
                className={activeTab === 'links'
                  ? 'bg-background shadow-sm text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Links
              </Button>
              <Button
                variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('analytics')}
                className={activeTab === 'analytics'
                  ? 'bg-background shadow-sm text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button
                variant={activeTab === 'documents' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('documents')}
                className={activeTab === 'documents'
                  ? 'bg-background shadow-sm text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }
              >
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </Button>
            </div>

            {/* Links Tab */}
            {activeTab === 'links' && (
              <Card className="card-modern">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Manage Links</CardTitle>
                    <CardDescription>
                      Add, edit, and organize your social media links
                    </CardDescription>
                  </div>
                  <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
                    <DialogTrigger asChild>
                      <Button className="bg-accent-blue hover:bg-accent-blue/90 text-white">
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
                            className="focus-visible-modern"
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
                            className="focus-visible-modern"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="link-icon">Icon</Label>
                          <Select value={linkIcon} onValueChange={setLinkIcon}>
                            <SelectTrigger className="focus-visible-modern">
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
                          <Button type="submit" className="bg-accent-blue hover:bg-accent-blue/90 text-white">
                            Add Link
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {socialLinks.length === 0 ? (
                    <div className="text-center py-12">
                      <LinkIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No links yet</h3>
                      <p className="text-muted-foreground mb-6">Add your first social media link or website</p>
                      <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
                        <DialogTrigger asChild>
                          <Button className="bg-accent-blue hover:bg-accent-blue/90 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Link
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {socialLinks.map((link, index) => (
                        <div
                          key={link.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, link.id)}
                          onDragOver={(e) => handleDragOver(e, link.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, link.id)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center gap-4 p-4 rounded-lg border bg-secondary/5 hover:bg-secondary/10 transition-all duration-200 ${
                            draggedItem === link.id ? 'opacity-50 scale-95' : ''
                          } ${
                            dragOverItem === link.id ? 'border-accent-blue bg-accent-blue/5' : ''
                          }`}
                        >
                          <div className="cursor-grab hover:cursor-grabbing text-muted-foreground">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          
                          <div className="text-2xl">
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
                              className="hover-lift"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteLink(link.id)}
                              className="text-destructive hover:text-destructive hover-lift"
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
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="card-modern">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                          <p className="text-3xl font-bold text-foreground">
                            {analyticsLoading ? '...' : analytics.totalClicks.toLocaleString()}
                          </p>
                          <p className="text-xs text-accent-emerald flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" />
                            Real-time data
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-accent-blue/10 rounded-2xl flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-accent-blue" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-modern">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                          <p className="text-3xl font-bold text-foreground">
                            {analyticsLoading ? '...' : analytics.profileViews.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Eye className="w-3 h-3" />
                            Estimated
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-accent-emerald/10 rounded-2xl flex items-center justify-center">
                          <Eye className="w-6 h-6 text-accent-emerald" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-modern">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Top Link</p>
                          <p className="text-lg font-bold truncate">
                            {analyticsLoading ? '...' : (analytics.topLink?.title || 'No clicks yet')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {analyticsLoading ? '...' : (analytics.topLink ? `${analytics.topLink.clicks} clicks` : 'Add your first link')}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-accent-orange/10 rounded-2xl flex items-center justify-center">
                          <Star className="w-6 h-6 text-accent-orange" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-modern">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Avg Clicks per Link</p>
                          <p className="text-3xl font-bold text-foreground">
                            {analyticsLoading ? '...' : analytics.clickRate.toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Zap className="w-3 h-3" />
                            Real-time data
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                          <Zap className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Link Performance Chart */}
                {!analyticsLoading && analytics.linkPerformance.length > 0 && (
                  <Card className="card-modern">
                    <CardHeader>
                      <CardTitle>Link Performance</CardTitle>
                      <CardDescription>
                        Click performance for your links
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.linkPerformance.slice(0, 5).map((link) => {
                          const maxClicks = Math.max(...analytics.linkPerformance.map(l => l.clicks)) || 1;
                          const percentage = maxClicks > 0 ? (link.clicks / maxClicks) * 100 : 0;

                          return (
                            <div key={link.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">
                                    {ICON_OPTIONS.find(option => option.value === link.icon)?.icon || '🔗'}
                                  </span>
                                  <div>
                                    <p className="font-medium">{link.title}</p>
                                    <p className="text-sm text-muted-foreground truncate max-w-xs">
                                      {link.url.replace(/^https?:\/\//, '')}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">{link.clicks}</p>
                                  <p className="text-xs text-muted-foreground">clicks</p>
                                </div>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div
                                  className="bg-gradient-accent h-2 rounded-full transition-all duration-1000 ease-out"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!analyticsLoading && analytics.linkPerformance.length === 0 && (
                  <Card className="card-modern">
                    <CardContent className="p-12 text-center">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No analytics data yet</h3>
                      <p className="text-muted-foreground">Your link performance will appear here once people start clicking your links.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle>Document Management</CardTitle>
                    <CardDescription>
                      Upload and manage your documents and files
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DocumentUpload />
                  </CardContent>
                </Card>
                
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle>Your Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DocumentsList />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
