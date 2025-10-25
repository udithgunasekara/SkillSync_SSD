// OAuthError.tsx
// Error page shown when OAuth2 authentication fails

import React, { useEffect, useState } from 'react';

interface OAuthErrorProps {
  redirectTo?: string;
  onRetry?: () => void;
  customMessage?: string;
}

export const OAuthError: React.FC<OAuthErrorProps> = ({ 
  redirectTo = '/', 
  onRetry,
  customMessage 
}) => {
  const [countdown, setCountdown] = useState(10);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Get error details from URL params if available
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (errorParam) {
      setError(errorDescription || errorParam);
    }

    // Countdown timer for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = redirectTo;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirectTo]);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.href = '/';
    }
  };

  const handleGoHome = () => {
    window.location.href = redirectTo;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Failed
          </h2>
          
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800">
              {customMessage || 
               error || 
               'Sorry, we encountered an issue while trying to sign you in with Google. Please try again.'}
            </p>
          </div>
          
          {/* Countdown */}
          <p className="mt-4 text-sm text-gray-600">
            Redirecting to home page in {countdown} seconds...
          </p>
          
          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleRetry}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Home Page
            </button>
          </div>
          
          {/* Additional Help */}
          <div className="mt-8 text-xs text-gray-500">
            <p>If you continue to experience issues, please:</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• Make sure cookies are enabled in your browser</li>
              <li>• Try clearing your browser cache</li>
              <li>• Check if you have any ad blockers that might interfere</li>
              <li>• Contact support if the problem persists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthError;