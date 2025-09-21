import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRating } from '../deliveringJobsRatingSystemServices/RatingService';
import { useHistory } from 'react-router-dom';

// Define the Rating type based on your response data structure
interface Rating {
    projectId?: string;
    rate?: number;
    review?: string;
    userId?: string;
}

const ViewRatingComponent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [rating, setRating] = useState<Rating>({});
    const navigator = useHistory();

    useEffect(() => {
        const numericId = parseInt(id, 10);
        getRating(numericId)
            .then(response => {
                setRating(response.data);
            })
            .catch(error => {
                console.error('Error fetching rating:', error);
            });
    }, [id]);

    // Function to navigate back to the ratings page
    const handleBack = (): void => {
        navigator.push('/ratings');
    };

    return (
        <div className='container'>
            <br />
            <br />
            <div className='card col-md-6 offset-md-3'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h2 className='text-center'>View Rating Details</h2>
                            <hr />
                            <div>
                                Project ID: {rating.projectId}
                            </div>
                            <div>
                                Rate: {rating.rate}
                            </div>
                            <div>
                                Review: {rating.review}
                            </div>
                            <div>
                                User ID: {rating.userId}
                            </div>
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
                                    onMouseOver={(e) => e.currentTarget.style.boxShadow = '0px 8px 8px rgba(0, 0, 0, 0.2)'}
                                    onMouseOut={(e) => e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)'}>
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewRatingComponent;
