/* global describe, it, expect */
import * as util from '../src';

// value, display
const TEST_CASES: Array<[string, string]> = [
  ['', ''],
  ['1', '100'],
  ['2', '200'],
  ['0', '0'],
  ['0.5', '50'],
  ['0.55', '55'],
  ['0.555', '55.5'],
  ['0.5555', '55.55'],
];

// display => value
const TO_VALUE_ONLY: Array<[any, string]> = [
  [undefined, ''],
  [null, ''],
  [1, '0.01'],
  [0, '0'],
  [55, '0.55'],
];

// value => display
const TO_DISPLAY_ONLY: Array<[any, string]> = [
  [undefined, ''],
  [null, ''],
  [1, '100'],
  [0, '0'],
  [0.55, '55'],
];

describe('utils', () => {
  TEST_CASES.forEach(([value, display]) => {
    it(`Correctly converts percentage between '${value}' <=> '${display}'`, () => {
      expect(util.getPercentValue(display)).toBe(value);
      expect(util.getPercentDisplay(value)).toBe(display);

      expect(util.getPercentValue(util.getPercentDisplay(value))).toBe(value);
      expect(util.getPercentDisplay(util.getPercentValue(display))).toBe(display);
    });
  });

  TO_VALUE_ONLY.forEach(([display, value]) => {
    it(`Correctly converts percentage from '${display}' => '${value}'`, () => {
      expect(util.getPercentValue(display)).toBe(value);
    });
  });

  TO_DISPLAY_ONLY.forEach(([value, display]) => {
    it(`Correctly converts percentage from '${value}' => '${display}'`, () => {
      expect(util.getPercentDisplay(value)).toBe(display);
    });
  });
});
