import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.html',
  styleUrls: ['./upload.scss'],
})
export class UploadComponent {
  selectedFile: File | null = null;
  loading = false;
  message: string = '';

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    this.message = '';
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.message = '';

    setTimeout(() => {
      this.loading = false;
      this.message = `Uploaded "${this.selectedFile!.name}" successfully ✅`;
      this.selectedFile = null;
    }, 2000);
  }
}
