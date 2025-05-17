import axios from "axios";

// 기본 axios 인스턴스 만들기
const axiosInstance = axios.create({
  baseURL: "http://15.165.205.11:8080", // API 주소
});

// 요청마다 토큰 붙이기
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Ensure token has Bearer prefix
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    if (!config.headers['Content-Type'] && !config.headers['content-type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    console.log('[Request]', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;