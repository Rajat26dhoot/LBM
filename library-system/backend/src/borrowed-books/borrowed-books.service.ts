import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BorrowBookDto } from './dto/borrow-book.dto';

@Injectable()
export class BorrowedBooksService {
  constructor(private prisma: PrismaService) {}

  async borrowBook(borrowBookDto: BorrowBookDto) {
    // Verify book exists and is available
    const book = await this.prisma.book.findUnique({
      where: { id: borrowBookDto.bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.availableCopies <= 0) {
      throw new BadRequestException('Book is not available for borrowing');
    }

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: borrowBookDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has this book borrowed
    const existingBorrow = await this.prisma.borrowedBook.findFirst({
      where: {
        bookId: borrowBookDto.bookId,
        userId: borrowBookDto.userId,
        returnedDate: null,
      },
    });

    if (existingBorrow) {
      throw new BadRequestException('User has already borrowed this book');
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Create borrowed book record and update available copies
    const [borrowedBook] = await this.prisma.$transaction([
      this.prisma.borrowedBook.create({
        data: {
          bookId: borrowBookDto.bookId,
          userId: borrowBookDto.userId,
          dueDate,
        },
        include: {
          book: {
            include: {
              author: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.book.update({
        where: { id: borrowBookDto.bookId },
        data: {
          availableCopies: {
            decrement: 1,
          },
        },
      }),
    ]);

    return borrowedBook;
  }

  async returnBook(id: string) {
    const borrowedBook = await this.prisma.borrowedBook.findUnique({
      where: { id },
    });

    if (!borrowedBook) {
      throw new NotFoundException('Borrowed book record not found');
    }

    if (borrowedBook.returnedDate) {
      throw new BadRequestException('Book has already been returned');
    }

    // Update borrowed book and increment available copies
    const [returned] = await this.prisma.$transaction([
      this.prisma.borrowedBook.update({
        where: { id },
        data: {
          returnedDate: new Date(),
        },
        include: {
          book: {
            include: {
              author: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.book.update({
        where: { id: borrowedBook.bookId },
        data: {
          availableCopies: {
            increment: 1,
          },
        },
      }),
    ]);

    return returned;
  }

  async findByUser(userId: string) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.borrowedBook.findMany({
      where: {
        userId,
      },
      include: {
        book: {
          include: {
            author: true,
          },
        },
      },
      orderBy: {
        borrowedDate: 'desc',
      },
    });
  }

  async findAll() {
    return this.prisma.borrowedBook.findMany({
      include: {
        book: {
          include: {
            author: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        borrowedDate: 'desc',
      },
    });
  }
}