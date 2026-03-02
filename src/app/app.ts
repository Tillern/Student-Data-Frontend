import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="main-wrapper">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .main-wrapper {
        background: #f5f7fa;
        min-height: 100vh;
        padding: 40px;
      }
    `,
  ],
})
export class AppComponent {}
