import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import oauthService from '../services/OAuthService';
import { UserRole, USER_ROLES } from '../config/OAuthConfig';

interface LocationState {
    user: any;
    availableRoles?: UserRole[];
}

const RoleSelectionPage: React.FC = () => {
    const history = useHistory();
    const location = useLocation<LocationState>();
    const { login } = useAuth();
    const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
    const [linkedUsername, setLinkedUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user, availableRoles } = location.state || {};

    // Default to all roles if not specified
    const rolesToShow = availableRoles || [USER_ROLES.FREELANCER, USER_ROLES.CLIENT, USER_ROLES.ADMIN];

    if (!user) {
        // Redirect to login if no user data
        history.replace('/login');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedRole) {
            setError('Please select a role');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const registrationData = {
                role: selectedRole as UserRole,
                linkedUsername: linkedUsername || undefined
            };

            const response = await oauthService.completeRegistration(registrationData);
            
            // Complete authentication
            await login(response.user, response.token, response.refreshToken);
            
            // Redirect based on selected role
            switch (selectedRole) {
                case USER_ROLES.ADMIN:
                    history.push('/admin/dashboard');
                    break;
                case USER_ROLES.CLIENT:
                    history.push('/client/dashboard');
                    break;
                case USER_ROLES.FREELANCER:
                    history.push('/freelancer/dashboard');
                    break;
                default:
                    history.push('/dashboard');
            }
        } catch (error: any) {
            console.error('Role selection error:', error);
            setError(error.message || 'Failed to complete registration');
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleDescription = (role: UserRole) => {
        switch (role) {
            case USER_ROLES.FREELANCER:
                return 'Offer services and complete projects for clients';
            case USER_ROLES.CLIENT:
                return 'Post projects and hire freelancers';
            case USER_ROLES.ADMIN:
                return 'Manage platform and oversee operations';
            default:
                return '';
        }
    };

    return (
        <div className="min-h-screen bg-light d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-xl-6">
                        <div className="card shadow-lg border-0">
                            <div className="card-body p-5">
                                <div className="text-center mb-5">
                                    <img
                                        src={user.profilePicture}
                                        alt="Profile"
                                        className="rounded-circle mb-3"
                                        style={{ width: '80px', height: '80px' }}
                                    />
                                    <h2 className="card-title mb-2">Welcome, {user.firstName}!</h2>
                                    <p className="text-muted">
                                        To complete your registration, please select your role:
                                    </p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Select Your Role</label>
                                        <div className="row g-3">
                                            {rolesToShow.map((role) => (
                                                <div key={role} className="col-12">
                                                    <div className="form-check form-check-custom">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="role"
                                                            id={`role-${role}`}
                                                            value={role}
                                                            checked={selectedRole === role}
                                                            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                                                        />
                                                        <label 
                                                            className="form-check-label w-100"
                                                            htmlFor={`role-${role}`}
                                                        >
                                                            <div className="card border-2" 
                                                                 style={{ 
                                                                     borderColor: selectedRole === role ? '#0d6efd' : '#dee2e6',
                                                                     backgroundColor: selectedRole === role ? '#f8f9ff' : 'white'
                                                                 }}>
                                                                <div className="card-body p-3">
                                                                    <h5 className="card-title mb-1">
                                                                        {role.charAt(0) + role.slice(1).toLowerCase()}
                                                                    </h5>
                                                                    <p className="card-text text-muted small mb-0">
                                                                        {getRoleDescription(role)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="linkedUsername" className="form-label">
                                            Link Existing Account (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="linkedUsername"
                                            placeholder="Enter existing username to link accounts"
                                            value={linkedUsername}
                                            onChange={(e) => setLinkedUsername(e.target.value)}
                                        />
                                        <div className="form-text">
                                            If you have an existing account, enter your username to link it with your Google account.
                                        </div>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                            disabled={isLoading || !selectedRole}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Completing Registration...
                                                </>
                                            ) : (
                                                'Complete Registration'
                                            )}
                                        </button>
                                        
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => history.push('/login')}
                                            disabled={isLoading}
                                        >
                                            Back to Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionPage;