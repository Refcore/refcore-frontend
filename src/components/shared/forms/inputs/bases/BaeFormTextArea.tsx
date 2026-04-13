'use client';

import * as React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type BaseFormTextAreaProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  textareaClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  rows?: number;
  maxLength?: number;
  onValueChange?: (value: string) => string;
};

const BaseFormTextArea = ({
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  className,
  labelClassName,
  textareaClassName,
  descriptionClassName,
  errorClassName,
  rows = 5,
  maxLength,
  onValueChange,
}: BaseFormTextAreaProps) => {
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

      <Textarea
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        rows={rows}
        {...field}
        value={field.value ?? ''}
        maxLength={maxLength}
        className={cn(
          'min-h-32 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35',
          'transition-all duration-200',
          'focus-visible:border-[#00ff9d]/50 focus-visible:ring-[3px] focus-visible:ring-[#00ff9d]/15',
          'md:px-5 md:text-base',
          error
            ? 'border-red-400/60 focus-visible:border-red-400/60 focus-visible:ring-red-400/15'
            : '',
          textareaClassName,
        )}
        onChange={(event) => {
          const nextValue = onValueChange
            ? onValueChange(event.target.value)
            : event.target.value;

          field.onChange(nextValue);
        }}
      />

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

export default BaseFormTextArea;