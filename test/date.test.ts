import { inferCentury, isFutureDate } from '../src/date';

describe('date', () => {
  it('isFutureDate', () => {
    expect(isFutureDate('2019-04-08')).toEqual(false);
    expect(isFutureDate('1998-01-01')).toEqual(false);
    expect(isFutureDate('2998-01-01')).toEqual(true);
  });

  it('inferCentury', () => {
    expect(inferCentury('00')).toBe('2000');
    expect(inferCentury('19')).toBe('2019');
    expect(inferCentury('50')).toBe('1950');
    expect(inferCentury('98')).toBe('1998');

    expect(inferCentury('9')).toBe('9');
    expect(inferCentury('998')).toBe('998');
    expect(inferCentury('1998')).toBe('1998');
  });
});
