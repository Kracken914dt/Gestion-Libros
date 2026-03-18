import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface ConfirmDialogResult {
  confirmed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private dialogSubject = new Subject<ConfirmDialogOptions | null>();
  private resultSubject = new Subject<boolean>();

  dialog$ = this.dialogSubject.asObservable();

  confirm(options: ConfirmDialogOptions): Observable<boolean> {
    this.dialogSubject.next(options);
    return new Observable<boolean>((subscriber) => {
      const subscription = this.resultSubject.subscribe((result) => {
        subscriber.next(result);
        subscriber.complete();
        this.dialogSubject.next(null);
      });
      return () => subscription.unsubscribe();
    });
  }

  respond(confirmed: boolean): void {
    this.resultSubject.next(confirmed);
  }
}
