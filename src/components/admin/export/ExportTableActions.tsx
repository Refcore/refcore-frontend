'use client';

import React from 'react';
import { Download, Ellipsis, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ExportTableActionsProps = {
  exportId: string;
  fileName: string;
  status: 'ready' | 'processing' | 'failed';
};

const ExportTableActions = ({
//   exportId,
  fileName,
  status,
}: ExportTableActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label={`Open actions for ${fileName}`}
        >
          <Ellipsis className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 border-white/10 bg-[#13131a] text-white"
      >
        <DropdownMenuItem className="cursor-pointer focus:bg-white/10">
          <Eye className="mr-2 size-4" />
          View details
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer focus:bg-white/10"
          disabled={status !== 'ready'}
        >
          <Download className="mr-2 size-4" />
          Download file
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportTableActions;