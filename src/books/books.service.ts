import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
// import { PrismaService } from 'src/shared/services/prisma.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book, User } from "@prisma/client";

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

  public async getAll(): Promise<User[]> {
    return this.prismaService.user.findMany({
      include: {
        books: {
          include: {
            book: true,
          },
        },
      },
    });
  }

  public getById(id: Book['id']): Promise<Book | null> {
    return this.prismaService.book.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  public async create(
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    const { authorId, ...otherData } = bookData;
    try {
      return await this.prismaService.book.create({
        data: {
          ...otherData,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Title is already taken');
      if (error.code === 'P2025') {
        throw new BadRequestException("Author doesn't exist");
      }
      throw error;
    }
  }

  public async updateById(
    id: Book['id'],
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    const { authorId, ...otherData } = bookData;
    try {
      return await this.prismaService.book.update({
        where: { id },
        data: {
          ...otherData,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Title is already taken');
      if (error.code === 'P2025') {
        throw new BadRequestException("Author doesn't exist");
      }
      throw error;
    }
  }

  public async like(bookId: Book["id"], userId: string): Promise<Book> {
    try {
      return await this.prismaService.book.update({
        where: { id: bookId },
        data: {
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('You already liked this book');
      if (error.code === 'P2025') {
        throw new BadRequestException("Book doesn't exist");
      }
      throw error;
    }
  }

  public deleteById(id: Book['id']): Promise<Book> {
    return this.prismaService.book.delete({
      where: { id },
    });
  }
}