import React, { useContext, useState } from 'react';
import { OTPVerify } from '../Services/UserManagementService';
import { useHistory } from 'react-router-dom';
import FreelancerContext from '../Context/Context';

const OTPVerification: React.FC = () => {
    // Use the email from session storage or an empty string as a fallback
    const [role, setRole] = useState<string>(sessionStorage.getItem('role') || ''); 
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const Navigate = useHistory();


    //access Context
    const {freelancerEmail}:any = useContext(FreelancerContext);
    console.log("Context with email", freelancerEmail);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 4 && /^[0-9]*$/.test(value)) {
            setOtp(value);
            setError(''); 
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(''); // Clear previous success messages
        setError(''); // Clear previous errors

        // Check if the OTP length is exactly 6
        if (otp.length === 4) {
            console.log("OTP Submitted: ", otp);

            try {
                const response = await OTPVerify(otp, freelancerEmail);
                console.log(response.data);
                setSuccessMessage('OTP verified successfully.');

                if(role === 'freelancer'){
                Navigate.push('/InProgressPage')
                }else{
                    Navigate.push('/dashboard')
                }

            } catch (error: any) {
                if (error.response) {
                    setError('Verification failed. Please try again.');
                }
            }
        } else {
            setError('OTP must be 6 digits long.');
        }
    };

    return (
        <div style={{ backgroundColor: '#AC69E2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div className="container bg-white p-5 rounded" style={{ width: '600px', height: '350px' }}>
                <h1 className="text-center">OTP Verification</h1>
                <p className="text-center">Please enter the OTP sent to your email</p>
                <div className="container" style={{alignContent: 'center' }}>
                <form onSubmit={handleSubmit}  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={otp}
                        onChange={handleChange}
                        placeholder="Enter your OTP"
                        className="form-control mb-3"
                        style={{ borderRadius: '5px' }}
                    />
                    {error && <p className="text-danger">{error}</p>}
                    {successMessage && <p className="text-success">{successMessage}</p>}
                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        style={{ borderRadius: '5px', backgroundColor: '#AC69E2'}}
                        disabled={otp.length !== 4}
                    >
                        Confirm
                    </button>
                </form>
            </div>
            </div>
        </div>
    );
};

export default OTPVerification;
