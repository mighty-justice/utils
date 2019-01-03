import { DATE_FORMATS } from './constants';
import { formatDate } from './formattingUtils';

export function insertIf (condition: boolean, element: any): any[] {
  return condition ? [element] : [];
}

export function dateToday () {
  return formatDate((new Date()).toISOString(), DATE_FORMATS.date_value);
}
