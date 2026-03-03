import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job.model';
import { Student } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private baseUrl = 'http://localhost:8080/api/students';

  constructor(private http: HttpClient) {}

  uploadCsv(file: File): Observable<Job> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Job>(`${this.baseUrl}/upload`, formData);
  }

  getStudents(
    page = 0,
    size = 20,
    search?: number,
    classFilter?: string,
  ): Observable<{ students: Student[]; total: number }> {
    let url = `${this.baseUrl}?page=${page}&size=${size}`;
    if (search) url += `&studentId=${search}`;
    if (classFilter) url += `&class=${classFilter}`;
    return this.http.get<{ students: Student[]; total: number }>(url);
  }
}
