// src/api/chatApi.js
import axios from 'axios';

const BASE_URL = 'http://15.165.205.11:8080';

// ✅ 인증 헤더 생성 함수 재사용
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// ✅ 채팅 질문 입력 API
export const sendChatQuestion = async (userId, question) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/chat/start/${userId}`,
      { question },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('채팅 질문 실패:', error);
    throw error;
  }
};
