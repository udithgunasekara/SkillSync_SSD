import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthService } from '../../../../utils/AuthService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { checkAccountStatus } from '../../Services/UserManagementService';
import FreelancerContext from '../../Context/Context';

export const FreelancerLoginComponent =  () => {
    // Initializing state for login variables
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    //const [id, setId] = useState(''); // [1
    const navigate = useHistory();
    const {setFreelancerCon}:any = useContext(FreelancerContext);


    // Remove insecure session storage

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Including all state variables in the freelancer object
        const freelancer = { username, password, };
        console.log(freelancer); // For debug purposes

        AuthService.login(freelancer, 'freelancer').then((response) => {
            if (response.message === 'Login successful') {
                setFreelancerCon(username);
                
                checkAccountStatus(username).then((statusResponse) => {
                    const status = statusResponse.data;
                    if (status === true) {
                        navigate.push('/FreelancerDashboard');
                    } else {
                        navigate.push(`/ReSubmission/${username}`);
                    }
                }).catch((error) => {
                    console.error("Error checking account status:", error);
                });
            } else {
                alert('Login Failed!');
            }
        }).catch((error) => {
            console.error("Login error:", error);
            alert('Login Failed!');
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
                    <h3 style={{ color: '#ffff', textAlign: 'center', fontSize: '60px', fontWeight: '300px' }}>Freelancer Portal</h3>

                    <form onSubmit={handleLogin}>
                    <div className="mb-3" style={{ display: 'flex', flexDirection: 'column' }}>
     <label htmlFor="username" className="form-label" style={{ color: '#fff' }}>Username</label>
                            <input type="text" className="form-control " id="username" name="username" placeholder="Enter Username" required value={username} onChange={(e) => setUserName(e.target.value)} style={{ padding: '10px', width: '100%' }} />
                        </div>
                        <div className="mb-3" style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="password" className="form-label" style={{ color: '#fff' }}>Password</label>
                            <input type="password" className="form-control" id="password" name="password" placeholder="Enter Password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px',width: '100%' }} />
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

export default FreelancerLoginComponent;
