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

/*
 *  decimal.js v10.1.1
 *  An arbitrary-precision Decimal type for JavaScript.
 *  https://github.com/MikeMcl/decimal.js
 *  Copyright (c) 2019 Michael Mclaughlin <M8ch88l@gmail.com>
 *  MIT Licence
 */


// -----------------------------------  EDITABLE DEFAULTS  ------------------------------------ //


  // The maximum exponent magnitude.
  // The limit on the value of `toExpNeg`, `toExpPos`, `minE` and `maxE`.
var EXP_LIMIT = 9e15,                      // 0 to 9e15

  // The limit on the value of `precision`, and on the value of the first argument to
  // `toDecimalPlaces`, `toExponential`, `toFixed`, `toPrecision` and `toSignificantDigits`.
  MAX_DIGITS = 1e9,                        // 0 to 1e9

  // Base conversion alphabet.
  NUMERALS = '0123456789abcdef',

  // The natural logarithm of 10 (1025 digits).
  LN10 = '2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058',

  // Pi (1025 digits).
  PI = '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789',


  // The initial configuration properties of the Decimal constructor.
  DEFAULTS = {

    // These values must be integers within the stated ranges (inclusive).
    // Most of these values can be changed at run-time using the `Decimal.config` method.

    // The maximum number of significant digits of the result of a calculation or base conversion.
    // E.g. `Decimal.config({ precision: 20 });`
    precision: 20,                         // 1 to MAX_DIGITS

    // The rounding mode used when rounding to `precision`.
    //
    // ROUND_UP         0 Away from zero.
    // ROUND_DOWN       1 Towards zero.
    // ROUND_CEIL       2 Towards +Infinity.
    // ROUND_FLOOR      3 Towards -Infinity.
    // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
    // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
    // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
    // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
    // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
    //
    // E.g.
    // `Decimal.rounding = 4;`
    // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
    rounding: 4,                           // 0 to 8

    // The modulo mode used when calculating the modulus: a mod n.
    // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
    // The remainder (r) is calculated as: r = a - n * q.
    //
    // UP         0 The remainder is positive if the dividend is negative, else is negative.
    // DOWN       1 The remainder has the same sign as the dividend (JavaScript %).
    // FLOOR      3 The remainder has the same sign as the divisor (Python %).
    // HALF_EVEN  6 The IEEE 754 remainder function.
    // EUCLID     9 Euclidian division. q = sign(n) * floor(a / abs(n)). Always positive.
    //
    // Truncated division (1), floored division (3), the IEEE 754 remainder (6), and Euclidian
    // division (9) are commonly used for the modulus operation. The other rounding modes can also
    // be used, but they may not give useful results.
    modulo: 1,                             // 0 to 9

    // The exponent value at and beneath which `toString` returns exponential notation.
    // JavaScript numbers: -7
    toExpNeg: -7,                          // 0 to -EXP_LIMIT

    // The exponent value at and above which `toString` returns exponential notation.
    // JavaScript numbers: 21
    toExpPos:  21,                         // 0 to EXP_LIMIT

    // The minimum exponent value, beneath which underflow to zero occurs.
    // JavaScript numbers: -324  (5e-324)
    minE: -EXP_LIMIT,                      // -1 to -EXP_LIMIT

    // The maximum exponent value, above which overflow to Infinity occurs.
    // JavaScript numbers: 308  (1.7976931348623157e+308)
    maxE: EXP_LIMIT,                       // 1 to EXP_LIMIT

    // Whether to use cryptographically-secure random number generation, if available.
    crypto: false                          // true/false
  },


// ----------------------------------- END OF EDITABLE DEFAULTS ------------------------------- //


  inexact, quadrant,
  external = true,

  decimalError = '[DecimalError] ',
  invalidArgument = decimalError + 'Invalid argument: ',
  precisionLimitExceeded = decimalError + 'Precision limit exceeded',
  cryptoUnavailable = decimalError + 'crypto unavailable',

  mathfloor = Math.floor,
  mathpow = Math.pow,

  isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,
  isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,
  isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,
  isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,

  BASE = 1e7,
  LOG_BASE = 7,
  MAX_SAFE_INTEGER = 9007199254740991,

  LN10_PRECISION = LN10.length - 1,
  PI_PRECISION = PI.length - 1,

  // Decimal.prototype object
  P = { name: '[object Decimal]' };


// Decimal prototype methods


/*
 *  absoluteValue             abs
 *  ceil
 *  comparedTo                cmp
 *  cosine                    cos
 *  cubeRoot                  cbrt
 *  decimalPlaces             dp
 *  dividedBy                 div
 *  dividedToIntegerBy        divToInt
 *  equals                    eq
 *  floor
 *  greaterThan               gt
 *  greaterThanOrEqualTo      gte
 *  hyperbolicCosine          cosh
 *  hyperbolicSine            sinh
 *  hyperbolicTangent         tanh
 *  inverseCosine             acos
 *  inverseHyperbolicCosine   acosh
 *  inverseHyperbolicSine     asinh
 *  inverseHyperbolicTangent  atanh
 *  inverseSine               asin
 *  inverseTangent            atan
 *  isFinite
 *  isInteger                 isInt
 *  isNaN
 *  isNegative                isNeg
 *  isPositive                isPos
 *  isZero
 *  lessThan                  lt
 *  lessThanOrEqualTo         lte
 *  logarithm                 log
 *  [maximum]                 [max]
 *  [minimum]                 [min]
 *  minus                     sub
 *  modulo                    mod
 *  naturalExponential        exp
 *  naturalLogarithm          ln
 *  negated                   neg
 *  plus                      add
 *  precision                 sd
 *  round
 *  sine                      sin
 *  squareRoot                sqrt
 *  tangent                   tan
 *  times                     mul
 *  toBinary
 *  toDecimalPlaces           toDP
 *  toExponential
 *  toFixed
 *  toFraction
 *  toHexadecimal             toHex
 *  toNearest
 *  toNumber
 *  toOctal
 *  toPower                   pow
 *  toPrecision
 *  toSignificantDigits       toSD
 *  toString
 *  truncated                 trunc
 *  valueOf                   toJSON
 */


/*
 * Return a new Decimal whose value is the absolute value of this Decimal.
 *
 */
P.absoluteValue = P.abs = function () {
  var x = new this.constructor(this);
  if (x.s < 0) x.s = 1;
  return finalise(x);
};


/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in the
 * direction of positive Infinity.
 *
 */
P.ceil = function () {
  return finalise(new this.constructor(this), this.e + 1, 2);
};


/*
 * Return
 *   1    if the value of this Decimal is greater than the value of `y`,
 *  -1    if the value of this Decimal is less than the value of `y`,
 *   0    if they have the same value,
 *   NaN  if the value of either Decimal is NaN.
 *
 */
P.comparedTo = P.cmp = function (y) {
  var i, j, xdL, ydL,
    x = this,
    xd = x.d,
    yd = (y = new x.constructor(y)).d,
    xs = x.s,
    ys = y.s;

  // Either NaN or ±Infinity?
  if (!xd || !yd) {
    return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
  }

  // Either zero?
  if (!xd[0] || !yd[0]) return xd[0] ? xs : yd[0] ? -ys : 0;

  // Signs differ?
  if (xs !== ys) return xs;

  // Compare exponents.
  if (x.e !== y.e) return x.e > y.e ^ xs < 0 ? 1 : -1;

  xdL = xd.length;
  ydL = yd.length;

  // Compare digit by digit.
  for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
    if (xd[i] !== yd[i]) return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
  }

  // Compare lengths.
  return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
};


/*
 * Return a new Decimal whose value is the cosine of the value in radians of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-1, 1]
 *
 * cos(0)         = 1
 * cos(-0)        = 1
 * cos(Infinity)  = NaN
 * cos(-Infinity) = NaN
 * cos(NaN)       = NaN
 *
 */
P.cosine = P.cos = function () {
  var pr, rm,
    x = this,
    Ctor = x.constructor;

  if (!x.d) return new Ctor(NaN);

  // cos(0) = cos(-0) = 1
  if (!x.d[0]) return new Ctor(1);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;

  x = cosine(Ctor, toLessThanHalfPi(Ctor, x));

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
};


/*
 *
 * Return a new Decimal whose value is the cube root of the value of this Decimal, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 *  cbrt(0)  =  0
 *  cbrt(-0) = -0
 *  cbrt(1)  =  1
 *  cbrt(-1) = -1
 *  cbrt(N)  =  N
 *  cbrt(-I) = -I
 *  cbrt(I)  =  I
 *
 * Math.cbrt(x) = (x < 0 ? -Math.pow(-x, 1/3) : Math.pow(x, 1/3))
 *
 */
P.cubeRoot = P.cbrt = function () {
  var e, m, n, r, rep, s, sd, t, t3, t3plusx,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite() || x.isZero()) return new Ctor(x);
  external = false;

  // Initial estimate.
  s = x.s * Math.pow(x.s * x, 1 / 3);

   // Math.cbrt underflow/overflow?
   // Pass x to Math.pow as integer, then adjust the exponent of the result.
  if (!s || Math.abs(s) == 1 / 0) {
    n = digitsToString(x.d);
    e = x.e;

    // Adjust n exponent so it is a multiple of 3 away from x exponent.
    if (s = (e - n.length + 1) % 3) n += (s == 1 || s == -2 ? '0' : '00');
    s = Math.pow(n, 1 / 3);

    // Rarely, e may be one less than the result exponent value.
    e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));

    if (s == 1 / 0) {
      n = '5e' + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf('e') + 1) + e;
    }

    r = new Ctor(n);
    r.s = x.s;
  } else {
    r = new Ctor(s.toString());
  }

  sd = (e = Ctor.precision) + 3;

  // Halley's method.
  // TODO? Compare Newton's method.
  for (;;) {
    t = r;
    t3 = t.times(t).times(t);
    t3plusx = t3.plus(x);
    r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);

    // TODO? Replace with for-loop and checkRoundingDigits.
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);

      // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or 4999
      // , i.e. approaching a rounding boundary, continue the iteration.
      if (n == '9999' || !rep && n == '4999') {

        // On the first iteration only, check to see if rounding up gives the exact result as the
        // nines may infinitely repeat.
        if (!rep) {
          finalise(t, e + 1, 0);

          if (t.times(t).times(t).eq(x)) {
            r = t;
            break;
          }
        }

        sd += 4;
        rep = 1;
      } else {

        // If the rounding digits are null, 0{0,4} or 50{0,3}, check for an exact result.
        // If not, then there are further digits and m will be truthy.
        if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

          // Truncate to the first rounding digit.
          finalise(r, e + 1, 1);
          m = !r.times(r).times(r).eq(x);
        }

        break;
      }
    }
  }

  external = true;

  return finalise(r, e, Ctor.rounding, m);
};


/*
 * Return the number of decimal places of the value of this Decimal.
 *
 */
P.decimalPlaces = P.dp = function () {
  var w,
    d = this.d,
    n = NaN;

  if (d) {
    w = d.length - 1;
    n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;

    // Subtract the number of trailing zeros of the last word.
    w = d[w];
    if (w) for (; w % 10 == 0; w /= 10) n--;
    if (n < 0) n = 0;
  }

  return n;
};


/*
 *  n / 0 = I
 *  n / N = N
 *  n / I = 0
 *  0 / n = 0
 *  0 / 0 = N
 *  0 / N = N
 *  0 / I = 0
 *  N / n = N
 *  N / 0 = N
 *  N / N = N
 *  N / I = N
 *  I / n = I
 *  I / 0 = I
 *  I / N = N
 *  I / I = N
 *
 * Return a new Decimal whose value is the value of this Decimal divided by `y`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 */
P.dividedBy = P.div = function (y) {
  return divide(this, new this.constructor(y));
};


/*
 * Return a new Decimal whose value is the integer part of dividing the value of this Decimal
 * by the value of `y`, rounded to `precision` significant digits using rounding mode `rounding`.
 *
 */
P.dividedToIntegerBy = P.divToInt = function (y) {
  var x = this,
    Ctor = x.constructor;
  return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
};


/*
 * Return true if the value of this Decimal is equal to the value of `y`, otherwise return false.
 *
 */
P.equals = P.eq = function (y) {
  return this.cmp(y) === 0;
};


/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in the
 * direction of negative Infinity.
 *
 */
P.floor = function () {
  return finalise(new this.constructor(this), this.e + 1, 3);
};


/*
 * Return true if the value of this Decimal is greater than the value of `y`, otherwise return
 * false.
 *
 */
P.greaterThan = P.gt = function (y) {
  return this.cmp(y) > 0;
};


/*
 * Return true if the value of this Decimal is greater than or equal to the value of `y`,
 * otherwise return false.
 *
 */
P.greaterThanOrEqualTo = P.gte = function (y) {
  var k = this.cmp(y);
  return k == 1 || k === 0;
};


/*
 * Return a new Decimal whose value is the hyperbolic cosine of the value in radians of this
 * Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [1, Infinity]
 *
 * cosh(x) = 1 + x^2/2! + x^4/4! + x^6/6! + ...
 *
 * cosh(0)         = 1
 * cosh(-0)        = 1
 * cosh(Infinity)  = Infinity
 * cosh(-Infinity) = Infinity
 * cosh(NaN)       = NaN
 *
 *  x        time taken (ms)   result
 * 1000      9                 9.8503555700852349694e+433
 * 10000     25                4.4034091128314607936e+4342
 * 100000    171               1.4033316802130615897e+43429
 * 1000000   3817              1.5166076984010437725e+434294
 * 10000000  abandoned after 2 minute wait
 *
 * TODO? Compare performance of cosh(x) = 0.5 * (exp(x) + exp(-x))
 *
 */
P.hyperbolicCosine = P.cosh = function () {
  var k, n, pr, rm, len,
    x = this,
    Ctor = x.constructor,
    one = new Ctor(1);

  if (!x.isFinite()) return new Ctor(x.s ? 1 / 0 : NaN);
  if (x.isZero()) return one;

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;

  // Argument reduction: cos(4x) = 1 - 8cos^2(x) + 8cos^4(x) + 1
  // i.e. cos(x) = 1 - cos^2(x/4)(8 - 8cos^2(x/4))

  // Estimate the optimum number of times to use the argument reduction.
  // TODO? Estimation reused from cosine() and may not be optimal here.
  if (len < 32) {
    k = Math.ceil(len / 3);
    n = Math.pow(4, -k).toString();
  } else {
    k = 16;
    n = '2.3283064365386962890625e-10';
  }

  x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);

  // Reverse argument reduction
  var cosh2_x,
    i = k,
    d8 = new Ctor(8);
  for (; i--;) {
    cosh2_x = x.times(x);
    x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
  }

  return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
};


/*
 * Return a new Decimal whose value is the hyperbolic sine of the value in radians of this
 * Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-Infinity, Infinity]
 *
 * sinh(x) = x + x^3/3! + x^5/5! + x^7/7! + ...
 *
 * sinh(0)         = 0
 * sinh(-0)        = -0
 * sinh(Infinity)  = Infinity
 * sinh(-Infinity) = -Infinity
 * sinh(NaN)       = NaN
 *
 * x        time taken (ms)
 * 10       2 ms
 * 100      5 ms
 * 1000     14 ms
 * 10000    82 ms
 * 100000   886 ms            1.4033316802130615897e+43429
 * 200000   2613 ms
 * 300000   5407 ms
 * 400000   8824 ms
 * 500000   13026 ms          8.7080643612718084129e+217146
 * 1000000  48543 ms
 *
 * TODO? Compare performance of sinh(x) = 0.5 * (exp(x) - exp(-x))
 *
 */
P.hyperbolicSine = P.sinh = function () {
  var k, pr, rm, len,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite() || x.isZero()) return new Ctor(x);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
  Ctor.rounding = 1;
  len = x.d.length;

  if (len < 3) {
    x = taylorSeries(Ctor, 2, x, x, true);
  } else {

    // Alternative argument reduction: sinh(3x) = sinh(x)(3 + 4sinh^2(x))
    // i.e. sinh(x) = sinh(x/3)(3 + 4sinh^2(x/3))
    // 3 multiplications and 1 addition

    // Argument reduction: sinh(5x) = sinh(x)(5 + sinh^2(x)(20 + 16sinh^2(x)))
    // i.e. sinh(x) = sinh(x/5)(5 + sinh^2(x/5)(20 + 16sinh^2(x/5)))
    // 4 multiplications and 2 additions

    // Estimate the optimum number of times to use the argument reduction.
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;

    x = x.times(Math.pow(5, -k));

    x = taylorSeries(Ctor, 2, x, x, true);

    // Reverse argument reduction
    var sinh2_x,
      d5 = new Ctor(5),
      d16 = new Ctor(16),
      d20 = new Ctor(20);
    for (; k--;) {
      sinh2_x = x.times(x);
      x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
    }
  }

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return finalise(x, pr, rm, true);
};


/*
 * Return a new Decimal whose value is the hyperbolic tangent of the value in radians of this
 * Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-1, 1]
 *
 * tanh(x) = sinh(x) / cosh(x)
 *
 * tanh(0)         = 0
 * tanh(-0)        = -0
 * tanh(Infinity)  = 1
 * tanh(-Infinity) = -1
 * tanh(NaN)       = NaN
 *
 */
P.hyperbolicTangent = P.tanh = function () {
  var pr, rm,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite()) return new Ctor(x.s);
  if (x.isZero()) return new Ctor(x);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 7;
  Ctor.rounding = 1;

  return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
};


/*
 * Return a new Decimal whose value is the arccosine (inverse cosine) in radians of the value of
 * this Decimal.
 *
 * Domain: [-1, 1]
 * Range: [0, pi]
 *
 * acos(x) = pi/2 - asin(x)
 *
 * acos(0)       = pi/2
 * acos(-0)      = pi/2
 * acos(1)       = 0
 * acos(-1)      = pi
 * acos(1/2)     = pi/3
 * acos(-1/2)    = 2*pi/3
 * acos(|x| > 1) = NaN
 * acos(NaN)     = NaN
 *
 */
P.inverseCosine = P.acos = function () {
  var halfPi,
    x = this,
    Ctor = x.constructor,
    k = x.abs().cmp(1),
    pr = Ctor.precision,
    rm = Ctor.rounding;

  if (k !== -1) {
    return k === 0
      // |x| is 1
      ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0)
      // |x| > 1 or x is NaN
      : new Ctor(NaN);
  }

  if (x.isZero()) return getPi(Ctor, pr + 4, rm).times(0.5);

  // TODO? Special case acos(0.5) = pi/3 and acos(-0.5) = 2*pi/3

  Ctor.precision = pr + 6;
  Ctor.rounding = 1;

  x = x.asin();
  halfPi = getPi(Ctor, pr + 4, rm).times(0.5);

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return halfPi.minus(x);
};


/*
 * Return a new Decimal whose value is the inverse of the hyperbolic cosine in radians of the
 * value of this Decimal.
 *
 * Domain: [1, Infinity]
 * Range: [0, Infinity]
 *
 * acosh(x) = ln(x + sqrt(x^2 - 1))
 *
 * acosh(x < 1)     = NaN
 * acosh(NaN)       = NaN
 * acosh(Infinity)  = Infinity
 * acosh(-Infinity) = NaN
 * acosh(0)         = NaN
 * acosh(-0)        = NaN
 * acosh(1)         = 0
 * acosh(-1)        = NaN
 *
 */
P.inverseHyperbolicCosine = P.acosh = function () {
  var pr, rm,
    x = this,
    Ctor = x.constructor;

  if (x.lte(1)) return new Ctor(x.eq(1) ? 0 : NaN);
  if (!x.isFinite()) return new Ctor(x);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
  Ctor.rounding = 1;
  external = false;

  x = x.times(x).minus(1).sqrt().plus(x);

  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;

  return x.ln();
};


/*
 * Return a new Decimal whose value is the inverse of the hyperbolic sine in radians of the value
 * of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-Infinity, Infinity]
 *
 * asinh(x) = ln(x + sqrt(x^2 + 1))
 *
 * asinh(NaN)       = NaN
 * asinh(Infinity)  = Infinity
 * asinh(-Infinity) = -Infinity
 * asinh(0)         = 0
 * asinh(-0)        = -0
 *
 */
P.inverseHyperbolicSine = P.asinh = function () {
  var pr, rm,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite() || x.isZero()) return new Ctor(x);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
  Ctor.rounding = 1;
  external = false;

  x = x.times(x).plus(1).sqrt().plus(x);

  external = true;
  Ctor.precision = pr;
  Ctor.rounding = rm;

  return x.ln();
};


/*
 * Return a new Decimal whose value is the inverse of the hyperbolic tangent in radians of the
 * value of this Decimal.
 *
 * Domain: [-1, 1]
 * Range: [-Infinity, Infinity]
 *
 * atanh(x) = 0.5 * ln((1 + x) / (1 - x))
 *
 * atanh(|x| > 1)   = NaN
 * atanh(NaN)       = NaN
 * atanh(Infinity)  = NaN
 * atanh(-Infinity) = NaN
 * atanh(0)         = 0
 * atanh(-0)        = -0
 * atanh(1)         = Infinity
 * atanh(-1)        = -Infinity
 *
 */
P.inverseHyperbolicTangent = P.atanh = function () {
  var pr, rm, wpr, xsd,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite()) return new Ctor(NaN);
  if (x.e >= 0) return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  xsd = x.sd();

  if (Math.max(xsd, pr) < 2 * -x.e - 1) return finalise(new Ctor(x), pr, rm, true);

  Ctor.precision = wpr = xsd - x.e;

  x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);

  Ctor.precision = pr + 4;
  Ctor.rounding = 1;

  x = x.ln();

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return x.times(0.5);
};


/*
 * Return a new Decimal whose value is the arcsine (inverse sine) in radians of the value of this
 * Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-pi/2, pi/2]
 *
 * asin(x) = 2*atan(x/(1 + sqrt(1 - x^2)))
 *
 * asin(0)       = 0
 * asin(-0)      = -0
 * asin(1/2)     = pi/6
 * asin(-1/2)    = -pi/6
 * asin(1)       = pi/2
 * asin(-1)      = -pi/2
 * asin(|x| > 1) = NaN
 * asin(NaN)     = NaN
 *
 * TODO? Compare performance of Taylor series.
 *
 */
P.inverseSine = P.asin = function () {
  var halfPi, k,
    pr, rm,
    x = this,
    Ctor = x.constructor;

  if (x.isZero()) return new Ctor(x);

  k = x.abs().cmp(1);
  pr = Ctor.precision;
  rm = Ctor.rounding;

  if (k !== -1) {

    // |x| is 1
    if (k === 0) {
      halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
      halfPi.s = x.s;
      return halfPi;
    }

    // |x| > 1 or x is NaN
    return new Ctor(NaN);
  }

  // TODO? Special case asin(1/2) = pi/6 and asin(-1/2) = -pi/6

  Ctor.precision = pr + 6;
  Ctor.rounding = 1;

  x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return x.times(2);
};


/*
 * Return a new Decimal whose value is the arctangent (inverse tangent) in radians of the value
 * of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-pi/2, pi/2]
 *
 * atan(x) = x - x^3/3 + x^5/5 - x^7/7 + ...
 *
 * atan(0)         = 0
 * atan(-0)        = -0
 * atan(1)         = pi/4
 * atan(-1)        = -pi/4
 * atan(Infinity)  = pi/2
 * atan(-Infinity) = -pi/2
 * atan(NaN)       = NaN
 *
 */
P.inverseTangent = P.atan = function () {
  var i, j, k, n, px, t, r, wpr, x2,
    x = this,
    Ctor = x.constructor,
    pr = Ctor.precision,
    rm = Ctor.rounding;

  if (!x.isFinite()) {
    if (!x.s) return new Ctor(NaN);
    if (pr + 4 <= PI_PRECISION) {
      r = getPi(Ctor, pr + 4, rm).times(0.5);
      r.s = x.s;
      return r;
    }
  } else if (x.isZero()) {
    return new Ctor(x);
  } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
    r = getPi(Ctor, pr + 4, rm).times(0.25);
    r.s = x.s;
    return r;
  }

  Ctor.precision = wpr = pr + 10;
  Ctor.rounding = 1;

  // TODO? if (x >= 1 && pr <= PI_PRECISION) atan(x) = halfPi * x.s - atan(1 / x);

  // Argument reduction
  // Ensure |x| < 0.42
  // atan(x) = 2 * atan(x / (1 + sqrt(1 + x^2)))

  k = Math.min(28, wpr / LOG_BASE + 2 | 0);

  for (i = k; i; --i) x = x.div(x.times(x).plus(1).sqrt().plus(1));

  external = false;

  j = Math.ceil(wpr / LOG_BASE);
  n = 1;
  x2 = x.times(x);
  r = new Ctor(x);
  px = x;

  // atan(x) = x - x^3/3 + x^5/5 - x^7/7 + ...
  for (; i !== -1;) {
    px = px.times(x2);
    t = r.minus(px.div(n += 2));

    px = px.times(x2);
    r = t.plus(px.div(n += 2));

    if (r.d[j] !== void 0) for (i = j; r.d[i] === t.d[i] && i--;);
  }

  if (k) r = r.times(2 << (k - 1));

  external = true;

  return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
};


/*
 * Return true if the value of this Decimal is a finite number, otherwise return false.
 *
 */
P.isFinite = function () {
  return !!this.d;
};


/*
 * Return true if the value of this Decimal is an integer, otherwise return false.
 *
 */
P.isInteger = P.isInt = function () {
  return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
};


/*
 * Return true if the value of this Decimal is NaN, otherwise return false.
 *
 */
P.isNaN = function () {
  return !this.s;
};


/*
 * Return true if the value of this Decimal is negative, otherwise return false.
 *
 */
P.isNegative = P.isNeg = function () {
  return this.s < 0;
};


/*
 * Return true if the value of this Decimal is positive, otherwise return false.
 *
 */
P.isPositive = P.isPos = function () {
  return this.s > 0;
};


/*
 * Return true if the value of this Decimal is 0 or -0, otherwise return false.
 *
 */
P.isZero = function () {
  return !!this.d && this.d[0] === 0;
};


/*
 * Return true if the value of this Decimal is less than `y`, otherwise return false.
 *
 */
P.lessThan = P.lt = function (y) {
  return this.cmp(y) < 0;
};


/*
 * Return true if the value of this Decimal is less than or equal to `y`, otherwise return false.
 *
 */
P.lessThanOrEqualTo = P.lte = function (y) {
  return this.cmp(y) < 1;
};


/*
 * Return the logarithm of the value of this Decimal to the specified base, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * If no base is specified, return log[10](arg).
 *
 * log[base](arg) = ln(arg) / ln(base)
 *
 * The result will always be correctly rounded if the base of the log is 10, and 'almost always'
 * otherwise:
 *
 * Depending on the rounding mode, the result may be incorrectly rounded if the first fifteen
 * rounding digits are [49]99999999999999 or [50]00000000000000. In that case, the maximum error
 * between the result and the correctly rounded result will be one ulp (unit in the last place).
 *
 * log[-b](a)       = NaN
 * log[0](a)        = NaN
 * log[1](a)        = NaN
 * log[NaN](a)      = NaN
 * log[Infinity](a) = NaN
 * log[b](0)        = -Infinity
 * log[b](-0)       = -Infinity
 * log[b](-a)       = NaN
 * log[b](1)        = 0
 * log[b](Infinity) = Infinity
 * log[b](NaN)      = NaN
 *
 * [base] {number|string|Decimal} The base of the logarithm.
 *
 */
P.logarithm = P.log = function (base) {
  var isBase10, d, denominator, k, inf, num, sd, r,
    arg = this,
    Ctor = arg.constructor,
    pr = Ctor.precision,
    rm = Ctor.rounding,
    guard = 5;

  // Default base is 10.
  if (base == null) {
    base = new Ctor(10);
    isBase10 = true;
  } else {
    base = new Ctor(base);
    d = base.d;

    // Return NaN if base is negative, or non-finite, or is 0 or 1.
    if (base.s < 0 || !d || !d[0] || base.eq(1)) return new Ctor(NaN);

    isBase10 = base.eq(10);
  }

  d = arg.d;

  // Is arg negative, non-finite, 0 or 1?
  if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
    return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
  }

  // The result will have a non-terminating decimal expansion if base is 10 and arg is not an
  // integer power of 10.
  if (isBase10) {
    if (d.length > 1) {
      inf = true;
    } else {
      for (k = d[0]; k % 10 === 0;) k /= 10;
      inf = k !== 1;
    }
  }

  external = false;
  sd = pr + guard;
  num = naturalLogarithm(arg, sd);
  denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);

  // The result will have 5 rounding digits.
  r = divide(num, denominator, sd, 1);

  // If at a rounding boundary, i.e. the result's rounding digits are [49]9999 or [50]0000,
  // calculate 10 further digits.
  //
  // If the result is known to have an infinite decimal expansion, repeat this until it is clear
  // that the result is above or below the boundary. Otherwise, if after calculating the 10
  // further digits, the last 14 are nines, round up and assume the result is exact.
  // Also assume the result is exact if the last 14 are zero.
  //
  // Example of a result that will be incorrectly rounded:
  // log[1048576](4503599627370502) = 2.60000000000000009610279511444746...
  // The above result correctly rounded using ROUND_CEIL to 1 decimal place should be 2.7, but it
  // will be given as 2.6 as there are 15 zeros immediately after the requested decimal place, so
  // the exact result would be assumed to be 2.6, which rounded using ROUND_CEIL to 1 decimal
  // place is still 2.6.
  if (checkRoundingDigits(r.d, k = pr, rm)) {

    do {
      sd += 10;
      num = naturalLogarithm(arg, sd);
      denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
      r = divide(num, denominator, sd, 1);

      if (!inf) {

        // Check for 14 nines from the 2nd rounding digit, as the first may be 4.
        if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 1e14) {
          r = finalise(r, pr + 1, 0);
        }

        break;
      }
    } while (checkRoundingDigits(r.d, k += 10, rm));
  }

  external = true;

  return finalise(r, pr, rm);
};


/*
 * Return a new Decimal whose value is the maximum of the arguments and the value of this Decimal.
 *
 * arguments {number|string|Decimal}
 *
P.max = function () {
  Array.prototype.push.call(arguments, this);
  return maxOrMin(this.constructor, arguments, 'lt');
};
 */


/*
 * Return a new Decimal whose value is the minimum of the arguments and the value of this Decimal.
 *
 * arguments {number|string|Decimal}
 *
P.min = function () {
  Array.prototype.push.call(arguments, this);
  return maxOrMin(this.constructor, arguments, 'gt');
};
 */


/*
 *  n - 0 = n
 *  n - N = N
 *  n - I = -I
 *  0 - n = -n
 *  0 - 0 = 0
 *  0 - N = N
 *  0 - I = -I
 *  N - n = N
 *  N - 0 = N
 *  N - N = N
 *  N - I = N
 *  I - n = I
 *  I - 0 = I
 *  I - N = N
 *  I - I = N
 *
 * Return a new Decimal whose value is the value of this Decimal minus `y`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 */
P.minus = P.sub = function (y) {
  var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd,
    x = this,
    Ctor = x.constructor;

  y = new Ctor(y);

  // If either is not finite...
  if (!x.d || !y.d) {

    // Return NaN if either is NaN.
    if (!x.s || !y.s) y = new Ctor(NaN);

    // Return y negated if x is finite and y is ±Infinity.
    else if (x.d) y.s = -y.s;

    // Return x if y is finite and x is ±Infinity.
    // Return x if both are ±Infinity with different signs.
    // Return NaN if both are ±Infinity with the same sign.
    else y = new Ctor(y.d || x.s !== y.s ? x : NaN);

    return y;
  }

  // If signs differ...
  if (x.s != y.s) {
    y.s = -y.s;
    return x.plus(y);
  }

  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;

  // If either is zero...
  if (!xd[0] || !yd[0]) {

    // Return y negated if x is zero and y is non-zero.
    if (yd[0]) y.s = -y.s;

    // Return x if y is zero and x is non-zero.
    else if (xd[0]) y = new Ctor(x);

    // Return zero if both are zero.
    // From IEEE 754 (2008) 6.3: 0 - 0 = -0 - -0 = -0 when rounding to -Infinity.
    else return new Ctor(rm === 3 ? -0 : 0);

    return external ? finalise(y, pr, rm) : y;
  }

  // x and y are finite, non-zero numbers with the same sign.

  // Calculate base 1e7 exponents.
  e = mathfloor(y.e / LOG_BASE);
  xe = mathfloor(x.e / LOG_BASE);

  xd = xd.slice();
  k = xe - e;

  // If base 1e7 exponents differ...
  if (k) {
    xLTy = k < 0;

    if (xLTy) {
      d = xd;
      k = -k;
      len = yd.length;
    } else {
      d = yd;
      e = xe;
      len = xd.length;
    }

    // Numbers with massively different exponents would result in a very high number of
    // zeros needing to be prepended, but this can be avoided while still ensuring correct
    // rounding by limiting the number of zeros to `Math.ceil(pr / LOG_BASE) + 2`.
    i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;

    if (k > i) {
      k = i;
      d.length = 1;
    }

    // Prepend zeros to equalise exponents.
    d.reverse();
    for (i = k; i--;) d.push(0);
    d.reverse();

  // Base 1e7 exponents equal.
  } else {

    // Check digits to determine which is the bigger number.

    i = xd.length;
    len = yd.length;
    xLTy = i < len;
    if (xLTy) len = i;

    for (i = 0; i < len; i++) {
      if (xd[i] != yd[i]) {
        xLTy = xd[i] < yd[i];
        break;
      }
    }

    k = 0;
  }

  if (xLTy) {
    d = xd;
    xd = yd;
    yd = d;
    y.s = -y.s;
  }

  len = xd.length;

  // Append zeros to `xd` if shorter.
  // Don't add zeros to `yd` if shorter as subtraction only needs to start at `yd` length.
  for (i = yd.length - len; i > 0; --i) xd[len++] = 0;

  // Subtract yd from xd.
  for (i = yd.length; i > k;) {

    if (xd[--i] < yd[i]) {
      for (j = i; j && xd[--j] === 0;) xd[j] = BASE - 1;
      --xd[j];
      xd[i] += BASE;
    }

    xd[i] -= yd[i];
  }

  // Remove trailing zeros.
  for (; xd[--len] === 0;) xd.pop();

  // Remove leading zeros and adjust exponent accordingly.
  for (; xd[0] === 0; xd.shift()) --e;

  // Zero?
  if (!xd[0]) return new Ctor(rm === 3 ? -0 : 0);

  y.d = xd;
  y.e = getBase10Exponent(xd, e);

  return external ? finalise(y, pr, rm) : y;
};


/*
 *   n % 0 =  N
 *   n % N =  N
 *   n % I =  n
 *   0 % n =  0
 *  -0 % n = -0
 *   0 % 0 =  N
 *   0 % N =  N
 *   0 % I =  0
 *   N % n =  N
 *   N % 0 =  N
 *   N % N =  N
 *   N % I =  N
 *   I % n =  N
 *   I % 0 =  N
 *   I % N =  N
 *   I % I =  N
 *
 * Return a new Decimal whose value is the value of this Decimal modulo `y`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 * The result depends on the modulo mode.
 *
 */
P.modulo = P.mod = function (y) {
  var q,
    x = this,
    Ctor = x.constructor;

  y = new Ctor(y);

  // Return NaN if x is ±Infinity or NaN, or y is NaN or ±0.
  if (!x.d || !y.s || y.d && !y.d[0]) return new Ctor(NaN);

  // Return x if y is ±Infinity or x is ±0.
  if (!y.d || x.d && !x.d[0]) {
    return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
  }

  // Prevent rounding of intermediate calculations.
  external = false;

  if (Ctor.modulo == 9) {

    // Euclidian division: q = sign(y) * floor(x / abs(y))
    // result = x - q * y    where  0 <= result < abs(y)
    q = divide(x, y.abs(), 0, 3, 1);
    q.s *= y.s;
  } else {
    q = divide(x, y, 0, Ctor.modulo, 1);
  }

  q = q.times(y);

  external = true;

  return x.minus(q);
};


/*
 * Return a new Decimal whose value is the natural exponential of the value of this Decimal,
 * i.e. the base e raised to the power the value of this Decimal, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 */
P.naturalExponential = P.exp = function () {
  return naturalExponential(this);
};


/*
 * Return a new Decimal whose value is the natural logarithm of the value of this Decimal,
 * rounded to `precision` significant digits using rounding mode `rounding`.
 *
 */
P.naturalLogarithm = P.ln = function () {
  return naturalLogarithm(this);
};


/*
 * Return a new Decimal whose value is the value of this Decimal negated, i.e. as if multiplied by
 * -1.
 *
 */
P.negated = P.neg = function () {
  var x = new this.constructor(this);
  x.s = -x.s;
  return finalise(x);
};


/*
 *  n + 0 = n
 *  n + N = N
 *  n + I = I
 *  0 + n = n
 *  0 + 0 = 0
 *  0 + N = N
 *  0 + I = I
 *  N + n = N
 *  N + 0 = N
 *  N + N = N
 *  N + I = N
 *  I + n = I
 *  I + 0 = I
 *  I + N = N
 *  I + I = I
 *
 * Return a new Decimal whose value is the value of this Decimal plus `y`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 */
P.plus = P.add = function (y) {
  var carry, d, e, i, k, len, pr, rm, xd, yd,
    x = this,
    Ctor = x.constructor;

  y = new Ctor(y);

  // If either is not finite...
  if (!x.d || !y.d) {

    // Return NaN if either is NaN.
    if (!x.s || !y.s) y = new Ctor(NaN);

    // Return x if y is finite and x is ±Infinity.
    // Return x if both are ±Infinity with the same sign.
    // Return NaN if both are ±Infinity with different signs.
    // Return y if x is finite and y is ±Infinity.
    else if (!x.d) y = new Ctor(y.d || x.s === y.s ? x : NaN);

    return y;
  }

   // If signs differ...
  if (x.s != y.s) {
    y.s = -y.s;
    return x.minus(y);
  }

  xd = x.d;
  yd = y.d;
  pr = Ctor.precision;
  rm = Ctor.rounding;

  // If either is zero...
  if (!xd[0] || !yd[0]) {

    // Return x if y is zero.
    // Return y if y is non-zero.
    if (!yd[0]) y = new Ctor(x);

    return external ? finalise(y, pr, rm) : y;
  }

  // x and y are finite, non-zero numbers with the same sign.

  // Calculate base 1e7 exponents.
  k = mathfloor(x.e / LOG_BASE);
  e = mathfloor(y.e / LOG_BASE);

  xd = xd.slice();
  i = k - e;

  // If base 1e7 exponents differ...
  if (i) {

    if (i < 0) {
      d = xd;
      i = -i;
      len = yd.length;
    } else {
      d = yd;
      e = k;
      len = xd.length;
    }

    // Limit number of zeros prepended to max(ceil(pr / LOG_BASE), len) + 1.
    k = Math.ceil(pr / LOG_BASE);
    len = k > len ? k + 1 : len + 1;

    if (i > len) {
      i = len;
      d.length = 1;
    }

    // Prepend zeros to equalise exponents. Note: Faster to use reverse then do unshifts.
    d.reverse();
    for (; i--;) d.push(0);
    d.reverse();
  }

  len = xd.length;
  i = yd.length;

  // If yd is longer than xd, swap xd and yd so xd points to the longer array.
  if (len - i < 0) {
    i = len;
    d = yd;
    yd = xd;
    xd = d;
  }

  // Only start adding at yd.length - 1 as the further digits of xd can be left as they are.
  for (carry = 0; i;) {
    carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
    xd[i] %= BASE;
  }

  if (carry) {
    xd.unshift(carry);
    ++e;
  }

  // Remove trailing zeros.
  // No need to check for zero, as +x + +y != 0 && -x + -y != 0
  for (len = xd.length; xd[--len] == 0;) xd.pop();

  y.d = xd;
  y.e = getBase10Exponent(xd, e);

  return external ? finalise(y, pr, rm) : y;
};


/*
 * Return the number of significant digits of the value of this Decimal.
 *
 * [z] {boolean|number} Whether to count integer-part trailing zeros: true, false, 1 or 0.
 *
 */
P.precision = P.sd = function (z) {
  var k,
    x = this;

  if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);

  if (x.d) {
    k = getPrecision(x.d);
    if (z && x.e + 1 > k) k = x.e + 1;
  } else {
    k = NaN;
  }

  return k;
};


/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a whole number using
 * rounding mode `rounding`.
 *
 */
P.round = function () {
  var x = this,
    Ctor = x.constructor;

  return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
};


/*
 * Return a new Decimal whose value is the sine of the value in radians of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-1, 1]
 *
 * sin(x) = x - x^3/3! + x^5/5! - ...
 *
 * sin(0)         = 0
 * sin(-0)        = -0
 * sin(Infinity)  = NaN
 * sin(-Infinity) = NaN
 * sin(NaN)       = NaN
 *
 */
P.sine = P.sin = function () {
  var pr, rm,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite()) return new Ctor(NaN);
  if (x.isZero()) return new Ctor(x);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
  Ctor.rounding = 1;

  x = sine(Ctor, toLessThanHalfPi(Ctor, x));

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
};


/*
 * Return a new Decimal whose value is the square root of this Decimal, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 *  sqrt(-n) =  N
 *  sqrt(N)  =  N
 *  sqrt(-I) =  N
 *  sqrt(I)  =  I
 *  sqrt(0)  =  0
 *  sqrt(-0) = -0
 *
 */
P.squareRoot = P.sqrt = function () {
  var m, n, sd, r, rep, t,
    x = this,
    d = x.d,
    e = x.e,
    s = x.s,
    Ctor = x.constructor;

  // Negative/NaN/Infinity/zero?
  if (s !== 1 || !d || !d[0]) {
    return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
  }

  external = false;

  // Initial estimate.
  s = Math.sqrt(+x);

  // Math.sqrt underflow/overflow?
  // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
  if (s == 0 || s == 1 / 0) {
    n = digitsToString(d);

    if ((n.length + e) % 2 == 0) n += '0';
    s = Math.sqrt(n);
    e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);

    if (s == 1 / 0) {
      n = '1e' + e;
    } else {
      n = s.toExponential();
      n = n.slice(0, n.indexOf('e') + 1) + e;
    }

    r = new Ctor(n);
  } else {
    r = new Ctor(s.toString());
  }

  sd = (e = Ctor.precision) + 3;

  // Newton-Raphson iteration.
  for (;;) {
    t = r;
    r = t.plus(divide(x, t, sd + 2, 1)).times(0.5);

    // TODO? Replace with for-loop and checkRoundingDigits.
    if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
      n = n.slice(sd - 3, sd + 1);

      // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or
      // 4999, i.e. approaching a rounding boundary, continue the iteration.
      if (n == '9999' || !rep && n == '4999') {

        // On the first iteration only, check to see if rounding up gives the exact result as the
        // nines may infinitely repeat.
        if (!rep) {
          finalise(t, e + 1, 0);

          if (t.times(t).eq(x)) {
            r = t;
            break;
          }
        }

        sd += 4;
        rep = 1;
      } else {

        // If the rounding digits are null, 0{0,4} or 50{0,3}, check for an exact result.
        // If not, then there are further digits and m will be truthy.
        if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

          // Truncate to the first rounding digit.
          finalise(r, e + 1, 1);
          m = !r.times(r).eq(x);
        }

        break;
      }
    }
  }

  external = true;

  return finalise(r, e, Ctor.rounding, m);
};


/*
 * Return a new Decimal whose value is the tangent of the value in radians of this Decimal.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-Infinity, Infinity]
 *
 * tan(0)         = 0
 * tan(-0)        = -0
 * tan(Infinity)  = NaN
 * tan(-Infinity) = NaN
 * tan(NaN)       = NaN
 *
 */
P.tangent = P.tan = function () {
  var pr, rm,
    x = this,
    Ctor = x.constructor;

  if (!x.isFinite()) return new Ctor(NaN);
  if (x.isZero()) return new Ctor(x);

  pr = Ctor.precision;
  rm = Ctor.rounding;
  Ctor.precision = pr + 10;
  Ctor.rounding = 1;

  x = x.sin();
  x.s = 1;
  x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);

  Ctor.precision = pr;
  Ctor.rounding = rm;

  return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
};


/*
 *  n * 0 = 0
 *  n * N = N
 *  n * I = I
 *  0 * n = 0
 *  0 * 0 = 0
 *  0 * N = N
 *  0 * I = N
 *  N * n = N
 *  N * 0 = N
 *  N * N = N
 *  N * I = N
 *  I * n = I
 *  I * 0 = N
 *  I * N = N
 *  I * I = I
 *
 * Return a new Decimal whose value is this Decimal times `y`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 */
P.times = P.mul = function (y) {
  var carry, e, i, k, r, rL, t, xdL, ydL,
    x = this,
    Ctor = x.constructor,
    xd = x.d,
    yd = (y = new Ctor(y)).d;

  y.s *= x.s;

   // If either is NaN, ±Infinity or ±0...
  if (!xd || !xd[0] || !yd || !yd[0]) {

    return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd

      // Return NaN if either is NaN.
      // Return NaN if x is ±0 and y is ±Infinity, or y is ±0 and x is ±Infinity.
      ? NaN

      // Return ±Infinity if either is ±Infinity.
      // Return ±0 if either is ±0.
      : !xd || !yd ? y.s / 0 : y.s * 0);
  }

  e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
  xdL = xd.length;
  ydL = yd.length;

  // Ensure xd points to the longer array.
  if (xdL < ydL) {
    r = xd;
    xd = yd;
    yd = r;
    rL = xdL;
    xdL = ydL;
    ydL = rL;
  }

  // Initialise the result array with zeros.
  r = [];
  rL = xdL + ydL;
  for (i = rL; i--;) r.push(0);

  // Multiply!
  for (i = ydL; --i >= 0;) {
    carry = 0;
    for (k = xdL + i; k > i;) {
      t = r[k] + yd[i] * xd[k - i - 1] + carry;
      r[k--] = t % BASE | 0;
      carry = t / BASE | 0;
    }

    r[k] = (r[k] + carry) % BASE | 0;
  }

  // Remove trailing zeros.
  for (; !r[--rL];) r.pop();

  if (carry) ++e;
  else r.shift();

  y.d = r;
  y.e = getBase10Exponent(r, e);

  return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
};


/*
 * Return a string representing the value of this Decimal in base 2, round to `sd` significant
 * digits using rounding mode `rm`.
 *
 * If the optional `sd` argument is present then return binary exponential notation.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */
P.toBinary = function (sd, rm) {
  return toStringBinary(this, 2, sd, rm);
};


/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `dp`
 * decimal places using rounding mode `rm` or `rounding` if `rm` is omitted.
 *
 * If `dp` is omitted, return a new Decimal whose value is the value of this Decimal.
 *
 * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */
P.toDecimalPlaces = P.toDP = function (dp, rm) {
  var x = this,
    Ctor = x.constructor;

  x = new Ctor(x);
  if (dp === void 0) return x;

  checkInt32(dp, 0, MAX_DIGITS);

  if (rm === void 0) rm = Ctor.rounding;
  else checkInt32(rm, 0, 8);

  return finalise(x, dp + x.e + 1, rm);
};


/*
 * Return a string representing the value of this Decimal in exponential notation rounded to
 * `dp` fixed decimal places using rounding mode `rounding`.
 *
 * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */
P.toExponential = function (dp, rm) {
  var str,
    x = this,
    Ctor = x.constructor;

  if (dp === void 0) {
    str = finiteToString(x, true);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);

    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);

    x = finalise(new Ctor(x), dp + 1, rm);
    str = finiteToString(x, true, dp + 1);
  }

  return x.isNeg() && !x.isZero() ? '-' + str : str;
};


/*
 * Return a string representing the value of this Decimal in normal (fixed-point) notation to
 * `dp` fixed decimal places and rounded using rounding mode `rm` or `rounding` if `rm` is
 * omitted.
 *
 * As with JavaScript numbers, (-0).toFixed(0) is '0', but e.g. (-0.00001).toFixed(0) is '-0'.
 *
 * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
 * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
 * (-0).toFixed(3) is '0.000'.
 * (-0.5).toFixed(0) is '-0'.
 *
 */
P.toFixed = function (dp, rm) {
  var str, y,
    x = this,
    Ctor = x.constructor;

  if (dp === void 0) {
    str = finiteToString(x);
  } else {
    checkInt32(dp, 0, MAX_DIGITS);

    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);

    y = finalise(new Ctor(x), dp + x.e + 1, rm);
    str = finiteToString(y, false, dp + y.e + 1);
  }

  // To determine whether to add the minus sign look at the value before it was rounded,
  // i.e. look at `x` rather than `y`.
  return x.isNeg() && !x.isZero() ? '-' + str : str;
};


/*
 * Return an array representing the value of this Decimal as a simple fraction with an integer
 * numerator and an integer denominator.
 *
 * The denominator will be a positive non-zero value less than or equal to the specified maximum
 * denominator. If a maximum denominator is not specified, the denominator will be the lowest
 * value necessary to represent the number exactly.
 *
 * [maxD] {number|string|Decimal} Maximum denominator. Integer >= 1 and < Infinity.
 *
 */
P.toFraction = function (maxD) {
  var d, d0, d1, d2, e, k, n, n0, n1, pr, q, r,
    x = this,
    xd = x.d,
    Ctor = x.constructor;

  if (!xd) return new Ctor(x);

  n1 = d0 = new Ctor(1);
  d1 = n0 = new Ctor(0);

  d = new Ctor(d1);
  e = d.e = getPrecision(xd) - x.e - 1;
  k = e % LOG_BASE;
  d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);

  if (maxD == null) {

    // d is 10**e, the minimum max-denominator needed.
    maxD = e > 0 ? d : n1;
  } else {
    n = new Ctor(maxD);
    if (!n.isInt() || n.lt(n1)) throw Error(invalidArgument + n);
    maxD = n.gt(d) ? (e > 0 ? d : n1) : n;
  }

  external = false;
  n = new Ctor(digitsToString(xd));
  pr = Ctor.precision;
  Ctor.precision = e = xd.length * LOG_BASE * 2;

  for (;;)  {
    q = divide(n, d, 0, 1, 1);
    d2 = d0.plus(q.times(d1));
    if (d2.cmp(maxD) == 1) break;
    d0 = d1;
    d1 = d2;
    d2 = n1;
    n1 = n0.plus(q.times(d2));
    n0 = d2;
    d2 = d;
    d = n.minus(q.times(d2));
    n = d2;
  }

  d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
  n0 = n0.plus(d2.times(n1));
  d0 = d0.plus(d2.times(d1));
  n0.s = n1.s = x.s;

  // Determine which fraction is closer to x, n0/d0 or n1/d1?
  r = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1
      ? [n1, d1] : [n0, d0];

  Ctor.precision = pr;
  external = true;

  return r;
};


/*
 * Return a string representing the value of this Decimal in base 16, round to `sd` significant
 * digits using rounding mode `rm`.
 *
 * If the optional `sd` argument is present then return binary exponential notation.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */
P.toHexadecimal = P.toHex = function (sd, rm) {
  return toStringBinary(this, 16, sd, rm);
};


/*
 * Returns a new Decimal whose value is the nearest multiple of `y` in the direction of rounding
 * mode `rm`, or `Decimal.rounding` if `rm` is omitted, to the value of this Decimal.
 *
 * The return value will always have the same sign as this Decimal, unless either this Decimal
 * or `y` is NaN, in which case the return value will be also be NaN.
 *
 * The return value is not affected by the value of `precision`.
 *
 * y {number|string|Decimal} The magnitude to round to a multiple of.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 * 'toNearest() rounding mode not an integer: {rm}'
 * 'toNearest() rounding mode out of range: {rm}'
 *
 */
P.toNearest = function (y, rm) {
  var x = this,
    Ctor = x.constructor;

  x = new Ctor(x);

  if (y == null) {

    // If x is not finite, return x.
    if (!x.d) return x;

    y = new Ctor(1);
    rm = Ctor.rounding;
  } else {
    y = new Ctor(y);
    if (rm === void 0) {
      rm = Ctor.rounding;
    } else {
      checkInt32(rm, 0, 8);
    }

    // If x is not finite, return x if y is not NaN, else NaN.
    if (!x.d) return y.s ? x : y;

    // If y is not finite, return Infinity with the sign of x if y is Infinity, else NaN.
    if (!y.d) {
      if (y.s) y.s = x.s;
      return y;
    }
  }

  // If y is not zero, calculate the nearest multiple of y to x.
  if (y.d[0]) {
    external = false;
    x = divide(x, y, 0, rm, 1).times(y);
    external = true;
    finalise(x);

  // If y is zero, return zero with the sign of x.
  } else {
    y.s = x.s;
    x = y;
  }

  return x;
};


/*
 * Return the value of this Decimal converted to a number primitive.
 * Zero keeps its sign.
 *
 */
P.toNumber = function () {
  return +this;
};


/*
 * Return a string representing the value of this Decimal in base 8, round to `sd` significant
 * digits using rounding mode `rm`.
 *
 * If the optional `sd` argument is present then return binary exponential notation.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */
P.toOctal = function (sd, rm) {
  return toStringBinary(this, 8, sd, rm);
};


/*
 * Return a new Decimal whose value is the value of this Decimal raised to the power `y`, rounded
 * to `precision` significant digits using rounding mode `rounding`.
 *
 * ECMAScript compliant.
 *
 *   pow(x, NaN)                           = NaN
 *   pow(x, ±0)                            = 1

 *   pow(NaN, non-zero)                    = NaN
 *   pow(abs(x) > 1, +Infinity)            = +Infinity
 *   pow(abs(x) > 1, -Infinity)            = +0
 *   pow(abs(x) == 1, ±Infinity)           = NaN
 *   pow(abs(x) < 1, +Infinity)            = +0
 *   pow(abs(x) < 1, -Infinity)            = +Infinity
 *   pow(+Infinity, y > 0)                 = +Infinity
 *   pow(+Infinity, y < 0)                 = +0
 *   pow(-Infinity, odd integer > 0)       = -Infinity
 *   pow(-Infinity, even integer > 0)      = +Infinity
 *   pow(-Infinity, odd integer < 0)       = -0
 *   pow(-Infinity, even integer < 0)      = +0
 *   pow(+0, y > 0)                        = +0
 *   pow(+0, y < 0)                        = +Infinity
 *   pow(-0, odd integer > 0)              = -0
 *   pow(-0, even integer > 0)             = +0
 *   pow(-0, odd integer < 0)              = -Infinity
 *   pow(-0, even integer < 0)             = +Infinity
 *   pow(finite x < 0, finite non-integer) = NaN
 *
 * For non-integer or very large exponents pow(x, y) is calculated using
 *
 *   x^y = exp(y*ln(x))
 *
 * Assuming the first 15 rounding digits are each equally likely to be any digit 0-9, the
 * probability of an incorrectly rounded result
 * P([49]9{14} | [50]0{14}) = 2 * 0.2 * 10^-14 = 4e-15 = 1/2.5e+14
 * i.e. 1 in 250,000,000,000,000
 *
 * If a result is incorrectly rounded the maximum error will be 1 ulp (unit in last place).
 *
 * y {number|string|Decimal} The power to which to raise this Decimal.
 *
 */
P.toPower = P.pow = function (y) {
  var e, k, pr, r, rm, s,
    x = this,
    Ctor = x.constructor,
    yn = +(y = new Ctor(y));

  // Either ±Infinity, NaN or ±0?
  if (!x.d || !y.d || !x.d[0] || !y.d[0]) return new Ctor(mathpow(+x, yn));

  x = new Ctor(x);

  if (x.eq(1)) return x;

  pr = Ctor.precision;
  rm = Ctor.rounding;

  if (y.eq(1)) return finalise(x, pr, rm);

  // y exponent
  e = mathfloor(y.e / LOG_BASE);

  // If y is a small integer use the 'exponentiation by squaring' algorithm.
  if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
    r = intPow(Ctor, x, k, pr);
    return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
  }

  s = x.s;

  // if x is negative
  if (s < 0) {

    // if y is not an integer
    if (e < y.d.length - 1) return new Ctor(NaN);

    // Result is positive if x is negative and the last digit of integer y is even.
    if ((y.d[e] & 1) == 0) s = 1;

    // if x.eq(-1)
    if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
      x.s = s;
      return x;
    }
  }

  // Estimate result exponent.
  // x^y = 10^e,  where e = y * log10(x)
  // log10(x) = log10(x_significand) + x_exponent
  // log10(x_significand) = ln(x_significand) / ln(10)
  k = mathpow(+x, yn);
  e = k == 0 || !isFinite(k)
    ? mathfloor(yn * (Math.log('0.' + digitsToString(x.d)) / Math.LN10 + x.e + 1))
    : new Ctor(k + '').e;

  // Exponent estimate may be incorrect e.g. x: 0.999999999999999999, y: 2.29, e: 0, r.e: -1.

  // Overflow/underflow?
  if (e > Ctor.maxE + 1 || e < Ctor.minE - 1) return new Ctor(e > 0 ? s / 0 : 0);

  external = false;
  Ctor.rounding = x.s = 1;

  // Estimate the extra guard digits needed to ensure five correct rounding digits from
  // naturalLogarithm(x). Example of failure without these extra digits (precision: 10):
  // new Decimal(2.32456).pow('2087987436534566.46411')
  // should be 1.162377823e+764914905173815, but is 1.162355823e+764914905173815
  k = Math.min(12, (e + '').length);

  // r = x^y = exp(y*ln(x))
  r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);

  // r may be Infinity, e.g. (0.9999999999999999).pow(-1e+40)
  if (r.d) {

    // Truncate to the required precision plus five rounding digits.
    r = finalise(r, pr + 5, 1);

    // If the rounding digits are [49]9999 or [50]0000 increase the precision by 10 and recalculate
    // the result.
    if (checkRoundingDigits(r.d, pr, rm)) {
      e = pr + 10;

      // Truncate to the increased precision plus five rounding digits.
      r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);

      // Check for 14 nines from the 2nd rounding digit (the first rounding digit may be 4 or 9).
      if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
        r = finalise(r, pr + 1, 0);
      }
    }
  }

  r.s = s;
  external = true;
  Ctor.rounding = rm;

  return finalise(r, pr, rm);
};


/*
 * Return a string representing the value of this Decimal rounded to `sd` significant digits
 * using rounding mode `rounding`.
 *
 * Return exponential notation if `sd` is less than the number of digits necessary to represent
 * the integer part of the value in normal notation.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 */
P.toPrecision = function (sd, rm) {
  var str,
    x = this,
    Ctor = x.constructor;

  if (sd === void 0) {
    str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
  } else {
    checkInt32(sd, 1, MAX_DIGITS);

    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);

    x = finalise(new Ctor(x), sd, rm);
    str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
  }

  return x.isNeg() && !x.isZero() ? '-' + str : str;
};


/*
 * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `sd`
 * significant digits using rounding mode `rm`, or to `precision` and `rounding` respectively if
 * omitted.
 *
 * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
 * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
 *
 * 'toSD() digits out of range: {sd}'
 * 'toSD() digits not an integer: {sd}'
 * 'toSD() rounding mode not an integer: {rm}'
 * 'toSD() rounding mode out of range: {rm}'
 *
 */
P.toSignificantDigits = P.toSD = function (sd, rm) {
  var x = this,
    Ctor = x.constructor;

  if (sd === void 0) {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  } else {
    checkInt32(sd, 1, MAX_DIGITS);

    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
  }

  return finalise(new Ctor(x), sd, rm);
};


/*
 * Return a string representing the value of this Decimal.
 *
 * Return exponential notation if this Decimal has a positive exponent equal to or greater than
 * `toExpPos`, or a negative exponent equal to or less than `toExpNeg`.
 *
 */
P.toString = function () {
  var x = this,
    Ctor = x.constructor,
    str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);

  return x.isNeg() && !x.isZero() ? '-' + str : str;
};


/*
 * Return a new Decimal whose value is the value of this Decimal truncated to a whole number.
 *
 */
P.truncated = P.trunc = function () {
  return finalise(new this.constructor(this), this.e + 1, 1);
};


/*
 * Return a string representing the value of this Decimal.
 * Unlike `toString`, negative zero will include the minus sign.
 *
 */
P.valueOf = P.toJSON = function () {
  var x = this,
    Ctor = x.constructor,
    str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);

  return x.isNeg() ? '-' + str : str;
};


/*
// Add aliases to match BigDecimal method names.
// P.add = P.plus;
P.subtract = P.minus;
P.multiply = P.times;
P.divide = P.div;
P.remainder = P.mod;
P.compareTo = P.cmp;
P.negate = P.neg;
 */


// Helper functions for Decimal.prototype (P) and/or Decimal methods, and their callers.


/*
 *  digitsToString           P.cubeRoot, P.logarithm, P.squareRoot, P.toFraction, P.toPower,
 *                           finiteToString, naturalExponential, naturalLogarithm
 *  checkInt32               P.toDecimalPlaces, P.toExponential, P.toFixed, P.toNearest,
 *                           P.toPrecision, P.toSignificantDigits, toStringBinary, random
 *  checkRoundingDigits      P.logarithm, P.toPower, naturalExponential, naturalLogarithm
 *  convertBase              toStringBinary, parseOther
 *  cos                      P.cos
 *  divide                   P.atanh, P.cubeRoot, P.dividedBy, P.dividedToIntegerBy,
 *                           P.logarithm, P.modulo, P.squareRoot, P.tan, P.tanh, P.toFraction,
 *                           P.toNearest, toStringBinary, naturalExponential, naturalLogarithm,
 *                           taylorSeries, atan2, parseOther
 *  finalise                 P.absoluteValue, P.atan, P.atanh, P.ceil, P.cos, P.cosh,
 *                           P.cubeRoot, P.dividedToIntegerBy, P.floor, P.logarithm, P.minus,
 *                           P.modulo, P.negated, P.plus, P.round, P.sin, P.sinh, P.squareRoot,
 *                           P.tan, P.times, P.toDecimalPlaces, P.toExponential, P.toFixed,
 *                           P.toNearest, P.toPower, P.toPrecision, P.toSignificantDigits,
 *                           P.truncated, divide, getLn10, getPi, naturalExponential,
 *                           naturalLogarithm, ceil, floor, round, trunc
 *  finiteToString           P.toExponential, P.toFixed, P.toPrecision, P.toString, P.valueOf,
 *                           toStringBinary
 *  getBase10Exponent        P.minus, P.plus, P.times, parseOther
 *  getLn10                  P.logarithm, naturalLogarithm
 *  getPi                    P.acos, P.asin, P.atan, toLessThanHalfPi, atan2
 *  getPrecision             P.precision, P.toFraction
 *  getZeroString            digitsToString, finiteToString
 *  intPow                   P.toPower, parseOther
 *  isOdd                    toLessThanHalfPi
 *  maxOrMin                 max, min
 *  naturalExponential       P.naturalExponential, P.toPower
 *  naturalLogarithm         P.acosh, P.asinh, P.atanh, P.logarithm, P.naturalLogarithm,
 *                           P.toPower, naturalExponential
 *  nonFiniteToString        finiteToString, toStringBinary
 *  parseDecimal             Decimal
 *  parseOther               Decimal
 *  sin                      P.sin
 *  taylorSeries             P.cosh, P.sinh, cos, sin
 *  toLessThanHalfPi         P.cos, P.sin
 *  toStringBinary           P.toBinary, P.toHexadecimal, P.toOctal
 *  truncate                 intPow
 *
 *  Throws:                  P.logarithm, P.precision, P.toFraction, checkInt32, getLn10, getPi,
 *                           naturalLogarithm, config, parseOther, random, Decimal
 */


function digitsToString(d) {
  var i, k, ws,
    indexOfLastWord = d.length - 1,
    str = '',
    w = d[0];

  if (indexOfLastWord > 0) {
    str += w;
    for (i = 1; i < indexOfLastWord; i++) {
      ws = d[i] + '';
      k = LOG_BASE - ws.length;
      if (k) str += getZeroString(k);
      str += ws;
    }

    w = d[i];
    ws = w + '';
    k = LOG_BASE - ws.length;
    if (k) str += getZeroString(k);
  } else if (w === 0) {
    return '0';
  }

  // Remove trailing zeros of last w.
  for (; w % 10 === 0;) w /= 10;

  return str + w;
}


function checkInt32(i, min, max) {
  if (i !== ~~i || i < min || i > max) {
    throw Error(invalidArgument + i);
  }
}


/*
 * Check 5 rounding digits if `repeating` is null, 4 otherwise.
 * `repeating == null` if caller is `log` or `pow`,
 * `repeating != null` if caller is `naturalLogarithm` or `naturalExponential`.
 */
function checkRoundingDigits(d, i, rm, repeating) {
  var di, k, r, rd;

  // Get the length of the first word of the array d.
  for (k = d[0]; k >= 10; k /= 10) --i;

  // Is the rounding digit in the first word of d?
  if (--i < 0) {
    i += LOG_BASE;
    di = 0;
  } else {
    di = Math.ceil((i + 1) / LOG_BASE);
    i %= LOG_BASE;
  }

  // i is the index (0 - 6) of the rounding digit.
  // E.g. if within the word 3487563 the first rounding digit is 5,
  // then i = 4, k = 1000, rd = 3487563 % 1000 = 563
  k = mathpow(10, LOG_BASE - i);
  rd = d[di] % k | 0;

  if (repeating == null) {
    if (i < 3) {
      if (i == 0) rd = rd / 100 | 0;
      else if (i == 1) rd = rd / 10 | 0;
      r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 50000 || rd == 0;
    } else {
      r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) &&
        (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 ||
          (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
    }
  } else {
    if (i < 4) {
      if (i == 0) rd = rd / 1000 | 0;
      else if (i == 1) rd = rd / 100 | 0;
      else if (i == 2) rd = rd / 10 | 0;
      r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
    } else {
      r = ((repeating || rm < 4) && rd + 1 == k ||
      (!repeating && rm > 3) && rd + 1 == k / 2) &&
        (d[di + 1] / k / 1000 | 0) == mathpow(10, i - 3) - 1;
    }
  }

  return r;
}


// Convert string of `baseIn` to an array of numbers of `baseOut`.
// Eg. convertBase('255', 10, 16) returns [15, 15].
// Eg. convertBase('ff', 16, 10) returns [2, 5, 5].
function convertBase(str, baseIn, baseOut) {
  var j,
    arr = [0],
    arrL,
    i = 0,
    strL = str.length;

  for (; i < strL;) {
    for (arrL = arr.length; arrL--;) arr[arrL] *= baseIn;
    arr[0] += NUMERALS.indexOf(str.charAt(i++));
    for (j = 0; j < arr.length; j++) {
      if (arr[j] > baseOut - 1) {
        if (arr[j + 1] === void 0) arr[j + 1] = 0;
        arr[j + 1] += arr[j] / baseOut | 0;
        arr[j] %= baseOut;
      }
    }
  }

  return arr.reverse();
}


/*
 * cos(x) = 1 - x^2/2! + x^4/4! - ...
 * |x| < pi/2
 *
 */
function cosine(Ctor, x) {
  var k, y,
    len = x.d.length;

  // Argument reduction: cos(4x) = 8*(cos^4(x) - cos^2(x)) + 1
  // i.e. cos(x) = 8*(cos^4(x/4) - cos^2(x/4)) + 1

  // Estimate the optimum number of times to use the argument reduction.
  if (len < 32) {
    k = Math.ceil(len / 3);
    y = Math.pow(4, -k).toString();
  } else {
    k = 16;
    y = '2.3283064365386962890625e-10';
  }

  Ctor.precision += k;

  x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));

  // Reverse argument reduction
  for (var i = k; i--;) {
    var cos2x = x.times(x);
    x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
  }

  Ctor.precision -= k;

  return x;
}


/*
 * Perform division in the specified base.
 */
var divide = (function () {

  // Assumes non-zero x and k, and hence non-zero result.
  function multiplyInteger(x, k, base) {
    var temp,
      carry = 0,
      i = x.length;

    for (x = x.slice(); i--;) {
      temp = x[i] * k + carry;
      x[i] = temp % base | 0;
      carry = temp / base | 0;
    }

    if (carry) x.unshift(carry);

    return x;
  }

  function compare(a, b, aL, bL) {
    var i, r;

    if (aL != bL) {
      r = aL > bL ? 1 : -1;
    } else {
      for (i = r = 0; i < aL; i++) {
        if (a[i] != b[i]) {
          r = a[i] > b[i] ? 1 : -1;
          break;
        }
      }
    }

    return r;
  }

  function subtract(a, b, aL, base) {
    var i = 0;

    // Subtract b from a.
    for (; aL--;) {
      a[aL] -= i;
      i = a[aL] < b[aL] ? 1 : 0;
      a[aL] = i * base + a[aL] - b[aL];
    }

    // Remove leading zeros.
    for (; !a[0] && a.length > 1;) a.shift();
  }

  return function (x, y, pr, rm, dp, base) {
    var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0,
      yL, yz,
      Ctor = x.constructor,
      sign = x.s == y.s ? 1 : -1,
      xd = x.d,
      yd = y.d;

    // Either NaN, Infinity or 0?
    if (!xd || !xd[0] || !yd || !yd[0]) {

      return new Ctor(// Return NaN if either NaN, or both Infinity or 0.
        !x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN :

        // Return ±0 if x is 0 or y is ±Infinity, or return ±Infinity as y is 0.
        xd && xd[0] == 0 || !yd ? sign * 0 : sign / 0);
    }

    if (base) {
      logBase = 1;
      e = x.e - y.e;
    } else {
      base = BASE;
      logBase = LOG_BASE;
      e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
    }

    yL = yd.length;
    xL = xd.length;
    q = new Ctor(sign);
    qd = q.d = [];

    // Result exponent may be one less than e.
    // The digit array of a Decimal from toStringBinary may have trailing zeros.
    for (i = 0; yd[i] == (xd[i] || 0); i++);

    if (yd[i] > (xd[i] || 0)) e--;

    if (pr == null) {
      sd = pr = Ctor.precision;
      rm = Ctor.rounding;
    } else if (dp) {
      sd = pr + (x.e - y.e) + 1;
    } else {
      sd = pr;
    }

    if (sd < 0) {
      qd.push(1);
      more = true;
    } else {

      // Convert precision in number of base 10 digits to base 1e7 digits.
      sd = sd / logBase + 2 | 0;
      i = 0;

      // divisor < 1e7
      if (yL == 1) {
        k = 0;
        yd = yd[0];
        sd++;

        // k is the carry.
        for (; (i < xL || k) && sd--; i++) {
          t = k * base + (xd[i] || 0);
          qd[i] = t / yd | 0;
          k = t % yd | 0;
        }

        more = k || i < xL;

      // divisor >= 1e7
      } else {

        // Normalise xd and yd so highest order digit of yd is >= base/2
        k = base / (yd[0] + 1) | 0;

        if (k > 1) {
          yd = multiplyInteger(yd, k, base);
          xd = multiplyInteger(xd, k, base);
          yL = yd.length;
          xL = xd.length;
        }

        xi = yL;
        rem = xd.slice(0, yL);
        remL = rem.length;

        // Add zeros to make remainder as long as divisor.
        for (; remL < yL;) rem[remL++] = 0;

        yz = yd.slice();
        yz.unshift(0);
        yd0 = yd[0];

        if (yd[1] >= base / 2) ++yd0;

        do {
          k = 0;

          // Compare divisor and remainder.
          cmp = compare(yd, rem, yL, remL);

          // If divisor < remainder.
          if (cmp < 0) {

            // Calculate trial digit, k.
            rem0 = rem[0];
            if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

            // k will be how many times the divisor goes into the current remainder.
            k = rem0 / yd0 | 0;

            //  Algorithm:
            //  1. product = divisor * trial digit (k)
            //  2. if product > remainder: product -= divisor, k--
            //  3. remainder -= product
            //  4. if product was < remainder at 2:
            //    5. compare new remainder and divisor
            //    6. If remainder > divisor: remainder -= divisor, k++

            if (k > 1) {
              if (k >= base) k = base - 1;

              // product = divisor * trial digit.
              prod = multiplyInteger(yd, k, base);
              prodL = prod.length;
              remL = rem.length;

              // Compare product and remainder.
              cmp = compare(prod, rem, prodL, remL);

              // product > remainder.
              if (cmp == 1) {
                k--;

                // Subtract divisor from product.
                subtract(prod, yL < prodL ? yz : yd, prodL, base);
              }
            } else {

              // cmp is -1.
              // If k is 0, there is no need to compare yd and rem again below, so change cmp to 1
              // to avoid it. If k is 1 there is a need to compare yd and rem again below.
              if (k == 0) cmp = k = 1;
              prod = yd.slice();
            }

            prodL = prod.length;
            if (prodL < remL) prod.unshift(0);

            // Subtract product from remainder.
            subtract(rem, prod, remL, base);

            // If product was < previous remainder.
            if (cmp == -1) {
              remL = rem.length;

              // Compare divisor and new remainder.
              cmp = compare(yd, rem, yL, remL);

              // If divisor < new remainder, subtract divisor from remainder.
              if (cmp < 1) {
                k++;

                // Subtract divisor from remainder.
                subtract(rem, yL < remL ? yz : yd, remL, base);
              }
            }

            remL = rem.length;
          } else if (cmp === 0) {
            k++;
            rem = [0];
          }    // if cmp === 1, k will be 0

          // Add the next digit, k, to the result array.
          qd[i++] = k;

          // Update the remainder.
          if (cmp && rem[0]) {
            rem[remL++] = xd[xi] || 0;
          } else {
            rem = [xd[xi]];
            remL = 1;
          }

        } while ((xi++ < xL || rem[0] !== void 0) && sd--);

        more = rem[0] !== void 0;
      }

      // Leading zero?
      if (!qd[0]) qd.shift();
    }

    // logBase is 1 when divide is being used for base conversion.
    if (logBase == 1) {
      q.e = e;
      inexact = more;
    } else {

      // To calculate q.e, first get the number of digits of qd[0].
      for (i = 1, k = qd[0]; k >= 10; k /= 10) i++;
      q.e = i + e * logBase - 1;

      finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
    }

    return q;
  };
})();


/*
 * Round `x` to `sd` significant digits using rounding mode `rm`.
 * Check for over/under-flow.
 */
 function finalise(x, sd, rm, isTruncated) {
  var digits, i, j, k, rd, roundUp, w, xd, xdi,
    Ctor = x.constructor;

  // Don't round if sd is null or undefined.
  out: if (sd != null) {
    xd = x.d;

    // Infinity/NaN.
    if (!xd) return x;

    // rd: the rounding digit, i.e. the digit after the digit that may be rounded up.
    // w: the word of xd containing rd, a base 1e7 number.
    // xdi: the index of w within xd.
    // digits: the number of digits of w.
    // i: what would be the index of rd within w if all the numbers were 7 digits long (i.e. if
    // they had leading zeros)
    // j: if > 0, the actual index of rd within w (if < 0, rd is a leading zero).

    // Get the length of the first word of the digits array xd.
    for (digits = 1, k = xd[0]; k >= 10; k /= 10) digits++;
    i = sd - digits;

    // Is the rounding digit in the first word of xd?
    if (i < 0) {
      i += LOG_BASE;
      j = sd;
      w = xd[xdi = 0];

      // Get the rounding digit at index j of w.
      rd = w / mathpow(10, digits - j - 1) % 10 | 0;
    } else {
      xdi = Math.ceil((i + 1) / LOG_BASE);
      k = xd.length;
      if (xdi >= k) {
        if (isTruncated) {

          // Needed by `naturalExponential`, `naturalLogarithm` and `squareRoot`.
          for (; k++ <= xdi;) xd.push(0);
          w = rd = 0;
          digits = 1;
          i %= LOG_BASE;
          j = i - LOG_BASE + 1;
        } else {
          break out;
        }
      } else {
        w = k = xd[xdi];

        // Get the number of digits of w.
        for (digits = 1; k >= 10; k /= 10) digits++;

        // Get the index of rd within w.
        i %= LOG_BASE;

        // Get the index of rd within w, adjusted for leading zeros.
        // The number of leading zeros of w is given by LOG_BASE - digits.
        j = i - LOG_BASE + digits;

        // Get the rounding digit at index j of w.
        rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
      }
    }

    // Are there any non-zero digits after the rounding digit?
    isTruncated = isTruncated || sd < 0 ||
      xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1));

    // The expression `w % mathpow(10, digits - j - 1)` returns all the digits of w to the right
    // of the digit at (left-to-right) index j, e.g. if w is 908714 and j is 2, the expression
    // will give 714.

    roundUp = rm < 4
      ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
      : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 &&

        // Check whether the digit to the left of the rounding digit is odd.
        ((i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10) & 1 ||
          rm == (x.s < 0 ? 8 : 7));

    if (sd < 1 || !xd[0]) {
      xd.length = 0;
      if (roundUp) {

        // Convert sd to decimal places.
        sd -= x.e + 1;

        // 1, 0.1, 0.01, 0.001, 0.0001 etc.
        xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
        x.e = -sd || 0;
      } else {

        // Zero.
        xd[0] = x.e = 0;
      }

      return x;
    }

    // Remove excess digits.
    if (i == 0) {
      xd.length = xdi;
      k = 1;
      xdi--;
    } else {
      xd.length = xdi + 1;
      k = mathpow(10, LOG_BASE - i);

      // E.g. 56700 becomes 56000 if 7 is the rounding digit.
      // j > 0 means i > number of leading zeros of w.
      xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
    }

    if (roundUp) {
      for (;;) {

        // Is the digit to be rounded up in the first word of xd?
        if (xdi == 0) {

          // i will be the length of xd[0] before k is added.
          for (i = 1, j = xd[0]; j >= 10; j /= 10) i++;
          j = xd[0] += k;
          for (k = 1; j >= 10; j /= 10) k++;

          // if i != k the length has increased.
          if (i != k) {
            x.e++;
            if (xd[0] == BASE) xd[0] = 1;
          }

          break;
        } else {
          xd[xdi] += k;
          if (xd[xdi] != BASE) break;
          xd[xdi--] = 0;
          k = 1;
        }
      }
    }

    // Remove trailing zeros.
    for (i = xd.length; xd[--i] === 0;) xd.pop();
  }

  if (external) {

    // Overflow?
    if (x.e > Ctor.maxE) {

      // Infinity.
      x.d = null;
      x.e = NaN;

    // Underflow?
    } else if (x.e < Ctor.minE) {

      // Zero.
      x.e = 0;
      x.d = [0];
      // Ctor.underflow = true;
    } // else Ctor.underflow = false;
  }

  return x;
}


function finiteToString(x, isExp, sd) {
  if (!x.isFinite()) return nonFiniteToString(x);
  var k,
    e = x.e,
    str = digitsToString(x.d),
    len = str.length;

  if (isExp) {
    if (sd && (k = sd - len) > 0) {
      str = str.charAt(0) + '.' + str.slice(1) + getZeroString(k);
    } else if (len > 1) {
      str = str.charAt(0) + '.' + str.slice(1);
    }

    str = str + (x.e < 0 ? 'e' : 'e+') + x.e;
  } else if (e < 0) {
    str = '0.' + getZeroString(-e - 1) + str;
    if (sd && (k = sd - len) > 0) str += getZeroString(k);
  } else if (e >= len) {
    str += getZeroString(e + 1 - len);
    if (sd && (k = sd - e - 1) > 0) str = str + '.' + getZeroString(k);
  } else {
    if ((k = e + 1) < len) str = str.slice(0, k) + '.' + str.slice(k);
    if (sd && (k = sd - len) > 0) {
      if (e + 1 === len) str += '.';
      str += getZeroString(k);
    }
  }

  return str;
}


// Calculate the base 10 exponent from the base 1e7 exponent.
function getBase10Exponent(digits, e) {
  var w = digits[0];

  // Add the number of digits of the first word of the digits array.
  for ( e *= LOG_BASE; w >= 10; w /= 10) e++;
  return e;
}


function getLn10(Ctor, sd, pr) {
  if (sd > LN10_PRECISION) {

    // Reset global state in case the exception is caught.
    external = true;
    if (pr) Ctor.precision = pr;
    throw Error(precisionLimitExceeded);
  }
  return finalise(new Ctor(LN10), sd, 1, true);
}


function getPi(Ctor, sd, rm) {
  if (sd > PI_PRECISION) throw Error(precisionLimitExceeded);
  return finalise(new Ctor(PI), sd, rm, true);
}


function getPrecision(digits) {
  var w = digits.length - 1,
    len = w * LOG_BASE + 1;

  w = digits[w];

  // If non-zero...
  if (w) {

    // Subtract the number of trailing zeros of the last word.
    for (; w % 10 == 0; w /= 10) len--;

    // Add the number of digits of the first word.
    for (w = digits[0]; w >= 10; w /= 10) len++;
  }

  return len;
}


function getZeroString(k) {
  var zs = '';
  for (; k--;) zs += '0';
  return zs;
}


/*
 * Return a new Decimal whose value is the value of Decimal `x` to the power `n`, where `n` is an
 * integer of type number.
 *
 * Implements 'exponentiation by squaring'. Called by `pow` and `parseOther`.
 *
 */
function intPow(Ctor, x, n, pr) {
  var isTruncated,
    r = new Ctor(1),

    // Max n of 9007199254740991 takes 53 loop iterations.
    // Maximum digits array length; leaves [28, 34] guard digits.
    k = Math.ceil(pr / LOG_BASE + 4);

  external = false;

  for (;;) {
    if (n % 2) {
      r = r.times(x);
      if (truncate(r.d, k)) isTruncated = true;
    }

    n = mathfloor(n / 2);
    if (n === 0) {

      // To ensure correct rounding when r.d is truncated, increment the last word if it is zero.
      n = r.d.length - 1;
      if (isTruncated && r.d[n] === 0) ++r.d[n];
      break;
    }

    x = x.times(x);
    truncate(x.d, k);
  }

  external = true;

  return r;
}


function isOdd(n) {
  return n.d[n.d.length - 1] & 1;
}


/*
 * Handle `max` and `min`. `ltgt` is 'lt' or 'gt'.
 */
function maxOrMin(Ctor, args, ltgt) {
  var y,
    x = new Ctor(args[0]),
    i = 0;

  for (; ++i < args.length;) {
    y = new Ctor(args[i]);
    if (!y.s) {
      x = y;
      break;
    } else if (x[ltgt](y)) {
      x = y;
    }
  }

  return x;
}


/*
 * Return a new Decimal whose value is the natural exponential of `x` rounded to `sd` significant
 * digits.
 *
 * Taylor/Maclaurin series.
 *
 * exp(x) = x^0/0! + x^1/1! + x^2/2! + x^3/3! + ...
 *
 * Argument reduction:
 *   Repeat x = x / 32, k += 5, until |x| < 0.1
 *   exp(x) = exp(x / 2^k)^(2^k)
 *
 * Previously, the argument was initially reduced by
 * exp(x) = exp(r) * 10^k  where r = x - k * ln10, k = floor(x / ln10)
 * to first put r in the range [0, ln10], before dividing by 32 until |x| < 0.1, but this was
 * found to be slower than just dividing repeatedly by 32 as above.
 *
 * Max integer argument: exp('20723265836946413') = 6.3e+9000000000000000
 * Min integer argument: exp('-20723265836946411') = 1.2e-9000000000000000
 * (Math object integer min/max: Math.exp(709) = 8.2e+307, Math.exp(-745) = 5e-324)
 *
 *  exp(Infinity)  = Infinity
 *  exp(-Infinity) = 0
 *  exp(NaN)       = NaN
 *  exp(±0)        = 1
 *
 *  exp(x) is non-terminating for any finite, non-zero x.
 *
 *  The result will always be correctly rounded.
 *
 */
function naturalExponential(x, sd) {
  var denominator, guard, j, pow, sum, t, wpr,
    rep = 0,
    i = 0,
    k = 0,
    Ctor = x.constructor,
    rm = Ctor.rounding,
    pr = Ctor.precision;

  // 0/NaN/Infinity?
  if (!x.d || !x.d[0] || x.e > 17) {

    return new Ctor(x.d
      ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0
      : x.s ? x.s < 0 ? 0 : x : 0 / 0);
  }

  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }

  t = new Ctor(0.03125);

  // while abs(x) >= 0.1
  while (x.e > -2) {

    // x = x / 2^5
    x = x.times(t);
    k += 5;
  }

  // Use 2 * log10(2^k) + 5 (empirically derived) to estimate the increase in precision
  // necessary to ensure the first 4 rounding digits are correct.
  guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
  wpr += guard;
  denominator = pow = sum = new Ctor(1);
  Ctor.precision = wpr;

  for (;;) {
    pow = finalise(pow.times(x), wpr, 1);
    denominator = denominator.times(++i);
    t = sum.plus(divide(pow, denominator, wpr, 1));

    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
      j = k;
      while (j--) sum = finalise(sum.times(sum), wpr, 1);

      // Check to see if the first 4 rounding digits are [49]999.
      // If so, repeat the summation with a higher precision, otherwise
      // e.g. with precision: 18, rounding: 1
      // exp(18.404272462595034083567793919843761) = 98372560.1229999999 (should be 98372560.123)
      // `wpr - guard` is the index of first rounding digit.
      if (sd == null) {

        if (rep < 3 && checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += 10;
          denominator = pow = t = new Ctor(1);
          i = 0;
          rep++;
        } else {
          return finalise(sum, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum;
      }
    }

    sum = t;
  }
}


/*
 * Return a new Decimal whose value is the natural logarithm of `x` rounded to `sd` significant
 * digits.
 *
 *  ln(-n)        = NaN
 *  ln(0)         = -Infinity
 *  ln(-0)        = -Infinity
 *  ln(1)         = 0
 *  ln(Infinity)  = Infinity
 *  ln(-Infinity) = NaN
 *  ln(NaN)       = NaN
 *
 *  ln(n) (n != 1) is non-terminating.
 *
 */
function naturalLogarithm(y, sd) {
  var c, c0, denominator, e, numerator, rep, sum, t, wpr, x1, x2,
    n = 1,
    guard = 10,
    x = y,
    xd = x.d,
    Ctor = x.constructor,
    rm = Ctor.rounding,
    pr = Ctor.precision;

  // Is x negative or Infinity, NaN, 0 or 1?
  if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
    return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
  }

  if (sd == null) {
    external = false;
    wpr = pr;
  } else {
    wpr = sd;
  }

  Ctor.precision = wpr += guard;
  c = digitsToString(xd);
  c0 = c.charAt(0);

  if (Math.abs(e = x.e) < 1.5e15) {

    // Argument reduction.
    // The series converges faster the closer the argument is to 1, so using
    // ln(a^b) = b * ln(a),   ln(a) = ln(a^b) / b
    // multiply the argument by itself until the leading digits of the significand are 7, 8, 9,
    // 10, 11, 12 or 13, recording the number of multiplications so the sum of the series can
    // later be divided by this number, then separate out the power of 10 using
    // ln(a*10^b) = ln(a) + b*ln(10).

    // max n is 21 (gives 0.9, 1.0 or 1.1) (9e15 / 21 = 4.2e14).
    //while (c0 < 9 && c0 != 1 || c0 == 1 && c.charAt(1) > 1) {
    // max n is 6 (gives 0.7 - 1.3)
    while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
      x = x.times(y);
      c = digitsToString(x.d);
      c0 = c.charAt(0);
      n++;
    }

    e = x.e;

    if (c0 > 1) {
      x = new Ctor('0.' + c);
      e++;
    } else {
      x = new Ctor(c0 + '.' + c.slice(1));
    }
  } else {

    // The argument reduction method above may result in overflow if the argument y is a massive
    // number with exponent >= 1500000000000000 (9e15 / 6 = 1.5e15), so instead recall this
    // function using ln(x*10^e) = ln(x) + e*ln(10).
    t = getLn10(Ctor, wpr + 2, pr).times(e + '');
    x = naturalLogarithm(new Ctor(c0 + '.' + c.slice(1)), wpr - guard).plus(t);
    Ctor.precision = pr;

    return sd == null ? finalise(x, pr, rm, external = true) : x;
  }

  // x1 is x reduced to a value near 1.
  x1 = x;

  // Taylor series.
  // ln(y) = ln((1 + x)/(1 - x)) = 2(x + x^3/3 + x^5/5 + x^7/7 + ...)
  // where x = (y - 1)/(y + 1)    (|x| < 1)
  sum = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
  x2 = finalise(x.times(x), wpr, 1);
  denominator = 3;

  for (;;) {
    numerator = finalise(numerator.times(x2), wpr, 1);
    t = sum.plus(divide(numerator, new Ctor(denominator), wpr, 1));

    if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
      sum = sum.times(2);

      // Reverse the argument reduction. Check that e is not 0 because, besides preventing an
      // unnecessary calculation, -0 + 0 = +0 and to ensure correct rounding -0 needs to stay -0.
      if (e !== 0) sum = sum.plus(getLn10(Ctor, wpr + 2, pr).times(e + ''));
      sum = divide(sum, new Ctor(n), wpr, 1);

      // Is rm > 3 and the first 4 rounding digits 4999, or rm < 4 (or the summation has
      // been repeated previously) and the first 4 rounding digits 9999?
      // If so, restart the summation with a higher precision, otherwise
      // e.g. with precision: 12, rounding: 1
      // ln(135520028.6126091714265381533) = 18.7246299999 when it should be 18.72463.
      // `wpr - guard` is the index of first rounding digit.
      if (sd == null) {
        if (checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
          Ctor.precision = wpr += guard;
          t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
          x2 = finalise(x.times(x), wpr, 1);
          denominator = rep = 1;
        } else {
          return finalise(sum, Ctor.precision = pr, rm, external = true);
        }
      } else {
        Ctor.precision = pr;
        return sum;
      }
    }

    sum = t;
    denominator += 2;
  }
}


// ±Infinity, NaN.
function nonFiniteToString(x) {
  // Unsigned.
  return String(x.s * x.s / 0);
}


/*
 * Parse the value of a new Decimal `x` from string `str`.
 */
function parseDecimal(x, str) {
  var e, i, len;

  // Decimal point?
  if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

  // Exponential form?
  if ((i = str.search(/e/i)) > 0) {

    // Determine exponent.
    if (e < 0) e = i;
    e += +str.slice(i + 1);
    str = str.substring(0, i);
  } else if (e < 0) {

    // Integer.
    e = str.length;
  }

  // Determine leading zeros.
  for (i = 0; str.charCodeAt(i) === 48; i++);

  // Determine trailing zeros.
  for (len = str.length; str.charCodeAt(len - 1) === 48; --len);
  str = str.slice(i, len);

  if (str) {
    len -= i;
    x.e = e = e - i - 1;
    x.d = [];

    // Transform base

    // e is the base 10 exponent.
    // i is where to slice str to get the first word of the digits array.
    i = (e + 1) % LOG_BASE;
    if (e < 0) i += LOG_BASE;

    if (i < len) {
      if (i) x.d.push(+str.slice(0, i));
      for (len -= LOG_BASE; i < len;) x.d.push(+str.slice(i, i += LOG_BASE));
      str = str.slice(i);
      i = LOG_BASE - str.length;
    } else {
      i -= len;
    }

    for (; i--;) str += '0';
    x.d.push(+str);

    if (external) {

      // Overflow?
      if (x.e > x.constructor.maxE) {

        // Infinity.
        x.d = null;
        x.e = NaN;

      // Underflow?
      } else if (x.e < x.constructor.minE) {

        // Zero.
        x.e = 0;
        x.d = [0];
        // x.constructor.underflow = true;
      } // else x.constructor.underflow = false;
    }
  } else {

    // Zero.
    x.e = 0;
    x.d = [0];
  }

  return x;
}


/*
 * Parse the value of a new Decimal `x` from a string `str`, which is not a decimal value.
 */
function parseOther(x, str) {
  var base, Ctor, divisor, i, isFloat, len, p, xd, xe;

  if (str === 'Infinity' || str === 'NaN') {
    if (!+str) x.s = NaN;
    x.e = NaN;
    x.d = null;
    return x;
  }

  if (isHex.test(str))  {
    base = 16;
    str = str.toLowerCase();
  } else if (isBinary.test(str))  {
    base = 2;
  } else if (isOctal.test(str))  {
    base = 8;
  } else {
    throw Error(invalidArgument + str);
  }

  // Is there a binary exponent part?
  i = str.search(/p/i);

  if (i > 0) {
    p = +str.slice(i + 1);
    str = str.substring(2, i);
  } else {
    str = str.slice(2);
  }

  // Convert `str` as an integer then divide the result by `base` raised to a power such that the
  // fraction part will be restored.
  i = str.indexOf('.');
  isFloat = i >= 0;
  Ctor = x.constructor;

  if (isFloat) {
    str = str.replace('.', '');
    len = str.length;
    i = len - i;

    // log[10](16) = 1.2041... , log[10](88) = 1.9444....
    divisor = intPow(Ctor, new Ctor(base), i, i * 2);
  }

  xd = convertBase(str, base, BASE);
  xe = xd.length - 1;

  // Remove trailing zeros.
  for (i = xe; xd[i] === 0; --i) xd.pop();
  if (i < 0) return new Ctor(x.s * 0);
  x.e = getBase10Exponent(xd, xe);
  x.d = xd;
  external = false;

  // At what precision to perform the division to ensure exact conversion?
  // maxDecimalIntegerPartDigitCount = ceil(log[10](b) * otherBaseIntegerPartDigitCount)
  // log[10](2) = 0.30103, log[10](8) = 0.90309, log[10](16) = 1.20412
  // E.g. ceil(1.2 * 3) = 4, so up to 4 decimal digits are needed to represent 3 hex int digits.
  // maxDecimalFractionPartDigitCount = {Hex:4|Oct:3|Bin:1} * otherBaseFractionPartDigitCount
  // Therefore using 4 * the number of digits of str will always be enough.
  if (isFloat) x = divide(x, divisor, len * 4);

  // Multiply by the binary exponent part if present.
  if (p) x = x.times(Math.abs(p) < 54 ? Math.pow(2, p) : Decimal.pow(2, p));
  external = true;

  return x;
}


/*
 * sin(x) = x - x^3/3! + x^5/5! - ...
 * |x| < pi/2
 *
 */
function sine(Ctor, x) {
  var k,
    len = x.d.length;

  if (len < 3) return taylorSeries(Ctor, 2, x, x);

  // Argument reduction: sin(5x) = 16*sin^5(x) - 20*sin^3(x) + 5*sin(x)
  // i.e. sin(x) = 16*sin^5(x/5) - 20*sin^3(x/5) + 5*sin(x/5)
  // and  sin(x) = sin(x/5)(5 + sin^2(x/5)(16sin^2(x/5) - 20))

  // Estimate the optimum number of times to use the argument reduction.
  k = 1.4 * Math.sqrt(len);
  k = k > 16 ? 16 : k | 0;

  // Max k before Math.pow precision loss is 22
  x = x.times(Math.pow(5, -k));
  x = taylorSeries(Ctor, 2, x, x);

  // Reverse argument reduction
  var sin2_x,
    d5 = new Ctor(5),
    d16 = new Ctor(16),
    d20 = new Ctor(20);
  for (; k--;) {
    sin2_x = x.times(x);
    x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
  }

  return x;
}


// Calculate Taylor series for `cos`, `cosh`, `sin` and `sinh`.
function taylorSeries(Ctor, n, x, y, isHyperbolic) {
  var j, t, u, x2,
    pr = Ctor.precision,
    k = Math.ceil(pr / LOG_BASE);

  external = false;
  x2 = x.times(x);
  u = new Ctor(y);

  for (;;) {
    t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
    u = isHyperbolic ? y.plus(t) : y.minus(t);
    y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
    t = u.plus(y);

    if (t.d[k] !== void 0) {
      for (j = k; t.d[j] === u.d[j] && j--;);
      if (j == -1) break;
    }

    j = u;
    u = y;
    y = t;
    t = j;
  }

  external = true;
  t.d.length = k + 1;

  return t;
}


// Return the absolute value of `x` reduced to less than or equal to half pi.
function toLessThanHalfPi(Ctor, x) {
  var t,
    isNeg = x.s < 0,
    pi = getPi(Ctor, Ctor.precision, 1),
    halfPi = pi.times(0.5);

  x = x.abs();

  if (x.lte(halfPi)) {
    quadrant = isNeg ? 4 : 1;
    return x;
  }

  t = x.divToInt(pi);

  if (t.isZero()) {
    quadrant = isNeg ? 3 : 2;
  } else {
    x = x.minus(t.times(pi));

    // 0 <= x < pi
    if (x.lte(halfPi)) {
      quadrant = isOdd(t) ? (isNeg ? 2 : 3) : (isNeg ? 4 : 1);
      return x;
    }

    quadrant = isOdd(t) ? (isNeg ? 1 : 4) : (isNeg ? 3 : 2);
  }

  return x.minus(pi).abs();
}


/*
 * Return the value of Decimal `x` as a string in base `baseOut`.
 *
 * If the optional `sd` argument is present include a binary exponent suffix.
 */
function toStringBinary(x, baseOut, sd, rm) {
  var base, e, i, k, len, roundUp, str, xd, y,
    Ctor = x.constructor,
    isExp = sd !== void 0;

  if (isExp) {
    checkInt32(sd, 1, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
  } else {
    sd = Ctor.precision;
    rm = Ctor.rounding;
  }

  if (!x.isFinite()) {
    str = nonFiniteToString(x);
  } else {
    str = finiteToString(x);
    i = str.indexOf('.');

    // Use exponential notation according to `toExpPos` and `toExpNeg`? No, but if required:
    // maxBinaryExponent = floor((decimalExponent + 1) * log[2](10))
    // minBinaryExponent = floor(decimalExponent * log[2](10))
    // log[2](10) = 3.321928094887362347870319429489390175864

    if (isExp) {
      base = 2;
      if (baseOut == 16) {
        sd = sd * 4 - 3;
      } else if (baseOut == 8) {
        sd = sd * 3 - 2;
      }
    } else {
      base = baseOut;
    }

    // Convert the number as an integer then divide the result by its base raised to a power such
    // that the fraction part will be restored.

    // Non-integer.
    if (i >= 0) {
      str = str.replace('.', '');
      y = new Ctor(1);
      y.e = str.length - i;
      y.d = convertBase(finiteToString(y), 10, base);
      y.e = y.d.length;
    }

    xd = convertBase(str, 10, base);
    e = len = xd.length;

    // Remove trailing zeros.
    for (; xd[--len] == 0;) xd.pop();

    if (!xd[0]) {
      str = isExp ? '0p+0' : '0';
    } else {
      if (i < 0) {
        e--;
      } else {
        x = new Ctor(x);
        x.d = xd;
        x.e = e;
        x = divide(x, y, sd, rm, 0, base);
        xd = x.d;
        e = x.e;
        roundUp = inexact;
      }

      // The rounding digit, i.e. the digit after the digit that may be rounded up.
      i = xd[sd];
      k = base / 2;
      roundUp = roundUp || xd[sd + 1] !== void 0;

      roundUp = rm < 4
        ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2))
        : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 ||
          rm === (x.s < 0 ? 8 : 7));

      xd.length = sd;

      if (roundUp) {

        // Rounding up may mean the previous digit has to be rounded up and so on.
        for (; ++xd[--sd] > base - 1;) {
          xd[sd] = 0;
          if (!sd) {
            ++e;
            xd.unshift(1);
          }
        }
      }

      // Determine trailing zeros.
      for (len = xd.length; !xd[len - 1]; --len);

      // E.g. [4, 11, 15] becomes 4bf.
      for (i = 0, str = ''; i < len; i++) str += NUMERALS.charAt(xd[i]);

      // Add binary exponent suffix?
      if (isExp) {
        if (len > 1) {
          if (baseOut == 16 || baseOut == 8) {
            i = baseOut == 16 ? 4 : 3;
            for (--len; len % i; len++) str += '0';
            xd = convertBase(str, base, baseOut);
            for (len = xd.length; !xd[len - 1]; --len);

            // xd[0] will always be be 1
            for (i = 1, str = '1.'; i < len; i++) str += NUMERALS.charAt(xd[i]);
          } else {
            str = str.charAt(0) + '.' + str.slice(1);
          }
        }

        str =  str + (e < 0 ? 'p' : 'p+') + e;
      } else if (e < 0) {
        for (; ++e;) str = '0' + str;
        str = '0.' + str;
      } else {
        if (++e > len) for (e -= len; e-- ;) str += '0';
        else if (e < len) str = str.slice(0, e) + '.' + str.slice(e);
      }
    }

    str = (baseOut == 16 ? '0x' : baseOut == 2 ? '0b' : baseOut == 8 ? '0o' : '') + str;
  }

  return x.s < 0 ? '-' + str : str;
}


// Does not strip trailing zeros.
function truncate(arr, len) {
  if (arr.length > len) {
    arr.length = len;
    return true;
  }
}


// Decimal methods


/*
 *  abs
 *  acos
 *  acosh
 *  add
 *  asin
 *  asinh
 *  atan
 *  atanh
 *  atan2
 *  cbrt
 *  ceil
 *  clone
 *  config
 *  cos
 *  cosh
 *  div
 *  exp
 *  floor
 *  hypot
 *  ln
 *  log
 *  log2
 *  log10
 *  max
 *  min
 *  mod
 *  mul
 *  pow
 *  random
 *  round
 *  set
 *  sign
 *  sin
 *  sinh
 *  sqrt
 *  sub
 *  tan
 *  tanh
 *  trunc
 */


/*
 * Return a new Decimal whose value is the absolute value of `x`.
 *
 * x {number|string|Decimal}
 *
 */
function abs(x) {
  return new this(x).abs();
}


/*
 * Return a new Decimal whose value is the arccosine in radians of `x`.
 *
 * x {number|string|Decimal}
 *
 */
function acos(x) {
  return new this(x).acos();
}


/*
 * Return a new Decimal whose value is the inverse of the hyperbolic cosine of `x`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function acosh(x) {
  return new this(x).acosh();
}


/*
 * Return a new Decimal whose value is the sum of `x` and `y`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */
function add(x, y) {
  return new this(x).plus(y);
}


/*
 * Return a new Decimal whose value is the arcsine in radians of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function asin(x) {
  return new this(x).asin();
}


/*
 * Return a new Decimal whose value is the inverse of the hyperbolic sine of `x`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function asinh(x) {
  return new this(x).asinh();
}


/*
 * Return a new Decimal whose value is the arctangent in radians of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function atan(x) {
  return new this(x).atan();
}


/*
 * Return a new Decimal whose value is the inverse of the hyperbolic tangent of `x`, rounded to
 * `precision` significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function atanh(x) {
  return new this(x).atanh();
}


/*
 * Return a new Decimal whose value is the arctangent in radians of `y/x` in the range -pi to pi
 * (inclusive), rounded to `precision` significant digits using rounding mode `rounding`.
 *
 * Domain: [-Infinity, Infinity]
 * Range: [-pi, pi]
 *
 * y {number|string|Decimal} The y-coordinate.
 * x {number|string|Decimal} The x-coordinate.
 *
 * atan2(±0, -0)               = ±pi
 * atan2(±0, +0)               = ±0
 * atan2(±0, -x)               = ±pi for x > 0
 * atan2(±0, x)                = ±0 for x > 0
 * atan2(-y, ±0)               = -pi/2 for y > 0
 * atan2(y, ±0)                = pi/2 for y > 0
 * atan2(±y, -Infinity)        = ±pi for finite y > 0
 * atan2(±y, +Infinity)        = ±0 for finite y > 0
 * atan2(±Infinity, x)         = ±pi/2 for finite x
 * atan2(±Infinity, -Infinity) = ±3*pi/4
 * atan2(±Infinity, +Infinity) = ±pi/4
 * atan2(NaN, x) = NaN
 * atan2(y, NaN) = NaN
 *
 */
function atan2(y, x) {
  y = new this(y);
  x = new this(x);
  var r,
    pr = this.precision,
    rm = this.rounding,
    wpr = pr + 4;

  // Either NaN
  if (!y.s || !x.s) {
    r = new this(NaN);

  // Both ±Infinity
  } else if (!y.d && !x.d) {
    r = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
    r.s = y.s;

  // x is ±Infinity or y is ±0
  } else if (!x.d || y.isZero()) {
    r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
    r.s = y.s;

  // y is ±Infinity or x is ±0
  } else if (!y.d || x.isZero()) {
    r = getPi(this, wpr, 1).times(0.5);
    r.s = y.s;

  // Both non-zero and finite
  } else if (x.s < 0) {
    this.precision = wpr;
    this.rounding = 1;
    r = this.atan(divide(y, x, wpr, 1));
    x = getPi(this, wpr, 1);
    this.precision = pr;
    this.rounding = rm;
    r = y.s < 0 ? r.minus(x) : r.plus(x);
  } else {
    r = this.atan(divide(y, x, wpr, 1));
  }

  return r;
}


/*
 * Return a new Decimal whose value is the cube root of `x`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function cbrt(x) {
  return new this(x).cbrt();
}


/*
 * Return a new Decimal whose value is `x` rounded to an integer using `ROUND_CEIL`.
 *
 * x {number|string|Decimal}
 *
 */
function ceil(x) {
  return finalise(x = new this(x), x.e + 1, 2);
}


/*
 * Configure global settings for a Decimal constructor.
 *
 * `obj` is an object with one or more of the following properties,
 *
 *   precision  {number}
 *   rounding   {number}
 *   toExpNeg   {number}
 *   toExpPos   {number}
 *   maxE       {number}
 *   minE       {number}
 *   modulo     {number}
 *   crypto     {boolean|number}
 *   defaults   {true}
 *
 * E.g. Decimal.config({ precision: 20, rounding: 4 })
 *
 */
function config(obj) {
  if (!obj || typeof obj !== 'object') throw Error(decimalError + 'Object expected');
  var i, p, v,
    useDefaults = obj.defaults === true,
    ps = [
      'precision', 1, MAX_DIGITS,
      'rounding', 0, 8,
      'toExpNeg', -EXP_LIMIT, 0,
      'toExpPos', 0, EXP_LIMIT,
      'maxE', 0, EXP_LIMIT,
      'minE', -EXP_LIMIT, 0,
      'modulo', 0, 9
    ];

  for (i = 0; i < ps.length; i += 3) {
    if (p = ps[i], useDefaults) this[p] = DEFAULTS[p];
    if ((v = obj[p]) !== void 0) {
      if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
      else throw Error(invalidArgument + p + ': ' + v);
    }
  }

  if (p = 'crypto', useDefaults) this[p] = DEFAULTS[p];
  if ((v = obj[p]) !== void 0) {
    if (v === true || v === false || v === 0 || v === 1) {
      if (v) {
        if (typeof crypto != 'undefined' && crypto &&
          (crypto.getRandomValues || crypto.randomBytes)) {
          this[p] = true;
        } else {
          throw Error(cryptoUnavailable);
        }
      } else {
        this[p] = false;
      }
    } else {
      throw Error(invalidArgument + p + ': ' + v);
    }
  }

  return this;
}


/*
 * Return a new Decimal whose value is the cosine of `x`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function cos(x) {
  return new this(x).cos();
}


/*
 * Return a new Decimal whose value is the hyperbolic cosine of `x`, rounded to precision
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function cosh(x) {
  return new this(x).cosh();
}


/*
 * Create and return a Decimal constructor with the same configuration properties as this Decimal
 * constructor.
 *
 */
function clone(obj) {
  var i, p, ps;

  /*
   * The Decimal constructor and exported function.
   * Return a new Decimal instance.
   *
   * v {number|string|Decimal} A numeric value.
   *
   */
  function Decimal(v) {
    var e, i, t,
      x = this;

    // Decimal called without new.
    if (!(x instanceof Decimal)) return new Decimal(v);

    // Retain a reference to this Decimal constructor, and shadow Decimal.prototype.constructor
    // which points to Object.
    x.constructor = Decimal;

    // Duplicate.
    if (v instanceof Decimal) {
      x.s = v.s;

      if (external) {
        if (!v.d || v.e > Decimal.maxE) {

          // Infinity.
          x.e = NaN;
          x.d = null;
        } else if (v.e < Decimal.minE) {

          // Zero.
          x.e = 0;
          x.d = [0];
        } else {
          x.e = v.e;
          x.d = v.d.slice();
        }
      } else {
        x.e = v.e;
        x.d = v.d ? v.d.slice() : v.d;
      }

      return;
    }

    t = typeof v;

    if (t === 'number') {
      if (v === 0) {
        x.s = 1 / v < 0 ? -1 : 1;
        x.e = 0;
        x.d = [0];
        return;
      }

      if (v < 0) {
        v = -v;
        x.s = -1;
      } else {
        x.s = 1;
      }

      // Fast path for small integers.
      if (v === ~~v && v < 1e7) {
        for (e = 0, i = v; i >= 10; i /= 10) e++;

        if (external) {
          if (e > Decimal.maxE) {
            x.e = NaN;
            x.d = null;
          } else if (e < Decimal.minE) {
            x.e = 0;
            x.d = [0];
          } else {
            x.e = e;
            x.d = [v];
          }
        } else {
          x.e = e;
          x.d = [v];
        }

        return;

      // Infinity, NaN.
      } else if (v * 0 !== 0) {
        if (!v) x.s = NaN;
        x.e = NaN;
        x.d = null;
        return;
      }

      return parseDecimal(x, v.toString());

    } else if (t !== 'string') {
      throw Error(invalidArgument + v);
    }

    // Minus sign?
    if (v.charCodeAt(0) === 45) {
      v = v.slice(1);
      x.s = -1;
    } else {
      x.s = 1;
    }

    return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
  }

  Decimal.prototype = P;

  Decimal.ROUND_UP = 0;
  Decimal.ROUND_DOWN = 1;
  Decimal.ROUND_CEIL = 2;
  Decimal.ROUND_FLOOR = 3;
  Decimal.ROUND_HALF_UP = 4;
  Decimal.ROUND_HALF_DOWN = 5;
  Decimal.ROUND_HALF_EVEN = 6;
  Decimal.ROUND_HALF_CEIL = 7;
  Decimal.ROUND_HALF_FLOOR = 8;
  Decimal.EUCLID = 9;

  Decimal.config = Decimal.set = config;
  Decimal.clone = clone;
  Decimal.isDecimal = isDecimalInstance;

  Decimal.abs = abs;
  Decimal.acos = acos;
  Decimal.acosh = acosh;        // ES6
  Decimal.add = add;
  Decimal.asin = asin;
  Decimal.asinh = asinh;        // ES6
  Decimal.atan = atan;
  Decimal.atanh = atanh;        // ES6
  Decimal.atan2 = atan2;
  Decimal.cbrt = cbrt;          // ES6
  Decimal.ceil = ceil;
  Decimal.cos = cos;
  Decimal.cosh = cosh;          // ES6
  Decimal.div = div;
  Decimal.exp = exp;
  Decimal.floor = floor;
  Decimal.hypot = hypot;        // ES6
  Decimal.ln = ln;
  Decimal.log = log;
  Decimal.log10 = log10;        // ES6
  Decimal.log2 = log2;          // ES6
  Decimal.max = max;
  Decimal.min = min;
  Decimal.mod = mod;
  Decimal.mul = mul;
  Decimal.pow = pow;
  Decimal.random = random;
  Decimal.round = round;
  Decimal.sign = sign;          // ES6
  Decimal.sin = sin;
  Decimal.sinh = sinh;          // ES6
  Decimal.sqrt = sqrt;
  Decimal.sub = sub;
  Decimal.tan = tan;
  Decimal.tanh = tanh;          // ES6
  Decimal.trunc = trunc;        // ES6

  if (obj === void 0) obj = {};
  if (obj) {
    if (obj.defaults !== true) {
      ps = ['precision', 'rounding', 'toExpNeg', 'toExpPos', 'maxE', 'minE', 'modulo', 'crypto'];
      for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
    }
  }

  Decimal.config(obj);

  return Decimal;
}


/*
 * Return a new Decimal whose value is `x` divided by `y`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */
function div(x, y) {
  return new this(x).div(y);
}


/*
 * Return a new Decimal whose value is the natural exponential of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} The power to which to raise the base of the natural log.
 *
 */
function exp(x) {
  return new this(x).exp();
}


/*
 * Return a new Decimal whose value is `x` round to an integer using `ROUND_FLOOR`.
 *
 * x {number|string|Decimal}
 *
 */
function floor(x) {
  return finalise(x = new this(x), x.e + 1, 3);
}


/*
 * Return a new Decimal whose value is the square root of the sum of the squares of the arguments,
 * rounded to `precision` significant digits using rounding mode `rounding`.
 *
 * hypot(a, b, ...) = sqrt(a^2 + b^2 + ...)
 *
 */
function hypot() {
  var i, n,
    t = new this(0);

  external = false;

  for (i = 0; i < arguments.length;) {
    n = new this(arguments[i++]);
    if (!n.d) {
      if (n.s) {
        external = true;
        return new this(1 / 0);
      }
      t = n;
    } else if (t.d) {
      t = t.plus(n.times(n));
    }
  }

  external = true;

  return t.sqrt();
}


/*
 * Return true if object is a Decimal instance (where Decimal is any Decimal constructor),
 * otherwise return false.
 *
 */
function isDecimalInstance(obj) {
  return obj instanceof Decimal || obj && obj.name === '[object Decimal]' || false;
}


/*
 * Return a new Decimal whose value is the natural logarithm of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function ln(x) {
  return new this(x).ln();
}


/*
 * Return a new Decimal whose value is the log of `x` to the base `y`, or to base 10 if no base
 * is specified, rounded to `precision` significant digits using rounding mode `rounding`.
 *
 * log[y](x)
 *
 * x {number|string|Decimal} The argument of the logarithm.
 * y {number|string|Decimal} The base of the logarithm.
 *
 */
function log(x, y) {
  return new this(x).log(y);
}


/*
 * Return a new Decimal whose value is the base 2 logarithm of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function log2(x) {
  return new this(x).log(2);
}


/*
 * Return a new Decimal whose value is the base 10 logarithm of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function log10(x) {
  return new this(x).log(10);
}


/*
 * Return a new Decimal whose value is the maximum of the arguments.
 *
 * arguments {number|string|Decimal}
 *
 */
function max() {
  return maxOrMin(this, arguments, 'lt');
}


/*
 * Return a new Decimal whose value is the minimum of the arguments.
 *
 * arguments {number|string|Decimal}
 *
 */
function min() {
  return maxOrMin(this, arguments, 'gt');
}


/*
 * Return a new Decimal whose value is `x` modulo `y`, rounded to `precision` significant digits
 * using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */
function mod(x, y) {
  return new this(x).mod(y);
}


/*
 * Return a new Decimal whose value is `x` multiplied by `y`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */
function mul(x, y) {
  return new this(x).mul(y);
}


/*
 * Return a new Decimal whose value is `x` raised to the power `y`, rounded to precision
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} The base.
 * y {number|string|Decimal} The exponent.
 *
 */
function pow(x, y) {
  return new this(x).pow(y);
}


/*
 * Returns a new Decimal with a random value equal to or greater than 0 and less than 1, and with
 * `sd`, or `Decimal.precision` if `sd` is omitted, significant digits (or less if trailing zeros
 * are produced).
 *
 * [sd] {number} Significant digits. Integer, 0 to MAX_DIGITS inclusive.
 *
 */
function random(sd) {
  var d, e, k, n,
    i = 0,
    r = new this(1),
    rd = [];

  if (sd === void 0) sd = this.precision;
  else checkInt32(sd, 1, MAX_DIGITS);

  k = Math.ceil(sd / LOG_BASE);

  if (!this.crypto) {
    for (; i < k;) rd[i++] = Math.random() * 1e7 | 0;

  // Browsers supporting crypto.getRandomValues.
  } else if (crypto.getRandomValues) {
    d = crypto.getRandomValues(new Uint32Array(k));

    for (; i < k;) {
      n = d[i];

      // 0 <= n < 4294967296
      // Probability n >= 4.29e9, is 4967296 / 4294967296 = 0.00116 (1 in 865).
      if (n >= 4.29e9) {
        d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
      } else {

        // 0 <= n <= 4289999999
        // 0 <= (n % 1e7) <= 9999999
        rd[i++] = n % 1e7;
      }
    }

  // Node.js supporting crypto.randomBytes.
  } else if (crypto.randomBytes) {

    // buffer
    d = crypto.randomBytes(k *= 4);

    for (; i < k;) {

      // 0 <= n < 2147483648
      n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 0x7f) << 24);

      // Probability n >= 2.14e9, is 7483648 / 2147483648 = 0.0035 (1 in 286).
      if (n >= 2.14e9) {
        crypto.randomBytes(4).copy(d, i);
      } else {

        // 0 <= n <= 2139999999
        // 0 <= (n % 1e7) <= 9999999
        rd.push(n % 1e7);
        i += 4;
      }
    }

    i = k / 4;
  } else {
    throw Error(cryptoUnavailable);
  }

  k = rd[--i];
  sd %= LOG_BASE;

  // Convert trailing digits to zeros according to sd.
  if (k && sd) {
    n = mathpow(10, LOG_BASE - sd);
    rd[i] = (k / n | 0) * n;
  }

  // Remove trailing words which are zero.
  for (; rd[i] === 0; i--) rd.pop();

  // Zero?
  if (i < 0) {
    e = 0;
    rd = [0];
  } else {
    e = -1;

    // Remove leading words which are zero and adjust exponent accordingly.
    for (; rd[0] === 0; e -= LOG_BASE) rd.shift();

    // Count the digits of the first word of rd to determine leading zeros.
    for (k = 1, n = rd[0]; n >= 10; n /= 10) k++;

    // Adjust the exponent for leading zeros of the first word of rd.
    if (k < LOG_BASE) e -= LOG_BASE - k;
  }

  r.e = e;
  r.d = rd;

  return r;
}


/*
 * Return a new Decimal whose value is `x` rounded to an integer using rounding mode `rounding`.
 *
 * To emulate `Math.round`, set rounding to 7 (ROUND_HALF_CEIL).
 *
 * x {number|string|Decimal}
 *
 */
function round(x) {
  return finalise(x = new this(x), x.e + 1, this.rounding);
}


/*
 * Return
 *   1    if x > 0,
 *  -1    if x < 0,
 *   0    if x is 0,
 *  -0    if x is -0,
 *   NaN  otherwise
 *
 */
function sign(x) {
  x = new this(x);
  return x.d ? (x.d[0] ? x.s : 0 * x.s) : x.s || NaN;
}


/*
 * Return a new Decimal whose value is the sine of `x`, rounded to `precision` significant digits
 * using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function sin(x) {
  return new this(x).sin();
}


/*
 * Return a new Decimal whose value is the hyperbolic sine of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function sinh(x) {
  return new this(x).sinh();
}


/*
 * Return a new Decimal whose value is the square root of `x`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 *
 */
function sqrt(x) {
  return new this(x).sqrt();
}


/*
 * Return a new Decimal whose value is `x` minus `y`, rounded to `precision` significant digits
 * using rounding mode `rounding`.
 *
 * x {number|string|Decimal}
 * y {number|string|Decimal}
 *
 */
function sub(x, y) {
  return new this(x).sub(y);
}


/*
 * Return a new Decimal whose value is the tangent of `x`, rounded to `precision` significant
 * digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function tan(x) {
  return new this(x).tan();
}


/*
 * Return a new Decimal whose value is the hyperbolic tangent of `x`, rounded to `precision`
 * significant digits using rounding mode `rounding`.
 *
 * x {number|string|Decimal} A value in radians.
 *
 */
function tanh(x) {
  return new this(x).tanh();
}


/*
 * Return a new Decimal whose value is `x` truncated to an integer.
 *
 * x {number|string|Decimal}
 *
 */
function trunc(x) {
  return finalise(x = new this(x), x.e + 1, 1);
}


P[Symbol.for('nodejs.util.inspect.custom')] = P.toString;
P[Symbol.toStringTag] = 'Decimal';

// Create and configure initial Decimal constructor.
var Decimal = clone(DEFAULTS);

// Create the internal constants from their string values.
LN10 = new Decimal(LN10);
PI = new Decimal(PI);

var EMPTY_FIELD = '--';
var DATE_FORMATS = {
  date: 'MM/DD/YY',
  date_value: 'YYYY-MM-DD'
};
var CENT_DECIMAL = new Decimal('100');

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

function canReplaceSymbols(template, chars) {
  return template.split('#').length - 1 === chars.length;
}
function replaceSymbolsWithChars(template, chars) {
  var charsReverse = chars.reverse();
  return template.split('').map(function (char) {
    return char === '#' ? charsReverse.pop() : char;
  }).join('');
}
function hasStringContent(value) {
  if (!lodash.isString(value)) {
    return false;
  }

  return !!value.replace(/ /g, '').length;
}
function hasStringOrNumberContent(value) {
  return hasStringContent(value) || lodash.isNumber(value);
}
function splitName(name) {
  if (!hasStringContent(name)) {
    return ['', ''];
  }

  var _name$trim$split = name.trim().split(' '),
      _name$trim$split2 = _toArray(_name$trim$split),
      firstName = _name$trim$split2[0],
      lastName = _name$trim$split2.slice(1);

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
  return "".concat(firstName || '', " ").concat(lastName || '').trim();
}
function formatPhoneNumber(input) {
  if (!hasStringContent(input)) {
    return EMPTY_FIELD;
  }

  var phoneNumbers = input.match(/\d/g) || [],
      phoneNotNumbers = input.match(/[^0-9\-()]/g) || [],
      PHONE_FORMATS = ['###-####', '(###) ###-####', '+# (###) ###-####', '+## (###) ###-####'];

  if (phoneNotNumbers.length) {
    return input;
  }

  for (var _i = 0; _i < PHONE_FORMATS.length; _i++) {
    var template = PHONE_FORMATS[_i];

    if (canReplaceSymbols(template, phoneNumbers)) {
      return replaceSymbolsWithChars(template, phoneNumbers);
    }
  }

  return input;
}
function formatDate(value) {
  var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DATE_FORMATS.date;

  if (!hasStringContent(value)) {
    return EMPTY_FIELD;
  }

  return dateFns.format(value, dateFormat);
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
      return lodash.get(obj, field);
    }
  }

  return defaultValue;
}
function getOrDefault(value) {
  var isUndefined = value === undefined,
      isNull = value === null,
      isEmptyString = lodash.isString(value) && !hasStringContent(value);

  if (isUndefined || isNull || isEmptyString) {
    return EMPTY_FIELD;
  }

  if (lodash.isString(value)) {
    return value.trim();
  }

  return value;
}
function formatSocialSecurityNumber(value) {
  if (!hasStringContent(value)) {
    return EMPTY_FIELD;
  }

  var ssnNums = value && value.match(/\d/g) || [],
      template = '###-##-####';

  if (canReplaceSymbols(template, ssnNums)) {
    return replaceSymbolsWithChars(template, ssnNums);
  }

  return EMPTY_FIELD;
}
function formatPercentage(value) {
  var decimalPoints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  if (!hasStringOrNumberContent(value)) {
    return EMPTY_FIELD;
  }

  var zeros = lodash.times(decimalPoints, function () {
    return '0';
  }).join(''),
      formattingString = "0.".concat(zeros, "%");
  return numeral(value).format(formattingString);
}
function formatMoney(value) {
  if (!hasStringOrNumberContent(value)) {
    return EMPTY_FIELD;
  }

  return numeral(value).format('$0,0.00');
}
function formatParagraphs(value) {
  if (!hasStringContent(value)) {
    return EMPTY_FIELD;
  }

  return value.split(/\r?\n/).map(function (s, i) {
    return React__default.createElement("p", {
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
function formatDelimitedList(list) {
  var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ', ';

  if (!list) {
    return EMPTY_FIELD;
  }

  return getOrDefault(list.join(delimiter));
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
  if (!hasStringOrNumberContent(value)) {
    return value;
  }

  return numeral(value).value();
}
function formatDuration(iso8601) {
  if (!hasStringContent(iso8601)) {
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
function formatWebsite(website, text) {
  if (!hasStringContent(website)) {
    return EMPTY_FIELD;
  }

  return React__default.createElement("a", {
    href: website,
    rel: "noopener noreferrer",
    target: "_blank"
  }, text || website);
}
function stripNonAlpha(str) {
  if (!hasStringContent(str)) {
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
  if (!hasStringContent(body)) {
    return EMPTY_FIELD;
  }

  return parser(preserveNewLines(lodash.escape(body)));
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
function formatAddress(address) {
  if (!address) {
    return '--, --, -- --';
  }

  var filledInAddress = lodash.mapValues(address, function (s) {
    return s || EMPTY_FIELD;
  }),
      address1 = filledInAddress.address1,
      city = filledInAddress.city,
      state = filledInAddress.state,
      zip_code = filledInAddress.zip_code,
      address2 = address.address2,
      joinedAddress = [address1, address2].join(' ').trim();
  return "".concat(joinedAddress, ", ").concat(city, ", ").concat(state, " ").concat(zip_code);
}
function formatAddressMultiline(address) {
  return parser(formatAddress(address).replace(/, /g, '<br/>'));
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

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var moment = createCommonjsModule(function (module, exports) {
(function (global, factory) {
    module.exports = factory();
}(commonjsGlobal, (function () {
    var hookCallback;

    function hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return (Object.getOwnPropertyNames(obj).length === 0);
        } else {
            var k;
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null,
            rfc2822         : false,
            weekdayMismatch : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.weekdayMismatch &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            }
            else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid (flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function calendar (key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        ss : '%d seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({unit: u, priority: priorities[u]});
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function set$1 (mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
            }
            else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet (units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet (units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        if (!m) {
            return isArray(this._months) ? this._months :
                this._months['standalone'];
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        if (!m) {
            return isArray(this._monthsShort) ? this._monthsShort :
                this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    function createDate (y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate (y) {
        var date;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            var args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays (ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        var weekdays = isArray(this._weekdays) ? this._weekdays :
            this._weekdays[(m && m !== true && this._weekdays.isFormat.test(format)) ? 'format' : 'standalone'];
        return (m === true) ? shiftWeekdays(weekdays, this._week.dow)
            : (m) ? weekdays[m.day()] : weekdays;
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return (m === true) ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return (m === true) ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('k',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour they want. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var localeFamilies = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && ('object' !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                var aliasedRequire = commonjsRequire;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {}
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
            else {
                if ((typeof console !==  'undefined') && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            var locale, parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);


            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, tmpLocale, parentConfig = baseConfig;
            // MERGE
            tmpLocale = loadLocale(name);
            if (tmpLocale != null) {
                parentConfig = tmpLocale._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, expectedWeekday, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            var curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
    var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

    function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10)
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    var obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
    };

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10);
            var m = hm % 100, h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i));
        if (match) {
            var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        // Final attempt, use Input Fallback
        hooks.createFromInputFallback(config);
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        }  else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

    function isDurationValid(m) {
        for (var key in m) {
            if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                return false;
            }
        }

        var unitHasDecimal = false;
        for (var i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher);

        if (matches === null) {
            return null;
        }

        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ?
          0 :
          parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            }
            else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (isNumber(input)) {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])                         * sign,
                h  : toInt(match[HOUR])                         * sign,
                m  : toInt(match[MINUTE])                       * sign,
                s  : toInt(match[SECOND])                       * sign,
                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add      = createAdder(1, 'add');
    var subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function calendar$1 (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year': output = monthDiff(this, that) / 12; break;
            case 'month': output = monthDiff(this, that); break;
            case 'quarter': output = monthDiff(this, that) / 3; break;
            case 'second': output = (this - that) / 1e3; break; // 1000
            case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
            case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
            case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
            case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default: output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true;
        var m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect () {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment';
        var zone = '';
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        var prefix = '[' + func + '("]';
        var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
        var suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 createLocal(time).isValid())) {
            return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    var MS_PER_SECOND = 1000;
    var MS_PER_MINUTE = 60 * MS_PER_SECOND;
    var MS_PER_HOUR = 60 * MS_PER_MINUTE;
    var MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return (dividend % divisor + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf (units) {
        var time;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
                break;
            case 'isoWeek':
                time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf (units) {
        var time;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                break;
            case 'isoWeek':
                time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time += MS_PER_HOUR - mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return new Date(this.valueOf());
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2 () {
        return isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict ?
          (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
          locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add               = add;
    proto.calendar          = calendar$1;
    proto.clone             = clone;
    proto.diff              = diff;
    proto.endOf             = endOf;
    proto.format            = format;
    proto.from              = from;
    proto.fromNow           = fromNow;
    proto.to                = to;
    proto.toNow             = toNow;
    proto.get               = stringGet;
    proto.invalidAt         = invalidAt;
    proto.isAfter           = isAfter;
    proto.isBefore          = isBefore;
    proto.isBetween         = isBetween;
    proto.isSame            = isSame;
    proto.isSameOrAfter     = isSameOrAfter;
    proto.isSameOrBefore    = isSameOrBefore;
    proto.isValid           = isValid$2;
    proto.lang              = lang;
    proto.locale            = locale;
    proto.localeData        = localeData;
    proto.max               = prototypeMax;
    proto.min               = prototypeMin;
    proto.parsingFlags      = parsingFlags;
    proto.set               = stringSet;
    proto.startOf           = startOf;
    proto.subtract          = subtract;
    proto.toArray           = toArray;
    proto.toObject          = toObject;
    proto.toDate            = toDate;
    proto.toISOString       = toISOString;
    proto.inspect           = inspect;
    proto.toJSON            = toJSON;
    proto.toString          = toString;
    proto.unix              = unix;
    proto.valueOf           = valueOf;
    proto.creationData      = creationData;
    proto.year       = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear    = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month       = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week           = proto.weeks        = getSetWeek;
    proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
    proto.weeksInYear    = getWeeksInYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.date       = getSetDayOfMonth;
    proto.day        = proto.days             = getSetDayOfWeek;
    proto.weekday    = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear  = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset            = getSetOffset;
    proto.utc                  = setOffsetToUTC;
    proto.local                = setOffsetToLocal;
    proto.parseZone            = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST                = isDaylightSavingTime;
    proto.isLocal              = isLocal;
    proto.isUtcOffset          = isUtcOffset;
    proto.isUtc                = isUtc;
    proto.isUTC                = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    function createUnix (input) {
        return createLocal(input * 1000);
    }

    function createInZone () {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat (string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar        = calendar;
    proto$1.longDateFormat  = longDateFormat;
    proto$1.invalidDate     = invalidDate;
    proto$1.ordinal         = ordinal;
    proto$1.preparse        = preParsePostFormat;
    proto$1.postformat      = preParsePostFormat;
    proto$1.relativeTime    = relativeTime;
    proto$1.pastFuture      = pastFuture;
    proto$1.set             = set;

    proto$1.months            =        localeMonths;
    proto$1.monthsShort       =        localeMonthsShort;
    proto$1.monthsParse       =        localeMonthsParse;
    proto$1.monthsRegex       = monthsRegex;
    proto$1.monthsShortRegex  = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays       =        localeWeekdays;
    proto$1.weekdaysMin    =        localeWeekdaysMin;
    proto$1.weekdaysShort  =        localeWeekdaysShort;
    proto$1.weekdaysParse  =        localeWeekdaysParse;

    proto$1.weekdaysRegex       =        weekdaysRegex;
    proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
    proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1 (format, index, field, setter) {
        var locale = getLocale();
        var utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports

    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

    var mathAbs = Math.abs;

    function abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function addSubtract$1 (duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1 (input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1 (input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':   return months;
                case 'quarter': return months / 3;
                case 'year':    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1 () {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asQuarters     = makeAs('Q');
    var asYears        = makeAs('y');

    function clone$1 () {
        return createDuration(this);
    }

    function get$2 (units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        ss: 44,         // a few seconds to seconds
        s : 45,         // seconds to minute
        m : 45,         // minutes to hour
        h : 22,         // hours to day
        d : 26,         // days to month
        M : 11          // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
        var duration = createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds <= thresholds.ss && ['s', seconds]  ||
                seconds < thresholds.s   && ['ss', seconds] ||
                minutes <= 1             && ['m']           ||
                minutes < thresholds.m   && ['mm', minutes] ||
                hours   <= 1             && ['h']           ||
                hours   < thresholds.h   && ['hh', hours]   ||
                days    <= 1             && ['d']           ||
                days    < thresholds.d   && ['dd', days]    ||
                months  <= 1             && ['M']           ||
                months  < thresholds.M   && ['MM', months]  ||
                years   <= 1             && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding (roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize (withSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var locale = this.localeData();
        var output = relativeTime$1(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return ((x > 0) - (x < 0)) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000;
        var days         = abs$1(this._days);
        var months       = abs$1(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        var totalSign = total < 0 ? '-' : '';
        var ymSign = sign(this._months) !== sign(total) ? '-' : '';
        var daysSign = sign(this._days) !== sign(total) ? '-' : '';
        var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return totalSign + 'P' +
            (Y ? ymSign + Y + 'Y' : '') +
            (M ? ymSign + M + 'M' : '') +
            (D ? daysSign + D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? hmsSign + h + 'H' : '') +
            (m ? hmsSign + m + 'M' : '') +
            (s ? hmsSign + s + 'S' : '');
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid        = isValid$1;
    proto$2.abs            = abs;
    proto$2.add            = add$1;
    proto$2.subtract       = subtract$1;
    proto$2.as             = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds      = asSeconds;
    proto$2.asMinutes      = asMinutes;
    proto$2.asHours        = asHours;
    proto$2.asDays         = asDays;
    proto$2.asWeeks        = asWeeks;
    proto$2.asMonths       = asMonths;
    proto$2.asQuarters     = asQuarters;
    proto$2.asYears        = asYears;
    proto$2.valueOf        = valueOf$1;
    proto$2._bubble        = bubble;
    proto$2.clone          = clone$1;
    proto$2.get            = get$2;
    proto$2.milliseconds   = milliseconds;
    proto$2.seconds        = seconds;
    proto$2.minutes        = minutes;
    proto$2.hours          = hours;
    proto$2.days           = days;
    proto$2.weeks          = weeks;
    proto$2.months         = months;
    proto$2.years          = years;
    proto$2.humanize       = humanize;
    proto$2.toISOString    = toISOString$1;
    proto$2.toString       = toISOString$1;
    proto$2.toJSON         = toISOString$1;
    proto$2.locale         = locale;
    proto$2.localeData     = localeData;

    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
    proto$2.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    hooks.version = '2.24.0';

    setHookCallback(createLocal);

    hooks.fn                    = proto;
    hooks.min                   = min;
    hooks.max                   = max;
    hooks.now                   = now;
    hooks.utc                   = createUTC;
    hooks.unix                  = createUnix;
    hooks.months                = listMonths;
    hooks.isDate                = isDate;
    hooks.locale                = getSetGlobalLocale;
    hooks.invalid               = createInvalid;
    hooks.duration              = createDuration;
    hooks.isMoment              = isMoment;
    hooks.weekdays              = listWeekdays;
    hooks.parseZone             = createInZone;
    hooks.localeData            = getLocale;
    hooks.isDuration            = isDuration;
    hooks.monthsShort           = listMonthsShort;
    hooks.weekdaysMin           = listWeekdaysMin;
    hooks.defineLocale          = defineLocale;
    hooks.updateLocale          = updateLocale;
    hooks.locales               = listLocales;
    hooks.weekdaysShort         = listWeekdaysShort;
    hooks.normalizeUnits        = normalizeUnits;
    hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat        = getCalendarFormat;
    hooks.prototype             = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD',                             // <input type="date" />
        TIME: 'HH:mm',                                  // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW',                             // <input type="week" />
        MONTH: 'YYYY-MM'                                // <input type="month" />
    };

    return hooks;

})));
});

function dateToday() {
  return formatDate(new Date().toISOString(), DATE_FORMATS.date_value);
}
function isFutureDate(date) {
  return new Date(date) > new Date(new Date().toDateString());
}
function inferCentury(year) {
  if (year.length !== 2) {
    return year;
  }

  var thisCentury = dateToday().substr(0, 2),
      lastCentury = moment().subtract(100, 'years').format('YYYY').substr(0, 2),
      thisCenturyGuess = "".concat(thisCentury).concat(year),
      lastCenturyGuess = "".concat(lastCentury).concat(year);

  if (isFutureDate("".concat(thisCenturyGuess, "-01-01"))) {
    return lastCenturyGuess;
  }

  return thisCenturyGuess;
}

function insertIf(condition, element) {
  return condition ? [element] : [];
}
function getPercentValue(value) {
  if (typeof value === 'undefined' || value === null || value === '') {
    return '';
  }

  return new Decimal(value).div(CENT_DECIMAL).toString();
}
function getPercentDisplay(value) {
  if (typeof value === 'undefined' || value === null || value === '') {
    return '';
  }

  return new Decimal(value).times(CENT_DECIMAL).toString();
}

function isValidBirthdate(value) {
  return !!value // Not empty
  && value.length === '####-##-##'.length // ISO date
  && moment(value).isValid() // Real day
  && moment(value).isBefore(moment()) // In the past
  ;
}

exports.EMPTY_FIELD = EMPTY_FIELD;
exports.DATE_FORMATS = DATE_FORMATS;
exports.CENT_DECIMAL = CENT_DECIMAL;
exports.createDisabledContainer = createDisabledContainer;
exports.createGuardedContainer = createGuardedContainer;
exports.dateToday = dateToday;
exports.isFutureDate = isFutureDate;
exports.inferCentury = inferCentury;
exports.canReplaceSymbols = canReplaceSymbols;
exports.replaceSymbolsWithChars = replaceSymbolsWithChars;
exports.hasStringContent = hasStringContent;
exports.hasStringOrNumberContent = hasStringOrNumberContent;
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
exports.formatWebsite = formatWebsite;
exports.stripNonAlpha = stripNonAlpha;
exports.pluralize = pluralize;
exports.getType = getType;
exports.preserveNewLines = preserveNewLines;
exports.parseAndPreserveNewlines = parseAndPreserveNewlines;
exports.getDisplayName = getDisplayName;
exports.varToLabel = varToLabel;
exports.toKey = toKey;
exports.formatAddress = formatAddress;
exports.formatAddressMultiline = formatAddressMultiline;
exports.insertIf = insertIf;
exports.getPercentValue = getPercentValue;
exports.getPercentDisplay = getPercentDisplay;
exports.isValidBirthdate = isValidBirthdate;
