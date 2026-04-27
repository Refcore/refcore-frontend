'use client';

import * as React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type FormToggleProps = {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  switchClassName?: string;
  onCheckedChange?: (checked: boolean) => void;
};

const FormToggle = ({
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  switchClassName,
  onCheckedChange,
}: FormToggleProps) => {
  const { control } = useFormContext();

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const checked = Boolean(field.value);

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div
        className={cn(
          'flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200',
          error ? 'border-red-400/60' : '',
          disabled ? 'opacity-70' : '',
        )}
      >
        <div className="min-w-0 flex-1 space-y-1">
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

          {description ? (
            <p
              className={cn(
                'text-xs leading-5 text-white/50 md:text-sm',
                descriptionClassName,
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        <Switch
          id={name}
          checked={checked}
          disabled={disabled}
          onCheckedChange={(nextChecked) => {
            field.onChange(nextChecked);
            onCheckedChange?.(nextChecked);
          }}
          onBlur={field.onBlur}
          className={cn(
            'data-[state=checked]:bg-[#00ff9d] data-[state=unchecked]:bg-white/15',
            'border border-white/10',
            switchClassName,
          )}
          aria-invalid={!!error}
        />
      </div>

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

export default FormToggle;