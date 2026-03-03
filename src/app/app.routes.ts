import { Routes } from '@angular/router';
import { StudentsComponent } from './features/students/students';
import { GenerateComponent } from './features/data-generation/generate/generate';
import { ProcessComponent } from './features/data-processing/process/process';
import { UploadComponent } from './features/data-upload/upload/upload';
import { StudentReportComponent } from './features/report/student-report/student-report';

export const routes: Routes = [
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  { path: 'students', component: StudentsComponent },
  { path: 'data-generation', component: GenerateComponent },
  { path: 'data-processing', component: ProcessComponent },
  { path: 'data-upload', component: UploadComponent },
  { path: 'report', component: StudentReportComponent },
  { path: '**', redirectTo: '/students' },
];
