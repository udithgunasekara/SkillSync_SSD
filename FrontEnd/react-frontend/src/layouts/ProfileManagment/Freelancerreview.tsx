import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MDBIcon } from 'mdb-react-ui-kit';
import './Freelancerreview.css'

interface Rating {
    id: string;
    rating: number;
    review: string;
}

const Freelancerreview: React.FC = () => {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const { username } = useParams<{ username: string }>();
    const role: string = 'freelancer';

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const useridResponse = await axios.get(`http://localhost:8082/User/${username}/${role}`);
                const userid: string = useridResponse.data.userId;
                const response = await axios.get<Rating[]>(`http://localhost:8082/api/ratings/user/${userid}`);
                setRatings(response.data);
            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        };
        
        fetchRatings();
    }, [username, role]);

    // Function to generate star icons based on rating value
    const renderStarRating = (rating: number): JSX.Element[] => {
        const stars: JSX.Element[] = [];
        const fullStars: number = Math.floor(rating); // Get the integer part of the rating
        const halfStar: number = rating - fullStars; // Get the fractional part of the rating

        // Render full stars
        for (let i = 1; i <= fullStars; i++) {
            stars.push(<MDBIcon key={i} fas icon="star" size='lg' style={{ color: 'orange' }} />);
        }

        // Render half-colored star if there is a fractional part
        if (halfStar > 0) {
            stars.push(<MDBIcon key="half" fas icon="star-half-alt" size='lg' style={{ color: 'orange' }} />); // Half-colored star
        }

        // Render empty stars to fill the rest
        for (let i = stars.length + 1; i <= 5; i++) {
            stars.push(<MDBIcon far icon="star" size='lg'  key={i} style={{ color: 'orange' }}/>);
        }

        return stars;
    };

    return (
        <div className='Freelance-review'>
            <ul>
                {ratings.map((rating: Rating) => (
                    <div key={rating.id} className='one-review-div'>

                        <p>{renderStarRating(rating.rating)}</p> 
                        <p>{rating.review}</p>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default Freelancerreview;
