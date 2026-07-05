'use client';

import { AlertTriangle, Play, Rocket, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Contest } from '@/types/contest.type';
import { useGetMyContests } from '@/hooks/admin/contests/useGetMyContests';
import { useStartContest } from '@/hooks/admin/contests/useStartContest';

type StartContestModalProps = {
  onClose: () => void;
  contest: Contest | null;
};

const StartContestModal = ({ onClose, contest }: StartContestModalProps) => {
  const { data } = useGetMyContests({
    status: 'active',
  });

  const active_contest = data?.[0] ?? null;
  const has_active_contest = Boolean(active_contest?.id);

  const { startContest, is_starting_contest } = useStartContest();

  const handleStartContest = () => {
    if (!contest?.id) return;

    if (has_active_contest) {
      return;
    }

    startContest(
      {
        contest_id: contest.id,
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
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-(--neon-green)/20 blur-3xl" />

      <div className="relative flex flex-col items-center pt-10 text-center">
        <div className="relative mb-4 hidden size-20 items-center justify-center rounded-full border border-(--neon-green)/30 bg-(--neon-green)/10 shadow-[0_0_30px_rgba(0,255,157,0.25)] md:flex">
          <span className="absolute size-20 animate-ping rounded-full bg-(--neon-green)/10" />
          <span className="absolute size-14 rounded-full bg-(--neon-green)/10" />
          <Rocket className="relative z-10 size-9 text-(--neon-green)" />
        </div>

        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-(--neon-green)/30 bg-(--neon-green)/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-(--neon-green)">
          <Play className="size-3.5" />
          Starting Draft Contest
        </div>

        <h3 className="text-xl font-bold text-white">Start this contest?</h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400">
          This will make the draft contest active and allow participants to join
          and start gaining valid referrals.
        </p>
      </div>

      <div className="relative rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
          Contest you are about to start
        </p>

        <h4 className="text-base font-bold text-white">
          {contest?.title ?? 'Untitled contest'}
        </h4>
      </div>

      {has_active_contest ? (
        <div className="relative rounded-xl border border-yellow-500/25 bg-yellow-500/10 p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
              <AlertTriangle className="size-5 text-yellow-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                You already have an active contest.
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                End{' '}
                <span className="font-semibold text-yellow-300">
                  {active_contest?.title ?? 'the current active contest'}
                </span>{' '}
                before starting another one.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl border border-(--neon-green)/20 bg-(--neon-green)/6 p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--neon-green)/10">
              <ShieldCheck className="size-5 text-(--neon-green)" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Only start when the contest setup is ready.
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-400">
                Once active, this contest can begin receiving joins and referral
                activity.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative grid w-full gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={is_starting_contest}
          className="flex-1 border-2 border-white/10 bg-transparent text-white hover:bg-white/5 hover:text-white"
        >
          Cancel
        </Button>

        <Button
          type="button"
          onClick={handleStartContest}
          disabled={is_starting_contest || has_active_contest}
          className="flex-1 bg-(--neon-green) font-bold text-black shadow-[0_0_20px_rgba(0,255,157,0.25)] hover:bg-(--neon-green)/90 disabled:cursor-not-allowed disabled:opacity-20"
        >
          {is_starting_contest ? 'Starting...' : 'Yes, Start Contest'}
        </Button>
      </div>
    </div>
  );
};

export default StartContestModal;
