'use client';

import React from 'react';
import { Settings2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import FormButton from '@/components/shared/forms/FormButton';
import FormShell from '@/components/shared/forms/FormShell';
import TextInput from '@/components/shared/forms/inputs/TextInput';
import {
  AccountSettingsFormValues,
  accountSettingsSchema,
  getInitialAccountSettingsFormValues,
} from '@/schema/accountSettingsSchema';
import { User } from '@/model/user.model';
import UploadProfilePicture from './UploadProfilePicture';

type AccountSettingsSectionProps = {
  user: User;
};

const AccountSettingsFormContent = () => {
  const {
    formState: { isDirty, isSubmitting, isValid },
  } = useFormContext<AccountSettingsFormValues>();

  return (
    <>
      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-white/5 md:p-5">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white md:text-base">
            Profile Information
          </h4>
          <p className="text-xs text-white/55 md:text-sm">
            Update your account details and profile picture used across your
            REFCORE admin experience.
          </p>
        </div>
        <div className="space-y-5">
          <UploadProfilePicture
            name="profile_picture"
            label="Profile Picture"
            description="Upload a PNG, JPG, or WEBP image up to 5MB."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextInput
              name="user_name"
              label="Username"
              required
              placeholder="Enter username"
              description="This is the username shown across your account."
            />
            <TextInput
              name="email"
              label="Email Address"
              placeholder="Enter email address"
              description="Your account email address."
              disabled
            />
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <FormButton
          className="md:max-w-100"
          disabled={!isDirty || !isValid || isSubmitting}
        >
          Save Changes
        </FormButton>
      </div>
    </>
  );
};

const AccountSettingsSection = ({ user }: AccountSettingsSectionProps) => {
  if (!user) return;

  const initialAccountSettingsFormValues =
    getInitialAccountSettingsFormValues(user);

  const handleSubmit = (values: AccountSettingsFormValues) => {
    console.log(values);
  };

  const joinedAt = new Date(user?.created_at);

  const formattedJoinedAt = Number.isNaN(joinedAt.getTime())
    ? user?.created_at
    : new Intl.DateTimeFormat('en-NG', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(joinedAt);

  return (
    <div className="space-y-6">
      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-white/5 md:p-5">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Settings2 className="size-5 text-neon-green" />
            Account Settings
          </h3>
          <p className="text-xs text-white/55 md:text-sm">
            Manage your personal account details and profile appearance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Email</p>
            <p className="mt-2 text-sm font-medium text-white">
              {user.email ?? 'No email provided'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Username</p>
            <p className="mt-2 text-sm font-medium text-white">
              {user.user_name ?? 'No username set'}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Joined</p>
            <p className="mt-2 text-sm font-medium text-white">
              {formattedJoinedAt}
            </p>
          </div>
        </div>
      </div>

      <FormShell
        defaultValues={initialAccountSettingsFormValues}
        onSubmit={handleSubmit}
        schema={accountSettingsSchema}
        className="space-y-6 py-4"
      >
        <AccountSettingsFormContent />
      </FormShell>
    </div>
  );
};

export default AccountSettingsSection;
