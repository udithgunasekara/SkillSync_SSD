import axios, { AxiosResponse } from "axios";

const REST_API_BASE_URL_QUESTIONS = "http://localhost:8082/api/questions";


interface Question {
  questionId: string;
  questionTxt: string;
  options: Option[];
  examId: string;
}

interface Option {
  optionId: string;
  optionTxt: string;
  questionId: string;
}

export const createQuestions = (examId: string, question: Question): Promise<AxiosResponse<void>> =>
  axios.post<void>(`${REST_API_BASE_URL_QUESTIONS}/${examId}`, question);

export const getQuestionsById = (questionId: string): Promise<AxiosResponse<Question>> =>
  axios.get<Question>(`${REST_API_BASE_URL_QUESTIONS}/${questionId}`);

export const updateQuestionsById = (questionId: string, question: Question): Promise<AxiosResponse<void>> =>
  axios.put<void>(`${REST_API_BASE_URL_QUESTIONS}/${questionId}`, question);

export const deleteQuestionById = (questionId: string): Promise<void> => axios.delete(`${REST_API_BASE_URL_QUESTIONS}/${questionId}`);
