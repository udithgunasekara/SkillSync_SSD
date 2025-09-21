import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ClientLogin } from '../Service/LoginService'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './login.jpg';
import FreelancerContext from '../../Context/Context';


export const ClientLoginComponent = () => {
    // Initializing state for login variables
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useHistory();
    const {setFreelancerCon}:any = useContext(FreelancerContext);

    //setup session storage
    sessionStorage.setItem('username', username);

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Including all state variables in the client object
        const client = { username, password };
        console.log(client); // For debug purposes

        ClientLogin(client)
            .then((response) => {
                console.log("Login response:", response.data);
                sessionStorage.setItem('id', response.data);
                sessionStorage.setItem('role', 'client');

                //add user name context
                setFreelancerCon(username);


                // alert('Login Successful!');
                navigate.push(`/FreelancerMain`);
            })
            .catch((error) => {
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
                    <h2 style={{ color: '#ffff', textAlign: 'center', fontSize: '60px', fontWeight: '300px'  }}>Client Portal</h2>

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

export default ClientLoginComponent;
