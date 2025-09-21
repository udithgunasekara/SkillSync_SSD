import React, { useContext } from 'react';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import { useHistory } from 'react-router-dom';
import { ThemeContext } from '../UserVerificationManagement/Context/themeContext';

const HomePage: React.FC = () => {
  const history = useHistory();

  const theme = useContext(ThemeContext);

  const handleFreelancerLogin = () => {
    history.push('/Freelancer/Login'); // Redirect to freelancer login page
  };

  const handleClientLogin = () => {
    history.push('/Client/Login'); // Redirect to client login page
  };

  const backgroundImageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/Images/HomeWp2.jpg')`, // Add a linear gradient with opacity
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center" style={backgroundImageStyle}>
      <header className="mb-5 text-white"> <h1 className="display-1 text-center">SkillSync</h1>
        <p className="lead text-center">
          Connecting skilled freelancers with project-hungry clients.
        </p>
      </header>
      <section className="login-buttons d-flex justify-content-center">
        <button
          type="button"
          className="btn btn-primary btn-lg mx-3 rounded-pill" // Rounded button with primary color
          onClick={handleFreelancerLogin}
        >
          Log in as Freelancer
        </button>
        <button
          type="button"
          className="btn btn-outline-light btn-lg mx-3 rounded-pill" // Rounded outline light button
          onClick={handleClientLogin}
        >
          Log in as Client
        </button>
      </section>
    </div>
  );
};

export default HomePage;
