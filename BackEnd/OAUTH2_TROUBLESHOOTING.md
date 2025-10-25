# OAuth2 Troubleshooting Guide

## 🔧 **Current Issue Resolution**

The error you're getting indicates that the OAuth2 endpoints are not properly configured. I've made the following fixes:

### **Changes Made:**

1. **Fixed SecurityConfig** - Removed custom OAuth2 endpoint configurations
2. **Simplified application.yml** - Removed custom provider settings (Spring Boot has built-in Google provider)
3. **Added OAuth2TestController** - For testing the configuration

### **Test Steps:**

1. **Restart your Spring Boot application**
   ```bash
   # Stop the current application and restart it
   mvn spring-boot:run
   ```

2. **Test OAuth2 configuration**
   Visit: `http://localhost:8082/api/oauth2/test`
   
   This should return OAuth2 configuration details.

3. **Test Google OAuth URL**
   Visit: `http://localhost:8082/api/oauth2/google-login-url`
   
   This should return the correct OAuth URLs.

4. **Test the actual OAuth flow**
   Visit: `http://localhost:8082/oauth2/authorization/google`
   
   This should now redirect to Google's OAuth page.

### **Expected Flow:**

1. **User visits:** `http://localhost:8082/oauth2/authorization/google`
2. **Redirects to:** Google OAuth consent screen
3. **After consent, Google redirects to:** `http://localhost:8082/login/oauth2/code/google`
4. **Spring Boot processes the callback**
5. **Redirects to:** `http://localhost:3000/oauth/success` (configured in SecurityConfig)

### **If Still Getting 404:**

Check these potential issues:

1. **Spring Boot version compatibility**
   - Make sure you're using Spring Boot 3.x with the correct OAuth2 dependencies

2. **Application startup logs**
   - Check for any OAuth2 related errors in the startup logs
   - Look for ClientRegistrationRepository initialization

3. **Dependencies check**
   - Verify `spring-boot-starter-oauth2-client` is properly included

4. **Google Cloud Console configuration**
   - Make sure redirect URI `http://localhost:8082/login/oauth2/code/google` is added
   - Verify client ID and secret are correct

### **Debug Commands:**

```bash
# Check if OAuth2 endpoints are registered
curl -i http://localhost:8082/oauth2/authorization/google

# Test OAuth2 configuration
curl http://localhost:8082/api/oauth2/test

# Check actuator endpoints (if enabled)
curl http://localhost:8082/actuator/mappings | grep oauth2
```

### **Quick Fix Alternative:**

If the standard endpoint still doesn't work, you can use the API endpoint instead:

**Instead of:** `http://localhost:8082/oauth2/authorization/google`  
**Use:** `http://localhost:8082/api/auth/login/google`

This will redirect to the OAuth2 endpoint programmatically.

## 🚀 **Updated Frontend Integration:**

Update your frontend button to use the API endpoint:

```html
<button onclick="window.location.href='http://localhost:8082/api/auth/login/google'">
  Continue with Google
</button>
```

This way, even if the direct OAuth2 endpoint has issues, the API endpoint will handle the redirect properly.

## 📋 **Checklist:**

- [ ] Restart Spring Boot application
- [ ] Test `/api/oauth2/test` endpoint
- [ ] Test `/oauth2/authorization/google` endpoint
- [ ] Check application startup logs for errors
- [ ] Verify Google Cloud Console configuration
- [ ] Test complete OAuth flow

Let me know what you see when you test these endpoints!