import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generate.html',
  styleUrls: ['./generate.scss'],
})
export class GenerateComponent {
  totalRecords: number = 100;
  loading = false;
  message: string = '';

  generateData() {
    if (this.totalRecords <= 0) return;

    this.loading = true;
    this.message = '';

    setTimeout(() => {
      // Simulate API call
      this.loading = false;
      this.message = `Successfully generated ${this.totalRecords} records! 🎉`;
    }, 1500);
  }
}
