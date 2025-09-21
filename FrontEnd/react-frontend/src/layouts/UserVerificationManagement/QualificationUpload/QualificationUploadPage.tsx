import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQualifications } from './QualificationsContext';
import { createQualification } from '../Services/UserManagementService';
//import './QualificationUploadPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { validateStartDate, validateEndDate, validateImageUpload } from '../UserRegistration/FormValidation';
import FreelancerContext from '../Context/Context';


//This is the page that getting the qualification details (title, dates and images)

interface LocationState {
  userName: string;
}


const QualificationUploadPage = () => {
  const navigate = useHistory();
  //const location = useLocation();
  const location = useLocation<LocationState>();


  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState([]);
  const { setQualifications } = useQualifications();
  //const { qualifications, setQualifications } = useQualifications();
  //const [userName, setUserName] = useState('');
  const [userName, setUserName] = useState<string>(sessionStorage.getItem('username') || '');

  //getting username from context
  const {freelancerCon}:any = useContext(FreelancerContext);


  

  //Error handling 
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [imageError, setImageError] = useState('');

  // useEffect(() => {
  //   if (location.state?.userName) {
  //     setUserName(location.state.userName); // Set userName from passed state
  //   }
  // }, [location.state]);
  

  const handleFileChange = (e: any) => {
    const files = e.target.files;

    setImage(Array.from(e.target.files));
    if (!validateImageUpload(files)) {
      setImageError('Only PNG images are allowed, and you must upload more than 2.');
      return;
    }else{
      setImageError('');
    }
    
  };

  //covert formData
  const handleSubmit = (e: any) => {
    e.preventDefault();
    //const userName = 'kamal12'
    const formData = new FormData();
    formData.append('title', title);
    formData.append('username', freelancerCon); //adding sample user name
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);

    //validations
    if (!validateStartDate(startDate)) {
      alert('Start date is Wrong');
      return;
    }

    if (!validateEndDate(startDate, endDate)) {
      alert('End date is Wrong');
      return;
    }

    image.forEach((file, index) => {
      formData.append(`image`, file);
    });

    createQualification(formData)
      .then(response => {
        console.log(response.data);
        setQualifications(prev => [...prev, { ...response.data, image, title, startDate, endDate }]);
        navigate.push('/QualificationPage'); // Redirect after successful operation
      })
      .catch(error => {
        console.error('Failed to create qualification:', error);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <h2 className="card-header text-center text-white" style={{ backgroundColor: '#AC69E2' }}>
              Upload Qualification
            </h2>
            <div className="card-body">
              <form className="form-horizontal" onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="title" className="form-label">
                    Qualificationnnnn Title:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={title}
                    required
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter qualification title"
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="startDate" className="form-label">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    name="startDate"
                    value={startDate}
                    onChange={e => {
                      setStartDate(e.target.value);
                      setStartDateError(validateStartDate(e.target.value) ? '' : 'Start date cannot be in the future.');
                    }}
                  />
                  <div style={{ color: 'red' }}>{startDateError}</div>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="endDate" className="form-label">
                    End Date:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    name="endDate"
                    value={endDate}
                    onChange={e => {
                      setEndDate(e.target.value);
                      setEndDateError(
                        validateEndDate(startDate, e.target.value)
                          ? '' : 'End date must be the same or after the start date and cannot be in the future.'
                      );
                    }}
                  />
                  <div style={{ color: 'red' }}>{endDateError}</div>
                </div>
                <div
                  className="form-group mb-4 row"
                  style={{ padding: '15px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '5px' }}
                >
                  <label htmlFor="certificate" className="col-sm-3 col-form-label" style={{ fontWeight: 'bold' }}>
                    Upload Certificate:{' '}
                  </label>
                  <div className="col-sm-9">
                    <input type="file" className="form-control-file" id="certificate" multiple onChange={handleFileChange} />
                    <div style={{ color: 'red' }}>{imageError}</div>
                  </div>
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary w-100">
                    Save Qualification
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualificationUploadPage;
