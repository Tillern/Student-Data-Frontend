import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './process.html',
  styleUrls: ['./process.scss'],
})
export class ProcessComponent {
  batchSize: number = 50;
  loading = false;
  result: string = '';

  processData() {
    if (this.batchSize <= 0) return;

    this.loading = true;
    this.result = '';

    setTimeout(() => {
      this.loading = false;
      this.result = `Processed batch of ${this.batchSize} records ✅`;
    }, 1500);
  }
}
