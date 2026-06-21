'use client';

import {
  AlertTriangle,
  Archive,
  CalendarDays,
  Eye,
  Gift,
  Hash,
  OctagonAlert,
  Radio,
  RefreshCcw,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Contest } from '@/types/contest.type';
import { useGetContestById } from '@/hooks/admin/contests/useGetContestById';
import IconLoader from '@/components/shared/IconLoader';
import { cn } from '@/lib/utils';

type ViewContestModalProps = {
  contest: Contest;
  onClose: () => void;
};

const statusStyles: Record<Contest['status'], string> = {
  active:
    'border-[color:var(--neon-green)]/25 bg-[color:var(--neon-green)]/10 text-[color:var(--neon-green)]',
  upcoming:
    'border-[color:var(--neon-blue)]/25 bg-[color:var(--neon-blue)]/10 text-[color:var(--neon-blue)]',
  past: 'border-border bg-white/5 text-muted-foreground',
  draft:
    'border-[color:var(--neon-purple)]/20 bg-[color:var(--neon-purple)]/10 text-[color:var(--neon-purple)]',
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

const formatDateTime = (date?: string | Date | null) => {
  if (!date) return 'Not set';

  const formattedDate = new Date(date);

  if (Number.isNaN(formattedDate.getTime())) {
    return 'Not set';
  }

  return formattedDate.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatValue = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') {
    return 'Not set';
  }

  return value;
};

const formatNumber = (value?: number | null) => {
  if (value === null || value === undefined) {
    return '0';
  }

  return value.toLocaleString();
};

const formatBoolean = (value?: boolean | null) => {
  return value ? 'Yes' : 'No';
};

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="rounded-xl border border-white/10 bg-[#13131a]/70 p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 wrap-break-word text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
};

const ViewContestModal = ({ contest, onClose }: ViewContestModalProps) => {
  const {
    contest: fetchedContest,
    is_contest_not_found,
    is_getting_contest,
    is_refetching_contest,
    is_getting_contest_error,
    get_contest_error,
    refetchContest,
  } = useGetContestById(contest.id);

  const contestDetails = fetchedContest ?? contest;

  const errorMessage =
    get_contest_error instanceof Error
      ? get_contest_error.message
      : 'Something went wrong while fetching this contest.';

  return (
    <div className="relative flex w-full flex-col gap-6 overflow-hidden rounded-xl">
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[#00ff9d]/20 blur-3xl" />

      {is_getting_contest ? (
        <div className="relative flex min-h-64 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-6 text-center">
          <IconLoader loadingText="Loading contest details...">
            <Trophy className="size-6 text-gray-500" />
          </IconLoader>

          <p className="mt-1 max-w-xs text-xs leading-5 text-gray-400">
            Fetching the full contest record and performance details.
          </p>
        </div>
      ) : is_getting_contest_error ? (
        <div className="relative rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <OctagonAlert className="size-5 text-red-400" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                Could not load contest.
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                {errorMessage}
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={() => refetchContest()}
                className="mt-4 h-9 border-2 border-white/10 bg-transparent text-xs text-white hover:bg-white/5 hover:text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      ) : is_contest_not_found || !contestDetails ? (
        <div className="relative rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
              <AlertTriangle className="size-5 text-yellow-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Contest not found.
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-400">
                This contest may have been deleted or is no longer available.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Contest Overview
                </p>

                <h4 className="text-lg font-bold text-white">
                  {contestDetails.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  {contestDetails.description || 'No description provided.'}
                </p>
              </div>

              <div
                className={cn(
                  'inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide',
                  statusStyles[contestDetails.status],
                )}
              >
                {contestDetails.status}
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-[#13131a]/70 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                <Users className="size-4 text-[#00d0ff]" />
                Participants
              </div>
              <p className="text-xl font-black text-white">
                {formatNumber(contestDetails.participants_count)}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#13131a]/70 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                <Zap className="size-4 text-[#00ff9d]" />
                Referrals
              </div>
              <p className="text-xl font-black text-white">
                {formatNumber(contestDetails.referrals_count)}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#13131a]/70 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                <Eye className="size-4 text-[#b700ff]" />
                Views
              </div>
              <p className="text-xl font-black text-white">
                {formatNumber(contestDetails.views_count)}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#13131a]/70 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                <Trophy className="size-4 text-yellow-400" />
                Max Winners
              </div>
              <p className="text-xl font-black text-white">
                {formatNumber(contestDetails.max_winners)}
              </p>
            </div>
          </div>

          <div className="relative rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
              Timing
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <InfoItem
                label="Start Date"
                value={
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4 text-[#00d0ff]" />
                    {formatDate(contestDetails.start_date)}
                  </span>
                }
              />

              <InfoItem
                label="End Date"
                value={
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4 text-[#00d0ff]" />
                    {formatDate(contestDetails.end_date)}
                  </span>
                }
              />
            </div>
          </div>

          <div className="relative rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
              Reward Setup
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <InfoItem
                label="Reward Type"
                value={
                  <span className="inline-flex items-center gap-2 capitalize">
                    <Gift className="size-4 text-[#00ff9d]" />
                    {formatValue(contestDetails.reward_type)}
                  </span>
                }
              />

              <InfoItem
                label="Reward Value"
                value={formatValue(contestDetails.reward_value)}
              />

              <InfoItem
                label="Winner Selection"
                value={formatValue(contestDetails.winner_selection)}
              />

              <InfoItem
                label="Reward Description"
                value={formatValue(contestDetails.reward_description)}
              />
            </div>
          </div>

          <div className="relative rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
              Publishing & Identity
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <InfoItem
                label="Slug"
                value={
                  <span className="inline-flex items-center gap-2">
                    <Hash className="size-4 text-[#00d0ff]" />
                    {formatValue(contestDetails.slug)}
                  </span>
                }
              />

              <InfoItem
                label="Visibility"
                value={
                  <span className="inline-flex items-center gap-2 capitalize">
                    <Radio className="size-4 text-[#00ff9d]" />
                    {formatValue(contestDetails.visibility)}
                  </span>
                }
              />

              <InfoItem
                label="Referral Code Prefix"
                value={formatValue(contestDetails.referral_code_prefix)}
              />

              <InfoItem
                label="Published"
                value={formatBoolean(contestDetails.is_published)}
              />

              <InfoItem
                label="Archived"
                value={
                  <span className="inline-flex items-center gap-2">
                    <Archive className="size-4 text-gray-400" />
                    {formatBoolean(contestDetails.is_archived)}
                  </span>
                }
              />

              <InfoItem
                label="Contest ID"
                value={formatValue(contestDetails.id)}
              />
            </div>
          </div>

          <div className="relative rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
              Top Performer
            </p>

            <div className="grid gap-3 md:grid-cols-3">
              <InfoItem
                label="Name"
                value={formatValue(contestDetails.top_performer_name)}
              />

              <InfoItem
                label="Phone"
                value={formatValue(contestDetails.top_performer_phone)}
              />

              <InfoItem
                label="Referrals"
                value={formatNumber(contestDetails.top_performer_referrals)}
              />
            </div>
          </div>

          <div className="relative grid gap-3 md:grid-cols-2">
            <InfoItem
              label="Created At"
              value={formatDateTime(contestDetails.created_at)}
            />

            <InfoItem
              label="Updated At"
              value={formatDateTime(contestDetails.updated_at)}
            />
          </div>

          {is_refetching_contest ? (
            <p className="text-center text-xs text-gray-500">
              Refreshing contest details...
            </p>
          ) : null}
        </>
      )}

      <div className="relative grid w-full gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 border-2 border-white/10 bg-transparent text-white hover:bg-white/5 hover:text-white"
        >
          Close
        </Button>

        <Button
          type="button"
          onClick={() => refetchContest()}
          disabled={is_getting_contest || is_refetching_contest}
          className="flex-1 bg-linear-to-r from-[#00ff9d] to-[#00d0ff] font-bold text-[#0a0a0f] shadow-[0_0_20px_rgba(0,208,255,0.25)] hover:opacity-90"
        >
          <RefreshCcw className="size-4" />
          {is_refetching_contest ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};

export default ViewContestModal;