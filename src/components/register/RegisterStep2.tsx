'use client';

import React, { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useRegister } from '@/context/RegisterContext';
import {
  registerWorkspaceSchema,
  type RegisterWorkspaceFormData,
} from '@/schema/register.schema';
import { Sparkles } from 'lucide-react';
import TextInput from '../shared/forms/inputs/TextInput';
import FormButton from '../shared/forms/FormButton';
import FormShell from '../shared/forms/FormShell';

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const normalizeWhatsappNumber = (value: string) => {
  const cleaned = value.replace(/[^\d+]/g, '').trim();

  if (cleaned.startsWith('+234')) {
    const digits = cleaned.slice(4).replace(/\D/g, '').slice(0, 10);
    return `+234${digits}`;
  }

  const digitsOnly = cleaned.replace(/\D/g, '');

  if (digitsOnly.startsWith('0')) {
    return digitsOnly.slice(0, 11);
  }

  return digitsOnly.slice(0, 10);
};

const RegisterStep2Fields = () => {
  const form = useFormContext<RegisterWorkspaceFormData>();
  const tvName = useWatch({ control: form.control, name: 'tvName' });

  useEffect(() => {
    if (form.formState.dirtyFields.slug) return;
    if (form.getValues('tvName') === '') return;

    form.setValue('slug', generateSlug(tvName ?? ''), {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [tvName, form]);

  return (
    <>
      <TextInput
        name="tvName"
        label="WhatsApp TV name"
        placeholder="Enter your WhatsApp TV name"
        required
        autoComplete="organization"
      />

      <TextInput
        name="whatsappNumber"
        label="WhatsApp number"
        placeholder="+2348012345678"
        description="Use a valid Nigerian WhatsApp number. OTP will be sent to this number next."
        required
        autoComplete="tel"
        inputMode="numeric"
        maxLength={14}
        onValueChange={normalizeWhatsappNumber}
      />

      <TextInput
        name="slug"
        label="Public slug"
        placeholder="e.g lagos-gist-tv"
        description="This is generated from your TV name. You can still edit it."
        required
        autoComplete="off"
      />

      <div className="pt-3">
        <FormButton>Continue</FormButton>
      </div>
    </>
  );
};

const RegisterStep2 = () => {
  const { formData, updateForm, nextStep } = useRegister();

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Set up your WhatsApp TV
        </h1>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">
          Enter your TV details below. An OTP will be sent to your WhatsApp
          number on the next step for verification.
        </p>
      </div>

      <div className="rounded-2xl border border-(--neon-green)/20 bg-(--neon-green)/5 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--neon-green)/15">
            <Sparkles className="h-4 w-4 text-(--neon-green)" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground md:text-base">
              Verification notice
            </p>
            <p className="text-xs leading-5 text-muted-foreground md:text-sm">
              Make sure the WhatsApp number you enter is active and accessible.
              You will use the OTP sent to it in the final step.
            </p>
          </div>
        </div>
      </div>

      <FormShell
        schema={registerWorkspaceSchema}
        defaultValues={{
          tvName: formData.tvName,
          whatsappNumber: formData.whatsappNumber,
          slug: formData.slug,
        }}
        onSubmit={(values) => {
          updateForm(values);
          nextStep();
        }}
        className="space-y-5"
      >
        <RegisterStep2Fields />
      </FormShell>
    </div>
  );
};

export default RegisterStep2;
