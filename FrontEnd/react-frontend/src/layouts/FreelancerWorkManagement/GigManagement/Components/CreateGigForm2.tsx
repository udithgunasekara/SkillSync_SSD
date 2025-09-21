import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const CreateGigForm2: React.FC = () => {
    const history = useHistory();
    const { gigId } = useParams<{ gigId: string }>();
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (imageFiles.length < 2) {
            window.alert('Please upload at least two images.');
            return;
        }

        const uniqueImageFiles = getUniqueImages(imageFiles);

        if (uniqueImageFiles.length !== imageFiles.length) {
            window.alert('You have uploaded duplicate images. Please upload unique images.');
            return;
        }

        const formData = new FormData();
        uniqueImageFiles.forEach((file, index) => {
            // Generate a unique identifier for each image
            const uniqueFileName = `${file.name}_${Date.now()}_${index}`;
            // Append each file with the key "image"
            formData.append('image', file, uniqueFileName);
        });

        try {
            const response = await axios.post(`http://localhost:8082/freelancer-gigs/${gigId}/gig-images/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Images uploaded successfully:', response.data);
            handleNextClick(gigId);
        } catch (error) {
            console.error('Error uploading images:', error);
            window.alert('Failed to upload images. Please try again.');
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImageFiles(prevState => {
                const newImageFiles = [...prevState];
                newImageFiles[index] = file;
                return newImageFiles;
            });
        }
    };

    const handleDeleteImage = (index: number) => {
        setImageFiles(prevState => {
            const newImageFiles = [...prevState];
            newImageFiles.splice(index, 1);
            return newImageFiles;
        });
    };

    const handleNextClick = (gigId: string) => {
        history.push(`/CreateGigForm3/${gigId}`);
    };

    const getUniqueImages = (files: File[]) => {
        const uniqueFiles: File[] = [];
        files.forEach(file => {
            if (!uniqueFiles.some(uniqueFile => uniqueFile.name === file.name)) {
                uniqueFiles.push(file);
            }
        });
        return uniqueFiles;
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: '800px',
        margin: 'auto',
        marginTop: '80px'
    };

    const rowStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: '20px'
    };

    const imageWrapperStyle: React.CSSProperties = {
        width: '30%',
        position: 'relative',
        marginBottom: '20px',
    };

    const noteStyle: React.CSSProperties = {
        fontSize: '0.9em',
        color: '#666',
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        border: '1px solid #ccc',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    const imageStyle: React.CSSProperties = {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '5px'
    };

    const deleteButtonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '5px',
        right: '5px',
        padding: '5px',
        borderRadius: '50%',
        background: '#fff',
        border: 'none',
        cursor: 'pointer',
        zIndex: 1,
        width: '30px',
        height: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    return (
        <div className="container" id="containerGigCreate" style={containerStyle}>
            <h2 className="text-center mb-4 text-danger">Upload Images</h2>
            <ul style={noteStyle}>
                <li>*Upload images for the client to get an idea about your work : Upload past project photos if possible.</li>
                <li>*Minimum of 2 images are required.</li>
                <li>*Only JPG and PNG formats are accepted.</li>
            </ul>
            <form onSubmit={handleSubmit}>
                <div style={rowStyle}>
                    {[...Array(6)].map((_, index) => (
                        <div key={index} style={imageWrapperStyle}>
                            {imageFiles[index] ? (
                                <>
                                    <img src={URL.createObjectURL(imageFiles[index])} alt={`Image ${index + 1}`} style={imageStyle} />
                                    <button type="button" onClick={() => handleDeleteImage(index)} style={deleteButtonStyle}>
                                        <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red', fontSize: '20px' }} />
                                    </button>
                                </>
                            ) : (
                                <label htmlFor={`image${index}`} style={{ width: '100%', height: '200px', border: '2px dashed #ccc', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <span style={{ fontSize: '3em', color: '#ccc' }}>+</span>
                                </label>
                            )}
                            <input
                                type="file"
                                id={`image${index}`}
                                accept="image/jpeg, image/png"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageChange(e, index)}
                            />
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary btn-lg">Next</button>
                </div>
            </form>
        </div>
    );
};

export default CreateGigForm2;
