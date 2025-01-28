import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://localhost:5001/api',
    withCredentials: true, // Include cookies when making requests
})