'use client';

import React from 'react';
import { Settings2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import FormButton from '@/components/shared/forms/FormButton';
import FormShell from '@/components/shared/forms/FormShell';
import TextInput from '@/components/shared/forms/inputs/TextInput';
import NumberInput from '@/components/shared/forms/inputs/NumberInput';

import type { MyChannel } from '@/types/channel.type';
import {
  ChannelSettingsFormValues,
  channelSettingsSchema,
  getInitialChannelSettingsFormValues,
} from '@/schema/channelSettings.schema';

type ChannelSettingsSectionProps = {
  channel: MyChannel;
};

const formatVerifiedAt = (value: string | null) => {
  if (!value) return 'Not verified yet';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

const ChannelSettingsFormFields = () => {
  const { getValues, setValue, formState } =
    useFormContext<ChannelSettingsFormValues>();

  const { isDirty, isSubmitting } = formState;

  const handleTvNameBlur = (tvNameValue: string) => {
    const currentSlug = getValues('slug')?.trim();

    if (currentSlug) return;

    const generatedSlug = tvNameValue
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
      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-white/5 md:p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Channel Information
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            Update the main channel details used across your public pages and
            admin experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            name="tv_name"
            label="TV Name"
            required
            placeholder="Enter TV name"
            description="This is the main channel name shown across REFCORE."
            onBlur={handleTvNameBlur}
          />

          <TextInput
            name="slug"
            label="Channel Slug"
            required
            placeholder="e.g. lagos-gist-tv"
            description="This will be used in your public URLs. Use lowercase letters, numbers, and hyphens only."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            name="whatsapp_number"
            label="WhatsApp Number"
            required
            placeholder="+2348012345678"
            description="Use the WhatsApp number connected to this channel."
          />

          <NumberInput
            name="channel_members_limit"
            label="Channel Members Limit"
            placeholder="Enter member limit"
            description="Optional. Leave empty if there is no fixed member limit."
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="flex w-full justify-end">
        <FormButton
          className="md:max-w-100"
          disabled={!isDirty || isSubmitting}
        >
          Save Changes
        </FormButton>
      </div>
    </>
  );
};

const ChannelSettingsSection = ({ channel }: ChannelSettingsSectionProps) => {
  const initialChannelSettingsFormValues =
    getInitialChannelSettingsFormValues(channel);

  const handleSubmit = (values: ChannelSettingsFormValues) => {
    console.log(values);
  };

  const pending = channel.status === 'pending_verification';

  const verified = channel.status === 'active';

  return (
    <div className="space-y-6">
      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-white/5 md:p-5">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Settings2 className="size-5 text-neon-green" />
            Channel Settings
          </h3>
          <p className="text-xs text-white/55 md:text-sm">
            Manage your channel identity, public slug, connected WhatsApp
            number, and current verification status.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div
            className={`rounded-xl border ${pending ? 'border-yellow-500/50 bg-yellow-500/2 p-4' : verified ? 'border-green-500/50 bg-green-500/2 p-4' : 'border-white/10 bg-white/5 p-4'}`}
          >
            <p className="text-xs text-white/50">Status</p>
            <p className="mt-2 text-sm font-medium text-white capitalize">
              {channel.status.replace(/_/g, ' ')}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">WhatsApp Verification</p>
            <p className="mt-2 text-sm font-medium text-white">
              {channel.whatsapp_verified ? 'Verified' : 'Not verified'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Verified At</p>
            <p className="mt-2 text-sm font-medium text-white">
              {formatVerifiedAt(channel.whatsapp_verified_at)}
            </p>
          </div>
        </div>
      </div>

      <FormShell
        defaultValues={initialChannelSettingsFormValues}
        onSubmit={handleSubmit}
        schema={channelSettingsSchema}
        className="space-y-6 py-4"
      >
        <ChannelSettingsFormFields />
      </FormShell>
    </div>
  );
};

export default ChannelSettingsSection;
