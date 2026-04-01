'use client';

import React, { useEffect } from 'react';
import RegisterStep1 from '@/components/register/RegisterStep1';
import RegisterStep2 from '@/components/register/RegisterStep2';
import RegisterStep3 from '@/components/register/RegisterStep3';
import RegisterStepsHeader from '@/components/register/RegisterStepsHeader';
import { useRegister } from '@/context/RegisterContext';
import { useAuthContext } from '@/context/AuthContext';
import { AUTH_ROUTES } from '@/routes';
import Link from 'next/link';

const RegisterPage = () => {
  const { step: currentStep, setStep, prevStep } = useRegister();
  const { registrationStep, isLoading, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      setStep(registrationStep);
    }
  }, [isLoading, registrationStep, setStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RegisterStep1 />;
      case 2:
        return <RegisterStep2 />;
      case 3:
        return <RegisterStep3 />;
      default:
        return <RegisterStep1 />;
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="w-screen max-w-3xl py-8 md:px-6 md:py-10">
      <div className="flex w-full items-center">
        <div className="w-full rounded-2xl p-4 md:glass md:border-2 md:border-border md:p-8">
          <RegisterStepsHeader
            step={currentStep}
            onBack={prevStep}
            showBack={isAuthenticated && currentStep > 1}
          />

          <div className="mt-8 w-full md:mt-10">{renderStep()}</div>
        </div>
      </div>

      {!isAuthenticated && (
        <p className="mt-4 px-4 md:px-0">
          Already have an account?{' '}
          <Link
            className="cursor-pointer text-green-500 underline"
            href={AUTH_ROUTES.LOGIN}
          >
            Login
          </Link>
        </p>
      )}
    </div>
  );
};

export default RegisterPage;
