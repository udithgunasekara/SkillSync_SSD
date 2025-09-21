import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ConversationForm from './Conversation';
import FreelancerGigsDetails from './FreelancerGigsDetails';
import Freelancerreview from './Freelancerreview';
import { MDBIcon } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './FreelancerDetails.css';
import { listExams } from '../ExamsManagment/service/ExamsService';
import { getUserResultByUserName } from '../ExamsManagment/service/UserResultService';



interface Freelancer {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  created_at: string;
  level: string;
}

interface Client {
  email: string;
  country: string;
}

interface Language {
  id: number;
  language: string;
}

interface Skill {
  id: number;
  skill: string;
}

interface Education {
  id: number;
  username:string;
  institute: string;
  title: string;
  major: string;
  year: string;
}

interface NewEducation {
  username: string;
  institute: string;
  title: string;
  major: string;
  year: string;
}

interface Exam {
  id: string;
  examName: string;
  examDescription: string;
  noOfAttempts: string;
  badgeName: string;
  badge: File | null;
  creditPoint: string;
  timeLimit: string;
}

interface userResult {
  userNamePk: string;
  examIdPk: string;
  result: string;
}

const FreelancerDetails: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [result, setResult] = useState<userResult[]>([]);
  const { username } = useParams<{ username: string }>();
  const registeruser = sessionStorage.getItem('username');
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [language, setLanguage] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skill, setSkill] = useState<string>('');
  const [description, setDescription] = useState<string | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showlang, setShowLang] = useState<boolean>(false);
  const [showskill, setShowSkill] = useState<boolean>(false);
  const [showedu, setShowEdu] = useState<boolean>(false);
  const [ShowAboutme, setShowAboutme] = useState<boolean>(true);
  const [ShowReviews, setShowReviews] = useState<boolean>(false);
  const [ShowMyGigs, setShowMyGigs] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [neweducation, setNewEducation] = useState<NewEducation>({
    username: username,
    institute: '',
    title: '',
    major: '',
    year: ''
  });

  const fetchImage = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/api/images/${username}`, {
        responseType: 'blob', 
      });
      if (response.data) {
        const imageUrl = URL.createObjectURL(response.data);
        setImageURL(imageUrl);
      } else {
        const defaultImageUrl = 'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg'; 
        setImageURL(defaultImageUrl);
      }
    } catch (error) {
      const defaultImageUrl = 'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg'; 
      setImageURL(defaultImageUrl);
      console.error('Error fetching image:', error);
    }
  };

  useEffect(() => {
    getAllExam();
    getAllResult()
  }, []);

  function getAllResult() {
    getUserResultByUserName(username)
      .then((response) => {
        setResult(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getAllExam() {
    listExams()
      .then((response) => {
        setExams(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    const fetchFreelancerDetails = async () => {
      try {
        const response = await axios.get<Freelancer>(`http://localhost:8082/freelancers/${username}`);
        setFreelancer(response.data);

        const languagesResponse = await axios.get<Language[]>(`http://localhost:8082/Freelancer/language/${username}`);
        setLanguages(languagesResponse.data);

        const descriptionResponse = await axios.get<{ description: string }>(`http://localhost:8082/Freelancer/Description/${username}`);
        if(descriptionResponse.data){
          setDescription(descriptionResponse.data.description);
        } else {
          setDescription(null);
        }

        const skillResponse = await axios.get<Skill[]>(`http://localhost:8082/freelancer/skills/${username}/getall`);
        setSkills(skillResponse.data);

        const educationResponse = await axios.get<Education[]>(`http://localhost:8082/freelancer/education/${username}/get`);
        setEducation(educationResponse.data);

        const clientResponse = await axios.get<Client>(`http://localhost:8082/clients/${username}`);
        setClient(clientResponse.data);

        setLoading(false); // Set loading to false after data fetching is done
      } catch (error) {
        console.error('Error fetching freelancer details:', error);
        setLoading(false); // Set loading to false if there's an error
      }
    };

    fetchImage(); 
    fetchFreelancerDetails();
  }, [username]);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      // Check if the selected file is a PNG or JPEG
      if (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpeg') {
        setFile(selectedFile);
      } else {
        alert('Please select a PNG or JPEG image file.');
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      alert('Please select an image file.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      await axios.post(`http://localhost:8082/api/images/upload/${username}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Image uploaded successfully.');
      window.location.reload();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    }
  };
  

  const handleAccountswichingClick = () => {
    if (client && client.email === freelancer?.email) {
      window.location.href = `http://localhost:3000/clients/${username}`;
    } else {
      window.location.href = 'http://localhost:3000/Client/Registration'; 
    }
  };

  const handleButtonClick = () => {
    setShowForm(true);
  };
  const ShowaboutmeButtonClick = () => {
    setShowAboutme(true);
    setShowReviews(false);
    setShowMyGigs(false);
  };
  const ShowReviewsButtonClick = () => {
    setShowAboutme(false);
    setShowReviews(true);
    setShowMyGigs(false);
  };
  const ShowMyGigsButtonClick = () => {
    setShowAboutme(false);
    setShowReviews(false);
    setShowMyGigs(true);
  };
  
  const ShowMyFreelancerdashboardButtonClick = () => {
    window.location.href = ('http://localhost:3000/FreelancerDashboard');
  };

  const handleApplyExam = () => {
    window.location.href = ('http://localhost:3000/FreelancerDashboard');
  };

  const handleLanguageEditClick = () => {
    setShowLang(true);
  };
  const handleSkillEditClick = () => {
    setShowSkill(true);
  };
  const handleEduEditClick = () => {
    setShowEdu(true);
  };

  const handleEduEditCancelClick = () => {
    setShowEdu(false);
  };

  const handleLanguageEditCancelClick = () => {
    setShowLang(false);
  };

  const handleSkillEditCancelClick = () => {
    setShowSkill(false);
  };

  const handleCancelClick = () => {
    setShowForm(false);
  };

  const handleDeleteLanguage = async (language: string) => {
    try {
      await axios.delete(`http://localhost:8082/Freelancer/language/${username}/${language}`);
      setLanguages(prevLanguages => prevLanguages.filter(lang => lang.language !== language));
      alert('Language deleted successfully.');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting language:', error);
      alert('Error deleting language. Please try again.');
    }
  };

  const handleDeleteSkill = async (skill: string) => {
    try {
      await axios.delete(`http://localhost:8082/freelancer/skills/${username}/${skill}`);
      setSkills(prevSkills => prevSkills.filter(sk => sk.skill !== skill));
      alert('Skill deleted successfully.');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Error deleting skill. Please try again.');
    }
  };

  const handleDeleteEducation = async (eduid: number) => {
    try {
      await axios.delete(`http://localhost:8082/freelancer/education/${username}/${eduid}`);
      setEducation(prevEducation => prevEducation.filter(edu => edu.id !== eduid));
      alert('Education deleted successfully.');
    } catch (error) {
      console.error('Error deleting education:', error);
      alert('Error deleting education. Please try again.');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:8082/Freelancer/Description/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          description: description
      }),
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        throw new Error('Failed to update description');
      }
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(inputValue)) {
      setLanguage(inputValue);
    }
  };

  
  
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const inputValue = e.target.value;
  if (/^[a-zA-Z+#\s]*$/.test(inputValue)) {
    setSkill(inputValue);
  }
};

  const handleSkillSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (skill.trim() === '') {
      alert('Please enter a valid skill.');
      return;
    }
    try {
      const response = await axios.post<any>(`http://localhost:8082/freelancer/skills/`, {
        username: username,
        skill: skill.trim()
      });
      alert('Skill added successfully: ' + response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('An error occurred while adding the skill');
    }
  };
  const handlelanguagesSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (language.trim() === '') {
      alert('Please enter a valid language.');
      return;
    }
    try {
      await axios.post<any>(`http://localhost:8082/Freelancer/language`, {username: username, language: language.trim()});
      alert('Language added successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error adding language:', error);
      alert('An error occurred while adding the language');
    }
  };
  
  const handleEduChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const onlyStringRegex = /^[a-zA-Z\s]*$/;
    
    if (name !== "year" && onlyStringRegex.test(value)) {
        setNewEducation(prevState => ({
            ...prevState,
            [name]: value
        }));
    } else if (name !== "year") {
        console.log('Invalid input. Only string characters are allowed.');
    } else {
        setNewEducation(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
};


  
  const handleEduSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8082/freelancer/education/{username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(neweducation)
      });
      if (response.ok) {
        console.log('Education data added successfully');
        window.location.reload();
      } else {
        console.error('Failed to add education data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!freelancer) {
    return <div>Freelancer not found!</div>; 
  }

 
  const registrationDate = new Date(freelancer.created_at);
  const monthName = new Intl.DateTimeFormat('en', { month: 'long' }).format(registrationDate);
  const year = registrationDate.getFullYear();


  return (
    <div>
      <h2>Freelancer Details</h2>

      <div className='profile-div'>
      {imageURL && <img src={imageURL} alt="Uploaded" style={{ maxWidth: '100%' }} className='profile-image'/>}
      {(registeruser===username) && (<div className='image-upload-div'>
        <input type="file" accept="image/*" onChange={handleFileChange} className='choose-file-btn'/>
        <button onClick={handleUpload} className='image-upload'><MDBIcon fas icon="file-upload" /></button>
      </div>)}
      {client && client.email === freelancer.email && (
        <button onClick={handleAccountswichingClick} className='switch-btn'>Client Mode</button>
      )}
      {client && client.email !== freelancer.email && (
        <button onClick={handleAccountswichingClick} className='switch-btn'>Client Mode</button>
      )}
      {!client &&(
        <button onClick={handleAccountswichingClick} className='switch-btn'>Client Mode</button>
      )}
    </div>
    
    <p className='username'><b>@{freelancer.userName}</b></p>
      <div className='detail-card'>
      
      <p>Name: {freelancer.firstName} {freelancer.lastName}</p>
      <hr/>
      <p>level: {freelancer.level}    {(registeruser===username) && (<button className='exam-apply-profile' onClick={handleApplyExam}>apply exam</button>)}</p>
      <p className='detail-div-1'>Country: {client?.country}</p>
      <p className='detail-div-2'>Registered Date: {monthName} {year}</p>

      <div className='badge-prof-disp'>
        {exams
          .filter(exam => result.find(res => res.examIdPk === exam.id)) // Filter exams that are present in the result
          .map((exam) => (
            <img src={`data:image/jpeg;base64,${exam.badge}`} className="profile-badge" alt={exam.examName} style={{left: '300px'}}/>
        ))}
      </div>
     
      
      {(registeruser!==username) && (<div>
          <ConversationForm/>
        </div>)}
      <br/><br/>
    <div className="box">
      <div className="group">
        <div className="overlap-group">
          <button className="About-me-btn" onClick={ShowaboutmeButtonClick}>About me</button>
          <button className="Reviews-btn" onClick={ShowReviewsButtonClick}>Reviews</button>
          <button className="My-Gigs" onClick={ShowMyGigsButtonClick}>My Gigs</button>
          <button className="My-Freelancer-dashboard" onClick={ShowMyFreelancerdashboardButtonClick}>My Freelancer dashboard</button>
        </div>
      </div>
    </div>
    {(ShowAboutme) && (<div className='About-me'>
    <div className='Description-div'>
          
      </div>
      <h2 id='desc-free-title'>Description</h2>
          {(registeruser===username) && (!showForm) && (<button onClick={handleButtonClick} className='Add-description'>Edit description</button>)}
      {(!showForm) && description ? (
          <p id='desc-free-para'>{description}</p>   
      ):(<p id='desc-free-para'>no description found!!</p>)}
      
      {showForm && (
        <div className='description-edit-form-free'>
      <form onSubmit={handleSubmit}>
      <textarea
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            cols={50}
            className='description-input'
            placeholder='Enter description'
          />
        <button type="submit" className='Add-Description-btn-free'>Save Description</button>
        <button onClick={handleCancelClick} className='freelancer-Description-cancel'>cancel</button>
      </form>
        </div>
      )}

      

      <div className='Languages-div'>
      <h2 id='lang-free-title'>Languages</h2>
      {(registeruser===username) && (!showlang) && (<button onClick={handleLanguageEditClick} className='Add-language'>Add language</button>)}
      
      
      {showlang && (
        <div className='add-language-div'>
      <form onSubmit={handlelanguagesSubmit} className='lang--edit-form-free'>
      <input
        type="text"
        value={language}
        onChange={handleLanguageChange}
        required
        className='language-input'
      />
      <br/>
      <button type="submit" className='add-language-btn'>Add Language</button>
      <button onClick={handleLanguageEditCancelClick} className='cancel-language'>cancel</button>
    </form>
        </div>
      )}
{!showlang && (
  <ul>
    {languages && languages.length > 0 ? (
      languages.map((language, index) => (
        <span id='lang-list-free' key={language.id || index}>
          {language.language}{'   '}
          {(registeruser===username) && (<button onClick={() => handleDeleteLanguage(language.language)} className='Delete-language'>
            <MDBIcon fas icon="trash-alt" />
          </button>)}
        </span>
      ))
    ) : (
      <p id='lang-list-free'>No Language available.</p>
    )}
  </ul>
)}
      </div>

<div className='Skill-div'>
  
<h2 id='skill-free-title'>Skills</h2>

{(registeruser===username) && (!showskill) && (<button onClick={handleSkillEditClick} className='Add-skill'>Add Skills</button>)}

{showskill && (
  <div className='Skill--edit-form-free'>
  <form onSubmit={handleSkillSubmit}>
  <input
  type="text"
  value={skill}
  onChange={handleChange}
  required
  className='skill-input'
  placeholder="Enter skill"
/><br/>
    <button type="submit" className='add-skill-btn'>Add Skill</button>
    <button onClick={handleSkillEditCancelClick} className='cancel-skill'>cancel</button>
  </form>
</div>
)}


{!showskill && (
<ul>
{skills && skills.length > 0 ? (
skills.map((skill, index) => ( 
  <span id='skill-free-list' key={skill.id || index}>
    {skill.skill} {(registeruser===username) && (<button onClick={() => handleDeleteSkill(skill.skill)} className='delete-skill'><MDBIcon fas icon="trash-alt" /></button>)}
  </span>
))
) : (
<p id='skill-free-list'>No skills available.</p>
)}

</ul>
)}
<hr/>

</div>
      <h2 id='edu-title'>Education</h2>
      {(registeruser===username) && (!showedu) && (<button onClick={handleEduEditClick} className='Add-education'>Add Education institute</button>)}
      
      {showedu && (
        <div className='Add-edu-for-free'>
        <form onSubmit={handleEduSubmit} className='edu--edit-form-free'>
        <input
              type="text"
              name="institute"
              value={neweducation.institute}
              onChange={handleEduChange}
              className='Institute'
              placeholder='Select Institute'
              required
            /><br/>

            <select
              name="title"
              value={neweducation.title}
              onChange={handleEduChange}
              className='Title'
              required
            >
              <option value="" disabled>Select Title</option>
              <option value="Associate Certificate">Associate Certificate</option>
              <option value="B.A.">B.A.</option>
              <option value="BArch">BArch</option>
              <option value="BM">BM</option>
              <option value="BFA">BFA</option>
              <option value="B.Sc.">B.Sc.</option>
              <option value="M.A.">M.A.</option>
              <option value="M.B.A.">M.B.A.</option>
              <option value="MFA">MFA</option>
              <option value="M.Sc.">M.Sc.</option>
              <option value="J.D.">J.D.</option>
              <option value="M.D.">M.D.</option>
              <option value="Ph.D">Ph.D</option>
              <option value="LLB">LLB</option>
              <option value="LLM">LLM</option>
              <option value="Other">Other</option>
            </select>
            <br/>
    
            <input
              type="text"
              name="major"
              value={neweducation.major}
              onChange={handleEduChange}
              className='major'
              placeholder='Select major'
              required
            />
            <br/>
    
            <input
              type="date"
              name="year"
              value={neweducation.year}
              onChange={handleEduChange}
              className='year'
              required
            />
            <button type="submit" className='add-education-btn'>Submit</button>
          <button onClick={handleEduEditCancelClick} className='cancel-Edu'>cancel</button>
        </form>
      </div>
        
      )}

      {(!showedu) && (<ul>
  {education && education.length > 0 ? (
    education.map((edu) => (
      <li id='edu-list' key={edu.id}>
        <hr/>
        <p>{edu.institute} - {edu.title} {edu.major}    {(registeruser===username) && (<button onClick={() => handleDeleteEducation(edu.id)} className='delete-education'><MDBIcon fas icon="trash-alt" /></button>)}</p>
        <p>Graduated on {edu.year}</p>
      </li>
    ))
  ) : (
    <p id='edu-list'>No education data available</p>
  )}
</ul>
)}
      
    </div>)}
      </div>
    <div className='show-gigs'>
    {(ShowMyGigs) && (<FreelancerGigsDetails/>)}
    </div>
    <div>
    {(ShowReviews) && (<div className='free-review-div'><Freelancerreview/></div>)}
    </div>
    </div>
  );
};

export default FreelancerDetails;
