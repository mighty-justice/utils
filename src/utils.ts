import Decimal from 'decimal.js';

import { CENT_DECIMAL } from './constants';

export function insertIf (condition: boolean, element: any): any[] {
  return condition ? [element] : [];
}

export function getPercentValue (value?: null | string): string {
  if (typeof value === 'undefined' || value === null || value === '') { return ''; }
  return new Decimal(value).div(CENT_DECIMAL).toString();
}

export function getPercentDisplay (value?: null | string): string {
  if (typeof value === 'undefined' || value === null || value === '') { return ''; }
  return new Decimal(value).times(CENT_DECIMAL).toString();
}
