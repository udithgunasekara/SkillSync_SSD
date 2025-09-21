import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import PackageSelection from './PackageSelection';
import { useHistory } from 'react-router-dom';

interface UserRemarksFormProps { }

const UserRemarksForm: React.FC<UserRemarksFormProps> = () => {
  const username = sessionStorage.getItem('username');
  const [remarks, setRemarks] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<{ packageId: number; packageName: string } | null>(null);
  const [selectedPackageName, setSelectedPackageName] = useState<string>('');
  const [freelancerUsername, setFreelancerUsername] = useState<string>(''); // State to store freelancer username
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    // Fetch gig details when the component mounts
    const fetchGigDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/freelancer-gigs/${id}`);
        setFreelancerUsername(response.data.freelancerUsername); // Set freelancer username from gig details
      } catch (error) {
        console.error('Error fetching gig details:', error);
      }
    };

    fetchGigDetails();
  }, [id]);

  const handleRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRemarks(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPackage) {
      window.alert('Please select a package');
      return;
    }
    if (remarks === '') {
      window.alert('Please enter your remarks');
      return;
    }
    try {
      const loggedInUser = getUserInfo();
      await axios.post('http://localhost:8082/orders', {
        orderGigId: Number(id),
        packageName: selectedPackageName,
        cusRemarks: remarks,
        cusName: loggedInUser.username,
        orderFreelancerUsername: freelancerUsername, // Submit freelancer username
      });
      console.log('Order placed successfully');
      window.alert('Order placed successfully');
      history.push('/freelancerMain');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const getUserInfo = () => {
    return {
      username: username ? username : 'defaultUsername'
    };
  };

  return (
    <Card className="mb-3 shadow">
      <Card.Body>
        <div className='h1 text-center p-3'>Select a Package</div>
        {/* Render PackageSelection component */}
        <PackageSelection setSelectedPackage={(packageId, packageName) => {
          setSelectedPackage({ packageId, packageName });
          setSelectedPackageName(packageName);
        }} />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="remarks" className="form-label">Customer Remarks:</label>
            <textarea
              className="form-control"
              id="remarks"
              name="remarks"
              rows={5}
              placeholder="Enter your remarks here"
              value={remarks}
              onChange={handleRemarksChange}
            />
          </div>
          <div className="text-center">
            <Button type="submit" variant="primary">Place Order</Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default UserRemarksForm;
