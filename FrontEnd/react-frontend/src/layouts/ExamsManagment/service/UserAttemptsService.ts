import axios, { AxiosResponse } from "axios";

const REST_API_BASE_URL_USERATTEMPTS = "http://localhost:8082/api/userAttempts";

interface userAttempts {
    userName: string;
    examId: string;
    noOfAttempts: string;
}

export const saveUserAttempts = (userAttempts: userAttempts): Promise<AxiosResponse<userAttempts>> => axios.post<userAttempts>(REST_API_BASE_URL_USERATTEMPTS, userAttempts);

export const getUserAttemptsById = (userNamePk: string, examIdPk: string): Promise<AxiosResponse<userAttempts>> => axios.get<userAttempts>(`${REST_API_BASE_URL_USERATTEMPTS}/${userNamePk}/${examIdPk}`);

export const updateUserAttempts = (userNamePk: string, examIdPk: string, userAttempts: userAttempts): Promise<AxiosResponse<userAttempts>> => axios.put<userAttempts>(`${REST_API_BASE_URL_USERATTEMPTS}/${userNamePk}/${examIdPk}`, userAttempts);