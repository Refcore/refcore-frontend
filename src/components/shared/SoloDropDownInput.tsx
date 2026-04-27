'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
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

type SoloDropDownInputProps = {
  value?: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  labelClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  options: readonly DropdownOption[];
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  error?: string;
  onChange?: (value: string) => void;
};

const normalizeOptions = (
  options: readonly DropdownOption[],
): NormalizedOption[] => {
  return options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option,
  );
};

const SoloDropDownInput = ({
  value = '',
  label,
  placeholder = 'Select an option',
  description,
  required = false,
  disabled = false,
  loading = false,
  className,
  labelClassName,
  triggerClassName,
  contentClassName,
  itemClassName,
  descriptionClassName,
  errorClassName,
  options,
  rightAdornment,
  leftAdornment,
  error,
  onChange,
}: SoloDropDownInputProps) => {
  const normalizedOptions = React.useMemo(
    () => normalizeOptions(options),
    [options],
  );

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

      <Select value={value} onValueChange={onChange} disabled={isDisabled}>
        <SelectTrigger
          aria-invalid={!!error}
          className={cn(
            'h-12 rounded-lg border-2 border-white/10 bg-white/5 px-4 text-sm text-white',
            'placeholder:text-white/35',
            'transition-all duration-200',
            'focus:border-[#00ff9d]/50 focus:ring-[3px] focus:ring-[#00ff9d]/15',
            'data-placeholder:text-white/35',
            'md:h-13 md:px-5 md:text-base',

            isDisabled ? 'cursor-not-allowed opacity-70' : '',
            error
              ? 'border-red-400/60 focus:border-red-400/60 focus:ring-red-400/15'
              : '',
            triggerClassName,
          )}
        >
          <div className="relative flex w-full items-center">
            {leftAdornment ? (
              <div className="pointer-events-none flex mr-2 items-center text-white/45">
                {leftAdornment}
              </div>
            ) : null}

            <div className="min-w-0 flex-1">
              <SelectValue placeholder={placeholder} />
            </div>

            {loading ? (
              <div className="pointer-events-none absolute right-6 flex items-center text-white/45">
                <Loader2 className="size-4 animate-spin" />
              </div>
            ) : rightAdornment ? (
              <div className="pointer-events-none flex ml-2 items-center text-white/45">
                {rightAdornment}
              </div>
            ) : null}
          </div>
        </SelectTrigger>

        <SelectContent
          className={cn(
            'w-60 rounded-xl border border-white/10 bg-[#13131a] p-2 text-white',
            contentClassName,
          )}
        >
          {normalizedOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={cn(
                'my-3 w-full cursor-pointer rounded-lg px-3 text-sm text-white',
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
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default SoloDropDownInput;
