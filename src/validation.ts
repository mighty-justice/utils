import { isBefore, isValid } from 'date-fns';

export function isValidDate (value: string): boolean {
  return !value || (
      value.length === '####-##-##'.length // ISO date
      && isValid(new Date(value)) // Real day
    );
}

export function isValidPastDate (value: string) {
  return !value || (
      isValidDate(value)
      && isBefore(value, new Date()) // In the past
    );
}
