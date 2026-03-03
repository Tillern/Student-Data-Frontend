import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-csv',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    HttpClientModule,
  ],
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss'],
})
export class UploadCsvComponent {
  selectedFile: File | null = null;
  isProcessing = false;
  jobId: string | null = null;
  pollingSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      this.selectedFile = file;
    } else {
      Swal.fire('Invalid file', 'Please select a valid .xlsx file', 'error');
    }
  }

  uploadExcel() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.isProcessing = true;

    // Show SweetAlert with initial 0%
    Swal.fire({
      title: 'Processing Excel to CSV...',
      html: '<b>0%</b> completed',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    this.http
      .post('http://localhost:8080/api/csv/upload', formData, { responseType: 'text' })
      .subscribe({
        next: (res: any) => {
          const match = res.match(/Job ID: (\S+)/);
          if (match) {
            this.jobId = match[1];
            this.startPolling();
          } else {
            this.isProcessing = false;
            Swal.fire('Error', 'Job ID not returned from server', 'error');
          }
        },
        error: (err) => {
          console.error('Upload error', err);
          this.isProcessing = false;
          Swal.fire('Error', 'Failed to start CSV processing', 'error');
        },
      });
  }

  startPolling() {
    if (!this.jobId) return;

    this.pollingSubscription = interval(500).subscribe(() => {
      this.http.get<any>(`http://localhost:8080/api/excel/job/${this.jobId}`).subscribe({
        next: (job) => {
          this.ngZone.run(() => {
            // Update SweetAlert percentage live
            const progressElement = Swal.getHtmlContainer()?.querySelector('b');

            if (progressElement) {
              const processed = job.processedRecords?.toLocaleString() ?? 0;

              if (job.totalRecords && job.totalRecords > 0) {
                const total = job.totalRecords.toLocaleString();
                progressElement.textContent = `${processed} / ${total} records processed`;
              } else {
                progressElement.textContent = `${processed} records processed`;
              }
            }

            // Completed
            if (job.status === 'COMPLETED') {
              if (this.pollingSubscription) this.pollingSubscription.unsubscribe();

              const started = job.startedAt ? new Date(job.startedAt).getTime() : null;
              const completed = job.completedAt ? new Date(job.completedAt).getTime() : null;
              const durationSec =
                started && completed ? ((completed - started) / 1000).toFixed(2) : null;

              Swal.fire({
                icon: 'success',
                title: 'CSV Processing Completed',
                html: `File saved on backend.<br>
                       Total records processed: ${job.totalRecords}<br>
                       ${durationSec ? `Time taken: ${durationSec} seconds` : ''}`,
                confirmButtonText: 'OK',
              }).then(() => this.resetUI());
            }

            // Failed
            if (job.status === 'FAILED') {
              if (this.pollingSubscription) this.pollingSubscription.unsubscribe();

              Swal.fire('Failed', `CSV processing failed: ${job.message}`, 'error').then(() =>
                this.resetUI(),
              );
            }
          });
        },
        error: (err) => console.error('Error polling CSV job', err),
      });
    });
  }

  resetUI() {
    this.isProcessing = false;
    this.selectedFile = null;
    this.jobId = null;
  }
}
