import { Request, Response, NextFunction } from 'express';
import { bookService } from './books.service';
import { createResponse } from '../../utils/response';
import { BookFilters, CreateBookInput, UpdateBookInput } from './books.types';

export class BookController {
  async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const book = await bookService.createBook(req.body as CreateBookInput);
      res.status(201).json(createResponse(book, 'Book created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawIsAvailable = req.query.isAvailable;
      const normalizedIsAvailable = Array.isArray(rawIsAvailable)
        ? rawIsAvailable[0]
        : rawIsAvailable;

      const filters: BookFilters = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        genre: req.query.genre as string,
        search: req.query.search as string,
        isAvailable:
          normalizedIsAvailable !== undefined
            ? String(normalizedIsAvailable).toLowerCase() === "true"
            : undefined,
      };

      const result = await bookService.getBooks(filters);

      res.status(200).json(
        createResponse(result.books, undefined, {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async getBookById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const book = await bookService.getBookById(req.params.id);
      res.status(200).json(createResponse(book));
    } catch (error) {
      next(error);
    }
  }

  async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const book = await bookService.updateBook(req.params.id, req.body as UpdateBookInput);
      res.status(200).json(createResponse(book, 'Book updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await bookService.deleteBook(req.params.id);
      res.status(200).json(createResponse(null, 'Book deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async searchBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.q as string;
      if (!query) {
        res.status(400).json({ success: false, message: 'Search query is required' });
        return;
      }
      const books = await bookService.searchBooks(query);
      res.status(200).json(createResponse(books));
    } catch (error) {
      next(error);
    }
  }
}

export const bookController = new BookController();
