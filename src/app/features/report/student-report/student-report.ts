import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-report.html',
  styleUrls: ['./student-report.scss'],
})
export class StudentReportComponent {
  fromDate: string = '';
  toDate: string = '';
  loading = false;
  reportData: any[] = [];

  generateReport() {
    if (!this.fromDate || !this.toDate) return;

    this.loading = true;
    this.reportData = [];

    setTimeout(() => {
      this.loading = false;
      // Simulate fetched report
      this.reportData = [
        { studentId: 1, name: 'John Doe', score: 88 },
        { studentId: 2, name: 'Jane Smith', score: 92 },
      ];
    }, 1500);
  }
}
