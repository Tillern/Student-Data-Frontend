import { Component, NgZone } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { interval, Subscription } from 'rxjs';

interface UploadedFile {
  name: string;
  type: 'csv' | 'excel';
  size: number;
  lastModified: number;
  fileObj?: File; // optional, used if user uploads manually
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    DecimalPipe,
    DatePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  uploadedFiles: UploadedFile[] = [];
  isProcessing = false;
  pollingSubscription: Subscription | null = null;
  jobId: string | null = null;

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  ngOnInit() {
    this.loadFiles(); // only list files, no processing
  }

  loadFiles() {
    this.http.get<UploadedFile[]>('http://localhost:8080/api/files').subscribe({
      next: (files) => {
        this.uploadedFiles = files;
      },
      error: (err) => console.error('Error loading files', err),
    });
  }

  // Convert Excel → CSV manually
  convertExcelToCsv(file: UploadedFile) {
    if (file.type !== 'excel') {
      Swal.fire('Invalid', 'Selected file is not Excel', 'error');
      return;
    }

    this.isProcessing = true;

    Swal.fire({
      title: `Converting ${file.name} to CSV...`,
      html: '<b>0%</b> completed',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    // send file download request from backend
    this.http
      .get(`http://localhost:8080/api/files/download/${file.name}`, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          const formData = new FormData();
          const newFile = new File([blob], file.name);
          formData.append('file', newFile);

          this.http.post('http://localhost:8080/api/csv/upload', formData, { responseType: 'text' }).subscribe({
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
              console.error('Excel conversion error', err);
              this.isProcessing = false;
              Swal.fire('Error', `Failed to convert ${file.name}`, 'error');
            },
          });
        },
        error: (err) => {
          console.error('Error fetching file', err);
          this.isProcessing = false;
          Swal.fire('Error', `Failed to fetch ${file.name} from server`, 'error');
        },
      });
  }

  // Upload CSV → DB manually
  uploadCsvToDb(file: UploadedFile) {
    if (file.type !== 'csv') {
      Swal.fire('Invalid', 'Selected file is not CSV', 'error');
      return;
    }

    this.isProcessing = true;

    Swal.fire({
      title: `Uploading ${file.name} to Database...`,
      html: '<b>0</b> records processed',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    this.http
      .get(`http://localhost:8080/api/files/download/${file.name}`, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          const formData = new FormData();
          const newFile = new File([blob], file.name);
          formData.append('file', newFile);

          this.http.post('http://localhost:8080/api/csv/upload-to-db', formData, { responseType: 'text' }).subscribe({
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
              console.error('CSV upload error', err);
              this.isProcessing = false;
              Swal.fire('Error', `Failed to upload ${file.name} to DB`, 'error');
            },
          });
        },
        error: (err) => {
          console.error('Error fetching file', err);
          this.isProcessing = false;
          Swal.fire('Error', `Failed to fetch ${file.name} from server`, 'error');
        },
      });
  }

  startPolling() {
    if (!this.jobId) return;

    this.pollingSubscription = interval(500).subscribe(() => {
      this.http.get<any>(`http://localhost:8080/api/excel/job/${this.jobId}`).subscribe({
        next: (job) => {
          this.ngZone.run(() => {
            const progressElement = Swal.getHtmlContainer()?.querySelector('b');
            if (progressElement) {
              const processed = job.processedRecords?.toLocaleString() ?? 0;
              const total = job.totalRecords?.toLocaleString() ?? 0;
              progressElement.textContent = total
                ? `${processed} / ${total} records processed`
                : `${processed} records processed`;
            }

            if (job.status === 'COMPLETED') {
              if (this.pollingSubscription) this.pollingSubscription.unsubscribe();
              this.isProcessing = false;
              Swal.fire('Success', 'Processing completed', 'success');
            }

            if (job.status === 'FAILED') {
              if (this.pollingSubscription) this.pollingSubscription.unsubscribe();
              this.isProcessing = false;
              Swal.fire('Failed', `Job failed: ${job.message}`, 'error');
            }
          });
        },
        error: (err) => console.error('Error polling job', err),
      });
    });
  }
}
