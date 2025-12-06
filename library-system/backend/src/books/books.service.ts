import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  private parseDateOrThrow(dateStr?: string): Date | undefined {
    if (!dateStr) return undefined;
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      throw new BadRequestException('Invalid date format. Use ISO date (e.g. 1977-01-28).');
    }
    return parsed;
  }

  async create(createBookDto: CreateBookDto) {
    // Verify author exists
    const author = await this.prisma.author.findUnique({
      where: { id: createBookDto.authorId },
    });

    if (!author) {
      throw new BadRequestException('Author not found');
    }

    // Prepare data and convert publishedDate -> Date if provided
    const data: any = { ...createBookDto };
    if (createBookDto.publishedDate) {
      data.publishedDate = this.parseDateOrThrow(createBookDto.publishedDate);
    }

    return this.prisma.book.create({
      data,
      include: {
        author: true,
      },
    });
  }

  async findAll(filterDto?: FilterBooksDto) {
    const where: any = {};

    if (filterDto?.authorId) {
      where.authorId = filterDto.authorId;
    }

    if (filterDto?.available !== undefined) {
      if (filterDto.available) {
        where.availableCopies = { gt: 0 };
      } else {
        where.availableCopies = 0;
      }
    }

    if (filterDto?.search) {
      where.OR = [
        { title: { contains: filterDto.search, mode: 'insensitive' } },
        { description: { contains: filterDto.search, mode: 'insensitive' } },
        { isbn: { contains: filterDto.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.book.findMany({
      where,
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        borrowedBooks: {
          where: {
            returnedDate: null,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    if (updateBookDto.authorId) {
      const author = await this.prisma.author.findUnique({
        where: { id: updateBookDto.authorId },
      });

      if (!author) {
        throw new BadRequestException('Author not found');
      }
    }

    // Prepare data and convert publishedDate -> Date if provided
    const data: any = { ...updateBookDto };
    if (updateBookDto.publishedDate) {
      data.publishedDate = this.parseDateOrThrow(updateBookDto.publishedDate);
    }

    try {
      return await this.prisma.book.update({
        where: { id },
        data,
        include: {
          author: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Book not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.book.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Book not found');
    }
  }
}
