# Complete CSRF Security Implementation Guide

## Table of Contents
1. [What is CSRF?](#what-is-csrf)
2. [How CSRF Attacks Work](#how-csrf-attacks-work)
3. [CSRF Vulnerability in SkillSync](#csrf-vulnerability-in-skillsync)
4. [Our CSRF Protection Implementation](#our-csrf-protection-implementation)
5. [Spring Security CSRF Configuration](#spring-security-csrf-configuration)
6. [Demonstration Examples](#demonstration-examples)
7. [Testing CSRF Protection](#testing-csrf-protection)

## What is CSRF?

**Cross-Site Request Forgery (CSRF)** is a security vulnerability that tricks authenticated users into performing unwanted actions on a web application. It exploits the trust that a website has in the user's browser.

### Key Characteristics:
- **Victim**: An authenticated user
- **Attacker**: Malicious website/email/script
- **Target**: Web application that trusts the user
- **Method**: Forged requests using victim's session

## How CSRF Attacks Work

### 1. Basic Attack Flow
```
1. User logs into SkillSync (gets session cookie)
2. User visits malicious website (while still logged in)
3. Malicious website sends request to SkillSync using user's session
4. SkillSync processes request as if user intended it
```

### 2. Attack Examples

#### Example 1: Money Transfer Attack
```html
<!-- Malicious website: evil-site.com -->
<img src="http://localhost:8082/payment/create?amount=1000&toAccount=attacker" 
     style="display:none;">
```

#### Example 2: Profile Change Attack
```javascript
// Malicious JavaScript
fetch('http://localhost:8082/Client/Registration', {
    method: 'POST',
    credentials: 'include',  // Include session cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        userName: 'hacker_account',
        password: 'hacked123',
        email: 'hacker@evil.com',
        role: 'admin'
    })
});
```

#### Example 3: Hidden Form Attack
```html
<form id="hack" action="http://localhost:8082/QualificationHandler/reject/Application" 
      method="POST" style="display:none;">
    <input name="userName" value="victim_user">
    <input name="reason" value="Account compromised">
</form>
<script>document.getElementById('hack').submit();</script>
```

## CSRF Vulnerability in SkillSync

### Before Our Fix - Vulnerable Code

#### 1. Backend - No CSRF Protection
```java
// BackEnd/src/main/java/BackEnd/controller/ClientController.java
@RestController
@RequestMapping(path = "/Client")
public class ClientController {
    
    // VULNERABLE: No CSRF token validation
    @PostMapping("/Registration")
    public ResponseEntity<ClientDTO> createClient(@RequestBody ClientDTO clientDTO){
        ClientDTO saveClient = clientService.createClient(clientDTO);
        return new ResponseEntity<>(saveClient, HttpStatus.CREATED);
    }
}
```

#### 2. Frontend - Direct Axios Calls
```typescript
// VULNERABLE: No CSRF token in requests
export const createClient = (client:any) => 
    axios.post('http://localhost:8082/Client/Registration', client);

export const makePayment = (payment: Payment) => 
    axios.post('http://localhost:8082/payment', payment);
```

### Vulnerability Impact
- **Account Creation**: Attackers could create admin accounts
- **Financial Fraud**: Unauthorized money transfers
- **Data Manipulation**: Profile changes, file uploads
- **System Compromise**: Admin function abuse

## Our CSRF Protection Implementation

### 1. Spring Security Configuration (Backend)

We **YES, absolutely used Spring Security's built-in CSRF protection**. Here's our configuration:

```java
// BackEnd/src/main/java/BackEnd/Config/SecurityConfig.java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName("_csrf");

        http
            // Enable CSRF protection with cookie-based tokens
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .csrfTokenRequestHandler(requestHandler)
                .ignoringRequestMatchers(
                    "/api/public/**",     // Public endpoints
                    "/Client/login",      // Login (handled separately)
                    "/Freelancer/login",  // Login (handled separately)
                    "/csrf",              // CSRF token endpoint
                    "/error"              // Error endpoints
                )
            )
            
            // Session management
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false)
            )
            
            // Authorization rules
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/csrf").permitAll()  // Allow CSRF token access
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
```

### 2. CSRF Token Endpoint (Backend)

```java
// BackEnd/src/main/java/BackEnd/controller/CsrfController.java
@RestController
public class CsrfController {

    @GetMapping("/csrf")
    public Map<String, String> csrf(HttpServletRequest request) {
        CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        Map<String, String> response = new HashMap<>();
        
        if (csrf != null) {
            response.put("token", csrf.getToken());
            response.put("headerName", csrf.getHeaderName());      // Usually "X-CSRF-TOKEN"
            response.put("parameterName", csrf.getParameterName()); // Usually "_csrf"
        }
        
        return response;
    }
}
```

### 3. Frontend CSRF Service

```typescript
// FrontEnd/react-frontend/src/services/CsrfService.tsx
class CsrfService {
    private csrfToken: string | null = null;
    private csrfHeaderName: string = 'X-CSRF-TOKEN';

    // Fetch CSRF token from backend
    async fetchCsrfToken(): Promise<string | null> {
        try {
            const response = await axios.get('http://localhost:8082/csrf', {
                withCredentials: true  // Include session cookies
            });
            
            this.csrfToken = response.data.token;
            this.csrfHeaderName = response.data.headerName || 'X-CSRF-TOKEN';
            
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
    }

    clearCsrfToken(): void { this.csrfToken = null; }
}

export const csrfService = new CsrfService();
```

### 4. Protected API Service

```typescript
// FrontEnd/react-frontend/src/services/ApiService.tsx
class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:8082',
            withCredentials: true,  // Include cookies for CSRF
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor - ADD CSRF TOKEN
        this.axiosInstance.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                // Add CSRF token for state-changing requests
                if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
                    let csrfToken = csrfService.getCsrfToken();
                    
                    // Fetch token if not available
                    if (!csrfToken) {
                        csrfToken = await csrfService.fetchCsrfToken();
                    }
                    
                    if (csrfToken) {
                        const headerName = csrfService.getCsrfHeaderName();
                        config.headers = config.headers || {};
                        config.headers[headerName] = csrfToken;  // Add X-CSRF-TOKEN header
                    }
                }
                return config;
            }
        );

        // Response interceptor - HANDLE TOKEN REFRESH
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
                // Handle CSRF token expiration (403 Forbidden)
                if (error.response?.status === 403) {
                    // Refresh CSRF token and retry request
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

    // Protected HTTP methods
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
}

export const apiService = new ApiService();
```

### 5. Secure Service Implementation

```typescript
// FrontEnd/react-frontend/src/layouts/UserVerificationManagement/Services/UserManagementService.tsx
import { apiService } from '../../../services/ApiService';

// SECURE: Using protected apiService instead of direct axios
export const createFreelancer = (freelancer: any) => 
    apiService.post('/Freelancer/Registration', freelancer);

export const createClient = (client: any) => 
    apiService.post('/Client/Registration', client);

export const checkAccountStatus = (username: string) => 
    apiService.get<boolean>(`/Freelancer/checkAccountStatus/${username}`);
```

## Spring Security CSRF Configuration Explained

**YES, we absolutely use Spring Security's built-in CSRF protection.** Here's how:

### 1. CSRF Token Repository
```java
.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
```
- **Purpose**: Stores CSRF tokens in HTTP cookies
- **`withHttpOnlyFalse()`**: Allows JavaScript to read the cookie (needed for SPA)
- **Alternative**: `HttpSessionCsrfTokenRepository` (session-based storage)

### 2. CSRF Token Request Handler
```java
CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
requestHandler.setCsrfRequestAttributeName("_csrf");
```
- **Purpose**: Handles how CSRF tokens are processed in requests
- **Attribute**: Makes token available as request attribute

### 3. Ignored Endpoints
```java
.ignoringRequestMatchers(
    "/api/public/**",     // Public APIs
    "/Client/login",      // Login endpoints
    "/Freelancer/login",
    "/csrf",              // Token endpoint
    "/error"              // Error pages
)
```
- **Purpose**: Bypass CSRF protection for specific endpoints
- **Login**: Often exempt to avoid chicken-and-egg problem
- **Public APIs**: Don't require authentication

### 4. Session Management
```java
.sessionManagement(session -> session
    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
    .maximumSessions(1)
    .maxSessionsPreventsLogin(false)
)
```
- **Purpose**: Manage user sessions for CSRF token validation
- **Sessions**: Required for CSRF token storage and validation

## Demonstration Examples

### Example 1: Before Fix (Vulnerable)

#### Attacker's Malicious Website
```html
<!DOCTYPE html>
<html>
<head><title>Win $1000!</title></head>
<body>
    <h1>Congratulations! Click to claim your prize!</h1>
    
    <!-- Hidden malicious form -->
    <form id="attack" action="http://localhost:8082/payment/create" method="POST" style="display:none;">
        <input name="amount" value="500">
        <input name="toAccount" value="attacker_account">
        <input name="fromAccount" value="victim_account">
    </form>
    
    <script>
        // Auto-submit when page loads
        window.onload = function() {
            document.getElementById('attack').submit();
        }
    </script>
</body>
</html>
```

#### Result WITHOUT CSRF Protection:
- User visits malicious site
- Form submits automatically
- SkillSync processes payment (user is authenticated)
- **Money is transferred to attacker!**

### Example 2: After Fix (Protected)

#### Same Malicious Attack Attempt
```html
<!-- Same malicious form as above -->
<form id="attack" action="http://localhost:8082/payment/create" method="POST">
    <input name="amount" value="500">
    <input name="toAccount" value="attacker_account">
    <!-- Missing CSRF token! -->
</form>
```

#### Result WITH CSRF Protection:
1. Form submits without CSRF token
2. Spring Security validates request
3. **Request REJECTED** with 403 Forbidden
4. No money transfer occurs
5. **Attack prevented!**

### Example 3: Legitimate Request (Works)

#### Our Protected Frontend
```typescript
// User clicks "Make Payment" button
const handlePayment = async () => {
    try {
        // apiService automatically adds CSRF token
        const response = await apiService.post('/payment/create', {
            amount: 100,
            toAccount: 'legitimate_account',
            fromAccount: userAccount
        });
        
        // Success: CSRF token was valid
        console.log('Payment successful:', response.data);
    } catch (error) {
        console.error('Payment failed:', error);
    }
};
```

#### HTTP Request Generated
```http
POST /payment/create HTTP/1.1
Host: localhost:8082
Content-Type: application/json
X-CSRF-TOKEN: a1b2c3d4-e5f6-7890-abcd-ef1234567890  # Automatically added
Cookie: XSRF-TOKEN=a1b2c3d4-e5f6-7890-abcd-ef1234567890; JSESSIONID=...

{
    "amount": 100,
    "toAccount": "legitimate_account",
    "fromAccount": "user_account"
}
```

## Testing CSRF Protection

### 1. Test with Browser Developer Tools

#### Step 1: Get CSRF Token
```javascript
// In browser console
fetch('http://localhost:8082/csrf', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log);

// Output: { token: "abc123...", headerName: "X-CSRF-TOKEN" }
```

#### Step 2: Test Valid Request
```javascript
// With CSRF token (should work)
fetch('http://localhost:8082/Client/Registration', {
    method: 'POST',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': 'abc123...'  // Include token
    },
    body: JSON.stringify({ userName: 'test', email: 'test@example.com' })
});
```

#### Step 3: Test Invalid Request
```javascript
// Without CSRF token (should fail)
fetch('http://localhost:8082/Client/Registration', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName: 'test', email: 'test@example.com' })
});

// Result: 403 Forbidden - CSRF token missing
```

### 2. Test with Curl Commands

#### Valid Request
```bash
# Step 1: Get session and CSRF token
curl -c cookies.txt http://localhost:8082/csrf

# Step 2: Extract token and make request
curl -b cookies.txt \
     -H "Content-Type: application/json" \
     -H "X-CSRF-TOKEN: your-token-here" \
     -d '{"userName":"test","email":"test@example.com"}' \
     http://localhost:8082/Client/Registration
```

#### Invalid Request
```bash
# Request without CSRF token - should fail with 403
curl -b cookies.txt \
     -H "Content-Type: application/json" \
     -d '{"userName":"test","email":"test@example.com"}' \
     http://localhost:8082/Client/Registration
```

## Key Security Benefits

### 1. **Origin Validation**
- Requests must include valid CSRF token
- Tokens are tied to user sessions
- External sites cannot access tokens

### 2. **State-Changing Protection**
- POST, PUT, DELETE, PATCH requests protected
- GET requests allowed (read-only)
- File uploads protected

### 3. **Automatic Token Management**
- Frontend automatically includes tokens
- Token refresh on expiration
- Session-based validation

### 4. **Defense in Depth**
- CSRF + CORS protection
- Session management
- Secure cookie settings

## Conclusion

Our CSRF implementation provides comprehensive protection by:

1. **Using Spring Security's built-in CSRF protection** ✅
2. **Implementing automatic token management** ✅ 
3. **Protecting all state-changing operations** ✅
4. **Providing seamless user experience** ✅

The protection is **transparent to users** but **blocks malicious requests** effectively, making CSRF attacks nearly impossible against our application.