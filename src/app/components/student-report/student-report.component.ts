import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './student-report.component.html',
  styleUrls: ['./student-report.component.scss'],
})
export class StudentReportComponent implements AfterViewInit {

  dataSource = new MatTableDataSource<any>([]);
  columns: string[] = ['studentId', 'firstName', 'lastName', 'dob', 'studentClass', 'score'];

  totalRecords = 0;
  pageSize = 100;
  pageIndex = 0;

  filterStudentId: number | null = null;
  filterClass: string = '';
  classes: string[] = ['Class1', 'Class2', 'Class3', 'Class4', 'Class5'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadStudents();
  }

  loadStudents() {
    const params: any = {
      page: this.pageIndex,
      size: this.pageSize,
    };

    if (this.filterStudentId) {
      params.studentId = this.filterStudentId;
    }

    if (this.filterClass) {
      params.studentClass = this.filterClass;
    }

    this.http
      .get<any[]>('http://localhost:8080/api/students/report/list', {
        params,
        observe: 'response',
      })
      .subscribe((res) => {
        this.dataSource.data = res.body || [];

        const totalHeader = res.headers.get('X-Total-Count');
        this.totalRecords = totalHeader
          ? +totalHeader
          : this.dataSource.data.length;
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadStudents();
  }

  exportReport(format: string) {
    Swal.fire({
      title: `Exporting ${format.toUpperCase()}...`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const params: any = {
      page: 0,
      size: this.totalRecords,
      format,
    };

    if (this.filterStudentId) {
      params.studentId = this.filterStudentId;
    }

    if (this.filterClass) {
      params.studentClass = this.filterClass;
    }

    this.http
      .get('http://localhost:8080/api/students/report/export', {
        params,
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `students.${format}`;
          a.click();
          window.URL.revokeObjectURL(url);
          Swal.close();
        },
        error: () => {
          Swal.fire('Error', 'Export failed', 'error');
        },
      });
  }
}
