import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export class ExcelService {
  private baseUrl = 'http://localhost:8080/api/excel';

  constructor(private http: HttpClient) {}

  generateExcel(records: number): Observable<Job> {
    return this.http.post<Job>(`${this.baseUrl}/generate`, { numberOfRecords: records });
  }

  getJobStatus(jobId: string): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}/job/${jobId}`);
  }
}
