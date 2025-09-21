import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
// Import the useNavigate hook from 'react-router-dom' if you plan to use it
// import { useNavigate } from 'react-router-dom';

const ClientAgreementComponent: React.FC = () => {
    // Use the useNavigate hook if needed
    // const navigate = useNavigate();

    const [isChecked, setIsChecked] = useState<boolean>(false); // State to track checkbox value
    const navigate = useHistory();

    // Function to handle the checkbox change event
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setIsChecked(e.target.checked);
    };

    // Function to handle the button click
   const handleProceedToPayment = (): void => {
        // If using useNavigate, navigate to the payment route
        navigate.push('/payment-details');
    };

    return (
        <div className="card" style={{ textAlign: 'center' }}>
            <div className="card-body" style={{ width: '500px', margin: '0 auto' }}>
                <br />
                <br />
                <h2 style={{ textAlign: 'center' }}>Client Agreement</h2>
                <form>
                    <div className="form-group mb-2">
                        <br />
                        <p style={{ textAlign: 'left' }}>1. Parties
This Agreement is between [Client Name] ("Client") and [Marketplace Name], the operator of the marketplace ("Marketplace").
<br />
2. Services
Client agrees to use the Marketplace to hire freelancers for project-based work. The specific terms of each project will be outlined in a separate project agreement between the Client and the Freelancer.
<br />
3. Payment
Client agrees to pay the Freelancer the agreed-upon fee for the services rendered through the Marketplace.
Payments will be made through the Marketplace’s payment system.
The Marketplace may hold funds in escrow until the project is completed to the satisfaction of both parties.
<br />
4. Intellectual Property
Ownership of work and deliverables will be as agreed between the Client and Freelancer in the project agreement.
Any disputes regarding ownership shall be resolved in accordance with the project agreement.
<br />
5. Confidentiality
Client agrees to keep any confidential information received from the Freelancer private and secure.
Confidentiality obligations may be outlined in further detail in the project agreement.
<br />
6. Dispute Resolution
Any disputes arising from this agreement shall be resolved through arbitration or mediation as outlined in the project agreement.
<br />
7. Limitation of Liability
The Marketplace is not liable for any issues that arise between the Client and the Freelancer.
Client agrees to indemnify and hold the Marketplace harmless from any claims related to the services provided by the Freelancer.
<br />
8. Termination
This agreement may be terminated by either party with written notice.
Upon termination, the Marketplace may retain records of the Client's activity for legal and operational purposes.
<br />
9. Governing Law
This Agreement shall be governed by and interpreted in accordance with the laws of [State/Country].
<br />
10. Miscellaneous
This agreement, along with any project agreement, represents the entire agreement between the parties.
Any changes to this agreement must be made in writing and signed by both parties.</p>

                        <br />
                        <br />
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="flexCheckDefault"
                                checked={isChecked} // Use state to control the checked value
                                onChange={handleCheckboxChange} // Handle checkbox change
                            />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                I read the agreement and I agree to the terms and conditions.
                            </label>
                        </div>
                    </div>
                </form>
                <div className="row">
                    <div className="col">
                        <div>
                            <button
                                className="btn btn-info btn-block"
                                onClick={handleProceedToPayment} // Uncomment and implement the function if needed
                                onMouseOver={(e) => {
                                    e.currentTarget.style.boxShadow = '0px 8px 8px rgba(0, 0, 0, 0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
                                }}
                            >
                                Proceed to Payment
                            </button>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientAgreementComponent;
