import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { deleteDetails, getDetails } from '../services/PaymentDetailsFService';

interface Details {
    userName: string;
    fullName: string;
    country: string;
    state: string;
    address: string;
    city: string;
    postalCode: string;
    paypalAddress: string;
}

const DetailsPage: React.FC = () => {
    const [details, setDetails] = useState<Details | null>(null);
    const { userName } = useParams<{ userName: string }>();
    const navigate = useHistory(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDetails(userName);
                if (data) {
                    setDetails(data);
                } else {
                    console.error(`No details found for username: ${userName}`);
                }
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };
        fetchData();
    }, [userName]);

    if (!details) {
        return <div>Loading...</div>;
    }

    const updateDetails = (userName: string) => {
        navigate.push(`/edit-details/${userName}`);
    };

    const removeDetails = async (userName: string) => {
        try {
            await deleteDetails(userName);
            alert('Data deleted successfully.');
            navigate.push('/details');
        } catch (error) {
            console.error('Error deleting details:', error);
        }
    }

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-8" >
                    <div className="card" style={{ background: 'linear-gradient(to right, #f9f2fa, #dbb2ce)' }}>
                        <h2 className="card-header text-center">Billing Information</h2>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="userName" className="form-label">Username</label>
                                    <input type="text" className="form-control" id="userName" value={details.userName} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fullName" className="form-label">Full Name</label>
                                    <input type="text" className="form-control" id="fullName" value={details.fullName} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="country" className="form-label">Country</label>
                                    <input type="text" className="form-control" id="country" value={details.country} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="state" className="form-label">State</label>
                                    <input type="text" className="form-control" id="state" value={details.state} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <input type="text" className="form-control" id="address" value={details.address} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="city" className="form-label">City</label>
                                    <input type="text" className="form-control" id="city" value={details.city} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="postalCode" className="form-label">Postal Code</label>
                                    <input type="text" className="form-control" id="postalCode" value={details.postalCode} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="paypalAddress" className="form-label">Paypal Address</label>
                                    <input type="text" className="form-control" id="paypalAddress" value={details.paypalAddress} readOnly />
                                </div>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <button className="btn btn-info me-md-2" onClick={() => updateDetails(details.userName)}>Edit Details</button>
                                    <button className="btn btn-danger" onClick={() => removeDetails(details.userName)}>Delete</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;
