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
    // Cek apakah ada response error
    if (error.response?.status === 401) {

      // --- LOGIC PENCEGAH LOOP ---

      // 1. Cek URL Request-nya.
      // Jika error 401 datang dari endpoint '/auth/refresh', JANGAN redirect.
      // Karena itu artinya user memang belum login (Guest), biarkan AuthProvider yang handle state-nya.
      const requestUrl = error.config?.url || '';
      if (requestUrl.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      // 2. Cek Posisi Halaman.
      // Jika user SUDAH di halaman login, jangan redirect lagi (biar gak refresh halaman).
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;