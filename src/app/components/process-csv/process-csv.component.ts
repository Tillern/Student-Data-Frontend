import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-process-csv',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
  ],
  templateUrl: './process-csv.component.html',
  styleUrls: ['./process-csv.component.scss'],
})
export class ProcessCsvComponent {
  selectedFile: File | null = null;
  isProcessing = false;
  jobId: string | null = null;
  pollingSubscription: Subscription | null = null;

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.csv')) this.selectedFile = file;
    else Swal.fire('Invalid file', 'Please select a valid .csv file', 'error');
  }

  uploadToDb() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.isProcessing = true;

    Swal.fire({
      title: 'Uploading CSV to Database...',
      html: '<b>0</b> records processed',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    this.http
      .post('http://localhost:8080/api/csv/upload-to-db', formData, { responseType: 'text' })
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
          Swal.fire('Error', 'Failed to start CSV DB upload', 'error');
        },
      });
  }

  startPolling() {
    if (!this.jobId) return;

    this.pollingSubscription = interval(500).subscribe(() => {
      this.http.get<any>(`http://localhost:8080/api/excel/job/${this.jobId}`).subscribe({
        next: (job) => {
          this.ngZone.run(() => {
            const b = Swal.getHtmlContainer()?.querySelector('b');
            if (b) {
              const processed = job.processedRecords?.toLocaleString() ?? 0;
              const total = job.totalRecords?.toLocaleString() ?? 0;
              b.textContent = `${processed} / ${total} records processed`;
            }

            if (job.status === 'COMPLETED') {
              if (this.pollingSubscription) this.pollingSubscription.unsubscribe();

              const durationSec =
                job.startedAt && job.completedAt
                  ? ((new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()) / 1000).toFixed(2)
                  : null;

              Swal.fire({
                icon: 'success',
                title: 'Database Upload Completed',
                html: `Total records inserted: ${job.totalRecords}<br>${
                  durationSec ? `Time taken: ${durationSec} seconds` : ''
                }`,
                confirmButtonText: 'OK',
              }).then(() => this.resetUI());
            }

            if (job.status === 'FAILED') {
              if (this.pollingSubscription) this.pollingSubscription.unsubscribe();
              Swal.fire('Failed', `DB upload failed: ${job.message}`, 'error').then(() =>
                this.resetUI(),
              );
            }
          });
        },
        error: (err) => console.error('Error polling DB job', err),
      });
    });
  }

  resetUI() {
    this.isProcessing = false;
    this.selectedFile = null;
    this.jobId = null;
  }
}
