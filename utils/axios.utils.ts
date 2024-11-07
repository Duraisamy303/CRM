import axios from 'axios';

export const instance = () => {
  const data = axios.create({
    // baseURL: Functions.getBaseURL() + '/api/v1/',
    baseURL: 'http://121.200.52.133:8000/lead/',
    // baseURL: 'https://hdd.augmo.io/api/v1'
  });

  data.interceptors.request.use(async function (config) {
    const accessToken = localStorage.getItem('crmToken');
    if (accessToken) {
      config.headers['authorization'] = `Bearer ${accessToken}`; // Correct Bearer token format
    }
    return config;
  });

  return data;
};

export default instance;
