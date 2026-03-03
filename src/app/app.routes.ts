import { Routes } from '@angular/router';

import { GenerateExcelComponent } from './components/generate-excel/generate-excel.component';
import { ProcessCsvComponent } from './components/process-csv/process-csv.component';
import { UploadCsvComponent } from './components/upload-csv/upload-csv.component';
import { StudentReportComponent } from './components/student-report/student-report.component';
import { DashboardComponent } from './components/dashboard/dashboard.component'

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'generate-excel', component: GenerateExcelComponent },
  { path: 'process-csv', component: ProcessCsvComponent },
  { path: 'upload-csv', component: UploadCsvComponent },
  { path: 'student-report', component: StudentReportComponent },
  { path: '', component: DashboardComponent }
];
