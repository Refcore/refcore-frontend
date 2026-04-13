'use client';

import * as React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type BaseFormInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  rightAdornment?: React.ReactNode;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  onValueChange?: (value: string) => string;
  onBlur?: (value: string) => void;
};

const BaseFormInput = ({
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  type = 'text',
  className,
  labelClassName,
  inputClassName,
  descriptionClassName,
  errorClassName,
  rightAdornment,
  autoComplete,
  inputMode,
  maxLength,
  onValueChange,
  onBlur,
}: BaseFormInputProps) => {
  const { control } = useFormContext();

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label ? (
        <label
          htmlFor={name}
          className={cn(
            'inline-flex items-center gap-1 text-sm font-medium text-white/90 md:text-base',
            labelClassName,
          )}
        >
          <span>{label}</span>
          {required ? <span className="text-[#00ff9d]">*</span> : null}
        </label>
      ) : null}

      <div className="relative">
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          {...field}
          value={field.value ?? ''}
          className={cn(
            'h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35',
            'transition-all duration-200',
            'focus-visible:border-[#00ff9d]/50 focus-visible:ring-[3px] focus-visible:ring-[#00ff9d]/15',
            'md:h-13 md:px-5 md:text-base',
            rightAdornment ? 'pr-12' : '',
            error
              ? 'border-red-400/60 focus-visible:border-red-400/60 focus-visible:ring-red-400/15'
              : '',
            inputClassName,
          )}
          inputMode={inputMode}
          maxLength={maxLength}
          onChange={(event) => {
            const nextValue = onValueChange
              ? onValueChange(event.target.value)
              : event.target.value;

            field.onChange(nextValue);
          }}
          onBlur={(event) => {
            field.onBlur();
            onBlur?.(event.target.value);
          }}
        />

        {rightAdornment ? (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {rightAdornment}
          </div>
        ) : null}
      </div>

      {description && !error ? (
        <p
          className={cn(
            'text-xs leading-5 text-white/50 md:text-sm',
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}

      {error ? (
        <p
          className={cn(
            'text-xs font-medium leading-5 text-red-400 md:text-sm',
            errorClassName,
          )}
        >
          {error.message}
        </p>
      ) : null}
    </div>
  );
};

export default BaseFormInput;
