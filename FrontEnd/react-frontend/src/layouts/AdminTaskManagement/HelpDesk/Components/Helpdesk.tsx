import React from 'react';
import { useHistory } from 'react-router-dom';
export const Helpdesk = () => {


  const history = useHistory();

  const handleraisenewticket = () => {
    history.push('/raiseticket'); // Redirect to freelancer login page
  };

  const handleyourticket = () => {
    history.push('/tickets'); // Redirect to client login page
  };

  const backgroundImageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/Images/HomeWp2.jpg')`, // Add a linear gradient with opacity
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center" style={backgroundImageStyle}>
      <header className="mb-5 text-white"> <h1 className="display-1 text-center">Welcome to Skillsync Help Desk</h1>
        <p className="lead text-center">
        Empower your freelance journey with expert support every step of the way. Welcome to your one-stop help desk for freelancing success!
        </p>
      </header>
      <section className="login-buttons d-flex justify-content-center">
        <button
          type="button"
          className="btn btn-primary btn-lg mx-3 rounded-pill" // Rounded button with primary color
          onClick={handleraisenewticket}
        >
          Raise your Concerns Here
        </button>
        <button
          type="button"
          className="btn btn-outline-light btn-lg mx-3 rounded-pill" // Rounded outline light button
          onClick={handleyourticket}
        >
          See your raised tickets
        </button>
      </section>
    </div>
  );



}