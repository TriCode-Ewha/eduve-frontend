// src/api/fileApi.js

import axiosInstance from './axiosInstance';

/**
 * 파일 업로드 (FormData + multipart/form-data)
 * @param {FormData} formData
 */
export const uploadFile = formData =>
  // 파일만 직접 IP 서버로 요청
  axiosInstance.post(
    '/resources/file/text',
    formData,
    {
      // multipart/form-data 헤더는 인터셉터에서 건드리지 않도록
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
    { name: newName }
  );

/**
 * 파일 이동
 * @param {string|number} fileId
 * @param {string|number} folderId
 */
export const moveFile = (fileId, folderId) =>
  axiosInstance.patch(
    `/resources/file/${fileId}/move`,
    { folderId }
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
    `/folders?folderName=${encodeURIComponent(folderName)}&userId=${userId}${parentId !== null ? `&parentId=${parentId}` : ''}`
  );
