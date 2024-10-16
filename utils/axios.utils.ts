import axios from 'axios';

// let token = localStorage.getItem("token")
// export const instance = () => {
//   const data = axios.create({
//   baseURL: Functions.getBaseURL()+"/api/v1/",
//     headers: {
//         "authorization" :token
//   }
// })
// return data
// }

export const instance = () => {
  const data = axios.create({
    // baseURL: Functions.getBaseURL() + '/api/v1/',
    baseURL: 'http://192.168.0.113:8001/api/v1',
    // baseURL: 'https://hdd.augmo.io/api/v1'


  });
  data.interceptors.request.use(async function (config) {
    const accessToken =  localStorage.getItem('token');
    config.headers['authorization'] = accessToken;
    return config;
  });
  return data;
};

export default instance;
