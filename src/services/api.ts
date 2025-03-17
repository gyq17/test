// Example API service with TypeScript
import axios from 'axios';

// Define your API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Example interface for API response
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Example data interface
export interface ExampleData {
  id: number;
  title: string;
  description: string;
}

// API service class
export class ApiService {
  // Example GET request
  static async getData(): Promise<ApiResponse<ExampleData[]>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/data`);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Example POST request
  static async createData(data: Partial<ExampleData>): Promise<ApiResponse<ExampleData>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/data`, data);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  private static handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      return new Error(error.response?.data?.message || 'An error occurred');
    }
    return new Error('An unexpected error occurred');
  }
} 