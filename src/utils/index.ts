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

export const getTimeLeft = (
  startDate: string | Date,
  endDate: string | Date,
) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return 'Invalid date';
  }

  if (now < start) {
    return 'Contest has not started yet';
  }

  const timeLeft = end - now;

  if (timeLeft <= 0) {
    return 'Contest has ended';
  }

  const totalMinutes = Math.floor(timeLeft / (1000 * 60));

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return `${minutes}m`;
};
