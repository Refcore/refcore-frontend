'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ParticipantModel } from '@/model/participant.model';
import AppPagination from '@/components/shared/AppPagination';
import { participantsColumns } from './ParticipantsColumns';

type ParticipantsTableProps = {
  participants: ParticipantModel[];
  currentPage: number;
  totalPages: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onPageChange?: (page: number) => void;
};

const ParticipantsTable = ({
  participants,
  currentPage,
  totalPages,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  onPageChange,
}: ParticipantsTableProps) => {
  const sortedParticipants = [...participants].sort(
    (a, b) => b.total_referrals - a.total_referrals,
  );

  return (
    <section className="rounded-xl border border-white/10 bg-[rgba(28,28,38,0.55)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">All Participants</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-gray-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--neon-green)" />
            Lifetime participant data
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm">
          <Activity className="size-4 text-(--neon-green)" />
          <span className="text-gray-400">Showing</span>
          <span className="font-bold text-white">
            {sortedParticipants.length} participants
          </span>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full">
          <thead className="sticky top-0 z-10 border-b border-white/5 bg-[#13131a]/80 backdrop-blur-md">
            <tr>
              {participantsColumns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    'px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 sm:px-6',
                    column.className,
                    column.mobileHidden && 'hidden md:table-cell',
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {sortedParticipants.map((participant) => (
              <tr
                key={participant.id}
                className="transition-all duration-200 hover:bg-white/4"
              >
                {participantsColumns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      'px-2 pb-2 pt-4 align-middle md:px-4 md:py-4 sm:px-6',
                      column.mobileHidden && 'hidden md:table-cell',
                    )}
                  >
                    {column.render(participant)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/5 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Participants are ranked here by all-time referral totals.</p>
          <p>{sortedParticipants.length} participants listed</p>
        </div>
      </div>

      <AppPagination
        currentPage={currentPage}
        totalPages={totalPages}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        onPageChange={onPageChange}
      />
    </section>
  );
};

export default ParticipantsTable;