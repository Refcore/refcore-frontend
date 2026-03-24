export const toE164Nigeria = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '');

  if (digitsOnly.startsWith('234')) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.startsWith('0')) {
    return `+234${digitsOnly.slice(1)}`;
  }

  return `+234${digitsOnly}`;
};