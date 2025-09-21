import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './QualificationReview.css';
import { RequestEmail, SuspendEmail } from '../../MailSender/emailService';

import background from './backgroundRev.jpg';
import { title } from 'process';

interface User {
  userName: string;
  firstName: string;
  lastName: string;
  dob: string;
  nic: string;
  phone: string;
  workOn: string;
  email: string;
  created_at: string;
}

interface QualificationImage {
  title: string;
  images: string[]; // Array of Base64-encoded image strings
}

const QualificationReview = () => {
  const navigate = useHistory();
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [titlesWithImages, setTitlesWithImages] = useState<Record<string, QualificationImage>>({});

  const handleApprove = async () => {
    try {
      const response = await fetch(`http://localhost:8082/Freelancer/Accept?username=${username}`, {
        method: 'PUT',
      });

      if (response.ok) {
        alert('Account Approved successfully!');
        navigate.push('/Applicant/Page');
      }

    

    } catch (error) {
      console.error('Error during approval:', error);
    }
  };

  const handleSuspend = async () => {
    try {
      const response = await fetch(`http://localhost:8082/Freelancer/Delete/${username}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Account Suspended successfully!');
        navigate.push('/Applicant/Page');
      }

      console.log('Here above the mail sending')
      if (user?.email) {

        const emailParams = {
          to_email: user.email // Use username as recipient
        };
  
        SuspendEmail(emailParams);
      }
      console.log('Here below the mail sending')
    } catch (error) {
      console.error('Error during suspension:', error);
    }
  };


  const handleResubmission = async () =>{
    
    console.log('Here above the mail sending')
    if (user?.email) {

      const emailParams = {
        to_email: user.email // Use username as recipient
      };

      RequestEmail(emailParams);
    }
    console.log('Here below the mail sending')
    

  };

  const handleReject = async (title: string) => {
    try {
      const response = await fetch(
        `http://localhost:8082/qualification/reject/Application?username=${username}&title=${title}`,
        {
          method: 'PUT',
        }
      );

      if (response.ok) {
        alert('Qualification Rejected successfully!');
        window.location.reload();
      }

     
    } catch (error) {
      console.error('Error during rejection:', error);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userResponse = await fetch(`http://localhost:8082/Freelancer/${username}`);
        const userData = await userResponse.json();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await fetch(`http://localhost:8082/qualification/images/${username}`);
        const imagesData = await response.json();
        
        const imagesByTitle: Record<string, QualificationImage> = {}; // Add index signature

        Object.keys(imagesData).forEach((title) => {
          imagesByTitle[title] = {
            title,
            images: imagesData[title].map((base64Image:string) => `data:image/png;base64,${base64Image}`),
          };
        });

        setTitlesWithImages(imagesByTitle);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };

    fetchUserDetails();
    fetchImages();
  }, [username]);

  return (
    <div className="rev_form container pt-5">
      <h1 className="rev_heading">Qualification Review</h1>

      <div className="rev_card w-75 p-3 rounded border">
        <div className="rev_card-header">
          <h2 className='text-center'>User Details</h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
  {user ? (
    <>
      <div style={{ flex: '1 0 50%' , fontSize: '20px'}}>
        <p>Username: {user.userName}</p>
        <p>Full Name: {user.firstName} {user.lastName}</p>
        <p>Email: {user.email}</p>
        <p>Date of Birth: {user.dob}</p>
      </div>
      <div style={{ flex: '1 0 50%', fontSize: '20px' }}>
        <p>NIC: {user.nic}</p>
        <p>Phone: {user.phone}</p>
        <p>Work On: {user.workOn}</p>
        <p>Created at: {user.created_at}</p>
      </div>
    </>
  ) : (
    <p>Loading user details...</p>
  )}
</div>
      </div>

      <div className="container mt-4">
  <h2 className="rev_heading2">Qualification Images</h2>
  {Object.keys(titlesWithImages).length > 0 ? (
    <div className="row">
      {Object.entries(titlesWithImages).map(([title, qualificationImage]) => (
        <div className="col-md-12" key={title}> {/* Full width column for each topic */}
          <div className="rev_card mb-3">
            <div className="rev_card-header">
              <h3>{title}</h3> {/* Topic title */}
            </div>
            <div className="rev_card-body">
              {qualificationImage.images.map((image, index) => (
                <img
                  key={`${title}-${index}`}
                  src={image}
                  alt={`Qualification ${title}`}
                  className="rev_image img-fluid mb-2"
                  style={{ width: '50%', height: 'auto' }}  // Responsive and proportional
                />
              ))}
              <button
                className="rev_button-reject btn btn-danger"
                onClick={() => handleReject(title)}
                style={{ marginTop: '20px' }} // Space above the reject button
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>Loading images...</p>
  )}
</div>

      
      <div>
        <button className="rev_button-approve btn btn-success" onClick={handleApprove}>
          Approve
        </button>
        <button className="rev_button-resubmit btn btn-warning" onClick ={handleResubmission}> 
          ReSubmission
        </button>
        <button className="rev_button-suspend btn btn-danger" onClick={handleSuspend}>
          Suspend
        </button>
      </div>
    </div>
  );
};

export default QualificationReview;
