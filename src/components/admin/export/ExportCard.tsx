import React from 'react';
import type { ExportCardItem } from '@/types/export.type';
import {
  Download,
  Link2,
  Trophy,
  Users,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type ExportCardProps = {
  item: ExportCardItem;
};

const iconMap = {
  trophy: Trophy,
  users: Users,
  link: Link2,
  activity: Activity,
};

const ExportCard = ({ item }: ExportCardProps) => {
  const Icon = iconMap[item.icon_name];

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
            <Icon className="h-5 w-5 text-white" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">{item.title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {item.quick_actions.map((action) => (
          <span
            key={action.value}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground"
          >
            {action.label}
          </span>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {item.available_formats.map((format) => (
          <div
            key={format}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            {format.toUpperCase()}
          </div>
        ))}
      </div>

      <Button
      variant={'outline'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white text-green-300 px-4 py-3 text-sm font-semibold transition hover:opacity-90"
      >
        <Download className="h-4 w-4" />
        {item.button_label}
      </Button>
    </div>
  );
};

export default ExportCard;
