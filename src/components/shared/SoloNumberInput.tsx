'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SoloNumberInputProps = {
  value?: string | number | null;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

const SoloNumberInput = ({
  value,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  loading = false,
  className,
  labelClassName,
  inputClassName,
  descriptionClassName,
  errorClassName,
  leftAdornment,
  rightAdornment,
  min,
  max,
  step,
  error,
  onChange,
  onBlur,
}: SoloNumberInputProps) => {
  const isDisabled = disabled || loading;

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label ? (
        <label
          className={cn(
            'inline-flex items-center gap-1 text-sm font-medium text-white/90 md:text-base',
            labelClassName,
          )}
        >
          <span>{label}</span>
          {required ? <span className="text-[#00ff9d]">*</span> : null}
        </label>
      ) : null}

      <div className="relative flex">
        {leftAdornment ? (
          <div className="pointer-events-none mr-2 flex items-center text-white/45">
            {leftAdornment}
          </div>
        ) : null}
        <Input
          type="number"
          value={value ?? ''}
          placeholder={placeholder}
          disabled={isDisabled}
          aria-invalid={!!error}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(
            'h-12 rounded-xl border-2 border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35',
            'transition-all duration-200',
            'focus-visible:border-[#00ff9d]/50 focus-visible:ring-[3px] focus-visible:ring-[#00ff9d]/15',
            'md:h-13 md:px-5 md:text-base',
            'hide-number-arrows',
            leftAdornment ? 'pl-12' : '',
            rightAdornment || loading ? 'pr-12' : '',
            isDisabled ? 'cursor-not-allowed opacity-70' : '',
            error
              ? 'border-red-400/60 focus-visible:border-red-400/60 focus-visible:ring-red-400/15'
              : '',
            inputClassName,
          )}
        />

        {loading ? (
          <div className="pointer-events-none flex items-center text-white/45">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : rightAdornment ? (
          <div className="pointer-events-none flex items-center text-white/45">
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
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default SoloNumberInput;
