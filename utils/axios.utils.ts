import axios from 'axios';

export const instance = () => {
  const data = axios.create({
    baseURL: 'http://121.200.52.133:8000/api/',
  });

  data.interceptors.request.use(async function (config) {
    const accessToken = localStorage.getItem('crmToken');
    if (accessToken) {
      config.headers['authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  });

  return data;
};

export default instance;
