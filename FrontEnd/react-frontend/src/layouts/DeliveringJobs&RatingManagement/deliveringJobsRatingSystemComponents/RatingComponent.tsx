import React, { useEffect, useState, FormEvent } from 'react';
import { createRating, getRating, updateRating } from '../deliveringJobsRatingSystemServices/RatingService';
import { useHistory, useParams } from 'react-router-dom';
import './RatingComponent.css'; // Import CSS file for star styling

interface Rating {
    id?: number;
    projectId: string;
    rating: number;
    review: string;
    userId: string;
}

interface Errors {
    projectId: string;
    review: string;
    userId: string;
}

interface RatingComponentProps {
    onNewRating?: (rating: Rating) => void;
}

const RatingComponent: React.FC<RatingComponentProps> = ({ onNewRating }) => {
    const [projectId, setProjectId] = useState<string>('');
    const [rate, setRate] = useState<number>(0);
    const [review, setReview] = useState<string>('');
    //const [userId, setUserId] = useState<string>('');
    const [userId, setUserId] = useState<string>(sessionStorage.getItem('id')|| '');
    const { id } = useParams<{ id: string }>();
    const [errors, setErrors] = useState<Errors>({
        projectId: '',
        review: '',
        userId: ''
    });

    const navigator = useHistory();

    useEffect(() => {
        if (id) {
            const numericId = parseInt(id, 10);
            getRating(numericId)
                .then((response) => {
                    setProjectId(response.data.projectId);
                    setRate(response.data.rating);
                    setReview(response.data.review);
                    setUserId(response.data.userId);
                })
                .catch((error) => {
                    console.error('Error fetching rating:', error);
                });
        }
    }, [id]);

    const saveOrUpdateRating = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (validateForm()) {
            const rating: Rating = {
                projectId,
                rating: rate,
                review,
                userId
            };
    
            try {
                if (id) {
                    // Update existing rating
                    const numericId = parseInt(id, 10);
                    if (!isNaN(numericId)) {
                        console.log('Updating rating with ID:', numericId, 'with data:', rating);
                        await updateRating(numericId, rating);
                        console.log('Rating updated successfully');
                    } else {
                        console.error('Invalid ID:', id);
                    }
                } else {
                    // Create new rating
                    console.log('Creating new rating with data:', rating);
                    const response = await createRating(rating);
                    if (onNewRating) {
                        console.log('Calling onNewRating with data:', response.data);
                        onNewRating(response.data);
                    }
                    console.log('Rating created successfully');
                }
                // Redirect to the list of ratings after successful submission
                navigator.push('/ratings');
            } catch (error) {
                console.error('Error during rating save or update:', error);
            }
        }
    };
    

    function validateForm(): boolean {
        let valid = true;
        const errorsCopy: Errors = { ...errors };

        // Validate Project ID
        if (!projectId || !/^\d+$/.test(projectId)) {
            errorsCopy.projectId = 'Project ID is required and must be a number';
            valid = false;
        } else {
            errorsCopy.projectId = '';
        }

        // Validate Review
        if (!review || !review.trim()) {
            errorsCopy.review = 'Review is required';
            valid = false;
        } else {
            errorsCopy.review = '';
        }

        // Validate User ID
        if (!userId || !/^[a-zA-Z0-9]+$/.test(userId)) {
            errorsCopy.userId = 'User ID is required and must contain only letters and numbers';
            valid = false;
        } else {
            errorsCopy.userId = '';
        }

        setErrors(errorsCopy);
        return valid;
    }

    // Function to handle star rating click
    const handleStarClick = (value: number): void => {
        setRate(value);
    };

    // Function to render star icons
    const renderStars = (): JSX.Element[] => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`fa fa-star ${rate >= i ? 'checked' : ''}`}
                    onClick={() => handleStarClick(i)}
                ></span>
            );
        }
        return stars;
    };

    const handleBack = () => {
        navigator.push('/ratings');
    };

    return (
        <div className="container">
            <br /> <br />
            <div className="row">
                <div className="card col-md-6 offset-md-3 offset-md-3">
                    <br />
                    <h2 className="text-center">{id ? 'Update Rating' : 'Add Rating'}</h2>
                    <hr />
                    
                    <div className="card-body">
                        <form onSubmit={saveOrUpdateRating}>
                            <div className="form-group mb-2">
                                <label className="form-label">Project ID :</label>
                                <input
                                    type="text"
                                    placeholder="Enter the project id"
                                    name="projectId"
                                    value={projectId}
                                    className={`form-control ${errors.projectId ? 'is-invalid' : ''}`}
                                    onChange={(e) => setProjectId(e.target.value)}
                                />
                                {errors.projectId && <div className="invalid-feedback"> {errors.projectId} </div>}
                            </div>

                            <div className="form-group mb-2">
                                <label className="form-label">Rating :</label>
                                {/* Render star icons */}
                                <div>{renderStars()}</div>
                            </div>

                            <div className="form-group mb-2">
                                <label className="form-label">Description :</label>
                                <textarea
                                    placeholder="Enter your review"
                                    name="review"
                                    value={review}
                                    className={`form-control ${errors.review ? 'is-invalid' : ''}`}
                                    onChange={(e) => setReview(e.target.value)}
                                />
                                {errors.review && <div className="invalid-feedback"> {errors.review} </div>}
                            </div>

                            <div className="form-group mb-2">
                                <label className="form-label">User ID :</label>
                                <input
                                    type="text"
                                    placeholder="Enter your ID"
                                    name="userId"
                                    value={userId}
                                    className={`form-control ${errors.userId ? 'is-invalid' : ''}`}
                                    onChange={(e) => setUserId(e.target.value)}
                                />
                                {errors.userId && <div className="invalid-feedback"> {errors.userId} </div>}
                            </div>

                            <br />
                            <br />
                            <button className="btn btn-success" type="submit">
                                Submit
                            </button>

                            <br />
                            <br />

                            <div className="col-md-4" style={{ width: '25%', paddingLeft: '5px', paddingRight: '5px' }}>
                                <button
                                    className="btn btn-danger btn-block"
                                    onClick={handleBack}
                                    style={{
                                        backgroundColor: '#c585f7',
                                        borderColor: '#c585f7',
                                        color: 'white',
                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                        transition: 'box-shadow 0.3s ease',
                                        width: '100%',
                                        marginBottom: '5px'
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0px 8px 8px rgba(0, 0, 0, 0.2)')}
                                    onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
                                >
                                    Back
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingComponent;
