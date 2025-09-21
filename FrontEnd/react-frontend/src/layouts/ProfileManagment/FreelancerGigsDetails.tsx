import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MDBIcon, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardImage
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './gig.css';
import ReportGenerator from './FreelanceReportDownload';
interface Gig {
  gigId: string;
  gigTitle: string;
  gigDescription: string;
  gigCategory: string;
}

const FreelancerGigsDetails: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { username } = useParams<{ username: string }>();

  const handleSearch = async () => {
    try {
      const response = await axios.post(`http://localhost:8082/freelancer-gigs/search/${username}`, { keyword });
      setGigs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching gigs:', error);
    }
  };

  useEffect(() => {
    const fetchGigsByUsername = async () => {
      try {
        const response = await fetch(`http://localhost:8082/freelancer-gigs/username/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch gigs');
        }
        const data = await response.json();
        setGigs(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGigsByUsername();
  }, [username]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    handleSearch();
  };


  const truncateString = (str: string, num: number): string => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  };

  const renderGigCards = () => {
    const gigGroups: Gig[][] = [];
    for (let i = 0; i < gigs.length; i += 3) {
      gigGroups.push(gigs.slice(i, i + 3));
    }

    return (
      gigGroups.map((group, index) => (
        <div key={index} className="row mb-3">
          {group.map((gig) => (
            <div className='col-md-4' key={gig.gigId}>
              <MDBCard>
                <MDBCardImage src='https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' position='top' alt='...' />
                <MDBCardBody>
                  <MDBCardText><b>{gig.gigTitle}</b></MDBCardText>
                  <MDBCardText>
                    {truncateString(gig.gigDescription, 50)}
                  </MDBCardText>
                  <MDBCardText>
                    <b>Category :</b>{gig.gigCategory}
                  </MDBCardText>
                  <MDBBtn href={`http://localhost:3000/gig/${gig.gigId}`}>see more</MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </div>
          ))}
        </div>
      ))
    );
  };

  return (
    <div id='user-gigs'>
      <br />
      <div className='Search'>
        <form onSubmit={handleSubmit}>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search" className='search-input'/>
          <button type="submit" className='search-btn'><MDBIcon fas icon="search" /></button>
        </form>
      </div>
      <br />
      <br />
      {loading ? (
        <MDBSpinner grow color='primary'>
          <span className='visually-hidden'>Loading...</span>
        </MDBSpinner>
      ) : (
        gigs.length === 0 ? (
          <p className='no-gig-found'>No gigs found.</p>
        ) : (
          renderGigCards()
        )
      )}
      <ReportGenerator/>
    </div>

  );
};

export default FreelancerGigsDetails;
