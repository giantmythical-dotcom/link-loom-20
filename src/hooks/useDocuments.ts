import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Document {
  id: string;
  user_id: string;
  title: string;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  is_active: boolean;
  custom_title?: string;
  custom_icon: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDocuments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, title: string): Promise<Document | null> => {
    if (!user) return null;

    try {
      setLoading(true);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Create document record
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          title,
          filename: file.name,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchDocuments();
      
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      await fetchDocuments();
      
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const updateDocument = async (id: string, updates: Partial<Pick<Document, 'custom_title' | 'custom_icon' | 'is_public'>>) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchDocuments();
      
      toast({
        title: "Success",
        description: "Document updated successfully",
      });
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      });
    }
  };

  const getDocumentUrl = (document: Document) => {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(document.file_path);
    return data.publicUrl;
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      setDocuments([]);
      setLoading(false);
    }
  }, [user]);

  return {
    documents,
    loading,
    uploadDocument,
    deleteDocument,
    updateDocument,
    getDocumentUrl,
    refetch: fetchDocuments,
  };
};