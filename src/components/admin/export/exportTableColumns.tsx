import React, { type ReactNode } from 'react';
import {
  CircleAlert,
  Clock3,
  Download,
  FileSpreadsheet,
  Link2,
  Trophy,
  Users,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RecentExportItem } from '@/types/export.type';
import ExportTableActions from './ExportTableActions';

export type ExportTableColumn = {
  id: string;
  header: string;
  className?: string;
  mobileHidden?: boolean;
  render: (item: RecentExportItem) => ReactNode;
};

const exportTypeIconMap = {
  winners: Trophy,
  participants: Users,
  referrals: Link2,
  activity_logs: Activity,
};

const exportTypeLabelMap = {
  winners: 'Winners',
  participants: 'Participants',
  referrals: 'Referrals',
  activity_logs: 'Activity Logs',
};

const statusConfig = {
  ready: {
    label: 'Ready',
    className:
      'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
    icon: Download,
  },
  processing: {
    label: 'Processing',
    className: 'border border-yellow-500/20 bg-yellow-500/10 text-yellow-400',
    icon: Clock3,
  },
  failed: {
    label: 'Failed',
    className: 'border border-red-500/20 bg-red-500/10 text-red-400',
    icon: CircleAlert,
  },
};

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export const exportTableColumns: ExportTableColumn[] = [
  {
    id: 'file',
    header: 'File',
    className: 'min-w-[280px]',
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:flex">
          <FileSpreadsheet className="size-5 text-white/80" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {item.file_name}
          </p>
          <p className="truncate text-xs text-gray-500">{item.contest_name}</p>
        </div>
      </div>
    ),
  },
  {
    id: 'type',
    header: 'Type',
    className: 'w-[180px]',
    render: (item) => {
      const Icon = exportTypeIconMap[item.export_type];

      return (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80">
          <Icon className="size-3.5" />
          {exportTypeLabelMap[item.export_type]}
        </div>
      );
    },
  },
  {
    id: 'format',
    header: 'Format',
    className: 'w-[110px]',
    mobileHidden: true,
    render: (item) => (
      <div className="inline-flex rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium uppercase text-white/80">
        {item.format}
      </div>
    ),
  },
  {
    id: 'created_at',
    header: 'Created',
    className: 'w-[190px]',
    mobileHidden: true,
    render: (item) => (
      <div>
        <p className="text-sm text-white">{formatDateTime(item.created_at)}</p>
        <p className="text-xs text-gray-500">{item.exported_by}</p>
      </div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    className: 'w-[140px]',
    render: (item) => {
      const config = statusConfig[item.status];
      const Icon = config.icon;

      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
            config.className,
          )}
        >
          <Icon className="size-3.5" />
          {config.label}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    className: 'w-[72px] text-right',
    render: (item) => (
      <div className="flex justify-end">
        <ExportTableActions
          exportId={item.id}
          fileName={item.file_name}
          status={item.status}
        />
      </div>
    ),
  },
];
