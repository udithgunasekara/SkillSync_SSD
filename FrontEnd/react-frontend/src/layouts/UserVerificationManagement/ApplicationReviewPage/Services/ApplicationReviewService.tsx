import { apiService } from '../../../../services/ApiService';

const REST_API_INPROGRESS_FREELANCERS = "/Freelancer/AllInProgress";

export const ListInProgressFreelancers = () => apiService.get(REST_API_INPROGRESS_FREELANCERS);