import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Jika masih 401, berarti Proxy gagal melakukan refresh (Refresh Token mati/invalid)
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';

      // Jangan redirect jika memang request ke refresh atau login
      if (requestUrl.includes('/auth/refresh') || requestUrl.includes('/auth/google')) {
        return Promise.reject(error);
      }

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        console.warn("Session completely expired. Redirecting to login.");
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;