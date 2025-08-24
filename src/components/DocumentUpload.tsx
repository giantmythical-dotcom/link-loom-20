import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, X } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';

export const DocumentUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [uploading, setUploading] = useState(false);
  const { uploadDocument } = useDocuments();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      if (!title) {
        const fileName = file.name.replace('.pdf', '');
        setTitle(fileName);
        // Auto-generate slug from filename
        const autoSlug = fileName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        setSlug(autoSlug);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) return;

    setUploading(true);
    try {
      // Normalize the slug before upload
      const normalizedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      await uploadDocument(selectedFile, title.trim(), normalizedSlug || undefined);
      setSelectedFile(null);
      setTitle('');
      setSlug('');
      // Reset file input
      const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setTitle('');
    setSlug('');
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <Card className="glass card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload PDF Document
        </CardTitle>
        <CardDescription>
          Upload a PDF to create a shareable link
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pdf-upload">Select PDF File</Label>
          <Input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="cursor-pointer"
          />
        </div>

        {selectedFile && (
          <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="document-title">Document Title</Label>
              <Input
                id="document-title"
                value={title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setTitle(newTitle);
                  // Auto-update slug when title changes (only if slug is empty or matches previous auto-generated)
                  const autoSlug = newTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                  if (!slug || slug === title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) {
                    setSlug(autoSlug);
                  }
                }}
                placeholder="Enter document title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-slug">URL Slug *</Label>
              <Input
                id="document-slug"
                value={slug}
                onChange={(e) => {
                  const normalizedSlug = e.target.value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
                  setSlug(normalizedSlug);
                }}
                placeholder="my-document-name"
                required
              />
              <p className="text-xs text-muted-foreground">
                Creates a shareable URL like /username/{slug || 'document-name'}. Required field.
              </p>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!title.trim() || !slug.trim() || uploading}
              className="w-full btn-glow"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
