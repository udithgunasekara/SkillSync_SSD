import axios, { AxiosResponse } from "axios";

const REST_API_BASE_URL_USERANSWER = "http://localhost:8082/api/userAnswers";

interface userAnswers {
    userNamePk: string;
    questionIdPk: string;
    selectedOptionId: string;
}

export const saveUserAnswers = (userAnswers: userAnswers): Promise<AxiosResponse<userAnswers>> => axios.post<userAnswers>(REST_API_BASE_URL_USERANSWER, userAnswers);