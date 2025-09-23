import axios from 'axios';

class CsrfService {
    private csrfToken: string | null = null;
    private csrfHeaderName: string = 'X-CSRF-TOKEN';

    // Get CSRF token from server
    async fetchCsrfToken(): Promise<string | null> {
        try {
            const response = await axios.get('http://localhost:8082/csrf', {
                withCredentials: true
            });
            
            this.csrfToken = response.data.token;
            this.csrfHeaderName = response.data.headerName || 'X-CSRF-TOKEN';
            
            return this.csrfToken;
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
            return null;
        }
    }

    // Get current CSRF token
    getCsrfToken(): string | null {
        return this.csrfToken;
    }

    // Get CSRF header name
    getCsrfHeaderName(): string {
        return this.csrfHeaderName;
    }

    // Set CSRF token manually (from login response)
    setCsrfToken(token: string, headerName?: string): void {
        this.csrfToken = token;
        if (headerName) {
            this.csrfHeaderName = headerName;
        }
    }

    // Clear CSRF token (on logout)
    clearCsrfToken(): void {
        this.csrfToken = null;
    }
}

export const csrfService = new CsrfService();