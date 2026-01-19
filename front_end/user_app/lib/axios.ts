import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor: Tambahkan token ke Authorization header
api.interceptors.request.use(
  (config) => {
    // Token disimpan di cookie, dikirim otomatis via withCredentials
    // Tapi kita juga perlu cek apakah ada token di cookie dan kirim di header
    // untuk endpoint yang membutuhkan Bearer token

    // Ambil token dari cookie jika ada
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle error responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    // Daftar halaman publik yang tidak perlu redirect
    const publicPages = ['/', '/login', '/auth/google/callback'];
    const isPublicPage = typeof window !== 'undefined' &&
      publicPages.some(page => window.location.pathname === page || window.location.pathname.startsWith('/auth/'));

    // 401/403 pada halaman publik = normal (user belum login)
    // Jangan redirect, biarkan AuthProvider handle
    if ((status === 401 || status === 403) && isPublicPage) {
      return Promise.reject(error);
    }

    // 401 pada halaman protected = session expired, redirect ke login
    if (status === 401) {
      // Jangan redirect jika request ke auth endpoints
      if (requestUrl.includes('/auth/refresh') || requestUrl.includes('/auth/google') || requestUrl.includes('/auth/me')) {
        return Promise.reject(error);
      }

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

