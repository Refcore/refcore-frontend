'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useController, useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type FormDateTimeInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  dateTriggerClassName?: string;
  timeInputClassName?: string;
};

const FormDateTimeInput = ({
  name,
  label,
  placeholder = 'Select date',
  description,
  required = false,
  disabled = false,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  dateTriggerClassName,
  timeInputClassName,
}: FormDateTimeInputProps) => {
  const { control } = useFormContext();
  const [open, setOpen] = React.useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const parsedValue = React.useMemo(() => {
    if (!field.value) return null;

    const date = new Date(field.value);
    return Number.isNaN(date.getTime()) ? null : date;
  }, [field.value]);

  const selectedDate = parsedValue ?? undefined;
  const timeValue = parsedValue ? format(parsedValue, 'HH:mm:ss') : '';

  const updateDateTime = ({
    nextDate,
    nextTime,
  }: {
    nextDate?: Date;
    nextTime?: string;
  }) => {
    const baseDate = nextDate ?? selectedDate;

    if (!baseDate) {
      field.onChange('');
      return;
    }

    const [hours, minutes, seconds] = ((nextTime ?? timeValue) || '00:00:00')
      .split(':')
      .map((part) => Number(part));

    const mergedDate = new Date(baseDate);
    mergedDate.setHours(hours || 0, minutes || 0, seconds || 0, 0);

    field.onChange(mergedDate.toISOString());
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label ? (
        <label
          htmlFor={`${name}-time`}
          className={cn(
            'inline-flex items-center gap-1 text-sm font-medium text-white/90 md:text-base',
            labelClassName,
          )}
        >
          <span>{label}</span>
          {required ? <span className="text-[#00ff9d]">*</span> : null}
        </label>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="w-full sm:flex-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                aria-invalid={!!error}
                className={cn(
                  'h-12 w-full justify-between rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-normal text-white',
                  'hover:bg-white/5 hover:text-white',
                  'focus-visible:border-[#00ff9d]/50 focus-visible:ring-[3px] focus-visible:ring-[#00ff9d]/15',
                  'md:h-13 md:px-5 md:text-base',
                  error
                    ? 'border-red-400/60 focus-visible:border-red-400/60 focus-visible:ring-red-400/15'
                    : '',
                  dateTriggerClassName,
                )}
              >
                <span className="truncate">
                  {selectedDate ? format(selectedDate, 'PPP') : placeholder}
                </span>
                <ChevronDownIcon className="size-4 shrink-0 text-white/50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto overflow-hidden rounded-xl border border-white/10 bg-[#13131a] p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                captionLayout="dropdown"
                defaultMonth={selectedDate}
                onSelect={(date) => {
                  if (!date) return;
                  updateDateTime({ nextDate: date });
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full sm:w-40">
          <Input
            id={`${name}-time`}
            type="time"
            step="1"
            disabled={disabled}
            value={timeValue}
            aria-invalid={!!error}
            className={cn(
              'h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35',
              'transition-all duration-200',
              'focus-visible:border-[#00ff9d]/50 focus-visible:ring-[3px] focus-visible:ring-[#00ff9d]/15',
              'appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
              'md:h-13 md:px-5 md:text-base',
              error
                ? 'border-red-400/60 focus-visible:border-red-400/60 focus-visible:ring-red-400/15'
                : '',
              timeInputClassName,
            )}
            onChange={(event) => {
              updateDateTime({ nextTime: event.target.value });
            }}
          />
        </div>
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

export default FormDateTimeInput;