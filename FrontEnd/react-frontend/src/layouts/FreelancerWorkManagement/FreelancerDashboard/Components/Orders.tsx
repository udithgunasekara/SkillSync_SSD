import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

interface Order {
  orderId: number;
  orderGigId: number;
  orderDateTime: string;
  packageName: string;
  cusName: string;
  cusRemarks: string;
  gigId: number;
  orderStatus?: string; // Make orderStatus optional
  orderFreelancerUsername: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const history = useHistory();
  const freelancerUsername = sessionStorage.getItem('username') || ''; // Get freelancer username from session

  const fetchOrders = async () => {
    try {
      const response = await axios.get<Order[]>(`http://localhost:8082/orders`);
      const filteredOrders = response.data.filter(order => order.orderFreelancerUsername === freelancerUsername);
      const ordersWithDefaultStatus = filteredOrders.map(order => ({
        ...order,
        orderStatus: order.orderStatus || 'pending', // Set default status to 'pending' if it is undefined
      }));
      setOrders(ordersWithDefaultStatus);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await axios.put(`http://localhost:8082/orders/${orderId}/status?newStatus=${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeliverButtonClick = () => {
    history.push(`/freelancerAgreement`);
  };

  return (
    <Container fluid style={{ padding: 0 }}>
      <h1 className="text-center mt-4 mb-3" style={{ color: '#6c757d' }}>Orders</h1>
      <p className="text-center mt-3" style={{ color: '#6c757d' }}>Note: Click on the order ID to view the respective gig</p>
      <Table responsive striped bordered hover style={{ fontSize: '1rem', margin: 0, backgroundColor: '#f8f9fa', color: '#6c757d' }}>
        <thead>
          <tr>
            <th>Related Gig</th>
            <th>Package Name</th>
            <th>Customer Remarks</th>
            <th>Date & Time</th>
            <th>Customer Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td><Link to={`/gig/${order.orderGigId}`} style={{ textDecoration: 'none', color: '#6c757d' }}>View Gig</Link></td>
              <td>{order.packageName}</td>
              <td>{order.cusRemarks}</td>
              <td>{order.orderDateTime}</td>
              <td>{order.cusName}</td>
              <td>
                <select
                  className="form-select"
                  style={{ fontSize: '1rem' }}
                  onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                  value={order.orderStatus}
                >
                  {order.orderStatus === 'pending' && (
                    <option value="pending">Pending</option>
                  )}
                  {order.orderStatus !== 'pending' && (
                    <option disabled value="pending">
                      Pending
                    </option>
                  )}
                  <option value="accepted">Accepted</option>
                  <option value="completed">Completed</option>
                </select>

              </td>
              <td>
                {order.orderStatus === 'completed' && (
                  <Button variant="primary" size="sm" onClick={() => handleDeliverButtonClick()}>
                    Deliver Product
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Orders;
