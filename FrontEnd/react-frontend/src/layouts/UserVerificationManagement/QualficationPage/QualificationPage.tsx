import React, { useState, useEffect, FC, useContext } from 'react';


//2nd page: QualificationPage getting social links and show card of qualifications
import './QualificationPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory, useLocation } from 'react-router-dom';
import { createSocialLink, createQualification } from '../Services/UserManagementService';
import { useQualifications } from '../QualificationUpload/QualificationsContext';
import FreelancerContext from '../Context/Context';


interface Qualification {
  title: string;
  image: string[];
  startDate: string;
  endDate: string;
}

interface SocialLinkData {
  behance: string;
  linkedIn: string;
  portfolio: string;
  userName: string;
}

interface LocationState {
  userName: string;
}


const QualificationPage: FC = () => {
  const { qualifications, setQualifications, socialLinks, setSocialLinks } = useQualifications();
  const navigate = useHistory();
  //const location = useLocation<{ state: LocationState }>();
  const location = useLocation<LocationState>();

  //use sessions to store username
  const [userName, setUserName] = useState<string>(sessionStorage.getItem('username') || '');

  const [behance, setBehance] = useState<string>('');
  const [linkedIn, setLinkedIn] = useState<string>('');
  const [portfolio, setPortfolio] = useState<string>('');

  
//access context of freelancer
const {freelancerCon}:any= useContext(FreelancerContext); //asking the data
console.log("Hereeeeeee the freelancer: ", freelancerCon);


  const navigateToUploadPage = (): void => {
    navigate.push('/upload-qualification');
  };

  const addSocialLinks = (e: React.FormEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    const socialLinkData: SocialLinkData = { behance, linkedIn, portfolio, userName };

    createSocialLink(socialLinkData).then((response) => {
      console.log(response.data);
      navigate.push('/OTPVerificationPage');
    });
  };

  return (
    <div className="qua_container" style={{ marginTop:'70px' }}>
      <h1 className="qua_title">Add your Qualifications</h1>
      <button type="button" className="qua_button-add" onClick={navigateToUploadPage}>Add Qualification</button>
      
      <div className="container">
        <div className="row">
          {qualifications.map((qualification, index) => (
            <div className="col-md-4" key={index}>
              <div className="qua_card">
                <div className="qua_card-body">
                  <h4 className="qua_card-title">Title: {qualification.title}</h4>
                  <h6 className="qua_card-info">{qualification.image.length} {qualification.image.length === 1 ? 'Image' : 'Images'}</h6>
                  <p>
                    <strong>Start:</strong> {qualification.startDate} <strong>End:</strong> {qualification.endDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <form className="qua_form">
        <div className="form-group">
          
          <label htmlFor="linkedIn" className="qua_label">LinkedIn Profile</label>
          <input type="text" className="form-control qua_input" id="linkedIn" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} placeholder="Optional" />
        </div>
        <div className="form-group">
          <label htmlFor="behance" className="qua_label">Behance Profile</label>
          <input type="text" className="form-control qua_input" id="behance" value={behance} onChange={(e) => setBehance(e.target.value)} placeholder="Optional" />
        </div>
        <div className="form-group">
          <label htmlFor="portfolio" className="qua_label">Portfolio Site</label>
          <input type="text" className="form-control qua_input" id="portfolio" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="Optional" />
        </div>
        <div className="form-group mt-3">
          <button type="submit" className="qua_submit-button" onClick={addSocialLinks}>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default QualificationPage;
