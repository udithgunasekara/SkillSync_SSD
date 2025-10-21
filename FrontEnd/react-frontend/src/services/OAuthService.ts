import apiService from './ApiService';
import { AxiosResponse } from 'axios';
import { OAuthUser, UserRole, AuthResponse } from '../config/OAuthConfig';

// OAuth configuration - Update with your Google OAuth credentials
export const OAUTH_CONFIG = {
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    redirectUri: `${window.location.origin}/auth/callback`,
    scopes: [
        'openid',
        'profile', 
        'email'
    ].join(' ')
};

export interface GoogleTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    id_token: string;
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
    user: OAuthUser;
    requiresRoleSelection?: boolean;
    availableRoles?: UserRole[];
}

export interface RegisterRequest {
    role: UserRole;
    linkedUsername?: string;
}

class OAuthService {
    private readonly GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
    private readonly GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

    /**
     * Initiates Google OAuth flow by redirecting to Google's authorization server
     */
    initiateGoogleLogin(): void {
        const params = new URLSearchParams({
            client_id: OAUTH_CONFIG.clientId,
            redirect_uri: OAUTH_CONFIG.redirectUri,
            response_type: 'code',
            scope: OAUTH_CONFIG.scopes,
            access_type: 'offline',
            prompt: 'consent'
        });

        const authUrl = `${this.GOOGLE_AUTH_URL}?${params.toString()}`;
        window.location.href = authUrl;
    }

    /**
     * Handles the OAuth callback by exchanging authorization code for tokens
     * @param authorizationCode - The authorization code from Google
     */
    async handleOAuthCallback(authorizationCode: string): Promise<LoginResponse> {
        try {
            // Exchange authorization code for Google tokens
            const googleTokens = await this.exchangeCodeForTokens(authorizationCode);
            
            // Send Google ID token to backend for authentication
            const response: AxiosResponse<LoginResponse> = await apiService.post('/auth/google', {
                idToken: googleTokens.id_token,
                accessToken: googleTokens.access_token
            });

            const { token, refreshToken, user, requiresRoleSelection } = response.data;

            // Store tokens and user data
            if (token && refreshToken) {
                this.storeAuthData(token, refreshToken, user);
                apiService.setAuthToken(token);
            }

            return response.data;
        } catch (error) {
            console.error('OAuth callback error:', error);
            throw new Error('Failed to complete OAuth authentication');
        }
    }

    /**
     * Completes user registration by selecting role and linking existing account
     */
    async completeRegistration(registrationData: RegisterRequest): Promise<LoginResponse> {
        try {
            const response: AxiosResponse<LoginResponse> = await apiService.post('/auth/complete-registration', registrationData);
            
            const { token, refreshToken, user } = response.data;
            
            // Update stored auth data
            this.storeAuthData(token, refreshToken, user);
            apiService.setAuthToken(token);
            
            return response.data;
        } catch (error) {
            console.error('Registration completion error:', error);
            throw new Error('Failed to complete registration');
        }
    }

    /**
     * Refreshes access token using refresh token
     */
    async refreshToken(): Promise<boolean> {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response: AxiosResponse<{token: string; refreshToken?: string}> = 
                await apiService.post('/auth/refresh', { refreshToken });

            const { token, refreshToken: newRefreshToken } = response.data;
            
            // Update stored tokens
            localStorage.setItem('accessToken', token);
            if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
            }
            
            apiService.setAuthToken(token);
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.logout();
            return false;
        }
    }

    /**
     * Gets current authenticated user
     */
    async getCurrentUser(): Promise<OAuthUser | null> {
        try {
            const response: AxiosResponse<OAuthUser> = await apiService.get('/auth/me');
            return response.data;
        } catch (error) {
            console.error('Failed to get current user:', error);
            return null;
        }
    }

    /**
     * Updates user role
     */
    async updateRole(role: UserRole): Promise<OAuthUser | null> {
        try {
            const response: AxiosResponse<{user: OAuthUser}> = await apiService.put('/auth/role', { role });
            
            // Update stored user data
            const updatedUser = response.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            return updatedUser;
        } catch (error) {
            console.error('Update role error:', error);
            throw new Error('Failed to update role');
        }
    }

    /**
     * Links existing account with OAuth account
     */
    async linkAccount(username: string): Promise<OAuthUser | null> {
        try {
            const response: AxiosResponse<{user: OAuthUser}> = await apiService.post('/auth/link-account', { username });
            
            // Update stored user data
            const updatedUser = response.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            return updatedUser;
        } catch (error) {
            console.error('Link account error:', error);
            throw new Error('Failed to link account');
        }
    }

    /**
     * Logs out user and clears all auth data
     */
    logout(): void {
        // Clear local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Clear API service token
        apiService.clearAuthToken();
        
        // Redirect to home or login page
        window.location.href = '/';
    }

    /**
     * Checks if user is currently authenticated
     */
    isAuthenticated(): boolean {
        const token = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        return !!(token && user);
    }

    /**
     * Gets stored user data
     */
    getStoredUser(): OAuthUser | null {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Failed to parse stored user:', error);
            return null;
        }
    }

    /**
     * Gets user's role
     */
    getUserRole(): string | null {
        const user = this.getStoredUser();
        return user?.role || null;
    }

    /**
     * Checks if user has an active role
     */
    hasActiveRole(): boolean {
        const user = this.getStoredUser();
        return user?.role ? true : false;
    }

    // Private methods
    
    /**
     * Exchanges authorization code for Google tokens
     */
    private async exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
        const params = new URLSearchParams({
            client_id: OAUTH_CONFIG.clientId,
            client_secret: 'YOUR_GOOGLE_CLIENT_SECRET', // Should be moved to backend
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: OAUTH_CONFIG.redirectUri
        });

        const response = await fetch(this.GOOGLE_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString()
        });

        if (!response.ok) {
            throw new Error('Failed to exchange authorization code');
        }

        return await response.json() as GoogleTokenResponse;
    }

    /**
     * Stores authentication data in localStorage
     */
    private storeAuthData(token: string, refreshToken: string, user: OAuthUser): void {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Extracts authorization code from current URL
     */
    getAuthorizationCodeFromUrl(): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('code');
    }

    /**
     * Checks if current URL is OAuth callback
     */
    isOAuthCallback(): boolean {
        return window.location.pathname === '/auth/callback';
    }

    /**
     * Handles OAuth errors from URL
     */
    getOAuthError(): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('error');
    }
}

// Export singleton instance
const oauthService = new OAuthService();
export default oauthService;