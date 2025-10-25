// Simple Google Login Integration
// Add this code to your existing login page

/* 
STEP 1: Add this CSS to your login page or CSS file 
*/
const googleButtonStyles = {
  googleLoginBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    border: '1px solid #dadce0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#3c4043',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '16px'
  },
  googleLoginBtnHover: {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    backgroundColor: '#f8f9fa'
  },
  googleLogo: {
    width: '18px',
    height: '18px',
    marginRight: '12px'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
    color: '#5f6368',
    fontSize: '14px'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#dadce0'
  },
  dividerText: {
    padding: '0 16px'
  }
};

/* 
STEP 2: Add this function to handle Google login 
*/
function handleGoogleLogin() {
  // Redirect to your backend Google OAuth endpoint
  window.location.href = 'http://localhost:8082/api/auth/login/google';
}

/* 
STEP 3: Add this HTML to your existing login form 
(Replace the comments with actual HTML in your JSX/template)
*/

const GoogleLoginSection = `
<!-- Google Login Button -->
<button 
  onclick="handleGoogleLogin()" 
  style="width: 100%; display: flex; align-items: center; justify-content: center; padding: 12px 16px; border: 1px solid #dadce0; border-radius: 8px; background-color: #fff; color: #3c4043; font-size: 14px; font-weight: 500; cursor: pointer; margin-bottom: 16px;"
  onmouseover="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'; this.style.backgroundColor='#f8f9fa'"
  onmouseout="this.style.boxShadow='none'; this.style.backgroundColor='#fff'"
>
  <!-- Google Logo SVG -->
  <svg width="18" height="18" viewBox="0 0 24 24" style="margin-right: 12px;">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Continue with Google
</button>

<!-- Divider -->
<div style="display: flex; align-items: center; margin: 20px 0; color: #5f6368; font-size: 14px;">
  <div style="flex: 1; height: 1px; background-color: #dadce0;"></div>
  <span style="padding: 0 16px;">OR</span>
  <div style="flex: 1; height: 1px; background-color: #dadce0;"></div>
</div>

<!-- Your existing login form continues here -->
`;

/* 
STEP 4: For React/JSX integration, use this component 
*/
const GoogleLoginButton = () => {
  return (
    <div>
      {/* Google Login Button */}
      <button 
        onClick={() => window.location.href = 'http://localhost:8082/api/auth/login/google'}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 16px',
          border: '1px solid #dadce0',
          borderRadius: '8px',
          backgroundColor: '#fff',
          color: '#3c4043',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '16px'
        }}
        onMouseOver={(e) => {
          e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
          e.target.style.backgroundColor = '#f8f9fa';
        }}
        onMouseOut={(e) => {
          e.target.style.boxShadow = 'none';
          e.target.style.backgroundColor = '#fff';
        }}
      >
        {/* Google Logo */}
        <svg width="18" height="18" viewBox="0 0 24 24" style={{marginRight: '12px'}}>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
      
      {/* Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        margin: '20px 0',
        color: '#5f6368',
        fontSize: '14px'
      }}>
        <div style={{flex: 1, height: '1px', backgroundColor: '#dadce0'}}></div>
        <span style={{padding: '0 16px'}}>OR</span>
        <div style={{flex: 1, height: '1px', backgroundColor: '#dadce0'}}></div>
      </div>
    </div>
  );
};

/* 
STEP 5: Add OAuth callback routes to your router
Add these routes to handle the OAuth response:
*/
const oauthRoutes = `
// Add these routes to your main router
<Route path="/oauth/success" component={OAuthSuccess} />
<Route path="/oauth/error" component={OAuthError} />
`;

/* 
STEP 6: Create simple success and error pages
*/
const OAuthSuccess = () => {
  // Redirect to dashboard after successful login
  setTimeout(() => {
    window.location.href = '/dashboard';
  }, 2000);
  
  return (
    <div style={{textAlign: 'center', padding: '50px'}}>
      <h2>Login Successful!</h2>
      <p>Redirecting to dashboard...</p>
    </div>
  );
};

const OAuthError = () => {
  return (
    <div style={{textAlign: 'center', padding: '50px'}}>
      <h2>Login Failed</h2>
      <p>There was an error signing you in. Please try again.</p>
      <button onClick={() => window.location.href = '/'}>
        Go Home
      </button>
    </div>
  );
};

export { GoogleLoginButton, handleGoogleLogin, OAuthSuccess, OAuthError };