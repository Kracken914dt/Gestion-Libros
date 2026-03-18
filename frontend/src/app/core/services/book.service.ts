import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Book, BookFilters, PaginatedResponse } from '../models/book.model';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly apiUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  getBooks(filters: BookFilters): Observable<PaginatedResponse<Book>> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('limit', filters.limit.toString());

    if (filters.genre) {
      params = params.set('genre', filters.genre);
    }
    if (filters.isAvailable !== undefined) {
      params = params.set('isAvailable', filters.isAvailable.toString());
    }
    if (filters.search) {
      params = params.set('search', filters.search);
    }

    return this.http
      .get<ApiResponse<Book[]>>(this.apiUrl, { params })
      .pipe(
        map((response) => ({
          data: response.data,
          total: response.meta?.total || 0,
          page: response.meta?.page || 1,
          limit: response.meta?.limit || 10,
          totalPages: response.meta?.totalPages || 1,
        })),
        catchError(this.handleError)
      );
  }

  getBookById(id: string): Observable<Book> {
    return this.http
      .get<ApiResponse<Book>>(`${this.apiUrl}/${id}`)
      .pipe(
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  createBook(book: Omit<Book, '_id' | 'createdAt' | 'updatedAt'>): Observable<Book> {
    return this.http
      .post<ApiResponse<Book>>(this.apiUrl, book)
      .pipe(
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  updateBook(id: string, book: Partial<Book>): Observable<Book> {
    return this.http
      .put<ApiResponse<Book>>(`${this.apiUrl}/${id}`, book)
      .pipe(
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  deleteBook(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(() => undefined),
        catchError(this.handleError)
      );
  }

  searchBooks(query: string): Observable<Book[]> {
    const params = new HttpParams().set('q', query);
    return this.http
      .get<ApiResponse<Book[]>>(`${this.apiUrl}/search`, { params })
      .pipe(
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
