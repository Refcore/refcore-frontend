'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import { PencilIcon, RefreshCw } from 'lucide-react';
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
import { useGetContestById } from '@/hooks/admin/contests/useGetContestId';

type ContestForEdit = Partial<CreateContestFormValues> & {
  id: string;
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

const EditContestFormFields = ({
  loading,
  disabled,
}: {
  loading: boolean;
  disabled: boolean;
}) => {
  const { getValues, setValue } = useFormContext();

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
      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/85 md:p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Basic Information
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            Update the main details people will see when viewing this contest.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            name="title"
            label="Contest Title"
            required
            placeholder="Enter contest title"
            description="Use a clear name that helps you identify this contest easily."
            onBlur={handleTitleBlur}
            disabled={disabled}
          />

          <TextInput
            name="slug"
            label="Contest Slug"
            required
            placeholder="e.g. april-referral-battle"
            description="This will be used in the contest URL. Use lowercase letters, numbers, and hyphens only."
            disabled={disabled}
          />
        </div>

        <TextAreaInput
          name="description"
          label="Contest Description"
          required
          placeholder="Write a short explanation about the contest..."
          description="Briefly explain what the contest is about and what participants should expect."
          rows={5}
          disabled={disabled}
        />

        <FormDropDownInput
          name="visibility"
          label="Visibility"
          required
          options={contestVisibilityDropdownOptions}
          placeholder="Select visibility"
          description="Public contests can be viewed by anyone. Private contests are more restricted."
          disabled={disabled}
        />
      </div>

      <ContestTimingSection disabled={disabled} />

      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/85 md:p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Referral and Reward Setup
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            Update the referral prefix, prize details, and number of winners.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            name="referral_code_prefix"
            label="Referral Code Prefix"
            required
            placeholder="e.g. REF"
            description="This prefix will be used when generating participant referral codes."
            onValueChange={(value) =>
              value.toUpperCase().replace(/[^A-Z0-9]/g, '')
            }
            maxLength={10}
            disabled={disabled}
          />

          <NumberInput
            name="max_winners"
            label="Maximum Winners"
            required
            placeholder="Enter number of winners"
            description="Set how many winners this contest should have."
            inputMode="numeric"
            disabled={disabled}
          />
        </div>

        <TextAreaInput
          name="reward_description"
          label="Reward Description"
          required
          placeholder="e.g. ₦50,000 for 1st place, ₦20,000 for 2nd place..."
          description="Describe what winners will receive as clearly as possible."
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

const ContestTimingSection = ({ disabled }: { disabled: boolean }) => {
  const { watch } = useFormContext();
  const contestTimingMode = watch('contest_timing_mode');
  const isAutomatic = contestTimingMode === 'automatic';

  return (
    <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/85 md:p-5">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-white md:text-base">
          Contest Timing
        </h4>
        <p className="text-xs text-white/55 md:text-sm">
          Choose whether this contest will run manually or use scheduled dates.
        </p>
      </div>

      <FormDropDownInput
        name="contest_timing_mode"
        label="Timing Mode"
        required
        options={contestTimingModeDropdownOptions}
        placeholder="Select timing mode"
        description="Manual means you control the contest yourself. Automatic means the contest follows start and end dates."
        disabled={disabled}
      />

      <div
        className={cn(
          'grid grid-cols-1 gap-4 transition-opacity md:grid-cols-2',
          !isAutomatic && 'pointer-events-none opacity-45',
        )}
      >
        <FormDateTimeInput
          name="start_date"
          label="Start Date"
          required={isAutomatic}
          disabled={disabled || !isAutomatic}
          description="This is when the contest becomes active."
        />

        <FormDateTimeInput
          name="end_date"
          label="End Date"
          required={isAutomatic}
          disabled={disabled || !isAutomatic}
          description="This is when the contest should stop accepting entries."
        />
      </div>
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
    is_getting_contest_error,
    get_contest_error,
    refetchContest,
  } = useGetContestById(contestId);

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

  if (!contest) {
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
            />
          );
        }}
      </FormShell>
    </div>
  );
};

export default EditContestPage;
