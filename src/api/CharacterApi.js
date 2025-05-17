import axiosInstance from './axiosInstance';

// 캐릭터 정보 가져오기
export const fetchUserCharacter = async (userId) => {
  try {
    const response = await axiosInstance.get(`/userCharacter/${userId}`);
    return response.data;
  } catch (error) {
    console.error("fetchUserCharacter error:", error.response);
    return null;
  }
};

// 캐릭터 정보 업데이트
export const updateUserCharacter = async (userId, characterData) => {
  try {
    const response = await axiosInstance.patch(`/userCharacter/${userId}`, characterData);
    return response.data;
  } catch (error) {
    console.error("updateUserCharacter error:", error.response?.data || error.message);
    throw error;
  }
};
