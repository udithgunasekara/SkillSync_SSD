import React, { useEffect, useState } from 'react';
import { listJobs, deleteJobPost } from '../Service/JobService';
import { useHistory, useLocation} from 'react-router-dom';
import moment from 'moment';
import Dropdown from 'react-bootstrap/Dropdown';
import jsPDF from 'jspdf';
import logo from '../Image/logo.png';


interface Job {
    id: number;
    jobTitle: string;
    postedTime: string;
    budget: number;
    bids: number;
}

interface LocationState {
    fromSearch?: boolean;
}

const ListJobComponent: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const location = useLocation<LocationState>();// Specify the type of location state
    const isFromSearch = location.state?.fromSearch || false;

    const navigator = useHistory();

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };

    const generateReport = () => {
        const filtered = jobs.filter(job => {
            const jobDate = moment(job.postedTime);
            const start = moment(startDate).startOf('day');
            const end = moment(endDate).endOf('day');
            return jobDate.isBetween(start, end);
        });
        setFilteredJobs(filtered);

        if (filtered.length === 0) {
            window.alert('0 posted jobs during that time period.');
        }
    };

    // const downloadReport = () => {
    //     const doc = new jsPDF();

    //     const img = new Image();
    //     img.src = logo;
    //     img.onload=()=>{

    //         doc.addImage(img,'PNG',10,10,50,20);
    //     }

    //     doc.setFontSize(16); // Set font size for the heading
    //     doc.text('Skillsync', doc.internal.pageSize.getWidth() / 2, 10, { align: 'center'}); // Centered heading
    //     doc.setLineWidth(0.5); // Set border width
    //     doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10); // Add page border
    //     doc.setFontSize(12); // Reset font size for the content
    //     const formattedData = jobs.map(job => job.jobTitle); // Use jobs directly
    //     doc.text('Job types posted within given time range', 10, 20); // Adding "Job Report" as a subheading
    //     formattedData.forEach((title, index) => {
    //         doc.text(`${index + 1}. ${title}`, 10, 30 + index * 10);
    //     });
    //     doc.save('job_report.pdf');
    
    //     // Reset filteredJobs state after downloading
    //     setFilteredJobs([]);
    // };

    const downloadReport = () => {
        const doc = new jsPDF();
    
        // Load the image
        const img = new Image();
        img.src = logo;
        img.onload = () => {
            const imgWidth = 50; // Width of the image
            const imgHeight = 20; // Height of the image
    
            // Calculate coordinates to center the image horizontally
            const x = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
            const y = 10; // You can adjust the vertical position as needed
    
            // Add the image to the PDF
            doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);
    
            // Set other content after adding the image
            const imgTextGap = 5; // Increase the gap between image and text
            
            doc.setLineWidth(0.5); // Set border width
            doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10); // Add page border
            doc.setFontSize(12); // Reset font size for the content
            const formattedData = jobs.map(job => job.jobTitle); // Use jobs directly
            doc.text('Job types posted within given time range', 10, y + imgHeight + imgTextGap * 2); // Adding "Job Report" as a subheading
            formattedData.forEach((title, index) => {
                doc.text(`${index + 1}. ${title}`, 10, y + imgHeight + imgTextGap * 2 + 10 + index * 10);
            });
    
            // Add current date in bottom left corner
            const currentDate = new Date().toLocaleDateString();
            doc.text(currentDate, 15, doc.internal.pageSize.getHeight() - 15);
    
            // Add signature line and label in bottom right corner
            const signatureLineX = doc.internal.pageSize.getWidth() - 80; // Adjust position as needed
            const signatureLineY = doc.internal.pageSize.getHeight() - 20;
            doc.line(signatureLineX, signatureLineY, signatureLineX + 70, signatureLineY);
            doc.text('Signature', signatureLineX + 25, signatureLineY + 5);
    
            // Save the PDF with the added image and text
            doc.save('job_report.pdf');
        };
        
        // Reset filteredJobs state after downloading
        setFilteredJobs([]);
    };
    
    
    


    useEffect(() => {
        getAllJobPosts();
    }, []);

    function getAllJobPosts() {
        listJobs().then(Response => {
            setJobs(Response.data);
        }).catch(error => {
            console.error(error);
        });
    }

    function createNewJobPost() {
        navigator.push('/create-newJobPost');
    }

    function jobrequests() {
        navigator.push('/jobrequests');
    }

    function updateJobPosting(id: number) {
        navigator.push(`/edit-jobpost/${id}`);
    }

    function removeJobPosting(id: string) {
        console.log(id);

        deleteJobPost(id).then(Response => {
            getAllJobPosts();
            window.alert('Job posting removed successfully!');
        }).catch(error => {
            console.error(error);
        });
    }

    function viewJobPosting(id: number) {
        // this.props.history.push(`/view-jobpost/${id}`)
        navigator.push(`/view-jobpost/${id}`, { state: { fromSearch: false } });
    }

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

    const dropdownItemStyle: React.CSSProperties = {
        cursor: 'pointer',
    };

    function goBack() {
        navigator.push('/searchjobs');
    }

    return (
        <div className='container' style={{ width: '800px' }}>
            <br/><br/><br/>
            <div className='row'>
                <div className='col-sm-3' style={{ width: '20%' }}>
                    <button
                        className='btn btn-primary mb-2'
                        style={{
                            borderRadius: '10px',
                            width: '100%',
                        }}
                        onClick={createNewJobPost}>
                        Post a Job
                    </button>
                </div>
                <div className='col-sm-6 d-flex justify-content-between align-items-center' style={{ width: '40%' }}>
                    <h2 className='text-center' style={{ width: '100%' }}>My Job Posts</h2>
                </div>

                <div className='col-sm-3' style={{ width: '20%' }}>
                    <button
                        className='btn btn-primary mb-2'
                        style={{
                            borderRadius: '10px',
                            width: '100%',
                        }}
                        onClick={jobrequests}>
                        Requests
                    </button>
                </div>

                <div className='col-sm-3' style={{ width: '20%' }}>
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

            <table className=' table table-bordered' style={{ border: '2px solid #ccc'}}>
                <thead>
                    <tr>
                        <th style={{ fontWeight: '600' }}>Job Title</th>
                        <th style={{ fontWeight: '600' }}>Posted Time</th>
                        <th style={{ fontWeight: '600' }}>Budget($)</th>
                        <th style={{ fontWeight: '600' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        jobs.map((job) => (
                            <tr key={job.id}>
                                <td >{job.jobTitle}</td>
                                <td>{formatElapsedTime(job.postedTime)}</td>
                                <td >{job.budget}$</td>
                                <td style={{ width: '15%' }}>

                                    <Dropdown>
                                        <Dropdown.Toggle
                                            variant="secondary"
                                            id={`dropdownMenuButton-${job.id}`}
                                            style={{ backgroundColor: '#c585f7', borderColor: '#c585f7' }}>
                                            Actions
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                style={dropdownItemStyle}
                                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#dfbbfb'}
                                                onMouseOut={e => e.currentTarget.style.backgroundColor = ''}
                                                onClick={() => updateJobPosting(job.id)}>
                                                Update Posting
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                style={dropdownItemStyle}
                                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#dfbbfb'}
                                                onMouseOut={e => e.currentTarget.style.backgroundColor = ''}
                                                onClick={() => removeJobPosting(job.id.toString())}>
                                                Remove Posting
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                style={dropdownItemStyle}
                                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#dfbbfb'}
                                                onMouseOut={e => e.currentTarget.style.backgroundColor = ''}
                                                onClick={() => viewJobPosting(job.id)}>
                                                View Posting
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>))
                    }
                </tbody>
            </table>

            <br />

            {/*report generation */}
            <h5> Job types posted within a certain time range</h5><br />
            <div className='row'>
                <div className='col' style={{ width: '50%' }}>
                    {/* Date Range Selector */}
                    <p>Start Date</p>
                    <input
                        type="date"
                        className="form-control"
                        placeholder="Start Date"
                        value={startDate}
                        onChange={handleStartDateChange} />
                </div>
                <div className='col' style={{ width: '50%' }}>
                    <p>End Date</p>
                    <input
                        type="date"
                        className="form-control"
                        placeholder="End Date"
                        value={endDate}
                        onChange={handleEndDateChange} />
                </div>
            </div>

            {/* Generate and Download Report Buttons */}
            <div className='col-sm-12 mt-3'>
                <button
                    //style={{backgroundColor: '#c585f7'}}
                    className="btn btn-primary"
                    onClick={generateReport}>
                    Generate Report
                </button>

                {filteredJobs.length > 0 && (
                    <button
                        style={{ marginLeft: '5px' }}
                        className="btn btn-primary"
                        onClick={downloadReport}>
                        Download Report
                    </button>
                )}
            </div>
            <br />
            {/*report generation */}
        </div>
    );
};

export default ListJobComponent;
