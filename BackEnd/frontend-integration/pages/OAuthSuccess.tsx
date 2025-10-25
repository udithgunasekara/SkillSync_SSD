// OAuthSuccess.tsx
// Success page shown after successful OAuth2 authentication

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface OAuthSuccessProps {
  redirectTo?: string;
  onSuccess?: (user: any) => void;
}

export const OAuthSuccess: React.FC<OAuthSuccessProps> = ({ 
  redirectTo = '/dashboard', 
  onSuccess 
}) => {
  const { user, checkAuth, isLoading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        // Re-check authentication to get updated user data
        await checkAuth();
        setChecking(false);
        
        // Wait a moment for the auth context to update
        setTimeout(() => {
          if (onSuccess && user) {
            onSuccess(user);
          } else {
            // Redirect to specified page or dashboard
            window.location.href = redirectTo;
          }
        }, 1000);
      } catch (error) {
        console.error('Error checking auth after OAuth success:', error);
        setChecking(false);
        // Redirect to error page or home
        window.location.href = '/oauth/error';
      }
    };

    handleSuccess();
  }, [checkAuth, user, redirectTo, onSuccess]);

  if (checking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            {/* Success Icon with Animation */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg
                className="h-10 w-10 text-green-600 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Authentication Successful!
            </h2>
            
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we set up your account...
            </p>
            
            {/* Loading Spinner */}
            <div className="mt-6 flex justify-center">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to SkillSync!
          </h2>
          
          {user && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="text-lg font-semibold text-gray-900">{user.fullName || user.userName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          )}
          
          <p className="mt-4 text-sm text-gray-600">
            Redirecting you to the dashboard...
          </p>
          
          <div className="mt-6">
            <button
              onClick={() => window.location.href = redirectTo}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccess;