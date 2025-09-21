import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Button, Card, Carousel, Container, Row, Col, Modal, Alert } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import Orders from "./Components/Orders";

export interface Gig {
  gigId: number;
  gigTitle: string;
  gigDescription: string;
}

const FreelancerDashboard: React.FC = () => {

  const username = sessionStorage.getItem('username')
  const [gigData, setGigData] = useState<Gig[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [selectedGigId, setSelectedGigId] = useState<number | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [minPrices, setMinPrices] = useState<{ [key: number]: string }>({});
  const [minTimes, setMinTimes] = useState<{ [key: number]: string }>({});
  const [loggedInUser, setLoggedInUser] = useState<{ username: string }>({ username: '' });

  useEffect(() => {
    const fetchGigData = async () => {
      try {
        const user = getUserInfo();
        setLoggedInUser(user);

        const response = await axios.get<Gig[]>(`http://localhost:8082/freelancer-gigs/username/${user.username}`);
        const gigsWithIds = response.data.map((gig, index) => ({ ...gig, id: index + 1 }));
        setGigData(gigsWithIds);
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

  const history = useHistory();

  const getUserInfo = () => {
    return { username: username ? username : 'defaultUsername' };
  }

  const handleEdit = (id: number) => {
    console.log('Edit gig with ID:', id);
    history.push(`/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    setSelectedGigId(id);
    setShowConfirmationModal(true);
  };

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
  }

  const confirmDelete = async () => {
    if (selectedGigId !== null) {
      try {
        await axios.delete(`http://localhost:8082/freelancer-gigs/${selectedGigId}/gig-packages/del`);
        await axios.delete(`http://localhost:8082/freelancer-gigs/${selectedGigId}/gig-images/delete`);
        await axios.delete(`http://localhost:8082/freelancer-gigs/${selectedGigId}`);
        setGigData(gigData.filter(gig => gig.gigId !== selectedGigId));
        setSelectedGigId(null);
        setShowConfirmationModal(false);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000); // Hide alert after 3 seconds
      } catch (error) {
        console.error('Error deleting gig:', error);
      }
    }
  };


  const handleSelect = (selectedIndex: number, e: any) => {
    setIndex(selectedIndex);
  };

  const gigChunks: Gig[][] = gigData.reduce((acc: Gig[][], curr: Gig, index: number) => {
    const chunkIndex = Math.floor(index / 4);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(curr);
    return acc;
  }, []);

  return (
    <Container fluid className="py-5">
      <Row className="mb-4 align-items-center">
        <Col xs={12}>
          <h1 className="text-center">Freelancer Dashboard</h1>
        </Col>
      </Row>
      <Row className="mb-4 align-items-center">
        <Col xs={10}>
          <h2 className="mb-0">Active Gigs</h2>
        </Col>
        <Col xs={2} className="d-flex justify-content-end align-items-center">
          <Button variant="primary" size="lg" onClick={() => history.push("/CreateGigForm1")}>+ Create New Gig</Button>
        </Col>
      </Row>
      <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} interval={null} className="mb-5">
        {gigChunks.map((chunk, chunkIndex) => (
          <Carousel.Item key={chunkIndex}>
            <Row className="justify-content-center gx-5">
              {chunk.map((gig, gigIndex) => (
                <Col key={gigIndex} md={3} className="mb-4">
                  <Card style={{ height: '380px', borderRadius: '15px' }} className="shadow gig-card-small">
                    <Card.Img variant="top" src={process.env.PUBLIC_URL + '/Images/GigWallpaper.jpg'} style={{ height: '150px', objectFit: 'cover', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }} className="gig-card-image-small" />
                    <Card.Body style={{ padding: '0.5rem', fontSize: '0.9rem', backgroundColor: '#f8f9fa', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
                      <h5 className="mb-2" style={{ fontSize: '1.15rem', color: '#333', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => history.push(`/gig/${gig.gigId}`)}>{gig.gigTitle}</h5>
                      <Card.Text style={{ marginBottom: '0.5rem', fontSize: '0.95rem', color: '#555' }}><strong>Price:</strong> ${minPrices[gig.gigId]} onwards</Card.Text>
                      <Card.Text style={{ marginBottom: '0.5rem', fontSize: '0.95rem', color: '#555' }}><strong>Time Taken:</strong> From {minTimes[gig.gigId]}h</Card.Text>
                      <Card.Text style={{ marginBottom: '0.5rem', fontSize: '0.95rem', color: '#555' }}><strong>Freelancer:</strong> @{loggedInUser.username}</Card.Text>
                      <div className="mt-3 text-center">
                        <Button variant="primary" className="me-2" size="sm" onClick={() => handleEdit(gig.gigId)}>Edit</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(gig.gigId)}>Delete</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>



      <Row className="justify-content-center">
        <Col className="text-center">
          {index > 0 && (
            <Button variant="light" onClick={() => setIndex(index - 1)}>
              <FaChevronLeft size={36} />
            </Button>
          )}
          {index < gigChunks.length - 1 && (
            <Button variant="light" onClick={() => setIndex(index + 1)}>
              <FaChevronRight size={36} />
            </Button>
          )}
        </Col>
      </Row>

      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this gig?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Alert variant="success" show={showSuccessAlert} onClose={() => setShowSuccessAlert(false)} dismissible>
        Gig deleted successfully!
      </Alert>

      <Orders />
    </Container>
  );
};

export default FreelancerDashboard;
