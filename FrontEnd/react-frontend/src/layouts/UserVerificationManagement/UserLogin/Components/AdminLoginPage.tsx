import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export const AdminLoginComponent = () => {
    // Initializing state for login variables
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useHistory();

    // Setup session storage
    sessionStorage.setItem('username', username);

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Set session
        sessionStorage.setItem('username', 'vass');
        sessionStorage.setItem('id', '1');
        sessionStorage.setItem('role', 'admin');

        // alert('Login Successful!');
        navigate.push(`/admin`);
    };

    const backgroundImageStyle = {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/Images/HomeWp2.jpg')`, // Add a linear gradient with opacity
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center" style={backgroundImageStyle}>
            <div className="container" style={{ maxWidth: '600px', margin: 'auto' }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#ffff', textAlign: 'center', fontSize: '60px', fontWeight: '300px' }}>Moderator Portal</h2>

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label" style={{ color: '#fff' }}>Username</label>
                            <input type="text" className="form-control" id="username" name="username" placeholder="Enter Username" required value={username} onChange={(e) => setUserName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label" style={{ color: '#fff' }}>Password</label>
                            <input type="password" className="form-control" id="password" name="password" placeholder="Enter Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn mt-2 btn-primary btn-lg mx-3 rounded-pill">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginComponent;
