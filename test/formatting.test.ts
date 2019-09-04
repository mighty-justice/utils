/* global describe, it, expect */
import * as util from '../src';
import { EMPTY_FIELD } from '../src';

describe('formatting', () => {
  it('Correctly converts a variable name to a form label', () => {
    expect(util.varToLabel('')).toBe('');
    expect(util.varToLabel('case-type')).toBe('Case Type');
    expect(util.varToLabel('case_type')).toBe('Case Type');
    expect(util.varToLabel('CaseType')).toBe('Case Type');
    expect(util.varToLabel('plaintiff.first_name')).toBe('First Name');
    expect(util.varToLabel('STATE OF INCIDENT')).toBe('State of Incident');
    expect(util.varToLabel('state_of_incident')).toBe('State of Incident');
    expect(util.varToLabel('stateOfIncident')).toBe('State of Incident');
  });

  it('Correctly splits a name', () => {
    expect(util.splitName('John Smith')).toEqual(['John', 'Smith']);
    expect(util.splitName('John Smith Sr.')).toEqual(['John', 'Smith Sr.']);
    expect(util.splitName('Ms. Jane Smithson V')).toEqual(['Ms.', 'Jane Smithson V']);
    expect(util.splitName('John Smith Jane Smithson II')).toEqual(['John', 'Smith Jane Smithson II']);
    expect(util.splitName(' John Smith')).toEqual(['John', 'Smith']);
    expect(util.splitName('John Smith ')).toEqual(['John', 'Smith']);
    expect(util.splitName('John  Smith')).toEqual(['John', 'Smith']);
    expect(util.splitName('John')).toEqual(['John', '']);
    expect(util.splitName('')).toEqual(['', '']);
    expect(util.splitName('John                          ')).toEqual(['John', '']);
    expect(util.splitName('                 ')).toEqual(['', '']);
    expect(util.splitName(undefined)).toEqual(['', '']);
    expect(util.splitName(null)).toEqual(['', '']);
  });

  it('getInitials', () => {
    // Empty inputs
    expect(util.getInitials(null)).toEqual('');
    expect(util.getInitials(undefined)).toEqual('');
    expect(util.getInitials('                 ')).toEqual('');
    expect(util.getInitials('')).toEqual('');

    // Weird spacing
    expect(util.getInitials(' Lorem Ipsum')).toEqual('LI');
    expect(util.getInitials('Lorem Ipsum ')).toEqual('LI');
    expect(util.getInitials('Lorem                          ')).toEqual('L');
    expect(util.getInitials('Lorem  Ipsum')).toEqual('LI');

    // Anonymized from production examples
    expect(util.getInitials('LI Dolor, SIT')).toEqual('LID');
    expect(util.getInitials('Lorem & Ipsum DOLO')).toEqual('LID');
    expect(util.getInitials('Lorem & Ipsum')).toEqual('LI');
    expect(util.getInitials('Lorem + Ipsum Dolor at Sit')).toEqual('LID');
    expect(util.getInitials('LOREM IPSUM & DOLOR SIT')).toEqual('LID');
    expect(util.getInitials('Lorem Ipsum and Dolor')).toEqual('LID');
    expect(util.getInitials('Lorem Ipsum Do.')).toEqual('LID');
    expect(util.getInitials('Lorem Ipsum Dolor And Sit')).toEqual('LID');
    expect(util.getInitials('Lorem Ipsum Dolor Sit II')).toEqual('LID');
    expect(util.getInitials('Lorem Ipsum Dolor')).toEqual('LID');
    expect(util.getInitials('Lorem Ipsum Dolor, SIT')).toEqual('LID');
    expect(util.getInitials('Lorem Ipsum of Dolor')).toEqual('LID');
    expect(util.getInitials('Lorem Ipsum')).toEqual('LI');
    expect(util.getInitials('Lorem Ipsum, DOL')).toEqual('LI');
    expect(util.getInitials('Lorem of Ipsum')).toBe('LI');
    expect(util.getInitials('LOREM OF IPSUM')).toBe('LI');
    expect(util.getInitials('Lorem')).toEqual('L');
    expect(util.getInitials('Lorem. Ipsum Dolor S')).toEqual('LID');
    expect(util.getInitials('LoremIpsum DOL')).toEqual('LID');
    expect(util.getInitials('LoremIpsum Dolor')).toEqual('LID');
    expect(util.getInitials('LoremIpsum Dolor, SIT')).toEqual('LID');
    expect(util.getInitials('of Lorem Ipsum, DOL')).toEqual('LI');
    expect(util.getInitials('The Lorem Ipsum Dolor')).toEqual('LID');
    expect(util.getInitials('The Lorem')).toEqual('L');
    expect(util.getInitials('The of Lorem I. Dolor, SA')).toEqual('LID');
  });

  it('Correctly splits a comma separated list', () => {
    expect(util.splitCommaList('John, Smith')).toEqual(['John', 'Smith']);
    expect(util.splitCommaList('John,Smith,Sr.')).toEqual(['John', 'Smith', 'Sr.']);
    expect(util.splitCommaList('Ms., Jane Smithson V')).toEqual(['Ms.', 'Jane Smithson V']);
    expect(util.splitCommaList('John Smith, Jane Smithson, II')).toEqual(['John Smith', 'Jane Smithson', 'II']);
    expect(util.splitCommaList(' John Smith')).toEqual(['John Smith']);
    expect(util.splitCommaList('John Smith, ')).toEqual(['John Smith']);
    expect(util.splitCommaList('John Smith')).toEqual(['John Smith']);
    expect(util.splitCommaList('John,,')).toEqual(['John']);
    expect(util.splitCommaList('')).toEqual([]);
    expect(util.splitCommaList('John                          ')).toEqual(['John']);
    expect(util.splitCommaList('                 ')).toEqual([]);
    expect(util.splitCommaList(undefined)).toEqual([]);
    expect(util.splitCommaList(null)).toEqual([]);
  });

  it('Correctly formats a full name', () => {
    expect(util.formatFullName('John', '')).toBe('John');
    expect(util.formatFullName('John', 'Smith')).toBe('John Smith');
    expect(util.formatFullName('', 'Smith Sr.')).toBe('Smith Sr.');
    expect(util.formatFullName('John', 'Smith Sr.')).toBe('John Smith Sr.');
  });

  it('Correctly formats a phone number', () => {
    expect(util.formatPhoneNumber(null)).toBe('--');
    expect(util.formatPhoneNumber(undefined)).toBe('--');
    expect(util.formatPhoneNumber('5')).toBe('5');
    expect(util.formatPhoneNumber('8675309')).toBe('867-5309');
    expect(util.formatPhoneNumber('5558675309')).toBe('(555) 867-5309');
    expect(util.formatPhoneNumber('(555)-867-5309')).toBe('(555) 867-5309');
    expect(util.formatPhoneNumber('(555)-8675309')).toBe('(555) 867-5309');
    expect(util.formatPhoneNumber('555-867-5309')).toBe('(555) 867-5309');
    expect(util.formatPhoneNumber('867-5309')).toBe('867-5309');
    expect(util.formatPhoneNumber('867-5309 ext. 4')).toBe('867-5309 ext. 4');
    expect(util.formatPhoneNumber('Call main office')).toBe('Call main office');
    expect(util.formatPhoneNumber('+2111 (555)-867-5309')).toBe('+2111 (555)-867-5309');
    expect(util.formatPhoneNumber('125558675309')).toBe('+12 (555) 867-5309');
  });

  it('Correctly formats a name when passed an object', () => {
    expect(util.getNameOrDefault({first_name: 'John', last_name: 'Smith'})).toBe('John Smith');
    expect(util.getNameOrDefault({name: 'John Smith'})).toBe('John Smith');
    expect(util.getNameOrDefault({customName: 'John Smith'}, {field: 'customName'})).toBe('John Smith');
    expect(util.getNameOrDefault({customName: 'John Smith'})).toBe('--');
    expect(util.getNameOrDefault({first_name: 'John'})).toBe('John');
  });

  it('Correctly displays default value when a falsy value passed', () => {
    expect(util.getNameOrDefault(null)).toBe('--');
    expect(util.getNameOrDefault(undefined)).toBe('--');
    expect(util.getNameOrDefault('')).toBe('--');
  });

  it('Correctly displays custom default value when a falsy value passed', () => {
    expect(util.getNameOrDefault(null, {defaultValue: 'custom'})).toBe('custom');
    expect(util.getNameOrDefault(undefined, {defaultValue: 'custom'})).toBe('custom');
    expect(util.getNameOrDefault('', {defaultValue: 'custom'})).toBe('custom');
  });

  it('Correctly displays a value when passed one', () => {
    expect(util.getOrDefault('Hello')).toBe('Hello');
    expect(util.getOrDefault('Hello                     ')).toBe('Hello');
    expect(util.getOrDefault(123)).toBe(123);
    expect(util.getOrDefault(0)).toBe(0);
  });

  it('Correctly displays default value when an empty value is passed', () => {
    expect(util.getOrDefault(null)).toBe('--');
    expect(util.getOrDefault(undefined)).toBe('--');
    expect(util.getOrDefault('')).toBe('--');
    expect(util.getOrDefault(' ')).toBe('--');
    expect(util.getOrDefault('                              ')).toBe('--');
  });

  it('Correctly formats a social security number', () => {
    expect(util.formatSocialSecurityNumber(null)).toBe('--');
    expect(util.formatSocialSecurityNumber(undefined)).toBe('--');
    expect(util.formatSocialSecurityNumber('123456789')).toBe('123-45-6789');
    expect(util.formatSocialSecurityNumber('12-345-6789')).toBe('123-45-6789');
    expect(util.formatSocialSecurityNumber('12345-6789')).toBe('123-45-6789');
    expect(util.formatSocialSecurityNumber('123-456789')).toBe('123-45-6789');
    expect(util.formatSocialSecurityNumber('12-34-56-78-9')).toBe('123-45-6789');
  });

  it('Correctly formats an employer id number', () => {
    expect(util.formatEmployerIdNumber(null)).toBe('--');
    expect(util.formatEmployerIdNumber(undefined)).toBe('--');
    expect(util.formatEmployerIdNumber('123456789')).toBe('12-3456789');
    expect(util.formatEmployerIdNumber('12-345-6789')).toBe('12-3456789');
    expect(util.formatEmployerIdNumber('12345-6789')).toBe('12-3456789');
    expect(util.formatEmployerIdNumber('123-456789')).toBe('12-3456789');
    expect(util.formatEmployerIdNumber('12-34-56-78-9')).toBe('12-3456789');
  });

  it('Correctly formats percentages', () => {
    expect(util.formatPercentage(0.5)).toBe('50.00%');
    expect(util.formatPercentage(1.5)).toBe('150.00%');
    expect(util.formatPercentage(1.0)).toBe('100.00%');
    expect(util.formatPercentage(null)).toBe('--');
    expect(util.formatPercentage(0)).toBe('0.00%');
    expect(util.formatPercentage(0.0395)).toBe('3.95%');
    expect(util.formatPercentage(0.005)).toBe('0.50%');
    expect(util.formatPercentage(0.005, 1)).toBe('0.5%');
    expect(util.formatPercentage(0.005, 4)).toBe('0.5000%');
    expect(util.formatPercentage(0.12345, 10)).toBe('12.3450000000%');
  });

  it('Correctly formats money', () => {
    expect(util.formatMoney(0.5)).toBe('$0.50');
    expect(util.formatMoney(1.55)).toBe('$1.55');
    expect(util.formatMoney(1555333.0)).toBe('$1,555,333.00');
    expect(util.formatMoney(null)).toBe('--');
    expect(util.formatMoney(0)).toBe('$0.00');
  });

  it('Correctly formats a date', () => {
    expect(util.formatDate(undefined)).toBe('--');
    expect(util.formatDate(null)).toBe('--');
    expect(util.formatDate('2016-10-03')).toBe('10/03/16');
  });

  it('Correctly formats datetimes', () => {
    expect(util.formatDateTime(undefined)).toBe('--');
    expect(util.formatDateTime(null)).toBe('--');
    expect(util.formatDateTime('2008-09-22T13:57:31.2311892')).toBe('09/22/08 @ 1:57PM');
  });

  it('Correctly maps booleans to yes and no', () => {
    expect(util.mapBooleanToText(true)).toBe('Yes');
    expect(util.mapBooleanToText(false)).toBe('No');
    expect(util.mapBooleanToText(undefined)).toBe('--');
    expect(util.mapBooleanToText(undefined, {mapUndefinedToNo: false})).toBe('--');
    expect(util.mapBooleanToText(undefined, {mapUndefinedToNo: true})).toBe('No');
  });

  it('Correctly gets value from a money input with commas', () => {
    expect(util.formatMoneyInput('1,222.00')).toBe(1222);
    expect(util.formatMoneyInput(null)).toBe(null);
    expect(util.formatMoneyInput(undefined)).toBe(undefined);
    expect(util.formatMoneyInput('')).toBe('');
    expect(util.formatMoneyInput('123')).toBe(123);
    expect(util.formatMoneyInput('5,757.57')).toBe(5757.57);
    expect(util.formatMoneyInput('123,456,789.99')).toBe(123456789.99);
  });

  it('Correctly formats iso8601 durations', () => {
    expect(util.formatDuration(undefined)).toBe('--');
    expect(util.formatDuration(null)).toBe('--');
    expect(util.formatDuration('')).toBe('--');
    expect(util.formatDuration('P1Y')).toBe('1 year');
    expect(util.formatDuration('P3Y')).toBe('3 years');
    expect(util.formatDuration('P6M')).toBe('6 months');
    expect(util.formatDuration('P1Y6M')).toBe('1 year, 6 months');
    expect(util.formatDuration('P1Y2M4DT20H44M12.67S')).toBe('1 year, 2 months, 4 days, 20 hours, 44 minutes, 12.67 seconds');
  });

  it('Correctly formats paragraphs', () => {
    expect(util.formatParagraphs(undefined)).toBe('--');
    expect(util.formatParagraphs(null)).toBe('--');
    expect(util.formatParagraphs('')).toBe('--');
    expect(util.formatParagraphs('Hello World').length).toBe(1);
    expect(util.formatParagraphs('Hello\nWorld').length).toBe(2);
  });

  it('Correctly strips non alpha charachters', () => {
    expect(util.stripNonAlpha(undefined)).toBe('');
    expect(util.stripNonAlpha(null)).toBe('');
    expect(util.stripNonAlpha('')).toBe('');
    expect(util.stripNonAlpha('Hello World')).toBe('HelloWorld');
    expect(util.stripNonAlpha('Hello\nWorld')).toBe('HelloWorld');
    expect(util.stripNonAlpha('Hello234World')).toBe('HelloWorld');
    expect(util.stripNonAlpha('Hello234World      ')).toBe('HelloWorld');
  });

  it('Correctly pluralizes words based on count', () => {
    expect(util.pluralize('case', 's', 0)).toBe('cases');
    expect(util.pluralize('case', 's', 1)).toBe('case');
    expect(util.pluralize('case', 's', 100)).toBe('cases');
  });

  it('Correctly formats a delimited list when given an array', () => {
    expect(util.formatDelimitedList([])).toBe('--');
    expect(util.formatDelimitedList(['a', 'b', 'c'])).toBe('a, b, c');
    expect(util.formatDelimitedList(['a', 'b', 'c'], '//')).toBe('a//b//c');
    expect(util.formatDelimitedList(['a, b, and c', 'd', 'e -- f'])).toBe('a, b, and c, d, e -- f');
    expect(util.formatDelimitedList(['a, b, and c', 'd', 'e -- f'], '...')).toBe('a, b, and c...d...e -- f');
    expect(util.formatDelimitedList([''])).toBe('--');
    expect(util.formatDelimitedList(null)).toBe('--');
    expect(util.formatDelimitedList(undefined)).toBe('--');
  });

  it('Correctly formats a comma-separated number', () => {
    expect(util.formatCommaSeparatedNumber(4005)).toBe('4,005');
    expect(util.formatCommaSeparatedNumber(0)).toBe('0');
    expect(util.formatCommaSeparatedNumber(400)).toBe('400');
    expect(util.formatCommaSeparatedNumber(40005)).toBe('40,005');
    expect(util.formatCommaSeparatedNumber(400005)).toBe('400,005');
    expect(util.formatCommaSeparatedNumber(4000005)).toBe('4,000,005');
    expect(util.formatCommaSeparatedNumber(null)).toBe('--');
    expect(util.formatCommaSeparatedNumber(undefined)).toBe('--');
  });

  it('Correctly formats a type string', () => {
    expect(util.getType('attorneys.attorney')).toBe('attorney');
    expect(util.getType('attorney')).toBe('attorney');
    expect(util.getType(undefined)).toBe(undefined);
    expect(util.getType(null)).toBe(null);
    expect(util.getType('')).toBe('');
  });

  it('Correctly preserves newlines in a note', () => {
    const parsedCaseNote = util.parseAndPreserveNewlines('hello\n\n\nhello');
    expect(parsedCaseNote[0]).toBe('hello');
    expect(parsedCaseNote[1].type).toBe('br');
    expect(parsedCaseNote[2].type).toBe('br');
    expect(parsedCaseNote[3].type).toBe('br');
    expect(parsedCaseNote[4]).toBe('hello');
  });

  it('Correctly formats a website', () => {
    const website = 'https://www.mighty.com'
      , innerText = 'innerText';

    expect(util.formatWebsite(undefined)).toBe('--');

    const formattedWebsite = util.formatWebsite(website) as JSX.Element;
    expect(formattedWebsite.props.href).toBe(website);
    expect(formattedWebsite.props.children).toBe(website);

    const formattedWebsiteWithText = util.formatWebsite(website, innerText) as JSX.Element;
    expect(formattedWebsiteWithText.props.href).toBe(website);
    expect(formattedWebsiteWithText.props.children).toBe(innerText);
  });

  it('Correctly formats an address', () => {
    expect(util.formatAddress(null)).toBe('--, --, -- --');
    expect(util.formatAddress(
      {address1: '123 Fake St', address2: 'Apt 1-D', city: 'New York', state: 'NY', zip_code: '10001'}),
    ).toBe('123 Fake St Apt 1-D, New York, NY 10001');
    expect(util.formatAddress(
      {address1: '', address2: 'Apt 1-D', city: 'New York', state: 'NY', zip_code: '10001'}),
    ).toBe('-- Apt 1-D, New York, NY 10001');
    expect(util.formatAddress(
      {address1: '123 Fake St', address2: '', city: 'New York', state: 'NY', zip_code: '10001'}),
    ).toBe('123 Fake St, New York, NY 10001');
    expect(util.formatAddress(
      {address1: '123 Fake St', address2: 'Apt 1-D', city: '', state: 'NY', zip_code: '10001'}),
    ).toBe('123 Fake St Apt 1-D, --, NY 10001');
    expect(util.formatAddress(
      {address1: '123 Fake St', address2: 'Apt 1-D', city: 'New York', state: '', zip_code: '10001'}),
    ).toBe('123 Fake St Apt 1-D, New York, -- 10001');
    expect(util.formatAddress(
      {address1: '123 Fake St', address2: 'Apt 1-D', city: 'New York', state: 'NY', zip_code: ''}),
    ).toBe('123 Fake St Apt 1-D, New York, NY --');

    const parsedAddressMultilineNull = util.formatAddressMultiline(null);
    expect(parsedAddressMultilineNull[0]).toBe(EMPTY_FIELD);
    expect(parsedAddressMultilineNull[1].type).toBe('br');
    expect(parsedAddressMultilineNull[2]).toBe('--, -- --');

    const parsedAddressMultilineFull = util.formatAddressMultiline(
      {address1: '123 Fake St', address2: '', city: 'New York', state: 'NY', zip_code: '10001'});
    expect(parsedAddressMultilineFull[0]).toBe('123 Fake St');
    expect(parsedAddressMultilineFull[1].type).toBe('br');
    expect(parsedAddressMultilineFull[2]).toBe('New York, NY 10001');
  });

  it('Correctly formats an object as a URL param string', () => {
    expect(util.toKey({})).toBe('');

    // String or number
    expect(util.toKey({ field: 2 })).toBe('?field=2');
    expect(util.toKey({ field: '2' })).toBe('?field=2');

    // Empty attributes
    expect(util.toKey({ field: undefined })).toBe('');
    expect(util.toKey({ field: null })).toBe('');

    // boolean
    expect(util.toKey({ field: true })).toBe('?field=true');
    expect(util.toKey({ field: false })).toBe('?field=false');

    // Ordering
    expect(util.toKey({ a: true, b: true })).toBe('?a=true&b=true');
    expect(util.toKey({ b: true, a: true })).toBe('?a=true&b=true');

    // Arrays
    expect(util.toKey({ field: [true, true, false] })).toBe('?field=true%2Ctrue%2Cfalse');
  });
});
