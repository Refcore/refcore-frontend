'use client';

import React from 'react';
import { useRegister } from '@/context/RegisterContext';
import { registerAccountSchema } from '@/schema/register.schema';
import FormShell from '../shared/forms/FormShell';
import TextInput from '../shared/forms/inputs/TextInput';
import EmailInput from '../shared/forms/inputs/EmailInput';
import PasswordInput from '../shared/forms/inputs/PasswordInput';
import FormButton from '../shared/forms/FormButton';

const RegisterStep1 = () => {
  const { formData, updateForm, nextStep } = useRegister();

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
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }}
        onSubmit={(values) => {
          updateForm(values);
          nextStep();
        }}
        className="space-y-5"
      >
        <TextInput
          name="fullName"
          label="Full name"
          placeholder="Enter your full name"
          required
          autoComplete="name"
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
          <FormButton type="button" validateOnClick onClick={() => nextStep()}>
            Continue
          </FormButton>
        </div>
      </FormShell>
    </div>
  );
};

export default RegisterStep1;
