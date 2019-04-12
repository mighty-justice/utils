import moment from 'moment';

export function isValidBirthdate (value: string) {
  return !value || (
      value.length === '####-##-##'.length // ISO date
      && moment(value).isValid() // Real day
      && moment(value).isBefore(moment()) // In the past
    );
}
