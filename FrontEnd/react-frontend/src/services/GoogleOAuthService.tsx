import { GoogleOAuthProvider } from '@react-oauth/google';
import { apiService } from './ApiService';

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'your-google-client-id';

/**
 * Google OAuth Service for handling authentication
 */
class GoogleOAuthService {
    private static instance: GoogleOAuthService;

    private constructor() {}

    public static getInstance(): GoogleOAuthService {
        if (!GoogleOAuthService.instance) {
            GoogleOAuthService.instance = new GoogleOAuthService();
        }
        return GoogleOAuthService.instance;
    }

    /**
     * Get Google Client ID
     */
    getClientId(): string {
        return GOOGLE_CLIENT_ID;
    }

    /**
     * Check if user is authenticated
     */
    async checkAuthStatus(): Promise<any> {
        try {
            const response = await apiService.get('/api/oauth2/status');
            return response.data;
        } catch (error) {
            console.error('Error checking auth status:', error);
            return { authenticated: false };
        }
    }

    /**
     * Get current user information
     */
    async getCurrentUser(): Promise<any> {
        try {
            const response = await apiService.get('/api/oauth2/user');
            return response.data;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    /**
     * Handle Google OAuth login success
     */
    async handleLoginSuccess(credentialResponse: any): Promise<any> {
        try {
            // Send the credential to the backend for verification
            const response = await apiService.post('/api/oauth2/verify', {
                credential: credentialResponse.credential
            });
            return response.data;
        } catch (error) {
            console.error('Error handling login success:', error);
            throw error;
        }
    }

    /**
     * Handle Google OAuth login error
     */
    handleLoginError(error: any): void {
        console.error('Google OAuth login error:', error);
    }

    /**
     * Initiate logout
     */
    async logout(): Promise<void> {
        try {
            await apiService.post('/api/oauth2/logout');
            // Clear any local storage or session data
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    /**
     * Get login URL for redirect-based flow
     */
    getLoginUrl(): string {
        return `${apiService.getInstance().defaults.baseURL}/oauth2/authorization/google`;
    }
}

export const googleOAuthService = GoogleOAuthService.getInstance();
export default googleOAuthService;