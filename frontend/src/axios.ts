// src/utils/axios.ts
import axios, { AxiosRequestConfig } from "axios";

// You can update this to your backend API URL
const BASE_URL = "https://bloodbank-i3q9.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // optional: allows sending cookies if you're using sessions/auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Main request wrapper
export const axiosRequest = async <T = any>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error: any) {
    console.error("Axios Request Error:", error.response || error.message);
    throw error;
  }
};

export default axiosInstance;
