import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { deleteRating, listRatings, searchRatings } from '../deliveringJobsRatingSystemServices/RatingService';
import { useHistory } from 'react-router-dom';

interface Rating {
    id: number;
    projectId: string;
    rate: number;
    review: string;
    userId: string;
}

const ListRatingComponent: React.FC = () => {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigator = useHistory();

    const getAllRatings = async () => {
        try {
            const response = await listRatings();
            setRatings((response.data as unknown) as Rating[]); // Cast the data to Rating[]
          } catch (error) {
            console.error('Error fetching all ratings:', error);
          }
    };

    // const getAllRatings = async () => {
    //     listRatings()
    //     .then(response => {
    //         setRatings(response.data);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     })
    // }

    /*const getAllRatings = async (): Promise<void> => {
        try {
            // Define the type of the expected response object
            const response: { data: Rating[] } = await listRatings();
            
            // Set the fetched ratings data to the state
            setRatings(response.data);
        } catch (error) {
            console.error('Error fetching all ratings:', error);
        }
    };*/
    

    useEffect(() => {
        getAllRatings();
    }, []);

    const addNewRating = () => {
        navigator.push('/add-rating');
        
        
    };

    const updateRating = (id: number) => {
        navigator.push(`/edit-rating/${id}`);
    };

    const removeRating = async (id: number) => {
        try {
            await deleteRating(id);
            getAllRatings();
            window.alert('Rating deleted successfully');
        } catch (error) {
            console.error('Error deleting rating:', error);
        }
    };

    const viewRating = (id: number) => {
        navigator.push(`/view-rating/${id}`);
    };

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault(); // Prevent form submission

        if (!searchTerm.trim()) {
            getAllRatings();
            return;
        }

        try {
            const response = await searchRatings(searchTerm); // Call the searchRating API
            setRatings((response.data as unknown) as Rating[]); // Set the search results to the state
        } catch (error) {
            console.error('Error searching ratings:', error);
        }
    };

    const handleNewRating = (newRating: Rating) => {
        setRatings((prevRatings) => [newRating, ...prevRatings]); // Add the new rating to the beginning of the array
    };
    

    const resetRatings = async () => {
        try {
            const response = await listRatings(); // Fetch all ratings
            setRatings((response.data as unknown) as Rating[]);// Set all ratings to the state
        } catch (error) {
            console.error('Error fetching all ratings:', error);
        }
    };

    const filteredRatings = ratings.filter((rating) => {
        const review = rating.review ? rating.review.toLowerCase() : '';
        const projectId = rating.projectId ? rating.projectId.toLowerCase() : '';
        const userId = rating.userId ? rating.userId.toLowerCase() : '';

        return (
            review.includes(searchTerm.toLowerCase()) ||
            projectId.includes(searchTerm.toLowerCase()) ||
            userId.includes(searchTerm.toLowerCase())
        );
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setSearchTerm(inputValue);
        if (!inputValue.trim()) {
            resetRatings();
        }
    };

    return (
        <div className='container'>
            <br />
            <br />
            <br />
            <h2 className='text-center'>List of Ratings</h2>
            <div className='mb-3'>
                <form className='d-flex' onSubmit={handleSearch}>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Search by keyword...'
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                    <button
                        className="btn btn-outline-success"
                        type="submit"
                        style={{
                            backgroundColor: '#c585f7',
                            borderColor: '#c585f7',
                            color: 'white',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'box-shadow 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.boxShadow = '0px 8px 8px rgba(0, 0, 0, 0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)'}
                    >
                        Search
                    </button>
                </form>
            </div>
            <button
                className='btn btn-primary mb-2'
                onClick={addNewRating}
                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0px 8px 8px rgba(0, 0, 0, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)'}
            >
                Add Rating
            </button>
            <div className='row'>
                {filteredRatings.map((rating) => (
                    <div className='col-md-4 mb-3' key={rating.id}>
                        <div className='card'>
                            <div className='card-body'>
                                <h5 className='card-title'>Rating ID: {rating.id}</h5>
                                <p className='card-text'>Project ID: {rating.projectId}</p>
                                <p className='card-text'>Rating: {rating.rate}</p>
                                <p className='card-text'>Review: {rating.review}</p>
                                <p className='card-text'>User ID: {rating.userId}</p>
                                <div className='btn-group'>
                                    <button
                                        className='btn btn-info'
                                        onClick={() => updateRating(rating.id)}
                                        onMouseOver={(e) => e.currentTarget.style.boxShadow = '0px 8px 8px rgba(0, 0, 0, 0.2)'}
                                        onMouseOut={(e) => e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)'}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className='btn btn-danger'
                                        onClick={() => removeRating(rating.id)}
                                        style={{ marginLeft: '10px' }}
                                        onMouseOver={(e) => e.currentTarget.style.boxShadow = '0px 8px 8px rgba(0, 0, 0, 0.2)'}
                                        onMouseOut={(e) => e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)'}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className='btn btn-info'
                                        onClick={() => viewRating(rating.id)}
                                        style={{ marginLeft: '10px' }}
                                        onMouseOver={(e) => e.currentTarget.style.boxShadow = '0px 8px 8px rgba(0, 0, 0, 0.2)'}
                                        onMouseOut={(e) => e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)'}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListRatingComponent;
