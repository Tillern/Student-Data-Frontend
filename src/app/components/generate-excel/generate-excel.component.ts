import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { ExcelService } from '../../services/excel.service';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-generate-excel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    HttpClientModule,
  ],
  templateUrl: './generate-excel.component.html',
  styleUrls: ['./generate-excel.component.scss'],
})
export class GenerateExcelComponent {
  numberOfRecords: number = 1000;
  job: Job | null = null;
  isGenerating: boolean = false;
  pollingSubscription: Subscription | null = null;

  constructor(
    private excelService: ExcelService,
    private ngZone: NgZone,
  ) {}

  generateExcel() {
    if (!this.numberOfRecords || this.numberOfRecords <= 0) return;

    this.isGenerating = true;

    Swal.fire({
      title: 'Generating Excel...',
      html: '<b>0%</b> completed',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    this.excelService.generateExcel(this.numberOfRecords).subscribe({
      next: (job) => {
        this.job = job;
        this.startPolling();
      },
      error: (err) => {
        console.error('Error starting Excel generation', err);
        this.isGenerating = false;
        Swal.fire('Error', 'Failed to start Excel generation', 'error');
      },
    });
  }

  startPolling() {
    if (!this.job) return;
    const jobId = this.job.id;

    this.pollingSubscription = interval(1000).subscribe(() => {
      this.excelService.getJobStatus(jobId).subscribe({
        next: (updatedJob) => {
          this.job = updatedJob;

          // Update SweetAlert progress
          const b = Swal.getHtmlContainer()?.querySelector('b');
          if (b)
            b.textContent =
              updatedJob.totalRecords > 0
                ? Math.floor((updatedJob.processedRecords / updatedJob.totalRecords) * 100) + '%'
                : '0%';

          if (updatedJob.status === 'COMPLETED') {
            if (this.pollingSubscription) this.pollingSubscription.unsubscribe();

            const started = updatedJob.startedAt ? new Date(updatedJob.startedAt).getTime() : null;
            const completed = updatedJob.completedAt
              ? new Date(updatedJob.completedAt).getTime()
              : null;
            const durationSec =
              started && completed ? ((completed - started) / 1000).toFixed(2) : null;

            Swal.fire({
              icon: 'success',
              title: 'Excel Generation Completed',
              html: `
                File saved on backend.<br>
                Total records: ${updatedJob.totalRecords}<br>
                ${durationSec ? `Time taken: ${durationSec} seconds` : ''}
              `,
              confirmButtonText: 'OK',
            }).then(() => {
              // Use NgZone to ensure Angular refreshes UI
              this.ngZone.run(() => {
                this.resetUI();
              });
            });
          }

          if (updatedJob.status === 'FAILED') {
            if (this.pollingSubscription) this.pollingSubscription.unsubscribe();

            Swal.fire('Failed', `Excel generation failed: ${updatedJob.message}`, 'error').then(
              () => {
                this.ngZone.run(() => this.resetUI());
              },
            );
          }
        },
        error: (err) => console.error('Error polling job', err),
      });
    });
  }

  resetUI() {
    this.job = null;
    this.isGenerating = false;
  }
}
