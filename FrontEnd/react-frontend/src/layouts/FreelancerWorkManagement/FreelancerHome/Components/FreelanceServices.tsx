import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { generateGigReport } from './GigsReportGeneration';
import SearchSection from './SearchSection'; // Import SearchSection from the new file
import { Footer } from '../../../navbar&footers/Footer';

export interface Gig {
  gigId: number;
  gigTitle: string;
  gigDescription: string;
  gigCategory: string;
  gigDateCreated: string;
  freelancerUsername: string;
  datePosted: string;
  deliveryTime: string;
}

export const FreelanceServices: React.FC = () => {
  const [gigData, setGigData] = useState<Gig[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const gigsPerPage = 8;
  const [minPrices, setMinPrices] = useState<{ [key: number]: string }>({});
  const [minTimes, setMinTimes] = useState<{ [key: number]: string }>({});
  const [showNoResults, setShowNoResults] = useState(false); // State to control displaying no results message

  useEffect(() => {
    const fetchGigData = async () => {
      try {
        const response = await axios.get<Gig[]>('http://localhost:8082/freelancer-gigs');
        setGigData(response.data);

        const minPricePromises = response.data.map(gig => fetchMinPrice(gig.gigId));
        const minPrices = await Promise.all(minPricePromises);
        const minPriceObject = Object.fromEntries(minPrices.map((price, index) => [response.data[index].gigId, price]));
        setMinPrices(minPriceObject);

        const minTimePromises = response.data.map(gig => fetchMinTime(gig.gigId));
        const minTimes = await Promise.all(minTimePromises);
        const minTimeObject = Object.fromEntries(minTimes.map((time, index) => [response.data[index].gigId, time]));
        setMinTimes(minTimeObject);

      } catch (error) {
        console.error('Error fetching gig data:', error);
      }
    };

    fetchGigData();
  }, []);

  const fetchMinPrice = async (gigId: number): Promise<string> => {
    try {
      const response = await axios.get<string>(`http://localhost:8082/freelancer-gigs/${gigId}/gig-packages/min-price`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching minimum price for gig ${gigId}:`, error);
      return ''; // Return empty string if there's an error
    }
  };

  const fetchMinTime = async (gigId: number): Promise<string> => {
    try {
      const response = await axios.get<string>(`http://localhost:8082/freelancer-gigs/${gigId}/gig-packages/min-time`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching minimum time for gig ${gigId}:`, error);
      return ''; // Return empty string if there's an error
    }
  };

  // Function to handle search button click
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Function to handle page navigation
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const filteredGigs = gigData.filter(gig =>
    gig.gigTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gig.gigCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredGigs.length / gigsPerPage);

  // Calculate index of the last gig to be displayed on the current page
  const indexOfLastGig = currentPage * gigsPerPage;
  // Calculate index of the first gig to be displayed on the current page
  const indexOfFirstGig = indexOfLastGig - gigsPerPage;
  // Get gigs for the current page
  const currentGigs = filteredGigs.slice(indexOfFirstGig, indexOfLastGig);

  // Show message when there are no search results
  useEffect(() => {
    setShowNoResults(filteredGigs.length === 0 && searchQuery !== '');
  }, [filteredGigs, searchQuery]);

  return (
    <div>
      <SearchSection onSearch={handleSearch} />
      {showNoResults && (
        <div style={{ margin: '20px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '5px' }}>
          No results found for '{searchQuery}'
        </div>
      )}
      <section className="containerx" style={{marginRight: '3.4375em'}}>
        <div className="row">
          {currentGigs.map((gig: Gig) => (
            <div key={gig.gigId} className="col-lg-3 col-md-4 col-sm-6 mb-7" style={{ maxWidth: '100%', height: '100%' }}>
              <div className="card shadow">
                <img
                  src={process.env.PUBLIC_URL + '/Images/GigWallpaper.jpg'}
                  className="card-img-top"
                  alt="Service Image"
                  style={{ maxWidth: '100%', height: '100%' }}
                />

                <div className="card border-0">
                <div className="card-body d-flex flex-column align-items-center" style={{ lineHeight: '1', padding: '1.5rem' }}>
                    <h5 className="card-title" style={{ maxWidth: '100%', height: '55px' }}>{gig.gigTitle}</h5>
                    <p className="card-text fs-6">Price: ${minPrices[gig.gigId]} onwards</p>
                    <p className="card-text fs-6">Time Taken: {minTimes[gig.gigId]}h</p>
                    <p className="card-text fs-6">@{gig.freelancerUsername}</p>
                    <Link to={`/gig/${gig.gigId}`} className="btn btn-primary mt-auto " style={{ backgroundColor: '#641C9E' }}>View Details {'>>'}</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
              </li>
            ))}
          </ul>
        </nav>
      </section>
      <Footer />
    </div>
  );
};

