// AuthContext.tsx
// React context for managing authentication state

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { oAuth2Service, User, AuthStatus } from '../services/OAuth2Service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (profileData: { fullName?: string; profilePicture?: string }) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First check if user is authenticated
      const authResponse = await oAuth2Service.getCurrentUser();
      
      if (authResponse.authenticated && authResponse.user) {
        const userData: User = {
          id: authResponse.user.id,
          userName: authResponse.user.userName,
          email: authResponse.user.email,
          fullName: authResponse.user.name,
          profilePicture: authResponse.user.picture || '',
          role: authResponse.user.role,
          isOAuth2User: true,
        };
        
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Authentication check failed:', err);
      setError(err instanceof Error ? err.message : 'Authentication check failed');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    try {
      setError(null);
      oAuth2Service.redirectToGoogleLogin();
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await oAuth2Service.logout();
      
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: { fullName?: string; profilePicture?: string }) => {
    try {
      setError(null);
      const updatedUser = await oAuth2Service.updateUserProfile(profileData);
      
      if (user) {
        setUser({
          ...user,
          fullName: updatedUser.fullName || user.fullName,
          profilePicture: updatedUser.profilePicture || user.profilePicture,
        });
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err instanceof Error ? err.message : 'Profile update failed');
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;