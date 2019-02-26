import Decimal from 'decimal.js';

export const EMPTY_FIELD = '--';

export const TEMPLATE_CHAR = '#';

export const DATE_FORMATS: { [key: string]: string } = {
  date: 'MM/DD/YY',
  date_value: 'YYYY-MM-DD',
};

export const CENT_DECIMAL = new Decimal('100');
