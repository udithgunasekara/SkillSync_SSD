import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { addDetails, getDetails } from '../services/PaymentDetailsFService';
import { useParams, useHistory } from 'react-router-dom';
import { notifyMessage } from "../util/communFunc";

interface Errors {
  userName?: string;
  fullName?: string;
  country?: string;
  state?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  paypalAddress?: string;
}

const PaymentDetailsFComponent: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [paypalAddress, setPaypalAddress] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
 // const { userName: routeUserName } = useParams<{ userName: string }>();
  const [routeUserName, setrouteUserName] = useState<string>(sessionStorage.getItem('username') || '');
  const navigator = useHistory();

  useEffect(() => {
    if (routeUserName) {
      // Fetch details if an id is present in the URL
      fetchDetails(routeUserName);
    }
  }, [routeUserName]);

  const fetchDetails = async (userName: string) => {
    try {
      const data = await getDetails(userName);
      if (data) {
        setUserName(data.userName);
        setFullName(data.fullName);
        setCountry(data.country);
        setState(data.state);
        setAddress(data.address);
        setCity(data.city);
        setPostalCode(data.postalCode);
        setPaypalAddress(data.paypalAddress);
      } else {
        console.error(`No details found for userName: ${userName}`);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    switch (name) {
      case 'id':
        setId(value); 
        break;
      case 'userName':
        setUserName(value);
        break;
      case 'fullName':
        setFullName(value);
        break;
      case 'country':
        setCountry(value);
        break;
      case 'state':
        setState(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'city':
        setCity(value);
        break;
      case 'postalCode':
        setPostalCode(value);
        validatePostalCode(value);
        break;
      case 'paypalAddress':
        setPaypalAddress(value);
        validatePaypalAddress(value);
        break;
      default:
        break;
    }
  }

  function validatePostalCode(value: string): void {
    if (!/^\d+$/.test(value)) {
      setErrors(prev => ({
        ...prev,
        postalCode: 'Postal Code must contain only numbers.',
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        postalCode: '',
      }));
    }
  }

  function validatePaypalAddress(value: string): void {
    if (!value.includes('@')) {
      setErrors(prev => ({
        ...prev,
        paypalAddress: 'Paypal Address must contain @ sign.',
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        paypalAddress: '',
      }));
    }
  }

  function validateForm(): boolean {
    const formErrors: Errors = {};
    if (!userName) formErrors.userName = 'user name is required';
    if (!fullName) formErrors.fullName = 'Full Name is required';
    if (!country) formErrors.country = 'Country is required';
    if (!state) formErrors.state = 'State is required';
    if (!address) formErrors.address = 'Address is required';
    if (!city) formErrors.city = 'City is required';
    if (!postalCode) formErrors.postalCode = 'Postal Code is required';
    if (!paypalAddress) formErrors.paypalAddress = 'Paypal Address is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (validateForm()) {
      const detail = {
        id,
        userName,
        fullName,
        country,
        state,
        address,
        city,
        postalCode,
        paypalAddress,
      };
      
      //alert('Details added successfully');
      addDetails(detail)
        .then(response => {
          const newUserName = response.data.userName;
          notifyMessage('Details Added Successfully', 1);
          navigator.push(`/viewDetails/${newUserName}`);
        })
        .catch(error => {
          console.error('Error adding details:', error);
          // Handle the error appropriately
        });
    }
  }

  function resetForm(): void {
    setId('');
    setUserName('');
    setFullName('');
    setCountry('');
    setState('');
    setAddress('');
    setCity('');
    setPostalCode('');
    setPaypalAddress('');
    setErrors({});
  }

  function cancelForm(e: FormEvent<HTMLButtonElement>): void {
    e.preventDefault();
    resetForm();
  }

  const handleFullName = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
      setFullName(value);
    }
  };

  const handleCountry = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
      setCountry(value);
    }
  };

  const handleState = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
      setState(value);
    }
  };

  const handleAddress = (e: ChangeEvent<HTMLInputElement>): void => {
    setAddress(e.target.value);
  };

  const handleCity = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
      setCity(value);
    }
  };

  const handlePostalCode = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === '') {
      setPostalCode(value);
    }
  };
  

  const handlePaypalAddress = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = e.target.value;
    // Add "@gmail.com" if "@" is not present and the input is not empty
    if (!value.includes('@') && value.trim() !== '') {
      value += '@gmail.com';
    }
    setPaypalAddress(value);
  };
  

  return (
    <div className="container" >
      <br /><br />
      <div className="row" >
        <div className="card col-md-6 offset-md-3 offset-md-3" style={{ background: 'linear-gradient(to right, #f9f2fa, #dbb2ce)' }}>
          <h2 className="text-center">{userName ? 'Update Billing Information' : 'Billing Information'}</h2>
          <div className="card-body" >
            <form onSubmit={handleSubmit}>
              
              {/* id input with validation */}
              <div className="form-group mb-2">
                <label htmlFor="userName" className="form-label">ID</label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={id}
                  onChange={handleInputChange}
                  className="form-control"
                  style={{
                    backgroundColor: '#f9f9f9',
                    borderColor: '#ccc',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                />
                {errors.userName && (
                  <div className="text-danger">{errors.userName}</div>
                )}
              </div>

                {/* username */}
                  <div className="form-group mb-2">
                    <label htmlFor="userName" className="form-label">User Name</label>
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      value={userName}
                      onChange={handleInputChange}
                      className="form-control"
                      style={{
                        backgroundColor: '#f9f9f9',
                        borderColor: '#ccc',
                        borderRadius: '4px',
                        padding: '8px'
                      }}
                    />
                    {errors.userName && (
                      <div className="text-danger">{errors.userName}</div>
                    )}
                  </div>
              
              {/* Full Name input with validation */}
              <div className="form-group mb-2">
                                <label htmlFor="fullName" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={fullName}
                                    onChange={handleFullName}
                                    className="form-control"
                                    style={{
                                        backgroundColor: '#f9f9f9',
                                        borderColor: '#ccc',
                                        borderRadius: '4px',
                                        padding: '8px'
                                    }}
                                />
                                {errors.fullName && (
                                    <div className="text-danger">{errors.fullName}</div>
                                )}
                            </div>

                            {/* Country input with validation */}
                            <div className="form-group mb-2">
                                <label htmlFor="country" className="form-label">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={country}
                                    onChange={handleCountry}
                                    className="form-control"
                                    style={{
                                        backgroundColor: '#f9f9f9',
                                        borderColor: '#ccc',
                                        borderRadius: '4px',
                                        padding: '8px'
                                    }}
                                />
                                {errors.country && (
                                    <div className="text-danger">{errors.country}</div>
                                )}
                            </div>

                            {/* State input with validation */}
                            <div className="form-group mb-2">
                                <label htmlFor="state" className="form-label">State</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={state}
                                    onChange={handleState}
                                    className="form-control"
                                    style={{
                                        backgroundColor: '#f9f9f9',
                                        borderColor: '#ccc',
                                        borderRadius: '4px',
                                        padding: '8px'
                                    }}
                                />
                                {errors.state && (
                                    <div className="text-danger">{errors.state}</div>
                                )}
                            </div>

                            {/* Address input with validation */}
                            <div className="form-group mb-2">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={address}
                                    onChange={handleAddress}
                                    className="form-control"
                                    style={{
                                        backgroundColor: '#f9f9f9',
                                        borderColor: '#ccc',
                                        borderRadius: '4px',
                                        padding: '8px'
                                    }}
                                />
                                {errors.address && (
                                    <div className="text-danger">{errors.address}</div>
                                )}
                            </div>

                            {/* City input with validation */}
                            <div className="form-group mb-2">
                                <label htmlFor="city" className="form-label">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={city}
                                    onChange={handleCity}
                                    className="form-control"
                                    style={{
                                        backgroundColor: '#f9f9f9',
                                        borderColor: '#ccc',
                                        borderRadius: '4px',
                                        padding: '8px'
                                    }}
                                />
                                {errors.city && (
                                    <div className="text-danger">{errors.city}</div>
                                )}
                            </div>

                            {/* Postal Code input with validation */}
                            <div className="form-group mb-2">
                                <label htmlFor="postalCode" className="form-label">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={postalCode}
                                    onChange={handlePostalCode}
                                    className="form-control"
                                    style={{
                                        backgroundColor: '#f9f9f9',
                                        borderColor: '#ccc',
                                        borderRadius: '4px',
                                        padding: '8px'
                                    }}
                                />
                                {errors.postalCode && (
                                    <div className="text-danger">{errors.postalCode}</div>
                                )}
                            </div>

                            {/* Paypal Address input with validation */}
                            <div className="form-group mb-2">
                                <label htmlFor="paypalAddress" className="form-label">Paypal Address</label>
                                <input
                                    type="email"
                                    id="paypalAddress"
                                    name="paypalAddress"
                                    value={paypalAddress}
                                    onChange={handlePaypalAddress}
                                    className="form-control"
                                    style={{
                                        backgroundColor: '#f9f9f9',
                                        borderColor: '#ccc',
                                        borderRadius: '4px',
                                        padding: '8px'
                                    }}
                                />
                                {errors.paypalAddress && (
                                    <div className="text-danger">{errors.paypalAddress}</div>
                                )}
                            </div>

              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-success" type="submit">
                  Submit
                </button>
                <button className="btn btn-danger" onClick={cancelForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsFComponent;
