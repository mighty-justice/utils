import { isNumber, isString } from 'lodash';
import Decimal from 'decimal.js';

import { CENT_DECIMAL } from './constants';

export function insertIf<T>(condition: boolean, element: T): T[] {
  return condition ? [element] : [];
}

function _convertibleToDecimalObject(value: unknown): value is Decimal.Value {
  return (isString(value) && value !== '') || isNumber(value) || Decimal.isDecimal(value);
}

export function getPercentValue(value?: unknown): string {
  if (!_convertibleToDecimalObject(value)) {
    return '';
  }
  return new Decimal(value).div(CENT_DECIMAL).toString();
}

export function getPercentDisplay(value?: unknown): string {
  if (!_convertibleToDecimalObject(value)) {
    return '';
  }
  return new Decimal(value).times(CENT_DECIMAL).toString();
}
