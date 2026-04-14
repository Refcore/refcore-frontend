'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MessageSquareMore } from 'lucide-react';
import { useRegister } from '@/context/RegisterContext';
import { registerOtpSchema } from '@/schema/register.schema';
import { cn } from '@/lib/utils';
import FormShell from '../../shared/forms/FormShell';
import FormButton from '../../shared/forms/FormButton';
import { useGetCurrentUser } from '@/hooks/auth/useGetCurrentUser';

type RegisterOtpFormData = {
  otp: string;
};

type OtpInputGroupProps = {
  name: 'otp';
  length?: number;
};

const OtpInputGroup = ({ name, length = 4 }: OtpInputGroupProps) => {
  const { setValue, watch, formState, trigger } =
    useFormContext<RegisterOtpFormData>();

  const otpValue = watch(name) ?? '';
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = useMemo(
    () =>
      Array.from({ length }, (_, index) => {
        return otpValue[index] ?? '';
      }),
    [length, otpValue],
  );

  const handleChange = async (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(-1);
    const nextDigits = [...digits];

    nextDigits[index] = sanitized;

    const joinedValue = nextDigits.join('');
    setValue(name, joinedValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (sanitized && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    await trigger(name);
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace') {
      if (digits[index]) {
        const nextDigits = [...digits];
        nextDigits[index] = '';

        setValue(name, nextDigits.join(''), {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });

        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();

        const nextDigits = [...digits];
        nextDigits[index - 1] = '';

        setValue(name, nextDigits.join(''), {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = async (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length);

    if (!pasted) return;

    setValue(name, pasted, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    const nextFocusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();

    await trigger(name);
  };

  return (
    <div className="space-y-2">
      <label className="inline-flex items-center gap-1 text-sm font-medium text-white/90 md:text-base">
        <span>OTP code</span>
        <span className="text-(--neon-green)">*</span>
      </label>

      <div className="grid grid-cols-4 gap-3 md:gap-4">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            className={cn(
              'h-14 w-full rounded-2xl border bg-white/5 text-center text-xl font-semibold text-white outline-none transition md:h-16 md:text-2xl',
              'border-white/10 focus:border-(--neon-green)/50 focus:ring-4 focus:ring-(--neon-green)/15',
              formState.errors[name]
                ? 'border-red-400/60 focus:border-red-400/60 focus:ring-red-400/15'
                : '',
            )}
          />
        ))}
      </div>

      {formState.errors[name] ? (
        <p className="text-xs font-medium leading-5 text-red-400 md:text-sm">
          {formState.errors[name]?.message as string}
        </p>
      ) : (
        <p className="text-xs leading-5 text-white/50 md:text-sm">
          Enter the 4-digit code sent to your WhatsApp number.
        </p>
      )}
    </div>
  );
};

const RegisterStep3 = () => {
  const { formData, updateForm } = useRegister();
  const [otpSent, setOtpSent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const { data: currentUser, isLoading, error } = useGetCurrentUser();

console.log({ currentUser, isLoading, error });

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const handleSendOtp = () => {
    setOtpSent(true);
    setSecondsLeft(60);

    // hook your OTP API call here later
    // await sendOtp(formData.whatsappNumber)
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Verify your WhatsApp number
        </h1>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">
          Send an OTP to{' '}
          <span className="text-foreground">{formData.whatsapp_number}</span> and
          enter it below to complete your setup.
        </p>
      </div>

      <div className="rounded-xl border border-(--neon-green)/20 bg-(--neon-green)/5 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--neon-green)/15">
            <MessageSquareMore className="h-4 w-4 text-(--neon-green)" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground md:text-base">
              OTP delivery
            </p>
            <p className="text-xs leading-5 text-muted-foreground md:text-sm">
              Press the button below to send a 4-digit OTP to your WhatsApp. You
              can resend after 60 seconds.
            </p>
          </div>
        </div>
      </div>

      <FormShell
        schema={registerOtpSchema}
        defaultValues={{
          otp: formData.otp,
        }}
        onSubmit={(values) => {
          updateForm(values);

          // hook your verify/register submit here later
          // verify otp then submit full registration payload
          console.log('Final registration payload:', {
            ...formData,
            ...values,
          });

          // resetForm();
        }}
        className="space-y-5"
      >
        {(form) => (
          <>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={secondsLeft > 0}
              className={cn(
                'inline-flex h-12 cursor-pointer w-full items-center justify-center rounded-xl border px-4 text-sm font-medium transition md:h-13 md:text-base',
                secondsLeft > 0
                  ? 'cursor-not-allowed border-border bg-secondary text-muted-foreground opacity-70'
                  : 'border-(--neon-green)/20 bg-(--neon-blue) text-black hover:opacity-90',
              )}
            >
              {secondsLeft > 0
                ? `${otpSent ? 'Resend OTP' : 'Send OTP'} in ${secondsLeft}s`
                : otpSent
                  ? 'Resend OTP'
                  : 'Send OTP'}
            </button>

            <OtpInputGroup name="otp" />

            <div className="pt-3">
              <FormButton disabled={!otpSent || !form.formState.isValid}>
                Complete registration
              </FormButton>
            </div>
          </>
        )}
      </FormShell>
    </div>
  );
};

export default RegisterStep3;
