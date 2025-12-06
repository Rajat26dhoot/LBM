import axios from './axios';
import { LoginRequest, LoginResponse } from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post('/auth/login', data);
    return response.data;
  },
};