import React from 'react';
import { generateGigReport } from './GigsReportGeneration';
import { Gig } from "./FreelanceServices";

interface GigReportButtonProps {
  gigData: Gig[];
}

const GigReportButton: React.FC<GigReportButtonProps> = ({ gigData }) => {
  const handleGenerateReport = () => {
    if (gigData && gigData.length > 0) {
      generateGigReport(gigData);
    } else {
      // Provide feedback or handle the case where gigData is empty
      console.error("No gig data available to generate report.");
    }
  };

  return (
    <div className="container mb-4">
      <div className="text-center">
        <button className="btn btn-primary" style={{ backgroundColor: 'white', color: 'black' }} onClick={handleGenerateReport}>Generate Freelancer Gigs Report</button>
      </div>
    </div>
  );
};

export default GigReportButton;
