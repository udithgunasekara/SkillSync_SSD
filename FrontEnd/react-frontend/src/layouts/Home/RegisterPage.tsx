import React from 'react';
import { useHistory } from 'react-router-dom';
import reqback from '../../images/regback.jpg'; // Adjust the path as necessary


const RegisterPager: React.FC = () => {
  const history = useHistory();

  const handleFreelancerLogin = () => {
    history.push('/Freelancer/Registration'); // Redirect to freelancer reg page
  };

  const handleLogin = () => {
    history.push('/HomePage'); // Redirect to client reg page
  };

  const handleClientLogin = () => {
    history.push('/Client/Registration'); // Redirect to client reg page
  };


  const backgroundImageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${reqback})`, // Add a linear gradient with opacity
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  return (
    
    <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center" style={backgroundImageStyle}>
      <header className="mb-5 text-white"> <h1 className="display-1 text-center">SkillSync</h1>
        <p className="lead text-center">
        Join us to match skilled freelancers with eager clients. 
        <br>
        </br> Sign up today and get started
        </p>
      </header>
      <section className="login-buttons d-flex justify-content-center">
        <button
          type="button"
          className="btn btn-primary btn-lg mx-3 rounded-pill" // Rounded button with primary color
          onClick={handleFreelancerLogin}
        >
          Register in as Freelancer
        </button>
        <button
          type="button"
          className="btn btn-outline-light btn-lg mx-3 rounded-pill" // Rounded outline light button
          onClick={handleClientLogin}
        >
          Register in as Client
        </button>
      </section>
      <button
          type="button"
          className="btn btn btn-secondary btn-lg mx-3 rounded-pill mt-5" // Rounded outline light button
          onClick={handleLogin}
        >
          Log In
        </button>
    </div>
    
  );
};

export default RegisterPager;
