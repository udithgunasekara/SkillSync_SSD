import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthService } from '../../../../utils/AuthService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginNotifications.css';
import logo from './login.jpg';
import FreelancerContext from '../../Context/Context';
import axios from 'axios';


export const ClientLoginComponent = () => {
    // Initializing state for login variables
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [attemptCount, setAttemptCount] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockedUntil, setBlockedUntil] = useState('');
    const [notification, setNotification] = useState('');
    const navigate = useHistory();
    const {setFreelancerCon}:any = useContext(FreelancerContext);

    const checkLoginStatus = async () => {
        if (username) {
            try {
                const response = await axios.get(`http://localhost:8082/Security/login-status/${username}`);
                setAttemptCount(response.data.attemptCount);
                setIsBlocked(response.data.isBlocked);
                setBlockedUntil(response.data.blockedUntil);
            } catch (error) {
                console.error('Error checking login status:', error);
            }
        }
    };

    useEffect(() => {
        checkLoginStatus();
        // Clear notification when username changes
        setNotification('');
    }, [username]);

    const clearNotification = () => {
        setNotification('');
    };

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Including all state variables in the client object
        const client = { username, password };
        console.log(client); // For debug purposes

        AuthService.login(client, 'client')
            .then((response) => {
                if (response.message === 'Login successful') {
                    setFreelancerCon(username);
                    navigate.push(`/FreelancerMain`);
                } else {
                    setNotification('Login Failed!');
                    checkLoginStatus();
                }
            })
            .catch((error) => {
                console.error("Login error:", error);
                if (error.response?.status === 429) {
                    setNotification('Account temporarily blocked. Too many failed attempts.');
                } else {
                    setNotification('Login Failed!');
                }
                checkLoginStatus();
            });
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
                    <h2 style={{ color: '#ffff', textAlign: 'center', fontSize: '60px', fontWeight: '300px'  }}>Client Portal</h2>

                    {/* Security Status Notification */}
                    {attemptCount > 0 && (
                        <div className={`security-notification ${isBlocked ? 'security-danger' : 'security-warning'}`}>
                            {isBlocked ? (
                                <div>
                                    <strong>🔒 Account Blocked!</strong><br/>
                                    Too many failed attempts. Try again after 15 minutes.
                                </div>
                            ) : (
                                <div>
                                    <strong>⚠️ Warning:</strong> {attemptCount}/3 failed attempts<br/>
                                    {3 - attemptCount} attempts remaining before account lock
                                </div>
                            )}
                        </div>
                    )}

                    {/* General Notification */}
                    {notification && (
                        <div className="security-notification security-danger">
                            {notification}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label" style={{ color: '#fff' }}>Username</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="username" 
                                name="username" 
                                placeholder="Enter Username" 
                                required 
                                value={username} 
                                onChange={(e) => {
                                    setUserName(e.target.value);
                                    clearNotification();
                                }} 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label" style={{ color: '#fff' }}>Password</label>
                            <input type="password" className="form-control" id="password" name="password" placeholder="Enter Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="text-center">
                            <button 
                                type="submit" 
                                className="btn mt-2 btn-primary btn-lg mx-3 rounded-pill"
                                disabled={isBlocked}
                            >
                                {isBlocked ? '🔒 Blocked' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClientLoginComponent;
