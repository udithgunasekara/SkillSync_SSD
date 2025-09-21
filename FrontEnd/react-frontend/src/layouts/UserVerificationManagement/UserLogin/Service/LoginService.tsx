import axios from "axios";

const REST_API_FREELANCE_LOGIN = "http://localhost:8082/Freelancer/login";
const REST_API_CLIENT_LOGIN = "http://localhost:8082/Client/login";

export const FreelancerLogin = (freelancer:any) => axios.post(REST_API_FREELANCE_LOGIN, freelancer);
export const ClientLogin = (client:any) => axios.post(REST_API_CLIENT_LOGIN, client);