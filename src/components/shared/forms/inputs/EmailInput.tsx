'use client';

import BaseFormInput from './BaseFormInput';

type EmailInputProps = {
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

const EmailInput = (props: EmailInputProps) => {
  return (
    <BaseFormInput
      type="email"
      autoComplete={props.autoComplete ?? 'email'}
      {...props}
    />
  );
};

export default EmailInput;