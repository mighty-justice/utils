import { DATE_FORMATS } from './constants';
import { formatDate } from './formatting';

export function insertIf (condition: boolean, element: any): any[] {
  return condition ? [element] : [];
}

export function dateToday () {
  return formatDate((new Date()).toISOString(), DATE_FORMATS.date_value);
}

export function getExtension (fileName?: string) {
  return fileName && fileName.split('?')[0].split('#')[0].split('.').pop();
}
