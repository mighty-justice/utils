import Decimal from 'decimal.js';

export const EMPTY_FIELD = '--';

export const DATE_FORMATS: { date: string; date_value: string; time: string; } = {
  date: 'MM/DD/YY',
  date_value: 'YYYY-MM-DD',
  time: 'h:mmA', // ex. 2:24PM
};

export const CENT_DECIMAL = new Decimal('100');

export const RE_ALPHA = /[^A-Za-z]/g;
export const RE_WORDS = /[A-Za-z0-9\u00C0-\u00FF+]+[^\s-]*/g;
export const RE_SMALL_WORDS = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
