import { isPast, isValid, parseISO } from 'date-fns';

export function isValidDate(value: string) {
  return (
    !value ||
    (value.length === '####-##-##'.length && // ISO date
      isValid(parseISO(value))) // Real day
  );
}

export function isValidPastDate(value: string) {
  return (
    !value || (isValidDate(value) && isPast(parseISO(value))) // In the past
  );
}
