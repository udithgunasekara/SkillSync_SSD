import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const SelectPaymentType = () => {
    const navigate = useHistory();
    const queryParams = new URLSearchParams(window.location.search);

    const amount = queryParams.get('title') || 0;
    const tax = queryParams.get('tax') || 0;
    const total = queryParams.get('total') || 0;
    const projectId = queryParams.get('projectId');
    const [selectedPayment, setSelectedPayment] = useState<string>(''); 
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handlePaymentSelection = (paymentType: string) => { 
        setSelectedPayment(paymentType);
        setErrorMessage('');
    };

    const handleNext = () => {
        if (!selectedPayment) {
            setErrorMessage('Please select a payment method');
            return; // Don't proceed further
        }

        if (selectedPayment === 'CARD') {
            navigate.push('/card-payment', { state: { amount: total, projectId } });
        } else if (selectedPayment === 'PAYPAL') {
            navigate.push('/paypal-payment', { state: { amount: total } });
        }
    };

    return (
        <div className="main-section" style={{ background: 'linear-gradient(to right, #f9f2fa, #dbb2ce)' }}>
            <div className="row" >
                <h2 className="text-center mt-5">Select Payment Method</h2>

                <div className="col-md-6 mt-5 offset-md-3">
                    <div className="card mb-4 border-primary">
                        <div className="card-body">
                            <h5 className="card-title">Payment Options</h5>
                            <div className="form-check">
                                
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id="creditCardRadio"
                                    value="CARD"
                                    checked={selectedPayment === 'CARD'}
                                    onChange={() => handlePaymentSelection('CARD')}
                                />
                                <label className="form-check-label" htmlFor="creditCardRadio">
                                    Credit/Debit Card
                                </label>
                            </div>
                            <div className="form-check mt-3">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id="paypalRadio"
                                    value="PAYPAL"
                                    checked={selectedPayment === 'PAYPAL'}
                                    onChange={() => handlePaymentSelection('PAYPAL')}
                                />
                                <label className="form-check-label" htmlFor="paypalRadio">
                                      PayPal
                                </label>

                            </div>
                            {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
                        </div>
                    </div>

                    <div className="card border-primary">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5>Amount</h5>
                                </div>
                                <div>
                                    {/* <h5>{amount}$</h5> */}
                                    <h5>12$</h5>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5>Tax</h5>
                                </div>
                                <div>
                                    {/* <h5>{tax}%</h5> */}
                                    <h5>3%</h5>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5>Total Payment</h5>
                                </div>
                                <div>
                                    {/* <h5>{total}$</h5> */}
                                    <h5>15$</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-grid gap-2 mt-4">
                        <button onClick={handleNext} className="btn btn-primary">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectPaymentType;
