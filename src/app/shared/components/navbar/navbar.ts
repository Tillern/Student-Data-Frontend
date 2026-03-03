import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <a class="navbar-brand" routerLink="/">StudentMgmt</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" routerLink="/students">Students</a></li>
          <li class="nav-item"><a class="nav-link" routerLink="/data-generation">Generate</a></li>
          <li class="nav-item"><a class="nav-link" routerLink="/data-processing">Process</a></li>
          <li class="nav-item"><a class="nav-link" routerLink="/data-upload">Upload</a></li>
          <li class="nav-item"><a class="nav-link" routerLink="/report">Reports</a></li>
        </ul>
      </div>
    </nav>
  `,
  styles: [
    `
      .navbar {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
      .nav-link {
        font-weight: 500;
      }
      .nav-link:hover {
        color: #ffeb3b;
        transition: 0.3s;
      }
    `,
  ],
})
export class NavbarComponent {}
