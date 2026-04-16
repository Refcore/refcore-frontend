export type ExportFormat = 'csv' | 'xlsx';
export type ExportStatus = 'ready' | 'processing' | 'failed';

export type ExportType =
  | 'winners'
  | 'participants'
  | 'referrals'
  | 'activity_logs';

export type ExportCardAction = {
  label: string;
  value: string;
};

export type ExportCardItem = {
  id: string;
  title: string;
  description: string;
  icon_name: 'trophy' | 'users' | 'link' | 'activity';
  export_type: ExportType;
  available_formats: ExportFormat[];
  quick_actions: ExportCardAction[];
  button_label: string;
};

export type RecentExportItem = {
  id: string;
  file_name: string;
  export_type: ExportType;
  contest_name: string;
  created_at: string;
  exported_by: string;
  status: ExportStatus;
  format: ExportFormat;
};