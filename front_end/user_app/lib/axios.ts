import axios from 'axios';

const api = axios.create({
  // Arahkan ke Proxy Next.js
  baseURL: '/api', 
  
  headers: {
    "Content-Type": "application/json",
  },
  // Wajib true agar Cookie Access Token terbawa saat request ke /api
  withCredentials: true, 
});

// Handle Logout jika token expired (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;