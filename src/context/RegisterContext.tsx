'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  initialFormData,
  type RegisterFormData,
} from '@/schema/register.schema';

type RegisterContextType = {
  step: number;
  formData: RegisterFormData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateForm: (data: Partial<RegisterFormData>) => void;
  resetForm: () => void;
};

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export function RegisterProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);

  const updateForm = (data: Partial<RegisterFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const resetForm = () => {
    setStep(1);
    setFormData(initialFormData);
  };

  const value = useMemo(
    () => ({
      step,
      formData,
      setStep,
      nextStep,
      prevStep,
      updateForm,
      resetForm,
    }),
    [step, formData],
  );

  return (
    <RegisterContext.Provider value={value}>
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  const context = useContext(RegisterContext);

  if (!context) {
    throw new Error('useRegister must be used within a RegisterProvider');
  }

  return context;
}