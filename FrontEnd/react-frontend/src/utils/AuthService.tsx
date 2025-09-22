import Cookies from 'js-cookie';

export const AuthService = {
    login: async (credentials: any, userType: 'freelancer' | 'client') => {
        const endpoint = userType === 'freelancer' 
            ? 'http://localhost:8082/Freelancer/login'
            : 'http://localhost:8082/Client/login';
            
        const response = await fetch(endpoint, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials)
        });
        
        return response.json();
    },

    logout: async () => {
        try {
            await fetch('http://localhost:8082/Freelancer/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } finally {
            Cookies.remove('_auth');
            window.location.href = '/';
        }
    },

    getAuthToken: () => {
        return Cookies.get('_auth');
    },

    isAuthenticated: () => {
        return !!Cookies.get('_auth');
    }
};