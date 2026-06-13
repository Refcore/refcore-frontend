'use client';

import {
  AlertTriangle,
  Check,
  Copy,
  Hash,
  Link2,
  OctagonAlert,
  Phone,
  Trophy,
  User,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetContestParticipant } from '@/hooks/admin/contests/useGetContestParticipant';
import IconLoader from '../shared/IconLoader';
import { useState } from 'react';

type ViewParticipantModalProps = {
  onClose: () => void;
  contestId?: string | null;
  participantId?: string | null;
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

const getStatusClassName = (status?: string | null) => {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === 'active') {
    return 'border-green-500/30 bg-green-500/10 text-green-400';
  }

  if (normalizedStatus === 'blocked' || normalizedStatus === 'disqualified') {
    return 'border-red-500/30 bg-red-500/10 text-red-400';
  }

  if (normalizedStatus === 'inactive') {
    return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
  }

  return 'border-white/10 bg-white/5 text-gray-300';
};

const ViewParticipantModal = ({
  onClose,
  contestId,
  participantId,
}: ViewParticipantModalProps) => {
  const {
    contestParticipant,
    is_getting_contest_participant,
    is_fetching_contest_participant,
    is_get_contest_participant_error,
    error,
    refetch,
  } = useGetContestParticipant({
    contestId,
    participantId,
  });

  const [copiedField, setCopiedField] = useState<
    'phone_number' | 'referral_code' | null
  >(null);

  const handleCopy = async (
    value: string | number | null | undefined,
    field: 'phone_number' | 'referral_code',
  ) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(String(value));

      setCopiedField(field);

      window.setTimeout(() => {
        setCopiedField((currentField) =>
          currentField === field ? null : currentField,
        );
      }, 1500);
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
    }
  };

  const participant = contestParticipant?.participant;

  const errorMessage =
    error instanceof Error
      ? error.message
      : 'Something went wrong while fetching this participant.';

  return (
    <div className="relative flex w-full flex-col gap-6 overflow-hidden rounded-xl">
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[#00d0ff]/20 blur-3xl" />
      {!contestId || !participantId ? (
        <div className="relative rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
              <AlertTriangle className="size-5 text-yellow-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                No participant selected.
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-400">
                Select a participant before opening this modal.
              </p>
            </div>
          </div>
        </div>
      ) : is_getting_contest_participant ? (
        <div className="relative flex min-h-64 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-6 text-center">
          <IconLoader loadingText="Loading participant details...">
            <User className="size-6 text-gray-500" />
          </IconLoader>
          <p className="mt-1 max-w-xs text-xs leading-5 text-gray-400">
            Fetching the participant&apos;s contest row and profile information.
          </p>
        </div>
      ) : is_get_contest_participant_error ? (
        <div className="relative rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <OctagonAlert className="size-5 text-red-400" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                Could not load participant.
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-400">
                {errorMessage}
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={() => refetch()}
                className="mt-4 h-9 border-2 border-white/10 bg-transparent text-xs text-white hover:bg-white/5 hover:text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      ) : !contestParticipant || !participant ? (
        <div className="relative rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-4">
          <div className="flex gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
              <Users className="size-5 text-gray-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Participant not found.
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-400">
                This participant may not belong to this contest, or the record
                may no longer exist.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Participant Profile
                </p>

                <h4 className="text-lg font-bold text-white">
                  {formatValue(participant.display_name)}
                </h4>

                <p className="mt-1 text-sm text-gray-400">
                  Joined this contest on{' '}
                  <span className="font-semibold text-white">
                    {formatDate(contestParticipant.joined_at)}
                  </span>
                </p>
              </div>

              <div
                className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusClassName(
                  contestParticipant.status,
                )}`}
              >
                {formatValue(contestParticipant.status)}
              </div>
            </div>
          </div>

          <div className="relative grid gap-3 grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-[#13131a]/70 h-fit p-2 md:p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                <Trophy className="size-4 text-yellow-400" />
                Contest Referrals
              </div>

              <p className="md:text-2xl font-black text-white">
                {contestParticipant.referral_count}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#13131a]/70 h-fit p-2 md:p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                <Hash className="size-4 text-[#00d0ff]" />
                Current Rank
              </div>

              <p className="md:text-2xl font-black text-white">
                {contestParticipant.rank_cache
                  ? `#${contestParticipant.rank_cache}`
                  : 'Not ranked'}
              </p>
            </div>
          </div>

          <div className="relative rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
              Contact & Referral Identity
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#13131a]/70 p-3">
                <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                  <Phone className="size-4 text-[#00d0ff]" />
                  Phone Number
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="break-all text-sm font-semibold text-white">
                    {formatValue(participant.phone_number)}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(participant.phone_number, 'phone_number')
                    }
                    disabled={!participant.phone_number}
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition hover:border-[#00d0ff]/40 hover:bg-[#00d0ff]/10 hover:text-[#00d0ff] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Copy phone number"
                    title={
                      copiedField === 'phone_number'
                        ? 'Copied phone number'
                        : 'Copy phone number'
                    }
                  >
                    {copiedField === 'phone_number' ? (
                      <Check className="size-4 text-[#00ff9d]" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                </div>

                {copiedField === 'phone_number' ? (
                  <p className="mt-2 text-xs font-medium text-[#00ff9d]">
                    Phone number copied
                  </p>
                ) : null}
              </div>

              <div className="rounded-xl border border-white/10 bg-[#13131a]/70 p-3">
                <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                  <Link2 className="size-4 text-[#00ff9d]" />
                  Referral Code
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="break-all text-sm font-semibold text-white">
                    {formatValue(participant.referral_code)}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(participant.referral_code, 'referral_code')
                    }
                    disabled={!participant.referral_code}
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition hover:border-[#00ff9d]/40 hover:bg-[#00ff9d]/10 hover:text-[#00ff9d] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Copy referral code"
                    title={
                      copiedField === 'referral_code'
                        ? 'Copied referral code'
                        : 'Copy referral code'
                    }
                  >
                    {copiedField === 'referral_code' ? (
                      <Check className="size-4 text-[#00ff9d]" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                </div>

                {copiedField === 'referral_code' ? (
                  <p className="mt-2 text-xs font-medium text-[#00ff9d]">
                    Referral code copied
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {is_fetching_contest_participant ? (
            <p className="text-center text-xs text-gray-500">
              Refreshing participant details...
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
          onClick={() => refetch()}
          disabled={
            !contestId ||
            !participantId ||
            is_getting_contest_participant ||
            is_fetching_contest_participant
          }
          className="flex-1 bg-linear-to-r from-[#00ff9d] to-[#00d0ff] font-bold text-[#0a0a0f] shadow-[0_0_20px_rgba(0,208,255,0.25)] hover:opacity-90"
        >
          {is_fetching_contest_participant ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};

export default ViewParticipantModal;
