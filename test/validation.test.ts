import * as util from '../src';

describe('validation', () => {
  it('isValidBirthdate', () => {
    expect(util.isValidBirthdate('')).toBe(true);
    expect(util.isValidBirthdate('8')).toBe(false);

    expect(util.isValidBirthdate('8-01-01')).toBe(false);
    expect(util.isValidBirthdate('98-01-01')).toBe(false);
    expect(util.isValidBirthdate('998-01-01')).toBe(false);
    expect(util.isValidBirthdate('1998-1-1')).toBe(false);

    expect(util.isValidBirthdate('0000-00-00')).toBe(false);
    expect(util.isValidBirthdate('0000-00-01')).toBe(false);
    expect(util.isValidBirthdate('0000-01-00')).toBe(false);
    expect(util.isValidBirthdate('0000-01-01')).toBe(true);

    expect(util.isValidBirthdate('0998-01-01')).toBe(true);
    expect(util.isValidBirthdate('1989-11-22')).toBe(true);
    expect(util.isValidBirthdate('1998-01-01')).toBe(true);
    expect(util.isValidBirthdate('2020-01-01')).toBe(false);
  });
});

