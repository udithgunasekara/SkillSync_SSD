# Frontend Google OAuth2 Integration Guide

This guide provides complete instructions for integrating the Google OAuth2 components into your React frontend application.

## 📁 File Structure

Copy these files to your React frontend project:

```
src/
├── services/
│   └── OAuth2Service.ts
├── context/
│   └── AuthContext.tsx
├── components/
│   ├── GoogleLoginButton.tsx
│   ├── ProtectedRoute.tsx
│   └── UserProfile.tsx
└── pages/
    ├── OAuthSuccess.tsx
    └── OAuthError.tsx
```

## 🔧 Installation and Setup

### 1. Install Required Dependencies

```bash
npm install --save-dev @types/react @types/react-dom
# If not already installed:
npm install react react-dom
```

### 2. Environment Configuration

Create or update your `.env` file:

```env
REACT_APP_BACKEND_URL=http://localhost:8082
REACT_APP_FRONTEND_URL=http://localhost:3000
```

### 3. Update OAuth2Service Configuration

Update the `baseUrl` in `OAuth2Service.ts` if needed:

```typescript
private readonly baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8082';
```

## 🚀 Integration Steps

### Step 1: Wrap Your App with AuthProvider

Update your main `App.tsx` or `index.tsx`:

```tsx
// App.tsx
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import OAuthSuccess from './pages/OAuthSuccess';
import OAuthError from './pages/OAuthError';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/oauth/success" element={<OAuthSuccess />} />
            <Route path="/oauth/error" element={<OAuthError />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Only Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireRole="ADMIN">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### Step 2: Add Google Login to Your Login Page

```tsx
// pages/LoginPage.tsx
import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to SkillSync
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connect with freelancers and clients
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <GoogleLoginButton 
            className="w-full"
            onLoginStart={() => console.log('Login started')}
            onError={(error) => console.error('Login error:', error)}
          >
            Sign in with Google
          </GoogleLoginButton>
          
          {/* Add other login methods here */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
```

### Step 3: Add User Profile to Your Dashboard

```tsx
// pages/Dashboard.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserProfile from '../components/UserProfile';

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar with User Profile */}
          <div className="lg:col-span-1">
            <UserProfile />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome, {user?.fullName || user?.userName}!
              </h1>
              <p className="text-gray-600">
                This is your dashboard. You can manage your projects, view messages, and more.
              </p>
              
              {/* Dashboard content here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

### Step 4: Add Navigation with Auth Status

```tsx
// components/Navbar.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="text-xl font-bold text-blue-600">
            SkillSync
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/browse" className="text-gray-700 hover:text-blue-600">Browse Gigs</a>
            <a href="/how-it-works" className="text-gray-700 hover:text-blue-600">How it Works</a>
          </div>
          
          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <img 
                    src={user.profilePicture || '/default-avatar.png'} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-700">{user.fullName || user.userName}</span>
                </div>
                
                {/* Dashboard Link */}
                <a 
                  href="/dashboard" 
                  className="text-blue-600 hover:text-blue-800"
                >
                  Dashboard
                </a>
                
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <GoogleLoginButton className="px-4 py-2">
                Sign In
              </GoogleLoginButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

## 🔒 Authentication Patterns

### Using the useAuth Hook

```tsx
import { useAuth } from '../context/AuthContext';

const SomeComponent: React.FC = () => {
  const { 
    user,           // Current user object
    isAuthenticated, // Boolean: is user logged in
    isLoading,      // Boolean: is auth check in progress
    error,          // String: auth error message
    login,          // Function: redirect to Google OAuth
    logout,         // Function: logout user
    checkAuth,      // Function: refresh auth status
    updateProfile,  // Function: update user profile
    clearError      // Function: clear error message
  } = useAuth();

  // Your component logic here
};
```

### Protecting Routes

```tsx
// Basic protection
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>

// Role-based protection
<ProtectedRoute requireRole="ADMIN">
  <AdminComponent />
</ProtectedRoute>

// Custom redirect
<ProtectedRoute redirectTo="/custom-login">
  <YourComponent />
</ProtectedRoute>

// With custom fallback
<ProtectedRoute fallback={<CustomLoginForm />}>
  <YourComponent />
</ProtectedRoute>
```

### Using HOC Pattern

```tsx
import { withAuth } from '../components/ProtectedRoute';

const MyComponent: React.FC = () => {
  return <div>Protected content</div>;
};

// Wrap component with authentication
export default withAuth(MyComponent, { 
  requireRole: 'USER',
  redirectTo: '/login' 
});
```

## 🎨 Styling

The components use Tailwind CSS classes. If you're not using Tailwind, you can:

1. **Replace with your CSS framework:**
   ```tsx
   // Instead of Tailwind classes
   className="bg-blue-600 text-white px-4 py-2 rounded"
   
   // Use your CSS classes
   className="btn btn-primary"
   ```

2. **Use CSS modules:**
   ```tsx
   import styles from './Component.module.css';
   
   <button className={styles.loginButton}>
     Sign in with Google
   </button>
   ```

3. **Use styled-components:**
   ```tsx
   import styled from 'styled-components';
   
   const LoginButton = styled.button`
     background: #4285f4;
     color: white;
     padding: 8px 16px;
     border-radius: 4px;
   `;
   ```

## 🔧 Customization

### Custom Login Button

```tsx
const CustomGoogleButton: React.FC = () => {
  const { login } = useAuth();
  
  return (
    <button 
      onClick={login}
      className="your-custom-classes"
    >
      <YourGoogleIcon />
      Custom Google Login
    </button>
  );
};
```

### Custom Loading States

```tsx
const CustomProtectedRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <YourCustomLoader />;
  }
  
  if (!isAuthenticated) {
    return <YourCustomLoginPrompt />;
  }
  
  return <>{children}</>;
};
```

## 🐛 Common Issues and Solutions

### 1. CORS Issues
```javascript
// Make sure your backend CORS is configured for your frontend URL
// Backend should allow: http://localhost:3000
```

### 2. Session Not Persisting
```javascript
// Ensure credentials: 'include' is set in all fetch requests
// This is already configured in OAuth2Service.ts
```

### 3. Redirect Loops
```javascript
// Check that your OAuth success/error pages don't redirect back to OAuth
// Make sure protected routes redirect to login, not OAuth directly
```

### 4. Environment Variables Not Loading
```bash
# Make sure environment variables start with REACT_APP_
REACT_APP_BACKEND_URL=http://localhost:8082
```

## 🧪 Testing

### Test Authentication Flow

```tsx
// Test component
const AuthTest: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>Auth Status</h3>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      {user && (
        <div>
          <p>User: {user.fullName}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )}
      <button onClick={isAuthenticated ? logout : login}>
        {isAuthenticated ? 'Logout' : 'Login'}
      </button>
    </div>
  );
};
```

## 📱 Mobile Considerations

The components are responsive, but for mobile apps:

1. **React Native:** Use AsyncStorage instead of browser sessions
2. **PWA:** Configure proper redirect URIs for app URLs
3. **Deep Links:** Handle OAuth redirects in mobile environments

## 🔐 Security Best Practices

1. **Always use HTTPS in production**
2. **Validate user data on backend**
3. **Implement proper session timeouts**
4. **Use environment variables for sensitive config**
5. **Implement CSRF protection where needed**

## 📊 Analytics Integration

```tsx
// Track OAuth events
const { login } = useAuth();

const handleLogin = () => {
  // Analytics tracking
  gtag('event', 'login', {
    method: 'google_oauth'
  });
  
  login();
};
```

## 🚀 Production Deployment

1. **Update OAuth2Service baseUrl** for production
2. **Configure proper redirect URIs** in Google Cloud Console
3. **Set production environment variables**
4. **Test the complete flow** in production environment

## 💡 Next Steps

1. Implement role-based features in your app
2. Add user management for admins
3. Integrate with your existing user system
4. Add social features using OAuth user data
5. Implement proper error logging and monitoring

This completes the frontend integration guide for Google OAuth2 with your SkillSync application!