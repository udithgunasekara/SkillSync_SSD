import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import oauthService from '../services/OAuthService';
import { SpinnerLoading } from '../utils/SpinnerLoading';

const OAuthCallback: React.FC = () => {
    const history = useHistory();
    const location = useLocation();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        handleOAuthCallback();
    }, []);

    const handleOAuthCallback = async () => {
        try {
            setIsLoading(true);
            
            // Parse URL parameters manually
            const params = new URLSearchParams(location.search);
            
            // Check for error in URL parameters
            const errorParam = params.get('error');
            if (errorParam) {
                setError('OAuth authentication was cancelled or failed');
                setTimeout(() => history.push('/login'), 3000);
                return;
            }

            // Get authorization code
            const code = params.get('code');
            if (!code) {
                setError('No authorization code received from Google');
                setTimeout(() => history.push('/login'), 3000);
                return;
            }

            // Handle OAuth callback
            const response = await oauthService.handleOAuthCallback(code);
            
            if (response.requiresRoleSelection) {
                // Redirect to role selection page with temporary data
                history.push('/auth/role-selection', {
                    user: response.user,
                    availableRoles: response.availableRoles
                });
            } else {
                // Complete authentication
                await login(response.user, response.token, response.refreshToken);
                
                // Redirect based on user role
                const userRole = response.user.role;
                switch (userRole) {
                    case 'ADMIN':
                        history.push('/admin/dashboard');
                        break;
                    case 'CLIENT':
                        history.push('/client/dashboard');
                        break;
                    case 'FREELANCER':
                        history.push('/freelancer/dashboard');
                        break;
                    default:
                        history.push('/dashboard');
                }
            }
        } catch (error: any) {
            console.error('OAuth callback error:', error);
            setError(error.message || 'Failed to complete authentication');
            setTimeout(() => history.push('/login'), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen d-flex align-items-center justify-content-center bg-light">
                <div className="text-center">
                    <SpinnerLoading />
                    <h2 className="mt-4 h3 text-dark">
                        Completing authentication...
                    </h2>
                    <p className="mt-2 text-muted">
                        Please wait while we set up your account
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen d-flex align-items-center justify-content-center bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card border-danger">
                                <div className="card-body text-center p-5">
                                    <div className="mb-4">
                                        <i className="fas fa-exclamation-triangle fa-3x text-danger"></i>
                                    </div>
                                    <h3 className="card-title text-danger mb-3">
                                        Authentication Failed
                                    </h3>
                                    <p className="card-text text-dark mb-4">
                                        {error}
                                    </p>
                                    <p className="text-muted small">
                                        Redirecting to login page...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default OAuthCallback;