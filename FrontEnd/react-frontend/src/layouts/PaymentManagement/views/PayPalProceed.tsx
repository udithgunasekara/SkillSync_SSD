import React, { useState } from 'react';
import { makePayment } from '../services/PaymentHistoryService';
import { useHistory, useLocation } from 'react-router-dom';

interface LocationState {
  amount: number;
  
}

const PayPalProceed = () => {
  const navigate = useHistory();
  const location = useLocation();
  const propsData = location.state as LocationState; // Type assertion to specify the type of location.state

  const amount = propsData?.amount ?? 0; // Provide a default value if propsData is undefined

  const paymentProceedHandler = () => {
    // Open PayPal gateway website in a new window/tab
    window.open('https://www.paypal.com/signin?returnUri=https%3A%2F%2Fdeveloper.paypal.com%2Fdashboard%2F&intent=developer&ctxId=ul1bd54e6579e64a8ca546e4c01b6c04fa', '_blank');
  };

  return (
    <div className="main-section" style={{ background: 'linear-gradient(to right, #f9f2fa, #dbb2ce)' }}>
      <div className='row'>
        <h2 className='text-center mt-5'>Pay with PayPal</h2>
        <div className='card col-md-6 mt-5 px-5 pt-3 offset-md-3 offset-md-3'>
          <h6 className="">PayPal</h6>
          <div className='card-body my-4 mx-5'>
            <h6>Amount</h6>
            <input value={amount} disabled={true} className="w-100 mb-4"/>
            <h6>Currency</h6>
            <input value={"USD"} disabled={true} className="w-100 " placeholder=""/>
          </div>
        </div>
        <div className="col-md-6 mt-5 offset-md-3 offset-md-3 d-flex justify-content-end">
          <button onClick={() => {navigate.goBack()}}  className="main-btn mx-5" style={{backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer'}}>Back</button>
          <button onClick={paymentProceedHandler} className="main-btn" style={{backgroundColor: 'blue', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer'}}>Pay with PayPal</button>
        </div>
      </div>
    </div>
  );
};

export default PayPalProceed;
