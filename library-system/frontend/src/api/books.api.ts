import axios from './axios';
import { Book, CreateBookRequest, UpdateBookRequest } from '../types';

export const booksApi = {
  create: async (data: CreateBookRequest): Promise<Book> => {
    const response = await axios.post('/books', data);
    return response.data;
  },

  getAll: async (params?: {
    authorId?: string;
    available?: boolean;
    search?: string;
  }): Promise<Book[]> => {
    const response = await axios.get('/books', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Book> => {
    const response = await axios.get(`/books/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateBookRequest): Promise<Book> => {
    const response = await axios.patch(`/books/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/books/${id}`);
  },
};