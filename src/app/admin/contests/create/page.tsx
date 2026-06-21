'use client';

import FormButton from '@/components/shared/forms/FormButton';
import FormShell from '@/components/shared/forms/FormShell';
import FormDateTimeInput from '@/components/shared/forms/inputs/FormDateTimeInput';
import FormDropDownInput from '@/components/shared/forms/inputs/FormDropDownInput';
import TextAreaInput from '@/components/shared/forms/inputs/TextAreaInput';
import TextInput from '@/components/shared/forms/inputs/TextInput';
import {
  contestTimingModeDropdownOptions,
  contestVisibilityDropdownOptions,
  CreateContestFormValues,
  createContestSchema,
  getInitialCreateContestFormValues,
} from '@/schema/contest.schema';
import {
  Info,
  Link2,
  LockKeyhole,
  PlusSquare,
  ShieldCheck,
} from 'lucide-react';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import React, { useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import NumberInput from '@/components/shared/forms/inputs/NumberInput';
import { useAuthContext } from '@/context/AuthContext';
import { useCreateContest } from '@/hooks/admin/contests/useCreateContest';

const PreLaunchNotice = () => {
  return (
    <div className="rounded-xl border border-neon-blue/20 bg-neon-blue/10 p-4">
      <div className="flex gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-neon-blue/10">
          <ShieldCheck className="size-5 text-neon-blue" />
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white">
            Set link-sensitive fields carefully before launch.
          </h4>

          <p className="text-xs leading-5 text-white/60 md:text-sm">
            Once a contest becomes live, some fields will be locked to protect
            referral links, participant access, referral codes, and contest
            history. You will still be able to update display text, prize
            details, winner count, and the end date later.
          </p>
        </div>
      </div>
    </div>
  );
};

const FieldInfoNote = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs leading-5 text-white/55">
      <Info className="mt-0.5 size-3.5 shrink-0 text-neon-blue" />
      <span>{children}</span>
    </div>
  );
};

const LockedAfterLaunchNote = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-yellow-400/15 bg-yellow-500/5 px-3 py-2 text-xs leading-5 text-yellow-100/70">
      <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-yellow-300" />
      <span>{children}</span>
    </div>
  );
};

const CreateContestFormFields = ({ loading }: { loading: boolean }) => {
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
      <PreLaunchNotice />

      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/85 md:p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Basic Information
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            These details control how the contest appears to participants and
            how people access the contest publicly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <TextInput
              name="title"
              label="Contest Title"
              required
              placeholder="Enter contest title"
              description="This is the display name participants and admins will see across the dashboard, leaderboard, and contest pages."
              onBlur={handleTitleBlur}
            />

            <FieldInfoNote>
              You can still update the title after the contest goes live because
              it does not break referral tracking or public URLs.
            </FieldInfoNote>
          </div>

          <div className="space-y-2">
            <TextInput
              name="slug"
              label="Contest Slug"
              required
              placeholder="e.g. april-referral-battle"
              description="This becomes part of the contest URL. Use lowercase letters, numbers, and hyphens only."
            />

            <LockedAfterLaunchNote>
              The slug will be locked once the contest is live because changing
              it later can break contest links or leaderboard links already
              shared by participants.
            </LockedAfterLaunchNote>
          </div>
        </div>

        <TextAreaInput
          name="description"
          label="Contest Description"
          required
          placeholder="Write a short explanation about the contest..."
          description="Explain what the contest is about, how participants should join, and any important instructions they need to understand before sharing their referral link."
          rows={5}
        />

        <div className="space-y-2">
          <FormDropDownInput
            name="visibility"
            label="Visibility"
            required
            options={contestVisibilityDropdownOptions}
            placeholder="Select visibility"
            description="Public contests can be viewed by anyone with the link. Private contests are more restricted and are better for controlled campaigns."
          />

          <LockedAfterLaunchNote>
            Visibility will be locked once the contest is live so active
            participants do not suddenly lose access to the contest page or
            leaderboard.
          </LockedAfterLaunchNote>
        </div>
      </div>

      <ContestTimingSection />

      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/85 md:p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Referral and Reward Setup
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            Define how referral codes are generated, what winners receive, and
            how many participants can win.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <TextInput
              name="referral_code_prefix"
              label="Referral Code Prefix"
              required
              placeholder="e.g. REF"
              description="This prefix is used when generating participant referral codes. For example, REF001, REF002, or similar depending on your code format."
              onValueChange={(value) =>
                value.toUpperCase().replace(/[^A-Z0-9]/g, '')
              }
              maxLength={10}
            />

            <LockedAfterLaunchNote>
              The referral prefix will be locked once the contest is live
              because participants may already have referral codes generated
              with this prefix.
            </LockedAfterLaunchNote>
          </div>

          <div className="space-y-2">
            <NumberInput
              name="max_winners"
              label="Maximum Winners"
              required
              placeholder="Enter number of winners"
              description="This controls how many top participants should be considered winners when the contest ends."
              inputMode="numeric"
            />

            <FieldInfoNote>
              You can still update this after launch, but it is best to set it
              carefully before participants start competing.
            </FieldInfoNote>
          </div>
        </div>

        <div className="space-y-2">
          <TextAreaInput
            name="reward_description"
            label="Reward Description"
            required
            placeholder="e.g. ₦50,000 for 1st place, ₦20,000 for 2nd place..."
            description="Clearly describe the prize structure, reward amount, and any important conditions winners should know."
            rows={4}
          />

          <FieldInfoNote>
            Reward description can be edited later to fix typos or clarify
            details, but avoid changing the actual prize promise after the
            contest is live.
          </FieldInfoNote>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <FormButton loading={loading} className="md:max-w-100">
          Create
        </FormButton>
      </div>
    </>
  );
};

const ContestTimingSection = () => {
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
          Choose how the contest should become active and when it should stop
          accepting entries.
        </p>
      </div>

      <div className="space-y-2">
        <FormDropDownInput
          name="contest_timing_mode"
          label="Timing Mode"
          required
          options={contestTimingModeDropdownOptions}
          placeholder="Select timing mode"
          description="Manual means you will start and end the contest yourself. Automatic means the system will use the start and end dates."
        />

        <LockedAfterLaunchNote>
          Timing mode will be locked once the contest is live because switching
          between manual and automatic can affect how the contest starts, ends,
          and accepts referrals.
        </LockedAfterLaunchNote>
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
            disabled={!isAutomatic}
            description="This is when an automatic contest should become active and start accepting entries."
          />

          {isAutomatic ? (
            <LockedAfterLaunchNote>
              Start date will be locked after launch so contest reports and
              participant history remain accurate.
            </LockedAfterLaunchNote>
          ) : null}
        </div>

        <div className="space-y-2">
          <FormDateTimeInput
            name="end_date"
            label="End Date"
            required={isAutomatic}
            disabled={!isAutomatic}
            description="This is when an automatic contest should stop accepting new entries and referrals."
          />

          {isAutomatic ? (
            <FieldInfoNote>
              End date can still be adjusted later if you need to extend or
              shorten a live contest.
            </FieldInfoNote>
          ) : null}
        </div>
      </div>

      {!isAutomatic ? (
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs leading-5 text-white/55">
          <div className="flex items-start gap-2">
            <Link2 className="mt-0.5 size-3.5 shrink-0 text-neon-blue" />
            <span>
              Manual timing is selected, so start and end dates are disabled.
              You will control when this contest becomes active or ends from the
              contest actions.
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const CreateContestPage = () => {
  const { myChannel } = useAuthContext();

  const { createContest, loading } = useCreateContest();

  const defaults = myChannel?.contest_defaults;

  const formRef = useRef<UseFormReturn<CreateContestFormValues> | null>(null);

  const initialCreateContestFormValues = useMemo(
    () => getInitialCreateContestFormValues(defaults),
    [defaults],
  );

  const handleSubmit = (values: CreateContestFormValues) => {
    const payload = {
      ...values,
      start_date:
        values.contest_timing_mode === 'manual' ? null : values.start_date,
      end_date:
        values.contest_timing_mode === 'manual' ? null : values.end_date,
    };

    createContest(payload, () => {
      formRef.current?.reset(initialCreateContestFormValues);
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
        <PlusSquare className="size-6 text-neon-green" />
        Create Contest
      </h3>

      <FormShell
        defaultValues={getInitialCreateContestFormValues(defaults)}
        onSubmit={handleSubmit}
        schema={createContestSchema}
        className="space-y-6 py-4"
      >
        {(form) => {
          formRef.current = form;

          return <CreateContestFormFields loading={loading} />;
        }}
      </FormShell>
    </div>
  );
};

export default CreateContestPage;
