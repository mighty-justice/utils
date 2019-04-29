import moment from 'moment';

export function isValidDate (value: string) {
  return !value || (
      value.length === '####-##-##'.length // ISO date
      && moment(value).isValid() // Real day
    );
}

export function isValidPastDate (value: string) {
  return !value || (
      isValidDate(value)
      && moment(value).isBefore(moment()) // In the past
    );
}
