// InProgress.tsx
import React, { useEffect } from 'react';
import { RequestEmail } from '../MailSender/emailService';
import logo from './inprogressLogo.png';
import { useHistory } from 'react-router-dom';

interface InProgressProps {}

const InProgress: React.FC<InProgressProps> = () => {
  const navigate = useHistory();
  useEffect(() => {
    const username = sessionStorage.getItem('username');

    if (username) {

      const emailParams = {
        to_email: "supeshalau@gmail.com" // Use username as recipient
      };

      RequestEmail(emailParams);
    }
  }, []); 

  const handleBackToHome = () => {
    // Redirect to home page
    navigate.push('/FreelancerMain')
  }

  return (
    <div className="container text-center d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="mt-5">
        <h1>SkillSync</h1>
        <img 
          src={logo}
          alt="SkillSync Logo"
          className="img-fluid rounded-circle"
          style={{ width: '200px', height: '200px' }}
        />
        <h2 className="mt-3">Account Status: In Progress</h2>
        <p className='mt-1' style={{ color: 'gray', fontSize: '20px' }}>
          Moderator will review your documents and approve your account.
        </p>
        <p> check your E-mail whether moderator request a resubmission</p>
        <div>
          <button className='btn btn-primary mt-3'onClick={handleBackToHome}>Back To Home</button>
        </div>
      </div>
    </div>
  );
};

export default InProgress;
