import axios, { AxiosResponse } from 'axios';

// Define base URL
const REST_API_BASE_URL = 'http://localhost:8082/api/ratings';

// Define types for Rating and RatingID
interface Rating {
    id?: number;
    projectId: string;
    rating: number;
    review: string;
    userId: string;
}

interface Project {
    id?: number;
    review: string;
    userId: string;
    freelancerId: string;
}

type RatingID = number;

// Function to list all ratings
export const listRatings = (): Promise<AxiosResponse<Rating[]>> => axios.get<Rating[]>(REST_API_BASE_URL);

// Function to create a new rating
export const createRating = (rating: Rating): Promise<AxiosResponse<Rating>> => axios.post<Rating>(REST_API_BASE_URL, rating);

// Function to get a single rating by ID
export const getRating = (ratingId: number): Promise<AxiosResponse<Rating>> => axios.get<Rating>(`${REST_API_BASE_URL}/${ratingId}`);

// Function to search for ratings by keyword
export const searchRatings = (keyword: string): Promise<AxiosResponse<Rating[]>> => axios.get<Rating[]>(`${REST_API_BASE_URL}/search?keyword=${keyword}`);

// Function to update a rating by ID
export const updateRating = (ratingId: number, rating: Rating): Promise<AxiosResponse<Rating>> => axios.put<Rating>(`${REST_API_BASE_URL}/${ratingId}`, rating);

// Function to delete a rating by ID
export const deleteRating = (ratingId: number): Promise<void> => axios.delete(`${REST_API_BASE_URL}/${ratingId}`);

// Function to list all projects
export const listProjects = (): Promise<AxiosResponse<Project[]>> => axios.get<Project[]>(REST_API_BASE_URL);

