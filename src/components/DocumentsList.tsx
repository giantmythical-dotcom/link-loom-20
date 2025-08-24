import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Copy, ExternalLink, Trash2, Check, Edit, GripVertical, FileIcon, Download, Share, Eye, EyeOff } from 'lucide-react';
import { useDocuments, type Document } from '@/hooks/useDocuments';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';

const DOCUMENT_ICON_OPTIONS = [
  { value: 'file-text', icon: '📄', label: 'Document' },
  { value: 'file', icon: '📋', label: 'File' },
  { value: 'download', icon: '💾', label: 'Download' },
  { value: 'share', icon: '🔗', label: 'Share' },
  { value: 'book', icon: '📖', label: 'Book' },
  { value: 'clipboard', icon: '📊', label: 'Report' },
  { value: 'folder', icon: '📁', label: 'Folder' },
  { value: 'archive', icon: '📦', label: 'Archive' },
];

export const DocumentsList = () => {
  const { documents, loading, deleteDocument, updateDocument, getDocumentUrl } = useDocuments();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customIcon, setCustomIcon] = useState('file-text');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getShareableLink = (document: Document) => {
    if (!profile?.username) return '';
    return `${window.location.origin}/${profile.username}/${document.id}`;
  };

  const copyLink = async (document: Document) => {
    const link = getShareableLink(document);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(document.id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: "Link copied!",
        description: "The shareable link has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const openDocument = (document: Document) => {
    const url = getDocumentUrl(document);
    window.open(url, '_blank');
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setCustomTitle(document.custom_title || '');
    setCustomIcon(document.custom_icon || 'file-text');
  };

  const handleUpdateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDocument) return;

    await updateDocument(editingDocument.id, {
      custom_title: customTitle.trim() || null,
      custom_icon: customIcon,
    });

    setEditingDocument(null);
    setCustomTitle('');
    setCustomIcon('file-text');
  };

  const handleToggleVisibility = async (document: Document) => {
    await updateDocument(document.id, {
      is_public: !document.is_public,
    });
  };

  const getDisplayTitle = (document: Document) => {
    return document.custom_title || document.title;
  };

  const getDocumentIcon = (document: Document) => {
    const iconOption = DOCUMENT_ICON_OPTIONS.find(option => option.value === document.custom_icon);
    return iconOption?.icon || '📄';
  };

  if (loading) {
    return (
      <Card className="glass">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading documents...</div>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No documents uploaded yet. Upload your first PDF to get started!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document Links
        </CardTitle>
        <CardDescription>
          Manage your uploaded documents and customize their shareable links
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-secondary/5 hover:bg-secondary/10 transition-colors"
          >
            <div className="cursor-grab hover:cursor-grabbing">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
            
            <div className="text-xl">
              {getDocumentIcon(document)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium truncate">{getDisplayTitle(document)}</h4>
                <div className="flex items-center gap-1">
                  {!document.is_public && (
                    <Badge variant="secondary" className="text-xs">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Private
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {formatFileSize(document.file_size)}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="truncate">{document.filename}</span>
                <span>•</span>
                <span>{new Date(document.created_at).toLocaleDateString()}</span>
              </div>
              {profile?.username && (
                <div className="text-xs text-muted-foreground mt-1">
                  {getShareableLink(document)}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={document.is_public}
                onCheckedChange={() => handleToggleVisibility(document)}
                title={document.is_public ? "Make private" : "Make public"}
              />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditDocument(document)}
                title="Customize link"
              >
                <Edit className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openDocument(document)}
                title="View document"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              
              {profile?.username && document.is_public && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyLink(document)}
                  title="Copy shareable link"
                >
                  {copiedId === document.id ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteDocument(document.id)}
                className="text-destructive hover:text-destructive"
                title="Delete document"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <Dialog open={!!editingDocument} onOpenChange={(open) => !open && setEditingDocument(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize Document Link</DialogTitle>
              <DialogDescription>
                Customize how this document appears in your profile
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateDocument} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-title">Display Title</Label>
                <Input
                  id="custom-title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={editingDocument?.title || "Enter custom title"}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use the original title
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-icon">Icon</Label>
                <Select value={customIcon} onValueChange={setCustomIcon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_ICON_OPTIONS.map((option) => (
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
                <Button type="button" variant="outline" onClick={() => setEditingDocument(null)}>
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
  );
};