# Google OAuth2 Integration for SkillSync Backend

This document provides a complete guide for the Google OAuth2 integration implemented in the SkillSync backend application.

## Overview

The implementation includes:
- Google OAuth2 authentication
- User management with OAuth2 data
- REST API endpoints for frontend integration
- Session management and security configuration

## Prerequisites

1. **Google Cloud Console Setup**:
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google+ API or Google Identity API
   - Create OAuth2 credentials (Web application)
   - Add authorized redirect URIs:
     - `http://localhost:8082/login/oauth2/code/google`
     - `http://localhost:8082/oauth2/authorization/google`

2. **Environment Variables**:
   Set the following environment variables or update `application.yml`:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

## Configuration

### 1. Dependencies Added (pom.xml)
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

### 2. Application Configuration (application.yml)
```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID:your-google-client-id}
            client-secret: ${GOOGLE_CLIENT_SECRET:your-google-client-secret}
            scope:
              - openid
              - profile
              - email
            redirect-uri: "http://localhost:8082/login/oauth2/code/google"
            client-name: Google
        provider:
          google:
            authorization-uri: https://accounts.google.com/o/oauth2/auth
            token-uri: https://www.googleapis.com/oauth2/v3/token
            user-info-uri: https://www.googleapis.com/oauth2/v3/userinfo
            user-name-attribute: sub
```

## Database Changes

The `UserCredential` entity has been enhanced with OAuth2 support:

```sql
-- New columns added to user_credential table
ALTER TABLE user_credential ADD COLUMN email VARCHAR(255);
ALTER TABLE user_credential ADD COLUMN full_name VARCHAR(255);
ALTER TABLE user_credential ADD COLUMN profile_picture TEXT;
ALTER TABLE user_credential ADD COLUMN provider VARCHAR(50);
ALTER TABLE user_credential ADD COLUMN provider_id VARCHAR(255);
```

## API Endpoints

### Authentication Endpoints (`/api/auth`)

1. **Start Google OAuth2 Login**
   ```
   GET /api/auth/login/google
   ```
   - Redirects to Google OAuth2 authorization
   - No authentication required

2. **Get Current User**
   ```
   GET /api/auth/user
   ```
   - Returns current authenticated user information
   - Requires OAuth2 authentication
   - Response:
   ```json
   {
     "authenticated": true,
     "user": {
       "id": 1,
       "userName": "user@example.com",
       "role": "USER",
       "email": "user@example.com",
       "name": "John Doe",
       "picture": "https://..."
     }
   }
   ```

3. **Check Authentication Status**
   ```
   GET /api/auth/status
   ```
   - Returns authentication status
   - Response:
   ```json
   {
     "authenticated": true,
     "email": "user@example.com",
     "name": "John Doe"
   }
   ```

4. **Logout**
   ```
   POST /api/auth/logout
   ```
   - Invalidates session
   - Response:
   ```json
   {
     "message": "Logged out successfully",
     "status": "success"
   }
   ```

5. **Get Login URL**
   ```
   GET /api/auth/login-url
   ```
   - Returns the OAuth2 login URL
   - Response:
   ```json
   {
     "loginUrl": "/api/auth/login/google",
     "provider": "google"
   }
   ```

### User Management Endpoints (`/api/oauth2`)

1. **Get User Profile**
   ```
   GET /api/oauth2/profile
   ```
   - Returns detailed user profile
   - Requires authentication

2. **Update User Profile**
   ```
   PUT /api/oauth2/profile
   ```
   - Updates user profile information
   - Request body:
   ```json
   {
     "fullName": "John Doe",
     "profilePicture": "https://..."
   }
   ```

3. **Get User by Email**
   ```
   GET /api/oauth2/user/{email}
   ```
   - Returns user information by email
   - Admin endpoint

4. **Check Authentication**
   ```
   GET /api/oauth2/check-auth
   ```
   - Alternative authentication check endpoint

5. **Link Account**
   ```
   POST /api/oauth2/link-account
   ```
   - Links OAuth2 account to existing account
   - Requires authentication

## Frontend Integration

### 1. Login Flow
```javascript
// Redirect to OAuth2 login
window.location.href = 'http://localhost:8082/api/auth/login/google';

// Or use fetch to get login URL
fetch('http://localhost:8082/api/auth/login-url')
  .then(response => response.json())
  .then(data => {
    window.location.href = `http://localhost:8082${data.loginUrl}`;
  });
```

### 2. Check Authentication Status
```javascript
fetch('http://localhost:8082/api/auth/status', {
  credentials: 'include'
})
.then(response => response.json())
.then(data => {
  if (data.authenticated) {
    console.log('User is authenticated:', data);
  } else {
    console.log('User is not authenticated');
  }
});
```

### 3. Get User Information
```javascript
fetch('http://localhost:8082/api/auth/user', {
  credentials: 'include'
})
.then(response => response.json())
.then(data => {
  if (data.authenticated) {
    console.log('User data:', data.user);
  }
});
```

### 4. Logout
```javascript
fetch('http://localhost:8082/api/auth/logout', {
  method: 'POST',
  credentials: 'include'
})
.then(response => response.json())
.then(data => {
  console.log('Logout result:', data);
  // Redirect to login page
  window.location.href = '/login';
});
```

## Security Configuration

The application is configured with:
- CORS support for frontend domains
- Session-based authentication
- OAuth2 login configuration
- Automatic redirects after login/logout
- CSRF protection disabled for API endpoints

## User Data Handling

When a user logs in via Google OAuth2:
1. The system checks if a user exists with the Google provider ID
2. If not found, checks if a user exists with the same email
3. If found, links the OAuth2 account to the existing user
4. If no user exists, creates a new user with:
   - Email as username
   - Default role as "USER"
   - No password (OAuth2 only)
   - Google profile information

## Testing

### Manual Testing Steps

1. **Setup Google OAuth2 Credentials**:
   - Get client ID and secret from Google Cloud Console
   - Update environment variables or application.yml

2. **Start the Application**:
   ```bash
   mvn spring-boot:run
   ```

3. **Test Login Flow**:
   - Navigate to: `http://localhost:8082/api/auth/login/google`
   - Complete Google OAuth2 flow
   - Check redirection to frontend success page

4. **Test API Endpoints**:
   - Use browser or Postman to test endpoints
   - Ensure cookies/sessions are maintained

### Frontend Success/Error Pages

Configure your frontend to handle:
- Success redirect: `http://localhost:3000/oauth/success`
- Error redirect: `http://localhost:3000/oauth/error`

## Troubleshooting

### Common Issues

1. **"Client ID not found"**: 
   - Verify Google Cloud Console setup
   - Check environment variables

2. **CORS errors**: 
   - Verify frontend URL in CORS configuration
   - Check credentials: 'include' in frontend requests

3. **Session not maintained**: 
   - Ensure cookies are enabled
   - Check session configuration

4. **Redirect URI mismatch**: 
   - Verify redirect URIs in Google Cloud Console
   - Check application.yml configuration

### Logs to Check

- Spring Security debug logs
- OAuth2 client logs
- Session management logs

## Security Considerations

1. **Environment Variables**: Never commit client secrets to version control
2. **HTTPS**: Use HTTPS in production
3. **Session Security**: Configure secure session cookies
4. **CORS**: Restrict CORS origins to known domains
5. **User Roles**: Implement proper role-based access control

## Production Deployment

For production deployment:
1. Update redirect URIs to production domains
2. Use HTTPS for all endpoints
3. Set secure environment variables
4. Configure production database
5. Update CORS configuration for production frontend URL
6. Enable security headers and CSRF protection as needed

This completes the Google OAuth2 integration for the SkillSync backend application.