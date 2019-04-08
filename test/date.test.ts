import * as util from '../src';

describe('date', () => {
  it('isFutureDate', () => {
    expect(util.isFutureDate('2019-04-08')).toEqual(false);
    expect(util.isFutureDate('1998-01-01')).toEqual(false);
    expect(util.isFutureDate('2998-01-01')).toEqual(true);
  });

  it('inferCentury', () => {
    expect(util.inferCentury('00')).toBe('2000');
    expect(util.inferCentury('19')).toBe('2019');
    expect(util.inferCentury('50')).toBe('1950');
    expect(util.inferCentury('98')).toBe('1998');

    expect(util.inferCentury('9')).toBe('9');
    expect(util.inferCentury('998')).toBe('998');
    expect(util.inferCentury('1998')).toBe('1998');
  });
});
