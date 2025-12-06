export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
  books?: Book[];
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  publishedDate?: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  authorId: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  borrowedBooks?: BorrowedBook[];
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  userId: string;
  borrowedDate: string;
  dueDate: string;
  returnedDate?: string;
  book: Book;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface CreateAuthorRequest {
  name: string;
  bio?: string;
  birthDate?: string;
}

export interface UpdateAuthorRequest {
  name?: string;
  bio?: string;
  birthDate?: string;
}

export interface CreateBookRequest {
  title: string;
  isbn: string;
  publishedDate?: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  authorId: string;
}

export interface UpdateBookRequest {
  title?: string;
  isbn?: string;
  publishedDate?: string;
  description?: string;
  totalCopies?: number;
  availableCopies?: number;
  authorId?: string;
}

export interface BorrowBookRequest {
  bookId: string;
  userId: string;
}

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type BooksStackParamList = {
  BooksList: undefined;
  BookDetail: { id: string };
  CreateBook: undefined;
  EditBook: { id: string };
  BorrowBook: { bookId: string };
};

export type AuthorsStackParamList = {
  AuthorsList: undefined;
  AuthorDetail: { id: string };
  CreateAuthor: undefined;
  EditAuthor: { id: string };
};

export type BorrowedStackParamList = {
  BorrowedList: undefined;
};

export type UsersStackParamList = {
  UsersList: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Books: undefined;
  BookDetail: { id: string };
  CreateBook: undefined;
  EditBook: { id: string };
  Authors: undefined;
  AuthorDetail: { id: string };
  CreateAuthor: undefined;
  EditAuthor: { id: string };
  Users: undefined;
  BorrowedBooks: undefined;
  BorrowBook: { bookId: string };
};