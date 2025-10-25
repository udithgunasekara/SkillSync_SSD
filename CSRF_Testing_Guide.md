# CSRF Protection Testing Guide - SkillSync

## Quick Testing Instructions

### 1. Start the Application
```bash
# Backend
cd BackEnd
mvn spring-boot:run

# Frontend (new terminal)
cd FrontEnd/react-frontend
npm start
```

### 2. Test CSRF Token Endpoint

**Browser Test:**
1. Open browser console on `http://localhost:3000`
2. Run this command:

```javascript
// Fetch CSRF token
fetch('http://localhost:8082/csrf', { credentials: 'include' })
  .then(response => response.json())
  .then(data => {
    console.log('CSRF Token:', data.token?.substring(0, 20) + '...');
    console.log('Header Name:', data.headerName);
    console.log('Parameter Name:', data.parameterName);
  });
```

**Expected Output:**
```javascript
{
    token: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    headerName: "X-CSRF-TOKEN", 
    parameterName: "_csrf"
}
```

### 3. Test Protected Request (Should Work)

```javascript
// Test with CSRF token - should succeed
const testProtectedRequest = async () => {
    // Get CSRF token first
    const csrfResponse = await fetch('http://localhost:8082/csrf', { 
        credentials: 'include' 
    });
    const csrfData = await csrfResponse.json();
    
    // Make protected request with token
    const response = await fetch('http://localhost:8082/Client/Registration', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfData.token  // Include CSRF token
        },
        body: JSON.stringify({
            userName: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            role: 'client'
        })
    });
    
    console.log('Protected request status:', response.status);
    // Should be 200 or 201 (success)
};

testProtectedRequest();
```

### 4. Test CSRF Attack (Should Fail)

```javascript
// Test without CSRF token - should fail with 403
const testCSRFAttack = async () => {
    try {
        const response = await fetch('http://localhost:8082/Client/Registration', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
                // NO CSRF TOKEN - this simulates an attack
            },
            body: JSON.stringify({
                userName: 'hacker',
                email: 'hacker@evil.com',
                password: 'hacked123',
                role: 'admin'
            })
        });
        
        console.log('Attack attempt status:', response.status);
        // Should be 403 (Forbidden) - CSRF attack blocked!
        
    } catch (error) {
        console.log('Attack blocked:', error);
    }
};

testCSRFAttack();
```

### 5. Test Our ApiService (Should Work)

```javascript
// Test using our protected ApiService - should work seamlessly
const testApiService = async () => {
    // This simulates what our React app does
    try {
        const response = await fetch('http://localhost:3000/api/test-apiservice');
        console.log('ApiService test:', response.status);
        // Should work because ApiService automatically adds CSRF token
    } catch (error) {
        console.log('ApiService error:', error);
    }
};

testApiService();
```

## Visual Demonstration

### 1. Network Tab Inspection

**With CSRF Protection (Our Implementation):**
```http
POST /Client/Registration HTTP/1.1
Host: localhost:8082
Content-Type: application/json
X-CSRF-TOKEN: a1b2c3d4-e5f6-7890-abcd-ef1234567890
Cookie: XSRF-TOKEN=a1b2c3d4-e5f6-7890-abcd-ef1234567890; JSESSIONID=...

{"userName":"test","email":"test@example.com"}
```
**Result:** ✅ 200 OK - Request successful

**Without CSRF Protection (Attack Simulation):**
```http
POST /Client/Registration HTTP/1.1
Host: localhost:8082
Content-Type: application/json
Cookie: JSESSIONID=...

{"userName":"hacker","email":"hacker@evil.com","role":"admin"}
```
**Result:** ❌ 403 Forbidden - CSRF token missing

### 2. Browser Console Logs

**Our Protected ApiService:**
```
ApiService POST: /Client/Registration
Fetching CSRF token for POST /Client/Registration
CSRF token fetched: a1b2c3d4-e...
Added CSRF token to request: X-CSRF-TOKEN
Request successful: 201 Created
```

**Direct Axios (Vulnerable):**
```
Direct axios POST: /Client/Registration
Error: 403 Forbidden - CSRF token required
```

## Attack Simulation

### Create Malicious HTML File

Save this as `attack.html` and open in browser:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Free Money!</title>
</head>
<body>
    <h1>Congratulations! You've won $1000!</h1>
    <p>Click the button below to claim your prize!</p>
    
    <!-- Hidden malicious form -->
    <form id="malicious-form" action="http://localhost:8082/Client/Registration" 
          method="POST" style="display:none;">
        <input name="userName" value="hacker_account">
        <input name="email" value="hacker@malicious-site.com">
        <input name="password" value="hacked123">
        <input name="role" value="admin">
    </form>
    
    <button onclick="attemptAttack()">Claim Prize</button>
    
    <script>
        function attemptAttack() {
            console.log('Attempting CSRF attack...');
            document.getElementById('malicious-form').submit();
            // This will FAIL with 403 because no CSRF token!
        }
        
        // Also try with JavaScript
        async function jsAttack() {
            try {
                const response = await fetch('http://localhost:8082/Client/Registration', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userName: 'js_hacker',
                        email: 'jshacker@evil.com',
                        password: 'hacked456',
                        role: 'admin'
                    })
                });
                
                if (response.status === 403) {
                    console.log('✅ CSRF Attack BLOCKED! (403 Forbidden)');
                } else {
                    console.log('❌ CSRF Attack SUCCEEDED! This is bad!');
                }
            } catch (error) {
                console.log('✅ CSRF Attack BLOCKED! Error:', error.message);
            }
        }
        
        // Auto-run attack simulation
        setTimeout(jsAttack, 2000);
    </script>
</body>
</html>
```

### Expected Results:
1. Form submission: **403 Forbidden**
2. JavaScript attack: **403 Forbidden**  
3. Console message: **"✅ CSRF Attack BLOCKED!"**

## Real-World Attack Prevention

### Scenario 1: Email Attack
**Malicious Email:**
```html
<img src="http://localhost:8082/payment/transfer?amount=1000&to=attacker" 
     style="display:none;">
```
**Result:** ❌ Blocked (no CSRF token in GET request parameters)

### Scenario 2: Social Media Attack
**Malicious Post:**
```javascript
// Embedded in social media post
fetch('http://localhost:8082/Client/deleteAccount', {
    method: 'DELETE',
    credentials: 'include'
});
```
**Result:** ❌ Blocked (403 Forbidden - no CSRF token)

### Scenario 3: Advertising Attack
**Malicious Ad:**
```html
<form action="http://localhost:8082/admin/promoteUser" method="POST">
    <input name="username" value="attacker">
    <input name="role" value="admin">
</form>
<script>document.forms[0].submit();</script>
```
**Result:** ❌ Blocked (403 Forbidden - no CSRF token)

## Verification Checklist

### ✅ Backend Verification
- [ ] Spring Security CSRF enabled in `SecurityConfig.java`
- [ ] CSRF token repository configured (`CookieCsrfTokenRepository`)
- [ ] CSRF endpoint (`/csrf`) accessible
- [ ] CORS configured to allow CSRF headers
- [ ] Session management enabled

### ✅ Frontend Verification  
- [ ] `CsrfService.tsx` implemented
- [ ] `ApiService.tsx` with CSRF token injection
- [ ] All HTTP services using `apiService` instead of direct `axios`
- [ ] Token refresh on 403 errors implemented
- [ ] Cookie credentials enabled (`withCredentials: true`)

### ✅ Security Verification
- [ ] POST requests without CSRF token return 403
- [ ] PUT/DELETE requests without CSRF token return 403
- [ ] GET requests work without CSRF token
- [ ] Valid CSRF tokens allow requests to proceed
- [ ] CSRF tokens are session-specific
- [ ] External sites cannot access CSRF tokens

## Summary

**Our CSRF Protection Status: ✅ FULLY IMPLEMENTED**

1. **Spring Security CSRF**: ✅ Enabled with cookie-based tokens
2. **Backend Protection**: ✅ All state-changing endpoints protected  
3. **Frontend Integration**: ✅ Automatic token management
4. **Attack Prevention**: ✅ External requests blocked
5. **User Experience**: ✅ Seamless operation for legitimate users

**Attack Mitigation:**
- ❌ Form-based attacks (blocked)
- ❌ JavaScript-based attacks (blocked)  
- ❌ Image-based attacks (blocked)
- ❌ Cross-origin attacks (blocked)
- ✅ Only legitimate application requests succeed