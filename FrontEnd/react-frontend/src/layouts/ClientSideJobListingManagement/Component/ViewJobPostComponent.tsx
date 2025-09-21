import React, { useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import { getJobPostingById, deleteJobPost } from '../Service/JobService';

const styles = {
    container: {
        marginTop: '50px', // Adjust margin as needed
        width: '80%', // Set a fixed width for the card
        display: 'block', // Use block display to center the element
    }
};  

interface Job {
    id: string;
    jobTitle: string;
    postedTime: string; 
    description: string;
    budget: number;
    skills: string;
    scope: string;
}

// Define the shape of location state
interface LocationState {
    fromSearch?: boolean;
}
 
const ViewJobPostComponent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<Job>({ id: '', jobTitle: '', postedTime: '', description: '', budget: 0, skills: '', scope: '' });

    const navigator = useHistory();

    const location = useLocation<LocationState>();// Specify the type of location state
    const isFromSearch = location.state?.fromSearch || false;

    useEffect(() => {
        getJobPostingById(id)
            .then(res => {
                setJob(res.data);
            })
            .catch(error => {
                console.error("Error fetching job post:", error);
            });
    }, [id]);

    function formatElapsedTime(timestamp: string) {
        const elapsedTime = moment().diff(moment(timestamp), 'minutes');
        if (elapsedTime < 1) return 'Just now';
        if (elapsedTime < 60) return `${elapsedTime} minutes ago`;
        const elapsedHours = Math.floor(elapsedTime / 60);
        if (elapsedHours < 24) return `${elapsedHours} hours ago`;
        const elapsedDays = Math.floor(elapsedHours / 24);
        if (elapsedDays < 7) return `${elapsedDays} days ago`;
        const elapsedWeeks = Math.floor(elapsedDays / 7);
        return `${elapsedWeeks} weeks ago`;
    }

    function updateJobPosting(id: string) {
        navigator.push(`/edit-jobpost/${id}`)
    }

    function removeJobPosting(id: string) {
        console.log(id);

        deleteJobPost(id)
            .then(() => {
                navigator.push('/jobs'); 
                window.alert('Job posting removed successfully!');
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleBack = () => {
        navigator.push('/jobs');
    };

    return (
        <div className='container' style={styles.container}>
            <br/><br/>
            <div className='card col-md-6 offset-md-3' style={{ border: '2px solid #ccc'}}>
                    <div className='card-body' >
                        <div className='row'>
                            <div className='col-md-12'>
                                <h2 className='text-center'>{job.jobTitle}</h2>
                                <hr />
                                <p style={{ fontWeight: '600' }}>Posted {formatElapsedTime(job.postedTime)}</p>
                                <hr />
                                <p>{job.description}</p>
                                <hr />
                                <p>
                                    <span>fixed price - </span>
                                    <span style={{ fontWeight: '600' }}>{job.budget}$</span>
                                </p>
                                <hr />
                                <p>
                                    <span>Required Skills - </span> 
                                    <span style={{ fontWeight: '600' }}>{job.skills}</span>
                                </p>
                                <hr />
                                <p>
                                    <span>Scope - </span>  
                                    <span style={{ fontWeight: '600' }}>{job.scope}</span>
                                </p>
                                <hr />

                                <div className="row mt-4 justify-content-center">
                                        
                                    <div className="col-md-3" style={{ paddingRight: '5px' }}>
                                            <button
                                                className="btn btn-primary btn-block"
                                                onClick={() => updateJobPosting(job.id)}
                                                style={{ width: '100%', marginBottom: '5px' }}>
                                                Update
                                            </button>
                                    </div>

                                    <div className="col-md-3" style={{ paddingLeft: '5px',paddingRight: '5px' }}>
                                            <button
                                                className="btn btn-danger btn-block"
                                                onClick={() => removeJobPosting(job.id)}
                                                style={{ width: '100%', marginBottom: '5px' }}>
                                                Remove
                                            </button>
                                    </div>

                                    <div className="col-md-3" style={{ paddingLeft: '5px', paddingRight: '5px' }}>
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
        </div>
    );
}

export default ViewJobPostComponent;
