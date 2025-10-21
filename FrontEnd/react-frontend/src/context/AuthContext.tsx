import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { OAuthUser, UserRole } from '../config/OAuthConfig';
import oauthService from '../services/OAuthService';
import apiService from '../services/ApiService';

interface AuthState {
    user: OAuthUser | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    needsRoleSelection: boolean;
}

interface AuthContextType extends AuthState {
    login: (user: OAuthUser, token: string, refreshToken: string) => void;
    logout: () => void;
    updateUser: (user: OAuthUser) => void;
    updateRole: (role: UserRole) => Promise<boolean>;
    linkAccount: (username: string) => Promise<boolean>;
    setNeedsRoleSelection: (needs: boolean) => void;
    clearError: () => void;
    refreshAuth: () => Promise<boolean>;
}

type AuthAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'LOGIN'; payload: { user: OAuthUser; token: string; refreshToken: string } }
    | { type: 'LOGOUT' }
    | { type: 'UPDATE_USER'; payload: OAuthUser }
    | { type: 'SET_NEEDS_ROLE_SELECTION'; payload: boolean }
    | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    needsRoleSelection: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'LOGIN':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                needsRoleSelection: false,
            };
        case 'LOGOUT':
            return {
                ...initialState,
                isLoading: false,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'SET_NEEDS_ROLE_SELECTION':
            return {
                ...state,
                needsRoleSelection: action.payload,
            };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Initialize authentication state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem('refreshToken');
                const userStr = localStorage.getItem('user');

                if (token && refreshToken && userStr) {
                    const user = JSON.parse(userStr);
                    
                    // Set token and try to validate by getting current user
                    try {
                        // Set token for request
                        apiService.setAuthToken(token);
                        
                        // Try to get current user to validate token
                        const currentUser = await oauthService.getCurrentUser();
                        if (currentUser) {
                            dispatch({
                                type: 'LOGIN',
                                payload: { user: currentUser, token, refreshToken }
                            });
                        } else {
                            throw new Error('Invalid token');
                        }
                    } catch (error) {
                        // Token invalid, try to refresh
                        const refreshed = await refreshAuth();
                        if (!refreshed) {
                            // Clear invalid tokens
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                            localStorage.removeItem('user');
                            apiService.clearAuthToken();
                        }
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        initializeAuth();
    }, []);

    const login = (user: OAuthUser, token: string, refreshToken: string) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
            type: 'LOGIN',
            payload: { user, token, refreshToken }
        });
    };

    const logout = async () => {
        try {
            // Call backend logout endpoint
            await oauthService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken'); 
            localStorage.removeItem('user');
            
            // Clear traditional session storage (compatibility)
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('id');
            sessionStorage.removeItem('role');
            
            dispatch({ type: 'LOGOUT' });
        }
    };

    const updateUser = (user: OAuthUser) => {
        localStorage.setItem('user', JSON.stringify(user));
        dispatch({ type: 'UPDATE_USER', payload: user });
    };

    const updateRole = async (role: UserRole): Promise<boolean> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            const updatedUser = await oauthService.updateRole(role);
            if (updatedUser) {
                updateUser(updatedUser);
                dispatch({ type: 'SET_NEEDS_ROLE_SELECTION', payload: false });
                return true;
            }
            return false;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to update role' });
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const linkAccount = async (username: string): Promise<boolean> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            const updatedUser = await oauthService.linkAccount(username);
            if (updatedUser) {
                updateUser(updatedUser);
                return true;
            }
            return false;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to link account' });
            return false;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const refreshAuth = async (): Promise<boolean> => {
        try {
            const success = await oauthService.refreshToken();
            if (success) {
                // Get updated user data after successful token refresh
                const currentUser = await oauthService.getCurrentUser();
                if (currentUser) {
                    const newToken = localStorage.getItem('accessToken');
                    const newRefreshToken = localStorage.getItem('refreshToken');
                    if (newToken && newRefreshToken) {
                        dispatch({
                            type: 'LOGIN',
                            payload: { user: currentUser, token: newToken, refreshToken: newRefreshToken }
                        });
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    };

    const setNeedsRoleSelection = (needs: boolean) => {
        dispatch({ type: 'SET_NEEDS_ROLE_SELECTION', payload: needs });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const contextValue: AuthContextType = {
        ...state,
        login,
        logout,
        updateUser,
        updateRole,
        linkAccount,
        setNeedsRoleSelection,
        clearError,
        refreshAuth,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}