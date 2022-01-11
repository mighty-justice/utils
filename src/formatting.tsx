import React from 'react';
import { parse } from 'iso8601-duration';
import { format as dateFnsFormat, parseISO } from 'date-fns';
import numeral from 'numeral';
import parser from 'html-react-parser';
import memoize from 'fast-memoize';

import {
  escape,
  get,
  has,
  isBoolean,
  isNumber,
  isString,
  map,
  mapValues,
  reject,
  result,
  sortBy,
  startCase,
  times,
  upperCase,
} from 'lodash';

import { DATE_FORMATS, EMPTY_FIELD, RE_ALPHA, RE_SMALL_WORDS, RE_WORDS } from './constants';
import { IAddress } from './interfaces';

export function canReplaceSymbols(template: string, chars: string[]): boolean {
  return template.split('#').length - 1 === chars.length;
}

export function replaceSymbolsWithChars(template: string, chars: string[]): string {
  const charsReverse = chars.reverse();

  return template
    .split('')
    .map(char => (char === '#' ? charsReverse.pop() : char))
    .join('');
}

export function hasStringContent(value: unknown): value is string {
  if (!isString(value)) {
    return false;
  }

  return !!value.replace(/ /g, '').length;
}

export function hasStringOrNumberContent(value: unknown): value is number | string {
  return hasStringContent(value) || isNumber(value);
}

export function splitName(name?: string | null): [string, string] {
  if (!hasStringContent(name)) {
    return ['', ''];
  }

  const [firstName, ...lastName] = name.trim().split(' ');
  return [firstName, lastName.join(' ').trim()];
}

export function splitCommaList(str?: string | null): string[] {
  if (!hasStringContent(str)) {
    return [];
  }

  if (str.indexOf(',') === -1) {
    return [str.trim()];
  }

  return str
    .split(',')
    .map(s => s.trim())
    .filter(v => v !== '');
}

export function formatFullName(firstName?: string, lastName?: string): string {
  return `${firstName || ''} ${lastName || ''}`.trim();
}

export function formatNumberTemplates(value: undefined | string | null, templates: string[]): string {
  if (!hasStringContent(value)) {
    return EMPTY_FIELD;
  }

  const valueNumbers = value.match(/\d/g) || [],
    valueNonNumbers = value.match(/[^0-9\-(). ]/g) || [];

  if (valueNonNumbers.length) {
    return value;
  }

  for (const template of templates) {
    if (canReplaceSymbols(template, valueNumbers)) {
      return replaceSymbolsWithChars(template, valueNumbers);
    }
  }

  return value;
}

export function formatPhoneNumber(value?: string | null): string {
  return formatNumberTemplates(value, ['###-####', '(###) ###-####', '+# (###) ###-####', '+## (###) ###-####']);
}

export function formatDate(value?: string | null, dateFormat = DATE_FORMATS.date): string {
  if (!hasStringContent(value)) {
    return EMPTY_FIELD;
  }
  return dateFnsFormat(parseISO(value), dateFormat);
}

export function formatDateTime(value?: string | null): string {
  return formatDate(value, DATE_FORMATS.date_at_time);
}

export function getNameOrDefault(obj?: unknown, { field = 'name', defaultValue = EMPTY_FIELD } = {}): string {
  if (obj) {
    if (has(obj, 'first_name')) {
      return `${result(obj, 'first_name', '')} ${result(obj, 'last_name', '')}`.trim();
    }
    if (has(obj, field)) {
      return get(obj, field);
    }
  }
  return defaultValue;
}

export function getOrDefault(value?: unknown): string {
  if (hasStringContent(value)) {
    return value.trim();
  }

  if (isNumber(value)) {
    return String(value);
  }

  return EMPTY_FIELD;
}

export function formatSocialSecurityNumber(value?: null | string): string {
  return formatNumberTemplates(value, ['####', '###-##-####']);
}

export function formatEmployerIdNumber(value?: null | string): string {
  return formatNumberTemplates(value, ['##-#######']);
}

export function formatPercentage(value?: null | number | string, decimalPoints = 2): string {
  if (!hasStringOrNumberContent(value)) {
    return EMPTY_FIELD;
  }

  const zeros = times(decimalPoints, () => '0').join(''),
    formattingString = `0.${zeros}%`;

  return numeral(value).format(formattingString);
}

export function formatMoney(value?: null | number | string): string {
  if (!hasStringOrNumberContent(value)) {
    return EMPTY_FIELD;
  }
  return numeral(value).format('$0,0.00');
}

export function formatDollars(value?: null | number | string): string {
  if (!hasStringOrNumberContent(value)) {
    return EMPTY_FIELD;
  }
  return numeral(value).format('$0,0');
}

export function formatParagraphs(value?: null | string): string | React.ReactNode[] {
  if (!hasStringContent(value)) {
    return EMPTY_FIELD;
  }
  return value.split(/\r?\n/).map((s, i) => <p key={i}>{s}</p>);
}

export function formatCommaSeparatedNumber(value?: null | number | string): string {
  if (!hasStringOrNumberContent(value)) {
    return EMPTY_FIELD;
  }
  return numeral(value).format('0,0');
}

export function formatDelimitedList(list?: null | string[], delimiter = ', '): string {
  if (!list) {
    return EMPTY_FIELD;
  }
  return getOrDefault(list.join(delimiter));
}

export function mapBooleanToText(bool?: boolean | null, { mapUndefinedToNo } = { mapUndefinedToNo: false }): string {
  if (isBoolean(bool)) {
    return bool ? 'Yes' : 'No';
  }

  if (mapUndefinedToNo && bool === undefined) {
    return 'No';
  }

  return EMPTY_FIELD;
}

export function formatMoneyInput(value?: null | number | string): number {
  if (!hasStringOrNumberContent(value)) {
    return value;
  }
  return numeral(value).value();
}

export function formatDuration(iso8601?: null | string): string {
  if (!hasStringContent(iso8601)) {
    return EMPTY_FIELD;
  }

  // Translate object to KV Pair
  let unitCounts = Object.entries(parse(iso8601));

  // Remove 0 entries
  // tslint:disable-next-line variable-name
  unitCounts = unitCounts.filter(([_unit, count]) => count > 0);

  // De-pluralize keys for entries of 1
  const unitCountsHuman = unitCounts.map(([unit, count]) => [
    // tslint:disable-next-line no-magic-numbers
    count === 1 ? unit.slice(0, -1) : unit, // de-pluralize single count units
    count,
  ]);

  // Join into string
  return unitCountsHuman.map(([unit, count]) => `${count} ${unit}`).join(', ');
}

export function formatWebsite(website?: string | null, text?: string): React.ReactNode {
  if (!hasStringContent(website)) {
    return EMPTY_FIELD;
  }

  return (
    <a href={website} rel="noopener noreferrer" target="_blank">
      {text || website}
    </a>
  );
}

export function stripNonAlpha(str?: string | null): string {
  if (!hasStringContent(str)) {
    return '';
  }
  return str.replace(RE_ALPHA, '');
}

export function pluralize(baseWord: string, pluralSuffix: string, count: number): string {
  return count === 1 ? baseWord : `${baseWord}${pluralSuffix}`;
}

export function getType(fullType?: null | string): string {
  const type = fullType && fullType.split('.')[1];
  return type || fullType;
}

export function preserveNewLines(body: string): React.ReactNode {
  return body.replace(/\n/g, '<br/>');
}

export function parseAndPreserveNewlines(body?: string): React.ReactNode {
  if (!hasStringContent(body)) {
    return EMPTY_FIELD;
  }
  return parser(preserveNewLines(escape(body)));
}

export function getDisplayName(component: any): string | undefined {
  if (!component) {
    return undefined;
  }
  return component.displayName || component.name || 'Component';
}

function _hasSmallWords(value: string): boolean {
  return value.search(RE_SMALL_WORDS) > -1;
}

function _varToLabel(value: string): string {
  const suffix: string = value.split('.').pop() || '',
    formatted: string = startCase(suffix),
    wordArray: string[] = formatted.match(RE_WORDS) || [],
    notOnlyWord: boolean = wordArray.length > 1;

  return wordArray
    .map((match: string, index: number) => {
      const notFirstWord = index > 0;

      if (notFirstWord && notOnlyWord && _hasSmallWords(match)) {
        return match.toLowerCase();
      }

      return match.charAt(0).toUpperCase() + match.substr(1).toLowerCase();
    })
    .join(' ');
}

export const varToLabel: (str: string) => string = memoize(_varToLabel);

export function getInitials(value?: string | null): string {
  if (!hasStringContent(value)) {
    return '';
  }

  const MAX_CHARS = 3,
    prefix: string = value.split(',')[0],
    formatted: string = startCase(prefix),
    isValueAllCaps: boolean = formatted === upperCase(formatted),
    wordArray: string[] = formatted.match(RE_WORDS);

  return wordArray
    .map((word: string) => {
      const isWordAllCaps = word === upperCase(word);

      if (_hasSmallWords(word)) {
        return '';
      }
      if (isWordAllCaps && !isValueAllCaps) {
        return word;
      }
      return word.charAt(0).toUpperCase();
    })
    .join('')
    .substring(0, MAX_CHARS);
}

export function toKey(dict: { [key: string]: any }): string {
  const dictSorted = sortBy(map(dict, (value: any, key: string) => [key, value])),
    dictFiltered = reject(dictSorted, ([_key, value]: [string, any]) => value === null || value === undefined) as Array<
      [string, any]
    >;

  if (dictFiltered.length < 1) {
    return '';
  }

  const dictString = dictFiltered
    .map(([key, value]: [string, any]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return `?${dictString}`;
}

export function formatAddress(address?: IAddress | null): string {
  if (!address) {
    return '--, --, -- --';
  }

  const filledInAddress = mapValues(address, s => s || EMPTY_FIELD),
    { address1, city, state, zip_code } = filledInAddress,
    { address2 } = address,
    joinedAddress = [address1, address2].join(' ').trim();

  return `${joinedAddress}, ${city}, ${state} ${zip_code}`;
}

export function formatAddressMultiline(address?: IAddress | null): React.ReactNode {
  return parser(formatAddress(address).replace(', ', '<br/>'));
}

export function stringToHTML(string: string): React.ReactNode {
  return parser(string);
}
