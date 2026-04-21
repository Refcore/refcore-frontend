'use client';

import BaseFormInput from './bases/BaseFormInput';

type InputProps = {
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
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  onValueChange?: (value: string) => string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
};

const NumberInput = (props: InputProps) => {
  return <BaseFormInput type="number" {...props} />;
};

export default NumberInput;
