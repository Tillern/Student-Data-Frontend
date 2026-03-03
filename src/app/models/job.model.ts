export interface Job {
  id: string;
  type: 'EXCEL_GENERATION' | 'CSV_PROCESSING' | 'DB_UPLOAD';
  status: 'STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  startedAt: string;
  completedAt?: string;
  durationInSeconds?: number;
  message?: string;
}
