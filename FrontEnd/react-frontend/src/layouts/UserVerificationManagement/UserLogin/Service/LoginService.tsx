import { apiService } from '../../../../services/ApiService';

const REST_API_FREELANCE_LOGIN = "/Freelancer/login";
const REST_API_CLIENT_LOGIN = "/Client/login";

export const FreelancerLogin = (freelancer:any) => apiService.post(REST_API_FREELANCE_LOGIN, freelancer);
export const ClientLogin = (client:any) => apiService.post(REST_API_CLIENT_LOGIN, client);