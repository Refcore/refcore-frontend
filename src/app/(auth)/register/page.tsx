'use client';

import React from 'react';
import RegisterStep1 from '@/components/register/RegisterStep1';
import RegisterStep2 from '@/components/register/RegisterStep2';
import RegisterStep3 from '@/components/register/RegisterStep3';
import RegisterStepsHeader from '@/components/register/RegisterStepsHeader';
import { useRegister } from '@/context/RegisterContext';

const RegisterPage = () => {
  const { step, prevStep } = useRegister();

  const renderStep = () => {
    switch (step) {
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

  return (
    <main className="py-8 md:px-6 md:py-10 w-screen max-w-3xl">
      <div className="flex w-full items-center">
        <div className="md:glass w-full rounded-2xl md:border md:border-border p-4 md:p-8">
          <RegisterStepsHeader
            step={step}
            onBack={prevStep}
            showBack={step > 1}
          />

          <div className="mt-8 md:mt-10 w-full">{renderStep()}</div>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;