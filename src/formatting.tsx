import React from 'react';
import { parse } from 'iso8601-duration';
import { format as dateFnsFormat } from 'date-fns';
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
} from 'lodash';

import { DATE_FORMATS, EMPTY_FIELD } from './constants';
import { IAddress } from './interfaces';

export function canReplaceSymbols (template: string, chars: string[]): boolean {
  return (template.split('#').length - 1) === chars.length;
}

export function replaceSymbolsWithChars (template: string, chars: string[]) {
  const charsReverse = chars.reverse();

  return template
    .split('')
    .map(char => (char === '#') ? charsReverse.pop() : char)
    .join('')
    ;
}

export function hasStringContent (value: unknown): value is string {
  if (!isString(value)) { return false; }
  return !!value.replace(/ /g, '').length;
}

export function hasStringOrNumberContent (value: unknown): value is number | string {
  return hasStringContent(value) || isNumber(value);
}

export function splitName (name?: string | null) {
  if (!hasStringContent(name)) { return ['', '']; }

  const [firstName, ...lastName] = name.trim().split(' ');
  return [firstName, lastName.join(' ').trim()];
}

export function splitCommaList (str?: string | null) {
  if (!hasStringContent(str)) { return []; }

  if (str.indexOf(',') === -1) {
    return [str.trim()];
  }

  return str.split(',').map(s => s.trim()).filter(v => (v !== ''));
}

export function formatFullName (firstName?: string, lastName?: string) {
  return `${firstName || ''} ${lastName || ''}`.trim();
}

export function formatPhoneNumber (input?: string | null) {
  if (!hasStringContent(input)) { return EMPTY_FIELD; }

  const phoneNumbers = input.match(/\d/g) || []
    , phoneNotNumbers = input.match(/[^0-9\-()]/g) || []
    , PHONE_FORMATS: string[] = [
      '###-####',
      '(###) ###-####',
      '+# (###) ###-####',
      '+## (###) ###-####',
    ];

  if (phoneNotNumbers.length) {
    return input;
  }

  for (const template of PHONE_FORMATS) {
    if (canReplaceSymbols(template, phoneNumbers)) {
      return replaceSymbolsWithChars(template, phoneNumbers);
    }
  }

  return input;
}

export function formatDate (value?: string | null, dateFormat = DATE_FORMATS.date) {
  if (!hasStringContent(value)) { return EMPTY_FIELD; }
  return dateFnsFormat(value, dateFormat);
}

export function formatDateTime (value?: string | null) {
  return formatDate(value, DATE_FORMATS.date_at_time);
}

export function getNameOrDefault (obj?: unknown, { field = 'name', defaultValue = EMPTY_FIELD } = {}) {
  if (obj) {
    if (has(obj, 'first_name')) {
      return (`${result(obj, 'first_name', '')} ${result(obj, 'last_name', '')}`).trim();
    }
    if (has(obj, field)) {
      return get(obj, field);
    }
  }
  return defaultValue;
}

export function getOrDefault (value?: any) {
  const isUndefined = value === undefined
    , isNull = value === null
    , isEmptyString = isString(value) && !hasStringContent(value);

  if (isUndefined || isNull || isEmptyString) {
    return EMPTY_FIELD;
  }

  if (isString(value)) {
    return value.trim();
  }

  return value;
}

function formatNumberFromTemplate (template: string, value?: null | string) {
  if (!hasStringContent(value)) { return EMPTY_FIELD; }

  const numberValues: string[] = value && value.match(/\d/g) || [];
  if (canReplaceSymbols(template, numberValues)) {
    return replaceSymbolsWithChars(template, numberValues);
  }

  return EMPTY_FIELD;
}

export function formatSocialSecurityNumber (value?: null | string) {
  return formatNumberFromTemplate('###-##-####', value);
}

export function formatEmployerIdNumber (value?: null | string) {
  return formatNumberFromTemplate('##-#######', value);
}

export function formatPercentage (value: null | number | string, decimalPoints = 2) {
  if (!hasStringOrNumberContent(value)) { return EMPTY_FIELD; }

  const zeros = times(decimalPoints, () => '0').join('')
    , formattingString = `0.${zeros}%`;

  return numeral(value).format(formattingString);
}

export function formatMoney (value?: null | number | string) {
  if (!hasStringOrNumberContent(value)) { return EMPTY_FIELD; }
  return numeral(value).format('$0,0.00');
}

export function formatParagraphs (value?: null | string) {
  if (!hasStringContent(value)) { return EMPTY_FIELD; }
  return value.split(/\r?\n/).map((s, i) => <p key={i}>{s}</p>);
}

export function formatCommaSeparatedNumber (value?: null | number | string) {
  if (!hasStringOrNumberContent(value)) { return EMPTY_FIELD; }
  return numeral(value).format('0,0');
}

export function formatDelimitedList (list?: null | string[], delimiter = ', ') {
  if (!list) { return EMPTY_FIELD; }
  return getOrDefault(list.join(delimiter));
}

export function mapBooleanToText (bool?: boolean | null, {mapUndefinedToNo} = {mapUndefinedToNo: false}) {
  if (isBoolean(bool)) {
    return bool ? 'Yes' : 'No';
  }

  if (mapUndefinedToNo && bool === undefined) {
    return 'No';
  }

  return EMPTY_FIELD;
}

export function formatMoneyInput (value?: null | number | string) {
  if (!hasStringOrNumberContent(value)) { return value; }
  return numeral(value).value();
}

export function formatDuration (iso8601?: null | string) {
  if (!hasStringContent(iso8601)) { return EMPTY_FIELD; }

  // Translate object to KV Pair
  let unitCounts = Object.entries(parse(iso8601));

  // Remove 0 entries
  // tslint:disable-next-line variable-name
  unitCounts = unitCounts.filter(([_unit, count]) => count > 0);

  // De-pluralize keys for entries of 1
  const unitCountsHuman = unitCounts.map(([unit, count]) => [
    // tslint:disable-next-line no-magic-numbers
    (count === 1) ? unit.slice(0, -1) : unit, // de-pluralize single count units
    count,
  ]);

  // Join into string
  return unitCountsHuman.map(([unit, count]) => `${count} ${unit}`).join(', ');
}

export function formatWebsite (website: string | undefined, text?: string): (string | JSX.Element) {
  if (!hasStringContent(website)) { return EMPTY_FIELD; }

  return (
    <a href={website} rel='noopener noreferrer' target='_blank'>{text || website}</a>
  );
}

export function stripNonAlpha (str?: string | null) {
  if (!hasStringContent(str)) { return ''; }
  return str.replace(/[^A-Za-z]/g, '');
}

export function pluralize (baseWord: string, pluralSuffix: string, count: number) {
  return count === 1 ? baseWord : `${baseWord}${pluralSuffix}`;
}

export function getType (fullType?: null | string) {
  const type = fullType && fullType.split('.')[1];
  return type || fullType;
}

export function preserveNewLines (body: string) {
  return (body.replace(/\n/g, '<br/>'));
}

export function parseAndPreserveNewlines (body?: string) {
  if (!hasStringContent(body)) { return EMPTY_FIELD; }
  return parser(preserveNewLines(escape(body)));
}

export function getDisplayName (component: any): (string | undefined) {
  if (!component) { return undefined; }
  return component.displayName || component.name || 'Component';
}

function _varToLabel (str: string) {
  // Sourced significantly from https://github.com/gouch/to-title-case/blob/master/to-title-case.js
  const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i
    , suffix = str.split('.').pop() || ''
    , formatted = startCase(suffix)
    ;

  return formatted.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (match: string, index: number, title: string) => {
    const notFirstWord = index > 0
      , notOnlyWord = index + match.length !== title.length
      , hasSmallWords = match.search(smallWords) > -1
      ;

    if (
      notFirstWord
      && notOnlyWord
      && hasSmallWords
    ) {
      return match.toLowerCase();
    }

    return match.charAt(0).toUpperCase() + match.substr(1).toLowerCase();
  });
}

export const varToLabel: (str: string) => string = memoize(_varToLabel);

export function toKey (dict: { [key: string]: any }) {
  const dictSorted = sortBy(map(dict, (value: any, key: string) => [key, value]))
    , dictFiltered = reject(dictSorted, ([_key, value]: [string, any]) => (
    (value === null || value === undefined)
  )) as Array<[string, any]>;

  if (dictFiltered.length < 1) {
    return '';
  }

  const dictString = dictFiltered.map(([key, value]: [string, any]) => (
    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  )).join('&');

  return `?${dictString}`;
}

export function formatAddress (address?: IAddress | null) {
  if (!address) { return '--, --, -- --'; }

  const filledInAddress = mapValues(address, s => s || EMPTY_FIELD)
    , { address1, city, state, zip_code } = filledInAddress
    , { address2 } = address
    , joinedAddress = [address1, address2].join(' ').trim();

  return `${joinedAddress}, ${city}, ${state} ${zip_code}`;
}

export function formatAddressMultiline (address?: IAddress | null) {
  return parser(formatAddress(address).replace(', ', '<br/>'));
}
