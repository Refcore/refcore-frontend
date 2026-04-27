'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type SoloToggleProps = {
  checked?: boolean;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  switchClassName?: string;
  error?: string;
  onInfo?: string;
  offInfo?: string;
  onCheckedChange?: (checked: boolean) => void;
};

const SoloToggle = ({
  checked = false,
  label,
  description,
  required = false,
  disabled = false,
  loading = false,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  switchClassName,
  error,
  onInfo = 'On',
  offInfo = 'Off',
  onCheckedChange,
}: SoloToggleProps) => {
  const isDisabled = disabled || loading;

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div
        className={cn(
          'flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200',
          error ? 'border-red-400/60' : '',
          isDisabled ? 'opacity-70' : '',
        )}
      >
        <div className="min-w-0 flex-1 space-y-2">
          {label ? (
            <div
              className={cn(
                'inline-flex items-center gap-1 text-sm font-medium text-white/90 md:text-base',
                labelClassName,
              )}
            >
              <span>{label}</span>
              {required ? <span className="text-[#00ff9d]">*</span> : null}
            </div>
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

          <div className="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] font-medium text-white/65 md:text-xs">
            {checked ? onInfo : offInfo}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {loading ? (
            <Loader2 className="size-4 animate-spin text-white/45" />
          ) : null}

          <Switch
            checked={checked}
            disabled={isDisabled}
            onCheckedChange={onCheckedChange}
            className={cn(
              'data-[state=checked]:bg-[#00ff9d] data-[state=unchecked]:bg-white/15',
              'border border-white/10',
              switchClassName,
            )}
            aria-invalid={!!error}
          />
        </div>
      </div>

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

export default SoloToggle;
