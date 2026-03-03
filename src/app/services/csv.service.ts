import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class CsvService {
  private baseUrl = 'http://localhost:8080/api/csv';

  constructor(private http: HttpClient) {}

  uploadExcel(file: File): Observable<Job> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Job>(`${this.baseUrl}/upload`, formData);
  }
}
