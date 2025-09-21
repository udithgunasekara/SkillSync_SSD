import axios, { AxiosResponse } from "axios";

const REST_API_BASE_URL_USERRESULT = "http://localhost:8082/api/userResult";

interface userResult {
    userNamePk: string;
    examIdPk: string;
    result: string;
}

export const saveUserResult = (userResult: userResult): Promise<AxiosResponse<userResult>> => axios.post<userResult>(REST_API_BASE_URL_USERRESULT, userResult);

export const getUserResultById = (userNamePk: string, examIdPk: string): Promise<AxiosResponse<userResult>> => axios.get<userResult>(`${REST_API_BASE_URL_USERRESULT}/${userNamePk}/${examIdPk}`);

export const listUserResult = (): Promise<AxiosResponse<userResult[]>> => axios.get<userResult[]>(REST_API_BASE_URL_USERRESULT);

export const getUserResultByUserName = (userNamePk: string): Promise<AxiosResponse<userResult[]>> => axios.get<userResult[]>(`${REST_API_BASE_URL_USERRESULT}/${userNamePk}`);