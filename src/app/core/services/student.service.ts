import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getByClass(studentClass: string, page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('studentClass', studentClass)
      .set('page', page)
      .set('size', size);

    return this.http.get(`${this.baseUrl}/students/by-class`, { params });
  }
}
