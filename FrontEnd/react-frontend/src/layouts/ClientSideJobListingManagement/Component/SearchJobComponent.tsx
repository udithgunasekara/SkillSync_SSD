import React, { useState, useEffect } from 'react';
import { listJobs } from '../Service/JobService';
import { searchJobs } from '../Service/JobService';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import headImage from '../Image/keyboard.jpg';

interface Job {
  id: string;
  jobTitle: string;
  description: string;
  budget: number;
  postedTime: string; 
  customerUsername: string;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    marginLeft: '150px',
    marginRight: '400px',
    display: 'block',
    textAlign: 'left',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  navbarImage: {
    width: '1350px', 
    height: '330px',
  },
  welcomeText: {
    position: 'absolute',
    top: '25%', //  vertical position
    left: '50%', //  horizontal position
    transform: 'translate(-50%, -50%)',
    fontSize: '50px', 
    fontWeight: 'bold',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', //text shadow for better readability
  },
};

const SearchJobComponent: React.FC = () => {
  const [query, setQuery] = useState<string>(''); // State to hold the search query
  const [jobs, setJobs] = useState<Job[]>([]); // State to hold the search results
  const [searched, setSearched] = useState<boolean>(false); // State to track if search has been performed

  const navigator = useHistory();

  useEffect(() => {
    getAllJobPosts();
  }, []);

    // Function to fetch all job posts
    const getAllJobPosts = async (): Promise<void> => {
    try {
      const response = await listJobs();
      setJobs(response.data);
      setSearched(false);
    } catch (error) {
      console.error('Error fetching all jobs:', error);
    }
  };


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission

    if (!query.trim()) {
      // Check if query is empty or whitespace
      setJobs([]); // Clear the search results
      setSearched(false);
      return;
    }

    try {
      const response = await searchJobs(query); // Call the searchJobs API
      setJobs(response.data); // Set the search results to the state
      setSearched(true); // Set searched to true
    } catch (error) {
      console.error('Error searching jobs:', error);
    }
  };

  const resetJobs = async () => {
    try {
      const response = await listJobs(); // Fetch all jobs
      setJobs(response.data); // Set all jobs to the state
      setSearched(false); // Set searched to false
    } catch (error) {
      console.error('Error fetching all jobs:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Update the query state
    setQuery(inputValue);

    // If the input value is empty, reset the jobs state and set searched to false
    if (!inputValue.trim()) {
      resetJobs();
    }
  };

  const freelancerViewJobPosting = (id: string) => {
    navigator.push(`/freelancerView-jobpost/${id}`);
  };

  const formatElapsedTime = (timestamp: string) => {
    const elapsedTime = moment().diff(moment(timestamp), 'minutes');
    if (elapsedTime < 1) return 'Just now';
    if (elapsedTime < 60) return `${elapsedTime} minutes ago`;
    const elapsedHours = Math.floor(elapsedTime / 60);
    if (elapsedHours < 24) return `${elapsedHours} hours ago`;
    const elapsedDays = Math.floor(elapsedHours / 24);
    if (elapsedDays < 7) return `${elapsedDays} days ago`;
    const elapsedWeeks = Math.floor(elapsedDays / 7);
    return `${elapsedWeeks} weeks ago`;
  };

  return (
    <div>
        <div className="image-container" style={styles.imageContainer}>
            <img src={headImage} alt="Company Logo" className="navbar-image" style={styles.navbarImage} />
            <div style={styles.welcomeText}>Welcome To SKILLSYNC</div>
        </div>

        <div className="container" style={styles.container}>
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <form className="d-flex ms-auto" onSubmit={handleSearch}>
                        <div className='row'>
                            <div className='col'>
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    value={query}
                                    onChange={handleInputChange}
                                    style={{ width: '300px' }}
                                />
                            </div>
                            <div className='col'>
                                <button
                                    className="btn btn-outline-success"
                                    type="submit"
                                    style={{
                                    backgroundColor: '#c585f7',
                                    borderColor: '#c585f7',
                                    color: 'white',
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                    transition: 'box-shadow 0.3s ease',
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0px 8px 8px rgba(0, 0, 0, 0.2)')}
                                    onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
                                >
                                    Search
                                </button>
                            </div>   
                        </div>
                    </form>
                </div>
            </nav>
        <br />
        <br />

        <div className="mt-4">
          {/* Conditionally render the "Search Results" tag */}
          {searched && jobs.length === 0 ? null : (
            <h4 style={{ display: searched ? 'block' : 'none' }}>Search Results</h4>
          )}
          {searched && jobs.length === 0 ? (
            <p>No results found</p>
          ) : (
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {/* Render jobs only if searched is false or jobs length is greater than 0 */}
              {!searched || jobs.length > 0 ? (
                jobs.map((job) => (
                  <div key={job.id} className="col mb-4">
                    <div className="card border" style={{ width: '22rem', height: '350px'}}>
                      <div className="card-body" style={{ fontSize: '5px'}}>
                        <p className="card-text" style={{ fontSize: '14px'}}>{formatElapsedTime(job.postedTime)}</p>
                        <h5 className="card-title" style={{ textAlign: 'center', fontWeight: '600' }}>
                          {job.jobTitle}
                        </h5>
                        <p className="card-text" style={{ fontSize: '15px'}}>{job.description}</p>
                        <p className="card-text" style={{ fontSize: '14px'}}>
                          <span>fixed price - </span>
                          <span style={{ fontWeight: '600' }}>{job.budget}$</span>
                        </p>
                        <p className="card-text" style={{ fontSize: '14px'}}>
                          <span>Customer - {job.customerUsername}</span>
                          <span style={{ fontWeight: '600' }}>{job.budget}$</span>
                        </p>

                        <button
                          className="btn btn-primary"
                          onClick={() => freelancerViewJobPosting(job.id)}
                          style={{
                            position: 'absolute',
                            bottom: '25px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#c585f7',
                            borderColor: '#c585f7',
                            color: 'white',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'box-shadow 0.3s ease',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0px 8px 8px rgba(0, 0, 0, 0.2)')}
                          onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
                        >
                          View Job Posting
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // If no search has been performed and jobs.length is 0, render all jobs
                // This could be achieved by fetching all jobs when the component mounts or when the homepage is visited
                
                    jobs.map((job:Job) => (
                  <div key={job.id} className="col mb-4">
                    <div className="card" style={{ width: '22rem', height: '350px' }}>
                      <div className="card-body">
                        <p className="card-text">{formatElapsedTime(job.postedTime)}</p>
                        <h5 className="card-title" style={{ textAlign: 'center' }}>
                          {job.jobTitle}
                        </h5>
                        <p className="card-text" style={{ fontSize: 'smaller' }}>{job.description}</p>
                        <p className="card-text">
                          <span>fixed price - </span>
                          <span style={{ fontWeight: '500' }}>{job.budget}$</span>
                        </p>

                        <button
                          className="btn btn-primary"
                          onClick={() => freelancerViewJobPosting(job.id)}
                          style={{
                            position: 'absolute',
                            bottom: '25px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#c585f7',
                            borderColor: '#c585f7',
                            color: 'white',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            transition: 'box-shadow 0.3s ease',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0px 8px 8px rgba(0, 0, 0, 0.2)')}
                          onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
                        >
                          View Job Posting
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchJobComponent;
