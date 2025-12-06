import axios from './axios';
import { Author, CreateAuthorRequest, UpdateAuthorRequest } from '../types';

export const authorsApi = {
  create: async (data: CreateAuthorRequest): Promise<Author> => {
    const response = await axios.post('/authors', data);
    return response.data;
  },

  getAll: async (): Promise<Author[]> => {
    const response = await axios.get('/authors');
    return response.data;
  },

  getById: async (id: string): Promise<Author> => {
    const response = await axios.get(`/authors/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateAuthorRequest): Promise<Author> => {
    const response = await axios.patch(`/authors/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/authors/${id}`);
  },
};