// src/api/fileApi.js

import axiosInstance from './axiosInstance';

/**
 * 파일 업로드 (FormData + multipart/form-data)
 * @param {FormData} formData
 */
export const uploadFile = formData =>
  axiosInstance.post(
    '/resources/file/text',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );

/**
 * 파일 조회
 * @param {string|number} fileId
 */
export const fetchFile = fileId =>
  axiosInstance.get(`/resources/file/${fileId}`);

/**
 * 파일 이름 변경
 * @param {string|number} fileId
 * @param {string} newName
 */
export const renameFile = (fileId, newName) =>
  axiosInstance.patch(
    `/resources/file/${fileId}/rename`,
    { newName }
  );

/**
 * 파일 이동
 * @param {string|number} fileId
 * @param {string|number} folderId
 */
export const moveFile = (fileId, newFolderId) =>
  axiosInstance.patch(
    `/resources/file/${fileId}/move`,
    { newFolderId }
  );

/**
 * 파일 삭제
 * @param {string|number} fileId
 */
export const deleteFile = fileId =>
  axiosInstance.delete(`/resources/file/${fileId}`);

/**
 * 파일 키워드 검색
 * @param {string} keyword
 */
export const searchFiles = keyword =>
  axiosInstance.get('/resources/file/search', {
    params: { keyword }
  });

/**
 * 새 폴더 생성
 * @param {{ folderName: string, userId: number|string, parentId?: number|string|null }} data
 */
export const createFolder = ({ folderName, userId, parentId = null }) =>
  axiosInstance.post(
    `/folders?folderName=${encodeURIComponent(folderName)}&userId=${userId}` +
    (parentId !== null ? `&parentId=${parentId}` : '')
  );

/**
 * 특정 사용자의 최상위(루트) 폴더 목록 조회 + 정렬
 * GET /folders/user/{userId}?sort=latest 또는 ?sort=name
 */
export const fetchUserFolders = (userId, sort = null) => {
  const query = sort ? `?sort=${encodeURIComponent(sort)}` : '';
  return axiosInstance.get(`/folders/user/${userId}${query}`);
};

/**
 * 특정 폴더의 하위 폴더 및 파일 조회 + 정렬
 * GET /folders/user/{userId}/folder/{folderId}?sort=latest 또는 ?sort=name
 */
export const fetchFolderContents = (userId, folderId, sort = null) => {
  const query = sort ? `?sort=${encodeURIComponent(sort)}` : '';
  if (folderId == null) {
    // parentId 없이 최상위(홈) 경로 조회
    return axiosInstance.get(`/folders/user/${userId}${query}`);
  } else {
    // 특정 하위 폴더를 지정해서 조회
    return axiosInstance.get(`/folders/user/${userId}/folder/${folderId}${query}`);
  }
};


/**
 * 폴더 이름 변경
 * PATCH /folders/{folderId}?newFolderName={name}
 */
export const renameFolder = (folderId, newFolderName, userId) =>
  axiosInstance.patch(`/folders/${folderId}?newFolderName=${encodeURIComponent(newFolderName)}&userId=${userId}`);

/**
 * 폴더 이동
 * PUT /folders/{folderId}/path?newParentFolderId={id}&userId={userId}
 */
export const moveFolder = (folderId, newParentFolderId, userId) =>
  axiosInstance.patch(
    `/folders/${folderId}/path?newParentFolderId=${newParentFolderId}&userId=${userId}`
  );

/**
 * 폴더 삭제
 * DELETE /folders/{folderId}
 */
export const deleteFolder = (folderId) =>
  axiosInstance.delete(`/folders/${folderId}`);