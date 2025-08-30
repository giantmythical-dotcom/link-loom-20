import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, type ApiResponse } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  lastLoginAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<{ error: any; user?: User }>;
  completeProfile: (email: string, username: string, displayName: string, bio?: string) => Promise<{ error: any }>;
  sendPasswordResetCode: (email: string) => Promise<{ error: any }>;
  verifyPasswordResetCode: (email: string, otp: string) => Promise<{ error: any; resetToken?: string }>;
  updatePassword: (email: string, newPassword: string, resetToken: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuthStatus = async () => {
      const accessToken = apiClient.getAccessToken();
      
      if (accessToken) {
        try {
          // Verify token is still valid by fetching user profile
          const response = await apiClient.getMyProfile();
          if (response.user) {
            setUser(response.user);
          } else {
            // Token invalid, clear it
            apiClient.clearTokens();
          }
        } catch (error) {
          // Token invalid or expired, clear it
          apiClient.clearTokens();
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const response = await apiClient.register(email, password);
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Registration failed' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      if (response.user) {
        setUser(response.user);
      }
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Login failed' };
    }
  };

  const signOut = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error);
    } finally {
      apiClient.clearTokens();
      setUser(null);
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    try {
      const response = await apiClient.verifyEmail(email, otp);
      return { error: null, user: response.user };
    } catch (error: any) {
      return { error: error.message || 'Email verification failed' };
    }
  };

  const completeProfile = async (email: string, username: string, displayName: string, bio?: string) => {
    try {
      const response = await apiClient.completeProfile(email, username, displayName, bio);
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Profile completion failed' };
    }
  };

  const sendPasswordResetCode = async (email: string) => {
    try {
      await apiClient.sendPasswordResetCode(email);
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Failed to send reset code' };
    }
  };

  const verifyPasswordResetCode = async (email: string, otp: string) => {
    try {
      const response = await apiClient.verifyPasswordResetCode(email, otp);
      return { error: null, resetToken: response.resetToken };
    } catch (error: any) {
      return { error: error.message || 'Reset code verification failed' };
    }
  };

  const updatePassword = async (email: string, newPassword: string, resetToken: string) => {
    try {
      await apiClient.updatePassword(email, newPassword, resetToken);
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Password update failed' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    verifyEmail,
    completeProfile,
    sendPasswordResetCode,
    verifyPasswordResetCode,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};