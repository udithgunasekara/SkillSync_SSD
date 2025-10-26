// FIXED: Use CSRF-protected API service instead of direct axios
import { apiService } from '../../../services/ApiService';

// API endpoints (now using relative paths)
const REST_API_FREELANCER_REG = "/Freelancer/Registration";
const REST_API_CLIENT_REG = "/Client/Registration";
const REST_API_SOCIAL_LINK = "/qualification/addSocialLinks";
const REST_API_QUALIFICATION = "/qualification/upload";
const REST_API_REJECTED_QUALIFICATIONS = "/qualification/Rejected/";
const REST_API_QUALIFICATION_UPLOAD = "/qualification/update";

const REST_API_OTP_SENDING = "/otp/request";
const REST_API_OTP_VERIFY = "/otp/verify";

const REST_API_CHECK_ACCOUNT_STATUS = "/Freelancer/checkAccountStatus";

// FIXED: All services now use CSRF-protected API service
export const createFreelancer = (freelancer: any) => 
    apiService.post(REST_API_FREELANCER_REG, freelancer);

export const createClient = (client: any) => 
    apiService.post(REST_API_CLIENT_REG, client);

export const createSocialLink = (socialLinks: any) => 
    apiService.post(REST_API_SOCIAL_LINK, socialLinks);

export const createQualification = (qualifications: any) => 
    apiService.post(REST_API_QUALIFICATION, qualifications);

export const getRejectedQualifications = (username: string) => 
    apiService.get(`${REST_API_REJECTED_QUALIFICATIONS}${username}`);

export const reUploadQualification = (username: string, title: string, formData: FormData) =>
    apiService.put(`${REST_API_QUALIFICATION_UPLOAD}`, formData, {
        params: { username, title },
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const OTPSending = (email: string) => 
    apiService.post(REST_API_OTP_SENDING, { email });

export const OTPVerify = (otp: string, email: string) => 
    apiService.post(REST_API_OTP_VERIFY, { otp, email });

export const checkAccountStatus = (username: string) => 
    apiService.get(`${REST_API_CHECK_ACCOUNT_STATUS}/${username}`);