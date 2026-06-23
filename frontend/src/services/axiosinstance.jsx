import axios from 'axios';

// 1. Create the instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Change to process.env.REACT_APP_API_URL in production
  withCredentials: true, // CRITICAL: This tells the browser to automatically send your HTTP-only cookies
});

// --- STATE FOR HANDLING MULTIPLE REQUESTS ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(); // We don't pass a token here because the browser handles the cookie automatically
    }
  });
  
  failedQueue = [];
};

// --- RESPONSE INTERCEPTOR ---
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // 1. If another request is already refreshing the token, wait in the queue
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // Retry the request. The browser will auto-attach the newly refreshed cookie.
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      // 2. Lock the refresh process
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh
        // The browser automatically sends the httpOnly refresh token cookie here
        await axios.post(
          'http://localhost:5000/auth/refresh', // Your backend refresh URL
          {}, 
          { withCredentials: true } 
        );

        // At this point, the backend has responded with a new Set-Cookie header.
        // The browser has saved it. We just need to process the queue and retry.

        // Process all the queued requests
        processQueue(null);

        // Resume the original request that failed
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Refresh token is expired or invalid (User's session is completely dead)
        processQueue(refreshError);
        
        // Redirect to login smoothly
        
        return Promise.reject(refreshError);
      } finally {
        // Always unlock the refresh process when done
        isRefreshing = false;
      }
    }

    // Pass down any other errors (like 500, 404) to the component
    return Promise.reject(error);
  }
);

export default axiosInstance;