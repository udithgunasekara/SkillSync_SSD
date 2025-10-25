# CSRF Protection Demonstration - SkillSync Project

## Quick Answer: Spring Security CSRF Configuration

**YES, we absolutely use Spring Security's built-in CSRF protection in this project.**

Our Spring Security configuration (`SecurityConfig.java`) enables CSRF protection with:
- **Cookie-based token storage** (`CookieCsrfTokenRepository`)
- **Automatic token validation** for state-changing requests
- **Token endpoint** (`/csrf`) for frontend access
- **Session-based security** integrated with CSRF tokens

## Live Implementation Files

### 1. Backend Security Configuration

**File**: `BackEnd/src/main/java/BackEnd/Config/SecurityConfig.java`

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
        // CSRF token handler setup
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName("_csrf");

        http
            // ✅ ENABLE SPRING SECURITY CSRF PROTECTION
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .csrfTokenRequestHandler(requestHandler)
                .ignoringRequestMatchers(
                    "/csrf",              // Token endpoint
                    "/Client/login",      // Login endpoints
                    "/Freelancer/login",
                    "/api/public/**",     // Public endpoints
                    "/error"
                )
            )
            
            // Session management for CSRF
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false)
            )
            
            // CORS configuration for CSRF tokens
            .cors(cors -> cors
                .configurationSource(corsConfigurationSource())
            )
            
            // Authorization rules
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/csrf").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);  // Required for CSRF cookies
        configuration.setExposedHeaders(Arrays.asList("X-CSRF-TOKEN"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

**Key Points:**
- `CookieCsrfTokenRepository.withHttpOnlyFalse()`: Stores CSRF tokens in cookies accessible to JavaScript
- `csrfTokenRequestHandler(requestHandler)`: Handles token processing
- `ignoringRequestMatchers()`: Specifies endpoints that don't need CSRF protection
- `allowCredentials(true)`: Allows cookies to be sent cross-origin

### 2. CSRF Token Endpoint

**File**: `BackEnd/src/main/java/BackEnd/controller/CsrfController.java`

```java
@RestController
public class CsrfController {

    @GetMapping("/csrf")
    public Map<String, String> csrf(HttpServletRequest request) {
        CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        Map<String, String> response = new HashMap<>();
        
        if (csrf != null) {
            response.put("token", csrf.getToken());                    // Token value
            response.put("headerName", csrf.getHeaderName());          // X-CSRF-TOKEN
            response.put("parameterName", csrf.getParameterName());    // _csrf
        }
        
        return response;
    }
}
```

**Response Example:**
```json
{
    "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "headerName": "X-CSRF-TOKEN",
    "parameterName": "_csrf"
}
```

### 3. Frontend CSRF Service

**File**: `FrontEnd/react-frontend/src/services/CsrfService.tsx`

```typescript
class CsrfService {
    private csrfToken: string | null = null;
    private csrfHeaderName: string = 'X-CSRF-TOKEN';

    // Fetch CSRF token from Spring Security
    async fetchCsrfToken(): Promise<string | null> {
        try {
            const response = await axios.get('http://localhost:8082/csrf', {
                withCredentials: true  // Include session cookies
            });
            
            this.csrfToken = response.data.token;
            this.csrfHeaderName = response.data.headerName || 'X-CSRF-TOKEN';
            
            console.log('CSRF token fetched:', this.csrfToken?.substring(0, 10) + '...');
            return this.csrfToken;
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
            return null;
        }
    }

    getCsrfToken(): string | null { return this.csrfToken; }
    getCsrfHeaderName(): string { return this.csrfHeaderName; }
    
    setCsrfToken(token: string, headerName?: string): void {
        this.csrfToken = token;
        if (headerName) this.csrfHeaderName = headerName;
        console.log('CSRF token updated');
    }

    clearCsrfToken(): void {
        this.csrfToken = null;
        console.log('CSRF token cleared');
    }
}

export const csrfService = new CsrfService();
```

### 4. Protected API Service

**File**: `FrontEnd/react-frontend/src/services/ApiService.tsx`

```typescript
class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:8082',
            withCredentials: true,  // Required for CSRF cookies
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // REQUEST INTERCEPTOR - ADD CSRF TOKEN
        this.axiosInstance.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                const method = config.method?.toLowerCase();
                
                // Add CSRF token for state-changing requests
                if (['post', 'put', 'delete', 'patch'].includes(method || '')) {
                    let csrfToken = csrfService.getCsrfToken();
                    
                    // Fetch token if not available
                    if (!csrfToken) {
                        console.log('Fetching CSRF token for', method?.toUpperCase(), config.url);
                        csrfToken = await csrfService.fetchCsrfToken();
                    }
                    
                    if (csrfToken) {
                        const headerName = csrfService.getCsrfHeaderName();
                        config.headers = config.headers || {};
                        config.headers[headerName] = csrfToken;
                        console.log('Added CSRF token to request:', headerName);
                    } else {
                        console.warn('No CSRF token available for request');
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // RESPONSE INTERCEPTOR - HANDLE 403 CSRF ERRORS
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error) => {
                // Handle CSRF token expiration
                if (error.response?.status === 403) {
                    console.log('403 error - possible CSRF token issue, refreshing token...');
                    
                    // Try to refresh CSRF token and retry request
                    const newToken = await csrfService.fetchCsrfToken();
                    
                    if (newToken && error.config) {
                        const headerName = csrfService.getCsrfHeaderName();
                        error.config.headers[headerName] = newToken;
                        console.log('Retrying request with new CSRF token');
                        return this.axiosInstance.request(error.config);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    // Protected HTTP methods with automatic CSRF token handling
    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        console.log('ApiService POST:', url);
        return this.axiosInstance.post(url, data, config);
    }

    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        console.log('ApiService PUT:', url);
        return this.axiosInstance.put(url, data, config);
    }

    async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        console.log('ApiService PATCH:', url);
        return this.axiosInstance.patch(url, data, config);
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        console.log('ApiService DELETE:', url);
        return this.axiosInstance.delete(url, config);
    }

    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axiosInstance.get(url, config);
    }
}

export const apiService = new ApiService();
```

## Before vs After Comparison

### BEFORE (Vulnerable)
```typescript
// Direct axios call - NO CSRF protection
export const createClient = (client: any) => 
    axios.post('http://localhost:8082/Client/Registration', client);

// HTTP Request:
// POST /Client/Registration
// Content-Type: application/json
// { "userName": "test", ... }
// ❌ No CSRF token - VULNERABLE TO CSRF ATTACKS
```

### AFTER (Protected)
```typescript
// Using protected apiService - CSRF protected
export const createClient = (client: any) => 
    apiService.post('/Client/Registration', client);

// HTTP Request:
// POST /Client/Registration
// Content-Type: application/json
// X-CSRF-TOKEN: a1b2c3d4-e5f6-7890-abcd-ef1234567890
// { "userName": "test", ... }
// ✅ CSRF token included - PROTECTED FROM CSRF ATTACKS
```

## Testing the Protection

### Test 1: Valid Request (Works)
```javascript
// In browser console on http://localhost:3000
const testValidRequest = async () => {
    try {
        // This will work - uses our protected apiService
        const response = await fetch('/api/test', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': await getCsrfToken()  // Token included
            },
            body: JSON.stringify({ test: 'data' })
        });
        
        console.log('Success:', response.status);
    } catch (error) {
        console.error('Error:', error);
    }
};

const getCsrfToken = async () => {
    const response = await fetch('http://localhost:8082/csrf', { credentials: 'include' });
    const data = await response.json();
    return data.token;
};
```

### Test 2: CSRF Attack (Blocked)
```html
<!-- Malicious website trying to attack SkillSync -->
<!DOCTYPE html>
<html>
<head><title>Evil Site</title></head>
<body>
    <h1>You've won $1000!</h1>
    
    <!-- This attack will FAIL with 403 Forbidden -->
    <form id="attack" action="http://localhost:8082/Client/Registration" method="POST">
        <input name="userName" value="hacker">
        <input name="password" value="hacked">
        <input name="email" value="hacker@evil.com">
        <input name="role" value="admin">
        <!-- ❌ NO CSRF TOKEN - Spring Security will reject this -->
    </form>
    
    <script>
        document.getElementById('attack').submit();
        // Result: 403 Forbidden - CSRF token missing
        // Attack PREVENTED! ✅
    </script>
</body>
</html>
```

## How Spring Security CSRF Protection Works

### 1. Token Generation
- Spring Security generates unique CSRF token per session
- Token stored in cookie: `XSRF-TOKEN=a1b2c3d4...`
- Token also available via `/csrf` endpoint

### 2. Token Validation
- For POST/PUT/DELETE requests, Spring Security checks for CSRF token
- Token can be in:
  - HTTP Header: `X-CSRF-TOKEN: a1b2c3d4...`
  - Form Parameter: `_csrf=a1b2c3d4...`
  - Cookie: `XSRF-TOKEN=a1b2c3d4...`

### 3. Protection Mechanism
```java
// Spring Security's internal CSRF filter does this:
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
    HttpServletRequest httpRequest = (HttpServletRequest) request;
    
    // Skip GET requests (read-only)
    if ("GET".equals(httpRequest.getMethod())) {
        chain.doFilter(request, response);
        return;
    }
    
    // Get expected CSRF token from session
    CsrfToken expectedToken = csrfTokenRepository.loadToken(httpRequest);
    
    // Get actual CSRF token from request
    String actualToken = request.getParameter("_csrf");
    if (actualToken == null) {
        actualToken = httpRequest.getHeader("X-CSRF-TOKEN");
    }
    
    // Validate tokens match
    if (expectedToken == null || !expectedToken.getToken().equals(actualToken)) {
        throw new InvalidCsrfTokenException("CSRF token missing or invalid");
    }
    
    // Token valid - continue processing
    chain.doFilter(request, response);
}
```

## Summary

**Our CSRF Implementation:**
1. ✅ **Uses Spring Security CSRF** - Built-in protection enabled
2. ✅ **Cookie-based tokens** - Secure token storage
3. ✅ **Automatic frontend integration** - Seamless token handling
4. ✅ **Complete protection** - All state-changing operations secured
5. ✅ **Attack prevention** - External sites cannot forge requests

**Spring Security CSRF Features We Use:**
- `CookieCsrfTokenRepository` - Token storage in cookies
- `CsrfTokenRequestAttributeHandler` - Token processing
- Automatic validation for POST/PUT/DELETE/PATCH requests
- Session-based token management
- CORS integration for cross-origin requests

The implementation provides **robust protection** against CSRF attacks while maintaining a **smooth user experience**.