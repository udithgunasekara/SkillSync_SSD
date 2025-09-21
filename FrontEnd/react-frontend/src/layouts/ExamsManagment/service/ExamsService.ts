import axios, { AxiosResponse } from "axios";

const REST_API_BASE_URL = 'http://localhost:8082/api/exams';

const baseURL = 'http://localhost:8082/api/';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

interface Exam {
  id: string;
  examName: string;
  examDescription: string;
  noOfAttempts: string;
  badgeName: string;
  badge: File | null;
  creditPoint: string;
  questions: Question[];
  timeLimit: string;
}

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
interface ExamImageData {
  imageURL: string;
  imageBytes: Blob;
}

export const listExams = (): Promise<AxiosResponse<Exam[]>> => axios.get<Exam[]>(REST_API_BASE_URL);

export const getExam = (examid: string): Promise<AxiosResponse<Exam>> => axios.get<Exam>(`${REST_API_BASE_URL}/${examid}`);


export const getExamImage = async (examid: string): Promise<ExamImageData> => {
  try {
    const response = await axiosInstance.get(`/exams/badge/${examid}`, {
      responseType: 'blob',
    });
    if (response.data) {
      const imageURL = URL.createObjectURL(response.data);
      return { imageURL, imageBytes: response.data };
    } else {
      const defaultImageURL = 'https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg';
      return { imageURL: defaultImageURL, imageBytes: new Blob() };
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    throw new Error('Error fetching image. Please try again.');
  }
};


export const updateExam = async (examid: string, exam: Exam, file: File): Promise<string> => {
  const formData = new FormData();
  if (exam.badge) {
    formData.append('file', file);
  }

  try {
    await axiosInstance.put(`${REST_API_BASE_URL}/${examid}`, formData, {
      params: {
        examName: exam.examName,
        examDescription: exam.examDescription,
        noOfAttempts: exam.noOfAttempts,
        timeLimit: exam.timeLimit,
        creditPoint: exam.creditPoint,
      },
    });
    return 'Exam updated successfully.';
  } catch (error) {
    console.error('Error updating exam:', error);
    throw new Error('Error updating exam. Please try again.');
  }
};

export const deleteExam = (examid: string): Promise<void> => axios.delete(`${REST_API_BASE_URL}/${examid}`);

export const createExam = async (exam: Exam, file: File): Promise<string> => {
  const formData = new FormData();
  if (exam.badge) {
    formData.append('file', file);
  }

  try {
    await axiosInstance.post(`exams`, formData, {
      params: {
        examName: exam.examName,
        examDescription: exam.examDescription,
        noOfAttempts: exam.noOfAttempts,
        timeLimit: exam.timeLimit,
        creditPoint: exam.creditPoint,
        badgeName: exam.badgeName,
      },
    });
    return 'Exam created successfully.';
  } catch (error) {
    console.error('Error creating exam:', error);
    throw new Error('Error creating exam. Please try again.');
  }
};