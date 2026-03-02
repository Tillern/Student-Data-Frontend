import { Routes } from '@angular/router';
import { UploadComponent } from './features/upload/upload';
import { StudentsComponent } from './features/students/students';
import { ReportComponent } from './features/report/report';

export const routes: Routes = [
  { path: '', redirectTo: 'students', pathMatch: 'full' },
  { path: 'upload', component: UploadComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'report', component: ReportComponent }
];
