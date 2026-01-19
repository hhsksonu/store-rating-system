import axios from 'axios';

// backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Attach token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// handle unauthorized res
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect login page
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
