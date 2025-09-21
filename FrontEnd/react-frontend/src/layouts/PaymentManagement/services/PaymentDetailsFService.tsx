
import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8082/details';

// Define an interface for the detail object
interface Detail {
  userName: string;
  // Add more properties as needed
}

// Function to fetch all details
export const listDetails = () => axios.get(REST_API_BASE_URL);

// Function to add details
export const addDetails = (detail: Detail) => {
  return axios.post(REST_API_BASE_URL, detail);
}

// Function to fetch details by ID
export const getDetails = async (detailUserName: string) => {
    try {
      const response = await axios.get(`${REST_API_BASE_URL}/${detailUserName}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        console.error('Details not found:', error);
        return null;
      } else {
        console.error('Error fetching details:', error);
        throw error;
      }
    }
  }

// Function to update details by ID
export const updateDetails = (detailUserName: string, detail: any) => {
  return axios.put(`${REST_API_BASE_URL}/${detailUserName}`, detail);
}

// Function to delete details by ID
export const deleteDetails = (detailUserName: string) => {
  return axios.delete(`${REST_API_BASE_URL}/${detailUserName}`);
}

