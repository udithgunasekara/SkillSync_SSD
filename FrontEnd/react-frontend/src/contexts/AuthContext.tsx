import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { googleOAuthService } from '../services/GoogleOAuthService';

interface User {
    id?: number;
    username?: string;
    email: string;
    name: string;
    picture?: string;
    role?: string;
    provider: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Authentication Context Provider
 * Manages global authentication state for OAuth2/OpenID Connect
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status on app load
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        setIsLoading(true);
        try {
            // Check if user is stored in localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setIsAuthenticated(true);
            }

            // Verify with backend
            const status = await googleOAuthService.checkAuthStatus();
            if (status.authenticated) {
                const currentUser = await googleOAuthService.getCurrentUser();
                if (currentUser && currentUser.authenticated) {
                    const userData: User = {
                        id: currentUser.userId,
                        username: currentUser.username,
                        email: currentUser.email,
                        name: currentUser.name || currentUser.fullName,
                        picture: currentUser.picture,
                        role: currentUser.role,
                        provider: currentUser.provider || 'google'
                    };
                    setUser(userData);
                    setIsAuthenticated(true);
                    localStorage.setItem('user', JSON.stringify(userData));
                } else {
                    // Clear invalid data
                    setUser(null);
                    setIsAuthenticated(false);
                    localStorage.removeItem('user');
                }
            } else {
                // User not authenticated
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
        } finally {
            setIsLoading(false);
        }
    };

    const login = (userData: User) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await googleOAuthService.logout();
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
        }
    };

    const refreshUser = async () => {
        if (isAuthenticated) {
            await checkAuthStatus();
        }
    };

    const contextValue: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to use authentication context
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;