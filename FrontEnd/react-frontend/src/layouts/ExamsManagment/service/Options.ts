import axios, { AxiosResponse } from "axios";

const REST_API_BASE_URL_OPTIONS = "http://localhost:8082/api/options";

interface Option {
  optionId: string;
  optionTxt: string;
  questionId: string;
}

export const createOptions = (questionId: string, options: Option): Promise<AxiosResponse<void>> =>
  axios.post<void>(`${REST_API_BASE_URL_OPTIONS}/${questionId}`, options);

export const getOptionById = (optionId: string): Promise<AxiosResponse<Option>> =>
  axios.get<Option>(`${REST_API_BASE_URL_OPTIONS}/${optionId}`);

export const updateOptionById = (optionId: string, options: Option): Promise<AxiosResponse<void>> =>
  axios.put<void>(`${REST_API_BASE_URL_OPTIONS}/${optionId}`, options);

export const deleteOptionById = (optionId: string): Promise<void> => axios.delete(`${REST_API_BASE_URL_OPTIONS}/${optionId}`);