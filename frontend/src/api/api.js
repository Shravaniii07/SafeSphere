import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ REQUEST LOGGER
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE HANDLER (FIXED)
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    // 🔴 HANDLE NO SERVER (your current main issue)
    if (!error.response) {
      console.error('🚨 Backend not reachable. Is server running?');
      return Promise.reject({
        message: 'Server not running (ERR_CONNECTION_REFUSED)',
      });
    }

    const status = error.response.status;
    const message =
      error.response.data?.message ||
      error.message ||
      'Something went wrong';

    console.error(
      `[API Error] ${status} ${error.config?.url}:`,
      message
    );

    // ✅ HANDLE COMMON CASES SAFELY
    if (status === 404) {
      console.warn('⚠️ Resource not found (likely invalid trackingId)');
    }

    if (status === 500) {
      console.error('🔥 Server error - check backend logs');
    }

    if (status === 401) {
      console.warn('🔒 Unauthorized - login may be required');
      // optional redirect
      // window.location.href = '/login';
    }

    return Promise.reject({
      status,
      message,
    });
  }
);

export default api;


// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // Crucial for cookie-based auth
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor for logging
// api.interceptors.request.use(
//   (config) => {
//     console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
//     return config;
//   },
//   (error) => {
//     console.error('[API Request Error]', error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for global error handling
// api.interceptors.response.use(
//   (response) => {
//     console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
//     return response;
//   },
//   (error) => {
//     const message = error.response?.data?.message || error.message || 'Something went wrong';
//     console.error(`[API Response Error] ${error.response?.status || 'Network'} ${error.config?.url}:`, message);
    
//     // You could add logic here to redirect to login if 401
//     // if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
//     //   window.location.href = '/login';
//     // }
    
//     return Promise.reject(error);
//   }
// );

// export default api;
