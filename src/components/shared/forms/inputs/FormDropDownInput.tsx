'use client';

import * as React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type DropdownOption =
  | string
  | {
      label: string;
      value: string;
    };

type NormalizedOption = {
  label: string;
  value: string;
};

type FormDropDownInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  options: DropdownOption[];
  defaultValue?: string;
};

const normalizeOptions = (
  options: DropdownOption[],
): NormalizedOption[] => {
  return options.map((option) =>
    typeof option === 'string'
      ? { label: option, value: option }
      : option,
  );
};

const FormDropDownInput = ({
  name,
  label,
  placeholder = 'Select an option',
  description,
  required = false,
  disabled = false,
  className,
  labelClassName,
  triggerClassName,
  contentClassName,
  itemClassName,
  descriptionClassName,
  errorClassName,
  options,
  defaultValue,
}: FormDropDownInputProps) => {
  const { control } = useFormContext();

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const normalizedOptions = React.useMemo(
    () => normalizeOptions(options),
    [options],
  );

  const safeValue = typeof field.value === 'string' ? field.value : '';

  React.useEffect(() => {
    if (safeValue) return;
    if (!defaultValue) return;

    const exists = normalizedOptions.some(
      (option) => option.value === defaultValue,
    );

    if (!exists) return;

    field.onChange(defaultValue);
  }, [defaultValue, field, normalizedOptions, safeValue]);

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

      <Select
        value={safeValue}
        onValueChange={field.onChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={name}
          aria-invalid={!!error}
          className={cn(
            'h-12 rounded-lg border-2 border-white/10 bg-white/5 px-4 text-sm text-white',
            'placeholder:text-white/35',
            'transition-all duration-200',
            'focus:border-[#00ff9d]/50 focus:ring-[3px] focus:ring-[#00ff9d]/15',
            'data-placeholder:text-white/35',
            'md:h-13 md:px-5 md:text-base',
            error
              ? 'border-red-400/60 focus:border-red-400/60 focus:ring-red-400/15'
              : '',
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          className={cn(
            'rounded-xl border border-white/10 bg-[#13131a] text-white w-60 p-2',
            contentClassName,
          )}
        >
          {normalizedOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={cn(
                'cursor-pointer rounded-lg text-sm text-white my-3 px-3 w-full',
                'focus:bg-white/5 focus:text-white',
                'data-[state=checked]:bg-white/5 data-[state=checked]:text-[#00ff9d]',
                'md:text-base',
                itemClassName,
              )}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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

export default FormDropDownInput;