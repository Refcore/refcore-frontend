'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormShell from '@/components/shared/forms/FormShell';
import EmailInput from '@/components/shared/forms/inputs/EmailInput';
import PasswordInput from '@/components/shared/forms/inputs/PasswordInput';
import FormButton from '@/components/shared/forms/FormButton';
import { loginSchema, LoginFormData } from '@/schema/login.schema';
import { useLogin } from '@/hooks/auth/useLogin';
import { toast } from 'sonner';
import { ADMIN_ROUTES, AUTH_ROUTES } from '@/routes';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';


const LoginPage = () => {
  const router = useRouter();
  const { loading, login } = useLogin();
    const { isAuthenticated } = useAuthContext();

  const handleSubmit = async (values: LoginFormData) => {
    const response = await login(values);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    router.replace(ADMIN_ROUTES.HOME);
    router.refresh();
  };

    useEffect(() => {
      if (isAuthenticated) {
        router.replace(ADMIN_ROUTES.HOME);
      }
    }, [isAuthenticated, router]);
  
    if (isAuthenticated) {
      return null;
    }

  return (
    <div className="w-screen max-w-3xl py-8 md:px-6 md:py-10 md:glass px-4 md:border-2 rounded-xl mt-6 space-y-4">
      <div className="space-y-4 text-center md:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Welcome back
        </h1>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">
          Sign in to continue to your REFCORE dashboard.
        </p>
      </div>

      <FormShell
        schema={loginSchema}
        defaultValues={{
          email: '',
          password: '',
        }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
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
          placeholder="Enter your password"
          required
          autoComplete="current-password"
        />

        <div className="pt-3">
          <FormButton loadingText='' loading={loading}>Sign in</FormButton>
        </div>
      </FormShell>
      <p>Don&apos;t have an account? <Link className='text-green-500 underline cursor-pinter' href={AUTH_ROUTES.REGISTER}>Register here</Link></p>
    </div>
  );
};

export default LoginPage;