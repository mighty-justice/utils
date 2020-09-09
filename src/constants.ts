import Decimal from 'decimal.js';

export const EMPTY_FIELD = '--';

export const DATE_FORMATS: { date: string; date_at_time: string; date_value: string } = {
  date: 'MM/DD/YY',
  date_at_time: 'MM/DD/YY @ h:mmA', // ex. 07/14/16 @ 2:24PM
  date_value: 'YYYY-MM-DD',
};

export const CENT_DECIMAL = new Decimal('100');

export const RE_ALPHA = /[^A-Za-z]/g;
export const RE_WORDS = /[A-Za-z0-9\u00C0-\u00FF+]+[^\s-]*/g;
export const RE_SMALL_WORDS = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
