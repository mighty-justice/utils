import Decimal from 'decimal.js';
import { __decorate } from 'tslib';
import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { parse } from 'iso8601-duration';
import { format, parseISO } from 'date-fns';
import numeral from 'numeral';
import parser from 'html-react-parser';
import memoize from 'fast-memoize';
import { isString, isNumber, has, result, get, times, isBoolean, escape, startCase, upperCase, sortBy, map, reject, mapValues, isArray, isPlainObject, set } from 'lodash-es';
export { flatten as flattenArray } from 'lodash-es';
import moment from 'moment';

var EMPTY_FIELD = '--';
var DATE_FORMATS = {
  date: 'LL/dd/yy',
  date_at_time: 'LL/dd/yy @ h:mma',
  date_value: 'yyyy-LL-dd',
  written_date: 'MMMM d, yyyy',
  written_date_abbreviated: 'MMM d, yyyy'
};
var CENT_DECIMAL = /*#__PURE__*/new Decimal('100');
var RE_ALPHA = /[^A-Za-z]/g;
var RE_WORDS = /[A-Za-z0-9\u00C0-\u00FF+]+[^\s-]*/g;
var RE_SMALL_WORDS = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function canReplaceSymbols(template, chars) {
  return template.split('#').length - 1 === chars.length;
}
function replaceSymbolsWithChars(template, chars) {
  var charsReverse = chars.reverse();
  return template.split('').map(function (_char) {
    return _char === '#' ? charsReverse.pop() : _char;
  }).join('');
}
function hasStringContent(value) {
  if (!isString(value)) {
    return false;
  }

  return !!value.replace(/ /g, '').length;
}
function hasStringOrNumberContent(value) {
  return hasStringContent(value) || isNumber(value);
}
function splitName(name) {
  if (!hasStringContent(name)) {
    return ['', ''];
  }

  var _name$trim$split = name.trim().split(' '),
      firstName = _name$trim$split[0],
      lastName = _name$trim$split.slice(1);

  return [firstName, lastName.join(' ').trim()];
}
function splitCommaList(str) {
  if (!hasStringContent(str)) {
    return [];
  }

  if (str.indexOf(',') === -1) {
    return [str.trim()];
  }

  return str.split(',').map(function (s) {
    return s.trim();
  }).filter(function (v) {
    return v !== '';
  });
}
function formatFullName(firstName, lastName) {
  return ((firstName || '') + " " + (lastName || '')).trim();
}
function formatNumberTemplates(value, templates) {
  if (!hasStringContent(value)) {
    return EMPTY_FIELD;
  }

  var valueNumbers = value.match(/\d/g) || [],
      valueNonNumbers = value.match(/[^0-9\-(). ]/g) || [];

  if (valueNonNumbers.length) {
    return value;
  }

  for (var _iterator = _createForOfIteratorHelperLoose(templates), _step; !(_step = _iterator()).done;) {
    var template = _step.value;

    if (canReplaceSymbols(template, valueNumbers)) {
      return replaceSymbolsWithChars(template, valueNumbers);
    }
  }

  return value;
}
function formatPhoneNumber(value) {
  return formatNumberTemplates(value, ['###-####', '(###) ###-####', '+# (###) ###-####', '+## (###) ###-####']);
}
function formatDate(value, dateFormat) {
  if (dateFormat === void 0) {
    dateFormat = DATE_FORMATS.date;
  }

  if (!hasStringContent(value)) {
    return EMPTY_FIELD;
  }

  return format(parseISO(value), dateFormat);
}
function formatDateTime(value) {
  return formatDate(value, DATE_FORMATS.date_at_time);
}
function getNameOrDefault(obj, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$field = _ref.field,
      field = _ref$field === void 0 ? 'name' : _ref$field,
      _ref$defaultValue = _ref.defaultValue,
      defaultValue = _ref$defaultValue === void 0 ? EMPTY_FIELD : _ref$defaultValue;

  if (obj) {
    if (has(obj, 'first_name')) {
      return (result(obj, 'first_name', '') + " " + result(obj, 'last_name', '')).trim();
    }

    if (has(obj, field)) {
      return get(obj, field);
    }
  }

  return defaultValue;
}
function getOrDefault(value) {
  if (hasStringContent(value)) {
    return value.trim();
  }

  if (isNumber(value)) {
    return String(value);
  }

  return EMPTY_FIELD;
}
function formatSocialSecurityNumber(value) {
  return formatNumberTemplates(value, ['####', '###-##-####']);
}
function formatEmployerIdNumber(value) {
  return formatNumberTemplates(value, ['##-#######']);
}
function formatPercentage(value, decimalPoints) {
  if (decimalPoints === void 0) {
    decimalPoints = 2;
  }

  if (!hasStringOrNumberContent(value)) {
    return EMPTY_FIELD;
  }

  var zeros = times(decimalPoints, function () {
    return '0';
  }).join(''),
      formattingString = "0." + zeros + "%";
  return numeral(value).format(formattingString);
}
function formatMoney(value) {
  if (!hasStringOrNumberContent(value)) {
    return EMPTY_FIELD;
  }

  return numeral(value).format('$0,0.00');
}
function formatDollars(value) {
  if (!hasStringOrNumberContent(value)) {
    return EMPTY_FIELD;
  }

  return numeral(value).format('$0,0');
}
function formatParagraphs(value) {
  if (!hasStringContent(value)) {
    return EMPTY_FIELD;
  }

  return value.split(/\r?\n/).map(function (s, i) {
    return React.createElement("p", {
      key: i
    }, s);
  });
}
function formatCommaSeparatedNumber(value) {
  if (!hasStringOrNumberContent(value)) {
    return EMPTY_FIELD;
  }

  return numeral(value).format('0,0');
}
function formatDelimitedList(list, delimiter) {
  if (delimiter === void 0) {
    delimiter = ', ';
  }

  if (!list) {
    return EMPTY_FIELD;
  }

  return getOrDefault(list.join(delimiter));
}
function mapBooleanToText(bool, _temp2) {
  var _ref2 = _temp2 === void 0 ? {
    mapUndefinedToNo: false
  } : _temp2,
      mapUndefinedToNo = _ref2.mapUndefinedToNo;

  if (isBoolean(bool)) {
    return bool ? 'Yes' : 'No';
  }

  if (mapUndefinedToNo && bool === undefined) {
    return 'No';
  }

  return EMPTY_FIELD;
}
function formatMoneyInput(value) {
  if (!hasStringOrNumberContent(value)) {
    return value;
  }

  return numeral(value).value();
}
function formatDuration(iso8601) {
  if (!hasStringContent(iso8601)) {
    return EMPTY_FIELD;
  } // Translate object to KV Pair


  var unitCounts = Object.entries(parse(iso8601)); // Remove 0 entries
  // tslint:disable-next-line variable-name

  unitCounts = unitCounts.filter(function (_ref3) {
    var count = _ref3[1];
    return count > 0;
  }); // De-pluralize keys for entries of 1

  var unitCountsHuman = unitCounts.map(function (_ref4) {
    var unit = _ref4[0],
        count = _ref4[1];
    return [// tslint:disable-next-line no-magic-numbers
    count === 1 ? unit.slice(0, -1) : unit, count];
  }); // Join into string

  return unitCountsHuman.map(function (_ref5) {
    var unit = _ref5[0],
        count = _ref5[1];
    return count + " " + unit;
  }).join(', ');
}
function formatWebsite(website, text) {
  if (!hasStringContent(website)) {
    return EMPTY_FIELD;
  }

  return React.createElement("a", {
    href: website,
    rel: "noopener noreferrer",
    target: "_blank"
  }, text || website);
}
function stripNonAlpha(str) {
  if (!hasStringContent(str)) {
    return '';
  }

  return str.replace(RE_ALPHA, '');
}
function pluralize(baseWord, pluralSuffix, count) {
  return count === 1 ? baseWord : "" + baseWord + pluralSuffix;
}
function getType(fullType) {
  var type = fullType && fullType.split('.')[1];
  return type || fullType;
}
function preserveNewLines(body) {
  return body.replace(/\n/g, '<br/>');
}
function parseAndPreserveNewlines(body) {
  if (!hasStringContent(body)) {
    return EMPTY_FIELD;
  }

  return parser(preserveNewLines(escape(body)));
}
function getDisplayName(component) {
  if (!component) {
    return undefined;
  }

  return component.displayName || component.name || 'Component';
}

function _hasSmallWords(value) {
  return value.search(RE_SMALL_WORDS) > -1;
}

function _varToLabel(value) {
  var suffix = value.split('.').pop() || '',
      formatted = startCase(suffix),
      wordArray = formatted.match(RE_WORDS) || [],
      notOnlyWord = wordArray.length > 1;
  return wordArray.map(function (match, index) {
    var notFirstWord = index > 0;

    if (notFirstWord && notOnlyWord && _hasSmallWords(match)) {
      return match.toLowerCase();
    }

    return match.charAt(0).toUpperCase() + match.substr(1).toLowerCase();
  }).join(' ');
}

var varToLabel = /*#__PURE__*/memoize(_varToLabel);
function getInitials(value) {
  if (!hasStringContent(value)) {
    return '';
  }

  var MAX_CHARS = 3,
      prefix = value.split(',')[0],
      formatted = startCase(prefix),
      isValueAllCaps = formatted === upperCase(formatted),
      wordArray = formatted.match(RE_WORDS);
  return wordArray.map(function (word) {
    var isWordAllCaps = word === upperCase(word);

    if (_hasSmallWords(word)) {
      return '';
    }

    if (isWordAllCaps && !isValueAllCaps) {
      return word;
    }

    return word.charAt(0).toUpperCase();
  }).join('').substring(0, MAX_CHARS);
}
function toKey(dict) {
  var dictSorted = sortBy(map(dict, function (value, key) {
    return [key, value];
  })),
      dictFiltered = reject(dictSorted, function (_ref6) {
    var value = _ref6[1];
    return value === null || value === undefined;
  });

  if (dictFiltered.length < 1) {
    return '';
  }

  var dictString = dictFiltered.map(function (_ref7) {
    var key = _ref7[0],
        value = _ref7[1];
    return encodeURIComponent(key) + "=" + encodeURIComponent(value);
  }).join('&');
  return "?" + dictString;
}
function formatAddress(address) {
  if (!address) {
    return '--, --, -- --';
  }

  var filledInAddress = mapValues(address, function (s) {
    return s || EMPTY_FIELD;
  }),
      address1 = filledInAddress.address1,
      city = filledInAddress.city,
      state = filledInAddress.state,
      zip_code = filledInAddress.zip_code,
      address2 = address.address2,
      joinedAddress = [address1, address2].join(' ').trim();
  return joinedAddress + ", " + city + ", " + state + " " + zip_code;
}
function formatAddressMultiline(address) {
  return parser(formatAddress(address).replace(', ', '<br/>'));
}
function stringToHTML(string) {
  return parser(string);
}

function createDisabledContainer(WrappedComponent) {
  var DisabledContainer = /*#__PURE__*/function (_Component) {
    _inheritsLoose(DisabledContainer, _Component);

    function DisabledContainer() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = DisabledContainer.prototype;

    _proto.render = function render() {
      var classNames = cx(this.props.className, 'disabled');
      return React.createElement(WrappedComponent, Object.assign({}, this.props, {
        className: classNames,
        "data-for": "permission-required",
        "data-tip": true,
        "data-tip-disable": false,
        onClick: null,
        onSelect: null
      }));
    };

    return DisabledContainer;
  }(Component);

  DisabledContainer.displayName = "DisabledContainer(" + getDisplayName(WrappedComponent) + ")";
  DisabledContainer = __decorate([observer], DisabledContainer);
  return DisabledContainer;
} // tslint:disable-next-line max-line-length

function createGuardedContainer(_ref) {
  var isGuarded = _ref.isGuarded,
      enabledComponent = _ref.enabledComponent,
      disabledComponent = _ref.disabledComponent;

  var GuardedContainer = /*#__PURE__*/function (_Component2) {
    _inheritsLoose(GuardedContainer, _Component2);

    function GuardedContainer(props) {
      var _this;

      _this = _Component2.call(this, props) || this;
      _this.GuardedComponent = _this.userHasPermission ? enabledComponent : disabledComponent;
      return _this;
    }

    var _proto2 = GuardedContainer.prototype;

    _proto2.render = function render() {
      return React.createElement(this.GuardedComponent, Object.assign({}, this.props));
    };

    _createClass(GuardedContainer, [{
      key: "userHasPermission",
      get: function get() {
        return !isGuarded;
      }
    }]);

    return GuardedContainer;
  }(Component);

  GuardedContainer.displayName = "GuardedContainer(" + getDisplayName(enabledComponent) + ")";

  __decorate([computed], GuardedContainer.prototype, "userHasPermission", null);

  GuardedContainer = __decorate([observer], GuardedContainer);
  return GuardedContainer;
}

function dateToday() {
  return formatDate(new Date().toISOString(), DATE_FORMATS.date_value);
}
function isFutureDate(date) {
  return new Date(date).getTime() > new Date(new Date().toDateString()).getTime();
}
function inferCentury(year) {
  if (year.length !== 2) {
    return year;
  }

  var thisCentury = dateToday().substr(0, 2),
      lastCentury = moment().subtract(100, 'years').format('YYYY').substr(0, 2),
      thisCenturyGuess = "" + thisCentury + year,
      lastCenturyGuess = "" + lastCentury + year;

  if (isFutureDate(thisCenturyGuess + "-01-01")) {
    return lastCenturyGuess;
  }

  return thisCenturyGuess;
}

function insertIf(condition, element) {
  return condition ? [element] : [];
}

function _convertibleToDecimalObject(value) {
  return isString(value) && value !== '' || isNumber(value) || Decimal.isDecimal(value);
}

function getPercentValue(value) {
  if (!_convertibleToDecimalObject(value)) {
    return '';
  }

  return new Decimal(value).div(CENT_DECIMAL).toString();
}
function getPercentDisplay(value) {
  if (!_convertibleToDecimalObject(value)) {
    return '';
  }

  return new Decimal(value).times(CENT_DECIMAL).toString();
}

function isValidDate(value) {
  return !value || value.length === '####-##-##'.length && // ISO date
  moment(value).isValid() // Real day
  ;
}
function isValidPastDate(value) {
  return !value || isValidDate(value) && moment(value).isBefore(moment()) // In the past
  ;
}

function mergeObjects(objectA, objectB) {
  return _extends({}, objectA, objectB);
}

var _hasUnflattenedValues = function _hasUnflattenedValues(value) {
  return (isArray(value) || isPlainObject(value)) && !!Object.keys(value).length;
};

function _flattenObject(input, parentKey) {
  var _getFlatKey = function _getFlatKey(key) {
    if (isArray(input)) {
      return parentKey + "[" + key + "]";
    }

    if (parentKey) {
      return parentKey + "." + key;
    }

    return key;
  };

  return Object.entries(input).reduce(function (output, _ref) {
    var _mergeObjects;

    var key = _ref[0],
        value = _ref[1];

    var flatKey = _getFlatKey(key);

    if (_hasUnflattenedValues(value)) {
      var flatValues = _flattenObject(value, flatKey);

      return mergeObjects(output, flatValues);
    }

    return mergeObjects(output, (_mergeObjects = {}, _mergeObjects[flatKey] = value, _mergeObjects));
  }, {});
}

function flattenObject(input) {
  return _flattenObject(input, '');
}

function unflattenObject(object) {
  return Object.entries(flattenObject(object)).reduce(function (objOut, _ref2) {
    var key = _ref2[0],
        value = _ref2[1];
    return set(objOut, key, value);
  }, {});
}

export { CENT_DECIMAL, DATE_FORMATS, EMPTY_FIELD, RE_ALPHA, RE_SMALL_WORDS, RE_WORDS, canReplaceSymbols, createDisabledContainer, createGuardedContainer, dateToday, flattenObject, formatAddress, formatAddressMultiline, formatCommaSeparatedNumber, formatDate, formatDateTime, formatDelimitedList, formatDollars, formatDuration, formatEmployerIdNumber, formatFullName, formatMoney, formatMoneyInput, formatNumberTemplates, formatParagraphs, formatPercentage, formatPhoneNumber, formatSocialSecurityNumber, formatWebsite, getDisplayName, getInitials, getNameOrDefault, getOrDefault, getPercentDisplay, getPercentValue, getType, hasStringContent, hasStringOrNumberContent, inferCentury, insertIf, isFutureDate, isValidDate, isValidPastDate, mapBooleanToText, parseAndPreserveNewlines, pluralize, preserveNewLines, replaceSymbolsWithChars, splitCommaList, splitName, stringToHTML, stripNonAlpha, toKey, unflattenObject, varToLabel };
//# sourceMappingURL=utils.esm.js.map
