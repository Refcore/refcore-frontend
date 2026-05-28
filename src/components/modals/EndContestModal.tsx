'use client';

import { AlertTriangle, CalendarDays, OctagonX, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEndContest } from '@/hooks/admin/contests/useEndContest';
import type { Contest } from '@/types/contest.type';

type EndContestModalProps = {
  onClose: () => void;
  activeContest: Contest | null;
};

const formatContestDate = (date?: string | Date | null) => {
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

const EndContestModal = ({
  onClose,
  activeContest,
}: EndContestModalProps) => {
const { endContest, is_ending_contest } = useEndContest();

const handleEndContest = () => {
  if (!activeContest?.id) return;

  endContest(
    {
      contest_id: activeContest.id,
    },
    {
      onSuccess: () => {
        onClose();
      },
    },
  );
};
  return (
    <div className="relative flex w-full flex-col gap-6 overflow-hidden rounded-xl">
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl" />

      <div className="relative flex flex-col items-center pt-10 text-center">
        <div className="relative hidden mb-4 md:flex size-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.25)]">
          <span className="absolute size-20 animate-ping rounded-full bg-red-500/10" />
          <span className="absolute size-14 rounded-full bg-red-500/10" />
          <OctagonX className="relative z-10 size-9 text-red-400" />
        </div>

        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-400">
          <ShieldAlert className="size-3.5" />
          Ending Active Contest
        </div>

        <h3 className="text-xl font-bold text-white">Are you sure?</h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400">
          This will end the active contest and stop participants from gaining
          new valid referrals for this contest.
        </p>
      </div>

      <div className="relative rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
          Contest you are about to end
        </p>

        <h4 className="text-base font-bold text-white">
          {activeContest?.title ?? 'Untitled contest'}
        </h4>

        <div className="mt-4 gap-3 sm:grid-cols-2 hidden md:grid">
          <div className="rounded-xl border border-white/10 bg-[#13131a]/70 p-3">
            <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
              <CalendarDays className="size-4 text-[#00d0ff]" />
              Started
            </div>

            <p className="text-sm font-semibold text-white">
              {formatContestDate(activeContest?.start_date)}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#13131a]/70 p-3">
            <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
              <CalendarDays className="size-4 text-red-400" />
              Supposed to end
            </div>

            <p className="text-sm font-semibold text-white">
              {formatContestDate(activeContest?.end_date)}
            </p>
          </div>
        </div>

          <div className="mt-4 gap-3 grid grid-cols-2 md:hidden">
          <div className="">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <CalendarDays className="size-4 text-[#00d0ff]" />
              Started
            </div>

            <p className="text-sm font-semibold text-white">
              {formatContestDate(activeContest?.start_date)}
            </p>
          </div>

          <div className="">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <CalendarDays className="size-4 text-red-400" />
              Supposed to end
            </div>

            <p className="text-sm font-semibold text-white">
              {formatContestDate(activeContest?.end_date)}
            </p>
          </div>
        </div>
      </div>

      <div className="relative rounded-xl border border-red-500/20 bg-red-500/6 p-4">
        <div className="flex gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="size-5 text-red-400" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              This action cannot be undone.
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-400">
              Make sure you have exported or reviewed the contest data before
              ending it.
            </p>
          </div>
        </div>
      </div>

      <div className="relative grid w-full gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={is_ending_contest}
          className="flex-1 border-2 border-white/10 bg-transparent text-white hover:bg-white/5 hover:text-white"
        >
          Cancel
        </Button>

        <Button
          type="button"
          onClick={handleEndContest}
          disabled={is_ending_contest}
          className="flex-1 bg-red-500 font-bold text-white shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:bg-red-600"
        >
          {is_ending_contest ? 'Ending...' : 'Yes, End Contest'}
        </Button>
      </div>
    </div>
  );
};

export default EndContestModal;