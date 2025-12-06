import axios from './axios';
import { User, CreateUserRequest } from '../types';

export const usersApi = {
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await axios.post('/users', data);
    return response.data;
  },

  getAll: async (): Promise<User[]> => {
    const response = await axios.get('/users');
    return response.data;
  },
};