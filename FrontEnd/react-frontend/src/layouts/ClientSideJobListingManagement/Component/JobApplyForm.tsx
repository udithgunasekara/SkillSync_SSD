import React, { useState, ChangeEvent, FormEvent ,useEffect} from 'react';
import { useHistory, useParams ,useLocation} from 'react-router-dom';
import {applyJob} from '../Service/JobService';

interface JobRequest{

    freelancername: string;
    message: string;
    status:string;
    username:string;
}

const styles = {
    container: {
        marginTop: '100px', // Adjust margin as needed
        width: '35%', // Set a fixed width for the card
        // display: 'flex',
        justifyContent: 'center',
    }
};  

const JobApplyForm: React.FC = () => {
    const [freelancername, setFreelancerName] = useState<string>(sessionStorage.getItem('username') || '');
    const [message, setMessage] = useState<string>('');
    const [freelancerNameError, setFreelancerNameError] = useState('');
    const [messageError, setMessageError] = useState('');
    const customerUsername = useParams<{ customerUsername: string }>().customerUsername;
    const navigate = useHistory();
    
    const handleName = (e: ChangeEvent<HTMLInputElement>) => {
        if (/^[a-zA-Z\s]+$/.test(e.target.value) || e.target.value === '') {
            setFreelancerName(e.target.value);
            setFreelancerNameError('');
        } else {
            setFreelancerNameError('Name cannot contain numbers or special characters');
        }
    };

    const handleCancel = () => {
        navigate.push('/searchjobs');
        };

    const handleMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    const saveJobRequest = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (freelancername.trim() === '') {
            setFreelancerNameError('Please enter your name.');
            return;
        }
    
        if (message.trim() === '') {
            setMessageError('Please enter a description.');
            return;
        }

        const jobRequest = { freelancername, message, status: 'pending'};
        console.log(jobRequest);

        applyJob(jobRequest)
        .then((response) => {
            console.log(response.data);
            navigate.push('/searchjobs');
        })
        .catch((error) => {
            console.error('Error saving jobrequest:', error);
        });

        window.alert('Job request sent successfully!');
    };

    return (
        
        <div className="container" style={styles.container}>
            
            <div className='row'>
                <div className='card' style={{border: '2px solid #ccc'}}>
                    <h2 className='text-center' style={{ marginTop:'5px', fontSize: '25px'}}>Job Request</h2>
                    <div className='card-body'>
                        <form className='needs-validation' noValidate onSubmit={saveJobRequest}>
                            <div className='form-group mb-2'>
                                <label className='form-label'style={{ fontWeight: '600', 
                                    textAlign: 'left' ,color: 'black'}}>Name: {freelancername}</label>
                                
                                {freelancerNameError && <div className='invalid-feedback' style={{textAlign: 'center'}}>{freelancerNameError}</div>}

                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label' style={{ fontWeight: '600', 
                                    textAlign: 'left' ,color: 'black'}}>Message:</label>
                                    <div style={{ textAlign: 'left'}}>
                                        <ul style={{ listStyleType: 'disc' }}>
                                            <li> Firstly enter jobTitle. Then add your message.</li>
                                            <span style={{ fontWeight: '600',color: '#666666'}}>Example</span><br />
                                            <li> Social Media Manager - I would like to apply .....</li>
                                        </ul>
                                    </div>
                                <textarea
                                    style={{ width: '380px' }}
                                    placeholder='Enter your details'
                                    name='message'
                                    className={`form-control ${messageError && 'is-invalid'}`}
                                    id="message"
                                    value={message}
                                    onChange={(e) => { handleMessage(e); }}
                                    required
                                />
                            </div>

                            <br/>

                            <div className="row mt-4 justify-content-center">
                                <div className="col-md-6 d-flex justify-content-between">
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleCancel}
                                        style={{ marginRight: '70px' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                    >
                                        submit
                                    </button>
                                </div>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobApplyForm;
