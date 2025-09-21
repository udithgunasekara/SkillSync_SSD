import React, { useEffect, useState } from 'react';
import { ListInProgressFreelancers } from '../Services/ApplicationReviewService';
import { Link } from 'react-router-dom';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import  './ApplicationListPage.css'
import logo from './Asset 3.png';
import backgroundimg from './backim2.jpg'

// Define the type for the API response object
export interface Freelancer {
  workOn: string;
  firstName: string;
  lastName: string;
  userName: string;
  created_at: string;
}

export type Freenum = {
  work: string;
  wewe: string;
}


const ApplicantListPage: React.FC = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    ListInProgressFreelancers().then((response) => {
      setFreelancers(response.data);
    }).catch(error => {
      console.error('Error fetching freelancers:', error);
    });
  }, []);

  const filteredFreelancers = searchTerm.trim() ? freelancers.filter(freelancer =>
    freelancer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    freelancer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    freelancer.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    freelancer.workOn.toLowerCase().includes(searchTerm.toLowerCase())
  ) : freelancers;

  // PDF Creation
  const downloadPdf = () => {
    const doc = new jsPDF();
    const title = "InProgress Applicants Report";
    const headers = [["WorkOn", "FirstName", "LastName", "UserName", "Signed Up"]];
    const data = filteredFreelancers.map(f => [
      f.workOn, f.firstName, f.lastName, f.userName, new Date(f.created_at).toLocaleDateString()
    ]);


   // Fetch the logo from the public URL
  fetch(logo)
  .then(response => response.blob())
    .then(blob => {
      // Convert the blob to a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const logoData = reader.result as string;

        let content = {
          startY: 50,
          head: headers,
          body: data,
          didDrawPage: function (data:any) {
            // Add image
            doc.addImage(logoData, 'PNG', data.settings.margin.left, 3, 50, 20);
            doc.text(title, 40, 30);
            doc.text(`Total Applicants: ${filteredFreelancers.length}`, 40, 40);
          }
        };
        (doc as any).autoTable(content); 
        doc.save("applicants_report.pdf");
      };
      reader.readAsDataURL(blob);
    });
};

  return (
    
    <div className="below-navbar-admin " id='dashboardpage' style={{ width: "100vw" }}>
    <div className='app_container my-5' 
    style={{ backgroundImage: `url(${backgroundimg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
    >
      <h2 className='app_header text-center mb-4' style={{fontSize: '40px', color: "white"}}>Applicants Dashboard</h2>
      <input
        type="text"
        className="app_input form-control mb-4"
        placeholder="Search by ..."
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      
      <button className="app_button btn btn-primary mb-4" onClick={downloadPdf}>Download PDF Report</button>

      <div className="app_card_container d-flex flex-column align-items-center">
        {filteredFreelancers.map((freelancer, index) => (
          <div key={index} className="app_card card mb-3" style={{ width: '100%', maxWidth: '750px' }}>
            <div className="card_body d-flex align-items-center p-2">
              <div className="app_avatar avatar" style={{ marginRight: '15px' }}>
                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Avatar" />
              </div>
              <div className="app_info info" style={{ flex: 1 }}>
                <div className="app_title name" style={{ fontWeight: '600' }}>Title: {freelancer.workOn}</div>
                <div className="app_details role">Full Name: {freelancer.firstName} {freelancer.lastName}  &nbsp;&nbsp;&nbsp;&nbsp; Username: {freelancer.userName}</div>
              </div>
              <Link to={`/Applicant/review/${freelancer.userName}`} className="app_review_link btn" style={{ borderRadius: '20px' }}>Review</Link>
            </div>
          </div>
        ))}
        {filteredFreelancers.length === 0 && (
          <div className="app_no_results text-center w-100">No freelancers found matching your criteria.</div>
        )}
      </div>
    </div>
    </div>
  );
}

export default ApplicantListPage;

