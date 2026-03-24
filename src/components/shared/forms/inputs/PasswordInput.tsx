'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import BaseFormInput from './BaseFormInput';
import { cn } from '@/lib/utils';

type PasswordInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  autoComplete?: string;
};

const PasswordInput = ({
  autoComplete = 'current-password',
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <BaseFormInput
      {...props}
      type={showPassword ? 'text' : 'password'}
      autoComplete={autoComplete}
      rightAdornment={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-full text-white/55 transition',
            'hover:bg-white/8 hover:text-[#00ff9d]',
            'focus:outline-none focus:ring-2 focus:ring-[#00ff9d]/25',
          )}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <Eye className="h-4 w-4 md:h-5 md:w-5" />
          )}
        </button>
      }
    />
  );
};

export default PasswordInput;