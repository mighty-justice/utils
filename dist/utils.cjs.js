'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var mobx = require('mobx');
var mobxReact = require('mobx-react');
var cx = _interopDefault(require('classnames'));
var iso8601Duration = require('iso8601-duration');
var dateFns = require('date-fns');
var numeral = _interopDefault(require('numeral'));
var parser = _interopDefault(require('html-react-parser'));
var lodash = require('lodash');

var EMPTY_FIELD = '--';
var DATE_FORMATS = {
  date: 'MM/DD/YY',
  date_value: 'YYYY-MM-DD'
};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

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

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function splitName(name) {
  if (name === undefined || name === null) {
    return ['', ''];
  }

  var _name$trim$split = name.trim().split(' '),
      _name$trim$split2 = _toArray(_name$trim$split),
      firstName = _name$trim$split2[0],
      lastName = _name$trim$split2.slice(1);

  return [firstName, lastName.join(' ').trim()];
}
function splitCommaList(str) {
  if (str === undefined || str === null || str.trim() === '') {
    return [];
  } // tslint:disable-next-line no-magic-numbers


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
  return "".concat(firstName || '', " ").concat(lastName || '').trim();
}
function formatPhoneNumber(input) {
  // check phone number not already formatted
  var phoneNumber = input && input.match(/\d/g);

  if (phoneNumber) {
    var unformattedNumber = phoneNumber.join(''); // tslint:disable-next-line no-magic-numbers

    return "(".concat(unformattedNumber.slice(0, 3), ") ").concat(unformattedNumber.slice(3, 6), "-").concat(unformattedNumber.slice(6, 10));
  }

  return EMPTY_FIELD;
}
function formatDate(value) {
  var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DATE_FORMATS.date;
  return value ? dateFns.format(value, dateFormat) : EMPTY_FIELD;
}
function getNameOrDefault(obj) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$field = _ref.field,
      field = _ref$field === void 0 ? 'name' : _ref$field,
      _ref$defaultValue = _ref.defaultValue,
      defaultValue = _ref$defaultValue === void 0 ? EMPTY_FIELD : _ref$defaultValue;

  if (obj) {
    if (lodash.has(obj, 'first_name')) {
      return "".concat(lodash.result(obj, 'first_name', ''), " ").concat(lodash.result(obj, 'last_name', '')).trim();
    }

    if (lodash.has(obj, field)) {
      return obj[field];
    }
  }

  return defaultValue;
}
function getOrDefault(obj) {
  try {
    return obj.trim() || EMPTY_FIELD;
  } catch (err) {// do nothing
  }

  return obj || EMPTY_FIELD;
}
function formatSocialSecurityNumber(input) {
  // check ssn not already formatted
  var socialSecurityNumber = input && input.match(/\d/g);

  if (socialSecurityNumber) {
    var unformattedSSN = socialSecurityNumber.join(''); // tslint:disable-next-line no-magic-numbers

    return "".concat(unformattedSSN.slice(0, 3), "-").concat(unformattedSSN.slice(3, 5), "-").concat(unformattedSSN.slice(5, 9));
  }

  return EMPTY_FIELD;
}
function formatPercentage(value) {
  var decimalPoints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var zeros = lodash.times(decimalPoints, function () {
    return '0';
  }).join(''),
      formattingString = "0.".concat(zeros, "%");
  return value || value === 0 ? numeral(value).format(formattingString) : EMPTY_FIELD;
}
function formatMoney(value) {
  return value || value === 0 ? numeral(value).format('$0,0.00') : EMPTY_FIELD;
}
function formatParagraphs(field) {
  return field ? field.split(/\r?\n/).map(function (s, i) {
    return React__default.createElement("p", {
      key: i
    }, s);
  }) : EMPTY_FIELD;
}
function formatCommaSeparatedNumber(value) {
  return value || value === 0 ? numeral(value).format('0,0') : EMPTY_FIELD;
}
function formatDelimitedList(list) {
  var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ', ';

  if (list) {
    return getOrDefault(list.join(delimiter));
  }

  return EMPTY_FIELD;
}
function mapBooleanToText(bool) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    mapUndefinedToNo: false
  },
      mapUndefinedToNo = _ref2.mapUndefinedToNo;

  if (lodash.isBoolean(bool)) {
    return bool ? 'Yes' : 'No';
  }

  if (mapUndefinedToNo && bool === undefined) {
    return 'No';
  }

  return EMPTY_FIELD;
}
function formatMoneyInput(value) {
  return value && numeral(value).value();
}
function formatDuration(iso8601) {
  if (!iso8601) {
    return EMPTY_FIELD;
  } // Translate object to KV Pair


  var unitCounts = Object.entries(iso8601Duration.parse(iso8601)); // Remove 0 entries
  // tslint:disable-next-line variable-name

  unitCounts = unitCounts.filter(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        _unit = _ref4[0],
        count = _ref4[1];

    return count > 0;
  }); // De-pluralize keys for entries of 1

  var unitCountsHuman = unitCounts.map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        unit = _ref6[0],
        count = _ref6[1];

    return [// tslint:disable-next-line no-magic-numbers
    count === 1 ? unit.slice(0, -1) : unit, // de-pluralize single count units
    count];
  }); // Join into string

  return unitCountsHuman.map(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        unit = _ref8[0],
        count = _ref8[1];

    return "".concat(count, " ").concat(unit);
  }).join(', ');
}
function stripNonAlpha(str) {
  if (str === undefined || str === null) {
    return '';
  }

  return str.replace(/[^A-Za-z]/g, '');
}
function pluralize(baseWord, pluralSuffix, count) {
  return count === 1 ? baseWord : "".concat(baseWord).concat(pluralSuffix);
}
function getType(fullType) {
  var type = fullType && fullType.split('.')[1];
  return type || fullType;
}
function preserveNewLines(body) {
  return body.replace(/\n/g, '<br/>');
}
function parseAndPreserveNewlines(body) {
  if (!body) {
    return EMPTY_FIELD;
  }

  var escapedBody = lodash.escape(body);
  return parser(preserveNewLines(escapedBody));
}
function getPercentValue(value) {
  if (!value) {
    return value;
  }

  return String(Number(value) / 100);
}
function getPercentDisplay(value) {
  if (!value) {
    return value;
  }

  return Number(value) * 100;
}
function getDisplayName(component) {
  if (!component) {
    return undefined;
  }

  return component.displayName || component.name || 'Component';
}
function varToLabel(str) {
  // Sourced significantly from https://github.com/gouch/to-title-case/blob/master/to-title-case.js
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i,
      suffix = str.split('.').pop() || '',
      formatted = lodash.startCase(suffix);
  return formatted.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
    if (index > 0 && index + match.length !== title.length && match.search(smallWords) > -1 && title.charAt(index - 2) !== ':' && (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') && title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
}
function toKey(dict) {
  var dictSorted = lodash.sortBy(lodash.map(dict, function (value, key) {
    return [key, value];
  })),
      dictFiltered = lodash.reject(dictSorted, function (_ref9) {
    var _ref10 = _slicedToArray(_ref9, 2),
        _key = _ref10[0],
        value = _ref10[1];

    return value === null || value === undefined;
  });

  if (dictFiltered.length < 1) {
    return '';
  }

  var dictString = dictFiltered.map(function (_ref11) {
    var _ref12 = _slicedToArray(_ref11, 2),
        key = _ref12[0],
        value = _ref12[1];

    return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value));
  }).join('&');
  return "?".concat(dictString);
}

function createDisabledContainer(WrappedComponent) {
  var _class, _class2, _temp;

  var DisabledContainer = mobxReact.observer(_class = (_temp = _class2 =
  /*#__PURE__*/
  function (_Component) {
    _inherits(DisabledContainer, _Component);

    function DisabledContainer() {
      _classCallCheck(this, DisabledContainer);

      return _possibleConstructorReturn(this, _getPrototypeOf(DisabledContainer).apply(this, arguments));
    }

    _createClass(DisabledContainer, [{
      key: "render",
      value: function render() {
        var classNames = cx(this.props.className, 'disabled');
        return React__default.createElement(WrappedComponent, _extends({}, this.props, {
          className: classNames,
          "data-for": "permission-required",
          "data-tip": true,
          "data-tip-disable": false,
          onClick: null,
          onSelect: null
        }));
      }
    }]);

    return DisabledContainer;
  }(React.Component), _class2.displayName = "DisabledContainer(".concat(getDisplayName(WrappedComponent), ")"), _temp)) || _class;

  return DisabledContainer;
} // tslint:disable-next-line max-line-length

function createGuardedContainer(_ref) {
  var _class3, _class4, _class5, _temp2;

  var isGuarded = _ref.isGuarded,
      enabledComponent = _ref.enabledComponent,
      disabledComponent = _ref.disabledComponent;

  var GuardedContainer = mobxReact.observer(_class3 = (_class4 = (_temp2 = _class5 =
  /*#__PURE__*/
  function (_Component2) {
    _inherits(GuardedContainer, _Component2);

    function GuardedContainer(props) {
      var _this;

      _classCallCheck(this, GuardedContainer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GuardedContainer).call(this, props));
      _this.GuardedComponent = void 0;
      _this.GuardedComponent = _this.userHasPermission ? enabledComponent : disabledComponent;
      return _this;
    }

    _createClass(GuardedContainer, [{
      key: "render",
      value: function render() {
        return React__default.createElement(this.GuardedComponent, this.props);
      }
    }, {
      key: "userHasPermission",
      get: function get() {
        return !isGuarded;
      }
    }]);

    return GuardedContainer;
  }(React.Component), _class5.displayName = "GuardedContainer(".concat(getDisplayName(enabledComponent), ")"), _temp2), (_applyDecoratedDescriptor(_class4.prototype, "userHasPermission", [mobx.computed], Object.getOwnPropertyDescriptor(_class4.prototype, "userHasPermission"), _class4.prototype)), _class4)) || _class3;

  return GuardedContainer;
}

function insertIf(condition, element) {
  return condition ? [element] : [];
}
function dateToday() {
  return formatDate(new Date().toISOString(), DATE_FORMATS.date_value);
}

exports.EMPTY_FIELD = EMPTY_FIELD;
exports.DATE_FORMATS = DATE_FORMATS;
exports.createDisabledContainer = createDisabledContainer;
exports.createGuardedContainer = createGuardedContainer;
exports.splitName = splitName;
exports.splitCommaList = splitCommaList;
exports.formatFullName = formatFullName;
exports.formatPhoneNumber = formatPhoneNumber;
exports.formatDate = formatDate;
exports.getNameOrDefault = getNameOrDefault;
exports.getOrDefault = getOrDefault;
exports.formatSocialSecurityNumber = formatSocialSecurityNumber;
exports.formatPercentage = formatPercentage;
exports.formatMoney = formatMoney;
exports.formatParagraphs = formatParagraphs;
exports.formatCommaSeparatedNumber = formatCommaSeparatedNumber;
exports.formatDelimitedList = formatDelimitedList;
exports.mapBooleanToText = mapBooleanToText;
exports.formatMoneyInput = formatMoneyInput;
exports.formatDuration = formatDuration;
exports.stripNonAlpha = stripNonAlpha;
exports.pluralize = pluralize;
exports.getType = getType;
exports.preserveNewLines = preserveNewLines;
exports.parseAndPreserveNewlines = parseAndPreserveNewlines;
exports.getPercentValue = getPercentValue;
exports.getPercentDisplay = getPercentDisplay;
exports.getDisplayName = getDisplayName;
exports.varToLabel = varToLabel;
exports.toKey = toKey;
exports.insertIf = insertIf;
exports.dateToday = dateToday;
