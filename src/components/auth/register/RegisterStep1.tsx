'use client';

import React from 'react';
import { useRegister } from '@/context/RegisterContext';
import {
  RegisterAccountFormData,
  registerAccountSchema,
} from '@/schema/register.schema';
import FormShell from '../../shared/forms/FormShell';
import TextInput from '../../shared/forms/inputs/TextInput';
import EmailInput from '../../shared/forms/inputs/EmailInput';
import PasswordInput from '../../shared/forms/inputs/PasswordInput';
import FormButton from '../../shared/forms/FormButton';
import { useCreateUser } from '@/hooks/auth/useCreateUser';

const RegisterStep1 = () => {
  const { formData, updateForm, nextStep } = useRegister();
  const { loading, createUser } = useCreateUser();

  const handleSubmit = async (values: RegisterAccountFormData) => {
    updateForm(values);

    const response = await createUser(values);

    if (!response.success) {
      console.log(response.message);
      return;
    }

    nextStep();
  };

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Create your account
        </h1>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">
          Start by setting up your REFCORE admin account.
        </p>
      </div>

      <FormShell
        schema={registerAccountSchema}
        defaultValues={{
          user_name: formData.user_name,
          email: formData.email,
          password: formData.password,
        }}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <TextInput
          name="user_name"
          label="Username"
          placeholder="Enter preffred Username"
          required
          autoComplete="username"
        />

        <EmailInput
          name="email"
          label="Email address"
          placeholder="Enter your email address"
          required
          autoComplete="email"
        />

        <PasswordInput
          name="password"
          label="Password"
          placeholder="Create a password"
          required
          autoComplete="new-password"
          description="Use at least 8 characters."
        />

        <PasswordInput
          name="confirmPassword"
          label="Confirm password"
          placeholder="Re-enter your password"
          required
          autoComplete="new-password"
        />

        <div className="pt-3">
          <FormButton loading={loading}>Continue</FormButton>
        </div>
      </FormShell>
    </div>
  );
};

export default RegisterStep1;
