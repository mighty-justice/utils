import Decimal from 'decimal.js';

import { CENT_DECIMAL, DATE_FORMATS } from './constants';
import { formatDate } from './formatting';

export function insertIf (condition: boolean, element: any): any[] {
  return condition ? [element] : [];
}

export function dateToday () {
  return formatDate((new Date()).toISOString(), DATE_FORMATS.date_value);
}

export function getPercentValue (value?: null | string): string {
  if (typeof value === 'undefined' || value === null || value === '') { return ''; }
  const decimal = new Decimal(value).div(CENT_DECIMAL);
  return decimal.toString();
}

export function getPercentDisplay (value?: null | string): string {
  if (typeof value === 'undefined' || value === null || value === '') { return ''; }
  const decimal = new Decimal(value).times(CENT_DECIMAL);
  return decimal.toString();
}
