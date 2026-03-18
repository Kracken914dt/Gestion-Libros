import { Book } from './books.model';
import {
  IBook,
  BookFilters,
  PaginatedBooksResult,
  CreateBookInput,
  UpdateBookInput,
} from './books.types';
import { AppError } from '../../middlewares/errorHandler';

export class BookService {
  async createBook(data: CreateBookInput): Promise<IBook> {
    try {
      const book = await Book.create(data);
      return book.toJSON() as IBook;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError(409, 'A book with this ISBN already exists');
      }
      throw error;
    }
  }

  async getBooks(filters: BookFilters): Promise<PaginatedBooksResult> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (filters.genre) {
      query.genre = { $regex: filters.genre, $options: 'i' };
    }

    if (filters.isAvailable !== undefined) {
      query.isAvailable = filters.isAvailable;
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { author: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const [books, total] = await Promise.all([
      Book.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Book.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      books: books as IBook[],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getBookById(id: string): Promise<IBook> {
    const book = await Book.findById(id).lean().exec();

    if (!book) {
      throw new AppError(404, 'Book not found');
    }

    return book as IBook;
  }

  async updateBook(id: string, data: UpdateBookInput): Promise<IBook> {
    try {
      const book = await Book.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      )
        .lean()
        .exec();

      if (!book) {
        throw new AppError(404, 'Book not found');
      }

      return book as IBook;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError(409, 'A book with this ISBN already exists');
      }
      throw error;
    }
  }

  async deleteBook(id: string): Promise<void> {
    const result = await Book.findByIdAndDelete(id).exec();

    if (!result) {
      throw new AppError(404, 'Book not found');
    }
  }

  async searchBooks(query: string): Promise<IBook[]> {
    const books = await Book.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .lean()
      .exec();

    return books as IBook[];
  }
}

export const bookService = new BookService();
