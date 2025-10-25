// OAuthSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { googleOAuthService } from '../../../../services/GoogleOAuthService';

const OAuthSuccess: React.FC = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        // Get user information from backend
        const response = await googleOAuthService.getCurrentUser();
        
        if (response.authenticated && response.user) {
          setUserInfo(response.user);
          
          // Store user info in session
          sessionStorage.setItem('user', JSON.stringify(response.user));
          sessionStorage.setItem('role', response.user.role || 'user');
          sessionStorage.setItem('username', response.user.userName);
          sessionStorage.setItem('authenticated', 'true');

          // Check if there's a redirect path stored
          const redirectPath = sessionStorage.getItem('oauth_redirect_path');
          sessionStorage.removeItem('oauth_redirect_path');

          // Redirect after 2 seconds
          setTimeout(() => {
            if (redirectPath) {
              history.push(redirectPath);
            } else {
              // Default redirect based on user role or to dashboard
              history.push('/FreelancerDashboard'); // You can customize this based on user role
            }
          }, 2000);
        } else {
          // Authentication failed, redirect to login
          setTimeout(() => {
            history.push('/');
          }, 2000);
        }
      } catch (error) {
        console.error('OAuth success handling failed:', error);
        setTimeout(() => {
          history.push('/');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthSuccess();
  }, [history]);

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        {isLoading ? (
          <>
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3>Completing sign-in...</h3>
            <p className="text-muted">Please wait while we set up your account.</p>
          </>
        ) : userInfo ? (
          <>
            <div className="mb-3">
              <i className="fas fa-check-circle text-success" style={{ fontSize: '3rem' }}></i>
            </div>
            <h3 className="text-success">Welcome, {userInfo.name || userInfo.userName}!</h3>
            <p className="text-muted">Successfully signed in with Google.</p>
            <p className="text-muted">Redirecting to your dashboard...</p>
          </>
        ) : (
          <>
            <div className="mb-3">
              <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
            </div>
            <h3 className="text-warning">Sign-in incomplete</h3>
            <p className="text-muted">There was an issue completing your sign-in.</p>
            <p className="text-muted">Redirecting to home page...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthSuccess;