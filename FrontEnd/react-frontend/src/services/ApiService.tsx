import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { csrfService } from './CsrfService';

class ApiService {
    public axiosInstance: AxiosInstance; // Make public for OAuth service access

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:8082',
            withCredentials: true,  // Include cookies for CSRF
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'  // Custom header for CSRF protection
            }
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor to add CSRF token and JWT token
        this.axiosInstance.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                // Skip CSRF for OAuth endpoints
                const isOAuthEndpoint = config.url?.startsWith('/auth/');
                
                // Add CSRF token for state-changing requests (except OAuth endpoints)
                if (!isOAuthEndpoint && ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
                    let csrfToken = csrfService.getCsrfToken();
                    
                    // Fetch CSRF token if not available
                    if (!csrfToken) {
                        csrfToken = await csrfService.fetchCsrfToken();
                    }
                    
                    if (csrfToken) {
                        const headerName = csrfService.getCsrfHeaderName();
                        config.headers = config.headers || {};
                        config.headers[headerName] = csrfToken;
                    }
                }
                
                // Add JWT token if available (for OAuth authenticated requests)
                const jwtToken = localStorage.getItem('accessToken');
                if (jwtToken && !config.headers['Authorization']) {
                    config.headers = config.headers || {};
                    config.headers['Authorization'] = `Bearer ${jwtToken}`;
                }
                
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor to handle CSRF token updates and JWT token refresh
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                // Update CSRF token if provided in response
                if (response.data.csrfToken) {
                    csrfService.setCsrfToken(
                        response.data.csrfToken, 
                        response.data.csrfHeaderName
                    );
                }
                return response;
            },
            async (error) => {
                const originalRequest = error.config;
                
                // Handle JWT token expiration (401 Unauthorized)
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    
                    // Try to refresh JWT token
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        try {
                            // Call refresh endpoint
                            const response = await axios.post('http://localhost:8082/auth/refresh', {
                                refreshToken
                            });
                            
                            if (response.data.token) {
                                // Update tokens
                                localStorage.setItem('accessToken', response.data.token);
                                if (response.data.refreshToken) {
                                    localStorage.setItem('refreshToken', response.data.refreshToken);
                                }
                                
                                // Retry original request with new token
                                originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
                                return this.axiosInstance.request(originalRequest);
                            }
                        } catch (refreshError) {
                            // Refresh failed, redirect to login
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken'); 
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }
                    }
                }
                
                // Handle CSRF token expiration (403 Forbidden) - preserve original functionality
                if (error.response?.status === 403 && !error.config.url?.startsWith('/auth/')) {
                    // Try to refresh CSRF token and retry request
                    const newToken = await csrfService.fetchCsrfToken();
                    
                    if (newToken && error.config) {
                        const headerName = csrfService.getCsrfHeaderName();
                        error.config.headers[headerName] = newToken;
                        return this.axiosInstance.request(error.config);
                    }
                }
                
                return Promise.reject(error);
            }
        );
    }

    // OAuth-specific methods
    setAuthToken(token: string): void {
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('accessToken', token);
    }

    clearAuthToken(): void {
        delete this.axiosInstance.defaults.headers.common['Authorization'];
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    getAuthToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    // Standard HTTP methods with CSRF and JWT protection
    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get(url, config);
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post(url, data, config);
    }

    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put(url, data, config);
    }

    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.patch(url, data, config);
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.delete(url, config);
    }

    // Get the axios instance for advanced usage
    getInstance(): AxiosInstance {
        return this.axiosInstance;
    }
}

export const apiService = new ApiService();
export default apiService;