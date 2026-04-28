'use client';

import React from 'react';
import { Settings2, Trophy, Hash, Eye, Clock3 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import FormShell from '@/components/shared/forms/FormShell';
import FormButton from '@/components/shared/forms/FormButton';
import TextInput from '@/components/shared/forms/inputs/TextInput';
import TextAreaInput from '@/components/shared/forms/inputs/TextAreaInput';
import {
  contestDefaultsSchema,
  type ContestDefaultsFormValues,
  getInitialContestDefaultsFormValues,
} from '@/schema/contestDefaults.schema';
import { ContestDefaults } from '@/types/contest.type';
import {
  contestTimingModeDropdownOptions,
  contestVisibilityDropdownOptions,
} from '@/schema/contest.schema';
import NumberInput from '@/components/shared/forms/inputs/NumberInput';
import FormDropDownInput from '@/components/shared/forms/inputs/FormDropDownInput';
import { useUpdateContestDefaults } from '@/hooks/admin/channel/useUpdateContestDefaults';

type ContestDefaultsSectionProps = {
  contestDefaults?: ContestDefaults | null;
};

const ContestDefaultsFormContent = ({ loading }: { loading: boolean }) => {
  const {
    formState: { isSubmitting },
  } = useFormContext<ContestDefaultsFormValues>();

  return (
    <>
      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/50 md:p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Default Contest Preferences
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            These values will be used to prefill new contest forms by default.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormDropDownInput
            name="visibility"
            label="Default Visibility"
            placeholder="Select visibility"
            options={contestVisibilityDropdownOptions}
            description="Choose the default visibility for newly created contests."
            leftAdornment={<Eye className="size-4 text-white/45" />}
          />

          <FormDropDownInput
            name="contest_timing_mode"
            label="Default Timing Mode"
            placeholder="Select timing mode"
            options={contestTimingModeDropdownOptions}
            description="Choose how contests should be configured by default."
            leftAdornment={<Clock3 className="size-4 text-white/45" />}
          />

          <TextInput
            name="referral_code_prefix"
            label="Default Referral Code Prefix"
            placeholder="Enter referral code prefix"
            description="This prefix will be used as the default when creating contests."
            onValueChange={(value) =>
              value.toUpperCase().replace(/[^A-Z0-9]/g, '')
            }
            rightAdornment={<Hash className="size-4 text-white/45" />}
          />

          <NumberInput
            name="max_winners"
            label="Default Maximum Winners"
            placeholder="Enter number of winners"
            description="Set the default number of winners for new contests."
            inputMode="numeric"
            rightAdornment={<Trophy className="size-4 text-white/45" />}
          />

          <div className="md:col-span-2">
            <TextAreaInput
              name="reward_description"
              label="Default Reward Description"
              placeholder="Describe the default reward for your contests"
              description="This reward text will be prefilled when creating a new contest."
              maxLength={300}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <FormButton
          className="md:max-w-100"
          loading={isSubmitting || loading}
          disabled={isSubmitting || loading}
        >
          Save Changes
        </FormButton>
      </div>
    </>
  );
};

const ContestDefaultsSection = ({
  contestDefaults,
}: ContestDefaultsSectionProps) => {
  const initialContestDefaultsFormValues =
    getInitialContestDefaultsFormValues(contestDefaults);

  const { updateContestDefaults, loading } = useUpdateContestDefaults();

  const handleSubmit = (values: ContestDefaultsFormValues) => {
    console.log(values);
    updateContestDefaults(values);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/85 md:p-5">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Settings2 className="size-5 text-neon-green" />
            Contest Defaults
          </h3>
          <p className="text-xs text-white/55 md:text-sm">
            Configure the default contest values that should appear whenever you
            create a new contest.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Default Visibility</p>
            <p className="mt-2 text-sm font-medium capitalize text-white">
              {contestDefaults?.visibility ?? 'Public'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Default Timing Mode</p>
            <p className="mt-2 text-sm font-medium capitalize text-white">
              {contestDefaults?.contest_timing_mode ?? 'Manual'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Default Max Winners</p>
            <p className="mt-2 text-sm font-medium text-white">
              {contestDefaults?.max_winners ?? 1}
            </p>
          </div>
        </div>
      </div>

      <FormShell
        defaultValues={initialContestDefaultsFormValues}
        onSubmit={handleSubmit}
        schema={contestDefaultsSchema}
        className="space-y-6 py-4"
      >
        <ContestDefaultsFormContent loading={loading} />
      </FormShell>
    </div>
  );
};

export default ContestDefaultsSection;
