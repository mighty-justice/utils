/* global describe, it, expect */
import {
  formatAddress,
  formatAddressMultiline,
  formatCommaSeparatedNumber,
  formatDate,
  formatDateTime,
  formatDelimitedList,
  formatDollars,
  formatDuration,
  formatEmployerIdNumber,
  formatFullName,
  formatMoney,
  formatMoneyInput,
  formatParagraphs,
  formatPercentage,
  formatPhoneNumber,
  formatSocialSecurityNumber,
  formatWebsite, getInitials,
  getNameOrDefault,
  getOrDefault,
  getType,
  mapBooleanToText,
  parseAndPreserveNewlines,
  pluralize,
  splitCommaList,
  splitName,
  stripNonAlpha,
  toKey,
  varToLabel,
} from '../src/formatting';

import { EMPTY_FIELD } from '../src/constants';

const EMPTY_VALUES = [
  '             ',
  ' ',
  '',
  null,
  undefined,
];

describe('formatting', () => {
  [
    formatDate,
    formatDateTime,
    formatDollars,
    formatDuration,
    formatEmployerIdNumber,
    formatMoney,
    formatParagraphs,
    formatPercentage,
    formatPhoneNumber,
    formatSocialSecurityNumber,
    formatWebsite,
    getNameOrDefault,
    getOrDefault,
  ].forEach(formatUtil => {
    it(`${formatUtil.name}: Handles null, undefined, and empty string`, () => {
      EMPTY_VALUES.forEach(emptyValue => {
        expect(formatUtil(emptyValue)).toBe('--');
      });
    });
  });

  it('varToLabel: Converts any string to a human-friendly label', () => {
    expect(varToLabel('')).toBe('');
    expect(varToLabel('case-type')).toBe('Case Type');
    expect(varToLabel('case_type')).toBe('Case Type');
    expect(varToLabel('CaseType')).toBe('Case Type');
    expect(varToLabel('plaintiff.first_name')).toBe('First Name');
    expect(varToLabel('STATE OF INCIDENT')).toBe('State of Incident');
    expect(varToLabel('state_of_incident')).toBe('State of Incident');
    expect(varToLabel('stateOfIncident')).toBe('State of Incident');
  });

  it('splitName: Splits name string into [first, last] array', () => {
    EMPTY_VALUES.forEach(emptyValue => {
      expect(splitName(emptyValue)).toEqual(['', '']);
    });

    expect(splitName('John Smith')).toEqual(['John', 'Smith']);
    expect(splitName('John Smith Sr.')).toEqual(['John', 'Smith Sr.']);
    expect(splitName('Ms. Jane Smithson V')).toEqual(['Ms.', 'Jane Smithson V']);
    expect(splitName('John Smith Jane Smithson II')).toEqual(['John', 'Smith Jane Smithson II']);
    expect(splitName(' John Smith')).toEqual(['John', 'Smith']);
    expect(splitName('John Smith ')).toEqual(['John', 'Smith']);
    expect(splitName('John  Smith')).toEqual(['John', 'Smith']);
    expect(splitName('John')).toEqual(['John', '']);
    expect(splitName('John                          ')).toEqual(['John', '']);
  });

  it('getInitials', () => {
    // Empty inputs
    EMPTY_VALUES.forEach(emptyValue => {
      expect(getInitials(emptyValue)).toBe('');
    });

    // Weird spacing
    expect(getInitials(' Lorem Ipsum')).toEqual('LI');
    expect(getInitials('Lorem Ipsum ')).toEqual('LI');
    expect(getInitials('Lorem                          ')).toEqual('L');
    expect(getInitials('Lorem  Ipsum')).toEqual('LI');

    // Anonymized from production examples
    expect(getInitials('LI Dolor, SIT')).toEqual('LID');
    expect(getInitials('Lorem & Ipsum DOLO')).toEqual('LID');
    expect(getInitials('Lorem & Ipsum')).toEqual('LI');
    expect(getInitials('Lorem + Ipsum Dolor at Sit')).toEqual('LID');
    expect(getInitials('LOREM IPSUM & DOLOR SIT')).toEqual('LID');
    expect(getInitials('Lorem Ipsum and Dolor')).toEqual('LID');
    expect(getInitials('Lorem Ipsum Do.')).toEqual('LID');
    expect(getInitials('Lorem Ipsum Dolor And Sit')).toEqual('LID');
    expect(getInitials('Lorem Ipsum Dolor Sit II')).toEqual('LID');
    expect(getInitials('Lorem Ipsum Dolor')).toEqual('LID');
    expect(getInitials('Lorem Ipsum Dolor, SIT')).toEqual('LID');
    expect(getInitials('Lorem Ipsum of Dolor')).toEqual('LID');
    expect(getInitials('Lorem Ipsum')).toEqual('LI');
    expect(getInitials('Lorem Ipsum, DOL')).toEqual('LI');
    expect(getInitials('Lorem of Ipsum')).toBe('LI');
    expect(getInitials('LOREM OF IPSUM')).toBe('LI');
    expect(getInitials('Lorem')).toEqual('L');
    expect(getInitials('Lorem. Ipsum Dolor S')).toEqual('LID');
    expect(getInitials('LoremIpsum DOL')).toEqual('LID');
    expect(getInitials('LoremIpsum Dolor')).toEqual('LID');
    expect(getInitials('LoremIpsum Dolor, SIT')).toEqual('LID');
    expect(getInitials('of Lorem Ipsum, DOL')).toEqual('LI');
    expect(getInitials('The Lorem Ipsum Dolor')).toEqual('LID');
    expect(getInitials('The Lorem')).toEqual('L');
    expect(getInitials('The of Lorem I. Dolor, SA')).toEqual('LID');
  });

  it('splitCommaList: Splits a comma separated list', () => {
    EMPTY_VALUES.forEach(emptyValue => {
      expect(splitCommaList(emptyValue)).toEqual([]);
    });

    expect(splitCommaList('John, Smith')).toEqual(['John', 'Smith']);
    expect(splitCommaList('John,Smith,Sr.')).toEqual(['John', 'Smith', 'Sr.']);
    expect(splitCommaList('Ms., Jane Smithson V')).toEqual(['Ms.', 'Jane Smithson V']);
    expect(splitCommaList('John Smith, Jane Smithson, II')).toEqual(['John Smith', 'Jane Smithson', 'II']);
    expect(splitCommaList(' John Smith')).toEqual(['John Smith']);
    expect(splitCommaList('John Smith, ')).toEqual(['John Smith']);
    expect(splitCommaList('John Smith')).toEqual(['John Smith']);
    expect(splitCommaList('John,,')).toEqual(['John']);
    expect(splitCommaList('John                          ')).toEqual(['John']);
  });

  it('formatFullName', () => {
    expect(formatFullName('John', '')).toBe('John');
    expect(formatFullName('John', 'Smith')).toBe('John Smith');
    expect(formatFullName('', 'Smith Sr.')).toBe('Smith Sr.');
    expect(formatFullName('John', 'Smith Sr.')).toBe('John Smith Sr.');
  });

  it('formatPhoneNumber', () => {
    // Nonsense should just return
    expect(formatPhoneNumber('+2111 (555)-867-5309')).toBe('+2111 (555)-867-5309');
    expect(formatPhoneNumber('-------')).toBe('-------');
    expect(formatPhoneNumber('5')).toBe('5');
    expect(formatPhoneNumber('867-5309 ext. 4')).toBe('867-5309 ext. 4');
    expect(formatPhoneNumber('1867-5309')).toBe('1867-5309');
    expect(formatPhoneNumber('86753098675309867530')).toBe('86753098675309867530');
    expect(formatPhoneNumber('Call main office')).toBe('Call main office');

    // Digits
    expect(formatPhoneNumber('5309')).toBe('5309');
    expect(formatPhoneNumber('8675309')).toBe('867-5309');
    expect(formatPhoneNumber('5558675309')).toBe('(555) 867-5309');
    expect(formatPhoneNumber('15558675309')).toBe('+1 (555) 867-5309');
    expect(formatPhoneNumber('125558675309')).toBe('+12 (555) 867-5309');

    // Other characters
    expect(formatPhoneNumber(' (555) 867-5309')).toBe('(555) 867-5309');
    expect(formatPhoneNumber('(555) 867-5309')).toBe('(555) 867-5309');
    expect(formatPhoneNumber('(555)-867-5309')).toBe('(555) 867-5309');
    expect(formatPhoneNumber('(555)-8675309')).toBe('(555) 867-5309');
    expect(formatPhoneNumber('(555)8675309')).toBe('(555) 867-5309');
    expect(formatPhoneNumber('---8675309')).toBe('867-5309');
    expect(formatPhoneNumber('-8675309')).toBe('867-5309');
    expect(formatPhoneNumber('86-5309')).toBe('86-5309');
    expect(formatPhoneNumber('555 867 5309')).toBe('(555) 867-5309');
    expect(formatPhoneNumber('555-867-5309')).toBe('(555) 867-5309');
    expect(formatPhoneNumber('555.867.5309')).toBe('(555) 867-5309');
    expect(formatPhoneNumber('867-5309')).toBe('867-5309');
  });

  it('getNameOrDefault', () => {
    EMPTY_VALUES.forEach(emptyValue => {
      expect(getNameOrDefault(emptyValue, {defaultValue: 'custom'})).toBe('custom');
    });

    expect(getNameOrDefault({first_name: 'John', last_name: 'Smith'})).toBe('John Smith');
    expect(getNameOrDefault({name: 'John Smith'})).toBe('John Smith');
    expect(getNameOrDefault({customName: 'John Smith'}, {field: 'customName'})).toBe('John Smith');
    expect(getNameOrDefault({customName: 'John Smith'})).toBe('--');
    expect(getNameOrDefault({first_name: 'John'})).toBe('John');
  });

  it('getOrDefault', () => {
    expect(getOrDefault('Hello')).toBe('Hello');
    expect(getOrDefault('Hello                     ')).toBe('Hello');
    expect(getOrDefault(123)).toBe(123);
    expect(getOrDefault(0)).toBe(0);
  });

  it('formatSocialSecurityNumber', () => {
    expect(formatSocialSecurityNumber('6789')).toBe('6789');
    expect(formatSocialSecurityNumber('123456789')).toBe('123-45-6789');
    expect(formatSocialSecurityNumber('12-345-6789')).toBe('123-45-6789');
    expect(formatSocialSecurityNumber('12345-6789')).toBe('123-45-6789');
    expect(formatSocialSecurityNumber('123-456789')).toBe('123-45-6789');
    expect(formatSocialSecurityNumber('12-34-56-78-9')).toBe('123-45-6789');
  });

  it('formatEmployerIdNumber', () => {
    expect(formatEmployerIdNumber('123456789')).toBe('12-3456789');
    expect(formatEmployerIdNumber('12-345-6789')).toBe('12-3456789');
    expect(formatEmployerIdNumber('12345-6789')).toBe('12-3456789');
    expect(formatEmployerIdNumber('123-456789')).toBe('12-3456789');
    expect(formatEmployerIdNumber('12-34-56-78-9')).toBe('12-3456789');
  });

  it('formatPercentage', () => {
    expect(formatPercentage(0.5)).toBe('50.00%');
    expect(formatPercentage(1.5)).toBe('150.00%');
    expect(formatPercentage(1.0)).toBe('100.00%');
    expect(formatPercentage(0)).toBe('0.00%');
    expect(formatPercentage(0.0395)).toBe('3.95%');
    expect(formatPercentage(0.005)).toBe('0.50%');
    expect(formatPercentage(0.005, 1)).toBe('0.5%');
    expect(formatPercentage(0.005, 4)).toBe('0.5000%');
    expect(formatPercentage(0.12345, 10)).toBe('12.3450000000%');
  });

  it('formatMoney', () => {
    expect(formatMoney(0)).toBe('$0.00');
    expect(formatMoney(0.5)).toBe('$0.50');
    expect(formatMoney(1)).toBe('$1.00');
    expect(formatMoney(1.55)).toBe('$1.55');
    expect(formatMoney(1555333.0)).toBe('$1,555,333.00');
    expect(formatMoney(0)).toBe('$0.00');
  });

  it('formatDollars', () => {
    expect(formatDollars(0)).toBe('$0');
    expect(formatDollars(1)).toBe('$1');
    expect(formatDollars(1.00)).toBe('$1');
    expect(formatDollars(2)).toBe('$2');
    expect(formatDollars(1000)).toBe('$1,000');
    expect(formatDollars(1555333)).toBe('$1,555,333');
  });

  it('formatDate', () => {
    expect(formatDate('2016-10-03')).toBe('10/03/16');
  });

  it('formatDateTime', () => {
    expect(formatDateTime('2008-09-22T13:57:31.2311892')).toBe('09/22/08 @ 1:57PM');
  });

  it('mapBooleanToText: Maps booleans to yes and no', () => {
    expect(mapBooleanToText(true)).toBe('Yes');
    expect(mapBooleanToText(false)).toBe('No');
    expect(mapBooleanToText(null)).toBe('--');
    expect(mapBooleanToText(undefined)).toBe('--');
    expect(mapBooleanToText(undefined, {mapUndefinedToNo: false})).toBe('--');
    expect(mapBooleanToText(undefined, {mapUndefinedToNo: true})).toBe('No');
  });

  it('formatMoneyInput: Gets value from a money input with commas', () => {
    expect(formatMoneyInput('1,222.00')).toBe(1222);
    expect(formatMoneyInput(null)).toBe(null);
    expect(formatMoneyInput(undefined)).toBe(undefined);
    expect(formatMoneyInput('')).toBe('');
    expect(formatMoneyInput('123')).toBe(123);
    expect(formatMoneyInput('5,757.57')).toBe(5757.57);
    expect(formatMoneyInput('123,456,789.99')).toBe(123456789.99);
  });

  it('formatDuration: Formats iso8601 durations', () => {
    expect(formatDuration('P1Y')).toBe('1 year');
    expect(formatDuration('P3Y')).toBe('3 years');
    expect(formatDuration('P6M')).toBe('6 months');
    expect(formatDuration('P1Y6M')).toBe('1 year, 6 months');
    expect(formatDuration('P1Y2M4DT20H44M12.67S')).toBe('1 year, 2 months, 4 days, 20 hours, 44 minutes, 12.67 seconds');
  });

  it('formatParagraphs', () => {
    expect(formatParagraphs('Hello World').length).toBe(1);
    expect(formatParagraphs('Hello\nWorld').length).toBe(2);
  });

  it('stripNonAlpha: Strips non alpha charachters from strings', () => {
    EMPTY_VALUES.forEach(emptyValue => {
      expect(stripNonAlpha(emptyValue)).toBe('');
    });

    expect(stripNonAlpha('Hello World')).toBe('HelloWorld');
    expect(stripNonAlpha('Hello\nWorld')).toBe('HelloWorld');
    expect(stripNonAlpha('Hello234World')).toBe('HelloWorld');
    expect(stripNonAlpha('Hello234World      ')).toBe('HelloWorld');
  });

  it('pluralize: Pluralizes words based on count', () => {
    expect(pluralize('case', 's', 0)).toBe('cases');
    expect(pluralize('case', 's', 1)).toBe('case');
    expect(pluralize('case', 's', 100)).toBe('cases');
  });

  it('formatDelimitedList: Formats an array as a comma delimited list', () => {
    expect(formatDelimitedList([])).toBe('--');
    expect(formatDelimitedList(['a', 'b', 'c'])).toBe('a, b, c');
    expect(formatDelimitedList(['a', 'b', 'c'], '//')).toBe('a//b//c');
    expect(formatDelimitedList(['a, b, and c', 'd', 'e -- f'])).toBe('a, b, and c, d, e -- f');
    expect(formatDelimitedList(['a, b, and c', 'd', 'e -- f'], '...')).toBe('a, b, and c...d...e -- f');
    expect(formatDelimitedList([''])).toBe('--');
    expect(formatDelimitedList(null)).toBe('--');
    expect(formatDelimitedList(undefined)).toBe('--');
  });

  it('formatCommaSeparatedNumber', () => {
    EMPTY_VALUES.forEach(emptyValue => {
      expect(formatCommaSeparatedNumber(emptyValue)).toBe('--');
    });

    expect(formatCommaSeparatedNumber(4005)).toBe('4,005');
    expect(formatCommaSeparatedNumber(0)).toBe('0');
    expect(formatCommaSeparatedNumber(400)).toBe('400');
    expect(formatCommaSeparatedNumber(40005)).toBe('40,005');
    expect(formatCommaSeparatedNumber(400005)).toBe('400,005');
    expect(formatCommaSeparatedNumber(4000005)).toBe('4,000,005');
  });

  it('getType: Formats a model type string', () => {
    expect(getType('attorneys.attorney')).toBe('attorney');
    expect(getType('attorney')).toBe('attorney');
    expect(getType(undefined)).toBe(undefined);
    expect(getType(null)).toBe(null);
    expect(getType('')).toBe('');
  });

  it('parseAndPreserveNewlines: Converts strings with newlines to HTML', () => {
    const parsedHtml = parseAndPreserveNewlines('hello\n\n\nhello') as JSX.Element[];
    expect(parsedHtml[0]).toBe('hello');
    expect(parsedHtml[1].type).toBe('br');
    expect(parsedHtml[2].type).toBe('br');
    expect(parsedHtml[3].type).toBe('br');
    expect(parsedHtml[4]).toBe('hello');
  });

  it('formattedWebsite', () => {
    const website = 'https://www.mighty.com'
      , innerText = 'innerText';

    const formattedWebsite = formatWebsite(website) as JSX.Element;
    expect(formattedWebsite.props.href).toBe(website);
    expect(formattedWebsite.props.children).toBe(website);

    const formattedWebsiteWithText = formatWebsite(website, innerText) as JSX.Element;
    expect(formattedWebsiteWithText.props.href).toBe(website);
    expect(formattedWebsiteWithText.props.children).toBe(innerText);
  });

  it('formatAddress: Format address as single-line string', () => {
    expect(formatAddress(null)).toBe('--, --, -- --');
    expect(formatAddress(
      {address1: '123 Fake St', address2: 'Apt 1-D', city: 'New York', state: 'NY', zip_code: '10001'}),
    ).toBe('123 Fake St Apt 1-D, New York, NY 10001');
    expect(formatAddress(
      {address1: '', address2: 'Apt 1-D', city: 'New York', state: 'NY', zip_code: '10001'}),
    ).toBe('-- Apt 1-D, New York, NY 10001');
    expect(formatAddress(
      {address1: '123 Fake St', address2: '', city: 'New York', state: 'NY', zip_code: '10001'}),
    ).toBe('123 Fake St, New York, NY 10001');
    expect(formatAddress(
      {address1: '123 Fake St', address2: 'Apt 1-D', city: '', state: 'NY', zip_code: '10001'}),
    ).toBe('123 Fake St Apt 1-D, --, NY 10001');
    expect(formatAddress(
      {address1: '123 Fake St', address2: 'Apt 1-D', city: 'New York', state: '', zip_code: '10001'}),
    ).toBe('123 Fake St Apt 1-D, New York, -- 10001');
    expect(formatAddress(
      {address1: '123 Fake St', address2: 'Apt 1-D', city: 'New York', state: 'NY', zip_code: ''}),
    ).toBe('123 Fake St Apt 1-D, New York, NY --');

    const parsedAddressMultilineNull = formatAddressMultiline(null) as JSX.Element[];
    expect(parsedAddressMultilineNull[0]).toBe(EMPTY_FIELD);
    expect(parsedAddressMultilineNull[1].type).toBe('br');
    expect(parsedAddressMultilineNull[2]).toBe('--, -- --');

    const parsedAddressMultilineFull = formatAddressMultiline(
      {address1: '123 Fake St', address2: '', city: 'New York', state: 'NY', zip_code: '10001'}) as JSX.Element[];
    expect(parsedAddressMultilineFull[0]).toBe('123 Fake St');
    expect(parsedAddressMultilineFull[1].type).toBe('br');
    expect(parsedAddressMultilineFull[2]).toBe('New York, NY 10001');
  });

  it('toKey: Deterministically formats an object as a URL param string', () => {
    expect(toKey({})).toBe('');

    // String or number
    expect(toKey({ field: 2 })).toBe('?field=2');
    expect(toKey({ field: '2' })).toBe('?field=2');

    // Empty attributes
    expect(toKey({ field: undefined })).toBe('');
    expect(toKey({ field: null })).toBe('');

    // boolean
    expect(toKey({ field: true })).toBe('?field=true');
    expect(toKey({ field: false })).toBe('?field=false');

    // Ordering
    expect(toKey({ a: true, b: true })).toBe('?a=true&b=true');
    expect(toKey({ b: true, a: true })).toBe('?a=true&b=true');

    // Arrays
    expect(toKey({ field: [true, true, false] })).toBe('?field=true%2Ctrue%2Cfalse');
  });
});
