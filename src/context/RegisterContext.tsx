'use client';

import {
  createContext,
  useContext,
  useEffect,
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

const REGISTER_STORAGE_KEY = 'refcore-register-form';

const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

function getStoredRegisterData() {
  if (typeof window === 'undefined') {
    return {
      step: 1,
      formData: initialFormData,
    };
  }

  const savedData = sessionStorage.getItem(REGISTER_STORAGE_KEY);

  if (!savedData) {
    return {
      step: 1,
      formData: initialFormData,
    };
  }

  try {
    const parsed = JSON.parse(savedData) as {
      step?: number;
      formData?: RegisterFormData;
    };

    return {
      step: parsed.step ?? 1,
      formData: parsed.formData ?? initialFormData,
    };
  } catch (error) {
    console.error('Failed to parse register session data:', error);

    return {
      step: 1,
      formData: initialFormData,
    };
  }
}

export function RegisterProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<number>(() => getStoredRegisterData().step);
  const [formData, setFormData] = useState<RegisterFormData>(
    () => getStoredRegisterData().formData,
  );

  useEffect(() => {
    sessionStorage.setItem(
      REGISTER_STORAGE_KEY,
      JSON.stringify({
        step,
        formData,
      }),
    );
  }, [step, formData]);

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
    sessionStorage.removeItem(REGISTER_STORAGE_KEY);
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