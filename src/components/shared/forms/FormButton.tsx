'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FormButtonProps = {
  children: React.ReactNode;
  type?: 'submit' | 'button';
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  validateOnClick?: boolean;
  fullWidth?: boolean;
  loadingText?: string;
};

const FormButton = ({
  children,
  type = 'submit',
  onClick,
  className,
  loading = false,
  disabled = false,
  validateOnClick = false,
  fullWidth = true,
  loadingText = 'Loading...',
}: FormButtonProps) => {
  const form = useFormContext();

  const isDisabled =
    disabled ||
    loading ||
    form.formState.isSubmitting ||
    !form.formState.isValid;

  const handleClick = async () => {
    if (isDisabled) return;

    if (validateOnClick) {
      const isValid = await form.trigger();
      if (!isValid) return;
    }

    onClick?.();
  };

  return (
    <Button
      type={type}
      onClick={type === 'button' ? handleClick : undefined}
      disabled={isDisabled}
      className={cn(
        'h-12 rounded-xl transition md:h-13 md:text-base',
        fullWidth && 'w-full',
        isDisabled
          ? 'cursor-not-allowed bg-(--neon-green)/40 text-black/60 opacity-70 hover:bg-(--neon-green)/40'
          : 'bg-(--neon-green) text-black hover:bg-(--neon-green)/90',
        className,
      )}
    >
      {loading || form.formState.isSubmitting ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin md:h-5 md:w-5" />
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default FormButton;
