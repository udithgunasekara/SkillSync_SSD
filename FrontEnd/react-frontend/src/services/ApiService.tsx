import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { csrfService } from './CsrfService';

class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082',
            withCredentials: true,  // Include cookies for CSRF
            timeout: 10000, // 10 second timeout
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'  // Custom header for CSRF protection
            }
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor to add CSRF token
        this.axiosInstance.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                // Add CSRF token for state-changing requests
                if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
                    let csrfToken = csrfService.getCsrfToken();
                    
                    // Fetch CSRF token if not available
                    if (!csrfToken) {
                        try {
                            csrfToken = await csrfService.fetchCsrfToken();
                        } catch (error) {
                            console.warn('Failed to fetch CSRF token:', error);
                        }
                    }
                    
                    if (csrfToken && config.headers) {
                        const headerName = csrfService.getCsrfHeaderName();
                        config.headers[headerName] = csrfToken;
                    }
                }
                
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor to handle CSRF token updates
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                // Update CSRF token if provided in response
                if (response.data?.csrfToken) {
                    csrfService.setCsrfToken(
                        response.data.csrfToken, 
                        response.data.csrfHeaderName
                    );
                }
                return response;
            },
            async (error) => {
                // Handle CSRF token expiration (403 Forbidden)
                if (error.response?.status === 403) {
                    try {
                        // Try to refresh CSRF token and retry request
                        const newToken = await csrfService.fetchCsrfToken();
                        
                        if (newToken && error.config) {
                            const headerName = csrfService.getCsrfHeaderName();
                            error.config.headers[headerName] = newToken;
                            return this.axiosInstance.request(error.config);
                        }
                    } catch (retryError) {
                        console.error('Failed to retry request with new CSRF token:', retryError);
                    }
                }
                
                return Promise.reject(error);
            }
        );
    }

    // Generic HTTP methods with proper TypeScript support
    async get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get<T>(url, config);
    }

    async post<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
        return this.axiosInstance.post<T>(url, data, config);
    }

    async put<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
        return this.axiosInstance.put<T>(url, data, config);
    }

    async delete<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
        return this.axiosInstance.delete<T>(url, config);
    }

    async patch<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
        return this.axiosInstance.patch<T>(url, data, config);
    }

    // Get the axios instance for advanced usage
    getInstance(): AxiosInstance {
        return this.axiosInstance;
    }
}

export const apiService = new ApiService();
export default apiService;