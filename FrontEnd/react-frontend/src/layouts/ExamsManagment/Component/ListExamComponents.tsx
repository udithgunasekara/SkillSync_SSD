import React, { useEffect, useRef, useState } from 'react';
import { deleteExam, listExams } from '../service/ExamsService';
import skillexam from '../Image/skillExam.jpg';
import jsPDF from 'jspdf';
import { listUserResult } from '../service/UserResultService';
import { Link, useHistory } from 'react-router-dom';

interface Exam {
  id: string;
  examName: string;
  examDescription: string;
  noOfAttempts: string;
  badgeName: string;
  badge: File | null;
  creditPoint: string;
  timeLimit: string;
}

interface UserResult {
  userNamePk: string;
  examIdPk: string;
  result: string;
}

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

const ListExamComponents: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [userResults, setUserResult] = useState<UserResult[]>([]);
  const role = sessionStorage.getItem('role');
  const [showServices, setShowServices] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigationInListComponent = useHistory();
  const [deleteConfirmation, setDeleteConfirmation] = useState(false); // State to manage delete confirmation
  const [examIdToDelete, setExamIdToDelete] = useState(''); // State to store the exam id to delete

  useEffect(() => {
    validateUser(role);
  }, []);

  function validateUser(role: string | null) {
    if (role) {
      if (role !== 'moderator' && role !== 'freelancer') {
        navigationInListComponent.push('/Freelancer/Login');
        alert('Restricted! please log in');
      }
    } else {
      navigationInListComponent.push('/Freelancer/Login');
      alert('Restricted! please log in');
    }
  }

  useEffect(() => {
    if (showServices && servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showServices]);

  const backgroundRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    setShowServices(true);
    setIsClicked(true);

    if (backgroundRef.current) {
      const backgroundHeight = backgroundRef.current.offsetHeight;
      // Scroll to the bottom of the page
      setTimeout(() => {
        window.scrollTo({ top: backgroundHeight, behavior: 'smooth' });
      }, 300); // Wait for the transition to complete before scrolling
    }
  };

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: `url(${skillexam})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  };

  const contentStyle: React.CSSProperties = {
    marginTop: '90px',
    textAlign: 'center',
    color: 'white',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: isHovered ? '#221733' : isClicked ? '#000000' : '#000000',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '20px',
    marginTop: '350px',
    transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: isHovered ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  useEffect(() => {
    getAllExam();
    getUserResults();
  }, []);

  function getAllExam() {
    listExams()
      .then((response) => {
        setExams(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getUserResults() {
    listUserResult()
      .then((response) => {
        setUserResult(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Function to handle search input change
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Function to filter exams based on search query
  const filteredExams = exams.filter((exam) =>
    exam.examName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function removeExam(id: string) {
    setDeleteConfirmation(true); // Show delete confirmation popup
    setExamIdToDelete(id); // Set the id of the exam to delete
  }

  // Function to confirm exam deletion
  const confirmDelete = () => {
    deleteExam(examIdToDelete)
      .then(() => {
        setDeleteConfirmation(false); // Hide delete confirmation popup
        getAllExam(); // Refresh exam list
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Function to cancel exam deletion
  const cancelDelete = () => {
    setDeleteConfirmation(false); // Hide delete confirmation popup
  };

  const generatePDFReport = (exams: Exam[], userResults: UserResult[]) => {
    const doc = new jsPDF({
      orientation: 'portrait', // 'portrait' or 'landscape'
      unit: 'mm',
      format: [210, 297], // A4 size: [width, height] in mm
    }) as jsPDFWithAutoTable;

    // Load logo image
    const logoImg = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = '/Images/Logo.png'; // Replace 'logo.png' with the actual path to the logo image
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
    });

    // Once the image is loaded, add it to the document and generate PDF
    logoImg
      .then((img: HTMLImageElement) => {
        // Set font styles for the header
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(33, 150, 243);

        // Add title with logo
        doc.addImage(img, 'PNG', 80, 10, 50, 20); // Place logo at the top center
        doc.setFontSize(24);
        doc.text('Exam Report', 105, 40, { align: 'center' });

        // Header Section
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0); // Set text color to black

        const contactInfo = 'skillsync@gmail.com | +112752458 | www.skillsync.com';

        // Add sample data to the header
        doc.setFont('helvetica', 'bold');
        doc.setFont('helvetica', 'normal');
        doc.text(contactInfo, 105, 50, { align: 'center' }); // Adjust position

        // Table data
        const data = exams.map((exam) => {
          const attempts = userResults.filter((result) => result.examIdPk === exam.id).length;
          const passCount = userResults.filter((result) => result.examIdPk === exam.id && result.result === 'pass').length;
          const passRate = attempts > 0 ? ((passCount / attempts) * 100).toFixed(2) + '%' : 'N/A';
          return [exam.examName, attempts.toString(), passRate];
        });

        // Add table using autoTable plugin
        doc.autoTable({
          head: [['Exam Name', 'Total participants', 'Pass Rate']],
          body: data,
          startY: 57, // Adjust startY to leave space for the title and logo
          theme: 'striped',
          styles: { cellPadding: 4, fontSize: 10, valign: 'middle', halign: 'center' },
          headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255], fontStyle: 'bold' },
          columnStyles: { 0: { fontStyle: 'bold' } }, // Make the first column bold
        });

        // Footer Section
        doc.setFontSize(10);
        doc.setTextColor(100); // Set text color to gray

        // Date in bottom left
        const currentDate = new Date().toLocaleDateString();
        doc.text('Thank you for using our service!', doc.internal.pageSize.width - 135, doc.internal.pageSize.height - 10);
        doc.text(`Date: ${currentDate}`, 20, doc.internal.pageSize.height - 30);
        // Signature in bottom right
        doc.text('Signature: _ _ _ _ _ _ _ _ _ _ _ _', doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 30);

        // Save PDF
        doc.save('exam_report.pdf');
      })
      .catch((error) => {
        console.error('Error loading image:', error);
      });
  };

  return (
    <>
      <div ref={backgroundRef} style={backgroundStyle}>
        <div style={contentStyle}>
          <h1 style={{ fontSize: '64px' }}>Welcome to Exams</h1>
          <p style={{ fontSize: '24px' }}>Attempt exams and earn badges</p>
          <button
            style={buttonStyle}
            onClick={handleButtonClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Get started {'>>'}
          </button>
        </div>
      </div>
      {showServices && (
        <>
          <div className="row justify-content-center mb-3">
            <div className="col-10"> {/* Reduce width to 80% */}
              <div className="input-group" style={{ marginTop: '80px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search exams by name"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
              </div>
            </div>
          </div>
          {role === 'moderator' && (
            <>
              <Link to={'/add-exam'}>
                <button className="btn btn-primary mb-2" style={{ marginLeft: '100px' }}>
                  Add Exam
                </button>
              </Link>
              <button
                className="btn btn-success mb-2"
                onClick={() => generatePDFReport(exams, userResults)}
                style={{ marginLeft: '10px' }}
              >
                Generate Report
              </button>
            </>
          )}
          <div className="container">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredExams.map((exam) => (
                <div className="col" key={exam.id}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{exam.examName}</h5>
                      <img src={`data:image/jpeg;base64,${exam.badge}`} className="profile-image-msg" alt={exam.examName} style={{ left: '300px' }} />
                      <br />
                      <p className="card-text">{exam.examDescription}</p>
                      {role === 'moderator' ? (
                        <>
                          <Link to={`/edit-exam/${exam.id}`}>
                            <button className="btn btn-info">
                              Manage
                            </button>
                          </Link>
                          <button
                            className="btn btn-danger"
                            onClick={() => removeExam(exam.id)}
                            style={{ marginLeft: '10px' }}
                          >
                            Delete
                          </button>
                          {deleteConfirmation && examIdToDelete === exam.id && (
                            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                              <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title">Delete Confirmation</h5>
                                    <button type="button" className="close" onClick={cancelDelete}>
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                  <div className="modal-body">
                                    <p>Are you sure you want to delete this exam?</p>
                                  </div>
                                  <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                                      Cancel
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <Link to={`/attempt-exam/${exam.id}`}>
                          <button className="btn btn-danger">
                            View
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ListExamComponents;