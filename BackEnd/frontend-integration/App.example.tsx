// App.tsx - Example integration of OAuth2 components
// Copy this to your React frontend src/App.tsx and modify as needed

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import your components
import ProtectedRoute from './components/ProtectedRoute';
import GoogleLoginButton from './components/GoogleLoginButton';
import UserProfile from './components/UserProfile';
import OAuthSuccess from './pages/OAuthSuccess';
import OAuthError from './pages/OAuthError';

// Import your existing pages (these need to be created/updated)
// import HomePage from './pages/HomePage';
// import Dashboard from './pages/Dashboard';
// import FreelancerDashboard from './layouts/FreelancerWorkManagement/FreelancerDashboard';
// import AdminDashboard from './layouts/AdminTaskManagement/Admin/DashboardPage';

// Simple placeholder components for this example
const HomePage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md w-full space-y-8 p-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Welcome to SkillSync</h1>
      <p className="text-gray-600">Connect freelancers with clients</p>
      <GoogleLoginButton>Get Started with Google</GoogleLoginButton>
    </div>
  </div>
);

const Dashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <UserProfile />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome to your dashboard!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FreelancerDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <h1 className="text-2xl font-bold mb-4">Freelancer Dashboard</h1>
    <p>Manage your gigs and orders here.</p>
  </div>
);

const ClientDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <h1 className="text-2xl font-bold mb-4">Client Dashboard</h1>
    <p>Post jobs and manage projects here.</p>
  </div>
);

const AdminDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
    <p>Manage users and system settings here.</p>
  </div>
);

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* OAuth Callback Routes */}
            <Route path="/oauth/success" element={<OAuthSuccess redirectTo="/dashboard" />} />
            <Route path="/oauth/error" element={<OAuthError redirectTo="/" />} />
            
            {/* Protected Routes - Any authenticated user */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50 p-8">
                    <UserProfile className="max-w-2xl mx-auto" />
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Role-based Protected Routes */}
            <Route 
              path="/freelancer/*" 
              element={
                <ProtectedRoute requireRole="FREELANCER">
                  <FreelancerDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/client/*" 
              element={
                <ProtectedRoute requireRole="CLIENT">
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requireRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

/* 
INTEGRATION NOTES:

1. Replace placeholder components with your existing components:
   - HomePage -> your existing Home/HomePage.tsx
   - Dashboard -> your existing dashboard component
   - FreelancerDashboard -> layouts/FreelancerWorkManagement/FreelancerDashboard
   - AdminDashboard -> layouts/AdminTaskManagement/Admin/DashboardPage

2. Update imports to match your file structure:
   import HomePage from './layouts/Home/HomePage';
   import FreelancerDashboard from './layouts/FreelancerWorkManagement/FreelancerDashboard/dashboard';
   import AdminDashboard from './layouts/AdminTaskManagement/Admin/DashboardPage';

3. Add navigation components:
   - Import your existing Navbar component
   - Wrap routes with Navbar if needed
   
4. Customize role names to match your system:
   - FREELANCER, CLIENT, ADMIN, USER, etc.
   
5. Add CSS framework imports if using Tailwind:
   import './index.css'; // with Tailwind directives

6. Environment variables needed:
   - REACT_APP_BACKEND_URL=http://localhost:8082

7. Dependencies to install:
   npm install react-router-dom
   npm install --save-dev @types/react-router-dom

8. Backend must be running on http://localhost:8082 with OAuth2 configured

9. Google Cloud Console must have these redirect URIs:
   - http://localhost:8082/login/oauth2/code/google
   - http://localhost:3000/oauth/success (for frontend redirects)

10. Test the flow:
    a. Start backend: mvn spring-boot:run
    b. Start frontend: npm start
    c. Go to http://localhost:3000
    d. Click "Get Started with Google"
    e. Complete OAuth flow
    f. Should redirect to dashboard
*/