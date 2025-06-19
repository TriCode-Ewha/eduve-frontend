// src/api/TeacherSignupApi.js
// src/api/StudentSignupApi.js
import axios from "axios";

const BASE_URL = "https://api.eduve.r-e.kr";

// 선생님 회원가입
export const signupTeacher = async (signupData) => {
  try {
    const response = await axios.post(`${BASE_URL}/join/teacher`, signupData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 학생생 회원가입
export const signupStudent = async (signupData) => {
  try {
    const response = await axios.post(`${BASE_URL}/join/student`, signupData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 아이디 중복 확인
export const checkUsername = async (username) => {
  try {
    const response = await axios.get(`${BASE_URL}/join/check-username`, {
      params: { username }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 이메일 중복 확인
export const checkEmail = async (email) => {
  try {
    const response = await axios.get(`${BASE_URL}/join/check-email`, {
      params: { email }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};