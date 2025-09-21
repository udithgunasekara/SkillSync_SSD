import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8082/api/jobs';

const GET_ALL_JOBS_REST_API = 'http://localhost:8082/api/jobs/getalljobposts';

const SEARCH_JOBS_REST_API = 'http://localhost:8082/api/jobs/search'; 

const REST_API_BASE_URL_REQUEST = 'http://localhost:8082/api/jobRequests';

const GET_ALL_JOBREQUESTS_REST_API = 'http://localhost:8082/api/jobRequests/getalljobrequests';


export const listJobs = () => axios.get(GET_ALL_JOBS_REST_API);
export const createNewJobPost = (job: any) => axios.post(REST_API_BASE_URL, job);
export const getJobPostingById = (id: string) => axios.get(REST_API_BASE_URL + '/' + id);
export const updateJobPost = (id: string, job: any) => axios.put(REST_API_BASE_URL + '/' + id, job);
export const deleteJobPost = (id: string) => axios.delete(REST_API_BASE_URL + '/' + id);
export const searchJobs = (query: string) => axios.get(SEARCH_JOBS_REST_API, {
    params: { query: query }  // Passing the search query as a parameter
  });

export const applyJob = (jobRequest: any) => axios.post(REST_API_BASE_URL_REQUEST, jobRequest);
export const getAllJobRequests = () => axios.get(GET_ALL_JOBREQUESTS_REST_API);
export const deleteJobRequest = (requestid: string) => axios.delete(REST_API_BASE_URL_REQUEST + '/' + requestid);
export const updateJobRequest = (requestid: string, jobRequest: any) => axios.put(REST_API_BASE_URL_REQUEST + '/' + requestid, jobRequest);
