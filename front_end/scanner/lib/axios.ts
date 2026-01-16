import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// The scanner app uses an X-Scanner-Secret header injected by the proxy for auth.
// It does not have a user login flow, so a 401 redirect interceptor is not needed.
// Errors are handled locally in the components that make the API calls.

export default api;