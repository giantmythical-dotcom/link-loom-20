import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  userId: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  userId: string;
  title: string;
  url: string;
  icon: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
      const response = await apiClient.getMyProfile();
      
      if (response.profile) {
        // Convert backend response to frontend format
        const profileData = {
          id: response.profile.id,
          userId: response.profile.userId,
          username: response.profile.username,
          displayName: response.profile.displayName,
          bio: response.profile.bio,
          avatarUrl: response.profile.avatarUrl,
          email: response.user?.email || null,
          createdAt: response.profile.createdAt,
          updatedAt: response.profile.updatedAt,
        };
        setProfile(profileData);
      }

      if (response.socialLinks) {
        // Convert backend social links format
        const linksData = response.socialLinks.map((link: any) => ({
          id: link.id,
          userId: link.userId,
          title: link.title,
          url: link.url,
          icon: link.icon,
          position: link.position,
          isActive: link.isActive,
          createdAt: link.createdAt,
          updatedAt: link.updatedAt,
        }));
        setSocialLinks(linksData);
      }
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
      const response = await apiClient.completeProfile(
        user.email,
        username.toLowerCase(),
        displayName || username
      );

      // Refresh profile data after creation
      await fetchProfile();
      return { data: response.profile, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: 'No profile found' };

    try {
      // Convert frontend format to backend format
      const backendUpdates: any = {};
      if (updates.username) backendUpdates.username = updates.username;
      if (updates.displayName !== undefined) backendUpdates.displayName = updates.displayName;
      if (updates.bio !== undefined) backendUpdates.bio = updates.bio;
      if (updates.avatarUrl !== undefined) backendUpdates.avatarUrl = updates.avatarUrl;

      const response = await apiClient.updateProfile(backendUpdates);
      
      // Refresh profile data
      await fetchProfile();
      return { data: response.profile, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const addSocialLink = async (link: Omit<SocialLink, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return { error: 'No user found' };

    try {
      // This would need to be implemented in your backend API
      // For now, we'll use a placeholder response
      const response = { socialLink: link };
      
      // Refresh profile data to get updated social links
      await fetchProfile();
      return { data: response.socialLink, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const updateSocialLink = async (id: string, updates: Partial<SocialLink>) => {
    try {
      // This would need to be implemented in your backend API
      // For now, we'll use a placeholder response
      const response = { socialLink: { ...updates, id } };
      
      // Refresh profile data to get updated social links
      await fetchProfile();
      return { data: response.socialLink, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const deleteSocialLink = async (id: string) => {
    try {
      // This would need to be implemented in your backend API
      // For now, we'll simulate success
      
      // Refresh profile data to get updated social links
      await fetchProfile();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: 'No user found' };

    try {
      const response = await apiClient.updateAvatar(file);
      
      if (response.avatarUrl) {
        // Update local profile state
        setProfile(prev => prev ? { ...prev, avatarUrl: response.avatarUrl } : null);
        return { data: response.avatarUrl, error: null };
      }
      
      return { data: null, error: 'Failed to upload avatar' };
    } catch (error: any) {
      return { data: null, error: error.message };
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