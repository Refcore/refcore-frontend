
'use client';

import * as React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type MultiselectOption =
  | string
  | {
      label: string;
      value: string;
    };

type NormalizedOption = {
  label: string;
  value: string;
};

type FormMultiselectInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  triggerClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  options: MultiselectOption[];
};

const normalizeOptions = (
  options: MultiselectOption[],
): NormalizedOption[] => {
  return options.map((option) =>
    typeof option === 'string'
      ? {
          label: option,
          value: option,
        }
      : option,
  );
};

const FormMultiselectInput = ({
  name,
  label,
  placeholder = 'Select options',
  description,
  required = false,
  disabled = false,
  className,
  labelClassName,
  triggerClassName,
  descriptionClassName,
  errorClassName,
  options,
}: FormMultiselectInputProps) => {
  const { control } = useFormContext();
  const normalizedOptions = React.useMemo(
    () => normalizeOptions(options),
    [options],
  );

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [open, setOpen] = React.useState(false);

  const selectedValues: string[] = Array.isArray(field.value) ? field.value : [];

  const selectedOptions = normalizedOptions.filter((option) =>
    selectedValues.includes(option.value),
  );

  const handleToggle = (value: string) => {
    const exists = selectedValues.includes(value);

    if (exists) {
      field.onChange(selectedValues.filter((item) => item !== value));
      return;
    }

    field.onChange([...selectedValues, value]);
  };

  const handleRemove = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: string,
  ) => {
    event.stopPropagation();
    field.onChange(selectedValues.filter((item) => item !== value));
  };

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

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={name}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              'h-auto min-h-12 w-full justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white',
              'hover:bg-white/5 hover:text-white',
              'focus-visible:border-[#00ff9d]/50 focus-visible:ring-[3px] focus-visible:ring-[#00ff9d]/15',
              'md:min-h-13 md:px-5 md:text-base',
              error
                ? 'border-red-400/60 focus-visible:border-red-400/60 focus-visible:ring-red-400/15'
                : '',
              triggerClassName,
            )}
          >
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs text-white md:text-sm"
                  >
                    <span>{option.label}</span>
                    <button
                      type="button"
                      onClick={(event) => handleRemove(event, option.value)}
                      className="text-white/60 transition-colors hover:text-white"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-white/35">{placeholder}</span>
              )}
            </div>

            <ChevronDown className="ml-3 size-4 shrink-0 text-white/50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) rounded-xl border border-white/10 bg-[#13131a] p-2"
        >
          <div className="space-y-1">
            {normalizedOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggle(option.value)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-white transition-colors',
                    'hover:bg-white/5',
                    isSelected ? 'bg-white/5' : '',
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected ? (
                    <Check className="size-4 text-[#00ff9d]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

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

export default FormMultiselectInput;