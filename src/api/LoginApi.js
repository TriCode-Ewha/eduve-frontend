import axiosInstance from './axiosInstance';

export const login = ({ username, password }) =>
  axiosInstance.post('/login', { username, password });