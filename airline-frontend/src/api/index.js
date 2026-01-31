import axios from 'axios';

const API = axios.create({
    // Hardcode the Render URL here to bypass the 404 immediately
    baseURL: import.meta.env.VITE_API_URL || 'https://airline-backend-cdzk.onrender.com',
});

// Attach token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// IMPORTANT: Login uses Form Data, Register uses JSON
export const login = (formData) => {
    const data = new FormData();
    data.append('username', formData.email); // FastAPI expects 'username'
    data.append('password', formData.password);
    return API.post('/auth/login', data);
};

export const register = (formData) => API.post('/auth/register', formData);
export const fetchFlights = (searchParams) => API.get('/flights', { params: searchParams });
export const bookFlight = (bookingData) => API.post('/bookings', bookingData);
