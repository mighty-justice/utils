import React from 'react';
import { parse } from 'iso8601-duration';
import { format } from 'date-fns';
import numeral from 'numeral';
import parser from 'html-react-parser';

import {
  escape,
  has,
  isBoolean,
  map,
  reject,
  result,
  sortBy,
  startCase,
  times,
} from 'lodash';

import { DATE_FORMATS, EMPTY_FIELD } from './constants';

export function splitName (name?: string | null) {
  if (name === undefined || name === null) {
    return ['', ''];
  }

  const [firstName, ...lastName] = name.trim().split(' ');
  return [firstName, lastName.join(' ').trim()];
}

export function splitCommaList (str?: string | null) {
  if (str === undefined || str === null || str.trim() === '') {
    return [];
  }

  // tslint:disable-next-line no-magic-numbers
  if (str.indexOf(',') === -1) {
    return [str.trim()];
  }

  return str.split(',').map(s => s.trim()).filter(v => (v !== ''));
}

export function formatFullName (firstName?: string, lastName?: string) {
  return `${firstName || ''} ${lastName || ''}`.trim();
}

export function formatPhoneNumber (input?: string) {
  // check phone number not already formatted
  const phoneNumber = input && input.match(/\d/g);

  if (phoneNumber) {
    const unformattedNumber = phoneNumber.join('');

    // tslint:disable-next-line no-magic-numbers
    return `(${unformattedNumber.slice(0, 3)}) ${unformattedNumber.slice(3, 6)}-${unformattedNumber.slice(6, 10)}`;
  }
  return EMPTY_FIELD;
}

export function formatDate (value?: string | null, dateFormat = DATE_FORMATS.date) {
  return value
    ? format(value, dateFormat)
    : EMPTY_FIELD;
}

export function getNameOrDefault (obj?: { [key: string]: any }, { field = 'name', defaultValue = EMPTY_FIELD } = {}) {
  if (obj) {
    if (has(obj, 'first_name')) {
      return (`${result(obj, 'first_name', '')} ${result(obj, 'last_name', '')}`).trim();
    }
    if (has(obj, field)) {
      return obj[field];
    }
  }
  return defaultValue;
}

export function getOrDefault (obj?: any) {
  try {
    return obj.trim() || EMPTY_FIELD;
  }
  catch (err) {
    // do nothing
  }
  return obj || EMPTY_FIELD;
}

export function formatSocialSecurityNumber (input?: string) {
  // check ssn not already formatted
  const socialSecurityNumber = input && input.match(/\d/g);

  if (socialSecurityNumber) {
    const unformattedSSN = socialSecurityNumber.join('');
    // tslint:disable-next-line no-magic-numbers
    return `${unformattedSSN.slice(0, 3)}-${unformattedSSN.slice(3, 5)}-${unformattedSSN.slice(5, 9)}`;
  }
  return EMPTY_FIELD;
}

export function formatPercentage (value: number | string, decimalPoints = 2) {
  const zeros = times(decimalPoints, () => '0').join('')
    , formattingString = `0.${zeros}%`;
  return (value || value === 0) ? numeral(value).format(formattingString) : EMPTY_FIELD;
}

export function formatMoney (value?: number | string) {
  return (value || value === 0)
    ? numeral(value).format('$0,0.00')
    : EMPTY_FIELD;
}

export function formatParagraphs (field?: string) {
  return field
    ? field.split(/\r?\n/).map((s, i) => <p key={i}>{s}</p>)
    : EMPTY_FIELD;
}

export function formatCommaSeparatedNumber (value?: number | string) {
  return (value || value === 0)
    ? numeral(value).format('0,0')
    : EMPTY_FIELD;
}

export function formatDelimitedList (list?: string[], delimiter = ', ') {
  if (list) {
    return getOrDefault(list.join(delimiter));
  }
  return EMPTY_FIELD;
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

export function formatMoneyInput (value?: number | string) {
  return value && numeral(value).value();
}

export function formatDuration (iso8601?: string) {
  if (!iso8601) {
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
    (count === 1) ? unit.slice(0, -1) : unit, // de-pluralize single count units
    count,
  ]);

  // Join into string
  return unitCountsHuman.map(([unit, count]) => `${count} ${unit}`).join(', ');
}

export function stripNonAlpha (str?: string | null) {
  if (str === undefined || str === null) {
    return '';
  }

  return str.replace(/[^A-Za-z]/g, '');
}

export function pluralize (baseWord: string, pluralSuffix: string, count: number) {
  return count === 1 ? baseWord : `${baseWord}${pluralSuffix}`;
}

export function getType (fullType?: string) {
  const type = fullType && fullType.split('.')[1];
  return type || fullType;
}

export function preserveNewLines (body: string) {
  return (body.replace(/\n/g, '<br/>'));
}

export function parseAndPreserveNewlines (body?: string) {
  if (!body) { return EMPTY_FIELD; }
  const escapedBody = escape(body);
  return parser(preserveNewLines(escapedBody));
}

export function getPercentValue (value?: string) {
  if (!value) { return value; }
  return String(Number(value) / 100);
}

export function getPercentDisplay (value?: string) {
  if (!value) { return value; }
  return Number(value) * 100;
}

export function getDisplayName (component: any): (string | undefined) {
  if (!component) {
    return undefined;
  }

  return component.displayName || component.name || 'Component';
}

export function varToLabel (str: string) {
  // Sourced significantly from https://github.com/gouch/to-title-case/blob/master/to-title-case.js
  const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i
    , suffix = (str).split('.').pop() || ''
    , formatted = startCase(suffix);

  return formatted.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (match: string, index: number, title: string) => {
    if (index > 0 && index + match.length !== title.length &&
      match.search(smallWords) > -1 && title.charAt(index - 2) !== ':' &&
      (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
}

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
