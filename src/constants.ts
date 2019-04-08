import Decimal from 'decimal.js';

export const EMPTY_FIELD = '--';

export const DATE_FORMATS: { date: string, date_value: string } = {
  date: 'MM/DD/YY',
  date_value: 'YYYY-MM-DD',
};

export const CENT_DECIMAL = new Decimal('100');
