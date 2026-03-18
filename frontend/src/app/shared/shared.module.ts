import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [LoadingComponent, NotificationComponent, ConfirmDialogComponent],
  imports: [CommonModule],
  exports: [LoadingComponent, NotificationComponent, ConfirmDialogComponent],
})
export class SharedModule {}
