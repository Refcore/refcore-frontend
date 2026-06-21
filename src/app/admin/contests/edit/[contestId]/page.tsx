'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Info,
  LockKeyhole,
  PencilIcon,
  RefreshCw,
  ShieldCheck,
  UnlockKeyhole,
} from 'lucide-react';
import { useFormContext, UseFormReturn } from 'react-hook-form';

import FormButton from '@/components/shared/forms/FormButton';
import FormShell from '@/components/shared/forms/FormShell';
import FormDateTimeInput from '@/components/shared/forms/inputs/FormDateTimeInput';
import FormDropDownInput from '@/components/shared/forms/inputs/FormDropDownInput';
import TextAreaInput from '@/components/shared/forms/inputs/TextAreaInput';
import TextInput from '@/components/shared/forms/inputs/TextInput';
import NumberInput from '@/components/shared/forms/inputs/NumberInput';
import { useUpdateContest } from '@/hooks/admin/contests/useUpdateContest';

import {
  contestTimingModeDropdownOptions,
  contestVisibilityDropdownOptions,
  CreateContestFormValues,
  createContestSchema,
  getInitialCreateContestFormValues,
} from '@/schema/contest.schema';

import { cn } from '@/lib/utils';
import { useAuthContext } from '@/context/AuthContext';
import { useGetContestById } from '@/hooks/admin/contests/useGetContestById';

type ContestForEdit = Partial<CreateContestFormValues> & {
  id: string;
  status?: string;
};

const getReadableErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;

  return 'Something went wrong while loading this contest.';
};

const mapContestToEditFormValues = (
  contest: ContestForEdit | null,
  defaults: Parameters<typeof getInitialCreateContestFormValues>[0],
): CreateContestFormValues => {
  const baseValues = getInitialCreateContestFormValues(defaults);

  if (!contest) return baseValues;

  return {
    ...baseValues,
    title: contest.title ?? baseValues.title,
    slug: contest.slug ?? baseValues.slug,
    description: contest.description ?? baseValues.description,
    visibility: contest.visibility ?? baseValues.visibility,

    contest_timing_mode:
      contest.start_date && contest.end_date ? 'automatic' : 'manual',

    start_date: contest.start_date ?? baseValues.start_date,
    end_date: contest.end_date ?? baseValues.end_date,

    referral_code_prefix:
      contest.referral_code_prefix ?? baseValues.referral_code_prefix,
    max_winners: contest.max_winners ?? baseValues.max_winners,
    reward_description:
      contest.reward_description ?? baseValues.reward_description,
  };
};

const LiveContestEditNotice = ({
  isLiveContest,
}: {
  isLiveContest: boolean;
}) => {
  if (isLiveContest) {
    return (
      <div className="rounded-xl border border-yellow-400/20 bg-yellow-500/10 p-4">
        <div className="flex gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-yellow-400/10">
            <LockKeyhole className="size-5 text-yellow-300" />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-yellow-100">
              This contest is live, so some fields are locked.
            </h4>

            <p className="text-xs leading-5 text-yellow-100/75 md:text-sm">
              Fields that can affect public links, referral codes, participant
              access, or contest timing cannot be changed while the contest is
              active. You can still update display text, rewards, winners, and
              the end date.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neon-green/20 bg-neon-green/10 p-4">
      <div className="flex gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-neon-green/10">
          <UnlockKeyhole className="size-5 text-neon-green" />
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white">
            This contest is not live yet.
          </h4>

          <p className="text-xs leading-5 text-white/60 md:text-sm">
            All editable fields are currently open. Once this contest becomes
            active, link-sensitive and integrity-sensitive fields will be locked
            automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

const LockedFieldNote = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-yellow-400/15 bg-yellow-500/5 px-3 py-2 text-xs leading-5 text-yellow-100/70">
      <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-yellow-300" />
      <span>{children}</span>
    </div>
  );
};

const EditableFieldNote = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs leading-5 text-white/55">
      <Info className="mt-0.5 size-3.5 shrink-0 text-neon-blue" />
      <span>{children}</span>
    </div>
  );
};

const EditContestFormFields = ({
  loading,
  disabled,
  isLiveContest,
}: {
  loading: boolean;
  disabled: boolean;
  isLiveContest: boolean;
}) => {
  const { getValues, setValue } = useFormContext();

  const isSlugLocked = isLiveContest;
  const isVisibilityLocked = isLiveContest;
  const isReferralPrefixLocked = isLiveContest;

  const handleTitleBlur = (titleValue: string) => {
    const currentSlug = getValues('slug')?.trim();

    if (currentSlug) return;

    const generatedSlug = titleValue
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    setValue('slug', generatedSlug, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  };

  return (
    <>
      <LiveContestEditNotice isLiveContest={isLiveContest} />

      <div
        className={cn(
          'space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/85 md:p-5',
          isLiveContest && 'md:border-yellow-400/10',
        )}
      >
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Basic Information
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            Update the main details people will see when viewing this contest.
            Live contests keep public-link fields locked to protect existing
            participant links.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            name="title"
            label="Contest Title"
            required
            placeholder="Enter contest title"
            description={
              isLiveContest
                ? 'You can still update the title because it only changes the display name participants see.'
                : 'Use a clear name that helps you identify this contest easily.'
            }
            onBlur={handleTitleBlur}
            disabled={disabled}
          />

          <div className="space-y-2">
            <TextInput
              name="slug"
              label="Contest Slug"
              required
              placeholder="e.g. april-referral-battle"
              description={
                isSlugLocked
                  ? 'Locked while live because this may already be used in shared contest or leaderboard URLs.'
                  : 'This will be used in the contest URL. Use lowercase letters, numbers, and hyphens only.'
              }
              disabled={disabled || isSlugLocked}
            />

            {isSlugLocked ? (
              <LockedFieldNote>
                The slug cannot be changed while the contest is active because
                participants may already be sharing links that depend on it.
              </LockedFieldNote>
            ) : (
              <EditableFieldNote>
                This field is editable now, but it will lock once the contest
                becomes active.
              </EditableFieldNote>
            )}
          </div>
        </div>

        <TextAreaInput
          name="description"
          label="Contest Description"
          required
          placeholder="Write a short explanation about the contest..."
          description={
            isLiveContest
              ? 'You can update this to clarify rules or instructions without affecting referral tracking.'
              : 'Briefly explain what the contest is about and what participants should expect.'
          }
          rows={5}
          disabled={disabled}
        />

        <div className="space-y-2">
          <FormDropDownInput
            name="visibility"
            label="Visibility"
            required
            options={contestVisibilityDropdownOptions}
            placeholder="Select visibility"
            description={
              isVisibilityLocked
                ? 'Locked while live to avoid suddenly hiding or exposing an active contest.'
                : 'Public contests can be viewed by anyone. Private contests are more restricted.'
            }
            disabled={disabled || isVisibilityLocked}
          />

          {isVisibilityLocked ? (
            <LockedFieldNote>
              Visibility is locked during a live contest so active participants
              do not suddenly lose access to the contest page or leaderboard.
            </LockedFieldNote>
          ) : (
            <EditableFieldNote>
              You can change visibility before launch. Once the contest is live,
              visibility will be locked.
            </EditableFieldNote>
          )}
        </div>
      </div>

      <ContestTimingSection disabled={disabled} isLiveContest={isLiveContest} />

      <div
        className={cn(
          'space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/85 md:p-5',
          isLiveContest && 'md:border-yellow-400/10',
        )}
      >
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Referral and Reward Setup
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            Update the referral prefix, prize details, and number of winners.
            For live contests, referral-code settings are locked, but reward
            communication can still be adjusted.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <TextInput
              name="referral_code_prefix"
              label="Referral Code Prefix"
              required
              placeholder="e.g. REF"
              description={
                isReferralPrefixLocked
                  ? 'Locked while live because referral codes may already exist for active participants.'
                  : 'This prefix will be used when generating participant referral codes.'
              }
              onValueChange={(value) =>
                value.toUpperCase().replace(/[^A-Z0-9]/g, '')
              }
              maxLength={10}
              disabled={disabled || isReferralPrefixLocked}
            />

            {isReferralPrefixLocked ? (
              <LockedFieldNote>
                The referral prefix cannot change during a live contest because
                existing participants may already have referral codes generated
                with this prefix.
              </LockedFieldNote>
            ) : (
              <EditableFieldNote>
                Choose this carefully before launch. It will be locked when the
                contest becomes active.
              </EditableFieldNote>
            )}
          </div>

          <NumberInput
            name="max_winners"
            label="Maximum Winners"
            required
            placeholder="Enter number of winners"
            description={
              isLiveContest
                ? 'This can still be changed, but update it carefully because participants may already know the expected number of winners.'
                : 'Set how many winners this contest should have.'
            }
            inputMode="numeric"
            disabled={disabled}
          />
        </div>

        {isLiveContest ? (
          <div className="rounded-lg border border-neon-blue/15 bg-neon-blue/5 px-3 py-2 text-xs leading-5 text-white/60">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-neon-blue" />
              <span>
                Reward fields are still editable so you can fix typos or clarify
                prize details, but avoid changing the actual reward promise in a
                way that could feel unfair to participants.
              </span>
            </div>
          </div>
        ) : null}

        <TextAreaInput
          name="reward_description"
          label="Reward Description"
          required
          placeholder="e.g. ₦50,000 for 1st place, ₦20,000 for 2nd place..."
          description={
            isLiveContest
              ? 'You can update this to clarify prize details while the contest is live.'
              : 'Describe what winners will receive as clearly as possible.'
          }
          rows={4}
          disabled={disabled}
        />
      </div>

      <div className="flex w-full justify-end">
        <FormButton
          loading={loading}
          disabled={disabled}
          className="md:max-w-100"
        >
          Save Changes
        </FormButton>
      </div>
    </>
  );
};

const ContestTimingSection = ({
  disabled,
  isLiveContest,
}: {
  disabled: boolean;
  isLiveContest: boolean;
}) => {
  const { watch } = useFormContext();
  const contestTimingMode = watch('contest_timing_mode');
  const isAutomatic = contestTimingMode === 'automatic';

  const isTimingModeLocked = isLiveContest;
  const isStartDateLocked = isLiveContest;

  return (
    <div
      className={cn(
        'space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/85 md:p-5',
        isLiveContest && 'md:border-yellow-400/10',
      )}
    >
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-white md:text-base">
          Contest Timing
        </h4>
        <p className="text-xs text-white/55 md:text-sm">
          Choose whether this contest will run manually or use scheduled dates.
          For live contests, timing mode and start date are locked because the
          contest has already started.
        </p>
      </div>

      <div className="space-y-2">
        <FormDropDownInput
          name="contest_timing_mode"
          label="Timing Mode"
          required
          options={contestTimingModeDropdownOptions}
          placeholder="Select timing mode"
          description={
            isTimingModeLocked
              ? 'Locked while live because switching timing mode can affect how the contest starts or ends.'
              : 'Manual means you control the contest yourself. Automatic means the contest follows start and end dates.'
          }
          disabled={disabled || isTimingModeLocked}
        />

        {isTimingModeLocked ? (
          <LockedFieldNote>
            Timing mode cannot be changed while the contest is active. This
            prevents accidental changes between manual and automatic contest
            behavior.
          </LockedFieldNote>
        ) : (
          <EditableFieldNote>
            You can choose manual or automatic timing before the contest goes
            live.
          </EditableFieldNote>
        )}
      </div>

      <div
        className={cn(
          'grid grid-cols-1 gap-4 transition-opacity md:grid-cols-2',
          !isAutomatic && 'pointer-events-none opacity-45',
        )}
      >
        <div className="space-y-2">
          <FormDateTimeInput
            name="start_date"
            label="Start Date"
            required={isAutomatic}
            disabled={disabled || !isAutomatic || isStartDateLocked}
            description={
              isStartDateLocked
                ? 'Locked because this contest has already started.'
                : 'This is when the contest becomes active.'
            }
          />

          {isAutomatic && isStartDateLocked ? (
            <LockedFieldNote>
              Start date is locked after launch so reports and contest history
              remain accurate.
            </LockedFieldNote>
          ) : null}
        </div>

        <div className="space-y-2">
          <FormDateTimeInput
            name="end_date"
            label="End Date"
            required={isAutomatic}
            disabled={disabled || !isAutomatic}
            description={
              isLiveContest
                ? 'You can still adjust the end date to extend or shorten the live contest.'
                : 'This is when the contest should stop accepting entries.'
            }
          />

          {isAutomatic && isLiveContest ? (
            <EditableFieldNote>
              End date remains editable so you can extend or shorten the active
              contest without changing referral links or existing participant
              records.
            </EditableFieldNote>
          ) : null}
        </div>
      </div>

      {!isAutomatic ? (
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs leading-5 text-white/55">
          Manual timing is selected, so start and end dates are not required for
          this contest.
        </div>
      ) : null}
    </div>
  );
};

const EditContestPage = () => {
  const params = useParams<{ contestId: string }>();
  const contestId = params.contestId;

  const { myChannel } = useAuthContext();
  const defaults = myChannel?.contest_defaults;

  const { updateContest, is_updating_contest } = useUpdateContest();

  const formRef = useRef<UseFormReturn<CreateContestFormValues> | null>(null);

  const {
    contest,
    is_getting_contest,
    is_refetching_contest,
    is_getting_contest_error,
    is_contest_not_found,
    get_contest_error,
    refetchContest,
  } = useGetContestById(contestId);

  const isLiveContest = contest?.status === 'active';

  const initialEditContestFormValues = useMemo(
    () => mapContestToEditFormValues(contest, defaults),
    [contest, defaults],
  );

  useEffect(() => {
    if (!contest) return;

    formRef.current?.reset(initialEditContestFormValues);
  }, [contest, initialEditContestFormValues]);

  const handleSubmit = (values: CreateContestFormValues) => {
    const payload = {
      ...values,
      contest_id: contestId,
      start_date:
        values.contest_timing_mode === 'manual' ? null : values.start_date,
      end_date:
        values.contest_timing_mode === 'manual' ? null : values.end_date,
    };

    updateContest(payload);
  };

  if (!contestId) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
        Contest ID was not found in the URL. Please go back to the contests page
        and try again.
      </div>
    );
  }

  if (is_getting_contest) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <PencilIcon className="size-6 text-neon-green" />
            Edit Contest
          </h3>

          <p className="text-xs text-white/45">
            Contest ID: <span className="text-white/70">{contestId}</span>
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-overbg/85 p-6">
          <div className="flex items-center gap-3 text-sm text-white/70">
            <RefreshCw className="size-4 animate-spin text-neon-green" />
            Loading contest details...
          </div>
        </div>
      </div>
    );
  }

  if (is_getting_contest_error) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <PencilIcon className="size-6 text-neon-green" />
            Edit Contest
          </h3>

          <p className="text-xs text-white/45">
            Contest ID: <span className="text-white/70">{contestId}</span>
          </p>
        </div>

        <div className="space-y-4 rounded-xl border border-red-500/20 bg-red-500/10 p-6">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-red-300">
              Unable to load contest
            </h4>

            <p className="text-xs leading-5 text-red-200/80 md:text-sm">
              {getReadableErrorMessage(get_contest_error)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetchContest()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/30 bg-red-500/15 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className="size-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (is_contest_not_found || !contest) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <PencilIcon className="size-6 text-neon-green" />
            Edit Contest
          </h3>

          <p className="text-xs text-white/45">
            Contest ID: <span className="text-white/70">{contestId}</span>
          </p>
        </div>

        <div className="space-y-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-yellow-300">
              Contest not found
            </h4>

            <p className="text-xs leading-5 text-yellow-100/75 md:text-sm">
              We could not find a contest with this ID. It may have been
              deleted, or the link may be incorrect.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetchContest()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-yellow-400/30 bg-yellow-500/15 px-4 py-2 text-xs font-semibold text-yellow-100 transition hover:bg-yellow-500/25"
          >
            <RefreshCw className="size-4" />
            Check Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <PencilIcon className="size-6 text-neon-green" />
          Edit Contest
        </h3>

        <p className="text-xs text-white/45">
          Contest: <span className="text-white/70">{contest?.title}</span>
        </p>
      </div>

      {is_refetching_contest ? (
        <p className="text-xs text-muted-foreground">
          Refreshing contest data...
        </p>
      ) : null}

      <FormShell
        defaultValues={initialEditContestFormValues}
        onSubmit={handleSubmit}
        schema={createContestSchema}
        className="space-y-6 py-4"
      >
        {(form) => {
          formRef.current = form;

          return (
            <EditContestFormFields
              loading={is_updating_contest}
              disabled={is_getting_contest || is_updating_contest}
              isLiveContest={isLiveContest}
            />
          );
        }}
      </FormShell>
    </div>
  );
};

export default EditContestPage;
