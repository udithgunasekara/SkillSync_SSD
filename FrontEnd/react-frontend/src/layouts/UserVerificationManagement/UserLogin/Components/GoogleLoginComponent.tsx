import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { googleOAuthService } from '../../../../services/GoogleOAuthService';
import { useHistory } from 'react-router-dom';
import './GoogleLoginComponent.css';

interface GoogleLoginComponentProps {
    onLoginSuccess?: (user: any) => void;
    onLoginError?: (error: any) => void;
    redirectTo?: string;
}

/**
 * Google OAuth Login Component
 * Provides Google Sign-In functionality with proper error handling
 */
export const GoogleLoginComponent: React.FC<GoogleLoginComponentProps> = ({
    onLoginSuccess,
    onLoginError,
    redirectTo = '/dashboard'
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const history = useHistory();

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!credentialResponse.credential) {
                throw new Error('No credential received from Google');
            }

            // Handle the credential response
            const result = await googleOAuthService.handleLoginSuccess(credentialResponse);
            
            if (result.success) {
                // Store user information
                localStorage.setItem('user', JSON.stringify(result.user));
                
                // Call success callback
                if (onLoginSuccess) {
                    onLoginSuccess(result.user);
                }

                // Redirect to dashboard or specified route
                history.push(redirectTo);
            } else {
                throw new Error(result.message || 'Login failed');
            }
        } catch (error: any) {
            console.error('Google login error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            setError(errorMessage);
            
            if (onLoginError) {
                onLoginError(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleError = () => {
        const errorMessage = 'Google login failed';
        setError(errorMessage);
        googleOAuthService.handleLoginError(errorMessage);
        
        if (onLoginError) {
            onLoginError(new Error(errorMessage));
        }
    };

    const handleDirectLogin = () => {
        // Alternative: redirect to backend OAuth2 endpoint
        window.location.href = googleOAuthService.getLoginUrl();
    };

    return (
        <GoogleOAuthProvider clientId={googleOAuthService.getClientId()}>
            <div className="google-login-container">
                <h3 className="login-title">Sign in with Google</h3>
                
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                )}

                <div className="google-login-options">
                    {/* Option 1: Google Login Button (JWT approach) */}
                    <div className="login-option">
                        <h5>Option 1: Direct Login</h5>
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleError}
                            useOneTap={false}
                            theme="outline"
                            size="large"
                            text="signin_with"
                            shape="rectangular"
                            logo_alignment="left"
                        />
                    </div>

                    {/* Option 2: Redirect to Backend OAuth2 */}
                    <div className="login-option mt-3">
                        <h5>Option 2: Redirect Login</h5>
                        <button 
                            className="btn btn-outline-primary d-flex align-items-center"
                            onClick={handleDirectLogin}
                            disabled={isLoading}
                        >
                            <i className="fab fa-google me-2"></i>
                            {isLoading ? 'Signing in...' : 'Sign in with Google'}
                        </button>
                    </div>
                </div>

                {isLoading && (
                    <div className="loading-overlay">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Signing you in...</p>
                    </div>
                )}

                <div className="oauth-info mt-4">
                    <h6>About OAuth/OpenID Connect</h6>
                    <p className="small text-muted">
                        This application uses Google OAuth 2.0 with OpenID Connect for secure authentication. 
                        Your Google account information is used only for login purposes and basic profile data.
                    </p>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginComponent;