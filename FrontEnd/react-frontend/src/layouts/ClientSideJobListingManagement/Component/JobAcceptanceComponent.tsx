import React, { useEffect, useState } from 'react';
import { deleteJobRequest, getAllJobRequests, updateJobRequest } from '../Service/JobService';
import { getJobPostingById } from '../Service/JobService';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

interface JobRequest {
    requestid: string;
    freelancername: string;
    message: string;
    status: string;
    id: string; // Add jobId to represent the ID of the job
}

interface Job {
    id: string;
    jobTitle: string;
}

const JobAcceptanceComponent: React.FC = () => {
    const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
    const [jobs, setJobs] = useState<Record<string, Job>>({});
    const { id } = useParams<{ id: string }>();
    const navigator = useHistory();

    useEffect(() => {
        getAllJobPosts();
    }, []);

    useEffect(() => {
        getJobPostingById(id)
            .then(res => {
                setJobs(prevJobs => ({
                    ...prevJobs,
                    [id]: res.data
                }));
            })
            .catch(error => {
                console.error("Error fetching job post:", error);
            });
    }, [id]);

    function getAllJobPosts() {
        getAllJobRequests()
            .then(Response => {
                setJobRequests(Response.data);
                // Fetch job details for each job request
                Response.data.forEach((request: JobRequest) => {
                    getJobPostingById(request.id)
                        .then(res => {
                            setJobs(prevJobs => ({
                                ...prevJobs,
                                [request.id]: res.data
                            }));
                        })
                        .catch(error => {
                            console.error("Error fetching job post:", error);
                        });
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
    

    function Accept(requestid: string) {
        const updatedJobRequest = { ...jobRequests.find(request => request.requestid === requestid) };
        updatedJobRequest.status = 'accept';
        updateJobRequest(requestid, updatedJobRequest)
            .then(() => {
                setJobRequests(prevRequests =>
                    prevRequests.map(request =>
                        request.requestid === requestid ? { ...request, status: 'accept' } : request
                    )
                );
            })
            .catch(error => {
                console.error("Error accepting job request:", error);
            });
    }

    function Decline(requestid: string) {
        const updatedJobRequest = { ...jobRequests.find(request => request.requestid === requestid) };
        updatedJobRequest.status = 'decline';
        updateJobRequest(requestid, updatedJobRequest)
            .then(() => {
                setJobRequests(prevRequests =>
                    prevRequests.map(request =>
                        request.requestid === requestid ? { ...request, status: 'decline' } : request
                    )
                );
            })
            .catch(error => {
                console.error("Error declining job request:", error);
            });
    }

    function remove(requestid: string) {
        deleteJobRequest(requestid)
            .then(() => {
                setJobRequests(prevRequests =>
                    prevRequests.filter(request => request.requestid !== requestid)
                );
                window.alert('Job request removed successfully!');
            })
            .catch(error => {
                console.error("Error deleting job request:", error);
            });
    }

    function goBack() {
        navigator.push('/jobs');
    }

    const dropdownItemStyle: React.CSSProperties = {
        cursor: 'pointer',
    };

    return (
        <div className='container'>
            <br /><br /><br /><br />
            <div className='row'>
                <div className='col-sm-6 d-flex justify-content-between align-items-center' style={{ width: '60%' }}>
                    <h2 className='text-center' style={{ width: '100%', marginLeft: '450px' }}>Job Requests</h2>
                </div>
                <div className='col-sm-3' style={{ width: '10%', marginLeft: '280px' }}>
                    <button
                        className="btn btn-danger btn-block "
                        onClick={goBack}
                        style={{
                            backgroundColor: '#c585f7',
                            borderColor: '#c585f7',
                            color: 'white',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'box-shadow 0.3s ease',
                            marginBottom: '5px',
                            width: '100%'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.boxShadow = '0px 8px 8px rgba(0, 0, 0, 0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)'} >
                        Back
                    </button>
                </div>
            </div>
            <br />
            <table className=' table table-bordered' style={{ border: '2px solid #ccc', width: '80%', marginLeft: '100px' }}>
                <thead>
                    <tr>
                        {/* <th style={{ fontWeight: '600' }}>Job Title</th>  */}
                        <th style={{ fontWeight: '600' }}>User Name</th>
                        <th style={{ fontWeight: '600' }}>Description</th>
                        <th style={{ fontWeight: '600' }}>Status</th>
                        <th style={{ fontWeight: '600' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        jobRequests.map((jobRequest) => (
                            <tr key={jobRequest.requestid}>
                                {/* <td>{jobs[jobRequest.id]?.jobTitle}</td>  */}
                                <td>{jobRequest.freelancername}</td>
                                <td>{jobRequest.message}</td>
                                <td>{jobRequest.status}</td>
                                <td style={{ width: '15%' }}>
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            variant="secondary"
                                            id={`dropdownMenuButton-${jobRequest.requestid}`}
                                            style={{ backgroundColor: '#c585f7', borderColor: '#c585f7' }}>
                                            Actions
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                style={dropdownItemStyle}
                                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#dfbbfb'}
                                                onMouseOut={e => e.currentTarget.style.backgroundColor = ''}
                                                onClick={() => Accept(jobRequest.requestid)}>
                                                Accept
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                style={dropdownItemStyle}
                                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#dfbbfb'}
                                                onMouseOut={e => e.currentTarget.style.backgroundColor = ''}
                                                onClick={() => Decline(jobRequest.requestid)}>
                                                Decline
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                style={dropdownItemStyle}
                                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#dfbbfb'}
                                                onMouseOut={e => e.currentTarget.style.backgroundColor = ''}
                                                onClick={() => remove(jobRequest.requestid)}>
                                                Remove
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>))
                    }
                </tbody>
            </table>
            <br />
        </div>
    );
}

export default JobAcceptanceComponent;
