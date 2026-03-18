import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  show(message: string, type: Notification['type'] = 'info', duration = 5000): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      duration,
    };
    this.notificationSubject.next(notification);
  }

  showSuccess(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  showError(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  showWarning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  showInfo(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
