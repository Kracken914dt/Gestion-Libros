import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Book } from '../../../../core/models/book.model';
import { BookService } from '../../../../core/services/book.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { ConfirmDialogService } from '../../../../shared/components/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private notificationService: NotificationService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBook(id);
    } else {
      this.router.navigate(['/books']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBook(id: string): void {
    this.loading = true;
    this.bookService
      .getBookById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (book) => {
          this.book = book;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/books']);
        },
      });
  }

  onEdit(): void {
    if (this.book?._id) {
      this.router.navigate(['/books', this.book._id, 'edit']);
    }
  }

  onDelete(): void {
    if (!this.book?._id) return;

    this.confirmDialogService
      .confirm({
        title: 'Delete Book',
        message: `Are you sure you want to delete "${this.book.title}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deleteBook(this.book!._id!);
        }
      });
  }

  private deleteBook(id: string): void {
    this.bookService
      .deleteBook(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Book deleted successfully');
          this.router.navigate(['/books']);
        },
      });
  }

  onBack(): void {
    this.router.navigate(['/books']);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
