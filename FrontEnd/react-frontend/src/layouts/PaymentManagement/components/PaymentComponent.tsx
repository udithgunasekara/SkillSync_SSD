import React, { useState, ChangeEvent, FormEvent } from 'react';
import { makePayment } from '../services/PaymentHistoryService';

interface FormData {
  cardNumber: string;
  expiryDate: string;
  securityCode: string;
  firstName: string;
  lastName: string;
}

const PaymentComponent: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Form validation function
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Partial<FormData> = {};

    if (!formData.cardNumber) {
      isValid = false;
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!formData.expiryDate) {
      isValid = false;
      newErrors.expiryDate = 'Invalid expiry date';
    }

    if (!formData.securityCode) {
      isValid = false;
      newErrors.securityCode = 'Invalid security code';
    }

    if (!formData.firstName) {
      isValid = false;
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      isValid = false;
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return isValid;
  };

  // Form submission function
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (validateForm()) {
      makePayment(formData)
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
          // Handle error as needed
        });
    }
  };

  // Form input change handler
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className='container'>
      <br /><br />
      <div className='row'>
        <div className='card col-md-6 offset-md-3 offset-md-3'>
          <h2 className='text-center'>Add Payment Details</h2>
          <div className='card-body'>
            <form onSubmit={handleSubmit}>
              <div className='form-group mb-2'>
                <label className='form-label' htmlFor='cardNumber'>Card Number</label>
                <input
                  type='text'
                  id='cardNumber'
                  name='cardNumber'
                  placeholder='Enter Card Number'
                  value={formData.cardNumber}
                  className={`form-control ${errors.cardNumber && 'is-invalid'}`}
                  onChange={handleInputChange}
                />
                {errors.cardNumber && <div className='invalid-feedback'>{errors.cardNumber}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-label' htmlFor='expiryDate'>Expiry Date</label>
                <input
                  type='text'
                  id='expiryDate'
                  name='expiryDate'
                  placeholder='Enter expiry date'
                  value={formData.expiryDate}
                  className={`form-control ${errors.expiryDate && 'is-invalid'}`}
                  onChange={handleInputChange}
                />
                {errors.expiryDate && <div className='invalid-feedback'>{errors.expiryDate}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-label' htmlFor='securityCode'>Security Code</label>
                <input
                  type='text'
                  id='securityCode'
                  name='securityCode'
                  placeholder='Enter security code'
                  value={formData.securityCode}
                  className={`form-control ${errors.securityCode && 'is-invalid'}`}
                  onChange={handleInputChange}
                />
                {errors.securityCode && <div className='invalid-feedback'>{errors.securityCode}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-label' htmlFor='firstName'>First Name</label>
                <input
                  type='text'
                  id='firstName'
                  name='firstName'
                  placeholder='Enter First Name'
                  value={formData.firstName}
                  className={`form-control ${errors.firstName && 'is-invalid'}`}
                  onChange={handleInputChange}
                />
                {errors.firstName && <div className='invalid-feedback'>{errors.firstName}</div>}
              </div>

              <div className='form-group mb-2'>
                <label className='form-label' htmlFor='lastName'>Last Name</label>
                <input
                  type='text'
                  id='lastName'
                  name='lastName'
                  placeholder='Enter Last Name'
                  value={formData.lastName}
                  className={`form-control ${errors.lastName && 'is-invalid'}`}
                  onChange={handleInputChange}
                />
                {errors.lastName && <div className='invalid-feedback'>{errors.lastName}</div>}
              </div>

              <button className='btn btn-success' type='submit'>Submit Payment</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
