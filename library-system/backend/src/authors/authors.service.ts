import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const data: any = {
      ...createAuthorDto,
    };

    // Convert string birthDate → Date (Option A)
    if (createAuthorDto.birthDate) {
      data.birthDate = new Date(createAuthorDto.birthDate);
    }

    return this.prisma.author.create({ data });
  }

  async findAll() {
    return this.prisma.author.findMany({
      include: {
        books: true,
      },
    });
  }

  async findOne(id: string) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const data: any = {
      ...updateAuthorDto,
    };

    // Convert string birthDate → Date if provided
    if (updateAuthorDto.birthDate) {
      data.birthDate = new Date(updateAuthorDto.birthDate);
    }

    try {
      return await this.prisma.author.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException('Author not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.author.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Author not found');
    }
  }
}
