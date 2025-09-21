import axios, { AxiosResponse } from "axios";

const REST_API_BASE_URL_FREELANCER_TO_INTERVIEW = "http://localhost:8082/Freelancer";
const REST_API_BASE_URL_INTERVIEW = "http://localhost:8082/api/interview";

interface Freelancer{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    nic: string;
    phone: string;
    userName: string;
    password: string;
    workOn: string;
    created_at: string;
    interview: Interview;
}

interface Interview{
    interviewId: string;
    category: string;
    date: string;
    time: string;
    meetingLink: string;
    freelancerFk: string;
}

export const listResevations = (): Promise<AxiosResponse<Interview[]>> => axios.get<Interview[]>(REST_API_BASE_URL_INTERVIEW);

export const saveResevation = (freelancerFK: string, interview: Interview): Promise<AxiosResponse<void>> => axios.post<void>(`${REST_API_BASE_URL_INTERVIEW}/${freelancerFK}`, interview);

export const getFreelancer = (userName: string): Promise<AxiosResponse<Freelancer>> => axios.get<Freelancer>(`${REST_API_BASE_URL_FREELANCER_TO_INTERVIEW}/${userName}`);