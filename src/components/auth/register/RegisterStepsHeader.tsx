'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { Button } from '../ui/button';

type RegisterStepsHeaderProps = {
  step: number;
  totalSteps?: number;
  onBack?: () => void;
  onNext?: () => void;
  showBack?: boolean;
  showNext?: boolean;
  nextDisabled?: boolean;
  className?: string;
};

const RegisterStepsHeader = ({
  step,
  totalSteps = 3,
  // onBack,
  onNext,
  // showBack = true,
  showNext = false,
  nextDisabled = false,
  className,
}: RegisterStepsHeaderProps) => {
  return (
    <div className={cn('w-full space-y-5', className)}>
      <div className="flex items-center justify-between gap-4">
        {/* <Button
          type="button"
          onClick={onBack}
          disabled={!showBack || step === 1}
          className={cn(
            'inline-flex h-11 bg-transparent items-center gap-2 rounded-full border px-4 text-sm font-medium transition md:h-12 md:px-5 md:text-base',
            step === 1 || !showBack
              ? 'cursor-not-allowed border-border bg-secondary text-muted-foreground opacity-50'
              : 'border-border bg-secondary text-foreground hover:border-(--neon-green)/40 hover:text-(--neon-green)',
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button> */}

        <p className="text-sm font-medium text-muted-foreground md:text-base">
          <span className="text-foreground">{step}</span> of {totalSteps}
        </p>

        {showNext ? (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className={cn(
              'inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-black transition md:h-12 md:px-5 md:text-base',
              nextDisabled
                ? 'cursor-not-allowed bg-(--neon-green)/40 opacity-50'
                : 'bg-(--neon-green) hover:opacity-90 neon-green',
            )}
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <div className="w-22 md:w-24.5" />
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const barStep = index + 1;
          const active = barStep <= step;

          return (
            <div
              key={barStep}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300 md:h-2',
                active ? 'bg-(--neon-green) neon-green' : 'bg-border',
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RegisterStepsHeader;