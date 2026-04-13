'use client';

import BaseFormInput from './bases/BaseFormInput';

type TextInputProps = {
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
  onBlur?: (value: string) => void;
};

const TextInput = (props: TextInputProps) => {
  return <BaseFormInput type="text" {...props} />;
};

export default TextInput;
