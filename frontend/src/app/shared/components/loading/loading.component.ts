import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="flex flex-col items-center justify-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
      ></div>
      <p class="mt-4 text-sm text-gray-600">Loading...</p>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class LoadingComponent {}
