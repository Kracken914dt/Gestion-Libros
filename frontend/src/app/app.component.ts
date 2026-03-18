import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-notification></app-notification>
    <app-confirm-dialog></app-confirm-dialog>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }
    `,
  ],
})
export class AppComponent {
  title = 'Book Management';
}
