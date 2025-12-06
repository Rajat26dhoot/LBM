import axios from './axios';
import { BorrowedBook, BorrowBookRequest } from '../types';

export const borrowedBooksApi = {
  borrow: async (data: BorrowBookRequest): Promise<BorrowedBook> => {
    const response = await axios.post('/borrowed-books/borrow', data);
    return response.data;
  },

  return: async (id: string): Promise<BorrowedBook> => {
    const response = await axios.patch(`/borrowed-books/${id}/return`);
    return response.data;
  },

  getByUser: async (userId: string): Promise<BorrowedBook[]> => {
    const response = await axios.get(`/borrowed-books/user/${userId}`);
    return response.data;
  },

  getAll: async (): Promise<BorrowedBook[]> => {
    const response = await axios.get('/borrowed-books');
    return response.data;
  },
};