import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ConversationForm from './Conversation';
import { MDBIcon } from 'mdb-react-ui-kit';
import './ClientDetails.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

interface Client {
  userName: string;
  firstName: string;
  lastName: string;
  country: string;
  email: string;
  created_at: string;
}

interface Language {
  id: number;
  language: string;
}

const ClientDetails: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const registeruser = sessionStorage.getItem('username');
  const [freelancer, setFreelancer] = useState<Client | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showlang, setShowLang] = useState<boolean>(false);
  const [ShowAboutme, setShowAboutme] = useState<boolean>(true);
  const [ShowMyjobs, setShowMyjobs] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

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
    const fetchClientDetails = async () => {
      try {
        const clientResponse = await axios.get<Client>(`http://localhost:8082/clients/${username}`);
        setClient(clientResponse.data);

        const languagesResponse = await axios.get<Language[]>(`http://localhost:8082/client/language/${username}`);
        setLanguages(languagesResponse.data);

        const descriptionResponse = await axios.get<{ description: string }>(`http://localhost:8082/Client/Description/${username}`);
        if(descriptionResponse.data){
          setDescription(descriptionResponse.data.description);
        } else {
          setDescription(null);
        }

        const freelancerResponse = await axios.get<Client>(`http://localhost:8082/freelancers/${username}`);
        setFreelancer(freelancerResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching client details:', error);
        setLoading(false);
      }
    };
    fetchImage(); 
    fetchClientDetails();
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
    if (freelancer && freelancer.email === client?.email) {
      window.location.href = `http://localhost:3000/freelancers/${username}`;
    } else {
      window.location.href = 'http://localhost:3000/Freelancer/Registration';
    }
  };

  const handlelangChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only allow alphabetic characters (letters)
    if (/^[a-zA-Z]*$/.test(inputValue)) {
      setLanguages([{ id: Date.now(), language: inputValue }]);
    }
  };

  const handlelangSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8082/client/language`, {username: username, language: languages[0]?.language});
      alert('Language added successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error adding language:', error);
      alert('An error occurred while adding the language');
    }
  };

  const handledescriptionSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:8082/Client/Description`, {
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
        //console.error('Failed to add description');
      }
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleLanguageEditClick = () => {
    setShowLang(true);
  };

  const handleLanguageEditCancelClick = () => {
    setShowLang(false);
  };

  const handleCancelClick = () => {
    setShowForm(false);
  };

  const ShowaboutmeButtonClick = () => {
    setShowAboutme(true);
    setShowMyjobs(false);
  };

  const ShowMyjobsClick = () => {
    window.location.href = 'http://localhost:3000/jobs';
  };

  const handleDeleteLanguage = async (language: string) => {
    try {
      await axios.delete(`http://localhost:8082/client/language/language/${username}/${language}`);
      setLanguages(prevLanguages => prevLanguages.filter(lang => lang.language !== language));
      alert('Language deleted successfully.');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting language:', error);
      alert('Error deleting language. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>Client not found!</div>;
  }

  const registrationDate = new Date(client.created_at);
  const monthName = new Intl.DateTimeFormat('en', { month: 'long' }).format(registrationDate);
  const year = registrationDate.getFullYear();

  return (
    <div>
        <h2>Client Details</h2>
        <div className='profile-div'>
      {imageURL && <img src={imageURL} alt="Uploaded" style={{ maxWidth: '100%' }} className='profile-image'/>}
      {(registeruser===username) && (<div className='image-upload-div'>
        <input type="file" accept="image/*" onChange={handleFileChange} className='choose-file-btn'/>
        <button onClick={handleUpload} className='image-upload'><MDBIcon fas icon="file-upload" /></button>
      </div>)}
      <p className='username'><b>@{client.userName}</b></p>
    </div>
      <div className='detail-card'>
      <p>Name: {client.firstName} {client.lastName}</p>
      <hr/>
      <p id='detail-div-1'>Country: {client.country}</p>
      <p id='detail-div-2'>Registered Date: {monthName} {year}</p>

      {freelancer && freelancer.email === client.email && (
        <button onClick={handleAccountswichingClick} className='switch-btn'>Freelancer Mode</button>
      )}
      {freelancer && freelancer.email !== client.email && (
        <button onClick={handleAccountswichingClick} className='switch-btn'>Freelancer Mode</button>
      )}
      {!freelancer &&(
        <button onClick={handleAccountswichingClick} className='switch-btn'>Freelancer Mode</button>
      )}

{(registeruser!==username) && (<div>
          <ConversationForm/>
        </div>)}
        <br/><br/>
    <div className="box">
      <div className="group">
        <div className="overlap-group">
          <button className="About-me-btn" onClick={ShowaboutmeButtonClick}>About me</button>
          <button className="my-jobs-btn" onClick={ShowMyjobsClick}>My jobs</button>
        </div>
      </div>
    </div>
      {(ShowAboutme) && (<div>
      <div>
      <h2 id='description-title-client'>Description</h2>
      {(registeruser===username) && (!showForm) && (<button onClick={handleButtonClick} className='Add-description'>Edit description</button>)}
      
      {(!showForm) && description ? (
          <p id='description-para-client'>{description}</p>
        
      ):(<p id='description-para-client'>no description found!!</p>)}
      </div>

      
      {showForm && (
        <div className='add-description-div'>
        <form onSubmit={handledescriptionSubmit}>
          <label>
            Description:
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              cols={50}
              className='description-input'
              placeholder='Enter the description'
            />
          </label>
          <br/>
          <button type="submit" id='add-discription'>Save Description</button>
          <button onClick={handleCancelClick} className='cancel-description' id='cancel-description'>cancel</button>
        </form>
      </div>
      )}

      <h2 className='language-title-client' id='language-title-client'>Languages</h2>
      {(registeruser===username) && (!showlang) && (<button onClick={handleLanguageEditClick} className='add-language'>Add language</button>)}
      
      {showlang && (
        <div className='add-lang-form-div'>
        <form onSubmit={handlelangSubmit}>
          <label>
            Language:
            <input
              type="text"
              onChange={handlelangChange}
              required
              className='lang-input'
              placeholder='Enter language'
            />
          </label>
          <br/>
          <button type="submit" className='add-lang-btn'>Add Language</button>
          <button onClick={handleLanguageEditCancelClick} id='cancel-language'>cancel</button>
        </form>
      </div>
        
        
      )}

{!showlang && (
  <ul className="languages-list">
  {languages && languages.length > 0 ? (
    languages.map((language, index) => (
      <span key={language.id || index} className="language-item">
        {language.language}{' '}
        <button onClick={() => handleDeleteLanguage(language.language)} className='Delete-language' id='Delete-language'>
          <MDBIcon fas icon="trash-alt" />
        </button>
      </span>
    ))
  ) : (
    <p className='language-item'>No Language available.</p>
  )}
</ul>
)}
      </div>)}
      </div>
    </div>
  );
};

export default ClientDetails;
