'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Link2,
  OctagonAlert,
  Phone,
  RefreshCcw,
  Search,
  ShieldAlert,
//   UserCheck,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import IconLoader from '@/components/shared/IconLoader';
import { ReferralStatus } from '@/types/referral.type';
import { useGetReferralByParticipantId } from '@/hooks/admin/referrals/useGetReferralByParticipantId';

type ViewReferralsModalProps = {
  onClose: () => void;
  participantId?: string | null;
  contestId?: string | null;
  participantName?: string | null;
};

const formatDate = (date?: string | Date | null) => {
  if (!date) return 'Not set';

  const formattedDate = new Date(date);

  if (Number.isNaN(formattedDate.getTime())) {
    return 'Not set';
  }

  return formattedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatValue = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') {
    return 'Not set';
  }

  return value;
};

const getReferralStatusClassName = (
  status?: ReferralStatus | string | null,
) => {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === 'valid') {
    return 'border-green-500/30 bg-green-500/10 text-green-400';
  }

  if (normalizedStatus === 'became_participant') {
    return 'border-[#00ff9d]/30 bg-[#00ff9d]/10 text-[#00ff9d]';
  }

  if (normalizedStatus === 'flagged') {
    return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
  }

  if (normalizedStatus === 'blocked') {
    return 'border-red-500/30 bg-red-500/10 text-red-400';
  }

  return 'border-white/10 bg-white/5 text-gray-300';
};

const formatReferralStatus = (status?: ReferralStatus | string | null) => {
  if (!status) return 'Not set';

  if (status === 'became_participant') {
    return 'Valid + joined';
  }

  return status.replaceAll('_', ' ');
};

const ViewReferralsModal = ({
  onClose,
  participantId,
  contestId,
}: ViewReferralsModalProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const safe_participant_id = participantId?.trim() ?? '';
  const safe_contest_id = contestId?.trim() ?? '';

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetReferralByParticipantId(safe_participant_id, {
      page,
      limit: 8,
      search,
      contest_id: safe_contest_id,
    });

  const referrals = data?.referrals ?? [];
  const pagination = data?.pagination;

  const canPreviousPage = page > 1;
  const canNextPage = page < (pagination?.total_pages ?? 0);

  const errorMessage =
    error instanceof Error
      ? error.message
      : 'Something went wrong while fetching referrals.';

  const handlePreviousPage = () => {
    if (!canPreviousPage) return;

    setPage((currentPage) => currentPage - 1);
  };

  const handleNextPage = () => {
    if (!canNextPage) return;

    setPage((currentPage) => currentPage + 1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  return (
    <div className="relative flex w-full flex-col gap-3 overflow-hidden rounded-xl sm:gap-4">
      <div className="pointer-events-none absolute left-1/2 top-0 h-28 w-28 -translate-x-1/2 rounded-full bg-[#00ff9d]/15 blur-3xl sm:h-40 sm:w-40" />

      {!safe_participant_id ? (
        <div className="relative rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 sm:p-4">
          <div className="flex gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
              <AlertTriangle className="size-4 text-yellow-400" />
            </div>

            <div>
              <p className="text-xs font-semibold text-white sm:text-sm">
                No participant selected.
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-400">
                Select a participant before opening this modal.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-3 sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 sm:text-xs">
                  Referrals
                </p>

                <h4 className="mt-1 truncate text-sm font-bold text-white sm:text-base">
                  <span className="hidden min-w-0 items-center gap-1.5 sm:flex">
                    <Link2 className="size-3.5 shrink-0 text-[#00ff9d]" />
                    <span className="truncate">
                      {formatValue(referrals[0]?.referral_code_used)}
                    </span>
                  </span>
                </h4>

                <p className="mt-1 text-xs text-gray-500">
                  {safe_contest_id
                    ? 'Filtered by contest'
                    : 'All contest referrals'}
                </p>
              </div>

              <div className="shrink-0 rounded-full border border-[#00ff9d]/30 bg-[#00ff9d]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#00ff9d] sm:text-xs">
                {pagination?.total ?? 0}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-[#13131a]/70 px-2.5 py-1.5 sm:px-3">
              <Search className="size-3.5 shrink-0 text-gray-500 sm:size-4" />

              <input
                value={search}
                onChange={handleSearchChange}
                placeholder="Search referrals..."
                className="h-7 w-full bg-transparent text-xs text-white outline-none placeholder:text-gray-600 sm:h-8 sm:text-sm"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="relative flex min-h-44 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-4 text-center sm:min-h-56">
              <IconLoader loadingText="Loading referrals...">
                <Users className="size-5 text-gray-500" />
              </IconLoader>

              <p className="mt-1 max-w-xs text-xs leading-5 text-gray-400">
                Fetching participant referrals.
              </p>
            </div>
          ) : isError ? (
            <div className="relative rounded-xl border border-red-500/20 bg-red-500/10 p-3 sm:p-4">
              <div className="flex gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                  <OctagonAlert className="size-4 text-red-400" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold text-white sm:text-sm">
                    Could not load referrals.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    {errorMessage}
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => refetch()}
                    className="mt-3 h-8 border-2 border-white/10 bg-transparent px-3 text-xs text-white hover:bg-white/5 hover:text-white"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          ) : referrals.length === 0 ? (
            <div className="relative rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-3 sm:p-4">
              <div className="flex gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <ShieldAlert className="size-4 text-gray-400" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white sm:text-sm">
                    No referrals found.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    This participant has no matching referrals.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative space-y-2 sm:space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="rounded-xl border border-white/10 bg-[#13131a]/70 p-3 sm:p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {/* <div className="flex min-w-0 items-center gap-2">
                        <UserCheck className="size-3.5 shrink-0 text-[#00ff9d] sm:size-4" />

                        <p className="truncate text-xs font-bold text-white sm:text-sm">
                          {formatValue(referral.referee.user_name)}
                        </p>
                      </div> */}

                      <div className="mt-2 flex min-w-0 flex-col gap-1.5 text-xs text-gray-400 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <Phone className="size-3.5 shrink-0 text-[#00d0ff]" />
                          <span className="truncate">
                            {formatValue(referral.referee.phone)}
                          </span>
                        </span>

                        <span className="flex items-center gap-1.5">
                          <CalendarClock className="size-3.5 shrink-0 text-yellow-400" />
                          {formatDate(referral.first_seen_at)}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize sm:px-2.5 sm:py-1 sm:text-xs ${getReferralStatusClassName(
                        referral.status,
                      )}`}
                    >
                      {formatReferralStatus(referral.status)}
                    </div>
                  </div>

                  {referral.status === 'became_participant' ? (
                    <p className="mt-2 text-[11px] text-muted-foreground sm:text-xs">
                      Bonus: referee later joined as a participant.
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          <div className="relative flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-2.5 sm:p-3">
            <p className="shrink-0 text-[11px] text-gray-400 sm:text-xs">
              Page{' '}
              <span className="font-bold text-white">
                {pagination?.page ?? page}
              </span>
              /
              <span className="font-bold text-white">
                {pagination?.total_pages ?? 0}
              </span>
            </p>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousPage}
                disabled={!canPreviousPage || isFetching}
                className="h-8 border-2 border-white/10 bg-transparent px-2 text-xs text-white hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
              >
                <ChevronLeft className="size-4 sm:mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleNextPage}
                disabled={!canNextPage || isFetching}
                className="h-8 border-2 border-white/10 bg-transparent px-2 text-xs text-white hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="size-4 sm:ml-1" />
              </Button>
            </div>
          </div>

          {isFetching && !isLoading ? (
            <p className="text-center text-[11px] text-gray-500 sm:text-xs">
              Refreshing referrals...
            </p>
          ) : null}
        </>
      )}

      <div className="relative grid w-full grid-cols-2 gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-9 border-2 border-white/10 bg-transparent text-xs text-white hover:bg-white/5 hover:text-white sm:h-10 sm:text-sm"
        >
          Close
        </Button>

        <Button
          type="button"
          onClick={() => refetch()}
          disabled={!safe_participant_id || isLoading || isFetching}
          className="h-9 bg-linear-to-r from-[#00ff9d] to-[#00d0ff] text-xs font-bold text-[#0a0a0f] shadow-[0_0_20px_rgba(0,208,255,0.25)] hover:opacity-90 sm:h-10 sm:text-sm"
        >
          <RefreshCcw className="mr-1.5 size-3.5 sm:size-4" />
          {isFetching ? 'Refreshing' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};

export default ViewReferralsModal;
