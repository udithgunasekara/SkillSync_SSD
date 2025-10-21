// Google OAuth Configuration
export const GOOGLE_CONFIG = {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID_HERE', // Replace with your actual Google Client ID
    REDIRECT_URI: 'http://localhost:3000',
    SCOPE: 'openid email profile',
    RESPONSE_TYPE: 'id_token',
    DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest']
};

// Backend API endpoints  
export const API_CONFIG = {
    BASE_URL: 'http://localhost:8082',
    ENDPOINTS: {
        GOOGLE_AUTH: '/auth/google',
        COMPLETE_REGISTRATION: '/auth/complete-registration',  
        REFRESH_TOKEN: '/auth/refresh',
        GET_CURRENT_USER: '/auth/me',
        UPDATE_ROLE: '/auth/role',
        LINK_ACCOUNT: '/auth/link-account',
        LOGOUT: '/auth/logout'
    }
};

// User roles
export const USER_ROLES = {
    FREELANCER: 'FREELANCER',
    CLIENT: 'CLIENT', 
    ADMIN: 'ADMIN'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// OAuth User interface
export interface OAuthUser {
    id?: number;
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    role?: UserRole;
    linkedUsername?: string;
    isActive?: boolean;
    createdAt?: string;
    lastLogin?: string;
}

// Authentication response interface
export interface AuthResponse {
    token?: string;
    refreshToken?: string;
    user?: OAuthUser;
    isNewUser?: boolean;
    needsRoleSelection?: boolean;
    message: string;
}

// Google token request interface  
export interface GoogleTokenRequest {
    idToken: string;
    role?: UserRole;
    linkedUsername?: string;
}