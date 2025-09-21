import axios from "axios";

const REST_API_INPROGRESS_FREELANCERS = "http://localhost:8082/Freelancer/AllInProgress";


export const ListInProgressFreelancers = () => axios.get(REST_API_INPROGRESS_FREELANCERS);