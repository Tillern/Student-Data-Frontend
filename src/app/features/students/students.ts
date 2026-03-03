import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../core/services/student.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.html',
  styleUrls: ['./students.scss'],
})
export class StudentsComponent {
  studentClass: string = '';
  students: any[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  loading = false;

  constructor(private studentService: StudentService, private ngZone: NgZone) {}

  search(page: number = 0) {
    if (!this.studentClass) return;

    this.loading = true;
    this.page = page;

    this.studentService.getByClass(this.studentClass, this.page, this.size).subscribe({
      next: (res: any) => {
        this.ngZone.run(() => {
          this.students = res.content;
          this.totalPages = res.totalPages;
          this.loading = false;
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error(err);
          this.loading = false;
        });
      },
    });
  }

  changePage(newPage: number) {
    if (newPage < 0 || newPage >= this.totalPages) return;
    this.search(newPage);
  }
}
