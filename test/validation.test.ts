import * as util from '../src';

describe('validation', () => {
  ['isValidDate', 'isValidPastDate'].forEach(utilKey => {
    it(utilKey, () => {
      const utilFn = (util as any)[utilKey];

      expect(utilFn('')).toBe(true);
      expect(utilFn('8')).toBe(false);

      expect(utilFn('8-01-01')).toBe(false);
      expect(utilFn('98-01-01')).toBe(false);
      expect(utilFn('998-01-01')).toBe(false);
      expect(utilFn('1998-1-1')).toBe(false);

      expect(utilFn('0000-00-00')).toBe(false);
      expect(utilFn('0000-00-01')).toBe(false);
      expect(utilFn('0000-01-00')).toBe(false);
      expect(utilFn('0000-01-01')).toBe(true);

      expect(utilFn('0998-01-01')).toBe(true);
      expect(utilFn('1989-11-22')).toBe(true);
      expect(utilFn('1998-01-01')).toBe(true);

      expect(utilFn('2040-01-01')).toBe(utilKey === 'isValidDate');
    });
  });
});
