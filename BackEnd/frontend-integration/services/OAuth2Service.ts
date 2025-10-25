// OAuth2Service.ts
// Service to handle OAuth2 API calls to the backend

export interface User {
  id: number;
  userName: string;
  email: string;
  fullName: string;
  profilePicture: string;
  role: string;
  provider?: string;
  isOAuth2User?: boolean;
}

export interface AuthStatus {
  authenticated: boolean;
  user?: User;
  error?: string;
}

export interface AuthResponse {
  authenticated: boolean;
  user?: {
    id: number;
    userName: string;
    role: string;
    email: string;
    name: string;
    picture: string;
  };
  error?: string;
}

class OAuth2Service {
  private readonly baseUrl = 'http://localhost:8082';

  // Configure fetch with credentials to maintain session
  private async fetchWithCredentials(url: string, options: RequestInit = {}): Promise<Response> {
    return fetch(url, {
      ...options,
      credentials: 'include', // Include cookies/session
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  /**
   * Redirect to Google OAuth2 login
   */
  public redirectToGoogleLogin(): void {
    window.location.href = `${this.baseUrl}/api/auth/login/google`;
  }

  /**
   * Get login URL from backend
   */
  public async getLoginUrl(): Promise<{ loginUrl: string; provider: string }> {
    try {
      const response = await this.fetchWithCredentials(`${this.baseUrl}/api/auth/login-url`);
      if (!response.ok) {
        throw new Error('Failed to get login URL');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting login URL:', error);
      throw error;
    }
  }

  /**
   * Check current authentication status
   */
  public async checkAuthStatus(): Promise<AuthStatus> {
    try {
      const response = await this.fetchWithCredentials(`${this.baseUrl}/api/auth/status`);
      if (!response.ok) {
        throw new Error('Failed to check auth status');
      }
      const data = await response.json();
      return {
        authenticated: data.authenticated,
        user: data.authenticated ? {
          id: 0, // Will be populated by getCurrentUser
          userName: data.email,
          email: data.email,
          fullName: data.name,
          profilePicture: '',
          role: 'USER',
        } : undefined,
      };
    } catch (error) {
      console.error('Error checking auth status:', error);
      return { authenticated: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get current authenticated user details
   */
  public async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await this.fetchWithCredentials(`${this.baseUrl}/api/auth/user`);
      if (!response.ok) {
        throw new Error('Failed to get current user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      return { authenticated: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get detailed user profile
   */
  public async getUserProfile(): Promise<User> {
    try {
      const response = await this.fetchWithCredentials(`${this.baseUrl}/api/oauth2/profile`);
      if (!response.ok) {
        throw new Error('Failed to get user profile');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  public async updateUserProfile(profileData: { fullName?: string; profilePicture?: string }): Promise<User> {
    try {
      const response = await this.fetchWithCredentials(`${this.baseUrl}/api/oauth2/profile`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  public async logout(): Promise<{ message: string; status: string }> {
    try {
      const response = await this.fetchWithCredentials(`${this.baseUrl}/api/auth/logout`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to logout');
      }
      return await response.json();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  /**
   * Check OAuth2 authentication (alternative endpoint)
   */
  public async checkOAuth2Auth(): Promise<AuthStatus> {
    try {
      const response = await this.fetchWithCredentials(`${this.baseUrl}/api/oauth2/check-auth`);
      if (!response.ok) {
        throw new Error('Failed to check OAuth2 auth');
      }
      const data = await response.json();
      return {
        authenticated: data.authenticated,
        user: data.authenticated ? {
          id: 0,
          userName: data.email,
          email: data.email,
          fullName: data.name,
          profilePicture: '',
          role: 'USER',
          provider: data.provider,
        } : undefined,
      };
    } catch (error) {
      console.error('Error checking OAuth2 auth:', error);
      return { authenticated: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get user by email (admin function)
   */
  public async getUserByEmail(email: string): Promise<User> {
    try {
      const response = await this.fetchWithCredentials(`${this.baseUrl}/api/oauth2/user/${email}`);
      if (!response.ok) {
        throw new Error('Failed to get user by email');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Link OAuth2 account to existing account
   */
  public async linkAccount(linkData: Record<string, string>): Promise<{ message: string; userId: number }> {
    try {
      const response = await this.fetchWithCredentials(`${this.baseUrl}/api/oauth2/link-account`, {
        method: 'POST',
        body: JSON.stringify(linkData),
      });
      if (!response.ok) {
        throw new Error('Failed to link account');
      }
      return await response.json();
    } catch (error) {
      console.error('Error linking account:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const oAuth2Service = new OAuth2Service();
export default OAuth2Service;