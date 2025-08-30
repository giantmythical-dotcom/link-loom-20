interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
  user?: any;
  profile?: any;
  socialLinks?: any[];
  resetToken?: string;
  avatarUrl?: string;
}

interface ApiError {
  message: string;
  status?: number;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    // Add authorization header if access token exists
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle different response statuses
      if (response.status === 401 && this.refreshToken) {
        // Try to refresh the token
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          // Retry the original request with new token
          headers['Authorization'] = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          return this.handleResponse<T>(retryResponse);
        } else {
          // Refresh failed, user needs to log in again
          this.clearTokens();
          throw new Error('Session expired. Please log in again.');
        }
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    let data: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      throw {
        message: data.message || `HTTP ${response.status}`,
        status: response.status,
      } as ApiError;
    }

    return data as T;
  }

  private async tryRefreshToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const data: ApiResponse = await response.json();
        if (data.tokens) {
          this.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Auth endpoints
  async register(email: string, password: string): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async verifyEmail(email: string, otp: string): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async completeProfile(
    email: string,
    username: string,
    displayName: string,
    bio?: string
  ): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/complete-profile', {
      method: 'POST',
      body: JSON.stringify({ email, username, displayname: displayName, bio }),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse> {
    const response = await this.request<ApiResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store tokens if login successful
    if (response.tokens) {
      this.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request<ApiResponse>('/auth/logout', {
      method: 'POST',
    });
    this.clearTokens();
    return response;
  }

  async sendPasswordResetCode(email: string): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/send-password-reset-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyPasswordResetCode(email: string, otp: string): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/verify-password-reset-code', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async updatePassword(
    email: string,
    newPassword: string,
    resetToken: string
  ): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword, resetToken }),
    });
  }

  async resetPassword(
    email: string,
    password: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, password, newPassword }),
    });
  }

  // Profile endpoints
  async getMyProfile(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/profile/get-my-info');
  }

  async updateProfile(updates: any): Promise<ApiResponse> {
    return this.request<ApiResponse>('/profile/update-profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async updateAvatar(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.request<ApiResponse>('/profile/update-avatar', {
      method: 'PUT',
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary for FormData
      } as any,
    });
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, ApiError };