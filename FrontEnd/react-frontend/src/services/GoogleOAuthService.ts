// GoogleOAuthService.ts
// Simple service to handle Google OAuth redirects

export class GoogleOAuthService {
  private readonly backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8082';

  /**
   * Redirect to Google OAuth login
   */
  public redirectToGoogleLogin(): void {
    // Store current path for redirect after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/' && currentPath !== '/HomePage') {
      sessionStorage.setItem('oauth_redirect_path', currentPath);
    }
    
    // Redirect to backend OAuth endpoint
    window.location.href = `${this.backendUrl}/api/auth/login/google`;
  }

  /**
   * Check if user is authenticated
   */
  public async checkAuthStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.backendUrl}/api/auth/status`, {
        method: 'GET',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check auth status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking auth status:', error);
      return { authenticated: false };
    }
  }

  /**
   * Get current user information
   */
  public async getCurrentUser(): Promise<any> {
    try {
      const response = await fetch(`${this.backendUrl}/api/auth/user`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get current user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      return { authenticated: false };
    }
  }

  /**
   * Logout user
   */
  public async logout(): Promise<void> {
    try {
      await fetch(`${this.backendUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Clear session storage
      sessionStorage.clear();
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}

// Export singleton instance
export const googleOAuthService = new GoogleOAuthService();
export default googleOAuthService;