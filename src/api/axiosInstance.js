// src/api/axiosInstance.js
import axios from 'axios';

console.log('🌐 [DEBUG] REACT_APP_API_URL =', process.env.REACT_APP_API_URL);

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 50000,
  withCredentials: true,
});

// 요청 인터셉터: 요청 로그 출력 + 토큰 헤더 처리
axiosInstance.interceptors.request.use(
  config => {
    console.log('🌐 [Request]', config.method.toUpperCase(), config.url);

    // localStorage에 저장된 토큰에서 "Bearer " 접두사 제거 후 재조립
    const raw = localStorage.getItem('token') || '';
    const token = raw.replace(/^Bearer\s+/i, '').trim();

    if (token) {
      // Ensure token has Bearer prefix
      config.headers.Authorization = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;
    } else {
      console.warn('❌ No token found in localStorage');
    }

    // Content-Type이 설정되지 않았다면 JSON으로
    if (!config.headers['Content-Type'] && !config.headers['content-type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    // 로그: 헤더 / 바디 데이터
    console.log('🌐 [Request Headers]', config.headers);
    console.log('🌐 [Request Data]', config.data);

    return config;
  },
  error => {
    console.error('🌐 [Request Error]', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 응답 로그 출력 + 에러 처리
axiosInstance.interceptors.response.use(
  response => {
    console.log('🌐 [Response]', response.status, response.config.url);
    console.log('🌐 [Response Data]', response.data);
    return response;
  },
  error => {
    if (error.response) {
      console.error(
        '🌐 [Response Error]',
        error.response.status,
        error.response.config.url
      );
      console.error('🌐 [Error Data]', error.response.data);
    } else {
      console.error('🌐 [Network/Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
