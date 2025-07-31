import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      setProfile(profileData);

      const { data: linksData, error: linksError } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', user.id)
        .order('position');

      if (linksError) {
        throw linksError;
      }

      setSocialLinks(linksData || []);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (username: string, displayName?: string) => {
    if (!user) return { error: 'No user found' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          username: username.toLowerCase(),
          display_name: displayName || username,
          email: user.email,
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: 'No profile found' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const addSocialLink = async (link: Omit<SocialLink, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'No user found' };

    try {
      const { data, error } = await supabase
        .from('social_links')
        .insert({
          ...link,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setSocialLinks(prev => [...prev, data].sort((a, b) => a.position - b.position));
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const updateSocialLink = async (id: string, updates: Partial<SocialLink>) => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSocialLinks(prev => 
        prev.map(link => link.id === id ? data : link).sort((a, b) => a.position - b.position)
      );
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const deleteSocialLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSocialLinks(prev => prev.filter(link => link.id !== id));
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: 'No user found' };

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await updateProfile({ avatar_url: publicUrl });

      return { data: publicUrl, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    socialLinks,
    loading,
    createProfile,
    updateProfile,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    uploadAvatar,
    refetch: fetchProfile,
  };
}