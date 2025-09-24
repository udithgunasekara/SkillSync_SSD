
import { apiService } from '../../../services/ApiService';

const REST_API_BASE_URL = '/details';

// Define an interface for the detail object
interface Detail {
  userName: string;
  // Add more properties as needed
}

// Function to fetch all details
export const listDetails = () => apiService.get(REST_API_BASE_URL);

// Function to add details
export const addDetails = (detail: Detail) => {
  return apiService.post(REST_API_BASE_URL, detail);
}

// Function to fetch details by ID
export const getDetails = async (detailUserName: string) => {
    try {
      const response = await apiService.get(`${REST_API_BASE_URL}/${detailUserName}`);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && 
          (error as any).response && (error as any).response.status === 404) {
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
  return apiService.put(`${REST_API_BASE_URL}/${detailUserName}`, detail);
}

// Function to delete details by ID
export const deleteDetails = (detailUserName: string) => {
  return apiService.delete(`${REST_API_BASE_URL}/${detailUserName}`);
}

