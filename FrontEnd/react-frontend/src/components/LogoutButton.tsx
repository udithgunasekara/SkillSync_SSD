import React from 'react';
import { AuthService } from '../utils/AuthService';

const LogoutButton: React.FC = () => {
    const handleLogout = () => {
        AuthService.logout();
    };

    return (
        <button onClick={handleLogout} className="btn btn-outline-danger">
            Logout
        </button>
    );
};

export default LogoutButton;