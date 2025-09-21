import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TestComponent: React.FC = () => {
  const { examIdPk = '' } = useParams<{ examIdPk: string }>();

  const [file, setFile] = useState<File | null>(null);
  const [creditPoints, setCreditPoints] = useState<number>(0);
  const [badgeLevel, setBadgeLevel] = useState<number>(0);
  const [imageURL, setImageURL] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() =>{
    fetchImage();
  },[examIdPk])

  const handleCreditPointsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCreditPoints(Number(e.target.value));
  };

  const handleBadgeLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBadgeLevel(Number(e.target.value));
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`http://localhost:8082/api/badge/${examIdPk}`, formData, {
        params: {
          creditPoints: creditPoints,
          badgeLevel: badgeLevel
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Image uploaded successfully.');
      fetchImage();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  const fetchImage = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/api/badge/${examIdPk}`, {
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

  return (
    <div><br></br><br></br>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <label>
        Credit Points:
        <input type="number" value={creditPoints} onChange={handleCreditPointsChange} />
      </label>
      <br />
      <label>
        Badge Level:
        <input type="number" value={badgeLevel} onChange={handleBadgeLevelChange} />
      </label>
      <br />
      <button onClick={handleUpload}>Upload</button>
      {imageURL && <img src={imageURL} alt="Uploaded Badge" />}
    </div>
  );
};

export default TestComponent;