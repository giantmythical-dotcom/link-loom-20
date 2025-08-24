import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Copy, ExternalLink, Trash2, Check } from 'lucide-react';
import { useDocuments, type Document } from '@/hooks/useDocuments';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';

export const DocumentsList = () => {
  const { documents, loading, deleteDocument, getDocumentUrl } = useDocuments();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
          Your Documents
        </CardTitle>
        <CardDescription>
          Manage your uploaded PDF documents and their shareable links
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="p-4 border rounded-lg bg-card/50 card-elevated space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{document.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    PDF
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(document.file_size)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(document.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteDocument(document.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {profile?.username && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Shareable link:</div>
                <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded text-sm break-all">
                  <code className="flex-1">{getShareableLink(document)}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyLink(document)}
                    className="h-6 w-6 p-0 flex-shrink-0"
                  >
                    {copiedId === document.id ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openDocument(document)}
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                View PDF
              </Button>
              {profile?.username && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyLink(document)}
                  className="flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy Link
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};