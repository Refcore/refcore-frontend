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
  initialCreateContestFormValues,
} from '@/schema/contest.schema';
import { PlusSquare } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import React from 'react';
import { cn } from '@/lib/utils';
import NumberInput from '@/components/shared/forms/inputs/NumberInput';

const CreateContestFormFields = () => {
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
      <div className="space-y-4 md:rounded-xl md:border md:border-white/10 md:bg-white/5 border-b pb-10 md:p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Basic Information
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            Set the main details people will see when viewing this contest.
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
          />

          <TextInput
            name="slug"
            label="Contest Slug"
            required
            placeholder="e.g. april-referral-battle"
            description="This will be used in the contest URL. Use lowercase letters, numbers, and hyphens only."
          />
        </div>

        <TextAreaInput
          name="description"
          label="Contest Description"
          required
          placeholder="Write a short explanation about the contest..."
          description="Briefly explain what the contest is about and what participants should expect."
          rows={5}
        />

        <FormDropDownInput
          name="visibility"
          label="Visibility"
          required
          options={contestVisibilityDropdownOptions}
          placeholder="Select visibility"
          description="Public contests can be viewed by anyone. Private contests are more restricted."
        />
      </div>

      <ContestTimingSection />

      <div className="space-y-4 md:rounded-xl md:border md:border-white/10 md:bg-white/5 border-b pb-10 md:p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Referral and Reward Setup
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            Define the referral prefix, prize details, and number of winners.
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
          />

          <NumberInput
            name="max_winners"
            label="Maximum Winners"
            required
            placeholder="Enter number of winners"
            description="Set how many winners this contest should have."
            inputMode="numeric"
          />
        </div>

        <TextAreaInput
          name="reward_description"
          label="Reward Description"
          required
          placeholder="e.g. ₦50,000 for 1st place, ₦20,000 for 2nd place..."
          description="Describe what winners will receive as clearly as possible."
          rows={4}
        />
      </div>
      <div className="w-full flex justify-end">
        <FormButton className="md:max-w-100"> Create </FormButton>
      </div>
    </>
  );
};

const ContestTimingSection = () => {
  const { watch } = useFormContext();
  const contestTimingMode = watch('contest_timing_mode');
  const isAutomatic = contestTimingMode === 'automatic';

  return (
    <div className="space-y-4 md:rounded-xl md:border md:border-white/10 md:bg-white/5 border-b pb-10 md:p-5">
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
      />

      <div
        className={cn(
          'grid grid-cols-1 gap-4 md:grid-cols-2 transition-opacity',
          !isAutomatic && 'pointer-events-none opacity-45',
        )}
      >
        <FormDateTimeInput
          name="start_date"
          label="Start Date"
          required={isAutomatic}
          disabled={!isAutomatic}
          description="This is when the contest becomes active."
        />

        <FormDateTimeInput
          name="end_date"
          label="End Date"
          required={isAutomatic}
          disabled={!isAutomatic}
          description="This is when the contest should stop accepting entries."
        />
      </div>
    </div>
  );
};

const CreateContestPage = () => {
  const handleSubmit = (values: CreateContestFormValues) => {
    const payload = {
      ...values,
      start_date:
        values.contest_timing_mode === 'manual' ? null : values.start_date,
      end_date:
        values.contest_timing_mode === 'manual' ? null : values.end_date,
    };

    console.log(payload);
  };

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
        <PlusSquare className="size-6 text-neon-green" />
        Create Contest
      </h3>

      <FormShell
        defaultValues={initialCreateContestFormValues}
        onSubmit={handleSubmit}
        schema={createContestSchema}
        className="space-y-6 py-4"
      >
        <CreateContestFormFields />
      </FormShell>
    </div>
  );
};

export default CreateContestPage;
