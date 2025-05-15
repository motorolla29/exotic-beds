/* eslint-disable eqeqeq */
import axios from 'axios';

const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const $authHost = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
});

const authInterceptor = (config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
  config.headers['deviceId'] =
    localStorage.getItem('deviceId') || 'unknown_device';
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

$authHost.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user/refresh`,
          {
            withCredentials: true,
            headers: {
              deviceId: localStorage.getItem('deviceId') || 'unknown_device',
            },
          }
        );
        localStorage.setItem('token', response.data.accessToken);
        return $authHost.request(originalRequest);
      } catch (e) {
        console.log('Unauthorized');
      }
    }
    throw error;
  }
);

export { $host, $authHost };
