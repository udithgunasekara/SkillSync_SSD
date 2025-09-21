import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FreelancerLogin } from '../Service/LoginService'
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


    //setup session storage
    sessionStorage.setItem('username', username)

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Including all state variables in the freelancer object
        const freelancer = { username, password, };
        console.log(freelancer); // For debug purposes

        FreelancerLogin(freelancer).then((response) => {
            console.log("Login response:", response.data);
            //set id
            sessionStorage.setItem('id', response.data)
            sessionStorage.setItem('role', 'freelancer')

            
            setFreelancerCon(username);

           // alert('login successful ');
 
            console.log("Account status check function calling ");
            /// Check account status after login
            checkAccountStatus(username).then((response) => {
                // Assuming response.data is the boolean account status
                const status = response.data;
                if (status === true) {
                    console.log("Account status accepted");
                    // If the account status is accepted, navigate to UserTestPage
                    navigate.push('/FreelancerDashboard');
                } else {
                    // If the account status is not accepted, navigate to AccountNotAcceptedPage
                    navigate.push(`/ReSubmission/${username}`);
                }
                console.log("Account status check function called successfully");
            }).catch((error) => {
                console.error("Error checking account status:", error);
               
            });

        }).catch((error) => {
            console.error("Login error:", error.response || error);
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
