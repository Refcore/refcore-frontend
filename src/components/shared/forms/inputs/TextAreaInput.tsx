'use client';

import BaseFormTextArea from './bases/BaeFormTextArea';

type TextAreaInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  textareaClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  rows?: number;
  maxLength?: number;
  onValueChange?: (value: string) => string;
};

const TextAreaInput = (props: TextAreaInputProps) => {
  return <BaseFormTextArea {...props} />;
};

export default TextAreaInput;