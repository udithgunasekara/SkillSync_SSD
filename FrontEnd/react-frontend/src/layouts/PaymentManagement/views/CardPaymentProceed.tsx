import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { notifyMessage } from "../util/communFunc";
import visa from "../image/Visa.jpg";
import mastercard from "../image/mastercard.jpg";
import amex from "../image/amex.png";

interface ApiResponse {
    transactionID: any;
    date: any;
    paymentMethod: any;
    projectID: any;
    amount: any;
}

const CardPaymentProceed = () => {
    const navigate = useHistory();
    const location = useLocation();

    // Getting query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    const propsData = {
        amount: queryParams.get('amount'),
        projectId: queryParams.get('projectId')
    };

    // State variables for input fields and validation errors
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [cardType, setCardType] = useState('');

    const [cardNumberError, setCardNumberError] = useState('');
    const [expiryDateError, setExpiryDateError] = useState('');
    const [securityCodeError, setSecurityCodeError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');

    // Validation functions
    const validateCardNumber = () => {
        let cardNumberLength = 0;
        if (cardType === 'visa' || cardType === 'mastercard') {
            cardNumberLength = 12;
        } else if (cardType === 'amex') {
            cardNumberLength = 15;
        }

        const cardNumberRegex = new RegExp(`^\\d{${cardNumberLength}}$`); // Dynamic regex based on card type
        if (!cardNumberRegex.test(cardNumber)) {
            setCardNumberError(`Enter a valid ${cardType.toUpperCase()} card number`);
            return false;
        }
        setCardNumberError('');
        return true;
    };

    const validateExpiryDate = () => {
        const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
        if (!expiryDateRegex.test(expiryDate)) {
            setExpiryDateError("Enter valid expiry date");
            return false;
        }

        const [month, year] = expiryDate.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const enteredYear = parseInt(year, 10);

        if (
            parseInt(month, 10) < 1 ||
            parseInt(month, 10) > 12 ||
            enteredYear < currentYear
        ) {
            setExpiryDateError("Invalid expiry date");
            return false;
        }

        setExpiryDateError('');
        return true;
    };

    const validateSecurityCode = () => {
        const securityCodeRegex = /^\d{3}$/; // 3-digit security code
        if (!securityCodeRegex.test(securityCode)) {
            setSecurityCodeError("Security code must consist of exactly 3 numeric characters");
            return false;
        }
        setSecurityCodeError('');
        return true;
    };

    const validateName = (name: string, setNameError: Function, fieldName: string) => {
        const nameRegex = /^[A-Za-z]+$/; // Letters only
        if (!nameRegex.test(name)) {
            setNameError(`Please enter a valid ${fieldName}`);
            return false;
        }
        setNameError('');
        return true;
    };

    // Proceed payment handler
    const proceedPaymentHandler = async () => {
        const isCardNumberValid = validateCardNumber();
        const isExpiryDateValid = validateExpiryDate();
        const isSecurityCodeValid = validateSecurityCode();
        const isFirstNameValid = validateName(firstName, setFirstNameError, "first name");
        const isLastNameValid = validateName(lastName, setLastNameError, "last name");

        if (!(
            isCardNumberValid && 
            isExpiryDateValid && 
            isSecurityCodeValid && 
            isFirstNameValid && 
            isLastNameValid
        )) {
            return;
        }

        // If all inputs are valid, proceed with payment
        await sendPayment();
    };

    // Send payment function (unchanged)
    const sendPayment = async () => {
        const today = new Date();
        const formattedDate = today.toISOString().slice(0, 10);
        const amount = propsData.amount ?? '0';
        const projectID = propsData.projectId;

        const apiUrl = 'http://localhost:8082/payment/create';

        const postData = {
            date: formattedDate,
            paymentMethod: "CreditCard",
            projectID: projectID,
            amount: amount
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            console.log("RESPONSE", response);

            const result: ApiResponse = await response.json();
            console.log("API RESPONSE", result);
            console.log("Success:", result);

            if (result.transactionID) {
                notifyMessage("Payment Successful", 1);
                // Navigate to transaction details page
                navigate.push('/transaction-details', {
                    state: {
                        transactionID: result.transactionID,
                        date: result.date,
                        paymentMethod: result.paymentMethod,
                        projectID: result.projectID,
                        amount: result.amount
                    }
                });
            } else {
                notifyMessage("Payment Failed", 0);
            }
        } catch (error) {
            console.error("Error occurred:", error);
            notifyMessage("Payment Failed", 0);
        }
    };

    return (
        <div className="main-section" style={{ background: 'linear-gradient(to right, #f9f2fa, #dbb2ce)' }}>
            <div className="row" >
                <h2 className="text-center mt-5">Add Payment Details</h2>

                <div className="card col-md-6 mt-5 px-5 pt-3 pb-5 offset-md-3" style={{ background: 'linear-gradient(to right, #dbb2ce, #f9f2fa )' }}>
                    <h6>Credit/Debit Card</h6>
                    <div className="input-group-append" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input 
                                type="radio" 
                                name="cardType" 
                                value="visa" 
                                onChange={() => setCardType('visa')}
                            />
                            <img src={visa} alt="Visa" className="card-image" style={{ width: '50px', height: 'auto', margin: '0 10px' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input 
                                type="radio" 
                                name="cardType" 
                                value="mastercard" 
                                onChange={() => setCardType('mastercard')}
                            />
                            <img src={mastercard} alt="Mastercard" className="card-image" style={{ width: '50px', height: 'auto', margin: '0 10px' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input 
                                type="radio" 
                                name="cardType" 
                                value="amex" 
                                onChange={() => setCardType('amex')}
                            />
                            <img src={amex} alt="AMEX" className='card-image' style={{ width: '50px', height: 'auto', margin: '0 10px' }} />
                        </div>
                    </div>
                    <div className="card-body mt-2 mx-5">
                        <h6 className="mt-3">Amount: {propsData.amount ?? 0}$</h6>

                        {/* Card number input with error display */}
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => {
                                // Ensure only numeric characters are entered
                                const input = e.target.value.replace(/\D/g, '');
                                // Limit input to the appropriate number of characters based on card type
                                const truncatedInput = cardType === 'amex' ? input.slice(0, 15) : input.slice(0, 12);
                                setCardNumber(truncatedInput);
                            }}
                            onBlur={validateCardNumber}
                            className={`form-control ${cardNumberError ? 'is-invalid' : ''}`}
                            placeholder="Card Number"
                        />
                        {cardNumberError && (
                            <div className="invalid-feedback">
                                {cardNumberError}
                            </div>
                        )}

                        <div className="row mt-3">
                            {/* Expiry month input with error display */}
                            <div className="col">
                                <input
                                    type="text"
                                    value={expiryDate.substring(0, 2)}
                                    onChange={(e) => {
                                        const input = e.target.value.replace(/\D/g, ''); // Allow only digits
                                        const truncatedInput = input.slice(0, 2); // Limit to 2 characters
                                        // Ensure the value is between 01 and 12
                                        const validInput = Math.min(Math.max(parseInt(truncatedInput, 10), 1), 12);
                                        setExpiryDate(validInput.toString().padStart(2, '0') + '/' + expiryDate.substring(3)); // Combine with year
                                    }}
                                    onBlur={validateExpiryDate}
                                    className={`form-control ${expiryDateError ? 'is-invalid' : ''}`}
                                    placeholder="Expiry Month"
                                    maxLength={2} // Limit to 2 characters
                                    onKeyPress={(e) => {
                                        // Prevent non-numeric characters
                                        if (isNaN(Number(e.key))) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {expiryDateError && (
                                    <div className="invalid-feedback">
                                        {expiryDateError}
                                    </div>
                                )}
                            </div>

                            {/* Expiry year input with error display */}
                            <div className="col">
                                <input
                                    type="text"
                                    value={expiryDate.substring(3)}
                                    onChange={(e) => {
                                        const input = e.target.value.replace(/\D/g, ''); // Allow only digits
                                        const truncatedInput = input.slice(0, 2); // Limit to YY format
                                        setExpiryDate(expiryDate.substring(0, 2) + '/' + truncatedInput); // Combine with month
                                    }}
                                    onBlur={validateExpiryDate}
                                    className={`form-control ${expiryDateError ? 'is-invalid' : ''}`}
                                    placeholder="Expiry Year"
                                    maxLength={2} // Limit to YY format
                                    onKeyPress={(e) => {
                                        // Prevent non-numeric characters
                                        if (isNaN(Number(e.key))) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Security code input with error display */}
                        <input
                            type="text" 
                            value={securityCode}
                            onChange={(e) => {
                                // Allow only numeric characters
                                const input = e.target.value.replace(/\D/g, '');
                                // Limit input to 3 characters
                                const truncatedInput = input.slice(0, 3);
                                setSecurityCode(truncatedInput);
                            }}
                            onBlur={validateSecurityCode}
                            className={`form-control mt-3 ${securityCodeError ? 'is-invalid' : ''}`}
                            placeholder="CVV"
                        />

                        {securityCodeError && (
                            <div className="invalid-feedback">
                                {securityCodeError}
                            </div>
                        )}

                        <div className="row mt-3">
                            {/* First name input with error display */}
                            <div className="col">
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => {
                                        const input = e.target.value.replace(/[^A-Za-z]/ig, ''); // Allow only letters
                                        setFirstName(input);
                                    }}
                                    onBlur={() => validateName(firstName, setFirstNameError, "first name")}
                                    className={`form-control ${firstNameError ? 'is-invalid' : ''}`}
                                    placeholder="First Name"
                                />
                                {firstNameError && (
                                    <div className="invalid-feedback">
                                        {firstNameError}
                                    </div>
                                )}
                            </div>

                            {/* Last name input with error display */}
                            <div className="col">
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => {
                                        const input = e.target.value.replace(/[^A-Za-z]/ig, ''); // Allow only letters
                                        setLastName(input);
                                    }}
                                    onBlur={() => validateName(lastName, setLastNameError, "last name")}
                                    className={`form-control ${lastNameError ? 'is-invalid' : ''}`}
                                    placeholder="Last Name"
                                />
                                {lastNameError && (
                                    <div className="invalid-feedback">
                                        {lastNameError}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mt-5 offset-md-3 d-flex justify-content-end">
                    <button onClick={() => window.history.back()} className="btn btn-danger mx-2">
                        Back
                    </button>
                    <button onClick={proceedPaymentHandler} className="btn btn-success">
                        Proceed Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardPaymentProceed;
