(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('mobx'), require('mobx-react'), require('util'), require('events'), require('lodash')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'mobx', 'mobx-react', 'util', 'events', 'lodash'], factory) :
  (global = global || self, factory(global.utils = {}, global.React, global.mobx, global.mobxReact, global.util, global.events, global.lodash));
}(this, function (exports, React, mobx, mobxReact, util, events, lodash) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;
  util = util && util.hasOwnProperty('default') ? util['default'] : util;
  events = events && events.hasOwnProperty('default') ? events['default'] : events;

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
    date_at_time: 'MM/DD/YY @ h:mmA',
    // ex. 07/14/16 @ 2:24PM
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

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
  }

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  function getCjsExportFromNamespace (n) {
  	return n && n.default || n;
  }

  var classnames = createCommonjsModule(function (module) {
  /*!
    Copyright (c) 2017 Jed Watson.
    Licensed under the MIT License (MIT), see
    http://jedwatson.github.io/classnames
  */
  /* global define */

  (function () {

  	var hasOwn = {}.hasOwnProperty;

  	function classNames () {
  		var classes = [];

  		for (var i = 0; i < arguments.length; i++) {
  			var arg = arguments[i];
  			if (!arg) continue;

  			var argType = typeof arg;

  			if (argType === 'string' || argType === 'number') {
  				classes.push(arg);
  			} else if (Array.isArray(arg) && arg.length) {
  				var inner = classNames.apply(null, arg);
  				if (inner) {
  					classes.push(inner);
  				}
  			} else if (argType === 'object') {
  				for (var key in arg) {
  					if (hasOwn.call(arg, key) && arg[key]) {
  						classes.push(key);
  					}
  				}
  			}
  		}

  		return classes.join(' ');
  	}

  	if (module.exports) {
  		classNames.default = classNames;
  		module.exports = classNames;
  	} else {
  		window.classNames = classNames;
  	}
  }());
  });

  var lib = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * @description A module for parsing ISO8601 durations
   */

  /**
   * The pattern used for parsing ISO8601 duration (PnYnMnDTnHnMnS).
   * This does not cover the week format PnW.
   */

  // PnYnMnDTnHnMnS
  var numbers = '\\d+(?:[\\.,]\\d{0,3})?';
  var weekPattern = '(' + numbers + 'W)';
  var datePattern = '(' + numbers + 'Y)?(' + numbers + 'M)?(' + numbers + 'D)?';
  var timePattern = 'T(' + numbers + 'H)?(' + numbers + 'M)?(' + numbers + 'S)?';

  var iso8601 = 'P(?:' + weekPattern + '|' + datePattern + '(?:' + timePattern + ')?)';
  var objMap = ['weeks', 'years', 'months', 'days', 'hours', 'minutes', 'seconds'];

  /**
   * The ISO8601 regex for matching / testing durations
   */
  var pattern = exports.pattern = new RegExp(iso8601);

  /** Parse PnYnMnDTnHnMnS format to object
   * @param {string} durationString - PnYnMnDTnHnMnS formatted string
   * @return {Object} - With a property for each part of the pattern
   */
  var parse = exports.parse = function parse(durationString) {
    // Slice away first entry in match-array
    return durationString.match(pattern).slice(1).reduce(function (prev, next, idx) {
      prev[objMap[idx]] = parseFloat(next) || 0;
      return prev;
    }, {});
  };

  /**
   * Convert ISO8601 duration object to an end Date.
   *
   * @param {Object} duration - The duration object
   * @param {Date} startDate - The starting Date for calculating the duration
   * @return {Date} - The resulting end Date
   */
  var end = exports.end = function end(duration, startDate) {
    // Create two equal timestamps, add duration to 'then' and return time difference
    var timestamp = startDate ? startDate.getTime() : Date.now();
    var then = new Date(timestamp);

    then.setFullYear(then.getFullYear() + duration.years);
    then.setMonth(then.getMonth() + duration.months);
    then.setDate(then.getDate() + duration.days);
    then.setHours(then.getHours() + duration.hours);
    then.setMinutes(then.getMinutes() + duration.minutes);
    // Then.setSeconds(then.getSeconds() + duration.seconds);
    then.setMilliseconds(then.getMilliseconds() + duration.seconds * 1000);
    // Special case weeks
    then.setDate(then.getDate() + duration.weeks * 7);

    return then;
  };

  /**
   * Convert ISO8601 duration object to seconds
   *
   * @param {Object} duration - The duration object
   * @param {Date} startDate - The starting point for calculating the duration
   * @return {Number}
   */
  var toSeconds = exports.toSeconds = function toSeconds(duration, startDate) {
    var timestamp = startDate ? startDate.getTime() : Date.now();
    var now = new Date(timestamp);
    var then = end(duration, now);

    var seconds = (then.getTime() - now.getTime()) / 1000;
    return seconds;
  };

  exports.default = {
    end: end,
    toSeconds: toSeconds,
    pattern: pattern,
    parse: parse
  };
  });

  unwrapExports(lib);
  var lib_1 = lib.pattern;
  var lib_2 = lib.parse;
  var lib_3 = lib.end;
  var lib_4 = lib.toSeconds;

  var MILLISECONDS_IN_MINUTE = 60000;

  /**
   * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
   * They usually appear for dates that denote time before the timezones were introduced
   * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
   * and GMT+01:00:00 after that date)
   *
   * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
   * which would lead to incorrect calculations.
   *
   * This function returns the timezone offset in milliseconds that takes seconds in account.
   */
  var getTimezoneOffsetInMilliseconds = function getTimezoneOffsetInMilliseconds (dirtyDate) {
    var date = new Date(dirtyDate.getTime());
    var baseTimezoneOffset = date.getTimezoneOffset();
    date.setSeconds(0, 0);
    var millisecondsPartOfTimezoneOffset = date.getTime() % MILLISECONDS_IN_MINUTE;

    return baseTimezoneOffset * MILLISECONDS_IN_MINUTE + millisecondsPartOfTimezoneOffset
  };

  /**
   * @category Common Helpers
   * @summary Is the given argument an instance of Date?
   *
   * @description
   * Is the given argument an instance of Date?
   *
   * @param {*} argument - the argument to check
   * @returns {Boolean} the given argument is an instance of Date
   *
   * @example
   * // Is 'mayonnaise' a Date?
   * var result = isDate('mayonnaise')
   * //=> false
   */
  function isDate (argument) {
    return argument instanceof Date
  }

  var is_date = isDate;

  var MILLISECONDS_IN_HOUR = 3600000;
  var MILLISECONDS_IN_MINUTE$1 = 60000;
  var DEFAULT_ADDITIONAL_DIGITS = 2;

  var parseTokenDateTimeDelimeter = /[T ]/;
  var parseTokenPlainTime = /:/;

  // year tokens
  var parseTokenYY = /^(\d{2})$/;
  var parseTokensYYY = [
    /^([+-]\d{2})$/, // 0 additional digits
    /^([+-]\d{3})$/, // 1 additional digit
    /^([+-]\d{4})$/ // 2 additional digits
  ];

  var parseTokenYYYY = /^(\d{4})/;
  var parseTokensYYYYY = [
    /^([+-]\d{4})/, // 0 additional digits
    /^([+-]\d{5})/, // 1 additional digit
    /^([+-]\d{6})/ // 2 additional digits
  ];

  // date tokens
  var parseTokenMM = /^-(\d{2})$/;
  var parseTokenDDD = /^-?(\d{3})$/;
  var parseTokenMMDD = /^-?(\d{2})-?(\d{2})$/;
  var parseTokenWww = /^-?W(\d{2})$/;
  var parseTokenWwwD = /^-?W(\d{2})-?(\d{1})$/;

  // time tokens
  var parseTokenHH = /^(\d{2}([.,]\d*)?)$/;
  var parseTokenHHMM = /^(\d{2}):?(\d{2}([.,]\d*)?)$/;
  var parseTokenHHMMSS = /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/;

  // timezone tokens
  var parseTokenTimezone = /([Z+-].*)$/;
  var parseTokenTimezoneZ = /^(Z)$/;
  var parseTokenTimezoneHH = /^([+-])(\d{2})$/;
  var parseTokenTimezoneHHMM = /^([+-])(\d{2}):?(\d{2})$/;

  /**
   * @category Common Helpers
   * @summary Convert the given argument to an instance of Date.
   *
   * @description
   * Convert the given argument to an instance of Date.
   *
   * If the argument is an instance of Date, the function returns its clone.
   *
   * If the argument is a number, it is treated as a timestamp.
   *
   * If an argument is a string, the function tries to parse it.
   * Function accepts complete ISO 8601 formats as well as partial implementations.
   * ISO 8601: http://en.wikipedia.org/wiki/ISO_8601
   *
   * If all above fails, the function passes the given argument to Date constructor.
   *
   * @param {Date|String|Number} argument - the value to convert
   * @param {Object} [options] - the object with options
   * @param {0 | 1 | 2} [options.additionalDigits=2] - the additional number of digits in the extended year format
   * @returns {Date} the parsed date in the local time zone
   *
   * @example
   * // Convert string '2014-02-11T11:30:30' to date:
   * var result = parse('2014-02-11T11:30:30')
   * //=> Tue Feb 11 2014 11:30:30
   *
   * @example
   * // Parse string '+02014101',
   * // if the additional number of digits in the extended year format is 1:
   * var result = parse('+02014101', {additionalDigits: 1})
   * //=> Fri Apr 11 2014 00:00:00
   */
  function parse (argument, dirtyOptions) {
    if (is_date(argument)) {
      // Prevent the date to lose the milliseconds when passed to new Date() in IE10
      return new Date(argument.getTime())
    } else if (typeof argument !== 'string') {
      return new Date(argument)
    }

    var options = dirtyOptions || {};
    var additionalDigits = options.additionalDigits;
    if (additionalDigits == null) {
      additionalDigits = DEFAULT_ADDITIONAL_DIGITS;
    } else {
      additionalDigits = Number(additionalDigits);
    }

    var dateStrings = splitDateString(argument);

    var parseYearResult = parseYear(dateStrings.date, additionalDigits);
    var year = parseYearResult.year;
    var restDateString = parseYearResult.restDateString;

    var date = parseDate(restDateString, year);

    if (date) {
      var timestamp = date.getTime();
      var time = 0;
      var offset;

      if (dateStrings.time) {
        time = parseTime(dateStrings.time);
      }

      if (dateStrings.timezone) {
        offset = parseTimezone(dateStrings.timezone) * MILLISECONDS_IN_MINUTE$1;
      } else {
        var fullTime = timestamp + time;
        var fullTimeDate = new Date(fullTime);

        offset = getTimezoneOffsetInMilliseconds(fullTimeDate);

        // Adjust time when it's coming from DST
        var fullTimeDateNextDay = new Date(fullTime);
        fullTimeDateNextDay.setDate(fullTimeDate.getDate() + 1);
        var offsetDiff =
          getTimezoneOffsetInMilliseconds(fullTimeDateNextDay) -
          getTimezoneOffsetInMilliseconds(fullTimeDate);
        if (offsetDiff > 0) {
          offset += offsetDiff;
        }
      }

      return new Date(timestamp + time + offset)
    } else {
      return new Date(argument)
    }
  }

  function splitDateString (dateString) {
    var dateStrings = {};
    var array = dateString.split(parseTokenDateTimeDelimeter);
    var timeString;

    if (parseTokenPlainTime.test(array[0])) {
      dateStrings.date = null;
      timeString = array[0];
    } else {
      dateStrings.date = array[0];
      timeString = array[1];
    }

    if (timeString) {
      var token = parseTokenTimezone.exec(timeString);
      if (token) {
        dateStrings.time = timeString.replace(token[1], '');
        dateStrings.timezone = token[1];
      } else {
        dateStrings.time = timeString;
      }
    }

    return dateStrings
  }

  function parseYear (dateString, additionalDigits) {
    var parseTokenYYY = parseTokensYYY[additionalDigits];
    var parseTokenYYYYY = parseTokensYYYYY[additionalDigits];

    var token;

    // YYYY or ±YYYYY
    token = parseTokenYYYY.exec(dateString) || parseTokenYYYYY.exec(dateString);
    if (token) {
      var yearString = token[1];
      return {
        year: parseInt(yearString, 10),
        restDateString: dateString.slice(yearString.length)
      }
    }

    // YY or ±YYY
    token = parseTokenYY.exec(dateString) || parseTokenYYY.exec(dateString);
    if (token) {
      var centuryString = token[1];
      return {
        year: parseInt(centuryString, 10) * 100,
        restDateString: dateString.slice(centuryString.length)
      }
    }

    // Invalid ISO-formatted year
    return {
      year: null
    }
  }

  function parseDate (dateString, year) {
    // Invalid ISO-formatted year
    if (year === null) {
      return null
    }

    var token;
    var date;
    var month;
    var week;

    // YYYY
    if (dateString.length === 0) {
      date = new Date(0);
      date.setUTCFullYear(year);
      return date
    }

    // YYYY-MM
    token = parseTokenMM.exec(dateString);
    if (token) {
      date = new Date(0);
      month = parseInt(token[1], 10) - 1;
      date.setUTCFullYear(year, month);
      return date
    }

    // YYYY-DDD or YYYYDDD
    token = parseTokenDDD.exec(dateString);
    if (token) {
      date = new Date(0);
      var dayOfYear = parseInt(token[1], 10);
      date.setUTCFullYear(year, 0, dayOfYear);
      return date
    }

    // YYYY-MM-DD or YYYYMMDD
    token = parseTokenMMDD.exec(dateString);
    if (token) {
      date = new Date(0);
      month = parseInt(token[1], 10) - 1;
      var day = parseInt(token[2], 10);
      date.setUTCFullYear(year, month, day);
      return date
    }

    // YYYY-Www or YYYYWww
    token = parseTokenWww.exec(dateString);
    if (token) {
      week = parseInt(token[1], 10) - 1;
      return dayOfISOYear(year, week)
    }

    // YYYY-Www-D or YYYYWwwD
    token = parseTokenWwwD.exec(dateString);
    if (token) {
      week = parseInt(token[1], 10) - 1;
      var dayOfWeek = parseInt(token[2], 10) - 1;
      return dayOfISOYear(year, week, dayOfWeek)
    }

    // Invalid ISO-formatted date
    return null
  }

  function parseTime (timeString) {
    var token;
    var hours;
    var minutes;

    // hh
    token = parseTokenHH.exec(timeString);
    if (token) {
      hours = parseFloat(token[1].replace(',', '.'));
      return (hours % 24) * MILLISECONDS_IN_HOUR
    }

    // hh:mm or hhmm
    token = parseTokenHHMM.exec(timeString);
    if (token) {
      hours = parseInt(token[1], 10);
      minutes = parseFloat(token[2].replace(',', '.'));
      return (hours % 24) * MILLISECONDS_IN_HOUR +
        minutes * MILLISECONDS_IN_MINUTE$1
    }

    // hh:mm:ss or hhmmss
    token = parseTokenHHMMSS.exec(timeString);
    if (token) {
      hours = parseInt(token[1], 10);
      minutes = parseInt(token[2], 10);
      var seconds = parseFloat(token[3].replace(',', '.'));
      return (hours % 24) * MILLISECONDS_IN_HOUR +
        minutes * MILLISECONDS_IN_MINUTE$1 +
        seconds * 1000
    }

    // Invalid ISO-formatted time
    return null
  }

  function parseTimezone (timezoneString) {
    var token;
    var absoluteOffset;

    // Z
    token = parseTokenTimezoneZ.exec(timezoneString);
    if (token) {
      return 0
    }

    // ±hh
    token = parseTokenTimezoneHH.exec(timezoneString);
    if (token) {
      absoluteOffset = parseInt(token[2], 10) * 60;
      return (token[1] === '+') ? -absoluteOffset : absoluteOffset
    }

    // ±hh:mm or ±hhmm
    token = parseTokenTimezoneHHMM.exec(timezoneString);
    if (token) {
      absoluteOffset = parseInt(token[2], 10) * 60 + parseInt(token[3], 10);
      return (token[1] === '+') ? -absoluteOffset : absoluteOffset
    }

    return 0
  }

  function dayOfISOYear (isoYear, week, day) {
    week = week || 0;
    day = day || 0;
    var date = new Date(0);
    date.setUTCFullYear(isoYear, 0, 4);
    var fourthOfJanuaryDay = date.getUTCDay() || 7;
    var diff = week * 7 + day + 1 - fourthOfJanuaryDay;
    date.setUTCDate(date.getUTCDate() + diff);
    return date
  }

  var parse_1 = parse;

  /**
   * @category Day Helpers
   * @summary Add the specified number of days to the given date.
   *
   * @description
   * Add the specified number of days to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of days to be added
   * @returns {Date} the new date with the days added
   *
   * @example
   * // Add 10 days to 1 September 2014:
   * var result = addDays(new Date(2014, 8, 1), 10)
   * //=> Thu Sep 11 2014 00:00:00
   */
  function addDays (dirtyDate, dirtyAmount) {
    var date = parse_1(dirtyDate);
    var amount = Number(dirtyAmount);
    date.setDate(date.getDate() + amount);
    return date
  }

  var add_days = addDays;

  /**
   * @category Millisecond Helpers
   * @summary Add the specified number of milliseconds to the given date.
   *
   * @description
   * Add the specified number of milliseconds to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of milliseconds to be added
   * @returns {Date} the new date with the milliseconds added
   *
   * @example
   * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
   * var result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
   * //=> Thu Jul 10 2014 12:45:30.750
   */
  function addMilliseconds (dirtyDate, dirtyAmount) {
    var timestamp = parse_1(dirtyDate).getTime();
    var amount = Number(dirtyAmount);
    return new Date(timestamp + amount)
  }

  var add_milliseconds = addMilliseconds;

  var MILLISECONDS_IN_HOUR$1 = 3600000;

  /**
   * @category Hour Helpers
   * @summary Add the specified number of hours to the given date.
   *
   * @description
   * Add the specified number of hours to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of hours to be added
   * @returns {Date} the new date with the hours added
   *
   * @example
   * // Add 2 hours to 10 July 2014 23:00:00:
   * var result = addHours(new Date(2014, 6, 10, 23, 0), 2)
   * //=> Fri Jul 11 2014 01:00:00
   */
  function addHours (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_milliseconds(dirtyDate, amount * MILLISECONDS_IN_HOUR$1)
  }

  var add_hours = addHours;

  /**
   * @category Week Helpers
   * @summary Return the start of a week for the given date.
   *
   * @description
   * Return the start of a week for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @param {Object} [options] - the object with options
   * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
   * @returns {Date} the start of a week
   *
   * @example
   * // The start of a week for 2 September 2014 11:55:00:
   * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Sun Aug 31 2014 00:00:00
   *
   * @example
   * // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
   * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), {weekStartsOn: 1})
   * //=> Mon Sep 01 2014 00:00:00
   */
  function startOfWeek (dirtyDate, dirtyOptions) {
    var weekStartsOn = dirtyOptions ? (Number(dirtyOptions.weekStartsOn) || 0) : 0;

    var date = parse_1(dirtyDate);
    var day = date.getDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

    date.setDate(date.getDate() - diff);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var start_of_week = startOfWeek;

  /**
   * @category ISO Week Helpers
   * @summary Return the start of an ISO week for the given date.
   *
   * @description
   * Return the start of an ISO week for the given date.
   * The result will be in the local timezone.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of an ISO week
   *
   * @example
   * // The start of an ISO week for 2 September 2014 11:55:00:
   * var result = startOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Mon Sep 01 2014 00:00:00
   */
  function startOfISOWeek (dirtyDate) {
    return start_of_week(dirtyDate, {weekStartsOn: 1})
  }

  var start_of_iso_week = startOfISOWeek;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Get the ISO week-numbering year of the given date.
   *
   * @description
   * Get the ISO week-numbering year of the given date,
   * which always starts 3 days before the year's first Thursday.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the ISO week-numbering year
   *
   * @example
   * // Which ISO-week numbering year is 2 January 2005?
   * var result = getISOYear(new Date(2005, 0, 2))
   * //=> 2004
   */
  function getISOYear (dirtyDate) {
    var date = parse_1(dirtyDate);
    var year = date.getFullYear();

    var fourthOfJanuaryOfNextYear = new Date(0);
    fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
    fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
    var startOfNextYear = start_of_iso_week(fourthOfJanuaryOfNextYear);

    var fourthOfJanuaryOfThisYear = new Date(0);
    fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
    fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
    var startOfThisYear = start_of_iso_week(fourthOfJanuaryOfThisYear);

    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year
    } else {
      return year - 1
    }
  }

  var get_iso_year = getISOYear;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Return the start of an ISO week-numbering year for the given date.
   *
   * @description
   * Return the start of an ISO week-numbering year,
   * which always starts 3 days before the year's first Thursday.
   * The result will be in the local timezone.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of an ISO year
   *
   * @example
   * // The start of an ISO week-numbering year for 2 July 2005:
   * var result = startOfISOYear(new Date(2005, 6, 2))
   * //=> Mon Jan 03 2005 00:00:00
   */
  function startOfISOYear (dirtyDate) {
    var year = get_iso_year(dirtyDate);
    var fourthOfJanuary = new Date(0);
    fourthOfJanuary.setFullYear(year, 0, 4);
    fourthOfJanuary.setHours(0, 0, 0, 0);
    var date = start_of_iso_week(fourthOfJanuary);
    return date
  }

  var start_of_iso_year = startOfISOYear;

  /**
   * @category Day Helpers
   * @summary Return the start of a day for the given date.
   *
   * @description
   * Return the start of a day for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of a day
   *
   * @example
   * // The start of a day for 2 September 2014 11:55:00:
   * var result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Sep 02 2014 00:00:00
   */
  function startOfDay (dirtyDate) {
    var date = parse_1(dirtyDate);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var start_of_day = startOfDay;

  var MILLISECONDS_IN_MINUTE$2 = 60000;
  var MILLISECONDS_IN_DAY = 86400000;

  /**
   * @category Day Helpers
   * @summary Get the number of calendar days between the given dates.
   *
   * @description
   * Get the number of calendar days between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of calendar days
   *
   * @example
   * // How many calendar days are between
   * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
   * var result = differenceInCalendarDays(
   *   new Date(2012, 6, 2, 0, 0),
   *   new Date(2011, 6, 2, 23, 0)
   * )
   * //=> 366
   */
  function differenceInCalendarDays (dirtyDateLeft, dirtyDateRight) {
    var startOfDayLeft = start_of_day(dirtyDateLeft);
    var startOfDayRight = start_of_day(dirtyDateRight);

    var timestampLeft = startOfDayLeft.getTime() -
      startOfDayLeft.getTimezoneOffset() * MILLISECONDS_IN_MINUTE$2;
    var timestampRight = startOfDayRight.getTime() -
      startOfDayRight.getTimezoneOffset() * MILLISECONDS_IN_MINUTE$2;

    // Round the number of days to the nearest integer
    // because the number of milliseconds in a day is not constant
    // (e.g. it's different in the day of the daylight saving time clock shift)
    return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY)
  }

  var difference_in_calendar_days = differenceInCalendarDays;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Set the ISO week-numbering year to the given date.
   *
   * @description
   * Set the ISO week-numbering year to the given date,
   * saving the week number and the weekday number.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} isoYear - the ISO week-numbering year of the new date
   * @returns {Date} the new date with the ISO week-numbering year setted
   *
   * @example
   * // Set ISO week-numbering year 2007 to 29 December 2008:
   * var result = setISOYear(new Date(2008, 11, 29), 2007)
   * //=> Mon Jan 01 2007 00:00:00
   */
  function setISOYear (dirtyDate, dirtyISOYear) {
    var date = parse_1(dirtyDate);
    var isoYear = Number(dirtyISOYear);
    var diff = difference_in_calendar_days(date, start_of_iso_year(date));
    var fourthOfJanuary = new Date(0);
    fourthOfJanuary.setFullYear(isoYear, 0, 4);
    fourthOfJanuary.setHours(0, 0, 0, 0);
    date = start_of_iso_year(fourthOfJanuary);
    date.setDate(date.getDate() + diff);
    return date
  }

  var set_iso_year = setISOYear;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Add the specified number of ISO week-numbering years to the given date.
   *
   * @description
   * Add the specified number of ISO week-numbering years to the given date.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of ISO week-numbering years to be added
   * @returns {Date} the new date with the ISO week-numbering years added
   *
   * @example
   * // Add 5 ISO week-numbering years to 2 July 2010:
   * var result = addISOYears(new Date(2010, 6, 2), 5)
   * //=> Fri Jun 26 2015 00:00:00
   */
  function addISOYears (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return set_iso_year(dirtyDate, get_iso_year(dirtyDate) + amount)
  }

  var add_iso_years = addISOYears;

  var MILLISECONDS_IN_MINUTE$3 = 60000;

  /**
   * @category Minute Helpers
   * @summary Add the specified number of minutes to the given date.
   *
   * @description
   * Add the specified number of minutes to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of minutes to be added
   * @returns {Date} the new date with the minutes added
   *
   * @example
   * // Add 30 minutes to 10 July 2014 12:00:00:
   * var result = addMinutes(new Date(2014, 6, 10, 12, 0), 30)
   * //=> Thu Jul 10 2014 12:30:00
   */
  function addMinutes (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_milliseconds(dirtyDate, amount * MILLISECONDS_IN_MINUTE$3)
  }

  var add_minutes = addMinutes;

  /**
   * @category Month Helpers
   * @summary Get the number of days in a month of the given date.
   *
   * @description
   * Get the number of days in a month of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the number of days in a month
   *
   * @example
   * // How many days are in February 2000?
   * var result = getDaysInMonth(new Date(2000, 1))
   * //=> 29
   */
  function getDaysInMonth (dirtyDate) {
    var date = parse_1(dirtyDate);
    var year = date.getFullYear();
    var monthIndex = date.getMonth();
    var lastDayOfMonth = new Date(0);
    lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);
    return lastDayOfMonth.getDate()
  }

  var get_days_in_month = getDaysInMonth;

  /**
   * @category Month Helpers
   * @summary Add the specified number of months to the given date.
   *
   * @description
   * Add the specified number of months to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of months to be added
   * @returns {Date} the new date with the months added
   *
   * @example
   * // Add 5 months to 1 September 2014:
   * var result = addMonths(new Date(2014, 8, 1), 5)
   * //=> Sun Feb 01 2015 00:00:00
   */
  function addMonths (dirtyDate, dirtyAmount) {
    var date = parse_1(dirtyDate);
    var amount = Number(dirtyAmount);
    var desiredMonth = date.getMonth() + amount;
    var dateWithDesiredMonth = new Date(0);
    dateWithDesiredMonth.setFullYear(date.getFullYear(), desiredMonth, 1);
    dateWithDesiredMonth.setHours(0, 0, 0, 0);
    var daysInMonth = get_days_in_month(dateWithDesiredMonth);
    // Set the last day of the new month
    // if the original date was the last day of the longer month
    date.setMonth(desiredMonth, Math.min(daysInMonth, date.getDate()));
    return date
  }

  var add_months = addMonths;

  /**
   * @category Quarter Helpers
   * @summary Add the specified number of year quarters to the given date.
   *
   * @description
   * Add the specified number of year quarters to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of quarters to be added
   * @returns {Date} the new date with the quarters added
   *
   * @example
   * // Add 1 quarter to 1 September 2014:
   * var result = addQuarters(new Date(2014, 8, 1), 1)
   * //=> Mon Dec 01 2014 00:00:00
   */
  function addQuarters (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    var months = amount * 3;
    return add_months(dirtyDate, months)
  }

  var add_quarters = addQuarters;

  /**
   * @category Second Helpers
   * @summary Add the specified number of seconds to the given date.
   *
   * @description
   * Add the specified number of seconds to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of seconds to be added
   * @returns {Date} the new date with the seconds added
   *
   * @example
   * // Add 30 seconds to 10 July 2014 12:45:00:
   * var result = addSeconds(new Date(2014, 6, 10, 12, 45, 0), 30)
   * //=> Thu Jul 10 2014 12:45:30
   */
  function addSeconds (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_milliseconds(dirtyDate, amount * 1000)
  }

  var add_seconds = addSeconds;

  /**
   * @category Week Helpers
   * @summary Add the specified number of weeks to the given date.
   *
   * @description
   * Add the specified number of week to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of weeks to be added
   * @returns {Date} the new date with the weeks added
   *
   * @example
   * // Add 4 weeks to 1 September 2014:
   * var result = addWeeks(new Date(2014, 8, 1), 4)
   * //=> Mon Sep 29 2014 00:00:00
   */
  function addWeeks (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    var days = amount * 7;
    return add_days(dirtyDate, days)
  }

  var add_weeks = addWeeks;

  /**
   * @category Year Helpers
   * @summary Add the specified number of years to the given date.
   *
   * @description
   * Add the specified number of years to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of years to be added
   * @returns {Date} the new date with the years added
   *
   * @example
   * // Add 5 years to 1 September 2014:
   * var result = addYears(new Date(2014, 8, 1), 5)
   * //=> Sun Sep 01 2019 00:00:00
   */
  function addYears (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_months(dirtyDate, amount * 12)
  }

  var add_years = addYears;

  /**
   * @category Range Helpers
   * @summary Is the given date range overlapping with another date range?
   *
   * @description
   * Is the given date range overlapping with another date range?
   *
   * @param {Date|String|Number} initialRangeStartDate - the start of the initial range
   * @param {Date|String|Number} initialRangeEndDate - the end of the initial range
   * @param {Date|String|Number} comparedRangeStartDate - the start of the range to compare it with
   * @param {Date|String|Number} comparedRangeEndDate - the end of the range to compare it with
   * @returns {Boolean} whether the date ranges are overlapping
   * @throws {Error} startDate of a date range cannot be after its endDate
   *
   * @example
   * // For overlapping date ranges:
   * areRangesOverlapping(
   *   new Date(2014, 0, 10), new Date(2014, 0, 20), new Date(2014, 0, 17), new Date(2014, 0, 21)
   * )
   * //=> true
   *
   * @example
   * // For non-overlapping date ranges:
   * areRangesOverlapping(
   *   new Date(2014, 0, 10), new Date(2014, 0, 20), new Date(2014, 0, 21), new Date(2014, 0, 22)
   * )
   * //=> false
   */
  function areRangesOverlapping (dirtyInitialRangeStartDate, dirtyInitialRangeEndDate, dirtyComparedRangeStartDate, dirtyComparedRangeEndDate) {
    var initialStartTime = parse_1(dirtyInitialRangeStartDate).getTime();
    var initialEndTime = parse_1(dirtyInitialRangeEndDate).getTime();
    var comparedStartTime = parse_1(dirtyComparedRangeStartDate).getTime();
    var comparedEndTime = parse_1(dirtyComparedRangeEndDate).getTime();

    if (initialStartTime > initialEndTime || comparedStartTime > comparedEndTime) {
      throw new Error('The start of the range cannot be after the end of the range')
    }

    return initialStartTime < comparedEndTime && comparedStartTime < initialEndTime
  }

  var are_ranges_overlapping = areRangesOverlapping;

  /**
   * @category Common Helpers
   * @summary Return an index of the closest date from the array comparing to the given date.
   *
   * @description
   * Return an index of the closest date from the array comparing to the given date.
   *
   * @param {Date|String|Number} dateToCompare - the date to compare with
   * @param {Date[]|String[]|Number[]} datesArray - the array to search
   * @returns {Number} an index of the date closest to the given date
   * @throws {TypeError} the second argument must be an instance of Array
   *
   * @example
   * // Which date is closer to 6 September 2015?
   * var dateToCompare = new Date(2015, 8, 6)
   * var datesArray = [
   *   new Date(2015, 0, 1),
   *   new Date(2016, 0, 1),
   *   new Date(2017, 0, 1)
   * ]
   * var result = closestIndexTo(dateToCompare, datesArray)
   * //=> 1
   */
  function closestIndexTo (dirtyDateToCompare, dirtyDatesArray) {
    if (!(dirtyDatesArray instanceof Array)) {
      throw new TypeError(toString.call(dirtyDatesArray) + ' is not an instance of Array')
    }

    var dateToCompare = parse_1(dirtyDateToCompare);
    var timeToCompare = dateToCompare.getTime();

    var result;
    var minDistance;

    dirtyDatesArray.forEach(function (dirtyDate, index) {
      var currentDate = parse_1(dirtyDate);
      var distance = Math.abs(timeToCompare - currentDate.getTime());
      if (result === undefined || distance < minDistance) {
        result = index;
        minDistance = distance;
      }
    });

    return result
  }

  var closest_index_to = closestIndexTo;

  /**
   * @category Common Helpers
   * @summary Return a date from the array closest to the given date.
   *
   * @description
   * Return a date from the array closest to the given date.
   *
   * @param {Date|String|Number} dateToCompare - the date to compare with
   * @param {Date[]|String[]|Number[]} datesArray - the array to search
   * @returns {Date} the date from the array closest to the given date
   * @throws {TypeError} the second argument must be an instance of Array
   *
   * @example
   * // Which date is closer to 6 September 2015: 1 January 2000 or 1 January 2030?
   * var dateToCompare = new Date(2015, 8, 6)
   * var result = closestTo(dateToCompare, [
   *   new Date(2000, 0, 1),
   *   new Date(2030, 0, 1)
   * ])
   * //=> Tue Jan 01 2030 00:00:00
   */
  function closestTo (dirtyDateToCompare, dirtyDatesArray) {
    if (!(dirtyDatesArray instanceof Array)) {
      throw new TypeError(toString.call(dirtyDatesArray) + ' is not an instance of Array')
    }

    var dateToCompare = parse_1(dirtyDateToCompare);
    var timeToCompare = dateToCompare.getTime();

    var result;
    var minDistance;

    dirtyDatesArray.forEach(function (dirtyDate) {
      var currentDate = parse_1(dirtyDate);
      var distance = Math.abs(timeToCompare - currentDate.getTime());
      if (result === undefined || distance < minDistance) {
        result = currentDate;
        minDistance = distance;
      }
    });

    return result
  }

  var closest_to = closestTo;

  /**
   * @category Common Helpers
   * @summary Compare the two dates and return -1, 0 or 1.
   *
   * @description
   * Compare the two dates and return 1 if the first date is after the second,
   * -1 if the first date is before the second or 0 if dates are equal.
   *
   * @param {Date|String|Number} dateLeft - the first date to compare
   * @param {Date|String|Number} dateRight - the second date to compare
   * @returns {Number} the result of the comparison
   *
   * @example
   * // Compare 11 February 1987 and 10 July 1989:
   * var result = compareAsc(
   *   new Date(1987, 1, 11),
   *   new Date(1989, 6, 10)
   * )
   * //=> -1
   *
   * @example
   * // Sort the array of dates:
   * var result = [
   *   new Date(1995, 6, 2),
   *   new Date(1987, 1, 11),
   *   new Date(1989, 6, 10)
   * ].sort(compareAsc)
   * //=> [
   * //   Wed Feb 11 1987 00:00:00,
   * //   Mon Jul 10 1989 00:00:00,
   * //   Sun Jul 02 1995 00:00:00
   * // ]
   */
  function compareAsc (dirtyDateLeft, dirtyDateRight) {
    var dateLeft = parse_1(dirtyDateLeft);
    var timeLeft = dateLeft.getTime();
    var dateRight = parse_1(dirtyDateRight);
    var timeRight = dateRight.getTime();

    if (timeLeft < timeRight) {
      return -1
    } else if (timeLeft > timeRight) {
      return 1
    } else {
      return 0
    }
  }

  var compare_asc = compareAsc;

  /**
   * @category Common Helpers
   * @summary Compare the two dates reverse chronologically and return -1, 0 or 1.
   *
   * @description
   * Compare the two dates and return -1 if the first date is after the second,
   * 1 if the first date is before the second or 0 if dates are equal.
   *
   * @param {Date|String|Number} dateLeft - the first date to compare
   * @param {Date|String|Number} dateRight - the second date to compare
   * @returns {Number} the result of the comparison
   *
   * @example
   * // Compare 11 February 1987 and 10 July 1989 reverse chronologically:
   * var result = compareDesc(
   *   new Date(1987, 1, 11),
   *   new Date(1989, 6, 10)
   * )
   * //=> 1
   *
   * @example
   * // Sort the array of dates in reverse chronological order:
   * var result = [
   *   new Date(1995, 6, 2),
   *   new Date(1987, 1, 11),
   *   new Date(1989, 6, 10)
   * ].sort(compareDesc)
   * //=> [
   * //   Sun Jul 02 1995 00:00:00,
   * //   Mon Jul 10 1989 00:00:00,
   * //   Wed Feb 11 1987 00:00:00
   * // ]
   */
  function compareDesc (dirtyDateLeft, dirtyDateRight) {
    var dateLeft = parse_1(dirtyDateLeft);
    var timeLeft = dateLeft.getTime();
    var dateRight = parse_1(dirtyDateRight);
    var timeRight = dateRight.getTime();

    if (timeLeft > timeRight) {
      return -1
    } else if (timeLeft < timeRight) {
      return 1
    } else {
      return 0
    }
  }

  var compare_desc = compareDesc;

  var MILLISECONDS_IN_MINUTE$4 = 60000;
  var MILLISECONDS_IN_WEEK = 604800000;

  /**
   * @category ISO Week Helpers
   * @summary Get the number of calendar ISO weeks between the given dates.
   *
   * @description
   * Get the number of calendar ISO weeks between the given dates.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of calendar ISO weeks
   *
   * @example
   * // How many calendar ISO weeks are between 6 July 2014 and 21 July 2014?
   * var result = differenceInCalendarISOWeeks(
   *   new Date(2014, 6, 21),
   *   new Date(2014, 6, 6)
   * )
   * //=> 3
   */
  function differenceInCalendarISOWeeks (dirtyDateLeft, dirtyDateRight) {
    var startOfISOWeekLeft = start_of_iso_week(dirtyDateLeft);
    var startOfISOWeekRight = start_of_iso_week(dirtyDateRight);

    var timestampLeft = startOfISOWeekLeft.getTime() -
      startOfISOWeekLeft.getTimezoneOffset() * MILLISECONDS_IN_MINUTE$4;
    var timestampRight = startOfISOWeekRight.getTime() -
      startOfISOWeekRight.getTimezoneOffset() * MILLISECONDS_IN_MINUTE$4;

    // Round the number of days to the nearest integer
    // because the number of milliseconds in a week is not constant
    // (e.g. it's different in the week of the daylight saving time clock shift)
    return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_WEEK)
  }

  var difference_in_calendar_iso_weeks = differenceInCalendarISOWeeks;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Get the number of calendar ISO week-numbering years between the given dates.
   *
   * @description
   * Get the number of calendar ISO week-numbering years between the given dates.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of calendar ISO week-numbering years
   *
   * @example
   * // How many calendar ISO week-numbering years are 1 January 2010 and 1 January 2012?
   * var result = differenceInCalendarISOYears(
   *   new Date(2012, 0, 1),
   *   new Date(2010, 0, 1)
   * )
   * //=> 2
   */
  function differenceInCalendarISOYears (dirtyDateLeft, dirtyDateRight) {
    return get_iso_year(dirtyDateLeft) - get_iso_year(dirtyDateRight)
  }

  var difference_in_calendar_iso_years = differenceInCalendarISOYears;

  /**
   * @category Month Helpers
   * @summary Get the number of calendar months between the given dates.
   *
   * @description
   * Get the number of calendar months between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of calendar months
   *
   * @example
   * // How many calendar months are between 31 January 2014 and 1 September 2014?
   * var result = differenceInCalendarMonths(
   *   new Date(2014, 8, 1),
   *   new Date(2014, 0, 31)
   * )
   * //=> 8
   */
  function differenceInCalendarMonths (dirtyDateLeft, dirtyDateRight) {
    var dateLeft = parse_1(dirtyDateLeft);
    var dateRight = parse_1(dirtyDateRight);

    var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
    var monthDiff = dateLeft.getMonth() - dateRight.getMonth();

    return yearDiff * 12 + monthDiff
  }

  var difference_in_calendar_months = differenceInCalendarMonths;

  /**
   * @category Quarter Helpers
   * @summary Get the year quarter of the given date.
   *
   * @description
   * Get the year quarter of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the quarter
   *
   * @example
   * // Which quarter is 2 July 2014?
   * var result = getQuarter(new Date(2014, 6, 2))
   * //=> 3
   */
  function getQuarter (dirtyDate) {
    var date = parse_1(dirtyDate);
    var quarter = Math.floor(date.getMonth() / 3) + 1;
    return quarter
  }

  var get_quarter = getQuarter;

  /**
   * @category Quarter Helpers
   * @summary Get the number of calendar quarters between the given dates.
   *
   * @description
   * Get the number of calendar quarters between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of calendar quarters
   *
   * @example
   * // How many calendar quarters are between 31 December 2013 and 2 July 2014?
   * var result = differenceInCalendarQuarters(
   *   new Date(2014, 6, 2),
   *   new Date(2013, 11, 31)
   * )
   * //=> 3
   */
  function differenceInCalendarQuarters (dirtyDateLeft, dirtyDateRight) {
    var dateLeft = parse_1(dirtyDateLeft);
    var dateRight = parse_1(dirtyDateRight);

    var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
    var quarterDiff = get_quarter(dateLeft) - get_quarter(dateRight);

    return yearDiff * 4 + quarterDiff
  }

  var difference_in_calendar_quarters = differenceInCalendarQuarters;

  var MILLISECONDS_IN_MINUTE$5 = 60000;
  var MILLISECONDS_IN_WEEK$1 = 604800000;

  /**
   * @category Week Helpers
   * @summary Get the number of calendar weeks between the given dates.
   *
   * @description
   * Get the number of calendar weeks between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @param {Object} [options] - the object with options
   * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
   * @returns {Number} the number of calendar weeks
   *
   * @example
   * // How many calendar weeks are between 5 July 2014 and 20 July 2014?
   * var result = differenceInCalendarWeeks(
   *   new Date(2014, 6, 20),
   *   new Date(2014, 6, 5)
   * )
   * //=> 3
   *
   * @example
   * // If the week starts on Monday,
   * // how many calendar weeks are between 5 July 2014 and 20 July 2014?
   * var result = differenceInCalendarWeeks(
   *   new Date(2014, 6, 20),
   *   new Date(2014, 6, 5),
   *   {weekStartsOn: 1}
   * )
   * //=> 2
   */
  function differenceInCalendarWeeks (dirtyDateLeft, dirtyDateRight, dirtyOptions) {
    var startOfWeekLeft = start_of_week(dirtyDateLeft, dirtyOptions);
    var startOfWeekRight = start_of_week(dirtyDateRight, dirtyOptions);

    var timestampLeft = startOfWeekLeft.getTime() -
      startOfWeekLeft.getTimezoneOffset() * MILLISECONDS_IN_MINUTE$5;
    var timestampRight = startOfWeekRight.getTime() -
      startOfWeekRight.getTimezoneOffset() * MILLISECONDS_IN_MINUTE$5;

    // Round the number of days to the nearest integer
    // because the number of milliseconds in a week is not constant
    // (e.g. it's different in the week of the daylight saving time clock shift)
    return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_WEEK$1)
  }

  var difference_in_calendar_weeks = differenceInCalendarWeeks;

  /**
   * @category Year Helpers
   * @summary Get the number of calendar years between the given dates.
   *
   * @description
   * Get the number of calendar years between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of calendar years
   *
   * @example
   * // How many calendar years are between 31 December 2013 and 11 February 2015?
   * var result = differenceInCalendarYears(
   *   new Date(2015, 1, 11),
   *   new Date(2013, 11, 31)
   * )
   * //=> 2
   */
  function differenceInCalendarYears (dirtyDateLeft, dirtyDateRight) {
    var dateLeft = parse_1(dirtyDateLeft);
    var dateRight = parse_1(dirtyDateRight);

    return dateLeft.getFullYear() - dateRight.getFullYear()
  }

  var difference_in_calendar_years = differenceInCalendarYears;

  /**
   * @category Day Helpers
   * @summary Get the number of full days between the given dates.
   *
   * @description
   * Get the number of full days between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of full days
   *
   * @example
   * // How many full days are between
   * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
   * var result = differenceInDays(
   *   new Date(2012, 6, 2, 0, 0),
   *   new Date(2011, 6, 2, 23, 0)
   * )
   * //=> 365
   */
  function differenceInDays (dirtyDateLeft, dirtyDateRight) {
    var dateLeft = parse_1(dirtyDateLeft);
    var dateRight = parse_1(dirtyDateRight);

    var sign = compare_asc(dateLeft, dateRight);
    var difference = Math.abs(difference_in_calendar_days(dateLeft, dateRight));
    dateLeft.setDate(dateLeft.getDate() - sign * difference);

    // Math.abs(diff in full days - diff in calendar days) === 1 if last calendar day is not full
    // If so, result must be decreased by 1 in absolute value
    var isLastDayNotFull = compare_asc(dateLeft, dateRight) === -sign;
    return sign * (difference - isLastDayNotFull)
  }

  var difference_in_days = differenceInDays;

  /**
   * @category Millisecond Helpers
   * @summary Get the number of milliseconds between the given dates.
   *
   * @description
   * Get the number of milliseconds between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of milliseconds
   *
   * @example
   * // How many milliseconds are between
   * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
   * var result = differenceInMilliseconds(
   *   new Date(2014, 6, 2, 12, 30, 21, 700),
   *   new Date(2014, 6, 2, 12, 30, 20, 600)
   * )
   * //=> 1100
   */
  function differenceInMilliseconds (dirtyDateLeft, dirtyDateRight) {
    var dateLeft = parse_1(dirtyDateLeft);
    var dateRight = parse_1(dirtyDateRight);
    return dateLeft.getTime() - dateRight.getTime()
  }

  var difference_in_milliseconds = differenceInMilliseconds;

  var MILLISECONDS_IN_HOUR$2 = 3600000;

  /**
   * @category Hour Helpers
   * @summary Get the number of hours between the given dates.
   *
   * @description
   * Get the number of hours between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of hours
   *
   * @example
   * // How many hours are between 2 July 2014 06:50:00 and 2 July 2014 19:00:00?
   * var result = differenceInHours(
   *   new Date(2014, 6, 2, 19, 0),
   *   new Date(2014, 6, 2, 6, 50)
   * )
   * //=> 12
   */
  function differenceInHours (dirtyDateLeft, dirtyDateRight) {
    var diff = difference_in_milliseconds(dirtyDateLeft, dirtyDateRight) / MILLISECONDS_IN_HOUR$2;
    return diff > 0 ? Math.floor(diff) : Math.ceil(diff)
  }

  var difference_in_hours = differenceInHours;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Subtract the specified number of ISO week-numbering years from the given date.
   *
   * @description
   * Subtract the specified number of ISO week-numbering years from the given date.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of ISO week-numbering years to be subtracted
   * @returns {Date} the new date with the ISO week-numbering years subtracted
   *
   * @example
   * // Subtract 5 ISO week-numbering years from 1 September 2014:
   * var result = subISOYears(new Date(2014, 8, 1), 5)
   * //=> Mon Aug 31 2009 00:00:00
   */
  function subISOYears (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_iso_years(dirtyDate, -amount)
  }

  var sub_iso_years = subISOYears;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Get the number of full ISO week-numbering years between the given dates.
   *
   * @description
   * Get the number of full ISO week-numbering years between the given dates.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of full ISO week-numbering years
   *
   * @example
   * // How many full ISO week-numbering years are between 1 January 2010 and 1 January 2012?
   * var result = differenceInISOYears(
   *   new Date(2012, 0, 1),
   *   new Date(2010, 0, 1)
   * )
   * //=> 1
   */
  function differenceInISOYears (dirtyDateLeft, dirtyDateRight) {
    var dateLeft = parse_1(dirtyDateLeft);
    var dateRight = parse_1(dirtyDateRight);

    var sign = compare_asc(dateLeft, dateRight);
    var difference = Math.abs(difference_in_calendar_iso_years(dateLeft, dateRight));
    dateLeft = sub_iso_years(dateLeft, sign * difference);

    // Math.abs(diff in full ISO years - diff in calendar ISO years) === 1
    // if last calendar ISO year is not full
    // If so, result must be decreased by 1 in absolute value
    var isLastISOYearNotFull = compare_asc(dateLeft, dateRight) === -sign;
    return sign * (difference - isLastISOYearNotFull)
  }

  var difference_in_iso_years = differenceInISOYears;

  var MILLISECONDS_IN_MINUTE$6 = 60000;

  /**
   * @category Minute Helpers
   * @summary Get the number of minutes between the given dates.
   *
   * @description
   * Get the number of minutes between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of minutes
   *
   * @example
   * // How many minutes are between 2 July 2014 12:07:59 and 2 July 2014 12:20:00?
   * var result = differenceInMinutes(
   *   new Date(2014, 6, 2, 12, 20, 0),
   *   new Date(2014, 6, 2, 12, 7, 59)
   * )
   * //=> 12
   */
  function differenceInMinutes (dirtyDateLeft, dirtyDateRight) {
    var diff = difference_in_milliseconds(dirtyDateLeft, dirtyDateRight) / MILLISECONDS_IN_MINUTE$6;
    return diff > 0 ? Math.floor(diff) : Math.ceil(diff)
  }

  var difference_in_minutes = differenceInMinutes;

  /**
   * @category Month Helpers
   * @summary Get the number of full months between the given dates.
   *
   * @description
   * Get the number of full months between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of full months
   *
   * @example
   * // How many full months are between 31 January 2014 and 1 September 2014?
   * var result = differenceInMonths(
   *   new Date(2014, 8, 1),
   *   new Date(2014, 0, 31)
   * )
   * //=> 7
   */
  function differenceInMonths (dirtyDateLeft, dirtyDateRight) {
    var dateLeft = parse_1(dirtyDateLeft);
    var dateRight = parse_1(dirtyDateRight);

    var sign = compare_asc(dateLeft, dateRight);
    var difference = Math.abs(difference_in_calendar_months(dateLeft, dateRight));
    dateLeft.setMonth(dateLeft.getMonth() - sign * difference);

    // Math.abs(diff in full months - diff in calendar months) === 1 if last calendar month is not full
    // If so, result must be decreased by 1 in absolute value
    var isLastMonthNotFull = compare_asc(dateLeft, dateRight) === -sign;
    return sign * (difference - isLastMonthNotFull)
  }

  var difference_in_months = differenceInMonths;

  /**
   * @category Quarter Helpers
   * @summary Get the number of full quarters between the given dates.
   *
   * @description
   * Get the number of full quarters between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of full quarters
   *
   * @example
   * // How many full quarters are between 31 December 2013 and 2 July 2014?
   * var result = differenceInQuarters(
   *   new Date(2014, 6, 2),
   *   new Date(2013, 11, 31)
   * )
   * //=> 2
   */
  function differenceInQuarters (dirtyDateLeft, dirtyDateRight) {
    var diff = difference_in_months(dirtyDateLeft, dirtyDateRight) / 3;
    return diff > 0 ? Math.floor(diff) : Math.ceil(diff)
  }

  var difference_in_quarters = differenceInQuarters;

  /**
   * @category Second Helpers
   * @summary Get the number of seconds between the given dates.
   *
   * @description
   * Get the number of seconds between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of seconds
   *
   * @example
   * // How many seconds are between
   * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
   * var result = differenceInSeconds(
   *   new Date(2014, 6, 2, 12, 30, 20, 0),
   *   new Date(2014, 6, 2, 12, 30, 7, 999)
   * )
   * //=> 12
   */
  function differenceInSeconds (dirtyDateLeft, dirtyDateRight) {
    var diff = difference_in_milliseconds(dirtyDateLeft, dirtyDateRight) / 1000;
    return diff > 0 ? Math.floor(diff) : Math.ceil(diff)
  }

  var difference_in_seconds = differenceInSeconds;

  /**
   * @category Week Helpers
   * @summary Get the number of full weeks between the given dates.
   *
   * @description
   * Get the number of full weeks between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of full weeks
   *
   * @example
   * // How many full weeks are between 5 July 2014 and 20 July 2014?
   * var result = differenceInWeeks(
   *   new Date(2014, 6, 20),
   *   new Date(2014, 6, 5)
   * )
   * //=> 2
   */
  function differenceInWeeks (dirtyDateLeft, dirtyDateRight) {
    var diff = difference_in_days(dirtyDateLeft, dirtyDateRight) / 7;
    return diff > 0 ? Math.floor(diff) : Math.ceil(diff)
  }

  var difference_in_weeks = differenceInWeeks;

  /**
   * @category Year Helpers
   * @summary Get the number of full years between the given dates.
   *
   * @description
   * Get the number of full years between the given dates.
   *
   * @param {Date|String|Number} dateLeft - the later date
   * @param {Date|String|Number} dateRight - the earlier date
   * @returns {Number} the number of full years
   *
   * @example
   * // How many full years are between 31 December 2013 and 11 February 2015?
   * var result = differenceInYears(
   *   new Date(2015, 1, 11),
   *   new Date(2013, 11, 31)
   * )
   * //=> 1
   */
  function differenceInYears (dirtyDateLeft, dirtyDateRight) {
    var dateLeft = parse_1(dirtyDateLeft);
    var dateRight = parse_1(dirtyDateRight);

    var sign = compare_asc(dateLeft, dateRight);
    var difference = Math.abs(difference_in_calendar_years(dateLeft, dateRight));
    dateLeft.setFullYear(dateLeft.getFullYear() - sign * difference);

    // Math.abs(diff in full years - diff in calendar years) === 1 if last calendar year is not full
    // If so, result must be decreased by 1 in absolute value
    var isLastYearNotFull = compare_asc(dateLeft, dateRight) === -sign;
    return sign * (difference - isLastYearNotFull)
  }

  var difference_in_years = differenceInYears;

  function buildDistanceInWordsLocale () {
    var distanceInWordsLocale = {
      lessThanXSeconds: {
        one: 'less than a second',
        other: 'less than {{count}} seconds'
      },

      xSeconds: {
        one: '1 second',
        other: '{{count}} seconds'
      },

      halfAMinute: 'half a minute',

      lessThanXMinutes: {
        one: 'less than a minute',
        other: 'less than {{count}} minutes'
      },

      xMinutes: {
        one: '1 minute',
        other: '{{count}} minutes'
      },

      aboutXHours: {
        one: 'about 1 hour',
        other: 'about {{count}} hours'
      },

      xHours: {
        one: '1 hour',
        other: '{{count}} hours'
      },

      xDays: {
        one: '1 day',
        other: '{{count}} days'
      },

      aboutXMonths: {
        one: 'about 1 month',
        other: 'about {{count}} months'
      },

      xMonths: {
        one: '1 month',
        other: '{{count}} months'
      },

      aboutXYears: {
        one: 'about 1 year',
        other: 'about {{count}} years'
      },

      xYears: {
        one: '1 year',
        other: '{{count}} years'
      },

      overXYears: {
        one: 'over 1 year',
        other: 'over {{count}} years'
      },

      almostXYears: {
        one: 'almost 1 year',
        other: 'almost {{count}} years'
      }
    };

    function localize (token, count, options) {
      options = options || {};

      var result;
      if (typeof distanceInWordsLocale[token] === 'string') {
        result = distanceInWordsLocale[token];
      } else if (count === 1) {
        result = distanceInWordsLocale[token].one;
      } else {
        result = distanceInWordsLocale[token].other.replace('{{count}}', count);
      }

      if (options.addSuffix) {
        if (options.comparison > 0) {
          return 'in ' + result
        } else {
          return result + ' ago'
        }
      }

      return result
    }

    return {
      localize: localize
    }
  }

  var build_distance_in_words_locale = buildDistanceInWordsLocale;

  var commonFormatterKeys = [
    'M', 'MM', 'Q', 'D', 'DD', 'DDD', 'DDDD', 'd',
    'E', 'W', 'WW', 'YY', 'YYYY', 'GG', 'GGGG',
    'H', 'HH', 'h', 'hh', 'm', 'mm',
    's', 'ss', 'S', 'SS', 'SSS',
    'Z', 'ZZ', 'X', 'x'
  ];

  function buildFormattingTokensRegExp (formatters) {
    var formatterKeys = [];
    for (var key in formatters) {
      if (formatters.hasOwnProperty(key)) {
        formatterKeys.push(key);
      }
    }

    var formattingTokens = commonFormatterKeys
      .concat(formatterKeys)
      .sort()
      .reverse();
    var formattingTokensRegExp = new RegExp(
      '(\\[[^\\[]*\\])|(\\\\)?' + '(' + formattingTokens.join('|') + '|.)', 'g'
    );

    return formattingTokensRegExp
  }

  var build_formatting_tokens_reg_exp = buildFormattingTokensRegExp;

  function buildFormatLocale () {
    // Note: in English, the names of days of the week and months are capitalized.
    // If you are making a new locale based on this one, check if the same is true for the language you're working on.
    // Generally, formatted dates should look like they are in the middle of a sentence,
    // e.g. in Spanish language the weekdays and months should be in the lowercase.
    var months3char = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var weekdays2char = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    var weekdays3char = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var weekdaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var meridiemUppercase = ['AM', 'PM'];
    var meridiemLowercase = ['am', 'pm'];
    var meridiemFull = ['a.m.', 'p.m.'];

    var formatters = {
      // Month: Jan, Feb, ..., Dec
      'MMM': function (date) {
        return months3char[date.getMonth()]
      },

      // Month: January, February, ..., December
      'MMMM': function (date) {
        return monthsFull[date.getMonth()]
      },

      // Day of week: Su, Mo, ..., Sa
      'dd': function (date) {
        return weekdays2char[date.getDay()]
      },

      // Day of week: Sun, Mon, ..., Sat
      'ddd': function (date) {
        return weekdays3char[date.getDay()]
      },

      // Day of week: Sunday, Monday, ..., Saturday
      'dddd': function (date) {
        return weekdaysFull[date.getDay()]
      },

      // AM, PM
      'A': function (date) {
        return (date.getHours() / 12) >= 1 ? meridiemUppercase[1] : meridiemUppercase[0]
      },

      // am, pm
      'a': function (date) {
        return (date.getHours() / 12) >= 1 ? meridiemLowercase[1] : meridiemLowercase[0]
      },

      // a.m., p.m.
      'aa': function (date) {
        return (date.getHours() / 12) >= 1 ? meridiemFull[1] : meridiemFull[0]
      }
    };

    // Generate ordinal version of formatters: M -> Mo, D -> Do, etc.
    var ordinalFormatters = ['M', 'D', 'DDD', 'd', 'Q', 'W'];
    ordinalFormatters.forEach(function (formatterToken) {
      formatters[formatterToken + 'o'] = function (date, formatters) {
        return ordinal(formatters[formatterToken](date))
      };
    });

    return {
      formatters: formatters,
      formattingTokensRegExp: build_formatting_tokens_reg_exp(formatters)
    }
  }

  function ordinal (number) {
    var rem100 = number % 100;
    if (rem100 > 20 || rem100 < 10) {
      switch (rem100 % 10) {
        case 1:
          return number + 'st'
        case 2:
          return number + 'nd'
        case 3:
          return number + 'rd'
      }
    }
    return number + 'th'
  }

  var build_format_locale = buildFormatLocale;

  /**
   * @category Locales
   * @summary English locale.
   */
  var en = {
    distanceInWords: build_distance_in_words_locale(),
    format: build_format_locale()
  };

  var MINUTES_IN_DAY = 1440;
  var MINUTES_IN_ALMOST_TWO_DAYS = 2520;
  var MINUTES_IN_MONTH = 43200;
  var MINUTES_IN_TWO_MONTHS = 86400;

  /**
   * @category Common Helpers
   * @summary Return the distance between the given dates in words.
   *
   * @description
   * Return the distance between the given dates in words.
   *
   * | Distance between dates                                            | Result              |
   * |-------------------------------------------------------------------|---------------------|
   * | 0 ... 30 secs                                                     | less than a minute  |
   * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
   * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
   * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
   * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
   * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
   * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
   * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
   * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
   * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
   * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
   * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
   * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
   * | N yrs ... N yrs 3 months                                          | about N years       |
   * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
   * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
   *
   * With `options.includeSeconds == true`:
   * | Distance between dates | Result               |
   * |------------------------|----------------------|
   * | 0 secs ... 5 secs      | less than 5 seconds  |
   * | 5 secs ... 10 secs     | less than 10 seconds |
   * | 10 secs ... 20 secs    | less than 20 seconds |
   * | 20 secs ... 40 secs    | half a minute        |
   * | 40 secs ... 60 secs    | less than a minute   |
   * | 60 secs ... 90 secs    | 1 minute             |
   *
   * @param {Date|String|Number} dateToCompare - the date to compare with
   * @param {Date|String|Number} date - the other date
   * @param {Object} [options] - the object with options
   * @param {Boolean} [options.includeSeconds=false] - distances less than a minute are more detailed
   * @param {Boolean} [options.addSuffix=false] - result indicates if the second date is earlier or later than the first
   * @param {Object} [options.locale=enLocale] - the locale object
   * @returns {String} the distance in words
   *
   * @example
   * // What is the distance between 2 July 2014 and 1 January 2015?
   * var result = distanceInWords(
   *   new Date(2014, 6, 2),
   *   new Date(2015, 0, 1)
   * )
   * //=> '6 months'
   *
   * @example
   * // What is the distance between 1 January 2015 00:00:15
   * // and 1 January 2015 00:00:00, including seconds?
   * var result = distanceInWords(
   *   new Date(2015, 0, 1, 0, 0, 15),
   *   new Date(2015, 0, 1, 0, 0, 0),
   *   {includeSeconds: true}
   * )
   * //=> 'less than 20 seconds'
   *
   * @example
   * // What is the distance from 1 January 2016
   * // to 1 January 2015, with a suffix?
   * var result = distanceInWords(
   *   new Date(2016, 0, 1),
   *   new Date(2015, 0, 1),
   *   {addSuffix: true}
   * )
   * //=> 'about 1 year ago'
   *
   * @example
   * // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
   * var eoLocale = require('date-fns/locale/eo')
   * var result = distanceInWords(
   *   new Date(2016, 7, 1),
   *   new Date(2015, 0, 1),
   *   {locale: eoLocale}
   * )
   * //=> 'pli ol 1 jaro'
   */
  function distanceInWords (dirtyDateToCompare, dirtyDate, dirtyOptions) {
    var options = dirtyOptions || {};

    var comparison = compare_desc(dirtyDateToCompare, dirtyDate);

    var locale = options.locale;
    var localize = en.distanceInWords.localize;
    if (locale && locale.distanceInWords && locale.distanceInWords.localize) {
      localize = locale.distanceInWords.localize;
    }

    var localizeOptions = {
      addSuffix: Boolean(options.addSuffix),
      comparison: comparison
    };

    var dateLeft, dateRight;
    if (comparison > 0) {
      dateLeft = parse_1(dirtyDateToCompare);
      dateRight = parse_1(dirtyDate);
    } else {
      dateLeft = parse_1(dirtyDate);
      dateRight = parse_1(dirtyDateToCompare);
    }

    var seconds = difference_in_seconds(dateRight, dateLeft);
    var offset = dateRight.getTimezoneOffset() - dateLeft.getTimezoneOffset();
    var minutes = Math.round(seconds / 60) - offset;
    var months;

    // 0 up to 2 mins
    if (minutes < 2) {
      if (options.includeSeconds) {
        if (seconds < 5) {
          return localize('lessThanXSeconds', 5, localizeOptions)
        } else if (seconds < 10) {
          return localize('lessThanXSeconds', 10, localizeOptions)
        } else if (seconds < 20) {
          return localize('lessThanXSeconds', 20, localizeOptions)
        } else if (seconds < 40) {
          return localize('halfAMinute', null, localizeOptions)
        } else if (seconds < 60) {
          return localize('lessThanXMinutes', 1, localizeOptions)
        } else {
          return localize('xMinutes', 1, localizeOptions)
        }
      } else {
        if (minutes === 0) {
          return localize('lessThanXMinutes', 1, localizeOptions)
        } else {
          return localize('xMinutes', minutes, localizeOptions)
        }
      }

    // 2 mins up to 0.75 hrs
    } else if (minutes < 45) {
      return localize('xMinutes', minutes, localizeOptions)

    // 0.75 hrs up to 1.5 hrs
    } else if (minutes < 90) {
      return localize('aboutXHours', 1, localizeOptions)

    // 1.5 hrs up to 24 hrs
    } else if (minutes < MINUTES_IN_DAY) {
      var hours = Math.round(minutes / 60);
      return localize('aboutXHours', hours, localizeOptions)

    // 1 day up to 1.75 days
    } else if (minutes < MINUTES_IN_ALMOST_TWO_DAYS) {
      return localize('xDays', 1, localizeOptions)

    // 1.75 days up to 30 days
    } else if (minutes < MINUTES_IN_MONTH) {
      var days = Math.round(minutes / MINUTES_IN_DAY);
      return localize('xDays', days, localizeOptions)

    // 1 month up to 2 months
    } else if (minutes < MINUTES_IN_TWO_MONTHS) {
      months = Math.round(minutes / MINUTES_IN_MONTH);
      return localize('aboutXMonths', months, localizeOptions)
    }

    months = difference_in_months(dateRight, dateLeft);

    // 2 months up to 12 months
    if (months < 12) {
      var nearestMonth = Math.round(minutes / MINUTES_IN_MONTH);
      return localize('xMonths', nearestMonth, localizeOptions)

    // 1 year up to max Date
    } else {
      var monthsSinceStartOfYear = months % 12;
      var years = Math.floor(months / 12);

      // N years up to 1 years 3 months
      if (monthsSinceStartOfYear < 3) {
        return localize('aboutXYears', years, localizeOptions)

      // N years 3 months up to N years 9 months
      } else if (monthsSinceStartOfYear < 9) {
        return localize('overXYears', years, localizeOptions)

      // N years 9 months up to N year 12 months
      } else {
        return localize('almostXYears', years + 1, localizeOptions)
      }
    }
  }

  var distance_in_words = distanceInWords;

  var MINUTES_IN_DAY$1 = 1440;
  var MINUTES_IN_MONTH$1 = 43200;
  var MINUTES_IN_YEAR = 525600;

  /**
   * @category Common Helpers
   * @summary Return the distance between the given dates in words.
   *
   * @description
   * Return the distance between the given dates in words, using strict units.
   * This is like `distanceInWords`, but does not use helpers like 'almost', 'over',
   * 'less than' and the like.
   *
   * | Distance between dates | Result              |
   * |------------------------|---------------------|
   * | 0 ... 59 secs          | [0..59] seconds     |
   * | 1 ... 59 mins          | [1..59] minutes     |
   * | 1 ... 23 hrs           | [1..23] hours       |
   * | 1 ... 29 days          | [1..29] days        |
   * | 1 ... 11 months        | [1..11] months      |
   * | 1 ... N years          | [1..N]  years       |
   *
   * @param {Date|String|Number} dateToCompare - the date to compare with
   * @param {Date|String|Number} date - the other date
   * @param {Object} [options] - the object with options
   * @param {Boolean} [options.addSuffix=false] - result indicates if the second date is earlier or later than the first
   * @param {'s'|'m'|'h'|'d'|'M'|'Y'} [options.unit] - if specified, will force a unit
   * @param {'floor'|'ceil'|'round'} [options.partialMethod='floor'] - which way to round partial units
   * @param {Object} [options.locale=enLocale] - the locale object
   * @returns {String} the distance in words
   *
   * @example
   * // What is the distance between 2 July 2014 and 1 January 2015?
   * var result = distanceInWordsStrict(
   *   new Date(2014, 6, 2),
   *   new Date(2015, 0, 2)
   * )
   * //=> '6 months'
   *
   * @example
   * // What is the distance between 1 January 2015 00:00:15
   * // and 1 January 2015 00:00:00?
   * var result = distanceInWordsStrict(
   *   new Date(2015, 0, 1, 0, 0, 15),
   *   new Date(2015, 0, 1, 0, 0, 0),
   * )
   * //=> '15 seconds'
   *
   * @example
   * // What is the distance from 1 January 2016
   * // to 1 January 2015, with a suffix?
   * var result = distanceInWordsStrict(
   *   new Date(2016, 0, 1),
   *   new Date(2015, 0, 1),
   *   {addSuffix: true}
   * )
   * //=> '1 year ago'
   *
   * @example
   * // What is the distance from 1 January 2016
   * // to 1 January 2015, in minutes?
   * var result = distanceInWordsStrict(
   *   new Date(2016, 0, 1),
   *   new Date(2015, 0, 1),
   *   {unit: 'm'}
   * )
   * //=> '525600 minutes'
   *
   * @example
   * // What is the distance from 1 January 2016
   * // to 28 January 2015, in months, rounded up?
   * var result = distanceInWordsStrict(
   *   new Date(2015, 0, 28),
   *   new Date(2015, 0, 1),
   *   {unit: 'M', partialMethod: 'ceil'}
   * )
   * //=> '1 month'
   *
   * @example
   * // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
   * var eoLocale = require('date-fns/locale/eo')
   * var result = distanceInWordsStrict(
   *   new Date(2016, 7, 1),
   *   new Date(2015, 0, 1),
   *   {locale: eoLocale}
   * )
   * //=> '1 jaro'
   */
  function distanceInWordsStrict (dirtyDateToCompare, dirtyDate, dirtyOptions) {
    var options = dirtyOptions || {};

    var comparison = compare_desc(dirtyDateToCompare, dirtyDate);

    var locale = options.locale;
    var localize = en.distanceInWords.localize;
    if (locale && locale.distanceInWords && locale.distanceInWords.localize) {
      localize = locale.distanceInWords.localize;
    }

    var localizeOptions = {
      addSuffix: Boolean(options.addSuffix),
      comparison: comparison
    };

    var dateLeft, dateRight;
    if (comparison > 0) {
      dateLeft = parse_1(dirtyDateToCompare);
      dateRight = parse_1(dirtyDate);
    } else {
      dateLeft = parse_1(dirtyDate);
      dateRight = parse_1(dirtyDateToCompare);
    }

    var unit;
    var mathPartial = Math[options.partialMethod ? String(options.partialMethod) : 'floor'];
    var seconds = difference_in_seconds(dateRight, dateLeft);
    var offset = dateRight.getTimezoneOffset() - dateLeft.getTimezoneOffset();
    var minutes = mathPartial(seconds / 60) - offset;
    var hours, days, months, years;

    if (options.unit) {
      unit = String(options.unit);
    } else {
      if (minutes < 1) {
        unit = 's';
      } else if (minutes < 60) {
        unit = 'm';
      } else if (minutes < MINUTES_IN_DAY$1) {
        unit = 'h';
      } else if (minutes < MINUTES_IN_MONTH$1) {
        unit = 'd';
      } else if (minutes < MINUTES_IN_YEAR) {
        unit = 'M';
      } else {
        unit = 'Y';
      }
    }

    // 0 up to 60 seconds
    if (unit === 's') {
      return localize('xSeconds', seconds, localizeOptions)

    // 1 up to 60 mins
    } else if (unit === 'm') {
      return localize('xMinutes', minutes, localizeOptions)

    // 1 up to 24 hours
    } else if (unit === 'h') {
      hours = mathPartial(minutes / 60);
      return localize('xHours', hours, localizeOptions)

    // 1 up to 30 days
    } else if (unit === 'd') {
      days = mathPartial(minutes / MINUTES_IN_DAY$1);
      return localize('xDays', days, localizeOptions)

    // 1 up to 12 months
    } else if (unit === 'M') {
      months = mathPartial(minutes / MINUTES_IN_MONTH$1);
      return localize('xMonths', months, localizeOptions)

    // 1 year up to max Date
    } else if (unit === 'Y') {
      years = mathPartial(minutes / MINUTES_IN_YEAR);
      return localize('xYears', years, localizeOptions)
    }

    throw new Error('Unknown unit: ' + unit)
  }

  var distance_in_words_strict = distanceInWordsStrict;

  /**
   * @category Common Helpers
   * @summary Return the distance between the given date and now in words.
   *
   * @description
   * Return the distance between the given date and now in words.
   *
   * | Distance to now                                                   | Result              |
   * |-------------------------------------------------------------------|---------------------|
   * | 0 ... 30 secs                                                     | less than a minute  |
   * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
   * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
   * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
   * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
   * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
   * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
   * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
   * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
   * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
   * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
   * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
   * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
   * | N yrs ... N yrs 3 months                                          | about N years       |
   * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
   * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
   *
   * With `options.includeSeconds == true`:
   * | Distance to now     | Result               |
   * |---------------------|----------------------|
   * | 0 secs ... 5 secs   | less than 5 seconds  |
   * | 5 secs ... 10 secs  | less than 10 seconds |
   * | 10 secs ... 20 secs | less than 20 seconds |
   * | 20 secs ... 40 secs | half a minute        |
   * | 40 secs ... 60 secs | less than a minute   |
   * | 60 secs ... 90 secs | 1 minute             |
   *
   * @param {Date|String|Number} date - the given date
   * @param {Object} [options] - the object with options
   * @param {Boolean} [options.includeSeconds=false] - distances less than a minute are more detailed
   * @param {Boolean} [options.addSuffix=false] - result specifies if the second date is earlier or later than the first
   * @param {Object} [options.locale=enLocale] - the locale object
   * @returns {String} the distance in words
   *
   * @example
   * // If today is 1 January 2015, what is the distance to 2 July 2014?
   * var result = distanceInWordsToNow(
   *   new Date(2014, 6, 2)
   * )
   * //=> '6 months'
   *
   * @example
   * // If now is 1 January 2015 00:00:00,
   * // what is the distance to 1 January 2015 00:00:15, including seconds?
   * var result = distanceInWordsToNow(
   *   new Date(2015, 0, 1, 0, 0, 15),
   *   {includeSeconds: true}
   * )
   * //=> 'less than 20 seconds'
   *
   * @example
   * // If today is 1 January 2015,
   * // what is the distance to 1 January 2016, with a suffix?
   * var result = distanceInWordsToNow(
   *   new Date(2016, 0, 1),
   *   {addSuffix: true}
   * )
   * //=> 'in about 1 year'
   *
   * @example
   * // If today is 1 January 2015,
   * // what is the distance to 1 August 2016 in Esperanto?
   * var eoLocale = require('date-fns/locale/eo')
   * var result = distanceInWordsToNow(
   *   new Date(2016, 7, 1),
   *   {locale: eoLocale}
   * )
   * //=> 'pli ol 1 jaro'
   */
  function distanceInWordsToNow (dirtyDate, dirtyOptions) {
    return distance_in_words(Date.now(), dirtyDate, dirtyOptions)
  }

  var distance_in_words_to_now = distanceInWordsToNow;

  /**
   * @category Day Helpers
   * @summary Return the array of dates within the specified range.
   *
   * @description
   * Return the array of dates within the specified range.
   *
   * @param {Date|String|Number} startDate - the first date
   * @param {Date|String|Number} endDate - the last date
   * @param {Number} [step=1] - the step between each day
   * @returns {Date[]} the array with starts of days from the day of startDate to the day of endDate
   * @throws {Error} startDate cannot be after endDate
   *
   * @example
   * // Each day between 6 October 2014 and 10 October 2014:
   * var result = eachDay(
   *   new Date(2014, 9, 6),
   *   new Date(2014, 9, 10)
   * )
   * //=> [
   * //   Mon Oct 06 2014 00:00:00,
   * //   Tue Oct 07 2014 00:00:00,
   * //   Wed Oct 08 2014 00:00:00,
   * //   Thu Oct 09 2014 00:00:00,
   * //   Fri Oct 10 2014 00:00:00
   * // ]
   */
  function eachDay (dirtyStartDate, dirtyEndDate, dirtyStep) {
    var startDate = parse_1(dirtyStartDate);
    var endDate = parse_1(dirtyEndDate);
    var step = dirtyStep !== undefined ? dirtyStep : 1;

    var endTime = endDate.getTime();

    if (startDate.getTime() > endTime) {
      throw new Error('The first date cannot be after the second date')
    }

    var dates = [];

    var currentDate = startDate;
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate.getTime() <= endTime) {
      dates.push(parse_1(currentDate));
      currentDate.setDate(currentDate.getDate() + step);
    }

    return dates
  }

  var each_day = eachDay;

  /**
   * @category Day Helpers
   * @summary Return the end of a day for the given date.
   *
   * @description
   * Return the end of a day for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the end of a day
   *
   * @example
   * // The end of a day for 2 September 2014 11:55:00:
   * var result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Sep 02 2014 23:59:59.999
   */
  function endOfDay (dirtyDate) {
    var date = parse_1(dirtyDate);
    date.setHours(23, 59, 59, 999);
    return date
  }

  var end_of_day = endOfDay;

  /**
   * @category Hour Helpers
   * @summary Return the end of an hour for the given date.
   *
   * @description
   * Return the end of an hour for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the end of an hour
   *
   * @example
   * // The end of an hour for 2 September 2014 11:55:00:
   * var result = endOfHour(new Date(2014, 8, 2, 11, 55))
   * //=> Tue Sep 02 2014 11:59:59.999
   */
  function endOfHour (dirtyDate) {
    var date = parse_1(dirtyDate);
    date.setMinutes(59, 59, 999);
    return date
  }

  var end_of_hour = endOfHour;

  /**
   * @category Week Helpers
   * @summary Return the end of a week for the given date.
   *
   * @description
   * Return the end of a week for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @param {Object} [options] - the object with options
   * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
   * @returns {Date} the end of a week
   *
   * @example
   * // The end of a week for 2 September 2014 11:55:00:
   * var result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Sat Sep 06 2014 23:59:59.999
   *
   * @example
   * // If the week starts on Monday, the end of the week for 2 September 2014 11:55:00:
   * var result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0), {weekStartsOn: 1})
   * //=> Sun Sep 07 2014 23:59:59.999
   */
  function endOfWeek (dirtyDate, dirtyOptions) {
    var weekStartsOn = dirtyOptions ? (Number(dirtyOptions.weekStartsOn) || 0) : 0;

    var date = parse_1(dirtyDate);
    var day = date.getDay();
    var diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);

    date.setDate(date.getDate() + diff);
    date.setHours(23, 59, 59, 999);
    return date
  }

  var end_of_week = endOfWeek;

  /**
   * @category ISO Week Helpers
   * @summary Return the end of an ISO week for the given date.
   *
   * @description
   * Return the end of an ISO week for the given date.
   * The result will be in the local timezone.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the end of an ISO week
   *
   * @example
   * // The end of an ISO week for 2 September 2014 11:55:00:
   * var result = endOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Sun Sep 07 2014 23:59:59.999
   */
  function endOfISOWeek (dirtyDate) {
    return end_of_week(dirtyDate, {weekStartsOn: 1})
  }

  var end_of_iso_week = endOfISOWeek;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Return the end of an ISO week-numbering year for the given date.
   *
   * @description
   * Return the end of an ISO week-numbering year,
   * which always starts 3 days before the year's first Thursday.
   * The result will be in the local timezone.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the end of an ISO week-numbering year
   *
   * @example
   * // The end of an ISO week-numbering year for 2 July 2005:
   * var result = endOfISOYear(new Date(2005, 6, 2))
   * //=> Sun Jan 01 2006 23:59:59.999
   */
  function endOfISOYear (dirtyDate) {
    var year = get_iso_year(dirtyDate);
    var fourthOfJanuaryOfNextYear = new Date(0);
    fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
    fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
    var date = start_of_iso_week(fourthOfJanuaryOfNextYear);
    date.setMilliseconds(date.getMilliseconds() - 1);
    return date
  }

  var end_of_iso_year = endOfISOYear;

  /**
   * @category Minute Helpers
   * @summary Return the end of a minute for the given date.
   *
   * @description
   * Return the end of a minute for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the end of a minute
   *
   * @example
   * // The end of a minute for 1 December 2014 22:15:45.400:
   * var result = endOfMinute(new Date(2014, 11, 1, 22, 15, 45, 400))
   * //=> Mon Dec 01 2014 22:15:59.999
   */
  function endOfMinute (dirtyDate) {
    var date = parse_1(dirtyDate);
    date.setSeconds(59, 999);
    return date
  }

  var end_of_minute = endOfMinute;

  /**
   * @category Month Helpers
   * @summary Return the end of a month for the given date.
   *
   * @description
   * Return the end of a month for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the end of a month
   *
   * @example
   * // The end of a month for 2 September 2014 11:55:00:
   * var result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Sep 30 2014 23:59:59.999
   */
  function endOfMonth (dirtyDate) {
    var date = parse_1(dirtyDate);
    var month = date.getMonth();
    date.setFullYear(date.getFullYear(), month + 1, 0);
    date.setHours(23, 59, 59, 999);
    return date
  }

  var end_of_month = endOfMonth;

  /**
   * @category Quarter Helpers
   * @summary Return the end of a year quarter for the given date.
   *
   * @description
   * Return the end of a year quarter for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the end of a quarter
   *
   * @example
   * // The end of a quarter for 2 September 2014 11:55:00:
   * var result = endOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Sep 30 2014 23:59:59.999
   */
  function endOfQuarter (dirtyDate) {
    var date = parse_1(dirtyDate);
    var currentMonth = date.getMonth();
    var month = currentMonth - currentMonth % 3 + 3;
    date.setMonth(month, 0);
    date.setHours(23, 59, 59, 999);
    return date
  }

  var end_of_quarter = endOfQuarter;

  /**
   * @category Second Helpers
   * @summary Return the end of a second for the given date.
   *
   * @description
   * Return the end of a second for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the end of a second
   *
   * @example
   * // The end of a second for 1 December 2014 22:15:45.400:
   * var result = endOfSecond(new Date(2014, 11, 1, 22, 15, 45, 400))
   * //=> Mon Dec 01 2014 22:15:45.999
   */
  function endOfSecond (dirtyDate) {
    var date = parse_1(dirtyDate);
    date.setMilliseconds(999);
    return date
  }

  var end_of_second = endOfSecond;

  /**
   * @category Day Helpers
   * @summary Return the end of today.
   *
   * @description
   * Return the end of today.
   *
   * @returns {Date} the end of today
   *
   * @example
   * // If today is 6 October 2014:
   * var result = endOfToday()
   * //=> Mon Oct 6 2014 23:59:59.999
   */
  function endOfToday () {
    return end_of_day(new Date())
  }

  var end_of_today = endOfToday;

  /**
   * @category Day Helpers
   * @summary Return the end of tomorrow.
   *
   * @description
   * Return the end of tomorrow.
   *
   * @returns {Date} the end of tomorrow
   *
   * @example
   * // If today is 6 October 2014:
   * var result = endOfTomorrow()
   * //=> Tue Oct 7 2014 23:59:59.999
   */
  function endOfTomorrow () {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var day = now.getDate();

    var date = new Date(0);
    date.setFullYear(year, month, day + 1);
    date.setHours(23, 59, 59, 999);
    return date
  }

  var end_of_tomorrow = endOfTomorrow;

  /**
   * @category Year Helpers
   * @summary Return the end of a year for the given date.
   *
   * @description
   * Return the end of a year for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the end of a year
   *
   * @example
   * // The end of a year for 2 September 2014 11:55:00:
   * var result = endOfYear(new Date(2014, 8, 2, 11, 55, 00))
   * //=> Wed Dec 31 2014 23:59:59.999
   */
  function endOfYear (dirtyDate) {
    var date = parse_1(dirtyDate);
    var year = date.getFullYear();
    date.setFullYear(year + 1, 0, 0);
    date.setHours(23, 59, 59, 999);
    return date
  }

  var end_of_year = endOfYear;

  /**
   * @category Day Helpers
   * @summary Return the end of yesterday.
   *
   * @description
   * Return the end of yesterday.
   *
   * @returns {Date} the end of yesterday
   *
   * @example
   * // If today is 6 October 2014:
   * var result = endOfYesterday()
   * //=> Sun Oct 5 2014 23:59:59.999
   */
  function endOfYesterday () {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var day = now.getDate();

    var date = new Date(0);
    date.setFullYear(year, month, day - 1);
    date.setHours(23, 59, 59, 999);
    return date
  }

  var end_of_yesterday = endOfYesterday;

  /**
   * @category Year Helpers
   * @summary Return the start of a year for the given date.
   *
   * @description
   * Return the start of a year for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of a year
   *
   * @example
   * // The start of a year for 2 September 2014 11:55:00:
   * var result = startOfYear(new Date(2014, 8, 2, 11, 55, 00))
   * //=> Wed Jan 01 2014 00:00:00
   */
  function startOfYear (dirtyDate) {
    var cleanDate = parse_1(dirtyDate);
    var date = new Date(0);
    date.setFullYear(cleanDate.getFullYear(), 0, 1);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var start_of_year = startOfYear;

  /**
   * @category Day Helpers
   * @summary Get the day of the year of the given date.
   *
   * @description
   * Get the day of the year of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the day of year
   *
   * @example
   * // Which day of the year is 2 July 2014?
   * var result = getDayOfYear(new Date(2014, 6, 2))
   * //=> 183
   */
  function getDayOfYear (dirtyDate) {
    var date = parse_1(dirtyDate);
    var diff = difference_in_calendar_days(date, start_of_year(date));
    var dayOfYear = diff + 1;
    return dayOfYear
  }

  var get_day_of_year = getDayOfYear;

  var MILLISECONDS_IN_WEEK$2 = 604800000;

  /**
   * @category ISO Week Helpers
   * @summary Get the ISO week of the given date.
   *
   * @description
   * Get the ISO week of the given date.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the ISO week
   *
   * @example
   * // Which week of the ISO-week numbering year is 2 January 2005?
   * var result = getISOWeek(new Date(2005, 0, 2))
   * //=> 53
   */
  function getISOWeek (dirtyDate) {
    var date = parse_1(dirtyDate);
    var diff = start_of_iso_week(date).getTime() - start_of_iso_year(date).getTime();

    // Round the number of days to the nearest integer
    // because the number of milliseconds in a week is not constant
    // (e.g. it's different in the week of the daylight saving time clock shift)
    return Math.round(diff / MILLISECONDS_IN_WEEK$2) + 1
  }

  var get_iso_week = getISOWeek;

  /**
   * @category Common Helpers
   * @summary Is the given date valid?
   *
   * @description
   * Returns false if argument is Invalid Date and true otherwise.
   * Invalid Date is a Date, whose time value is NaN.
   *
   * Time value of Date: http://es5.github.io/#x15.9.1.1
   *
   * @param {Date} date - the date to check
   * @returns {Boolean} the date is valid
   * @throws {TypeError} argument must be an instance of Date
   *
   * @example
   * // For the valid date:
   * var result = isValid(new Date(2014, 1, 31))
   * //=> true
   *
   * @example
   * // For the invalid date:
   * var result = isValid(new Date(''))
   * //=> false
   */
  function isValid (dirtyDate) {
    if (is_date(dirtyDate)) {
      return !isNaN(dirtyDate)
    } else {
      throw new TypeError(toString.call(dirtyDate) + ' is not an instance of Date')
    }
  }

  var is_valid = isValid;

  /**
   * @category Common Helpers
   * @summary Format the date.
   *
   * @description
   * Return the formatted date string in the given format.
   *
   * Accepted tokens:
   * | Unit                    | Token | Result examples                  |
   * |-------------------------|-------|----------------------------------|
   * | Month                   | M     | 1, 2, ..., 12                    |
   * |                         | Mo    | 1st, 2nd, ..., 12th              |
   * |                         | MM    | 01, 02, ..., 12                  |
   * |                         | MMM   | Jan, Feb, ..., Dec               |
   * |                         | MMMM  | January, February, ..., December |
   * | Quarter                 | Q     | 1, 2, 3, 4                       |
   * |                         | Qo    | 1st, 2nd, 3rd, 4th               |
   * | Day of month            | D     | 1, 2, ..., 31                    |
   * |                         | Do    | 1st, 2nd, ..., 31st              |
   * |                         | DD    | 01, 02, ..., 31                  |
   * | Day of year             | DDD   | 1, 2, ..., 366                   |
   * |                         | DDDo  | 1st, 2nd, ..., 366th             |
   * |                         | DDDD  | 001, 002, ..., 366               |
   * | Day of week             | d     | 0, 1, ..., 6                     |
   * |                         | do    | 0th, 1st, ..., 6th               |
   * |                         | dd    | Su, Mo, ..., Sa                  |
   * |                         | ddd   | Sun, Mon, ..., Sat               |
   * |                         | dddd  | Sunday, Monday, ..., Saturday    |
   * | Day of ISO week         | E     | 1, 2, ..., 7                     |
   * | ISO week                | W     | 1, 2, ..., 53                    |
   * |                         | Wo    | 1st, 2nd, ..., 53rd              |
   * |                         | WW    | 01, 02, ..., 53                  |
   * | Year                    | YY    | 00, 01, ..., 99                  |
   * |                         | YYYY  | 1900, 1901, ..., 2099            |
   * | ISO week-numbering year | GG    | 00, 01, ..., 99                  |
   * |                         | GGGG  | 1900, 1901, ..., 2099            |
   * | AM/PM                   | A     | AM, PM                           |
   * |                         | a     | am, pm                           |
   * |                         | aa    | a.m., p.m.                       |
   * | Hour                    | H     | 0, 1, ... 23                     |
   * |                         | HH    | 00, 01, ... 23                   |
   * |                         | h     | 1, 2, ..., 12                    |
   * |                         | hh    | 01, 02, ..., 12                  |
   * | Minute                  | m     | 0, 1, ..., 59                    |
   * |                         | mm    | 00, 01, ..., 59                  |
   * | Second                  | s     | 0, 1, ..., 59                    |
   * |                         | ss    | 00, 01, ..., 59                  |
   * | 1/10 of second          | S     | 0, 1, ..., 9                     |
   * | 1/100 of second         | SS    | 00, 01, ..., 99                  |
   * | Millisecond             | SSS   | 000, 001, ..., 999               |
   * | Timezone                | Z     | -01:00, +00:00, ... +12:00       |
   * |                         | ZZ    | -0100, +0000, ..., +1200         |
   * | Seconds timestamp       | X     | 512969520                        |
   * | Milliseconds timestamp  | x     | 512969520900                     |
   *
   * The characters wrapped in square brackets are escaped.
   *
   * The result may vary by locale.
   *
   * @param {Date|String|Number} date - the original date
   * @param {String} [format='YYYY-MM-DDTHH:mm:ss.SSSZ'] - the string of tokens
   * @param {Object} [options] - the object with options
   * @param {Object} [options.locale=enLocale] - the locale object
   * @returns {String} the formatted date string
   *
   * @example
   * // Represent 11 February 2014 in middle-endian format:
   * var result = format(
   *   new Date(2014, 1, 11),
   *   'MM/DD/YYYY'
   * )
   * //=> '02/11/2014'
   *
   * @example
   * // Represent 2 July 2014 in Esperanto:
   * var eoLocale = require('date-fns/locale/eo')
   * var result = format(
   *   new Date(2014, 6, 2),
   *   'Do [de] MMMM YYYY',
   *   {locale: eoLocale}
   * )
   * //=> '2-a de julio 2014'
   */
  function format (dirtyDate, dirtyFormatStr, dirtyOptions) {
    var formatStr = dirtyFormatStr ? String(dirtyFormatStr) : 'YYYY-MM-DDTHH:mm:ss.SSSZ';
    var options = dirtyOptions || {};

    var locale = options.locale;
    var localeFormatters = en.format.formatters;
    var formattingTokensRegExp = en.format.formattingTokensRegExp;
    if (locale && locale.format && locale.format.formatters) {
      localeFormatters = locale.format.formatters;

      if (locale.format.formattingTokensRegExp) {
        formattingTokensRegExp = locale.format.formattingTokensRegExp;
      }
    }

    var date = parse_1(dirtyDate);

    if (!is_valid(date)) {
      return 'Invalid Date'
    }

    var formatFn = buildFormatFn(formatStr, localeFormatters, formattingTokensRegExp);

    return formatFn(date)
  }

  var formatters = {
    // Month: 1, 2, ..., 12
    'M': function (date) {
      return date.getMonth() + 1
    },

    // Month: 01, 02, ..., 12
    'MM': function (date) {
      return addLeadingZeros(date.getMonth() + 1, 2)
    },

    // Quarter: 1, 2, 3, 4
    'Q': function (date) {
      return Math.ceil((date.getMonth() + 1) / 3)
    },

    // Day of month: 1, 2, ..., 31
    'D': function (date) {
      return date.getDate()
    },

    // Day of month: 01, 02, ..., 31
    'DD': function (date) {
      return addLeadingZeros(date.getDate(), 2)
    },

    // Day of year: 1, 2, ..., 366
    'DDD': function (date) {
      return get_day_of_year(date)
    },

    // Day of year: 001, 002, ..., 366
    'DDDD': function (date) {
      return addLeadingZeros(get_day_of_year(date), 3)
    },

    // Day of week: 0, 1, ..., 6
    'd': function (date) {
      return date.getDay()
    },

    // Day of ISO week: 1, 2, ..., 7
    'E': function (date) {
      return date.getDay() || 7
    },

    // ISO week: 1, 2, ..., 53
    'W': function (date) {
      return get_iso_week(date)
    },

    // ISO week: 01, 02, ..., 53
    'WW': function (date) {
      return addLeadingZeros(get_iso_week(date), 2)
    },

    // Year: 00, 01, ..., 99
    'YY': function (date) {
      return addLeadingZeros(date.getFullYear(), 4).substr(2)
    },

    // Year: 1900, 1901, ..., 2099
    'YYYY': function (date) {
      return addLeadingZeros(date.getFullYear(), 4)
    },

    // ISO week-numbering year: 00, 01, ..., 99
    'GG': function (date) {
      return String(get_iso_year(date)).substr(2)
    },

    // ISO week-numbering year: 1900, 1901, ..., 2099
    'GGGG': function (date) {
      return get_iso_year(date)
    },

    // Hour: 0, 1, ... 23
    'H': function (date) {
      return date.getHours()
    },

    // Hour: 00, 01, ..., 23
    'HH': function (date) {
      return addLeadingZeros(date.getHours(), 2)
    },

    // Hour: 1, 2, ..., 12
    'h': function (date) {
      var hours = date.getHours();
      if (hours === 0) {
        return 12
      } else if (hours > 12) {
        return hours % 12
      } else {
        return hours
      }
    },

    // Hour: 01, 02, ..., 12
    'hh': function (date) {
      return addLeadingZeros(formatters['h'](date), 2)
    },

    // Minute: 0, 1, ..., 59
    'm': function (date) {
      return date.getMinutes()
    },

    // Minute: 00, 01, ..., 59
    'mm': function (date) {
      return addLeadingZeros(date.getMinutes(), 2)
    },

    // Second: 0, 1, ..., 59
    's': function (date) {
      return date.getSeconds()
    },

    // Second: 00, 01, ..., 59
    'ss': function (date) {
      return addLeadingZeros(date.getSeconds(), 2)
    },

    // 1/10 of second: 0, 1, ..., 9
    'S': function (date) {
      return Math.floor(date.getMilliseconds() / 100)
    },

    // 1/100 of second: 00, 01, ..., 99
    'SS': function (date) {
      return addLeadingZeros(Math.floor(date.getMilliseconds() / 10), 2)
    },

    // Millisecond: 000, 001, ..., 999
    'SSS': function (date) {
      return addLeadingZeros(date.getMilliseconds(), 3)
    },

    // Timezone: -01:00, +00:00, ... +12:00
    'Z': function (date) {
      return formatTimezone(date.getTimezoneOffset(), ':')
    },

    // Timezone: -0100, +0000, ... +1200
    'ZZ': function (date) {
      return formatTimezone(date.getTimezoneOffset())
    },

    // Seconds timestamp: 512969520
    'X': function (date) {
      return Math.floor(date.getTime() / 1000)
    },

    // Milliseconds timestamp: 512969520900
    'x': function (date) {
      return date.getTime()
    }
  };

  function buildFormatFn (formatStr, localeFormatters, formattingTokensRegExp) {
    var array = formatStr.match(formattingTokensRegExp);
    var length = array.length;

    var i;
    var formatter;
    for (i = 0; i < length; i++) {
      formatter = localeFormatters[array[i]] || formatters[array[i]];
      if (formatter) {
        array[i] = formatter;
      } else {
        array[i] = removeFormattingTokens(array[i]);
      }
    }

    return function (date) {
      var output = '';
      for (var i = 0; i < length; i++) {
        if (array[i] instanceof Function) {
          output += array[i](date, formatters);
        } else {
          output += array[i];
        }
      }
      return output
    }
  }

  function removeFormattingTokens (input) {
    if (input.match(/\[[\s\S]/)) {
      return input.replace(/^\[|]$/g, '')
    }
    return input.replace(/\\/g, '')
  }

  function formatTimezone (offset, delimeter) {
    delimeter = delimeter || '';
    var sign = offset > 0 ? '-' : '+';
    var absOffset = Math.abs(offset);
    var hours = Math.floor(absOffset / 60);
    var minutes = absOffset % 60;
    return sign + addLeadingZeros(hours, 2) + delimeter + addLeadingZeros(minutes, 2)
  }

  function addLeadingZeros (number, targetLength) {
    var output = Math.abs(number).toString();
    while (output.length < targetLength) {
      output = '0' + output;
    }
    return output
  }

  var format_1 = format;

  /**
   * @category Day Helpers
   * @summary Get the day of the month of the given date.
   *
   * @description
   * Get the day of the month of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the day of month
   *
   * @example
   * // Which day of the month is 29 February 2012?
   * var result = getDate(new Date(2012, 1, 29))
   * //=> 29
   */
  function getDate (dirtyDate) {
    var date = parse_1(dirtyDate);
    var dayOfMonth = date.getDate();
    return dayOfMonth
  }

  var get_date = getDate;

  /**
   * @category Weekday Helpers
   * @summary Get the day of the week of the given date.
   *
   * @description
   * Get the day of the week of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the day of week
   *
   * @example
   * // Which day of the week is 29 February 2012?
   * var result = getDay(new Date(2012, 1, 29))
   * //=> 3
   */
  function getDay (dirtyDate) {
    var date = parse_1(dirtyDate);
    var day = date.getDay();
    return day
  }

  var get_day = getDay;

  /**
   * @category Year Helpers
   * @summary Is the given date in the leap year?
   *
   * @description
   * Is the given date in the leap year?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is in the leap year
   *
   * @example
   * // Is 1 September 2012 in the leap year?
   * var result = isLeapYear(new Date(2012, 8, 1))
   * //=> true
   */
  function isLeapYear (dirtyDate) {
    var date = parse_1(dirtyDate);
    var year = date.getFullYear();
    return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0
  }

  var is_leap_year = isLeapYear;

  /**
   * @category Year Helpers
   * @summary Get the number of days in a year of the given date.
   *
   * @description
   * Get the number of days in a year of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the number of days in a year
   *
   * @example
   * // How many days are in 2012?
   * var result = getDaysInYear(new Date(2012, 0, 1))
   * //=> 366
   */
  function getDaysInYear (dirtyDate) {
    return is_leap_year(dirtyDate) ? 366 : 365
  }

  var get_days_in_year = getDaysInYear;

  /**
   * @category Hour Helpers
   * @summary Get the hours of the given date.
   *
   * @description
   * Get the hours of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the hours
   *
   * @example
   * // Get the hours of 29 February 2012 11:45:00:
   * var result = getHours(new Date(2012, 1, 29, 11, 45))
   * //=> 11
   */
  function getHours (dirtyDate) {
    var date = parse_1(dirtyDate);
    var hours = date.getHours();
    return hours
  }

  var get_hours = getHours;

  /**
   * @category Weekday Helpers
   * @summary Get the day of the ISO week of the given date.
   *
   * @description
   * Get the day of the ISO week of the given date,
   * which is 7 for Sunday, 1 for Monday etc.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the day of ISO week
   *
   * @example
   * // Which day of the ISO week is 26 February 2012?
   * var result = getISODay(new Date(2012, 1, 26))
   * //=> 7
   */
  function getISODay (dirtyDate) {
    var date = parse_1(dirtyDate);
    var day = date.getDay();

    if (day === 0) {
      day = 7;
    }

    return day
  }

  var get_iso_day = getISODay;

  var MILLISECONDS_IN_WEEK$3 = 604800000;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Get the number of weeks in an ISO week-numbering year of the given date.
   *
   * @description
   * Get the number of weeks in an ISO week-numbering year of the given date.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the number of ISO weeks in a year
   *
   * @example
   * // How many weeks are in ISO week-numbering year 2015?
   * var result = getISOWeeksInYear(new Date(2015, 1, 11))
   * //=> 53
   */
  function getISOWeeksInYear (dirtyDate) {
    var thisYear = start_of_iso_year(dirtyDate);
    var nextYear = start_of_iso_year(add_weeks(thisYear, 60));
    var diff = nextYear.valueOf() - thisYear.valueOf();
    // Round the number of weeks to the nearest integer
    // because the number of milliseconds in a week is not constant
    // (e.g. it's different in the week of the daylight saving time clock shift)
    return Math.round(diff / MILLISECONDS_IN_WEEK$3)
  }

  var get_iso_weeks_in_year = getISOWeeksInYear;

  /**
   * @category Millisecond Helpers
   * @summary Get the milliseconds of the given date.
   *
   * @description
   * Get the milliseconds of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the milliseconds
   *
   * @example
   * // Get the milliseconds of 29 February 2012 11:45:05.123:
   * var result = getMilliseconds(new Date(2012, 1, 29, 11, 45, 5, 123))
   * //=> 123
   */
  function getMilliseconds (dirtyDate) {
    var date = parse_1(dirtyDate);
    var milliseconds = date.getMilliseconds();
    return milliseconds
  }

  var get_milliseconds = getMilliseconds;

  /**
   * @category Minute Helpers
   * @summary Get the minutes of the given date.
   *
   * @description
   * Get the minutes of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the minutes
   *
   * @example
   * // Get the minutes of 29 February 2012 11:45:05:
   * var result = getMinutes(new Date(2012, 1, 29, 11, 45, 5))
   * //=> 45
   */
  function getMinutes (dirtyDate) {
    var date = parse_1(dirtyDate);
    var minutes = date.getMinutes();
    return minutes
  }

  var get_minutes = getMinutes;

  /**
   * @category Month Helpers
   * @summary Get the month of the given date.
   *
   * @description
   * Get the month of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the month
   *
   * @example
   * // Which month is 29 February 2012?
   * var result = getMonth(new Date(2012, 1, 29))
   * //=> 1
   */
  function getMonth (dirtyDate) {
    var date = parse_1(dirtyDate);
    var month = date.getMonth();
    return month
  }

  var get_month = getMonth;

  var MILLISECONDS_IN_DAY$1 = 24 * 60 * 60 * 1000;

  /**
   * @category Range Helpers
   * @summary Get the number of days that overlap in two date ranges
   *
   * @description
   * Get the number of days that overlap in two date ranges
   *
   * @param {Date|String|Number} initialRangeStartDate - the start of the initial range
   * @param {Date|String|Number} initialRangeEndDate - the end of the initial range
   * @param {Date|String|Number} comparedRangeStartDate - the start of the range to compare it with
   * @param {Date|String|Number} comparedRangeEndDate - the end of the range to compare it with
   * @returns {Number} the number of days that overlap in two date ranges
   * @throws {Error} startDate of a date range cannot be after its endDate
   *
   * @example
   * // For overlapping date ranges adds 1 for each started overlapping day:
   * getOverlappingDaysInRanges(
   *   new Date(2014, 0, 10), new Date(2014, 0, 20), new Date(2014, 0, 17), new Date(2014, 0, 21)
   * )
   * //=> 3
   *
   * @example
   * // For non-overlapping date ranges returns 0:
   * getOverlappingDaysInRanges(
   *   new Date(2014, 0, 10), new Date(2014, 0, 20), new Date(2014, 0, 21), new Date(2014, 0, 22)
   * )
   * //=> 0
   */
  function getOverlappingDaysInRanges (dirtyInitialRangeStartDate, dirtyInitialRangeEndDate, dirtyComparedRangeStartDate, dirtyComparedRangeEndDate) {
    var initialStartTime = parse_1(dirtyInitialRangeStartDate).getTime();
    var initialEndTime = parse_1(dirtyInitialRangeEndDate).getTime();
    var comparedStartTime = parse_1(dirtyComparedRangeStartDate).getTime();
    var comparedEndTime = parse_1(dirtyComparedRangeEndDate).getTime();

    if (initialStartTime > initialEndTime || comparedStartTime > comparedEndTime) {
      throw new Error('The start of the range cannot be after the end of the range')
    }

    var isOverlapping = initialStartTime < comparedEndTime && comparedStartTime < initialEndTime;

    if (!isOverlapping) {
      return 0
    }

    var overlapStartDate = comparedStartTime < initialStartTime
      ? initialStartTime
      : comparedStartTime;

    var overlapEndDate = comparedEndTime > initialEndTime
      ? initialEndTime
      : comparedEndTime;

    var differenceInMs = overlapEndDate - overlapStartDate;

    return Math.ceil(differenceInMs / MILLISECONDS_IN_DAY$1)
  }

  var get_overlapping_days_in_ranges = getOverlappingDaysInRanges;

  /**
   * @category Second Helpers
   * @summary Get the seconds of the given date.
   *
   * @description
   * Get the seconds of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the seconds
   *
   * @example
   * // Get the seconds of 29 February 2012 11:45:05.123:
   * var result = getSeconds(new Date(2012, 1, 29, 11, 45, 5, 123))
   * //=> 5
   */
  function getSeconds (dirtyDate) {
    var date = parse_1(dirtyDate);
    var seconds = date.getSeconds();
    return seconds
  }

  var get_seconds = getSeconds;

  /**
   * @category Timestamp Helpers
   * @summary Get the milliseconds timestamp of the given date.
   *
   * @description
   * Get the milliseconds timestamp of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the timestamp
   *
   * @example
   * // Get the timestamp of 29 February 2012 11:45:05.123:
   * var result = getTime(new Date(2012, 1, 29, 11, 45, 5, 123))
   * //=> 1330515905123
   */
  function getTime (dirtyDate) {
    var date = parse_1(dirtyDate);
    var timestamp = date.getTime();
    return timestamp
  }

  var get_time = getTime;

  /**
   * @category Year Helpers
   * @summary Get the year of the given date.
   *
   * @description
   * Get the year of the given date.
   *
   * @param {Date|String|Number} date - the given date
   * @returns {Number} the year
   *
   * @example
   * // Which year is 2 July 2014?
   * var result = getYear(new Date(2014, 6, 2))
   * //=> 2014
   */
  function getYear (dirtyDate) {
    var date = parse_1(dirtyDate);
    var year = date.getFullYear();
    return year
  }

  var get_year = getYear;

  /**
   * @category Common Helpers
   * @summary Is the first date after the second one?
   *
   * @description
   * Is the first date after the second one?
   *
   * @param {Date|String|Number} date - the date that should be after the other one to return true
   * @param {Date|String|Number} dateToCompare - the date to compare with
   * @returns {Boolean} the first date is after the second date
   *
   * @example
   * // Is 10 July 1989 after 11 February 1987?
   * var result = isAfter(new Date(1989, 6, 10), new Date(1987, 1, 11))
   * //=> true
   */
  function isAfter (dirtyDate, dirtyDateToCompare) {
    var date = parse_1(dirtyDate);
    var dateToCompare = parse_1(dirtyDateToCompare);
    return date.getTime() > dateToCompare.getTime()
  }

  var is_after = isAfter;

  /**
   * @category Common Helpers
   * @summary Is the first date before the second one?
   *
   * @description
   * Is the first date before the second one?
   *
   * @param {Date|String|Number} date - the date that should be before the other one to return true
   * @param {Date|String|Number} dateToCompare - the date to compare with
   * @returns {Boolean} the first date is before the second date
   *
   * @example
   * // Is 10 July 1989 before 11 February 1987?
   * var result = isBefore(new Date(1989, 6, 10), new Date(1987, 1, 11))
   * //=> false
   */
  function isBefore (dirtyDate, dirtyDateToCompare) {
    var date = parse_1(dirtyDate);
    var dateToCompare = parse_1(dirtyDateToCompare);
    return date.getTime() < dateToCompare.getTime()
  }

  var is_before = isBefore;

  /**
   * @category Common Helpers
   * @summary Are the given dates equal?
   *
   * @description
   * Are the given dates equal?
   *
   * @param {Date|String|Number} dateLeft - the first date to compare
   * @param {Date|String|Number} dateRight - the second date to compare
   * @returns {Boolean} the dates are equal
   *
   * @example
   * // Are 2 July 2014 06:30:45.000 and 2 July 2014 06:30:45.500 equal?
   * var result = isEqual(
   *   new Date(2014, 6, 2, 6, 30, 45, 0)
   *   new Date(2014, 6, 2, 6, 30, 45, 500)
   * )
   * //=> false
   */
  function isEqual (dirtyLeftDate, dirtyRightDate) {
    var dateLeft = parse_1(dirtyLeftDate);
    var dateRight = parse_1(dirtyRightDate);
    return dateLeft.getTime() === dateRight.getTime()
  }

  var is_equal = isEqual;

  /**
   * @category Month Helpers
   * @summary Is the given date the first day of a month?
   *
   * @description
   * Is the given date the first day of a month?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is the first day of a month
   *
   * @example
   * // Is 1 September 2014 the first day of a month?
   * var result = isFirstDayOfMonth(new Date(2014, 8, 1))
   * //=> true
   */
  function isFirstDayOfMonth (dirtyDate) {
    return parse_1(dirtyDate).getDate() === 1
  }

  var is_first_day_of_month = isFirstDayOfMonth;

  /**
   * @category Weekday Helpers
   * @summary Is the given date Friday?
   *
   * @description
   * Is the given date Friday?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is Friday
   *
   * @example
   * // Is 26 September 2014 Friday?
   * var result = isFriday(new Date(2014, 8, 26))
   * //=> true
   */
  function isFriday (dirtyDate) {
    return parse_1(dirtyDate).getDay() === 5
  }

  var is_friday = isFriday;

  /**
   * @category Common Helpers
   * @summary Is the given date in the future?
   *
   * @description
   * Is the given date in the future?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is in the future
   *
   * @example
   * // If today is 6 October 2014, is 31 December 2014 in the future?
   * var result = isFuture(new Date(2014, 11, 31))
   * //=> true
   */
  function isFuture (dirtyDate) {
    return parse_1(dirtyDate).getTime() > new Date().getTime()
  }

  var is_future = isFuture;

  /**
   * @category Month Helpers
   * @summary Is the given date the last day of a month?
   *
   * @description
   * Is the given date the last day of a month?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is the last day of a month
   *
   * @example
   * // Is 28 February 2014 the last day of a month?
   * var result = isLastDayOfMonth(new Date(2014, 1, 28))
   * //=> true
   */
  function isLastDayOfMonth (dirtyDate) {
    var date = parse_1(dirtyDate);
    return end_of_day(date).getTime() === end_of_month(date).getTime()
  }

  var is_last_day_of_month = isLastDayOfMonth;

  /**
   * @category Weekday Helpers
   * @summary Is the given date Monday?
   *
   * @description
   * Is the given date Monday?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is Monday
   *
   * @example
   * // Is 22 September 2014 Monday?
   * var result = isMonday(new Date(2014, 8, 22))
   * //=> true
   */
  function isMonday (dirtyDate) {
    return parse_1(dirtyDate).getDay() === 1
  }

  var is_monday = isMonday;

  /**
   * @category Common Helpers
   * @summary Is the given date in the past?
   *
   * @description
   * Is the given date in the past?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is in the past
   *
   * @example
   * // If today is 6 October 2014, is 2 July 2014 in the past?
   * var result = isPast(new Date(2014, 6, 2))
   * //=> true
   */
  function isPast (dirtyDate) {
    return parse_1(dirtyDate).getTime() < new Date().getTime()
  }

  var is_past = isPast;

  /**
   * @category Day Helpers
   * @summary Are the given dates in the same day?
   *
   * @description
   * Are the given dates in the same day?
   *
   * @param {Date|String|Number} dateLeft - the first date to check
   * @param {Date|String|Number} dateRight - the second date to check
   * @returns {Boolean} the dates are in the same day
   *
   * @example
   * // Are 4 September 06:00:00 and 4 September 18:00:00 in the same day?
   * var result = isSameDay(
   *   new Date(2014, 8, 4, 6, 0),
   *   new Date(2014, 8, 4, 18, 0)
   * )
   * //=> true
   */
  function isSameDay (dirtyDateLeft, dirtyDateRight) {
    var dateLeftStartOfDay = start_of_day(dirtyDateLeft);
    var dateRightStartOfDay = start_of_day(dirtyDateRight);

    return dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime()
  }

  var is_same_day = isSameDay;

  /**
   * @category Hour Helpers
   * @summary Return the start of an hour for the given date.
   *
   * @description
   * Return the start of an hour for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of an hour
   *
   * @example
   * // The start of an hour for 2 September 2014 11:55:00:
   * var result = startOfHour(new Date(2014, 8, 2, 11, 55))
   * //=> Tue Sep 02 2014 11:00:00
   */
  function startOfHour (dirtyDate) {
    var date = parse_1(dirtyDate);
    date.setMinutes(0, 0, 0);
    return date
  }

  var start_of_hour = startOfHour;

  /**
   * @category Hour Helpers
   * @summary Are the given dates in the same hour?
   *
   * @description
   * Are the given dates in the same hour?
   *
   * @param {Date|String|Number} dateLeft - the first date to check
   * @param {Date|String|Number} dateRight - the second date to check
   * @returns {Boolean} the dates are in the same hour
   *
   * @example
   * // Are 4 September 2014 06:00:00 and 4 September 06:30:00 in the same hour?
   * var result = isSameHour(
   *   new Date(2014, 8, 4, 6, 0),
   *   new Date(2014, 8, 4, 6, 30)
   * )
   * //=> true
   */
  function isSameHour (dirtyDateLeft, dirtyDateRight) {
    var dateLeftStartOfHour = start_of_hour(dirtyDateLeft);
    var dateRightStartOfHour = start_of_hour(dirtyDateRight);

    return dateLeftStartOfHour.getTime() === dateRightStartOfHour.getTime()
  }

  var is_same_hour = isSameHour;

  /**
   * @category Week Helpers
   * @summary Are the given dates in the same week?
   *
   * @description
   * Are the given dates in the same week?
   *
   * @param {Date|String|Number} dateLeft - the first date to check
   * @param {Date|String|Number} dateRight - the second date to check
   * @param {Object} [options] - the object with options
   * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
   * @returns {Boolean} the dates are in the same week
   *
   * @example
   * // Are 31 August 2014 and 4 September 2014 in the same week?
   * var result = isSameWeek(
   *   new Date(2014, 7, 31),
   *   new Date(2014, 8, 4)
   * )
   * //=> true
   *
   * @example
   * // If week starts with Monday,
   * // are 31 August 2014 and 4 September 2014 in the same week?
   * var result = isSameWeek(
   *   new Date(2014, 7, 31),
   *   new Date(2014, 8, 4),
   *   {weekStartsOn: 1}
   * )
   * //=> false
   */
  function isSameWeek (dirtyDateLeft, dirtyDateRight, dirtyOptions) {
    var dateLeftStartOfWeek = start_of_week(dirtyDateLeft, dirtyOptions);
    var dateRightStartOfWeek = start_of_week(dirtyDateRight, dirtyOptions);

    return dateLeftStartOfWeek.getTime() === dateRightStartOfWeek.getTime()
  }

  var is_same_week = isSameWeek;

  /**
   * @category ISO Week Helpers
   * @summary Are the given dates in the same ISO week?
   *
   * @description
   * Are the given dates in the same ISO week?
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} dateLeft - the first date to check
   * @param {Date|String|Number} dateRight - the second date to check
   * @returns {Boolean} the dates are in the same ISO week
   *
   * @example
   * // Are 1 September 2014 and 7 September 2014 in the same ISO week?
   * var result = isSameISOWeek(
   *   new Date(2014, 8, 1),
   *   new Date(2014, 8, 7)
   * )
   * //=> true
   */
  function isSameISOWeek (dirtyDateLeft, dirtyDateRight) {
    return is_same_week(dirtyDateLeft, dirtyDateRight, {weekStartsOn: 1})
  }

  var is_same_iso_week = isSameISOWeek;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Are the given dates in the same ISO week-numbering year?
   *
   * @description
   * Are the given dates in the same ISO week-numbering year?
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} dateLeft - the first date to check
   * @param {Date|String|Number} dateRight - the second date to check
   * @returns {Boolean} the dates are in the same ISO week-numbering year
   *
   * @example
   * // Are 29 December 2003 and 2 January 2005 in the same ISO week-numbering year?
   * var result = isSameISOYear(
   *   new Date(2003, 11, 29),
   *   new Date(2005, 0, 2)
   * )
   * //=> true
   */
  function isSameISOYear (dirtyDateLeft, dirtyDateRight) {
    var dateLeftStartOfYear = start_of_iso_year(dirtyDateLeft);
    var dateRightStartOfYear = start_of_iso_year(dirtyDateRight);

    return dateLeftStartOfYear.getTime() === dateRightStartOfYear.getTime()
  }

  var is_same_iso_year = isSameISOYear;

  /**
   * @category Minute Helpers
   * @summary Return the start of a minute for the given date.
   *
   * @description
   * Return the start of a minute for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of a minute
   *
   * @example
   * // The start of a minute for 1 December 2014 22:15:45.400:
   * var result = startOfMinute(new Date(2014, 11, 1, 22, 15, 45, 400))
   * //=> Mon Dec 01 2014 22:15:00
   */
  function startOfMinute (dirtyDate) {
    var date = parse_1(dirtyDate);
    date.setSeconds(0, 0);
    return date
  }

  var start_of_minute = startOfMinute;

  /**
   * @category Minute Helpers
   * @summary Are the given dates in the same minute?
   *
   * @description
   * Are the given dates in the same minute?
   *
   * @param {Date|String|Number} dateLeft - the first date to check
   * @param {Date|String|Number} dateRight - the second date to check
   * @returns {Boolean} the dates are in the same minute
   *
   * @example
   * // Are 4 September 2014 06:30:00 and 4 September 2014 06:30:15
   * // in the same minute?
   * var result = isSameMinute(
   *   new Date(2014, 8, 4, 6, 30),
   *   new Date(2014, 8, 4, 6, 30, 15)
   * )
   * //=> true
   */
  function isSameMinute (dirtyDateLeft, dirtyDateRight) {
    var dateLeftStartOfMinute = start_of_minute(dirtyDateLeft);
    var dateRightStartOfMinute = start_of_minute(dirtyDateRight);

    return dateLeftStartOfMinute.getTime() === dateRightStartOfMinute.getTime()
  }

  var is_same_minute = isSameMinute;

  /**
   * @category Month Helpers
   * @summary Are the given dates in the same month?
   *
   * @description
   * Are the given dates in the same month?
   *
   * @param {Date|String|Number} dateLeft - the first date to check
   * @param {Date|String|Number} dateRight - the second date to check
   * @returns {Boolean} the dates are in the same month
   *
   * @example
   * // Are 2 September 2014 and 25 September 2014 in the same month?
   * var result = isSameMonth(
   *   new Date(2014, 8, 2),
   *   new Date(2014, 8, 25)
   * )
   * //=> true
   */
  function isSameMonth (dirtyDateLeft, dirtyDateRight) {
    var dateLeft = parse_1(dirtyDateLeft);
    var dateRight = parse_1(dirtyDateRight);
    return dateLeft.getFullYear() === dateRight.getFullYear() &&
      dateLeft.getMonth() === dateRight.getMonth()
  }

  var is_same_month = isSameMonth;

  /**
   * @category Quarter Helpers
   * @summary Return the start of a year quarter for the given date.
   *
   * @description
   * Return the start of a year quarter for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of a quarter
   *
   * @example
   * // The start of a quarter for 2 September 2014 11:55:00:
   * var result = startOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Jul 01 2014 00:00:00
   */
  function startOfQuarter (dirtyDate) {
    var date = parse_1(dirtyDate);
    var currentMonth = date.getMonth();
    var month = currentMonth - currentMonth % 3;
    date.setMonth(month, 1);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var start_of_quarter = startOfQuarter;

  /**
   * @category Quarter Helpers
   * @summary Are the given dates in the same year quarter?
   *
   * @description
   * Are the given dates in the same year quarter?
   *
   * @param {Date|String|Number} dateLeft - the first date to check
   * @param {Date|String|Number} dateRight - the second date to check
   * @returns {Boolean} the dates are in the same quarter
   *
   * @example
   * // Are 1 January 2014 and 8 March 2014 in the same quarter?
   * var result = isSameQuarter(
   *   new Date(2014, 0, 1),
   *   new Date(2014, 2, 8)
   * )
   * //=> true
   */
  function isSameQuarter (dirtyDateLeft, dirtyDateRight) {
    var dateLeftStartOfQuarter = start_of_quarter(dirtyDateLeft);
    var dateRightStartOfQuarter = start_of_quarter(dirtyDateRight);

    return dateLeftStartOfQuarter.getTime() === dateRightStartOfQuarter.getTime()
  }

  var is_same_quarter = isSameQuarter;

  /**
   * @category Second Helpers
   * @summary Return the start of a second for the given date.
   *
   * @description
   * Return the start of a second for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of a second
   *
   * @example
   * // The start of a second for 1 December 2014 22:15:45.400:
   * var result = startOfSecond(new Date(2014, 11, 1, 22, 15, 45, 400))
   * //=> Mon Dec 01 2014 22:15:45.000
   */
  function startOfSecond (dirtyDate) {
    var date = parse_1(dirtyDate);
    date.setMilliseconds(0);
    return date
  }

  var start_of_second = startOfSecond;

  /**
   * @category Second Helpers
   * @summary Are the given dates in the same second?
   *
   * @description
   * Are the given dates in the same second?
   *
   * @param {Date|String|Number} dateLeft - the first date to check
   * @param {Date|String|Number} dateRight - the second date to check
   * @returns {Boolean} the dates are in the same second
   *
   * @example
   * // Are 4 September 2014 06:30:15.000 and 4 September 2014 06:30.15.500
   * // in the same second?
   * var result = isSameSecond(
   *   new Date(2014, 8, 4, 6, 30, 15),
   *   new Date(2014, 8, 4, 6, 30, 15, 500)
   * )
   * //=> true
   */
  function isSameSecond (dirtyDateLeft, dirtyDateRight) {
    var dateLeftStartOfSecond = start_of_second(dirtyDateLeft);
    var dateRightStartOfSecond = start_of_second(dirtyDateRight);

    return dateLeftStartOfSecond.getTime() === dateRightStartOfSecond.getTime()
  }

  var is_same_second = isSameSecond;

  /**
   * @category Year Helpers
   * @summary Are the given dates in the same year?
   *
   * @description
   * Are the given dates in the same year?
   *
   * @param {Date|String|Number} dateLeft - the first date to check
   * @param {Date|String|Number} dateRight - the second date to check
   * @returns {Boolean} the dates are in the same year
   *
   * @example
   * // Are 2 September 2014 and 25 September 2014 in the same year?
   * var result = isSameYear(
   *   new Date(2014, 8, 2),
   *   new Date(2014, 8, 25)
   * )
   * //=> true
   */
  function isSameYear (dirtyDateLeft, dirtyDateRight) {
    var dateLeft = parse_1(dirtyDateLeft);
    var dateRight = parse_1(dirtyDateRight);
    return dateLeft.getFullYear() === dateRight.getFullYear()
  }

  var is_same_year = isSameYear;

  /**
   * @category Weekday Helpers
   * @summary Is the given date Saturday?
   *
   * @description
   * Is the given date Saturday?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is Saturday
   *
   * @example
   * // Is 27 September 2014 Saturday?
   * var result = isSaturday(new Date(2014, 8, 27))
   * //=> true
   */
  function isSaturday (dirtyDate) {
    return parse_1(dirtyDate).getDay() === 6
  }

  var is_saturday = isSaturday;

  /**
   * @category Weekday Helpers
   * @summary Is the given date Sunday?
   *
   * @description
   * Is the given date Sunday?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is Sunday
   *
   * @example
   * // Is 21 September 2014 Sunday?
   * var result = isSunday(new Date(2014, 8, 21))
   * //=> true
   */
  function isSunday (dirtyDate) {
    return parse_1(dirtyDate).getDay() === 0
  }

  var is_sunday = isSunday;

  /**
   * @category Hour Helpers
   * @summary Is the given date in the same hour as the current date?
   *
   * @description
   * Is the given date in the same hour as the current date?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is in this hour
   *
   * @example
   * // If now is 25 September 2014 18:30:15.500,
   * // is 25 September 2014 18:00:00 in this hour?
   * var result = isThisHour(new Date(2014, 8, 25, 18))
   * //=> true
   */
  function isThisHour (dirtyDate) {
    return is_same_hour(new Date(), dirtyDate)
  }

  var is_this_hour = isThisHour;

  /**
   * @category ISO Week Helpers
   * @summary Is the given date in the same ISO week as the current date?
   *
   * @description
   * Is the given date in the same ISO week as the current date?
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is in this ISO week
   *
   * @example
   * // If today is 25 September 2014, is 22 September 2014 in this ISO week?
   * var result = isThisISOWeek(new Date(2014, 8, 22))
   * //=> true
   */
  function isThisISOWeek (dirtyDate) {
    return is_same_iso_week(new Date(), dirtyDate)
  }

  var is_this_iso_week = isThisISOWeek;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Is the given date in the same ISO week-numbering year as the current date?
   *
   * @description
   * Is the given date in the same ISO week-numbering year as the current date?
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is in this ISO week-numbering year
   *
   * @example
   * // If today is 25 September 2014,
   * // is 30 December 2013 in this ISO week-numbering year?
   * var result = isThisISOYear(new Date(2013, 11, 30))
   * //=> true
   */
  function isThisISOYear (dirtyDate) {
    return is_same_iso_year(new Date(), dirtyDate)
  }

  var is_this_iso_year = isThisISOYear;

  /**
   * @category Minute Helpers
   * @summary Is the given date in the same minute as the current date?
   *
   * @description
   * Is the given date in the same minute as the current date?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is in this minute
   *
   * @example
   * // If now is 25 September 2014 18:30:15.500,
   * // is 25 September 2014 18:30:00 in this minute?
   * var result = isThisMinute(new Date(2014, 8, 25, 18, 30))
   * //=> true
   */
  function isThisMinute (dirtyDate) {
    return is_same_minute(new Date(), dirtyDate)
  }

  var is_this_minute = isThisMinute;

  /**
   * @category Month Helpers
   * @summary Is the given date in the same month as the current date?
   *
   * @description
   * Is the given date in the same month as the current date?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is in this month
   *
   * @example
   * // If today is 25 September 2014, is 15 September 2014 in this month?
   * var result = isThisMonth(new Date(2014, 8, 15))
   * //=> true
   */
  function isThisMonth (dirtyDate) {
    return is_same_month(new Date(), dirtyDate)
  }

  var is_this_month = isThisMonth;

  /**
   * @category Quarter Helpers
   * @summary Is the given date in the same quarter as the current date?
   *
   * @description
   * Is the given date in the same quarter as the current date?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is in this quarter
   *
   * @example
   * // If today is 25 September 2014, is 2 July 2014 in this quarter?
   * var result = isThisQuarter(new Date(2014, 6, 2))
   * //=> true
   */
  function isThisQuarter (dirtyDate) {
    return is_same_quarter(new Date(), dirtyDate)
  }

  var is_this_quarter = isThisQuarter;

  /**
   * @category Second Helpers
   * @summary Is the given date in the same second as the current date?
   *
   * @description
   * Is the given date in the same second as the current date?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is in this second
   *
   * @example
   * // If now is 25 September 2014 18:30:15.500,
   * // is 25 September 2014 18:30:15.000 in this second?
   * var result = isThisSecond(new Date(2014, 8, 25, 18, 30, 15))
   * //=> true
   */
  function isThisSecond (dirtyDate) {
    return is_same_second(new Date(), dirtyDate)
  }

  var is_this_second = isThisSecond;

  /**
   * @category Week Helpers
   * @summary Is the given date in the same week as the current date?
   *
   * @description
   * Is the given date in the same week as the current date?
   *
   * @param {Date|String|Number} date - the date to check
   * @param {Object} [options] - the object with options
   * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
   * @returns {Boolean} the date is in this week
   *
   * @example
   * // If today is 25 September 2014, is 21 September 2014 in this week?
   * var result = isThisWeek(new Date(2014, 8, 21))
   * //=> true
   *
   * @example
   * // If today is 25 September 2014 and week starts with Monday
   * // is 21 September 2014 in this week?
   * var result = isThisWeek(new Date(2014, 8, 21), {weekStartsOn: 1})
   * //=> false
   */
  function isThisWeek (dirtyDate, dirtyOptions) {
    return is_same_week(new Date(), dirtyDate, dirtyOptions)
  }

  var is_this_week = isThisWeek;

  /**
   * @category Year Helpers
   * @summary Is the given date in the same year as the current date?
   *
   * @description
   * Is the given date in the same year as the current date?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is in this year
   *
   * @example
   * // If today is 25 September 2014, is 2 July 2014 in this year?
   * var result = isThisYear(new Date(2014, 6, 2))
   * //=> true
   */
  function isThisYear (dirtyDate) {
    return is_same_year(new Date(), dirtyDate)
  }

  var is_this_year = isThisYear;

  /**
   * @category Weekday Helpers
   * @summary Is the given date Thursday?
   *
   * @description
   * Is the given date Thursday?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is Thursday
   *
   * @example
   * // Is 25 September 2014 Thursday?
   * var result = isThursday(new Date(2014, 8, 25))
   * //=> true
   */
  function isThursday (dirtyDate) {
    return parse_1(dirtyDate).getDay() === 4
  }

  var is_thursday = isThursday;

  /**
   * @category Day Helpers
   * @summary Is the given date today?
   *
   * @description
   * Is the given date today?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is today
   *
   * @example
   * // If today is 6 October 2014, is 6 October 14:00:00 today?
   * var result = isToday(new Date(2014, 9, 6, 14, 0))
   * //=> true
   */
  function isToday (dirtyDate) {
    return start_of_day(dirtyDate).getTime() === start_of_day(new Date()).getTime()
  }

  var is_today = isToday;

  /**
   * @category Day Helpers
   * @summary Is the given date tomorrow?
   *
   * @description
   * Is the given date tomorrow?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is tomorrow
   *
   * @example
   * // If today is 6 October 2014, is 7 October 14:00:00 tomorrow?
   * var result = isTomorrow(new Date(2014, 9, 7, 14, 0))
   * //=> true
   */
  function isTomorrow (dirtyDate) {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return start_of_day(dirtyDate).getTime() === start_of_day(tomorrow).getTime()
  }

  var is_tomorrow = isTomorrow;

  /**
   * @category Weekday Helpers
   * @summary Is the given date Tuesday?
   *
   * @description
   * Is the given date Tuesday?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is Tuesday
   *
   * @example
   * // Is 23 September 2014 Tuesday?
   * var result = isTuesday(new Date(2014, 8, 23))
   * //=> true
   */
  function isTuesday (dirtyDate) {
    return parse_1(dirtyDate).getDay() === 2
  }

  var is_tuesday = isTuesday;

  /**
   * @category Weekday Helpers
   * @summary Is the given date Wednesday?
   *
   * @description
   * Is the given date Wednesday?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is Wednesday
   *
   * @example
   * // Is 24 September 2014 Wednesday?
   * var result = isWednesday(new Date(2014, 8, 24))
   * //=> true
   */
  function isWednesday (dirtyDate) {
    return parse_1(dirtyDate).getDay() === 3
  }

  var is_wednesday = isWednesday;

  /**
   * @category Weekday Helpers
   * @summary Does the given date fall on a weekend?
   *
   * @description
   * Does the given date fall on a weekend?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date falls on a weekend
   *
   * @example
   * // Does 5 October 2014 fall on a weekend?
   * var result = isWeekend(new Date(2014, 9, 5))
   * //=> true
   */
  function isWeekend (dirtyDate) {
    var date = parse_1(dirtyDate);
    var day = date.getDay();
    return day === 0 || day === 6
  }

  var is_weekend = isWeekend;

  /**
   * @category Range Helpers
   * @summary Is the given date within the range?
   *
   * @description
   * Is the given date within the range?
   *
   * @param {Date|String|Number} date - the date to check
   * @param {Date|String|Number} startDate - the start of range
   * @param {Date|String|Number} endDate - the end of range
   * @returns {Boolean} the date is within the range
   * @throws {Error} startDate cannot be after endDate
   *
   * @example
   * // For the date within the range:
   * isWithinRange(
   *   new Date(2014, 0, 3), new Date(2014, 0, 1), new Date(2014, 0, 7)
   * )
   * //=> true
   *
   * @example
   * // For the date outside of the range:
   * isWithinRange(
   *   new Date(2014, 0, 10), new Date(2014, 0, 1), new Date(2014, 0, 7)
   * )
   * //=> false
   */
  function isWithinRange (dirtyDate, dirtyStartDate, dirtyEndDate) {
    var time = parse_1(dirtyDate).getTime();
    var startTime = parse_1(dirtyStartDate).getTime();
    var endTime = parse_1(dirtyEndDate).getTime();

    if (startTime > endTime) {
      throw new Error('The start of the range cannot be after the end of the range')
    }

    return time >= startTime && time <= endTime
  }

  var is_within_range = isWithinRange;

  /**
   * @category Day Helpers
   * @summary Is the given date yesterday?
   *
   * @description
   * Is the given date yesterday?
   *
   * @param {Date|String|Number} date - the date to check
   * @returns {Boolean} the date is yesterday
   *
   * @example
   * // If today is 6 October 2014, is 5 October 14:00:00 yesterday?
   * var result = isYesterday(new Date(2014, 9, 5, 14, 0))
   * //=> true
   */
  function isYesterday (dirtyDate) {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return start_of_day(dirtyDate).getTime() === start_of_day(yesterday).getTime()
  }

  var is_yesterday = isYesterday;

  /**
   * @category Week Helpers
   * @summary Return the last day of a week for the given date.
   *
   * @description
   * Return the last day of a week for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @param {Object} [options] - the object with options
   * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
   * @returns {Date} the last day of a week
   *
   * @example
   * // The last day of a week for 2 September 2014 11:55:00:
   * var result = lastDayOfWeek(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Sat Sep 06 2014 00:00:00
   *
   * @example
   * // If the week starts on Monday, the last day of the week for 2 September 2014 11:55:00:
   * var result = lastDayOfWeek(new Date(2014, 8, 2, 11, 55, 0), {weekStartsOn: 1})
   * //=> Sun Sep 07 2014 00:00:00
   */
  function lastDayOfWeek (dirtyDate, dirtyOptions) {
    var weekStartsOn = dirtyOptions ? (Number(dirtyOptions.weekStartsOn) || 0) : 0;

    var date = parse_1(dirtyDate);
    var day = date.getDay();
    var diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + diff);
    return date
  }

  var last_day_of_week = lastDayOfWeek;

  /**
   * @category ISO Week Helpers
   * @summary Return the last day of an ISO week for the given date.
   *
   * @description
   * Return the last day of an ISO week for the given date.
   * The result will be in the local timezone.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the last day of an ISO week
   *
   * @example
   * // The last day of an ISO week for 2 September 2014 11:55:00:
   * var result = lastDayOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Sun Sep 07 2014 00:00:00
   */
  function lastDayOfISOWeek (dirtyDate) {
    return last_day_of_week(dirtyDate, {weekStartsOn: 1})
  }

  var last_day_of_iso_week = lastDayOfISOWeek;

  /**
   * @category ISO Week-Numbering Year Helpers
   * @summary Return the last day of an ISO week-numbering year for the given date.
   *
   * @description
   * Return the last day of an ISO week-numbering year,
   * which always starts 3 days before the year's first Thursday.
   * The result will be in the local timezone.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the end of an ISO week-numbering year
   *
   * @example
   * // The last day of an ISO week-numbering year for 2 July 2005:
   * var result = lastDayOfISOYear(new Date(2005, 6, 2))
   * //=> Sun Jan 01 2006 00:00:00
   */
  function lastDayOfISOYear (dirtyDate) {
    var year = get_iso_year(dirtyDate);
    var fourthOfJanuary = new Date(0);
    fourthOfJanuary.setFullYear(year + 1, 0, 4);
    fourthOfJanuary.setHours(0, 0, 0, 0);
    var date = start_of_iso_week(fourthOfJanuary);
    date.setDate(date.getDate() - 1);
    return date
  }

  var last_day_of_iso_year = lastDayOfISOYear;

  /**
   * @category Month Helpers
   * @summary Return the last day of a month for the given date.
   *
   * @description
   * Return the last day of a month for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the last day of a month
   *
   * @example
   * // The last day of a month for 2 September 2014 11:55:00:
   * var result = lastDayOfMonth(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Sep 30 2014 00:00:00
   */
  function lastDayOfMonth (dirtyDate) {
    var date = parse_1(dirtyDate);
    var month = date.getMonth();
    date.setFullYear(date.getFullYear(), month + 1, 0);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var last_day_of_month = lastDayOfMonth;

  /**
   * @category Quarter Helpers
   * @summary Return the last day of a year quarter for the given date.
   *
   * @description
   * Return the last day of a year quarter for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the last day of a quarter
   *
   * @example
   * // The last day of a quarter for 2 September 2014 11:55:00:
   * var result = lastDayOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Sep 30 2014 00:00:00
   */
  function lastDayOfQuarter (dirtyDate) {
    var date = parse_1(dirtyDate);
    var currentMonth = date.getMonth();
    var month = currentMonth - currentMonth % 3 + 3;
    date.setMonth(month, 0);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var last_day_of_quarter = lastDayOfQuarter;

  /**
   * @category Year Helpers
   * @summary Return the last day of a year for the given date.
   *
   * @description
   * Return the last day of a year for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the last day of a year
   *
   * @example
   * // The last day of a year for 2 September 2014 11:55:00:
   * var result = lastDayOfYear(new Date(2014, 8, 2, 11, 55, 00))
   * //=> Wed Dec 31 2014 00:00:00
   */
  function lastDayOfYear (dirtyDate) {
    var date = parse_1(dirtyDate);
    var year = date.getFullYear();
    date.setFullYear(year + 1, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var last_day_of_year = lastDayOfYear;

  /**
   * @category Common Helpers
   * @summary Return the latest of the given dates.
   *
   * @description
   * Return the latest of the given dates.
   *
   * @param {...(Date|String|Number)} dates - the dates to compare
   * @returns {Date} the latest of the dates
   *
   * @example
   * // Which of these dates is the latest?
   * var result = max(
   *   new Date(1989, 6, 10),
   *   new Date(1987, 1, 11),
   *   new Date(1995, 6, 2),
   *   new Date(1990, 0, 1)
   * )
   * //=> Sun Jul 02 1995 00:00:00
   */
  function max$1 () {
    var dirtyDates = Array.prototype.slice.call(arguments);
    var dates = dirtyDates.map(function (dirtyDate) {
      return parse_1(dirtyDate)
    });
    var latestTimestamp = Math.max.apply(null, dates);
    return new Date(latestTimestamp)
  }

  var max_1 = max$1;

  /**
   * @category Common Helpers
   * @summary Return the earliest of the given dates.
   *
   * @description
   * Return the earliest of the given dates.
   *
   * @param {...(Date|String|Number)} dates - the dates to compare
   * @returns {Date} the earliest of the dates
   *
   * @example
   * // Which of these dates is the earliest?
   * var result = min(
   *   new Date(1989, 6, 10),
   *   new Date(1987, 1, 11),
   *   new Date(1995, 6, 2),
   *   new Date(1990, 0, 1)
   * )
   * //=> Wed Feb 11 1987 00:00:00
   */
  function min$1 () {
    var dirtyDates = Array.prototype.slice.call(arguments);
    var dates = dirtyDates.map(function (dirtyDate) {
      return parse_1(dirtyDate)
    });
    var earliestTimestamp = Math.min.apply(null, dates);
    return new Date(earliestTimestamp)
  }

  var min_1 = min$1;

  /**
   * @category Day Helpers
   * @summary Set the day of the month to the given date.
   *
   * @description
   * Set the day of the month to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} dayOfMonth - the day of the month of the new date
   * @returns {Date} the new date with the day of the month setted
   *
   * @example
   * // Set the 30th day of the month to 1 September 2014:
   * var result = setDate(new Date(2014, 8, 1), 30)
   * //=> Tue Sep 30 2014 00:00:00
   */
  function setDate (dirtyDate, dirtyDayOfMonth) {
    var date = parse_1(dirtyDate);
    var dayOfMonth = Number(dirtyDayOfMonth);
    date.setDate(dayOfMonth);
    return date
  }

  var set_date = setDate;

  /**
   * @category Weekday Helpers
   * @summary Set the day of the week to the given date.
   *
   * @description
   * Set the day of the week to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} day - the day of the week of the new date
   * @param {Object} [options] - the object with options
   * @param {Number} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
   * @returns {Date} the new date with the day of the week setted
   *
   * @example
   * // Set Sunday to 1 September 2014:
   * var result = setDay(new Date(2014, 8, 1), 0)
   * //=> Sun Aug 31 2014 00:00:00
   *
   * @example
   * // If week starts with Monday, set Sunday to 1 September 2014:
   * var result = setDay(new Date(2014, 8, 1), 0, {weekStartsOn: 1})
   * //=> Sun Sep 07 2014 00:00:00
   */
  function setDay (dirtyDate, dirtyDay, dirtyOptions) {
    var weekStartsOn = dirtyOptions ? (Number(dirtyOptions.weekStartsOn) || 0) : 0;
    var date = parse_1(dirtyDate);
    var day = Number(dirtyDay);
    var currentDay = date.getDay();

    var remainder = day % 7;
    var dayIndex = (remainder + 7) % 7;

    var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
    return add_days(date, diff)
  }

  var set_day = setDay;

  /**
   * @category Day Helpers
   * @summary Set the day of the year to the given date.
   *
   * @description
   * Set the day of the year to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} dayOfYear - the day of the year of the new date
   * @returns {Date} the new date with the day of the year setted
   *
   * @example
   * // Set the 2nd day of the year to 2 July 2014:
   * var result = setDayOfYear(new Date(2014, 6, 2), 2)
   * //=> Thu Jan 02 2014 00:00:00
   */
  function setDayOfYear (dirtyDate, dirtyDayOfYear) {
    var date = parse_1(dirtyDate);
    var dayOfYear = Number(dirtyDayOfYear);
    date.setMonth(0);
    date.setDate(dayOfYear);
    return date
  }

  var set_day_of_year = setDayOfYear;

  /**
   * @category Hour Helpers
   * @summary Set the hours to the given date.
   *
   * @description
   * Set the hours to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} hours - the hours of the new date
   * @returns {Date} the new date with the hours setted
   *
   * @example
   * // Set 4 hours to 1 September 2014 11:30:00:
   * var result = setHours(new Date(2014, 8, 1, 11, 30), 4)
   * //=> Mon Sep 01 2014 04:30:00
   */
  function setHours (dirtyDate, dirtyHours) {
    var date = parse_1(dirtyDate);
    var hours = Number(dirtyHours);
    date.setHours(hours);
    return date
  }

  var set_hours = setHours;

  /**
   * @category Weekday Helpers
   * @summary Set the day of the ISO week to the given date.
   *
   * @description
   * Set the day of the ISO week to the given date.
   * ISO week starts with Monday.
   * 7 is the index of Sunday, 1 is the index of Monday etc.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} day - the day of the ISO week of the new date
   * @returns {Date} the new date with the day of the ISO week setted
   *
   * @example
   * // Set Sunday to 1 September 2014:
   * var result = setISODay(new Date(2014, 8, 1), 7)
   * //=> Sun Sep 07 2014 00:00:00
   */
  function setISODay (dirtyDate, dirtyDay) {
    var date = parse_1(dirtyDate);
    var day = Number(dirtyDay);
    var currentDay = get_iso_day(date);
    var diff = day - currentDay;
    return add_days(date, diff)
  }

  var set_iso_day = setISODay;

  /**
   * @category ISO Week Helpers
   * @summary Set the ISO week to the given date.
   *
   * @description
   * Set the ISO week to the given date, saving the weekday number.
   *
   * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} isoWeek - the ISO week of the new date
   * @returns {Date} the new date with the ISO week setted
   *
   * @example
   * // Set the 53rd ISO week to 7 August 2004:
   * var result = setISOWeek(new Date(2004, 7, 7), 53)
   * //=> Sat Jan 01 2005 00:00:00
   */
  function setISOWeek (dirtyDate, dirtyISOWeek) {
    var date = parse_1(dirtyDate);
    var isoWeek = Number(dirtyISOWeek);
    var diff = get_iso_week(date) - isoWeek;
    date.setDate(date.getDate() - diff * 7);
    return date
  }

  var set_iso_week = setISOWeek;

  /**
   * @category Millisecond Helpers
   * @summary Set the milliseconds to the given date.
   *
   * @description
   * Set the milliseconds to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} milliseconds - the milliseconds of the new date
   * @returns {Date} the new date with the milliseconds setted
   *
   * @example
   * // Set 300 milliseconds to 1 September 2014 11:30:40.500:
   * var result = setMilliseconds(new Date(2014, 8, 1, 11, 30, 40, 500), 300)
   * //=> Mon Sep 01 2014 11:30:40.300
   */
  function setMilliseconds (dirtyDate, dirtyMilliseconds) {
    var date = parse_1(dirtyDate);
    var milliseconds = Number(dirtyMilliseconds);
    date.setMilliseconds(milliseconds);
    return date
  }

  var set_milliseconds = setMilliseconds;

  /**
   * @category Minute Helpers
   * @summary Set the minutes to the given date.
   *
   * @description
   * Set the minutes to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} minutes - the minutes of the new date
   * @returns {Date} the new date with the minutes setted
   *
   * @example
   * // Set 45 minutes to 1 September 2014 11:30:40:
   * var result = setMinutes(new Date(2014, 8, 1, 11, 30, 40), 45)
   * //=> Mon Sep 01 2014 11:45:40
   */
  function setMinutes (dirtyDate, dirtyMinutes) {
    var date = parse_1(dirtyDate);
    var minutes = Number(dirtyMinutes);
    date.setMinutes(minutes);
    return date
  }

  var set_minutes = setMinutes;

  /**
   * @category Month Helpers
   * @summary Set the month to the given date.
   *
   * @description
   * Set the month to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} month - the month of the new date
   * @returns {Date} the new date with the month setted
   *
   * @example
   * // Set February to 1 September 2014:
   * var result = setMonth(new Date(2014, 8, 1), 1)
   * //=> Sat Feb 01 2014 00:00:00
   */
  function setMonth (dirtyDate, dirtyMonth) {
    var date = parse_1(dirtyDate);
    var month = Number(dirtyMonth);
    var year = date.getFullYear();
    var day = date.getDate();

    var dateWithDesiredMonth = new Date(0);
    dateWithDesiredMonth.setFullYear(year, month, 15);
    dateWithDesiredMonth.setHours(0, 0, 0, 0);
    var daysInMonth = get_days_in_month(dateWithDesiredMonth);
    // Set the last day of the new month
    // if the original date was the last day of the longer month
    date.setMonth(month, Math.min(day, daysInMonth));
    return date
  }

  var set_month = setMonth;

  /**
   * @category Quarter Helpers
   * @summary Set the year quarter to the given date.
   *
   * @description
   * Set the year quarter to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} quarter - the quarter of the new date
   * @returns {Date} the new date with the quarter setted
   *
   * @example
   * // Set the 2nd quarter to 2 July 2014:
   * var result = setQuarter(new Date(2014, 6, 2), 2)
   * //=> Wed Apr 02 2014 00:00:00
   */
  function setQuarter (dirtyDate, dirtyQuarter) {
    var date = parse_1(dirtyDate);
    var quarter = Number(dirtyQuarter);
    var oldQuarter = Math.floor(date.getMonth() / 3) + 1;
    var diff = quarter - oldQuarter;
    return set_month(date, date.getMonth() + diff * 3)
  }

  var set_quarter = setQuarter;

  /**
   * @category Second Helpers
   * @summary Set the seconds to the given date.
   *
   * @description
   * Set the seconds to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} seconds - the seconds of the new date
   * @returns {Date} the new date with the seconds setted
   *
   * @example
   * // Set 45 seconds to 1 September 2014 11:30:40:
   * var result = setSeconds(new Date(2014, 8, 1, 11, 30, 40), 45)
   * //=> Mon Sep 01 2014 11:30:45
   */
  function setSeconds (dirtyDate, dirtySeconds) {
    var date = parse_1(dirtyDate);
    var seconds = Number(dirtySeconds);
    date.setSeconds(seconds);
    return date
  }

  var set_seconds = setSeconds;

  /**
   * @category Year Helpers
   * @summary Set the year to the given date.
   *
   * @description
   * Set the year to the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} year - the year of the new date
   * @returns {Date} the new date with the year setted
   *
   * @example
   * // Set year 2013 to 1 September 2014:
   * var result = setYear(new Date(2014, 8, 1), 2013)
   * //=> Sun Sep 01 2013 00:00:00
   */
  function setYear (dirtyDate, dirtyYear) {
    var date = parse_1(dirtyDate);
    var year = Number(dirtyYear);
    date.setFullYear(year);
    return date
  }

  var set_year = setYear;

  /**
   * @category Month Helpers
   * @summary Return the start of a month for the given date.
   *
   * @description
   * Return the start of a month for the given date.
   * The result will be in the local timezone.
   *
   * @param {Date|String|Number} date - the original date
   * @returns {Date} the start of a month
   *
   * @example
   * // The start of a month for 2 September 2014 11:55:00:
   * var result = startOfMonth(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Mon Sep 01 2014 00:00:00
   */
  function startOfMonth (dirtyDate) {
    var date = parse_1(dirtyDate);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var start_of_month = startOfMonth;

  /**
   * @category Day Helpers
   * @summary Return the start of today.
   *
   * @description
   * Return the start of today.
   *
   * @returns {Date} the start of today
   *
   * @example
   * // If today is 6 October 2014:
   * var result = startOfToday()
   * //=> Mon Oct 6 2014 00:00:00
   */
  function startOfToday () {
    return start_of_day(new Date())
  }

  var start_of_today = startOfToday;

  /**
   * @category Day Helpers
   * @summary Return the start of tomorrow.
   *
   * @description
   * Return the start of tomorrow.
   *
   * @returns {Date} the start of tomorrow
   *
   * @example
   * // If today is 6 October 2014:
   * var result = startOfTomorrow()
   * //=> Tue Oct 7 2014 00:00:00
   */
  function startOfTomorrow () {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var day = now.getDate();

    var date = new Date(0);
    date.setFullYear(year, month, day + 1);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var start_of_tomorrow = startOfTomorrow;

  /**
   * @category Day Helpers
   * @summary Return the start of yesterday.
   *
   * @description
   * Return the start of yesterday.
   *
   * @returns {Date} the start of yesterday
   *
   * @example
   * // If today is 6 October 2014:
   * var result = startOfYesterday()
   * //=> Sun Oct 5 2014 00:00:00
   */
  function startOfYesterday () {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var day = now.getDate();

    var date = new Date(0);
    date.setFullYear(year, month, day - 1);
    date.setHours(0, 0, 0, 0);
    return date
  }

  var start_of_yesterday = startOfYesterday;

  /**
   * @category Day Helpers
   * @summary Subtract the specified number of days from the given date.
   *
   * @description
   * Subtract the specified number of days from the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of days to be subtracted
   * @returns {Date} the new date with the days subtracted
   *
   * @example
   * // Subtract 10 days from 1 September 2014:
   * var result = subDays(new Date(2014, 8, 1), 10)
   * //=> Fri Aug 22 2014 00:00:00
   */
  function subDays (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_days(dirtyDate, -amount)
  }

  var sub_days = subDays;

  /**
   * @category Hour Helpers
   * @summary Subtract the specified number of hours from the given date.
   *
   * @description
   * Subtract the specified number of hours from the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of hours to be subtracted
   * @returns {Date} the new date with the hours subtracted
   *
   * @example
   * // Subtract 2 hours from 11 July 2014 01:00:00:
   * var result = subHours(new Date(2014, 6, 11, 1, 0), 2)
   * //=> Thu Jul 10 2014 23:00:00
   */
  function subHours (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_hours(dirtyDate, -amount)
  }

  var sub_hours = subHours;

  /**
   * @category Millisecond Helpers
   * @summary Subtract the specified number of milliseconds from the given date.
   *
   * @description
   * Subtract the specified number of milliseconds from the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of milliseconds to be subtracted
   * @returns {Date} the new date with the milliseconds subtracted
   *
   * @example
   * // Subtract 750 milliseconds from 10 July 2014 12:45:30.000:
   * var result = subMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
   * //=> Thu Jul 10 2014 12:45:29.250
   */
  function subMilliseconds (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_milliseconds(dirtyDate, -amount)
  }

  var sub_milliseconds = subMilliseconds;

  /**
   * @category Minute Helpers
   * @summary Subtract the specified number of minutes from the given date.
   *
   * @description
   * Subtract the specified number of minutes from the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of minutes to be subtracted
   * @returns {Date} the new date with the mintues subtracted
   *
   * @example
   * // Subtract 30 minutes from 10 July 2014 12:00:00:
   * var result = subMinutes(new Date(2014, 6, 10, 12, 0), 30)
   * //=> Thu Jul 10 2014 11:30:00
   */
  function subMinutes (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_minutes(dirtyDate, -amount)
  }

  var sub_minutes = subMinutes;

  /**
   * @category Month Helpers
   * @summary Subtract the specified number of months from the given date.
   *
   * @description
   * Subtract the specified number of months from the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of months to be subtracted
   * @returns {Date} the new date with the months subtracted
   *
   * @example
   * // Subtract 5 months from 1 February 2015:
   * var result = subMonths(new Date(2015, 1, 1), 5)
   * //=> Mon Sep 01 2014 00:00:00
   */
  function subMonths (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_months(dirtyDate, -amount)
  }

  var sub_months = subMonths;

  /**
   * @category Quarter Helpers
   * @summary Subtract the specified number of year quarters from the given date.
   *
   * @description
   * Subtract the specified number of year quarters from the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of quarters to be subtracted
   * @returns {Date} the new date with the quarters subtracted
   *
   * @example
   * // Subtract 3 quarters from 1 September 2014:
   * var result = subQuarters(new Date(2014, 8, 1), 3)
   * //=> Sun Dec 01 2013 00:00:00
   */
  function subQuarters (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_quarters(dirtyDate, -amount)
  }

  var sub_quarters = subQuarters;

  /**
   * @category Second Helpers
   * @summary Subtract the specified number of seconds from the given date.
   *
   * @description
   * Subtract the specified number of seconds from the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of seconds to be subtracted
   * @returns {Date} the new date with the seconds subtracted
   *
   * @example
   * // Subtract 30 seconds from 10 July 2014 12:45:00:
   * var result = subSeconds(new Date(2014, 6, 10, 12, 45, 0), 30)
   * //=> Thu Jul 10 2014 12:44:30
   */
  function subSeconds (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_seconds(dirtyDate, -amount)
  }

  var sub_seconds = subSeconds;

  /**
   * @category Week Helpers
   * @summary Subtract the specified number of weeks from the given date.
   *
   * @description
   * Subtract the specified number of weeks from the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of weeks to be subtracted
   * @returns {Date} the new date with the weeks subtracted
   *
   * @example
   * // Subtract 4 weeks from 1 September 2014:
   * var result = subWeeks(new Date(2014, 8, 1), 4)
   * //=> Mon Aug 04 2014 00:00:00
   */
  function subWeeks (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_weeks(dirtyDate, -amount)
  }

  var sub_weeks = subWeeks;

  /**
   * @category Year Helpers
   * @summary Subtract the specified number of years from the given date.
   *
   * @description
   * Subtract the specified number of years from the given date.
   *
   * @param {Date|String|Number} date - the date to be changed
   * @param {Number} amount - the amount of years to be subtracted
   * @returns {Date} the new date with the years subtracted
   *
   * @example
   * // Subtract 5 years from 1 September 2014:
   * var result = subYears(new Date(2014, 8, 1), 5)
   * //=> Tue Sep 01 2009 00:00:00
   */
  function subYears (dirtyDate, dirtyAmount) {
    var amount = Number(dirtyAmount);
    return add_years(dirtyDate, -amount)
  }

  var sub_years = subYears;

  var dateFns = {
    addDays: add_days,
    addHours: add_hours,
    addISOYears: add_iso_years,
    addMilliseconds: add_milliseconds,
    addMinutes: add_minutes,
    addMonths: add_months,
    addQuarters: add_quarters,
    addSeconds: add_seconds,
    addWeeks: add_weeks,
    addYears: add_years,
    areRangesOverlapping: are_ranges_overlapping,
    closestIndexTo: closest_index_to,
    closestTo: closest_to,
    compareAsc: compare_asc,
    compareDesc: compare_desc,
    differenceInCalendarDays: difference_in_calendar_days,
    differenceInCalendarISOWeeks: difference_in_calendar_iso_weeks,
    differenceInCalendarISOYears: difference_in_calendar_iso_years,
    differenceInCalendarMonths: difference_in_calendar_months,
    differenceInCalendarQuarters: difference_in_calendar_quarters,
    differenceInCalendarWeeks: difference_in_calendar_weeks,
    differenceInCalendarYears: difference_in_calendar_years,
    differenceInDays: difference_in_days,
    differenceInHours: difference_in_hours,
    differenceInISOYears: difference_in_iso_years,
    differenceInMilliseconds: difference_in_milliseconds,
    differenceInMinutes: difference_in_minutes,
    differenceInMonths: difference_in_months,
    differenceInQuarters: difference_in_quarters,
    differenceInSeconds: difference_in_seconds,
    differenceInWeeks: difference_in_weeks,
    differenceInYears: difference_in_years,
    distanceInWords: distance_in_words,
    distanceInWordsStrict: distance_in_words_strict,
    distanceInWordsToNow: distance_in_words_to_now,
    eachDay: each_day,
    endOfDay: end_of_day,
    endOfHour: end_of_hour,
    endOfISOWeek: end_of_iso_week,
    endOfISOYear: end_of_iso_year,
    endOfMinute: end_of_minute,
    endOfMonth: end_of_month,
    endOfQuarter: end_of_quarter,
    endOfSecond: end_of_second,
    endOfToday: end_of_today,
    endOfTomorrow: end_of_tomorrow,
    endOfWeek: end_of_week,
    endOfYear: end_of_year,
    endOfYesterday: end_of_yesterday,
    format: format_1,
    getDate: get_date,
    getDay: get_day,
    getDayOfYear: get_day_of_year,
    getDaysInMonth: get_days_in_month,
    getDaysInYear: get_days_in_year,
    getHours: get_hours,
    getISODay: get_iso_day,
    getISOWeek: get_iso_week,
    getISOWeeksInYear: get_iso_weeks_in_year,
    getISOYear: get_iso_year,
    getMilliseconds: get_milliseconds,
    getMinutes: get_minutes,
    getMonth: get_month,
    getOverlappingDaysInRanges: get_overlapping_days_in_ranges,
    getQuarter: get_quarter,
    getSeconds: get_seconds,
    getTime: get_time,
    getYear: get_year,
    isAfter: is_after,
    isBefore: is_before,
    isDate: is_date,
    isEqual: is_equal,
    isFirstDayOfMonth: is_first_day_of_month,
    isFriday: is_friday,
    isFuture: is_future,
    isLastDayOfMonth: is_last_day_of_month,
    isLeapYear: is_leap_year,
    isMonday: is_monday,
    isPast: is_past,
    isSameDay: is_same_day,
    isSameHour: is_same_hour,
    isSameISOWeek: is_same_iso_week,
    isSameISOYear: is_same_iso_year,
    isSameMinute: is_same_minute,
    isSameMonth: is_same_month,
    isSameQuarter: is_same_quarter,
    isSameSecond: is_same_second,
    isSameWeek: is_same_week,
    isSameYear: is_same_year,
    isSaturday: is_saturday,
    isSunday: is_sunday,
    isThisHour: is_this_hour,
    isThisISOWeek: is_this_iso_week,
    isThisISOYear: is_this_iso_year,
    isThisMinute: is_this_minute,
    isThisMonth: is_this_month,
    isThisQuarter: is_this_quarter,
    isThisSecond: is_this_second,
    isThisWeek: is_this_week,
    isThisYear: is_this_year,
    isThursday: is_thursday,
    isToday: is_today,
    isTomorrow: is_tomorrow,
    isTuesday: is_tuesday,
    isValid: is_valid,
    isWednesday: is_wednesday,
    isWeekend: is_weekend,
    isWithinRange: is_within_range,
    isYesterday: is_yesterday,
    lastDayOfISOWeek: last_day_of_iso_week,
    lastDayOfISOYear: last_day_of_iso_year,
    lastDayOfMonth: last_day_of_month,
    lastDayOfQuarter: last_day_of_quarter,
    lastDayOfWeek: last_day_of_week,
    lastDayOfYear: last_day_of_year,
    max: max_1,
    min: min_1,
    parse: parse_1,
    setDate: set_date,
    setDay: set_day,
    setDayOfYear: set_day_of_year,
    setHours: set_hours,
    setISODay: set_iso_day,
    setISOWeek: set_iso_week,
    setISOYear: set_iso_year,
    setMilliseconds: set_milliseconds,
    setMinutes: set_minutes,
    setMonth: set_month,
    setQuarter: set_quarter,
    setSeconds: set_seconds,
    setYear: set_year,
    startOfDay: start_of_day,
    startOfHour: start_of_hour,
    startOfISOWeek: start_of_iso_week,
    startOfISOYear: start_of_iso_year,
    startOfMinute: start_of_minute,
    startOfMonth: start_of_month,
    startOfQuarter: start_of_quarter,
    startOfSecond: start_of_second,
    startOfToday: start_of_today,
    startOfTomorrow: start_of_tomorrow,
    startOfWeek: start_of_week,
    startOfYear: start_of_year,
    startOfYesterday: start_of_yesterday,
    subDays: sub_days,
    subHours: sub_hours,
    subISOYears: sub_iso_years,
    subMilliseconds: sub_milliseconds,
    subMinutes: sub_minutes,
    subMonths: sub_months,
    subQuarters: sub_quarters,
    subSeconds: sub_seconds,
    subWeeks: sub_weeks,
    subYears: sub_years
  };
  var dateFns_50 = dateFns.format;

  var numeral = createCommonjsModule(function (module) {
  /*! @preserve
   * numeral.js
   * version : 2.0.6
   * author : Adam Draper
   * license : MIT
   * http://adamwdraper.github.com/Numeral-js/
   */

  (function (global, factory) {
      if (module.exports) {
          module.exports = factory();
      } else {
          global.numeral = factory();
      }
  }(commonjsGlobal, function () {
      /************************************
          Variables
      ************************************/

      var numeral,
          _,
          VERSION = '2.0.6',
          formats = {},
          locales = {},
          defaults = {
              currentLocale: 'en',
              zeroFormat: null,
              nullFormat: null,
              defaultFormat: '0,0',
              scalePercentBy100: true
          },
          options = {
              currentLocale: defaults.currentLocale,
              zeroFormat: defaults.zeroFormat,
              nullFormat: defaults.nullFormat,
              defaultFormat: defaults.defaultFormat,
              scalePercentBy100: defaults.scalePercentBy100
          };


      /************************************
          Constructors
      ************************************/

      // Numeral prototype object
      function Numeral(input, number) {
          this._input = input;

          this._value = number;
      }

      numeral = function(input) {
          var value,
              kind,
              unformatFunction,
              regexp;

          if (numeral.isNumeral(input)) {
              value = input.value();
          } else if (input === 0 || typeof input === 'undefined') {
              value = 0;
          } else if (input === null || _.isNaN(input)) {
              value = null;
          } else if (typeof input === 'string') {
              if (options.zeroFormat && input === options.zeroFormat) {
                  value = 0;
              } else if (options.nullFormat && input === options.nullFormat || !input.replace(/[^0-9]+/g, '').length) {
                  value = null;
              } else {
                  for (kind in formats) {
                      regexp = typeof formats[kind].regexps.unformat === 'function' ? formats[kind].regexps.unformat() : formats[kind].regexps.unformat;

                      if (regexp && input.match(regexp)) {
                          unformatFunction = formats[kind].unformat;

                          break;
                      }
                  }

                  unformatFunction = unformatFunction || numeral._.stringToNumber;

                  value = unformatFunction(input);
              }
          } else {
              value = Number(input)|| null;
          }

          return new Numeral(input, value);
      };

      // version number
      numeral.version = VERSION;

      // compare numeral object
      numeral.isNumeral = function(obj) {
          return obj instanceof Numeral;
      };

      // helper functions
      numeral._ = _ = {
          // formats numbers separators, decimals places, signs, abbreviations
          numberToFormat: function(value, format, roundingFunction) {
              var locale = locales[numeral.options.currentLocale],
                  negP = false,
                  optDec = false,
                  leadingCount = 0,
                  abbr = '',
                  trillion = 1000000000000,
                  billion = 1000000000,
                  million = 1000000,
                  thousand = 1000,
                  decimal = '',
                  neg = false,
                  abbrForce, // force abbreviation
                  abs,
                  int,
                  precision,
                  signed,
                  thousands,
                  output;

              // make sure we never format a null value
              value = value || 0;

              abs = Math.abs(value);

              // see if we should use parentheses for negative number or if we should prefix with a sign
              // if both are present we default to parentheses
              if (numeral._.includes(format, '(')) {
                  negP = true;
                  format = format.replace(/[\(|\)]/g, '');
              } else if (numeral._.includes(format, '+') || numeral._.includes(format, '-')) {
                  signed = numeral._.includes(format, '+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
                  format = format.replace(/[\+|\-]/g, '');
              }

              // see if abbreviation is wanted
              if (numeral._.includes(format, 'a')) {
                  abbrForce = format.match(/a(k|m|b|t)?/);

                  abbrForce = abbrForce ? abbrForce[1] : false;

                  // check for space before abbreviation
                  if (numeral._.includes(format, ' a')) {
                      abbr = ' ';
                  }

                  format = format.replace(new RegExp(abbr + 'a[kmbt]?'), '');

                  if (abs >= trillion && !abbrForce || abbrForce === 't') {
                      // trillion
                      abbr += locale.abbreviations.trillion;
                      value = value / trillion;
                  } else if (abs < trillion && abs >= billion && !abbrForce || abbrForce === 'b') {
                      // billion
                      abbr += locale.abbreviations.billion;
                      value = value / billion;
                  } else if (abs < billion && abs >= million && !abbrForce || abbrForce === 'm') {
                      // million
                      abbr += locale.abbreviations.million;
                      value = value / million;
                  } else if (abs < million && abs >= thousand && !abbrForce || abbrForce === 'k') {
                      // thousand
                      abbr += locale.abbreviations.thousand;
                      value = value / thousand;
                  }
              }

              // check for optional decimals
              if (numeral._.includes(format, '[.]')) {
                  optDec = true;
                  format = format.replace('[.]', '.');
              }

              // break number and format
              int = value.toString().split('.')[0];
              precision = format.split('.')[1];
              thousands = format.indexOf(',');
              leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;

              if (precision) {
                  if (numeral._.includes(precision, '[')) {
                      precision = precision.replace(']', '');
                      precision = precision.split('[');
                      decimal = numeral._.toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                  } else {
                      decimal = numeral._.toFixed(value, precision.length, roundingFunction);
                  }

                  int = decimal.split('.')[0];

                  if (numeral._.includes(decimal, '.')) {
                      decimal = locale.delimiters.decimal + decimal.split('.')[1];
                  } else {
                      decimal = '';
                  }

                  if (optDec && Number(decimal.slice(1)) === 0) {
                      decimal = '';
                  }
              } else {
                  int = numeral._.toFixed(value, 0, roundingFunction);
              }

              // check abbreviation again after rounding
              if (abbr && !abbrForce && Number(int) >= 1000 && abbr !== locale.abbreviations.trillion) {
                  int = String(Number(int) / 1000);

                  switch (abbr) {
                      case locale.abbreviations.thousand:
                          abbr = locale.abbreviations.million;
                          break;
                      case locale.abbreviations.million:
                          abbr = locale.abbreviations.billion;
                          break;
                      case locale.abbreviations.billion:
                          abbr = locale.abbreviations.trillion;
                          break;
                  }
              }


              // format number
              if (numeral._.includes(int, '-')) {
                  int = int.slice(1);
                  neg = true;
              }

              if (int.length < leadingCount) {
                  for (var i = leadingCount - int.length; i > 0; i--) {
                      int = '0' + int;
                  }
              }

              if (thousands > -1) {
                  int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + locale.delimiters.thousands);
              }

              if (format.indexOf('.') === 0) {
                  int = '';
              }

              output = int + decimal + (abbr ? abbr : '');

              if (negP) {
                  output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
              } else {
                  if (signed >= 0) {
                      output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
                  } else if (neg) {
                      output = '-' + output;
                  }
              }

              return output;
          },
          // unformats numbers separators, decimals places, signs, abbreviations
          stringToNumber: function(string) {
              var locale = locales[options.currentLocale],
                  stringOriginal = string,
                  abbreviations = {
                      thousand: 3,
                      million: 6,
                      billion: 9,
                      trillion: 12
                  },
                  abbreviation,
                  value,
                  regexp;

              if (options.zeroFormat && string === options.zeroFormat) {
                  value = 0;
              } else if (options.nullFormat && string === options.nullFormat || !string.replace(/[^0-9]+/g, '').length) {
                  value = null;
              } else {
                  value = 1;

                  if (locale.delimiters.decimal !== '.') {
                      string = string.replace(/\./g, '').replace(locale.delimiters.decimal, '.');
                  }

                  for (abbreviation in abbreviations) {
                      regexp = new RegExp('[^a-zA-Z]' + locale.abbreviations[abbreviation] + '(?:\\)|(\\' + locale.currency.symbol + ')?(?:\\))?)?$');

                      if (stringOriginal.match(regexp)) {
                          value *= Math.pow(10, abbreviations[abbreviation]);
                          break;
                      }
                  }

                  // check for negative number
                  value *= (string.split('-').length + Math.min(string.split('(').length - 1, string.split(')').length - 1)) % 2 ? 1 : -1;

                  // remove non numbers
                  string = string.replace(/[^0-9\.]+/g, '');

                  value *= Number(string);
              }

              return value;
          },
          isNaN: function(value) {
              return typeof value === 'number' && isNaN(value);
          },
          includes: function(string, search) {
              return string.indexOf(search) !== -1;
          },
          insert: function(string, subString, start) {
              return string.slice(0, start) + subString + string.slice(start);
          },
          reduce: function(array, callback /*, initialValue*/) {
              if (this === null) {
                  throw new TypeError('Array.prototype.reduce called on null or undefined');
              }

              if (typeof callback !== 'function') {
                  throw new TypeError(callback + ' is not a function');
              }

              var t = Object(array),
                  len = t.length >>> 0,
                  k = 0,
                  value;

              if (arguments.length === 3) {
                  value = arguments[2];
              } else {
                  while (k < len && !(k in t)) {
                      k++;
                  }

                  if (k >= len) {
                      throw new TypeError('Reduce of empty array with no initial value');
                  }

                  value = t[k++];
              }
              for (; k < len; k++) {
                  if (k in t) {
                      value = callback(value, t[k], k, t);
                  }
              }
              return value;
          },
          /**
           * Computes the multiplier necessary to make x >= 1,
           * effectively eliminating miscalculations caused by
           * finite precision.
           */
          multiplier: function (x) {
              var parts = x.toString().split('.');

              return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
          },
          /**
           * Given a variable number of arguments, returns the maximum
           * multiplier that must be used to normalize an operation involving
           * all of them.
           */
          correctionFactor: function () {
              var args = Array.prototype.slice.call(arguments);

              return args.reduce(function(accum, next) {
                  var mn = _.multiplier(next);
                  return accum > mn ? accum : mn;
              }, 1);
          },
          /**
           * Implementation of toFixed() that treats floats more like decimals
           *
           * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
           * problems for accounting- and finance-related software.
           */
          toFixed: function(value, maxDecimals, roundingFunction, optionals) {
              var splitValue = value.toString().split('.'),
                  minDecimals = maxDecimals - (optionals || 0),
                  boundedPrecision,
                  optionalsRegExp,
                  power,
                  output;

              // Use the smallest precision value possible to avoid errors from floating point representation
              if (splitValue.length === 2) {
                boundedPrecision = Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals);
              } else {
                boundedPrecision = minDecimals;
              }

              power = Math.pow(10, boundedPrecision);

              // Multiply up by precision, round accurately, then divide and use native toFixed():
              output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);

              if (optionals > maxDecimals - boundedPrecision) {
                  optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
                  output = output.replace(optionalsRegExp, '');
              }

              return output;
          }
      };

      // avaliable options
      numeral.options = options;

      // avaliable formats
      numeral.formats = formats;

      // avaliable formats
      numeral.locales = locales;

      // This function sets the current locale.  If
      // no arguments are passed in, it will simply return the current global
      // locale key.
      numeral.locale = function(key) {
          if (key) {
              options.currentLocale = key.toLowerCase();
          }

          return options.currentLocale;
      };

      // This function provides access to the loaded locale data.  If
      // no arguments are passed in, it will simply return the current
      // global locale object.
      numeral.localeData = function(key) {
          if (!key) {
              return locales[options.currentLocale];
          }

          key = key.toLowerCase();

          if (!locales[key]) {
              throw new Error('Unknown locale : ' + key);
          }

          return locales[key];
      };

      numeral.reset = function() {
          for (var property in defaults) {
              options[property] = defaults[property];
          }
      };

      numeral.zeroFormat = function(format) {
          options.zeroFormat = typeof(format) === 'string' ? format : null;
      };

      numeral.nullFormat = function (format) {
          options.nullFormat = typeof(format) === 'string' ? format : null;
      };

      numeral.defaultFormat = function(format) {
          options.defaultFormat = typeof(format) === 'string' ? format : '0.0';
      };

      numeral.register = function(type, name, format) {
          name = name.toLowerCase();

          if (this[type + 's'][name]) {
              throw new TypeError(name + ' ' + type + ' already registered.');
          }

          this[type + 's'][name] = format;

          return format;
      };


      numeral.validate = function(val, culture) {
          var _decimalSep,
              _thousandSep,
              _currSymbol,
              _valArray,
              _abbrObj,
              _thousandRegEx,
              localeData,
              temp;

          //coerce val to string
          if (typeof val !== 'string') {
              val += '';

              if (console.warn) {
                  console.warn('Numeral.js: Value is not string. It has been co-erced to: ', val);
              }
          }

          //trim whitespaces from either sides
          val = val.trim();

          //if val is just digits return true
          if (!!val.match(/^\d+$/)) {
              return true;
          }

          //if val is empty return false
          if (val === '') {
              return false;
          }

          //get the decimal and thousands separator from numeral.localeData
          try {
              //check if the culture is understood by numeral. if not, default it to current locale
              localeData = numeral.localeData(culture);
          } catch (e) {
              localeData = numeral.localeData(numeral.locale());
          }

          //setup the delimiters and currency symbol based on culture/locale
          _currSymbol = localeData.currency.symbol;
          _abbrObj = localeData.abbreviations;
          _decimalSep = localeData.delimiters.decimal;
          if (localeData.delimiters.thousands === '.') {
              _thousandSep = '\\.';
          } else {
              _thousandSep = localeData.delimiters.thousands;
          }

          // validating currency symbol
          temp = val.match(/^[^\d]+/);
          if (temp !== null) {
              val = val.substr(1);
              if (temp[0] !== _currSymbol) {
                  return false;
              }
          }

          //validating abbreviation symbol
          temp = val.match(/[^\d]+$/);
          if (temp !== null) {
              val = val.slice(0, -1);
              if (temp[0] !== _abbrObj.thousand && temp[0] !== _abbrObj.million && temp[0] !== _abbrObj.billion && temp[0] !== _abbrObj.trillion) {
                  return false;
              }
          }

          _thousandRegEx = new RegExp(_thousandSep + '{2}');

          if (!val.match(/[^\d.,]/g)) {
              _valArray = val.split(_decimalSep);
              if (_valArray.length > 2) {
                  return false;
              } else {
                  if (_valArray.length < 2) {
                      return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx));
                  } else {
                      if (_valArray[0].length === 1) {
                          return ( !! _valArray[0].match(/^\d+$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                      } else {
                          return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                      }
                  }
              }
          }

          return false;
      };


      /************************************
          Numeral Prototype
      ************************************/

      numeral.fn = Numeral.prototype = {
          clone: function() {
              return numeral(this);
          },
          format: function(inputString, roundingFunction) {
              var value = this._value,
                  format = inputString || options.defaultFormat,
                  kind,
                  output,
                  formatFunction;

              // make sure we have a roundingFunction
              roundingFunction = roundingFunction || Math.round;

              // format based on value
              if (value === 0 && options.zeroFormat !== null) {
                  output = options.zeroFormat;
              } else if (value === null && options.nullFormat !== null) {
                  output = options.nullFormat;
              } else {
                  for (kind in formats) {
                      if (format.match(formats[kind].regexps.format)) {
                          formatFunction = formats[kind].format;

                          break;
                      }
                  }

                  formatFunction = formatFunction || numeral._.numberToFormat;

                  output = formatFunction(value, format, roundingFunction);
              }

              return output;
          },
          value: function() {
              return this._value;
          },
          input: function() {
              return this._input;
          },
          set: function(value) {
              this._value = Number(value);

              return this;
          },
          add: function(value) {
              var corrFactor = _.correctionFactor.call(null, this._value, value);

              function cback(accum, curr, currI, O) {
                  return accum + Math.round(corrFactor * curr);
              }

              this._value = _.reduce([this._value, value], cback, 0) / corrFactor;

              return this;
          },
          subtract: function(value) {
              var corrFactor = _.correctionFactor.call(null, this._value, value);

              function cback(accum, curr, currI, O) {
                  return accum - Math.round(corrFactor * curr);
              }

              this._value = _.reduce([value], cback, Math.round(this._value * corrFactor)) / corrFactor;

              return this;
          },
          multiply: function(value) {
              function cback(accum, curr, currI, O) {
                  var corrFactor = _.correctionFactor(accum, curr);
                  return Math.round(accum * corrFactor) * Math.round(curr * corrFactor) / Math.round(corrFactor * corrFactor);
              }

              this._value = _.reduce([this._value, value], cback, 1);

              return this;
          },
          divide: function(value) {
              function cback(accum, curr, currI, O) {
                  var corrFactor = _.correctionFactor(accum, curr);
                  return Math.round(accum * corrFactor) / Math.round(curr * corrFactor);
              }

              this._value = _.reduce([this._value, value], cback);

              return this;
          },
          difference: function(value) {
              return Math.abs(numeral(this._value).subtract(value).value());
          }
      };

      /************************************
          Default Locale && Format
      ************************************/

      numeral.register('locale', 'en', {
          delimiters: {
              thousands: ',',
              decimal: '.'
          },
          abbreviations: {
              thousand: 'k',
              million: 'm',
              billion: 'b',
              trillion: 't'
          },
          ordinal: function(number) {
              var b = number % 10;
              return (~~(number % 100 / 10) === 1) ? 'th' :
                  (b === 1) ? 'st' :
                  (b === 2) ? 'nd' :
                  (b === 3) ? 'rd' : 'th';
          },
          currency: {
              symbol: '$'
          }
      });

      

  (function() {
          numeral.register('format', 'bps', {
              regexps: {
                  format: /(BPS)/,
                  unformat: /(BPS)/
              },
              format: function(value, format, roundingFunction) {
                  var space = numeral._.includes(format, ' BPS') ? ' ' : '',
                      output;

                  value = value * 10000;

                  // check for space before BPS
                  format = format.replace(/\s?BPS/, '');

                  output = numeral._.numberToFormat(value, format, roundingFunction);

                  if (numeral._.includes(output, ')')) {
                      output = output.split('');

                      output.splice(-1, 0, space + 'BPS');

                      output = output.join('');
                  } else {
                      output = output + space + 'BPS';
                  }

                  return output;
              },
              unformat: function(string) {
                  return +(numeral._.stringToNumber(string) * 0.0001).toFixed(15);
              }
          });
  })();


  (function() {
          var decimal = {
              base: 1000,
              suffixes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
          },
          binary = {
              base: 1024,
              suffixes: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
          };

      var allSuffixes =  decimal.suffixes.concat(binary.suffixes.filter(function (item) {
              return decimal.suffixes.indexOf(item) < 0;
          }));
          var unformatRegex = allSuffixes.join('|');
          // Allow support for BPS (http://www.investopedia.com/terms/b/basispoint.asp)
          unformatRegex = '(' + unformatRegex.replace('B', 'B(?!PS)') + ')';

      numeral.register('format', 'bytes', {
          regexps: {
              format: /([0\s]i?b)/,
              unformat: new RegExp(unformatRegex)
          },
          format: function(value, format, roundingFunction) {
              var output,
                  bytes = numeral._.includes(format, 'ib') ? binary : decimal,
                  suffix = numeral._.includes(format, ' b') || numeral._.includes(format, ' ib') ? ' ' : '',
                  power,
                  min,
                  max;

              // check for space before
              format = format.replace(/\s?i?b/, '');

              for (power = 0; power <= bytes.suffixes.length; power++) {
                  min = Math.pow(bytes.base, power);
                  max = Math.pow(bytes.base, power + 1);

                  if (value === null || value === 0 || value >= min && value < max) {
                      suffix += bytes.suffixes[power];

                      if (min > 0) {
                          value = value / min;
                      }

                      break;
                  }
              }

              output = numeral._.numberToFormat(value, format, roundingFunction);

              return output + suffix;
          },
          unformat: function(string) {
              var value = numeral._.stringToNumber(string),
                  power,
                  bytesMultiplier;

              if (value) {
                  for (power = decimal.suffixes.length - 1; power >= 0; power--) {
                      if (numeral._.includes(string, decimal.suffixes[power])) {
                          bytesMultiplier = Math.pow(decimal.base, power);

                          break;
                      }

                      if (numeral._.includes(string, binary.suffixes[power])) {
                          bytesMultiplier = Math.pow(binary.base, power);

                          break;
                      }
                  }

                  value *= (bytesMultiplier || 1);
              }

              return value;
          }
      });
  })();


  (function() {
          numeral.register('format', 'currency', {
          regexps: {
              format: /(\$)/
          },
          format: function(value, format, roundingFunction) {
              var locale = numeral.locales[numeral.options.currentLocale],
                  symbols = {
                      before: format.match(/^([\+|\-|\(|\s|\$]*)/)[0],
                      after: format.match(/([\+|\-|\)|\s|\$]*)$/)[0]
                  },
                  output,
                  symbol,
                  i;

              // strip format of spaces and $
              format = format.replace(/\s?\$\s?/, '');

              // format the number
              output = numeral._.numberToFormat(value, format, roundingFunction);

              // update the before and after based on value
              if (value >= 0) {
                  symbols.before = symbols.before.replace(/[\-\(]/, '');
                  symbols.after = symbols.after.replace(/[\-\)]/, '');
              } else if (value < 0 && (!numeral._.includes(symbols.before, '-') && !numeral._.includes(symbols.before, '('))) {
                  symbols.before = '-' + symbols.before;
              }

              // loop through each before symbol
              for (i = 0; i < symbols.before.length; i++) {
                  symbol = symbols.before[i];

                  switch (symbol) {
                      case '$':
                          output = numeral._.insert(output, locale.currency.symbol, i);
                          break;
                      case ' ':
                          output = numeral._.insert(output, ' ', i + locale.currency.symbol.length - 1);
                          break;
                  }
              }

              // loop through each after symbol
              for (i = symbols.after.length - 1; i >= 0; i--) {
                  symbol = symbols.after[i];

                  switch (symbol) {
                      case '$':
                          output = i === symbols.after.length - 1 ? output + locale.currency.symbol : numeral._.insert(output, locale.currency.symbol, -(symbols.after.length - (1 + i)));
                          break;
                      case ' ':
                          output = i === symbols.after.length - 1 ? output + ' ' : numeral._.insert(output, ' ', -(symbols.after.length - (1 + i) + locale.currency.symbol.length - 1));
                          break;
                  }
              }


              return output;
          }
      });
  })();


  (function() {
          numeral.register('format', 'exponential', {
          regexps: {
              format: /(e\+|e-)/,
              unformat: /(e\+|e-)/
          },
          format: function(value, format, roundingFunction) {
              var output,
                  exponential = typeof value === 'number' && !numeral._.isNaN(value) ? value.toExponential() : '0e+0',
                  parts = exponential.split('e');

              format = format.replace(/e[\+|\-]{1}0/, '');

              output = numeral._.numberToFormat(Number(parts[0]), format, roundingFunction);

              return output + 'e' + parts[1];
          },
          unformat: function(string) {
              var parts = numeral._.includes(string, 'e+') ? string.split('e+') : string.split('e-'),
                  value = Number(parts[0]),
                  power = Number(parts[1]);

              power = numeral._.includes(string, 'e-') ? power *= -1 : power;

              function cback(accum, curr, currI, O) {
                  var corrFactor = numeral._.correctionFactor(accum, curr),
                      num = (accum * corrFactor) * (curr * corrFactor) / (corrFactor * corrFactor);
                  return num;
              }

              return numeral._.reduce([value, Math.pow(10, power)], cback, 1);
          }
      });
  })();


  (function() {
          numeral.register('format', 'ordinal', {
          regexps: {
              format: /(o)/
          },
          format: function(value, format, roundingFunction) {
              var locale = numeral.locales[numeral.options.currentLocale],
                  output,
                  ordinal = numeral._.includes(format, ' o') ? ' ' : '';

              // check for space before
              format = format.replace(/\s?o/, '');

              ordinal += locale.ordinal(value);

              output = numeral._.numberToFormat(value, format, roundingFunction);

              return output + ordinal;
          }
      });
  })();


  (function() {
          numeral.register('format', 'percentage', {
          regexps: {
              format: /(%)/,
              unformat: /(%)/
          },
          format: function(value, format, roundingFunction) {
              var space = numeral._.includes(format, ' %') ? ' ' : '',
                  output;

              if (numeral.options.scalePercentBy100) {
                  value = value * 100;
              }

              // check for space before %
              format = format.replace(/\s?\%/, '');

              output = numeral._.numberToFormat(value, format, roundingFunction);

              if (numeral._.includes(output, ')')) {
                  output = output.split('');

                  output.splice(-1, 0, space + '%');

                  output = output.join('');
              } else {
                  output = output + space + '%';
              }

              return output;
          },
          unformat: function(string) {
              var number = numeral._.stringToNumber(string);
              if (numeral.options.scalePercentBy100) {
                  return number * 0.01;
              }
              return number;
          }
      });
  })();


  (function() {
          numeral.register('format', 'time', {
          regexps: {
              format: /(:)/,
              unformat: /(:)/
          },
          format: function(value, format, roundingFunction) {
              var hours = Math.floor(value / 60 / 60),
                  minutes = Math.floor((value - (hours * 60 * 60)) / 60),
                  seconds = Math.round(value - (hours * 60 * 60) - (minutes * 60));

              return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
          },
          unformat: function(string) {
              var timeArray = string.split(':'),
                  seconds = 0;

              // turn hours and minutes into seconds and add them all up
              if (timeArray.length === 3) {
                  // hours
                  seconds = seconds + (Number(timeArray[0]) * 60 * 60);
                  // minutes
                  seconds = seconds + (Number(timeArray[1]) * 60);
                  // seconds
                  seconds = seconds + Number(timeArray[2]);
              } else if (timeArray.length === 2) {
                  // minutes
                  seconds = seconds + (Number(timeArray[0]) * 60);
                  // seconds
                  seconds = seconds + Number(timeArray[1]);
              }
              return Number(seconds);
          }
      });
  })();

  return numeral;
  }));
  });

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */

  /**
   * WARNING: DO NOT manually require this module.
   * This is a replacement for `invariant(...)` used by the error code system
   * and will _only_ be required by the corresponding babel pass.
   * It always throws.
   */

  function reactProdInvariant(code) {
    var argCount = arguments.length - 1;

    var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

    for (var argIdx = 0; argIdx < argCount; argIdx++) {
      message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
    }

    message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

    var error = new Error(message);
    error.name = 'Invariant Violation';
    error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

    throw error;
  }

  var reactProdInvariant_1 = reactProdInvariant;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */

  var validateFormat = process.env.NODE_ENV !== "production" ? function (format) {} : function (format) {
    if (format === undefined) {
      throw new Error('invariant(...): Second argument must be a string.');
    }
  };
  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments to provide
   * information about what broke and what you were expecting.
   *
   * The invariant message will be stripped in production, but the invariant will
   * remain to ensure logic does not differ in production.
   */

  function invariant(condition, format) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    validateFormat(format);

    if (!condition) {
      var error;

      if (format === undefined) {
        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
      } else {
        var argIndex = 0;
        error = new Error(format.replace(/%s/g, function () {
          return String(args[argIndex++]);
        }));
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1; // Skip invariant's own stack frame.

      throw error;
    }
  }

  var invariant_1 = invariant;

  function checkMask(value, bitmask) {
    return (value & bitmask) === bitmask;
  }

  var DOMPropertyInjection = {
    /**
     * Mapping from normalized, camelcased property names to a configuration that
     * specifies how the associated DOM property should be accessed or rendered.
     */
    MUST_USE_PROPERTY: 0x1,
    HAS_BOOLEAN_VALUE: 0x4,
    HAS_NUMERIC_VALUE: 0x8,
    HAS_POSITIVE_NUMERIC_VALUE: 0x10 | 0x8,
    HAS_OVERLOADED_BOOLEAN_VALUE: 0x20,

    /**
     * Inject some specialized knowledge about the DOM. This takes a config object
     * with the following properties:
     *
     * isCustomAttribute: function that given an attribute name will return true
     * if it can be inserted into the DOM verbatim. Useful for data-* or aria-*
     * attributes where it's impossible to enumerate all of the possible
     * attribute names,
     *
     * Properties: object mapping DOM property name to one of the
     * DOMPropertyInjection constants or null. If your attribute isn't in here,
     * it won't get written to the DOM.
     *
     * DOMAttributeNames: object mapping React attribute name to the DOM
     * attribute name. Attribute names not specified use the **lowercase**
     * normalized name.
     *
     * DOMAttributeNamespaces: object mapping React attribute name to the DOM
     * attribute namespace URL. (Attribute names not specified use no namespace.)
     *
     * DOMPropertyNames: similar to DOMAttributeNames but for DOM properties.
     * Property names not specified use the normalized name.
     *
     * DOMMutationMethods: Properties that require special mutation methods. If
     * `value` is undefined, the mutation method should unset the property.
     *
     * @param {object} domPropertyConfig the config as described above.
     */
    injectDOMPropertyConfig: function (domPropertyConfig) {
      var Injection = DOMPropertyInjection;
      var Properties = domPropertyConfig.Properties || {};
      var DOMAttributeNamespaces = domPropertyConfig.DOMAttributeNamespaces || {};
      var DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
      var DOMPropertyNames = domPropertyConfig.DOMPropertyNames || {};
      var DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};

      if (domPropertyConfig.isCustomAttribute) {
        DOMProperty._isCustomAttributeFunctions.push(domPropertyConfig.isCustomAttribute);
      }

      for (var propName in Properties) {
        !!DOMProperty.properties.hasOwnProperty(propName) ? process.env.NODE_ENV !== 'production' ? invariant_1(false, 'injectDOMPropertyConfig(...): You\'re trying to inject DOM property \'%s\' which has already been injected. You may be accidentally injecting the same DOM property config twice, or you may be injecting two configs that have conflicting property names.', propName) : reactProdInvariant_1('48', propName) : void 0;

        var lowerCased = propName.toLowerCase();
        var propConfig = Properties[propName];

        var propertyInfo = {
          attributeName: lowerCased,
          attributeNamespace: null,
          propertyName: propName,
          mutationMethod: null,

          mustUseProperty: checkMask(propConfig, Injection.MUST_USE_PROPERTY),
          hasBooleanValue: checkMask(propConfig, Injection.HAS_BOOLEAN_VALUE),
          hasNumericValue: checkMask(propConfig, Injection.HAS_NUMERIC_VALUE),
          hasPositiveNumericValue: checkMask(propConfig, Injection.HAS_POSITIVE_NUMERIC_VALUE),
          hasOverloadedBooleanValue: checkMask(propConfig, Injection.HAS_OVERLOADED_BOOLEAN_VALUE)
        };
        !(propertyInfo.hasBooleanValue + propertyInfo.hasNumericValue + propertyInfo.hasOverloadedBooleanValue <= 1) ? process.env.NODE_ENV !== 'production' ? invariant_1(false, 'DOMProperty: Value can be one of boolean, overloaded boolean, or numeric value, but not a combination: %s', propName) : reactProdInvariant_1('50', propName) : void 0;

        if (process.env.NODE_ENV !== 'production') {
          DOMProperty.getPossibleStandardName[lowerCased] = propName;
        }

        if (DOMAttributeNames.hasOwnProperty(propName)) {
          var attributeName = DOMAttributeNames[propName];
          propertyInfo.attributeName = attributeName;
          if (process.env.NODE_ENV !== 'production') {
            DOMProperty.getPossibleStandardName[attributeName] = propName;
          }
        }

        if (DOMAttributeNamespaces.hasOwnProperty(propName)) {
          propertyInfo.attributeNamespace = DOMAttributeNamespaces[propName];
        }

        if (DOMPropertyNames.hasOwnProperty(propName)) {
          propertyInfo.propertyName = DOMPropertyNames[propName];
        }

        if (DOMMutationMethods.hasOwnProperty(propName)) {
          propertyInfo.mutationMethod = DOMMutationMethods[propName];
        }

        DOMProperty.properties[propName] = propertyInfo;
      }
    }
  };

  /* eslint-disable max-len */
  var ATTRIBUTE_NAME_START_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
  /* eslint-enable max-len */

  /**
   * DOMProperty exports lookup objects that can be used like functions:
   *
   *   > DOMProperty.isValid['id']
   *   true
   *   > DOMProperty.isValid['foobar']
   *   undefined
   *
   * Although this may be confusing, it performs better in general.
   *
   * @see http://jsperf.com/key-exists
   * @see http://jsperf.com/key-missing
   */
  var DOMProperty = {
    ID_ATTRIBUTE_NAME: 'data-reactid',
    ROOT_ATTRIBUTE_NAME: 'data-reactroot',

    ATTRIBUTE_NAME_START_CHAR: ATTRIBUTE_NAME_START_CHAR,
    ATTRIBUTE_NAME_CHAR: ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040',

    /**
     * Map from property "standard name" to an object with info about how to set
     * the property in the DOM. Each object contains:
     *
     * attributeName:
     *   Used when rendering markup or with `*Attribute()`.
     * attributeNamespace
     * propertyName:
     *   Used on DOM node instances. (This includes properties that mutate due to
     *   external factors.)
     * mutationMethod:
     *   If non-null, used instead of the property or `setAttribute()` after
     *   initial render.
     * mustUseProperty:
     *   Whether the property must be accessed and mutated as an object property.
     * hasBooleanValue:
     *   Whether the property should be removed when set to a falsey value.
     * hasNumericValue:
     *   Whether the property must be numeric or parse as a numeric and should be
     *   removed when set to a falsey value.
     * hasPositiveNumericValue:
     *   Whether the property must be positive numeric or parse as a positive
     *   numeric and should be removed when set to a falsey value.
     * hasOverloadedBooleanValue:
     *   Whether the property can be used as a flag as well as with a value.
     *   Removed when strictly equal to false; present without a value when
     *   strictly equal to true; present with a value otherwise.
     */
    properties: {},

    /**
     * Mapping from lowercase property names to the properly cased version, used
     * to warn in the case of missing properties. Available only in __DEV__.
     *
     * autofocus is predefined, because adding it to the property whitelist
     * causes unintended side effects.
     *
     * @type {Object}
     */
    getPossibleStandardName: process.env.NODE_ENV !== 'production' ? { autofocus: 'autoFocus' } : null,

    /**
     * All of the isCustomAttribute() functions that have been injected.
     */
    _isCustomAttributeFunctions: [],

    /**
     * Checks whether a property name is a custom attribute.
     * @method
     */
    isCustomAttribute: function (attributeName) {
      for (var i = 0; i < DOMProperty._isCustomAttributeFunctions.length; i++) {
        var isCustomAttributeFn = DOMProperty._isCustomAttributeFunctions[i];
        if (isCustomAttributeFn(attributeName)) {
          return true;
        }
      }
      return false;
    },

    injection: DOMPropertyInjection
  };

  var DOMProperty_1 = DOMProperty;

  var MUST_USE_PROPERTY = DOMProperty_1.injection.MUST_USE_PROPERTY;
  var HAS_BOOLEAN_VALUE = DOMProperty_1.injection.HAS_BOOLEAN_VALUE;
  var HAS_NUMERIC_VALUE = DOMProperty_1.injection.HAS_NUMERIC_VALUE;
  var HAS_POSITIVE_NUMERIC_VALUE = DOMProperty_1.injection.HAS_POSITIVE_NUMERIC_VALUE;
  var HAS_OVERLOADED_BOOLEAN_VALUE = DOMProperty_1.injection.HAS_OVERLOADED_BOOLEAN_VALUE;

  var HTMLDOMPropertyConfig = {
    isCustomAttribute: RegExp.prototype.test.bind(new RegExp('^(data|aria)-[' + DOMProperty_1.ATTRIBUTE_NAME_CHAR + ']*$')),
    Properties: {
      /**
       * Standard Properties
       */
      accept: 0,
      acceptCharset: 0,
      accessKey: 0,
      action: 0,
      allowFullScreen: HAS_BOOLEAN_VALUE,
      allowTransparency: 0,
      alt: 0,
      // specifies target context for links with `preload` type
      as: 0,
      async: HAS_BOOLEAN_VALUE,
      autoComplete: 0,
      // autoFocus is polyfilled/normalized by AutoFocusUtils
      // autoFocus: HAS_BOOLEAN_VALUE,
      autoPlay: HAS_BOOLEAN_VALUE,
      capture: HAS_BOOLEAN_VALUE,
      cellPadding: 0,
      cellSpacing: 0,
      charSet: 0,
      challenge: 0,
      checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
      cite: 0,
      classID: 0,
      className: 0,
      cols: HAS_POSITIVE_NUMERIC_VALUE,
      colSpan: 0,
      content: 0,
      contentEditable: 0,
      contextMenu: 0,
      controls: HAS_BOOLEAN_VALUE,
      controlsList: 0,
      coords: 0,
      crossOrigin: 0,
      data: 0, // For `<object />` acts as `src`.
      dateTime: 0,
      'default': HAS_BOOLEAN_VALUE,
      defer: HAS_BOOLEAN_VALUE,
      dir: 0,
      disabled: HAS_BOOLEAN_VALUE,
      download: HAS_OVERLOADED_BOOLEAN_VALUE,
      draggable: 0,
      encType: 0,
      form: 0,
      formAction: 0,
      formEncType: 0,
      formMethod: 0,
      formNoValidate: HAS_BOOLEAN_VALUE,
      formTarget: 0,
      frameBorder: 0,
      headers: 0,
      height: 0,
      hidden: HAS_BOOLEAN_VALUE,
      high: 0,
      href: 0,
      hrefLang: 0,
      htmlFor: 0,
      httpEquiv: 0,
      icon: 0,
      id: 0,
      inputMode: 0,
      integrity: 0,
      is: 0,
      keyParams: 0,
      keyType: 0,
      kind: 0,
      label: 0,
      lang: 0,
      list: 0,
      loop: HAS_BOOLEAN_VALUE,
      low: 0,
      manifest: 0,
      marginHeight: 0,
      marginWidth: 0,
      max: 0,
      maxLength: 0,
      media: 0,
      mediaGroup: 0,
      method: 0,
      min: 0,
      minLength: 0,
      // Caution; `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`.
      multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
      muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
      name: 0,
      nonce: 0,
      noValidate: HAS_BOOLEAN_VALUE,
      open: HAS_BOOLEAN_VALUE,
      optimum: 0,
      pattern: 0,
      placeholder: 0,
      playsInline: HAS_BOOLEAN_VALUE,
      poster: 0,
      preload: 0,
      profile: 0,
      radioGroup: 0,
      readOnly: HAS_BOOLEAN_VALUE,
      referrerPolicy: 0,
      rel: 0,
      required: HAS_BOOLEAN_VALUE,
      reversed: HAS_BOOLEAN_VALUE,
      role: 0,
      rows: HAS_POSITIVE_NUMERIC_VALUE,
      rowSpan: HAS_NUMERIC_VALUE,
      sandbox: 0,
      scope: 0,
      scoped: HAS_BOOLEAN_VALUE,
      scrolling: 0,
      seamless: HAS_BOOLEAN_VALUE,
      selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
      shape: 0,
      size: HAS_POSITIVE_NUMERIC_VALUE,
      sizes: 0,
      span: HAS_POSITIVE_NUMERIC_VALUE,
      spellCheck: 0,
      src: 0,
      srcDoc: 0,
      srcLang: 0,
      srcSet: 0,
      start: HAS_NUMERIC_VALUE,
      step: 0,
      style: 0,
      summary: 0,
      tabIndex: 0,
      target: 0,
      title: 0,
      // Setting .type throws on non-<input> tags
      type: 0,
      useMap: 0,
      value: 0,
      width: 0,
      wmode: 0,
      wrap: 0,

      /**
       * RDFa Properties
       */
      about: 0,
      datatype: 0,
      inlist: 0,
      prefix: 0,
      // property is also supported for OpenGraph in meta tags.
      property: 0,
      resource: 0,
      'typeof': 0,
      vocab: 0,

      /**
       * Non-standard Properties
       */
      // autoCapitalize and autoCorrect are supported in Mobile Safari for
      // keyboard hints.
      autoCapitalize: 0,
      autoCorrect: 0,
      // autoSave allows WebKit/Blink to persist values of input fields on page reloads
      autoSave: 0,
      // color is for Safari mask-icon link
      color: 0,
      // itemProp, itemScope, itemType are for
      // Microdata support. See http://schema.org/docs/gs.html
      itemProp: 0,
      itemScope: HAS_BOOLEAN_VALUE,
      itemType: 0,
      // itemID and itemRef are for Microdata support as well but
      // only specified in the WHATWG spec document. See
      // https://html.spec.whatwg.org/multipage/microdata.html#microdata-dom-api
      itemID: 0,
      itemRef: 0,
      // results show looking glass icon and recent searches on input
      // search fields in WebKit/Blink
      results: 0,
      // IE-only attribute that specifies security restrictions on an iframe
      // as an alternative to the sandbox attribute on IE<10
      security: 0,
      // IE-only attribute that controls focus behavior
      unselectable: 0
    },
    DOMAttributeNames: {
      acceptCharset: 'accept-charset',
      className: 'class',
      htmlFor: 'for',
      httpEquiv: 'http-equiv'
    },
    DOMPropertyNames: {},
    DOMMutationMethods: {
      value: function (node, value) {
        if (value == null) {
          return node.removeAttribute('value');
        }

        // Number inputs get special treatment due to some edge cases in
        // Chrome. Let everything else assign the value attribute as normal.
        // https://github.com/facebook/react/issues/7253#issuecomment-236074326
        if (node.type !== 'number' || node.hasAttribute('value') === false) {
          node.setAttribute('value', '' + value);
        } else if (node.validity && !node.validity.badInput && node.ownerDocument.activeElement !== node) {
          // Don't assign an attribute if validation reports bad
          // input. Chrome will clear the value. Additionally, don't
          // operate on inputs that have focus, otherwise Chrome might
          // strip off trailing decimal places and cause the user's
          // cursor position to jump to the beginning of the input.
          //
          // In ReactDOMInput, we have an onBlur event that will trigger
          // this function again when focus is lost.
          node.setAttribute('value', '' + value);
        }
      }
    }
  };

  var HTMLDOMPropertyConfig_1 = HTMLDOMPropertyConfig;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */

  var NS = {
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace'
  };

  // We use attributes for everything SVG so let's avoid some duplication and run
  // code instead.
  // The following are all specified in the HTML config already so we exclude here.
  // - class (as className)
  // - color
  // - height
  // - id
  // - lang
  // - max
  // - media
  // - method
  // - min
  // - name
  // - style
  // - target
  // - type
  // - width
  var ATTRS = {
    accentHeight: 'accent-height',
    accumulate: 0,
    additive: 0,
    alignmentBaseline: 'alignment-baseline',
    allowReorder: 'allowReorder',
    alphabetic: 0,
    amplitude: 0,
    arabicForm: 'arabic-form',
    ascent: 0,
    attributeName: 'attributeName',
    attributeType: 'attributeType',
    autoReverse: 'autoReverse',
    azimuth: 0,
    baseFrequency: 'baseFrequency',
    baseProfile: 'baseProfile',
    baselineShift: 'baseline-shift',
    bbox: 0,
    begin: 0,
    bias: 0,
    by: 0,
    calcMode: 'calcMode',
    capHeight: 'cap-height',
    clip: 0,
    clipPath: 'clip-path',
    clipRule: 'clip-rule',
    clipPathUnits: 'clipPathUnits',
    colorInterpolation: 'color-interpolation',
    colorInterpolationFilters: 'color-interpolation-filters',
    colorProfile: 'color-profile',
    colorRendering: 'color-rendering',
    contentScriptType: 'contentScriptType',
    contentStyleType: 'contentStyleType',
    cursor: 0,
    cx: 0,
    cy: 0,
    d: 0,
    decelerate: 0,
    descent: 0,
    diffuseConstant: 'diffuseConstant',
    direction: 0,
    display: 0,
    divisor: 0,
    dominantBaseline: 'dominant-baseline',
    dur: 0,
    dx: 0,
    dy: 0,
    edgeMode: 'edgeMode',
    elevation: 0,
    enableBackground: 'enable-background',
    end: 0,
    exponent: 0,
    externalResourcesRequired: 'externalResourcesRequired',
    fill: 0,
    fillOpacity: 'fill-opacity',
    fillRule: 'fill-rule',
    filter: 0,
    filterRes: 'filterRes',
    filterUnits: 'filterUnits',
    floodColor: 'flood-color',
    floodOpacity: 'flood-opacity',
    focusable: 0,
    fontFamily: 'font-family',
    fontSize: 'font-size',
    fontSizeAdjust: 'font-size-adjust',
    fontStretch: 'font-stretch',
    fontStyle: 'font-style',
    fontVariant: 'font-variant',
    fontWeight: 'font-weight',
    format: 0,
    from: 0,
    fx: 0,
    fy: 0,
    g1: 0,
    g2: 0,
    glyphName: 'glyph-name',
    glyphOrientationHorizontal: 'glyph-orientation-horizontal',
    glyphOrientationVertical: 'glyph-orientation-vertical',
    glyphRef: 'glyphRef',
    gradientTransform: 'gradientTransform',
    gradientUnits: 'gradientUnits',
    hanging: 0,
    horizAdvX: 'horiz-adv-x',
    horizOriginX: 'horiz-origin-x',
    ideographic: 0,
    imageRendering: 'image-rendering',
    'in': 0,
    in2: 0,
    intercept: 0,
    k: 0,
    k1: 0,
    k2: 0,
    k3: 0,
    k4: 0,
    kernelMatrix: 'kernelMatrix',
    kernelUnitLength: 'kernelUnitLength',
    kerning: 0,
    keyPoints: 'keyPoints',
    keySplines: 'keySplines',
    keyTimes: 'keyTimes',
    lengthAdjust: 'lengthAdjust',
    letterSpacing: 'letter-spacing',
    lightingColor: 'lighting-color',
    limitingConeAngle: 'limitingConeAngle',
    local: 0,
    markerEnd: 'marker-end',
    markerMid: 'marker-mid',
    markerStart: 'marker-start',
    markerHeight: 'markerHeight',
    markerUnits: 'markerUnits',
    markerWidth: 'markerWidth',
    mask: 0,
    maskContentUnits: 'maskContentUnits',
    maskUnits: 'maskUnits',
    mathematical: 0,
    mode: 0,
    numOctaves: 'numOctaves',
    offset: 0,
    opacity: 0,
    operator: 0,
    order: 0,
    orient: 0,
    orientation: 0,
    origin: 0,
    overflow: 0,
    overlinePosition: 'overline-position',
    overlineThickness: 'overline-thickness',
    paintOrder: 'paint-order',
    panose1: 'panose-1',
    pathLength: 'pathLength',
    patternContentUnits: 'patternContentUnits',
    patternTransform: 'patternTransform',
    patternUnits: 'patternUnits',
    pointerEvents: 'pointer-events',
    points: 0,
    pointsAtX: 'pointsAtX',
    pointsAtY: 'pointsAtY',
    pointsAtZ: 'pointsAtZ',
    preserveAlpha: 'preserveAlpha',
    preserveAspectRatio: 'preserveAspectRatio',
    primitiveUnits: 'primitiveUnits',
    r: 0,
    radius: 0,
    refX: 'refX',
    refY: 'refY',
    renderingIntent: 'rendering-intent',
    repeatCount: 'repeatCount',
    repeatDur: 'repeatDur',
    requiredExtensions: 'requiredExtensions',
    requiredFeatures: 'requiredFeatures',
    restart: 0,
    result: 0,
    rotate: 0,
    rx: 0,
    ry: 0,
    scale: 0,
    seed: 0,
    shapeRendering: 'shape-rendering',
    slope: 0,
    spacing: 0,
    specularConstant: 'specularConstant',
    specularExponent: 'specularExponent',
    speed: 0,
    spreadMethod: 'spreadMethod',
    startOffset: 'startOffset',
    stdDeviation: 'stdDeviation',
    stemh: 0,
    stemv: 0,
    stitchTiles: 'stitchTiles',
    stopColor: 'stop-color',
    stopOpacity: 'stop-opacity',
    strikethroughPosition: 'strikethrough-position',
    strikethroughThickness: 'strikethrough-thickness',
    string: 0,
    stroke: 0,
    strokeDasharray: 'stroke-dasharray',
    strokeDashoffset: 'stroke-dashoffset',
    strokeLinecap: 'stroke-linecap',
    strokeLinejoin: 'stroke-linejoin',
    strokeMiterlimit: 'stroke-miterlimit',
    strokeOpacity: 'stroke-opacity',
    strokeWidth: 'stroke-width',
    surfaceScale: 'surfaceScale',
    systemLanguage: 'systemLanguage',
    tableValues: 'tableValues',
    targetX: 'targetX',
    targetY: 'targetY',
    textAnchor: 'text-anchor',
    textDecoration: 'text-decoration',
    textRendering: 'text-rendering',
    textLength: 'textLength',
    to: 0,
    transform: 0,
    u1: 0,
    u2: 0,
    underlinePosition: 'underline-position',
    underlineThickness: 'underline-thickness',
    unicode: 0,
    unicodeBidi: 'unicode-bidi',
    unicodeRange: 'unicode-range',
    unitsPerEm: 'units-per-em',
    vAlphabetic: 'v-alphabetic',
    vHanging: 'v-hanging',
    vIdeographic: 'v-ideographic',
    vMathematical: 'v-mathematical',
    values: 0,
    vectorEffect: 'vector-effect',
    version: 0,
    vertAdvY: 'vert-adv-y',
    vertOriginX: 'vert-origin-x',
    vertOriginY: 'vert-origin-y',
    viewBox: 'viewBox',
    viewTarget: 'viewTarget',
    visibility: 0,
    widths: 0,
    wordSpacing: 'word-spacing',
    writingMode: 'writing-mode',
    x: 0,
    xHeight: 'x-height',
    x1: 0,
    x2: 0,
    xChannelSelector: 'xChannelSelector',
    xlinkActuate: 'xlink:actuate',
    xlinkArcrole: 'xlink:arcrole',
    xlinkHref: 'xlink:href',
    xlinkRole: 'xlink:role',
    xlinkShow: 'xlink:show',
    xlinkTitle: 'xlink:title',
    xlinkType: 'xlink:type',
    xmlBase: 'xml:base',
    xmlns: 0,
    xmlnsXlink: 'xmlns:xlink',
    xmlLang: 'xml:lang',
    xmlSpace: 'xml:space',
    y: 0,
    y1: 0,
    y2: 0,
    yChannelSelector: 'yChannelSelector',
    z: 0,
    zoomAndPan: 'zoomAndPan'
  };

  var SVGDOMPropertyConfig = {
    Properties: {},
    DOMAttributeNamespaces: {
      xlinkActuate: NS.xlink,
      xlinkArcrole: NS.xlink,
      xlinkHref: NS.xlink,
      xlinkRole: NS.xlink,
      xlinkShow: NS.xlink,
      xlinkTitle: NS.xlink,
      xlinkType: NS.xlink,
      xmlBase: NS.xml,
      xmlLang: NS.xml,
      xmlSpace: NS.xml
    },
    DOMAttributeNames: {}
  };

  Object.keys(ATTRS).forEach(function (key) {
    SVGDOMPropertyConfig.Properties[key] = 0;
    if (ATTRS[key]) {
      SVGDOMPropertyConfig.DOMAttributeNames[key] = ATTRS[key];
    }
  });

  var SVGDOMPropertyConfig_1 = SVGDOMPropertyConfig;

  var hyphenPatternRegex = /-([a-z])/g;
  var CUSTOM_PROPERTY_OR_NO_HYPHEN_REGEX = /^--[a-zA-Z0-9-]+$|^[^-]+$/;

  /**
   * Converts a string to camelCase.
   *
   * @param  {String} string - The string.
   * @return {String}
   */
  function camelCase(string) {
    if (typeof string !== 'string') {
      throw new TypeError('First argument must be a string');
    }

    // custom property or no hyphen found
    if (CUSTOM_PROPERTY_OR_NO_HYPHEN_REGEX.test(string)) {
      return string;
    }

    // convert to camelCase
    return string
      .toLowerCase()
      .replace(hyphenPatternRegex, function(_, character) {
        return character.toUpperCase();
      });
  }

  /**
   * Swap key with value in an object.
   *
   * @param  {Object}   obj        - The object.
   * @param  {Function} [override] - The override method.
   * @return {Object}              - The inverted object.
   */
  function invertObject(obj, override) {
    if (!obj || typeof obj !== 'object') {
      throw new TypeError('First argument must be an object');
    }

    var key;
    var value;
    var isOverridePresent = typeof override === 'function';
    var overrides = {};
    var result = {};

    for (key in obj) {
      value = obj[key];

      if (isOverridePresent) {
        overrides = override(key, value);
        if (overrides && overrides.length === 2) {
          result[overrides[0]] = overrides[1];
          continue;
        }
      }

      if (typeof value === 'string') {
        result[value] = key;
      }
    }

    return result;
  }

  /**
   * Check if a given tag is a custom component.
   *
   * @see {@link https://github.com/facebook/react/blob/v16.6.3/packages/react-dom/src/shared/isCustomComponent.js}
   *
   * @param {string} tagName - The name of the html tag.
   * @param {Object} props   - The props being passed to the element.
   * @return {boolean}
   */
  function isCustomComponent(tagName, props) {
    if (tagName.indexOf('-') === -1) {
      return props && typeof props.is === 'string';
    }

    switch (tagName) {
      // These are reserved SVG and MathML elements.
      // We don't mind this whitelist too much because we expect it to never grow.
      // The alternative is to track the namespace in a few places which is convoluted.
      // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
      case 'annotation-xml':
      case 'color-profile':
      case 'font-face':
      case 'font-face-src':
      case 'font-face-uri':
      case 'font-face-format':
      case 'font-face-name':
      case 'missing-glyph':
        return false;
      default:
        return true;
    }
  }

  /**
   * @constant {Boolean}
   * @see {@link https://reactjs.org/blog/2017/09/08/dom-attributes-in-react-16.html}
   */
  var PRESERVE_CUSTOM_ATTRIBUTES = React__default.version.split('.')[0] >= 16;

  var utilities = {
    PRESERVE_CUSTOM_ATTRIBUTES: PRESERVE_CUSTOM_ATTRIBUTES,
    camelCase: camelCase,
    invertObject: invertObject,
    isCustomComponent: isCustomComponent
  };

  var config$1 = {
    html: {},
    svg: {}
  };

  var propertyName;

  /**
   * HTML DOM property config.
   *
   * https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/HTMLDOMPropertyConfig.js
   */

  // first map out the HTML attribute names
  // e.g., { className: 'class' } => { 'class': 'className' }
  config$1.html = utilities.invertObject(HTMLDOMPropertyConfig_1.DOMAttributeNames);

  // then map out the rest of the HTML properties
  // e.g., { readOnly: 0 } => { readonly: 'readOnly' }
  for (propertyName in HTMLDOMPropertyConfig_1.Properties) {
    // lowercase to make matching property names easier
    config$1.html[propertyName.toLowerCase()] = propertyName;
  }

  /**
   * SVG DOM property config.
   *
   * https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/SVGDOMPropertyConfig.js
   */

  // first map out the SVG attribute names
  // e.g., { fontSize: 'font-size' } => { 'font-size': 'fontSize' }
  config$1.svg = utilities.invertObject(SVGDOMPropertyConfig_1.DOMAttributeNames);

  // then map out the rest of the SVG properties
  // e.g., { fillRule: 0 } => { fillRule: 'fillRule' }
  for (propertyName in SVGDOMPropertyConfig_1.Properties) {
    // do not lowercase as some svg properties are camel cased
    config$1.html[propertyName] = propertyName;
  }

  var propertyConfig = {
    config: config$1,
    HTMLDOMPropertyConfig: HTMLDOMPropertyConfig_1,
    SVGDOMPropertyConfig: SVGDOMPropertyConfig_1
  };

  // http://www.w3.org/TR/CSS21/grammar.html
  // https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
  var commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

  var parse$1 = function(css, options){
    options = options || {};

    /**
     * Positional.
     */

    var lineno = 1;
    var column = 1;

    /**
     * Update lineno and column based on `str`.
     */

    function updatePosition(str) {
      var lines = str.match(/\n/g);
      if (lines) lineno += lines.length;
      var i = str.lastIndexOf('\n');
      column = ~i ? str.length - i : column + str.length;
    }

    /**
     * Mark position and patch `node.position`.
     */

    function position() {
      var start = { line: lineno, column: column };
      return function(node){
        node.position = new Position(start);
        whitespace();
        return node;
      };
    }

    /**
     * Store position information for a node
     */

    function Position(start) {
      this.start = start;
      this.end = { line: lineno, column: column };
      this.source = options.source;
    }

    /**
     * Non-enumerable source string
     */

    Position.prototype.content = css;

    /**
     * Error `msg`.
     */

    var errorsList = [];

    function error(msg) {
      var err = new Error(options.source + ':' + lineno + ':' + column + ': ' + msg);
      err.reason = msg;
      err.filename = options.source;
      err.line = lineno;
      err.column = column;
      err.source = css;

      if (options.silent) {
        errorsList.push(err);
      } else {
        throw err;
      }
    }

    /**
     * Parse stylesheet.
     */

    function stylesheet() {
      var rulesList = rules();

      return {
        type: 'stylesheet',
        stylesheet: {
          source: options.source,
          rules: rulesList,
          parsingErrors: errorsList
        }
      };
    }

    /**
     * Opening brace.
     */

    function open() {
      return match(/^{\s*/);
    }

    /**
     * Closing brace.
     */

    function close() {
      return match(/^}/);
    }

    /**
     * Parse ruleset.
     */

    function rules() {
      var node;
      var rules = [];
      whitespace();
      comments(rules);
      while (css.length && css.charAt(0) != '}' && (node = atrule() || rule())) {
        if (node !== false) {
          rules.push(node);
          comments(rules);
        }
      }
      return rules;
    }

    /**
     * Match `re` and return captures.
     */

    function match(re) {
      var m = re.exec(css);
      if (!m) return;
      var str = m[0];
      updatePosition(str);
      css = css.slice(str.length);
      return m;
    }

    /**
     * Parse whitespace.
     */

    function whitespace() {
      match(/^\s*/);
    }

    /**
     * Parse comments;
     */

    function comments(rules) {
      var c;
      rules = rules || [];
      while (c = comment()) {
        if (c !== false) {
          rules.push(c);
        }
      }
      return rules;
    }

    /**
     * Parse comment.
     */

    function comment() {
      var pos = position();
      if ('/' != css.charAt(0) || '*' != css.charAt(1)) return;

      var i = 2;
      while ("" != css.charAt(i) && ('*' != css.charAt(i) || '/' != css.charAt(i + 1))) ++i;
      i += 2;

      if ("" === css.charAt(i-1)) {
        return error('End of comment missing');
      }

      var str = css.slice(2, i - 2);
      column += 2;
      updatePosition(str);
      css = css.slice(i);
      column += 2;

      return pos({
        type: 'comment',
        comment: str
      });
    }

    /**
     * Parse selector.
     */

    function selector() {
      var m = match(/^([^{]+)/);
      if (!m) return;
      /* @fix Remove all comments from selectors
       * http://ostermiller.org/findcomment.html */
      return trim(m[0])
        .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, '')
        .replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function(m) {
          return m.replace(/,/g, '\u200C');
        })
        .split(/\s*(?![^(]*\)),\s*/)
        .map(function(s) {
          return s.replace(/\u200C/g, ',');
        });
    }

    /**
     * Parse declaration.
     */

    function declaration() {
      var pos = position();

      // prop
      var prop = match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
      if (!prop) return;
      prop = trim(prop[0]);

      // :
      if (!match(/^:\s*/)) return error("property missing ':'");

      // val
      var val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);

      var ret = pos({
        type: 'declaration',
        property: prop.replace(commentre, ''),
        value: val ? trim(val[0]).replace(commentre, '') : ''
      });

      // ;
      match(/^[;\s]*/);

      return ret;
    }

    /**
     * Parse declarations.
     */

    function declarations() {
      var decls = [];

      if (!open()) return error("missing '{'");
      comments(decls);

      // declarations
      var decl;
      while (decl = declaration()) {
        if (decl !== false) {
          decls.push(decl);
          comments(decls);
        }
      }

      if (!close()) return error("missing '}'");
      return decls;
    }

    /**
     * Parse keyframe.
     */

    function keyframe() {
      var m;
      var vals = [];
      var pos = position();

      while (m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/)) {
        vals.push(m[1]);
        match(/^,\s*/);
      }

      if (!vals.length) return;

      return pos({
        type: 'keyframe',
        values: vals,
        declarations: declarations()
      });
    }

    /**
     * Parse keyframes.
     */

    function atkeyframes() {
      var pos = position();
      var m = match(/^@([-\w]+)?keyframes\s*/);

      if (!m) return;
      var vendor = m[1];

      // identifier
      var m = match(/^([-\w]+)\s*/);
      if (!m) return error("@keyframes missing name");
      var name = m[1];

      if (!open()) return error("@keyframes missing '{'");

      var frame;
      var frames = comments();
      while (frame = keyframe()) {
        frames.push(frame);
        frames = frames.concat(comments());
      }

      if (!close()) return error("@keyframes missing '}'");

      return pos({
        type: 'keyframes',
        name: name,
        vendor: vendor,
        keyframes: frames
      });
    }

    /**
     * Parse supports.
     */

    function atsupports() {
      var pos = position();
      var m = match(/^@supports *([^{]+)/);

      if (!m) return;
      var supports = trim(m[1]);

      if (!open()) return error("@supports missing '{'");

      var style = comments().concat(rules());

      if (!close()) return error("@supports missing '}'");

      return pos({
        type: 'supports',
        supports: supports,
        rules: style
      });
    }

    /**
     * Parse host.
     */

    function athost() {
      var pos = position();
      var m = match(/^@host\s*/);

      if (!m) return;

      if (!open()) return error("@host missing '{'");

      var style = comments().concat(rules());

      if (!close()) return error("@host missing '}'");

      return pos({
        type: 'host',
        rules: style
      });
    }

    /**
     * Parse media.
     */

    function atmedia() {
      var pos = position();
      var m = match(/^@media *([^{]+)/);

      if (!m) return;
      var media = trim(m[1]);

      if (!open()) return error("@media missing '{'");

      var style = comments().concat(rules());

      if (!close()) return error("@media missing '}'");

      return pos({
        type: 'media',
        media: media,
        rules: style
      });
    }


    /**
     * Parse custom-media.
     */

    function atcustommedia() {
      var pos = position();
      var m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
      if (!m) return;

      return pos({
        type: 'custom-media',
        name: trim(m[1]),
        media: trim(m[2])
      });
    }

    /**
     * Parse paged media.
     */

    function atpage() {
      var pos = position();
      var m = match(/^@page */);
      if (!m) return;

      var sel = selector() || [];

      if (!open()) return error("@page missing '{'");
      var decls = comments();

      // declarations
      var decl;
      while (decl = declaration()) {
        decls.push(decl);
        decls = decls.concat(comments());
      }

      if (!close()) return error("@page missing '}'");

      return pos({
        type: 'page',
        selectors: sel,
        declarations: decls
      });
    }

    /**
     * Parse document.
     */

    function atdocument() {
      var pos = position();
      var m = match(/^@([-\w]+)?document *([^{]+)/);
      if (!m) return;

      var vendor = trim(m[1]);
      var doc = trim(m[2]);

      if (!open()) return error("@document missing '{'");

      var style = comments().concat(rules());

      if (!close()) return error("@document missing '}'");

      return pos({
        type: 'document',
        document: doc,
        vendor: vendor,
        rules: style
      });
    }

    /**
     * Parse font-face.
     */

    function atfontface() {
      var pos = position();
      var m = match(/^@font-face\s*/);
      if (!m) return;

      if (!open()) return error("@font-face missing '{'");
      var decls = comments();

      // declarations
      var decl;
      while (decl = declaration()) {
        decls.push(decl);
        decls = decls.concat(comments());
      }

      if (!close()) return error("@font-face missing '}'");

      return pos({
        type: 'font-face',
        declarations: decls
      });
    }

    /**
     * Parse import
     */

    var atimport = _compileAtrule('import');

    /**
     * Parse charset
     */

    var atcharset = _compileAtrule('charset');

    /**
     * Parse namespace
     */

    var atnamespace = _compileAtrule('namespace');

    /**
     * Parse non-block at-rules
     */


    function _compileAtrule(name) {
      var re = new RegExp('^@' + name + '\\s*([^;]+);');
      return function() {
        var pos = position();
        var m = match(re);
        if (!m) return;
        var ret = { type: name };
        ret[name] = m[1].trim();
        return pos(ret);
      }
    }

    /**
     * Parse at rule.
     */

    function atrule() {
      if (css[0] != '@') return;

      return atkeyframes()
        || atmedia()
        || atcustommedia()
        || atsupports()
        || atimport()
        || atcharset()
        || atnamespace()
        || atdocument()
        || atpage()
        || athost()
        || atfontface();
    }

    /**
     * Parse rule.
     */

    function rule() {
      var pos = position();
      var sel = selector();

      if (!sel) return error('selector missing');
      comments();

      return pos({
        type: 'rule',
        selectors: sel,
        declarations: declarations()
      });
    }

    return addParent(stylesheet());
  };

  /**
   * Trim `str`.
   */

  function trim(str) {
    return str ? str.replace(/^\s+|\s+$/g, '') : '';
  }

  /**
   * Adds non-enumerable parent node reference to each node.
   */

  function addParent(obj, parent) {
    var isNode = obj && typeof obj.type === 'string';
    var childParent = isNode ? obj : parent;

    for (var k in obj) {
      var value = obj[k];
      if (Array.isArray(value)) {
        value.forEach(function(v) { addParent(v, childParent); });
      } else if (value && typeof value === 'object') {
        addParent(value, childParent);
      }
    }

    if (isNode) {
      Object.defineProperty(obj, 'parent', {
        configurable: true,
        writable: true,
        enumerable: false,
        value: parent || null
      });
    }

    return obj;
  }

  /**
   * Parses inline style.
   *
   * Example: 'color:red' => { color: 'red' }
   *
   * @param  {String}      style      - The inline style.
   * @param  {Function}    [iterator] - The iterator function.
   * @return {null|Object}
   */
  var styleToObject = function parseInlineStyle(style, iterator) {
    if (!style || typeof style !== 'string') return null;

    // make sure to wrap declarations in placeholder
    var declarations = parse$1('p{' + style + '}').stylesheet.rules[0].declarations;
    var declaration, property, value;

    var output = null;
    var hasIterator = typeof iterator === 'function';

    for (var i = 0, len = declarations.length; i < len; i++) {
      declaration = declarations[i];
      property = declaration.property;
      value = declaration.value;

      if (hasIterator) {
        iterator(property, value, declaration);
      } else if (value) {
        output || (output = {});
        output[property] = value;
      }
    }

    return output;
  };

  var config$2 = propertyConfig.config;
  var isCustomAttribute = propertyConfig.HTMLDOMPropertyConfig.isCustomAttribute;
  DOMProperty_1.injection.injectDOMPropertyConfig(
    propertyConfig.HTMLDOMPropertyConfig
  );

  /**
   * Makes attributes compatible with React props.
   *
   * @param  {Object} [attributes={}] - The attributes.
   * @return {Object}                 - The props.
   */
  function attributesToProps(attributes) {
    attributes = attributes || {};
    var props = {};
    var propertyName;
    var propertyValue;
    var reactProperty;

    for (propertyName in attributes) {
      propertyValue = attributes[propertyName];

      // custom attributes (`data-` and `aria-`)
      if (isCustomAttribute(propertyName)) {
        props[propertyName] = propertyValue;
        continue;
      }

      // make HTML DOM attribute/property consistent with React attribute/property
      reactProperty = config$2.html[propertyName.toLowerCase()];
      if (reactProperty) {
        if (
          DOMProperty_1.properties.hasOwnProperty(reactProperty) &&
          DOMProperty_1.properties[reactProperty].hasBooleanValue
        ) {
          props[reactProperty] = true;
        } else {
          props[reactProperty] = propertyValue;
        }
        continue;
      }

      // make SVG DOM attribute/property consistent with React attribute/property
      reactProperty = config$2.svg[propertyName];
      if (reactProperty) {
        props[reactProperty] = propertyValue;
      } else if (utilities.PRESERVE_CUSTOM_ATTRIBUTES) {
        props[propertyName] = propertyValue;
      }
    }

    // convert inline style to object
    if (attributes.style != null) {
      props.style = cssToJs(attributes.style);
    }
    return props;
  }

  /**
   * Converts CSS style string to JS style object.
   *
   * @param  {String} style - The CSS style.
   * @return {Object}       - The JS style object.
   */
  function cssToJs(style) {
    if (typeof style !== 'string') {
      throw new TypeError('First argument must be a string.');
    }
    var styleObj = {};

    styleToObject(style, function(propName, propValue) {
      // Check if it's not a comment node
      if (propName && propValue) {
        styleObj[utilities.camelCase(propName)] = propValue;
      }
    });
    return styleObj;
  }

  var attributesToProps_1 = attributesToProps;

  /**
   * Converts DOM nodes to React elements.
   *
   * @param  {Array}    nodes             - The DOM nodes.
   * @param  {Object}   [options]         - The additional options.
   * @param  {Function} [options.replace] - The replace method.
   * @return {ReactElement|Array}
   */
  function domToReact(nodes, options) {
    options = options || {};
    var result = [];
    var node;
    var isReplacePresent = typeof options.replace === 'function';
    var replacement;
    var props;
    var children;

    for (var i = 0, len = nodes.length; i < len; i++) {
      node = nodes[i];

      // replace with custom React element (if applicable)
      if (isReplacePresent) {
        replacement = options.replace(node);

        if (React__default.isValidElement(replacement)) {
          // specify a "key" prop if element has siblings
          // https://fb.me/react-warning-keys
          if (len > 1) {
            replacement = React__default.cloneElement(replacement, { key: i });
          }
          result.push(replacement);
          continue;
        }
      }

      if (node.type === 'text') {
        result.push(node.data);
        continue;
      }

      props = node.attribs;
      if (!shouldPassAttributesUnaltered(node)) {
        // update values
        props = attributesToProps_1(node.attribs);
      }

      children = null;

      // node type for <script> is "script"
      // node type for <style> is "style"
      if (node.type === 'script' || node.type === 'style') {
        // prevent text in <script> or <style> from being escaped
        // https://facebook.github.io/react/tips/dangerously-set-inner-html.html
        if (node.children[0]) {
          props.dangerouslySetInnerHTML = {
            __html: node.children[0].data
          };
        }
      } else if (node.type === 'tag') {
        // setting textarea value in children is an antipattern in React
        // https://reactjs.org/docs/forms.html#the-textarea-tag
        if (node.name === 'textarea' && node.children[0]) {
          props.defaultValue = node.children[0].data;

          // continue recursion of creating React elements (if applicable)
        } else if (node.children && node.children.length) {
          children = domToReact(node.children, options);
        }

        // skip all other cases (e.g., comment)
      } else {
        continue;
      }

      // specify a "key" prop if element has siblings
      // https://fb.me/react-warning-keys
      if (len > 1) {
        props.key = i;
      }

      result.push(React__default.createElement(node.name, props, children));
    }

    return result.length === 1 ? result[0] : result;
  }

  function shouldPassAttributesUnaltered(node) {
    return (
      utilities.PRESERVE_CUSTOM_ATTRIBUTES &&
      node.type === 'tag' &&
      utilities.isCustomComponent(node.name, node.attribs)
    );
  }

  var domToReact_1 = domToReact;

  var decode = {
  	"0": 65533,
  	"128": 8364,
  	"130": 8218,
  	"131": 402,
  	"132": 8222,
  	"133": 8230,
  	"134": 8224,
  	"135": 8225,
  	"136": 710,
  	"137": 8240,
  	"138": 352,
  	"139": 8249,
  	"140": 338,
  	"142": 381,
  	"145": 8216,
  	"146": 8217,
  	"147": 8220,
  	"148": 8221,
  	"149": 8226,
  	"150": 8211,
  	"151": 8212,
  	"152": 732,
  	"153": 8482,
  	"154": 353,
  	"155": 8250,
  	"156": 339,
  	"158": 382,
  	"159": 376
  };

  var decode$1 = /*#__PURE__*/Object.freeze({
    default: decode
  });

  var decodeMap = getCjsExportFromNamespace(decode$1);

  var decode_codepoint = decodeCodePoint;

  // modified version of https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
  function decodeCodePoint(codePoint) {
      if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
          return "\uFFFD";
      }

      if (codePoint in decodeMap) {
          codePoint = decodeMap[codePoint];
      }

      var output = "";

      if (codePoint > 0xffff) {
          codePoint -= 0x10000;
          output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
          codePoint = 0xdc00 | (codePoint & 0x3ff);
      }

      output += String.fromCharCode(codePoint);
      return output;
  }

  var Aacute = "Á";
  var aacute = "á";
  var Abreve = "Ă";
  var abreve = "ă";
  var ac = "∾";
  var acd = "∿";
  var acE = "∾̳";
  var Acirc = "Â";
  var acirc = "â";
  var acute = "´";
  var Acy = "А";
  var acy = "а";
  var AElig = "Æ";
  var aelig = "æ";
  var af = "⁡";
  var Afr = "𝔄";
  var afr = "𝔞";
  var Agrave = "À";
  var agrave = "à";
  var alefsym = "ℵ";
  var aleph = "ℵ";
  var Alpha = "Α";
  var alpha = "α";
  var Amacr = "Ā";
  var amacr = "ā";
  var amalg = "⨿";
  var amp = "&";
  var AMP = "&";
  var andand = "⩕";
  var And = "⩓";
  var and = "∧";
  var andd = "⩜";
  var andslope = "⩘";
  var andv = "⩚";
  var ang = "∠";
  var ange = "⦤";
  var angle = "∠";
  var angmsdaa = "⦨";
  var angmsdab = "⦩";
  var angmsdac = "⦪";
  var angmsdad = "⦫";
  var angmsdae = "⦬";
  var angmsdaf = "⦭";
  var angmsdag = "⦮";
  var angmsdah = "⦯";
  var angmsd = "∡";
  var angrt = "∟";
  var angrtvb = "⊾";
  var angrtvbd = "⦝";
  var angsph = "∢";
  var angst = "Å";
  var angzarr = "⍼";
  var Aogon = "Ą";
  var aogon = "ą";
  var Aopf = "𝔸";
  var aopf = "𝕒";
  var apacir = "⩯";
  var ap = "≈";
  var apE = "⩰";
  var ape = "≊";
  var apid = "≋";
  var apos = "'";
  var ApplyFunction = "⁡";
  var approx = "≈";
  var approxeq = "≊";
  var Aring = "Å";
  var aring = "å";
  var Ascr = "𝒜";
  var ascr = "𝒶";
  var Assign = "≔";
  var ast = "*";
  var asymp = "≈";
  var asympeq = "≍";
  var Atilde = "Ã";
  var atilde = "ã";
  var Auml = "Ä";
  var auml = "ä";
  var awconint = "∳";
  var awint = "⨑";
  var backcong = "≌";
  var backepsilon = "϶";
  var backprime = "‵";
  var backsim = "∽";
  var backsimeq = "⋍";
  var Backslash = "∖";
  var Barv = "⫧";
  var barvee = "⊽";
  var barwed = "⌅";
  var Barwed = "⌆";
  var barwedge = "⌅";
  var bbrk = "⎵";
  var bbrktbrk = "⎶";
  var bcong = "≌";
  var Bcy = "Б";
  var bcy = "б";
  var bdquo = "„";
  var becaus = "∵";
  var because = "∵";
  var Because = "∵";
  var bemptyv = "⦰";
  var bepsi = "϶";
  var bernou = "ℬ";
  var Bernoullis = "ℬ";
  var Beta = "Β";
  var beta = "β";
  var beth = "ℶ";
  var between = "≬";
  var Bfr = "𝔅";
  var bfr = "𝔟";
  var bigcap = "⋂";
  var bigcirc = "◯";
  var bigcup = "⋃";
  var bigodot = "⨀";
  var bigoplus = "⨁";
  var bigotimes = "⨂";
  var bigsqcup = "⨆";
  var bigstar = "★";
  var bigtriangledown = "▽";
  var bigtriangleup = "△";
  var biguplus = "⨄";
  var bigvee = "⋁";
  var bigwedge = "⋀";
  var bkarow = "⤍";
  var blacklozenge = "⧫";
  var blacksquare = "▪";
  var blacktriangle = "▴";
  var blacktriangledown = "▾";
  var blacktriangleleft = "◂";
  var blacktriangleright = "▸";
  var blank = "␣";
  var blk12 = "▒";
  var blk14 = "░";
  var blk34 = "▓";
  var block = "█";
  var bne = "=⃥";
  var bnequiv = "≡⃥";
  var bNot = "⫭";
  var bnot = "⌐";
  var Bopf = "𝔹";
  var bopf = "𝕓";
  var bot = "⊥";
  var bottom = "⊥";
  var bowtie = "⋈";
  var boxbox = "⧉";
  var boxdl = "┐";
  var boxdL = "╕";
  var boxDl = "╖";
  var boxDL = "╗";
  var boxdr = "┌";
  var boxdR = "╒";
  var boxDr = "╓";
  var boxDR = "╔";
  var boxh = "─";
  var boxH = "═";
  var boxhd = "┬";
  var boxHd = "╤";
  var boxhD = "╥";
  var boxHD = "╦";
  var boxhu = "┴";
  var boxHu = "╧";
  var boxhU = "╨";
  var boxHU = "╩";
  var boxminus = "⊟";
  var boxplus = "⊞";
  var boxtimes = "⊠";
  var boxul = "┘";
  var boxuL = "╛";
  var boxUl = "╜";
  var boxUL = "╝";
  var boxur = "└";
  var boxuR = "╘";
  var boxUr = "╙";
  var boxUR = "╚";
  var boxv = "│";
  var boxV = "║";
  var boxvh = "┼";
  var boxvH = "╪";
  var boxVh = "╫";
  var boxVH = "╬";
  var boxvl = "┤";
  var boxvL = "╡";
  var boxVl = "╢";
  var boxVL = "╣";
  var boxvr = "├";
  var boxvR = "╞";
  var boxVr = "╟";
  var boxVR = "╠";
  var bprime = "‵";
  var breve = "˘";
  var Breve = "˘";
  var brvbar = "¦";
  var bscr = "𝒷";
  var Bscr = "ℬ";
  var bsemi = "⁏";
  var bsim = "∽";
  var bsime = "⋍";
  var bsolb = "⧅";
  var bsol = "\\";
  var bsolhsub = "⟈";
  var bull = "•";
  var bullet = "•";
  var bump = "≎";
  var bumpE = "⪮";
  var bumpe = "≏";
  var Bumpeq = "≎";
  var bumpeq = "≏";
  var Cacute = "Ć";
  var cacute = "ć";
  var capand = "⩄";
  var capbrcup = "⩉";
  var capcap = "⩋";
  var cap = "∩";
  var Cap = "⋒";
  var capcup = "⩇";
  var capdot = "⩀";
  var CapitalDifferentialD = "ⅅ";
  var caps = "∩︀";
  var caret = "⁁";
  var caron = "ˇ";
  var Cayleys = "ℭ";
  var ccaps = "⩍";
  var Ccaron = "Č";
  var ccaron = "č";
  var Ccedil = "Ç";
  var ccedil = "ç";
  var Ccirc = "Ĉ";
  var ccirc = "ĉ";
  var Cconint = "∰";
  var ccups = "⩌";
  var ccupssm = "⩐";
  var Cdot = "Ċ";
  var cdot = "ċ";
  var cedil = "¸";
  var Cedilla = "¸";
  var cemptyv = "⦲";
  var cent = "¢";
  var centerdot = "·";
  var CenterDot = "·";
  var cfr = "𝔠";
  var Cfr = "ℭ";
  var CHcy = "Ч";
  var chcy = "ч";
  var check = "✓";
  var checkmark = "✓";
  var Chi = "Χ";
  var chi = "χ";
  var circ = "ˆ";
  var circeq = "≗";
  var circlearrowleft = "↺";
  var circlearrowright = "↻";
  var circledast = "⊛";
  var circledcirc = "⊚";
  var circleddash = "⊝";
  var CircleDot = "⊙";
  var circledR = "®";
  var circledS = "Ⓢ";
  var CircleMinus = "⊖";
  var CirclePlus = "⊕";
  var CircleTimes = "⊗";
  var cir = "○";
  var cirE = "⧃";
  var cire = "≗";
  var cirfnint = "⨐";
  var cirmid = "⫯";
  var cirscir = "⧂";
  var ClockwiseContourIntegral = "∲";
  var CloseCurlyDoubleQuote = "”";
  var CloseCurlyQuote = "’";
  var clubs = "♣";
  var clubsuit = "♣";
  var colon = ":";
  var Colon = "∷";
  var Colone = "⩴";
  var colone = "≔";
  var coloneq = "≔";
  var comma = ",";
  var commat = "@";
  var comp = "∁";
  var compfn = "∘";
  var complement = "∁";
  var complexes = "ℂ";
  var cong = "≅";
  var congdot = "⩭";
  var Congruent = "≡";
  var conint = "∮";
  var Conint = "∯";
  var ContourIntegral = "∮";
  var copf = "𝕔";
  var Copf = "ℂ";
  var coprod = "∐";
  var Coproduct = "∐";
  var copy = "©";
  var COPY = "©";
  var copysr = "℗";
  var CounterClockwiseContourIntegral = "∳";
  var crarr = "↵";
  var cross = "✗";
  var Cross = "⨯";
  var Cscr = "𝒞";
  var cscr = "𝒸";
  var csub = "⫏";
  var csube = "⫑";
  var csup = "⫐";
  var csupe = "⫒";
  var ctdot = "⋯";
  var cudarrl = "⤸";
  var cudarrr = "⤵";
  var cuepr = "⋞";
  var cuesc = "⋟";
  var cularr = "↶";
  var cularrp = "⤽";
  var cupbrcap = "⩈";
  var cupcap = "⩆";
  var CupCap = "≍";
  var cup = "∪";
  var Cup = "⋓";
  var cupcup = "⩊";
  var cupdot = "⊍";
  var cupor = "⩅";
  var cups = "∪︀";
  var curarr = "↷";
  var curarrm = "⤼";
  var curlyeqprec = "⋞";
  var curlyeqsucc = "⋟";
  var curlyvee = "⋎";
  var curlywedge = "⋏";
  var curren = "¤";
  var curvearrowleft = "↶";
  var curvearrowright = "↷";
  var cuvee = "⋎";
  var cuwed = "⋏";
  var cwconint = "∲";
  var cwint = "∱";
  var cylcty = "⌭";
  var dagger = "†";
  var Dagger = "‡";
  var daleth = "ℸ";
  var darr = "↓";
  var Darr = "↡";
  var dArr = "⇓";
  var dash = "‐";
  var Dashv = "⫤";
  var dashv = "⊣";
  var dbkarow = "⤏";
  var dblac = "˝";
  var Dcaron = "Ď";
  var dcaron = "ď";
  var Dcy = "Д";
  var dcy = "д";
  var ddagger = "‡";
  var ddarr = "⇊";
  var DD = "ⅅ";
  var dd = "ⅆ";
  var DDotrahd = "⤑";
  var ddotseq = "⩷";
  var deg = "°";
  var Del = "∇";
  var Delta = "Δ";
  var delta = "δ";
  var demptyv = "⦱";
  var dfisht = "⥿";
  var Dfr = "𝔇";
  var dfr = "𝔡";
  var dHar = "⥥";
  var dharl = "⇃";
  var dharr = "⇂";
  var DiacriticalAcute = "´";
  var DiacriticalDot = "˙";
  var DiacriticalDoubleAcute = "˝";
  var DiacriticalGrave = "`";
  var DiacriticalTilde = "˜";
  var diam = "⋄";
  var diamond = "⋄";
  var Diamond = "⋄";
  var diamondsuit = "♦";
  var diams = "♦";
  var die = "¨";
  var DifferentialD = "ⅆ";
  var digamma = "ϝ";
  var disin = "⋲";
  var div$1 = "÷";
  var divide$1 = "÷";
  var divideontimes = "⋇";
  var divonx = "⋇";
  var DJcy = "Ђ";
  var djcy = "ђ";
  var dlcorn = "⌞";
  var dlcrop = "⌍";
  var dollar = "$";
  var Dopf = "𝔻";
  var dopf = "𝕕";
  var Dot = "¨";
  var dot = "˙";
  var DotDot = "⃜";
  var doteq = "≐";
  var doteqdot = "≑";
  var DotEqual = "≐";
  var dotminus = "∸";
  var dotplus = "∔";
  var dotsquare = "⊡";
  var doublebarwedge = "⌆";
  var DoubleContourIntegral = "∯";
  var DoubleDot = "¨";
  var DoubleDownArrow = "⇓";
  var DoubleLeftArrow = "⇐";
  var DoubleLeftRightArrow = "⇔";
  var DoubleLeftTee = "⫤";
  var DoubleLongLeftArrow = "⟸";
  var DoubleLongLeftRightArrow = "⟺";
  var DoubleLongRightArrow = "⟹";
  var DoubleRightArrow = "⇒";
  var DoubleRightTee = "⊨";
  var DoubleUpArrow = "⇑";
  var DoubleUpDownArrow = "⇕";
  var DoubleVerticalBar = "∥";
  var DownArrowBar = "⤓";
  var downarrow = "↓";
  var DownArrow = "↓";
  var Downarrow = "⇓";
  var DownArrowUpArrow = "⇵";
  var DownBreve = "̑";
  var downdownarrows = "⇊";
  var downharpoonleft = "⇃";
  var downharpoonright = "⇂";
  var DownLeftRightVector = "⥐";
  var DownLeftTeeVector = "⥞";
  var DownLeftVectorBar = "⥖";
  var DownLeftVector = "↽";
  var DownRightTeeVector = "⥟";
  var DownRightVectorBar = "⥗";
  var DownRightVector = "⇁";
  var DownTeeArrow = "↧";
  var DownTee = "⊤";
  var drbkarow = "⤐";
  var drcorn = "⌟";
  var drcrop = "⌌";
  var Dscr = "𝒟";
  var dscr = "𝒹";
  var DScy = "Ѕ";
  var dscy = "ѕ";
  var dsol = "⧶";
  var Dstrok = "Đ";
  var dstrok = "đ";
  var dtdot = "⋱";
  var dtri = "▿";
  var dtrif = "▾";
  var duarr = "⇵";
  var duhar = "⥯";
  var dwangle = "⦦";
  var DZcy = "Џ";
  var dzcy = "џ";
  var dzigrarr = "⟿";
  var Eacute = "É";
  var eacute = "é";
  var easter = "⩮";
  var Ecaron = "Ě";
  var ecaron = "ě";
  var Ecirc = "Ê";
  var ecirc = "ê";
  var ecir = "≖";
  var ecolon = "≕";
  var Ecy = "Э";
  var ecy = "э";
  var eDDot = "⩷";
  var Edot = "Ė";
  var edot = "ė";
  var eDot = "≑";
  var ee = "ⅇ";
  var efDot = "≒";
  var Efr = "𝔈";
  var efr = "𝔢";
  var eg = "⪚";
  var Egrave = "È";
  var egrave = "è";
  var egs = "⪖";
  var egsdot = "⪘";
  var el = "⪙";
  var Element = "∈";
  var elinters = "⏧";
  var ell = "ℓ";
  var els = "⪕";
  var elsdot = "⪗";
  var Emacr = "Ē";
  var emacr = "ē";
  var empty = "∅";
  var emptyset = "∅";
  var EmptySmallSquare = "◻";
  var emptyv = "∅";
  var EmptyVerySmallSquare = "▫";
  var emsp13 = " ";
  var emsp14 = " ";
  var emsp = " ";
  var ENG = "Ŋ";
  var eng = "ŋ";
  var ensp = " ";
  var Eogon = "Ę";
  var eogon = "ę";
  var Eopf = "𝔼";
  var eopf = "𝕖";
  var epar = "⋕";
  var eparsl = "⧣";
  var eplus = "⩱";
  var epsi = "ε";
  var Epsilon = "Ε";
  var epsilon = "ε";
  var epsiv = "ϵ";
  var eqcirc = "≖";
  var eqcolon = "≕";
  var eqsim = "≂";
  var eqslantgtr = "⪖";
  var eqslantless = "⪕";
  var Equal = "⩵";
  var equals = "=";
  var EqualTilde = "≂";
  var equest = "≟";
  var Equilibrium = "⇌";
  var equiv = "≡";
  var equivDD = "⩸";
  var eqvparsl = "⧥";
  var erarr = "⥱";
  var erDot = "≓";
  var escr = "ℯ";
  var Escr = "ℰ";
  var esdot = "≐";
  var Esim = "⩳";
  var esim = "≂";
  var Eta = "Η";
  var eta = "η";
  var ETH = "Ð";
  var eth = "ð";
  var Euml = "Ë";
  var euml = "ë";
  var euro = "€";
  var excl = "!";
  var exist = "∃";
  var Exists = "∃";
  var expectation = "ℰ";
  var exponentiale = "ⅇ";
  var ExponentialE = "ⅇ";
  var fallingdotseq = "≒";
  var Fcy = "Ф";
  var fcy = "ф";
  var female = "♀";
  var ffilig = "ﬃ";
  var fflig = "ﬀ";
  var ffllig = "ﬄ";
  var Ffr = "𝔉";
  var ffr = "𝔣";
  var filig = "ﬁ";
  var FilledSmallSquare = "◼";
  var FilledVerySmallSquare = "▪";
  var fjlig = "fj";
  var flat = "♭";
  var fllig = "ﬂ";
  var fltns = "▱";
  var fnof = "ƒ";
  var Fopf = "𝔽";
  var fopf = "𝕗";
  var forall = "∀";
  var ForAll = "∀";
  var fork = "⋔";
  var forkv = "⫙";
  var Fouriertrf = "ℱ";
  var fpartint = "⨍";
  var frac12 = "½";
  var frac13 = "⅓";
  var frac14 = "¼";
  var frac15 = "⅕";
  var frac16 = "⅙";
  var frac18 = "⅛";
  var frac23 = "⅔";
  var frac25 = "⅖";
  var frac34 = "¾";
  var frac35 = "⅗";
  var frac38 = "⅜";
  var frac45 = "⅘";
  var frac56 = "⅚";
  var frac58 = "⅝";
  var frac78 = "⅞";
  var frasl = "⁄";
  var frown = "⌢";
  var fscr = "𝒻";
  var Fscr = "ℱ";
  var gacute = "ǵ";
  var Gamma = "Γ";
  var gamma = "γ";
  var Gammad = "Ϝ";
  var gammad = "ϝ";
  var gap = "⪆";
  var Gbreve = "Ğ";
  var gbreve = "ğ";
  var Gcedil = "Ģ";
  var Gcirc = "Ĝ";
  var gcirc = "ĝ";
  var Gcy = "Г";
  var gcy = "г";
  var Gdot = "Ġ";
  var gdot = "ġ";
  var ge = "≥";
  var gE = "≧";
  var gEl = "⪌";
  var gel = "⋛";
  var geq = "≥";
  var geqq = "≧";
  var geqslant = "⩾";
  var gescc = "⪩";
  var ges = "⩾";
  var gesdot = "⪀";
  var gesdoto = "⪂";
  var gesdotol = "⪄";
  var gesl = "⋛︀";
  var gesles = "⪔";
  var Gfr = "𝔊";
  var gfr = "𝔤";
  var gg = "≫";
  var Gg = "⋙";
  var ggg = "⋙";
  var gimel = "ℷ";
  var GJcy = "Ѓ";
  var gjcy = "ѓ";
  var gla = "⪥";
  var gl = "≷";
  var glE = "⪒";
  var glj = "⪤";
  var gnap = "⪊";
  var gnapprox = "⪊";
  var gne = "⪈";
  var gnE = "≩";
  var gneq = "⪈";
  var gneqq = "≩";
  var gnsim = "⋧";
  var Gopf = "𝔾";
  var gopf = "𝕘";
  var grave = "`";
  var GreaterEqual = "≥";
  var GreaterEqualLess = "⋛";
  var GreaterFullEqual = "≧";
  var GreaterGreater = "⪢";
  var GreaterLess = "≷";
  var GreaterSlantEqual = "⩾";
  var GreaterTilde = "≳";
  var Gscr = "𝒢";
  var gscr = "ℊ";
  var gsim = "≳";
  var gsime = "⪎";
  var gsiml = "⪐";
  var gtcc = "⪧";
  var gtcir = "⩺";
  var gt = ">";
  var GT = ">";
  var Gt = "≫";
  var gtdot = "⋗";
  var gtlPar = "⦕";
  var gtquest = "⩼";
  var gtrapprox = "⪆";
  var gtrarr = "⥸";
  var gtrdot = "⋗";
  var gtreqless = "⋛";
  var gtreqqless = "⪌";
  var gtrless = "≷";
  var gtrsim = "≳";
  var gvertneqq = "≩︀";
  var gvnE = "≩︀";
  var Hacek = "ˇ";
  var hairsp = " ";
  var half = "½";
  var hamilt = "ℋ";
  var HARDcy = "Ъ";
  var hardcy = "ъ";
  var harrcir = "⥈";
  var harr = "↔";
  var hArr = "⇔";
  var harrw = "↭";
  var Hat = "^";
  var hbar = "ℏ";
  var Hcirc = "Ĥ";
  var hcirc = "ĥ";
  var hearts = "♥";
  var heartsuit = "♥";
  var hellip = "…";
  var hercon = "⊹";
  var hfr = "𝔥";
  var Hfr = "ℌ";
  var HilbertSpace = "ℋ";
  var hksearow = "⤥";
  var hkswarow = "⤦";
  var hoarr = "⇿";
  var homtht = "∻";
  var hookleftarrow = "↩";
  var hookrightarrow = "↪";
  var hopf = "𝕙";
  var Hopf = "ℍ";
  var horbar = "―";
  var HorizontalLine = "─";
  var hscr = "𝒽";
  var Hscr = "ℋ";
  var hslash = "ℏ";
  var Hstrok = "Ħ";
  var hstrok = "ħ";
  var HumpDownHump = "≎";
  var HumpEqual = "≏";
  var hybull = "⁃";
  var hyphen = "‐";
  var Iacute = "Í";
  var iacute = "í";
  var ic = "⁣";
  var Icirc = "Î";
  var icirc = "î";
  var Icy = "И";
  var icy = "и";
  var Idot = "İ";
  var IEcy = "Е";
  var iecy = "е";
  var iexcl = "¡";
  var iff = "⇔";
  var ifr = "𝔦";
  var Ifr = "ℑ";
  var Igrave = "Ì";
  var igrave = "ì";
  var ii = "ⅈ";
  var iiiint = "⨌";
  var iiint = "∭";
  var iinfin = "⧜";
  var iiota = "℩";
  var IJlig = "Ĳ";
  var ijlig = "ĳ";
  var Imacr = "Ī";
  var imacr = "ī";
  var image = "ℑ";
  var ImaginaryI = "ⅈ";
  var imagline = "ℐ";
  var imagpart = "ℑ";
  var imath = "ı";
  var Im = "ℑ";
  var imof = "⊷";
  var imped = "Ƶ";
  var Implies = "⇒";
  var incare = "℅";
  var infin = "∞";
  var infintie = "⧝";
  var inodot = "ı";
  var intcal = "⊺";
  var int = "∫";
  var Int = "∬";
  var integers = "ℤ";
  var Integral = "∫";
  var intercal = "⊺";
  var Intersection = "⋂";
  var intlarhk = "⨗";
  var intprod = "⨼";
  var InvisibleComma = "⁣";
  var InvisibleTimes = "⁢";
  var IOcy = "Ё";
  var iocy = "ё";
  var Iogon = "Į";
  var iogon = "į";
  var Iopf = "𝕀";
  var iopf = "𝕚";
  var Iota = "Ι";
  var iota = "ι";
  var iprod = "⨼";
  var iquest = "¿";
  var iscr = "𝒾";
  var Iscr = "ℐ";
  var isin = "∈";
  var isindot = "⋵";
  var isinE = "⋹";
  var isins = "⋴";
  var isinsv = "⋳";
  var isinv = "∈";
  var it = "⁢";
  var Itilde = "Ĩ";
  var itilde = "ĩ";
  var Iukcy = "І";
  var iukcy = "і";
  var Iuml = "Ï";
  var iuml = "ï";
  var Jcirc = "Ĵ";
  var jcirc = "ĵ";
  var Jcy = "Й";
  var jcy = "й";
  var Jfr = "𝔍";
  var jfr = "𝔧";
  var jmath = "ȷ";
  var Jopf = "𝕁";
  var jopf = "𝕛";
  var Jscr = "𝒥";
  var jscr = "𝒿";
  var Jsercy = "Ј";
  var jsercy = "ј";
  var Jukcy = "Є";
  var jukcy = "є";
  var Kappa = "Κ";
  var kappa = "κ";
  var kappav = "ϰ";
  var Kcedil = "Ķ";
  var kcedil = "ķ";
  var Kcy = "К";
  var kcy = "к";
  var Kfr = "𝔎";
  var kfr = "𝔨";
  var kgreen = "ĸ";
  var KHcy = "Х";
  var khcy = "х";
  var KJcy = "Ќ";
  var kjcy = "ќ";
  var Kopf = "𝕂";
  var kopf = "𝕜";
  var Kscr = "𝒦";
  var kscr = "𝓀";
  var lAarr = "⇚";
  var Lacute = "Ĺ";
  var lacute = "ĺ";
  var laemptyv = "⦴";
  var lagran = "ℒ";
  var Lambda = "Λ";
  var lambda = "λ";
  var lang = "⟨";
  var Lang = "⟪";
  var langd = "⦑";
  var langle = "⟨";
  var lap = "⪅";
  var Laplacetrf = "ℒ";
  var laquo = "«";
  var larrb = "⇤";
  var larrbfs = "⤟";
  var larr = "←";
  var Larr = "↞";
  var lArr = "⇐";
  var larrfs = "⤝";
  var larrhk = "↩";
  var larrlp = "↫";
  var larrpl = "⤹";
  var larrsim = "⥳";
  var larrtl = "↢";
  var latail = "⤙";
  var lAtail = "⤛";
  var lat = "⪫";
  var late = "⪭";
  var lates = "⪭︀";
  var lbarr = "⤌";
  var lBarr = "⤎";
  var lbbrk = "❲";
  var lbrace = "{";
  var lbrack = "[";
  var lbrke = "⦋";
  var lbrksld = "⦏";
  var lbrkslu = "⦍";
  var Lcaron = "Ľ";
  var lcaron = "ľ";
  var Lcedil = "Ļ";
  var lcedil = "ļ";
  var lceil = "⌈";
  var lcub = "{";
  var Lcy = "Л";
  var lcy = "л";
  var ldca = "⤶";
  var ldquo = "“";
  var ldquor = "„";
  var ldrdhar = "⥧";
  var ldrushar = "⥋";
  var ldsh = "↲";
  var le = "≤";
  var lE = "≦";
  var LeftAngleBracket = "⟨";
  var LeftArrowBar = "⇤";
  var leftarrow = "←";
  var LeftArrow = "←";
  var Leftarrow = "⇐";
  var LeftArrowRightArrow = "⇆";
  var leftarrowtail = "↢";
  var LeftCeiling = "⌈";
  var LeftDoubleBracket = "⟦";
  var LeftDownTeeVector = "⥡";
  var LeftDownVectorBar = "⥙";
  var LeftDownVector = "⇃";
  var LeftFloor = "⌊";
  var leftharpoondown = "↽";
  var leftharpoonup = "↼";
  var leftleftarrows = "⇇";
  var leftrightarrow = "↔";
  var LeftRightArrow = "↔";
  var Leftrightarrow = "⇔";
  var leftrightarrows = "⇆";
  var leftrightharpoons = "⇋";
  var leftrightsquigarrow = "↭";
  var LeftRightVector = "⥎";
  var LeftTeeArrow = "↤";
  var LeftTee = "⊣";
  var LeftTeeVector = "⥚";
  var leftthreetimes = "⋋";
  var LeftTriangleBar = "⧏";
  var LeftTriangle = "⊲";
  var LeftTriangleEqual = "⊴";
  var LeftUpDownVector = "⥑";
  var LeftUpTeeVector = "⥠";
  var LeftUpVectorBar = "⥘";
  var LeftUpVector = "↿";
  var LeftVectorBar = "⥒";
  var LeftVector = "↼";
  var lEg = "⪋";
  var leg = "⋚";
  var leq = "≤";
  var leqq = "≦";
  var leqslant = "⩽";
  var lescc = "⪨";
  var les = "⩽";
  var lesdot = "⩿";
  var lesdoto = "⪁";
  var lesdotor = "⪃";
  var lesg = "⋚︀";
  var lesges = "⪓";
  var lessapprox = "⪅";
  var lessdot = "⋖";
  var lesseqgtr = "⋚";
  var lesseqqgtr = "⪋";
  var LessEqualGreater = "⋚";
  var LessFullEqual = "≦";
  var LessGreater = "≶";
  var lessgtr = "≶";
  var LessLess = "⪡";
  var lesssim = "≲";
  var LessSlantEqual = "⩽";
  var LessTilde = "≲";
  var lfisht = "⥼";
  var lfloor = "⌊";
  var Lfr = "𝔏";
  var lfr = "𝔩";
  var lg = "≶";
  var lgE = "⪑";
  var lHar = "⥢";
  var lhard = "↽";
  var lharu = "↼";
  var lharul = "⥪";
  var lhblk = "▄";
  var LJcy = "Љ";
  var ljcy = "љ";
  var llarr = "⇇";
  var ll = "≪";
  var Ll = "⋘";
  var llcorner = "⌞";
  var Lleftarrow = "⇚";
  var llhard = "⥫";
  var lltri = "◺";
  var Lmidot = "Ŀ";
  var lmidot = "ŀ";
  var lmoustache = "⎰";
  var lmoust = "⎰";
  var lnap = "⪉";
  var lnapprox = "⪉";
  var lne = "⪇";
  var lnE = "≨";
  var lneq = "⪇";
  var lneqq = "≨";
  var lnsim = "⋦";
  var loang = "⟬";
  var loarr = "⇽";
  var lobrk = "⟦";
  var longleftarrow = "⟵";
  var LongLeftArrow = "⟵";
  var Longleftarrow = "⟸";
  var longleftrightarrow = "⟷";
  var LongLeftRightArrow = "⟷";
  var Longleftrightarrow = "⟺";
  var longmapsto = "⟼";
  var longrightarrow = "⟶";
  var LongRightArrow = "⟶";
  var Longrightarrow = "⟹";
  var looparrowleft = "↫";
  var looparrowright = "↬";
  var lopar = "⦅";
  var Lopf = "𝕃";
  var lopf = "𝕝";
  var loplus = "⨭";
  var lotimes = "⨴";
  var lowast = "∗";
  var lowbar = "_";
  var LowerLeftArrow = "↙";
  var LowerRightArrow = "↘";
  var loz = "◊";
  var lozenge = "◊";
  var lozf = "⧫";
  var lpar = "(";
  var lparlt = "⦓";
  var lrarr = "⇆";
  var lrcorner = "⌟";
  var lrhar = "⇋";
  var lrhard = "⥭";
  var lrm = "‎";
  var lrtri = "⊿";
  var lsaquo = "‹";
  var lscr = "𝓁";
  var Lscr = "ℒ";
  var lsh = "↰";
  var Lsh = "↰";
  var lsim = "≲";
  var lsime = "⪍";
  var lsimg = "⪏";
  var lsqb = "[";
  var lsquo = "‘";
  var lsquor = "‚";
  var Lstrok = "Ł";
  var lstrok = "ł";
  var ltcc = "⪦";
  var ltcir = "⩹";
  var lt = "<";
  var LT = "<";
  var Lt = "≪";
  var ltdot = "⋖";
  var lthree = "⋋";
  var ltimes = "⋉";
  var ltlarr = "⥶";
  var ltquest = "⩻";
  var ltri = "◃";
  var ltrie = "⊴";
  var ltrif = "◂";
  var ltrPar = "⦖";
  var lurdshar = "⥊";
  var luruhar = "⥦";
  var lvertneqq = "≨︀";
  var lvnE = "≨︀";
  var macr = "¯";
  var male = "♂";
  var malt = "✠";
  var maltese = "✠";
  var map = "↦";
  var mapsto = "↦";
  var mapstodown = "↧";
  var mapstoleft = "↤";
  var mapstoup = "↥";
  var marker = "▮";
  var mcomma = "⨩";
  var Mcy = "М";
  var mcy = "м";
  var mdash = "—";
  var mDDot = "∺";
  var measuredangle = "∡";
  var MediumSpace = " ";
  var Mellintrf = "ℳ";
  var Mfr = "𝔐";
  var mfr = "𝔪";
  var mho = "℧";
  var micro = "µ";
  var midast = "*";
  var midcir = "⫰";
  var mid = "∣";
  var middot = "·";
  var minusb = "⊟";
  var minus = "−";
  var minusd = "∸";
  var minusdu = "⨪";
  var MinusPlus = "∓";
  var mlcp = "⫛";
  var mldr = "…";
  var mnplus = "∓";
  var models = "⊧";
  var Mopf = "𝕄";
  var mopf = "𝕞";
  var mp = "∓";
  var mscr = "𝓂";
  var Mscr = "ℳ";
  var mstpos = "∾";
  var Mu = "Μ";
  var mu = "μ";
  var multimap = "⊸";
  var mumap = "⊸";
  var nabla = "∇";
  var Nacute = "Ń";
  var nacute = "ń";
  var nang = "∠⃒";
  var nap = "≉";
  var napE = "⩰̸";
  var napid = "≋̸";
  var napos = "ŉ";
  var napprox = "≉";
  var natural = "♮";
  var naturals = "ℕ";
  var natur = "♮";
  var nbsp = " ";
  var nbump = "≎̸";
  var nbumpe = "≏̸";
  var ncap = "⩃";
  var Ncaron = "Ň";
  var ncaron = "ň";
  var Ncedil = "Ņ";
  var ncedil = "ņ";
  var ncong = "≇";
  var ncongdot = "⩭̸";
  var ncup = "⩂";
  var Ncy = "Н";
  var ncy = "н";
  var ndash = "–";
  var nearhk = "⤤";
  var nearr = "↗";
  var neArr = "⇗";
  var nearrow = "↗";
  var ne = "≠";
  var nedot = "≐̸";
  var NegativeMediumSpace = "​";
  var NegativeThickSpace = "​";
  var NegativeThinSpace = "​";
  var NegativeVeryThinSpace = "​";
  var nequiv = "≢";
  var nesear = "⤨";
  var nesim = "≂̸";
  var NestedGreaterGreater = "≫";
  var NestedLessLess = "≪";
  var NewLine = "\n";
  var nexist = "∄";
  var nexists = "∄";
  var Nfr = "𝔑";
  var nfr = "𝔫";
  var ngE = "≧̸";
  var nge = "≱";
  var ngeq = "≱";
  var ngeqq = "≧̸";
  var ngeqslant = "⩾̸";
  var nges = "⩾̸";
  var nGg = "⋙̸";
  var ngsim = "≵";
  var nGt = "≫⃒";
  var ngt = "≯";
  var ngtr = "≯";
  var nGtv = "≫̸";
  var nharr = "↮";
  var nhArr = "⇎";
  var nhpar = "⫲";
  var ni = "∋";
  var nis = "⋼";
  var nisd = "⋺";
  var niv = "∋";
  var NJcy = "Њ";
  var njcy = "њ";
  var nlarr = "↚";
  var nlArr = "⇍";
  var nldr = "‥";
  var nlE = "≦̸";
  var nle = "≰";
  var nleftarrow = "↚";
  var nLeftarrow = "⇍";
  var nleftrightarrow = "↮";
  var nLeftrightarrow = "⇎";
  var nleq = "≰";
  var nleqq = "≦̸";
  var nleqslant = "⩽̸";
  var nles = "⩽̸";
  var nless = "≮";
  var nLl = "⋘̸";
  var nlsim = "≴";
  var nLt = "≪⃒";
  var nlt = "≮";
  var nltri = "⋪";
  var nltrie = "⋬";
  var nLtv = "≪̸";
  var nmid = "∤";
  var NoBreak = "⁠";
  var NonBreakingSpace = " ";
  var nopf = "𝕟";
  var Nopf = "ℕ";
  var Not = "⫬";
  var not = "¬";
  var NotCongruent = "≢";
  var NotCupCap = "≭";
  var NotDoubleVerticalBar = "∦";
  var NotElement = "∉";
  var NotEqual = "≠";
  var NotEqualTilde = "≂̸";
  var NotExists = "∄";
  var NotGreater = "≯";
  var NotGreaterEqual = "≱";
  var NotGreaterFullEqual = "≧̸";
  var NotGreaterGreater = "≫̸";
  var NotGreaterLess = "≹";
  var NotGreaterSlantEqual = "⩾̸";
  var NotGreaterTilde = "≵";
  var NotHumpDownHump = "≎̸";
  var NotHumpEqual = "≏̸";
  var notin = "∉";
  var notindot = "⋵̸";
  var notinE = "⋹̸";
  var notinva = "∉";
  var notinvb = "⋷";
  var notinvc = "⋶";
  var NotLeftTriangleBar = "⧏̸";
  var NotLeftTriangle = "⋪";
  var NotLeftTriangleEqual = "⋬";
  var NotLess = "≮";
  var NotLessEqual = "≰";
  var NotLessGreater = "≸";
  var NotLessLess = "≪̸";
  var NotLessSlantEqual = "⩽̸";
  var NotLessTilde = "≴";
  var NotNestedGreaterGreater = "⪢̸";
  var NotNestedLessLess = "⪡̸";
  var notni = "∌";
  var notniva = "∌";
  var notnivb = "⋾";
  var notnivc = "⋽";
  var NotPrecedes = "⊀";
  var NotPrecedesEqual = "⪯̸";
  var NotPrecedesSlantEqual = "⋠";
  var NotReverseElement = "∌";
  var NotRightTriangleBar = "⧐̸";
  var NotRightTriangle = "⋫";
  var NotRightTriangleEqual = "⋭";
  var NotSquareSubset = "⊏̸";
  var NotSquareSubsetEqual = "⋢";
  var NotSquareSuperset = "⊐̸";
  var NotSquareSupersetEqual = "⋣";
  var NotSubset = "⊂⃒";
  var NotSubsetEqual = "⊈";
  var NotSucceeds = "⊁";
  var NotSucceedsEqual = "⪰̸";
  var NotSucceedsSlantEqual = "⋡";
  var NotSucceedsTilde = "≿̸";
  var NotSuperset = "⊃⃒";
  var NotSupersetEqual = "⊉";
  var NotTilde = "≁";
  var NotTildeEqual = "≄";
  var NotTildeFullEqual = "≇";
  var NotTildeTilde = "≉";
  var NotVerticalBar = "∤";
  var nparallel = "∦";
  var npar = "∦";
  var nparsl = "⫽⃥";
  var npart = "∂̸";
  var npolint = "⨔";
  var npr = "⊀";
  var nprcue = "⋠";
  var nprec = "⊀";
  var npreceq = "⪯̸";
  var npre = "⪯̸";
  var nrarrc = "⤳̸";
  var nrarr = "↛";
  var nrArr = "⇏";
  var nrarrw = "↝̸";
  var nrightarrow = "↛";
  var nRightarrow = "⇏";
  var nrtri = "⋫";
  var nrtrie = "⋭";
  var nsc = "⊁";
  var nsccue = "⋡";
  var nsce = "⪰̸";
  var Nscr = "𝒩";
  var nscr = "𝓃";
  var nshortmid = "∤";
  var nshortparallel = "∦";
  var nsim = "≁";
  var nsime = "≄";
  var nsimeq = "≄";
  var nsmid = "∤";
  var nspar = "∦";
  var nsqsube = "⋢";
  var nsqsupe = "⋣";
  var nsub = "⊄";
  var nsubE = "⫅̸";
  var nsube = "⊈";
  var nsubset = "⊂⃒";
  var nsubseteq = "⊈";
  var nsubseteqq = "⫅̸";
  var nsucc = "⊁";
  var nsucceq = "⪰̸";
  var nsup = "⊅";
  var nsupE = "⫆̸";
  var nsupe = "⊉";
  var nsupset = "⊃⃒";
  var nsupseteq = "⊉";
  var nsupseteqq = "⫆̸";
  var ntgl = "≹";
  var Ntilde = "Ñ";
  var ntilde = "ñ";
  var ntlg = "≸";
  var ntriangleleft = "⋪";
  var ntrianglelefteq = "⋬";
  var ntriangleright = "⋫";
  var ntrianglerighteq = "⋭";
  var Nu = "Ν";
  var nu = "ν";
  var num = "#";
  var numero = "№";
  var numsp = " ";
  var nvap = "≍⃒";
  var nvdash = "⊬";
  var nvDash = "⊭";
  var nVdash = "⊮";
  var nVDash = "⊯";
  var nvge = "≥⃒";
  var nvgt = ">⃒";
  var nvHarr = "⤄";
  var nvinfin = "⧞";
  var nvlArr = "⤂";
  var nvle = "≤⃒";
  var nvlt = "<⃒";
  var nvltrie = "⊴⃒";
  var nvrArr = "⤃";
  var nvrtrie = "⊵⃒";
  var nvsim = "∼⃒";
  var nwarhk = "⤣";
  var nwarr = "↖";
  var nwArr = "⇖";
  var nwarrow = "↖";
  var nwnear = "⤧";
  var Oacute = "Ó";
  var oacute = "ó";
  var oast = "⊛";
  var Ocirc = "Ô";
  var ocirc = "ô";
  var ocir = "⊚";
  var Ocy = "О";
  var ocy = "о";
  var odash = "⊝";
  var Odblac = "Ő";
  var odblac = "ő";
  var odiv = "⨸";
  var odot = "⊙";
  var odsold = "⦼";
  var OElig = "Œ";
  var oelig = "œ";
  var ofcir = "⦿";
  var Ofr = "𝔒";
  var ofr = "𝔬";
  var ogon = "˛";
  var Ograve = "Ò";
  var ograve = "ò";
  var ogt = "⧁";
  var ohbar = "⦵";
  var ohm = "Ω";
  var oint = "∮";
  var olarr = "↺";
  var olcir = "⦾";
  var olcross = "⦻";
  var oline = "‾";
  var olt = "⧀";
  var Omacr = "Ō";
  var omacr = "ō";
  var Omega = "Ω";
  var omega = "ω";
  var Omicron = "Ο";
  var omicron = "ο";
  var omid = "⦶";
  var ominus = "⊖";
  var Oopf = "𝕆";
  var oopf = "𝕠";
  var opar = "⦷";
  var OpenCurlyDoubleQuote = "“";
  var OpenCurlyQuote = "‘";
  var operp = "⦹";
  var oplus = "⊕";
  var orarr = "↻";
  var Or = "⩔";
  var or = "∨";
  var ord = "⩝";
  var order = "ℴ";
  var orderof = "ℴ";
  var ordf = "ª";
  var ordm = "º";
  var origof = "⊶";
  var oror = "⩖";
  var orslope = "⩗";
  var orv = "⩛";
  var oS = "Ⓢ";
  var Oscr = "𝒪";
  var oscr = "ℴ";
  var Oslash = "Ø";
  var oslash = "ø";
  var osol = "⊘";
  var Otilde = "Õ";
  var otilde = "õ";
  var otimesas = "⨶";
  var Otimes = "⨷";
  var otimes = "⊗";
  var Ouml = "Ö";
  var ouml = "ö";
  var ovbar = "⌽";
  var OverBar = "‾";
  var OverBrace = "⏞";
  var OverBracket = "⎴";
  var OverParenthesis = "⏜";
  var para = "¶";
  var parallel = "∥";
  var par = "∥";
  var parsim = "⫳";
  var parsl = "⫽";
  var part = "∂";
  var PartialD = "∂";
  var Pcy = "П";
  var pcy = "п";
  var percnt = "%";
  var period = ".";
  var permil = "‰";
  var perp = "⊥";
  var pertenk = "‱";
  var Pfr = "𝔓";
  var pfr = "𝔭";
  var Phi = "Φ";
  var phi = "φ";
  var phiv = "ϕ";
  var phmmat = "ℳ";
  var phone = "☎";
  var Pi = "Π";
  var pi = "π";
  var pitchfork = "⋔";
  var piv = "ϖ";
  var planck = "ℏ";
  var planckh = "ℎ";
  var plankv = "ℏ";
  var plusacir = "⨣";
  var plusb = "⊞";
  var pluscir = "⨢";
  var plus = "+";
  var plusdo = "∔";
  var plusdu = "⨥";
  var pluse = "⩲";
  var PlusMinus = "±";
  var plusmn = "±";
  var plussim = "⨦";
  var plustwo = "⨧";
  var pm = "±";
  var Poincareplane = "ℌ";
  var pointint = "⨕";
  var popf = "𝕡";
  var Popf = "ℙ";
  var pound = "£";
  var prap = "⪷";
  var Pr = "⪻";
  var pr = "≺";
  var prcue = "≼";
  var precapprox = "⪷";
  var prec = "≺";
  var preccurlyeq = "≼";
  var Precedes = "≺";
  var PrecedesEqual = "⪯";
  var PrecedesSlantEqual = "≼";
  var PrecedesTilde = "≾";
  var preceq = "⪯";
  var precnapprox = "⪹";
  var precneqq = "⪵";
  var precnsim = "⋨";
  var pre = "⪯";
  var prE = "⪳";
  var precsim = "≾";
  var prime = "′";
  var Prime = "″";
  var primes = "ℙ";
  var prnap = "⪹";
  var prnE = "⪵";
  var prnsim = "⋨";
  var prod = "∏";
  var Product = "∏";
  var profalar = "⌮";
  var profline = "⌒";
  var profsurf = "⌓";
  var prop = "∝";
  var Proportional = "∝";
  var Proportion = "∷";
  var propto = "∝";
  var prsim = "≾";
  var prurel = "⊰";
  var Pscr = "𝒫";
  var pscr = "𝓅";
  var Psi = "Ψ";
  var psi = "ψ";
  var puncsp = " ";
  var Qfr = "𝔔";
  var qfr = "𝔮";
  var qint = "⨌";
  var qopf = "𝕢";
  var Qopf = "ℚ";
  var qprime = "⁗";
  var Qscr = "𝒬";
  var qscr = "𝓆";
  var quaternions = "ℍ";
  var quatint = "⨖";
  var quest = "?";
  var questeq = "≟";
  var quot = "\"";
  var QUOT = "\"";
  var rAarr = "⇛";
  var race = "∽̱";
  var Racute = "Ŕ";
  var racute = "ŕ";
  var radic = "√";
  var raemptyv = "⦳";
  var rang = "⟩";
  var Rang = "⟫";
  var rangd = "⦒";
  var range = "⦥";
  var rangle = "⟩";
  var raquo = "»";
  var rarrap = "⥵";
  var rarrb = "⇥";
  var rarrbfs = "⤠";
  var rarrc = "⤳";
  var rarr = "→";
  var Rarr = "↠";
  var rArr = "⇒";
  var rarrfs = "⤞";
  var rarrhk = "↪";
  var rarrlp = "↬";
  var rarrpl = "⥅";
  var rarrsim = "⥴";
  var Rarrtl = "⤖";
  var rarrtl = "↣";
  var rarrw = "↝";
  var ratail = "⤚";
  var rAtail = "⤜";
  var ratio = "∶";
  var rationals = "ℚ";
  var rbarr = "⤍";
  var rBarr = "⤏";
  var RBarr = "⤐";
  var rbbrk = "❳";
  var rbrace = "}";
  var rbrack = "]";
  var rbrke = "⦌";
  var rbrksld = "⦎";
  var rbrkslu = "⦐";
  var Rcaron = "Ř";
  var rcaron = "ř";
  var Rcedil = "Ŗ";
  var rcedil = "ŗ";
  var rceil = "⌉";
  var rcub = "}";
  var Rcy = "Р";
  var rcy = "р";
  var rdca = "⤷";
  var rdldhar = "⥩";
  var rdquo = "”";
  var rdquor = "”";
  var rdsh = "↳";
  var real = "ℜ";
  var realine = "ℛ";
  var realpart = "ℜ";
  var reals = "ℝ";
  var Re = "ℜ";
  var rect = "▭";
  var reg = "®";
  var REG = "®";
  var ReverseElement = "∋";
  var ReverseEquilibrium = "⇋";
  var ReverseUpEquilibrium = "⥯";
  var rfisht = "⥽";
  var rfloor = "⌋";
  var rfr = "𝔯";
  var Rfr = "ℜ";
  var rHar = "⥤";
  var rhard = "⇁";
  var rharu = "⇀";
  var rharul = "⥬";
  var Rho = "Ρ";
  var rho = "ρ";
  var rhov = "ϱ";
  var RightAngleBracket = "⟩";
  var RightArrowBar = "⇥";
  var rightarrow = "→";
  var RightArrow = "→";
  var Rightarrow = "⇒";
  var RightArrowLeftArrow = "⇄";
  var rightarrowtail = "↣";
  var RightCeiling = "⌉";
  var RightDoubleBracket = "⟧";
  var RightDownTeeVector = "⥝";
  var RightDownVectorBar = "⥕";
  var RightDownVector = "⇂";
  var RightFloor = "⌋";
  var rightharpoondown = "⇁";
  var rightharpoonup = "⇀";
  var rightleftarrows = "⇄";
  var rightleftharpoons = "⇌";
  var rightrightarrows = "⇉";
  var rightsquigarrow = "↝";
  var RightTeeArrow = "↦";
  var RightTee = "⊢";
  var RightTeeVector = "⥛";
  var rightthreetimes = "⋌";
  var RightTriangleBar = "⧐";
  var RightTriangle = "⊳";
  var RightTriangleEqual = "⊵";
  var RightUpDownVector = "⥏";
  var RightUpTeeVector = "⥜";
  var RightUpVectorBar = "⥔";
  var RightUpVector = "↾";
  var RightVectorBar = "⥓";
  var RightVector = "⇀";
  var ring = "˚";
  var risingdotseq = "≓";
  var rlarr = "⇄";
  var rlhar = "⇌";
  var rlm = "‏";
  var rmoustache = "⎱";
  var rmoust = "⎱";
  var rnmid = "⫮";
  var roang = "⟭";
  var roarr = "⇾";
  var robrk = "⟧";
  var ropar = "⦆";
  var ropf = "𝕣";
  var Ropf = "ℝ";
  var roplus = "⨮";
  var rotimes = "⨵";
  var RoundImplies = "⥰";
  var rpar = ")";
  var rpargt = "⦔";
  var rppolint = "⨒";
  var rrarr = "⇉";
  var Rrightarrow = "⇛";
  var rsaquo = "›";
  var rscr = "𝓇";
  var Rscr = "ℛ";
  var rsh = "↱";
  var Rsh = "↱";
  var rsqb = "]";
  var rsquo = "’";
  var rsquor = "’";
  var rthree = "⋌";
  var rtimes = "⋊";
  var rtri = "▹";
  var rtrie = "⊵";
  var rtrif = "▸";
  var rtriltri = "⧎";
  var RuleDelayed = "⧴";
  var ruluhar = "⥨";
  var rx = "℞";
  var Sacute = "Ś";
  var sacute = "ś";
  var sbquo = "‚";
  var scap = "⪸";
  var Scaron = "Š";
  var scaron = "š";
  var Sc = "⪼";
  var sc = "≻";
  var sccue = "≽";
  var sce = "⪰";
  var scE = "⪴";
  var Scedil = "Ş";
  var scedil = "ş";
  var Scirc = "Ŝ";
  var scirc = "ŝ";
  var scnap = "⪺";
  var scnE = "⪶";
  var scnsim = "⋩";
  var scpolint = "⨓";
  var scsim = "≿";
  var Scy = "С";
  var scy = "с";
  var sdotb = "⊡";
  var sdot = "⋅";
  var sdote = "⩦";
  var searhk = "⤥";
  var searr = "↘";
  var seArr = "⇘";
  var searrow = "↘";
  var sect = "§";
  var semi = ";";
  var seswar = "⤩";
  var setminus = "∖";
  var setmn = "∖";
  var sext = "✶";
  var Sfr = "𝔖";
  var sfr = "𝔰";
  var sfrown = "⌢";
  var sharp = "♯";
  var SHCHcy = "Щ";
  var shchcy = "щ";
  var SHcy = "Ш";
  var shcy = "ш";
  var ShortDownArrow = "↓";
  var ShortLeftArrow = "←";
  var shortmid = "∣";
  var shortparallel = "∥";
  var ShortRightArrow = "→";
  var ShortUpArrow = "↑";
  var shy = "­";
  var Sigma = "Σ";
  var sigma = "σ";
  var sigmaf = "ς";
  var sigmav = "ς";
  var sim = "∼";
  var simdot = "⩪";
  var sime = "≃";
  var simeq = "≃";
  var simg = "⪞";
  var simgE = "⪠";
  var siml = "⪝";
  var simlE = "⪟";
  var simne = "≆";
  var simplus = "⨤";
  var simrarr = "⥲";
  var slarr = "←";
  var SmallCircle = "∘";
  var smallsetminus = "∖";
  var smashp = "⨳";
  var smeparsl = "⧤";
  var smid = "∣";
  var smile = "⌣";
  var smt = "⪪";
  var smte = "⪬";
  var smtes = "⪬︀";
  var SOFTcy = "Ь";
  var softcy = "ь";
  var solbar = "⌿";
  var solb = "⧄";
  var sol = "/";
  var Sopf = "𝕊";
  var sopf = "𝕤";
  var spades = "♠";
  var spadesuit = "♠";
  var spar = "∥";
  var sqcap = "⊓";
  var sqcaps = "⊓︀";
  var sqcup = "⊔";
  var sqcups = "⊔︀";
  var Sqrt = "√";
  var sqsub = "⊏";
  var sqsube = "⊑";
  var sqsubset = "⊏";
  var sqsubseteq = "⊑";
  var sqsup = "⊐";
  var sqsupe = "⊒";
  var sqsupset = "⊐";
  var sqsupseteq = "⊒";
  var square = "□";
  var Square = "□";
  var SquareIntersection = "⊓";
  var SquareSubset = "⊏";
  var SquareSubsetEqual = "⊑";
  var SquareSuperset = "⊐";
  var SquareSupersetEqual = "⊒";
  var SquareUnion = "⊔";
  var squarf = "▪";
  var squ = "□";
  var squf = "▪";
  var srarr = "→";
  var Sscr = "𝒮";
  var sscr = "𝓈";
  var ssetmn = "∖";
  var ssmile = "⌣";
  var sstarf = "⋆";
  var Star = "⋆";
  var star = "☆";
  var starf = "★";
  var straightepsilon = "ϵ";
  var straightphi = "ϕ";
  var strns = "¯";
  var sub$1 = "⊂";
  var Sub = "⋐";
  var subdot = "⪽";
  var subE = "⫅";
  var sube = "⊆";
  var subedot = "⫃";
  var submult = "⫁";
  var subnE = "⫋";
  var subne = "⊊";
  var subplus = "⪿";
  var subrarr = "⥹";
  var subset = "⊂";
  var Subset = "⋐";
  var subseteq = "⊆";
  var subseteqq = "⫅";
  var SubsetEqual = "⊆";
  var subsetneq = "⊊";
  var subsetneqq = "⫋";
  var subsim = "⫇";
  var subsub = "⫕";
  var subsup = "⫓";
  var succapprox = "⪸";
  var succ = "≻";
  var succcurlyeq = "≽";
  var Succeeds = "≻";
  var SucceedsEqual = "⪰";
  var SucceedsSlantEqual = "≽";
  var SucceedsTilde = "≿";
  var succeq = "⪰";
  var succnapprox = "⪺";
  var succneqq = "⪶";
  var succnsim = "⋩";
  var succsim = "≿";
  var SuchThat = "∋";
  var sum = "∑";
  var Sum = "∑";
  var sung = "♪";
  var sup1 = "¹";
  var sup2 = "²";
  var sup3 = "³";
  var sup = "⊃";
  var Sup = "⋑";
  var supdot = "⪾";
  var supdsub = "⫘";
  var supE = "⫆";
  var supe = "⊇";
  var supedot = "⫄";
  var Superset = "⊃";
  var SupersetEqual = "⊇";
  var suphsol = "⟉";
  var suphsub = "⫗";
  var suplarr = "⥻";
  var supmult = "⫂";
  var supnE = "⫌";
  var supne = "⊋";
  var supplus = "⫀";
  var supset = "⊃";
  var Supset = "⋑";
  var supseteq = "⊇";
  var supseteqq = "⫆";
  var supsetneq = "⊋";
  var supsetneqq = "⫌";
  var supsim = "⫈";
  var supsub = "⫔";
  var supsup = "⫖";
  var swarhk = "⤦";
  var swarr = "↙";
  var swArr = "⇙";
  var swarrow = "↙";
  var swnwar = "⤪";
  var szlig = "ß";
  var Tab = "\t";
  var target = "⌖";
  var Tau = "Τ";
  var tau = "τ";
  var tbrk = "⎴";
  var Tcaron = "Ť";
  var tcaron = "ť";
  var Tcedil = "Ţ";
  var tcedil = "ţ";
  var Tcy = "Т";
  var tcy = "т";
  var tdot = "⃛";
  var telrec = "⌕";
  var Tfr = "𝔗";
  var tfr = "𝔱";
  var there4 = "∴";
  var therefore = "∴";
  var Therefore = "∴";
  var Theta = "Θ";
  var theta = "θ";
  var thetasym = "ϑ";
  var thetav = "ϑ";
  var thickapprox = "≈";
  var thicksim = "∼";
  var ThickSpace = "  ";
  var ThinSpace = " ";
  var thinsp = " ";
  var thkap = "≈";
  var thksim = "∼";
  var THORN = "Þ";
  var thorn = "þ";
  var tilde = "˜";
  var Tilde = "∼";
  var TildeEqual = "≃";
  var TildeFullEqual = "≅";
  var TildeTilde = "≈";
  var timesbar = "⨱";
  var timesb = "⊠";
  var times = "×";
  var timesd = "⨰";
  var tint = "∭";
  var toea = "⤨";
  var topbot = "⌶";
  var topcir = "⫱";
  var top = "⊤";
  var Topf = "𝕋";
  var topf = "𝕥";
  var topfork = "⫚";
  var tosa = "⤩";
  var tprime = "‴";
  var trade = "™";
  var TRADE = "™";
  var triangle = "▵";
  var triangledown = "▿";
  var triangleleft = "◃";
  var trianglelefteq = "⊴";
  var triangleq = "≜";
  var triangleright = "▹";
  var trianglerighteq = "⊵";
  var tridot = "◬";
  var trie = "≜";
  var triminus = "⨺";
  var TripleDot = "⃛";
  var triplus = "⨹";
  var trisb = "⧍";
  var tritime = "⨻";
  var trpezium = "⏢";
  var Tscr = "𝒯";
  var tscr = "𝓉";
  var TScy = "Ц";
  var tscy = "ц";
  var TSHcy = "Ћ";
  var tshcy = "ћ";
  var Tstrok = "Ŧ";
  var tstrok = "ŧ";
  var twixt = "≬";
  var twoheadleftarrow = "↞";
  var twoheadrightarrow = "↠";
  var Uacute = "Ú";
  var uacute = "ú";
  var uarr = "↑";
  var Uarr = "↟";
  var uArr = "⇑";
  var Uarrocir = "⥉";
  var Ubrcy = "Ў";
  var ubrcy = "ў";
  var Ubreve = "Ŭ";
  var ubreve = "ŭ";
  var Ucirc = "Û";
  var ucirc = "û";
  var Ucy = "У";
  var ucy = "у";
  var udarr = "⇅";
  var Udblac = "Ű";
  var udblac = "ű";
  var udhar = "⥮";
  var ufisht = "⥾";
  var Ufr = "𝔘";
  var ufr = "𝔲";
  var Ugrave = "Ù";
  var ugrave = "ù";
  var uHar = "⥣";
  var uharl = "↿";
  var uharr = "↾";
  var uhblk = "▀";
  var ulcorn = "⌜";
  var ulcorner = "⌜";
  var ulcrop = "⌏";
  var ultri = "◸";
  var Umacr = "Ū";
  var umacr = "ū";
  var uml = "¨";
  var UnderBar = "_";
  var UnderBrace = "⏟";
  var UnderBracket = "⎵";
  var UnderParenthesis = "⏝";
  var Union = "⋃";
  var UnionPlus = "⊎";
  var Uogon = "Ų";
  var uogon = "ų";
  var Uopf = "𝕌";
  var uopf = "𝕦";
  var UpArrowBar = "⤒";
  var uparrow = "↑";
  var UpArrow = "↑";
  var Uparrow = "⇑";
  var UpArrowDownArrow = "⇅";
  var updownarrow = "↕";
  var UpDownArrow = "↕";
  var Updownarrow = "⇕";
  var UpEquilibrium = "⥮";
  var upharpoonleft = "↿";
  var upharpoonright = "↾";
  var uplus = "⊎";
  var UpperLeftArrow = "↖";
  var UpperRightArrow = "↗";
  var upsi = "υ";
  var Upsi = "ϒ";
  var upsih = "ϒ";
  var Upsilon = "Υ";
  var upsilon = "υ";
  var UpTeeArrow = "↥";
  var UpTee = "⊥";
  var upuparrows = "⇈";
  var urcorn = "⌝";
  var urcorner = "⌝";
  var urcrop = "⌎";
  var Uring = "Ů";
  var uring = "ů";
  var urtri = "◹";
  var Uscr = "𝒰";
  var uscr = "𝓊";
  var utdot = "⋰";
  var Utilde = "Ũ";
  var utilde = "ũ";
  var utri = "▵";
  var utrif = "▴";
  var uuarr = "⇈";
  var Uuml = "Ü";
  var uuml = "ü";
  var uwangle = "⦧";
  var vangrt = "⦜";
  var varepsilon = "ϵ";
  var varkappa = "ϰ";
  var varnothing = "∅";
  var varphi = "ϕ";
  var varpi = "ϖ";
  var varpropto = "∝";
  var varr = "↕";
  var vArr = "⇕";
  var varrho = "ϱ";
  var varsigma = "ς";
  var varsubsetneq = "⊊︀";
  var varsubsetneqq = "⫋︀";
  var varsupsetneq = "⊋︀";
  var varsupsetneqq = "⫌︀";
  var vartheta = "ϑ";
  var vartriangleleft = "⊲";
  var vartriangleright = "⊳";
  var vBar = "⫨";
  var Vbar = "⫫";
  var vBarv = "⫩";
  var Vcy = "В";
  var vcy = "в";
  var vdash = "⊢";
  var vDash = "⊨";
  var Vdash = "⊩";
  var VDash = "⊫";
  var Vdashl = "⫦";
  var veebar = "⊻";
  var vee = "∨";
  var Vee = "⋁";
  var veeeq = "≚";
  var vellip = "⋮";
  var verbar = "|";
  var Verbar = "‖";
  var vert = "|";
  var Vert = "‖";
  var VerticalBar = "∣";
  var VerticalLine = "|";
  var VerticalSeparator = "❘";
  var VerticalTilde = "≀";
  var VeryThinSpace = " ";
  var Vfr = "𝔙";
  var vfr = "𝔳";
  var vltri = "⊲";
  var vnsub = "⊂⃒";
  var vnsup = "⊃⃒";
  var Vopf = "𝕍";
  var vopf = "𝕧";
  var vprop = "∝";
  var vrtri = "⊳";
  var Vscr = "𝒱";
  var vscr = "𝓋";
  var vsubnE = "⫋︀";
  var vsubne = "⊊︀";
  var vsupnE = "⫌︀";
  var vsupne = "⊋︀";
  var Vvdash = "⊪";
  var vzigzag = "⦚";
  var Wcirc = "Ŵ";
  var wcirc = "ŵ";
  var wedbar = "⩟";
  var wedge = "∧";
  var Wedge = "⋀";
  var wedgeq = "≙";
  var weierp = "℘";
  var Wfr = "𝔚";
  var wfr = "𝔴";
  var Wopf = "𝕎";
  var wopf = "𝕨";
  var wp = "℘";
  var wr = "≀";
  var wreath = "≀";
  var Wscr = "𝒲";
  var wscr = "𝓌";
  var xcap = "⋂";
  var xcirc = "◯";
  var xcup = "⋃";
  var xdtri = "▽";
  var Xfr = "𝔛";
  var xfr = "𝔵";
  var xharr = "⟷";
  var xhArr = "⟺";
  var Xi = "Ξ";
  var xi = "ξ";
  var xlarr = "⟵";
  var xlArr = "⟸";
  var xmap = "⟼";
  var xnis = "⋻";
  var xodot = "⨀";
  var Xopf = "𝕏";
  var xopf = "𝕩";
  var xoplus = "⨁";
  var xotime = "⨂";
  var xrarr = "⟶";
  var xrArr = "⟹";
  var Xscr = "𝒳";
  var xscr = "𝓍";
  var xsqcup = "⨆";
  var xuplus = "⨄";
  var xutri = "△";
  var xvee = "⋁";
  var xwedge = "⋀";
  var Yacute = "Ý";
  var yacute = "ý";
  var YAcy = "Я";
  var yacy = "я";
  var Ycirc = "Ŷ";
  var ycirc = "ŷ";
  var Ycy = "Ы";
  var ycy = "ы";
  var yen = "¥";
  var Yfr = "𝔜";
  var yfr = "𝔶";
  var YIcy = "Ї";
  var yicy = "ї";
  var Yopf = "𝕐";
  var yopf = "𝕪";
  var Yscr = "𝒴";
  var yscr = "𝓎";
  var YUcy = "Ю";
  var yucy = "ю";
  var yuml = "ÿ";
  var Yuml = "Ÿ";
  var Zacute = "Ź";
  var zacute = "ź";
  var Zcaron = "Ž";
  var zcaron = "ž";
  var Zcy = "З";
  var zcy = "з";
  var Zdot = "Ż";
  var zdot = "ż";
  var zeetrf = "ℨ";
  var ZeroWidthSpace = "​";
  var Zeta = "Ζ";
  var zeta = "ζ";
  var zfr = "𝔷";
  var Zfr = "ℨ";
  var ZHcy = "Ж";
  var zhcy = "ж";
  var zigrarr = "⇝";
  var zopf = "𝕫";
  var Zopf = "ℤ";
  var Zscr = "𝒵";
  var zscr = "𝓏";
  var zwj = "‍";
  var zwnj = "‌";
  var entities = {
  	Aacute: Aacute,
  	aacute: aacute,
  	Abreve: Abreve,
  	abreve: abreve,
  	ac: ac,
  	acd: acd,
  	acE: acE,
  	Acirc: Acirc,
  	acirc: acirc,
  	acute: acute,
  	Acy: Acy,
  	acy: acy,
  	AElig: AElig,
  	aelig: aelig,
  	af: af,
  	Afr: Afr,
  	afr: afr,
  	Agrave: Agrave,
  	agrave: agrave,
  	alefsym: alefsym,
  	aleph: aleph,
  	Alpha: Alpha,
  	alpha: alpha,
  	Amacr: Amacr,
  	amacr: amacr,
  	amalg: amalg,
  	amp: amp,
  	AMP: AMP,
  	andand: andand,
  	And: And,
  	and: and,
  	andd: andd,
  	andslope: andslope,
  	andv: andv,
  	ang: ang,
  	ange: ange,
  	angle: angle,
  	angmsdaa: angmsdaa,
  	angmsdab: angmsdab,
  	angmsdac: angmsdac,
  	angmsdad: angmsdad,
  	angmsdae: angmsdae,
  	angmsdaf: angmsdaf,
  	angmsdag: angmsdag,
  	angmsdah: angmsdah,
  	angmsd: angmsd,
  	angrt: angrt,
  	angrtvb: angrtvb,
  	angrtvbd: angrtvbd,
  	angsph: angsph,
  	angst: angst,
  	angzarr: angzarr,
  	Aogon: Aogon,
  	aogon: aogon,
  	Aopf: Aopf,
  	aopf: aopf,
  	apacir: apacir,
  	ap: ap,
  	apE: apE,
  	ape: ape,
  	apid: apid,
  	apos: apos,
  	ApplyFunction: ApplyFunction,
  	approx: approx,
  	approxeq: approxeq,
  	Aring: Aring,
  	aring: aring,
  	Ascr: Ascr,
  	ascr: ascr,
  	Assign: Assign,
  	ast: ast,
  	asymp: asymp,
  	asympeq: asympeq,
  	Atilde: Atilde,
  	atilde: atilde,
  	Auml: Auml,
  	auml: auml,
  	awconint: awconint,
  	awint: awint,
  	backcong: backcong,
  	backepsilon: backepsilon,
  	backprime: backprime,
  	backsim: backsim,
  	backsimeq: backsimeq,
  	Backslash: Backslash,
  	Barv: Barv,
  	barvee: barvee,
  	barwed: barwed,
  	Barwed: Barwed,
  	barwedge: barwedge,
  	bbrk: bbrk,
  	bbrktbrk: bbrktbrk,
  	bcong: bcong,
  	Bcy: Bcy,
  	bcy: bcy,
  	bdquo: bdquo,
  	becaus: becaus,
  	because: because,
  	Because: Because,
  	bemptyv: bemptyv,
  	bepsi: bepsi,
  	bernou: bernou,
  	Bernoullis: Bernoullis,
  	Beta: Beta,
  	beta: beta,
  	beth: beth,
  	between: between,
  	Bfr: Bfr,
  	bfr: bfr,
  	bigcap: bigcap,
  	bigcirc: bigcirc,
  	bigcup: bigcup,
  	bigodot: bigodot,
  	bigoplus: bigoplus,
  	bigotimes: bigotimes,
  	bigsqcup: bigsqcup,
  	bigstar: bigstar,
  	bigtriangledown: bigtriangledown,
  	bigtriangleup: bigtriangleup,
  	biguplus: biguplus,
  	bigvee: bigvee,
  	bigwedge: bigwedge,
  	bkarow: bkarow,
  	blacklozenge: blacklozenge,
  	blacksquare: blacksquare,
  	blacktriangle: blacktriangle,
  	blacktriangledown: blacktriangledown,
  	blacktriangleleft: blacktriangleleft,
  	blacktriangleright: blacktriangleright,
  	blank: blank,
  	blk12: blk12,
  	blk14: blk14,
  	blk34: blk34,
  	block: block,
  	bne: bne,
  	bnequiv: bnequiv,
  	bNot: bNot,
  	bnot: bnot,
  	Bopf: Bopf,
  	bopf: bopf,
  	bot: bot,
  	bottom: bottom,
  	bowtie: bowtie,
  	boxbox: boxbox,
  	boxdl: boxdl,
  	boxdL: boxdL,
  	boxDl: boxDl,
  	boxDL: boxDL,
  	boxdr: boxdr,
  	boxdR: boxdR,
  	boxDr: boxDr,
  	boxDR: boxDR,
  	boxh: boxh,
  	boxH: boxH,
  	boxhd: boxhd,
  	boxHd: boxHd,
  	boxhD: boxhD,
  	boxHD: boxHD,
  	boxhu: boxhu,
  	boxHu: boxHu,
  	boxhU: boxhU,
  	boxHU: boxHU,
  	boxminus: boxminus,
  	boxplus: boxplus,
  	boxtimes: boxtimes,
  	boxul: boxul,
  	boxuL: boxuL,
  	boxUl: boxUl,
  	boxUL: boxUL,
  	boxur: boxur,
  	boxuR: boxuR,
  	boxUr: boxUr,
  	boxUR: boxUR,
  	boxv: boxv,
  	boxV: boxV,
  	boxvh: boxvh,
  	boxvH: boxvH,
  	boxVh: boxVh,
  	boxVH: boxVH,
  	boxvl: boxvl,
  	boxvL: boxvL,
  	boxVl: boxVl,
  	boxVL: boxVL,
  	boxvr: boxvr,
  	boxvR: boxvR,
  	boxVr: boxVr,
  	boxVR: boxVR,
  	bprime: bprime,
  	breve: breve,
  	Breve: Breve,
  	brvbar: brvbar,
  	bscr: bscr,
  	Bscr: Bscr,
  	bsemi: bsemi,
  	bsim: bsim,
  	bsime: bsime,
  	bsolb: bsolb,
  	bsol: bsol,
  	bsolhsub: bsolhsub,
  	bull: bull,
  	bullet: bullet,
  	bump: bump,
  	bumpE: bumpE,
  	bumpe: bumpe,
  	Bumpeq: Bumpeq,
  	bumpeq: bumpeq,
  	Cacute: Cacute,
  	cacute: cacute,
  	capand: capand,
  	capbrcup: capbrcup,
  	capcap: capcap,
  	cap: cap,
  	Cap: Cap,
  	capcup: capcup,
  	capdot: capdot,
  	CapitalDifferentialD: CapitalDifferentialD,
  	caps: caps,
  	caret: caret,
  	caron: caron,
  	Cayleys: Cayleys,
  	ccaps: ccaps,
  	Ccaron: Ccaron,
  	ccaron: ccaron,
  	Ccedil: Ccedil,
  	ccedil: ccedil,
  	Ccirc: Ccirc,
  	ccirc: ccirc,
  	Cconint: Cconint,
  	ccups: ccups,
  	ccupssm: ccupssm,
  	Cdot: Cdot,
  	cdot: cdot,
  	cedil: cedil,
  	Cedilla: Cedilla,
  	cemptyv: cemptyv,
  	cent: cent,
  	centerdot: centerdot,
  	CenterDot: CenterDot,
  	cfr: cfr,
  	Cfr: Cfr,
  	CHcy: CHcy,
  	chcy: chcy,
  	check: check,
  	checkmark: checkmark,
  	Chi: Chi,
  	chi: chi,
  	circ: circ,
  	circeq: circeq,
  	circlearrowleft: circlearrowleft,
  	circlearrowright: circlearrowright,
  	circledast: circledast,
  	circledcirc: circledcirc,
  	circleddash: circleddash,
  	CircleDot: CircleDot,
  	circledR: circledR,
  	circledS: circledS,
  	CircleMinus: CircleMinus,
  	CirclePlus: CirclePlus,
  	CircleTimes: CircleTimes,
  	cir: cir,
  	cirE: cirE,
  	cire: cire,
  	cirfnint: cirfnint,
  	cirmid: cirmid,
  	cirscir: cirscir,
  	ClockwiseContourIntegral: ClockwiseContourIntegral,
  	CloseCurlyDoubleQuote: CloseCurlyDoubleQuote,
  	CloseCurlyQuote: CloseCurlyQuote,
  	clubs: clubs,
  	clubsuit: clubsuit,
  	colon: colon,
  	Colon: Colon,
  	Colone: Colone,
  	colone: colone,
  	coloneq: coloneq,
  	comma: comma,
  	commat: commat,
  	comp: comp,
  	compfn: compfn,
  	complement: complement,
  	complexes: complexes,
  	cong: cong,
  	congdot: congdot,
  	Congruent: Congruent,
  	conint: conint,
  	Conint: Conint,
  	ContourIntegral: ContourIntegral,
  	copf: copf,
  	Copf: Copf,
  	coprod: coprod,
  	Coproduct: Coproduct,
  	copy: copy,
  	COPY: COPY,
  	copysr: copysr,
  	CounterClockwiseContourIntegral: CounterClockwiseContourIntegral,
  	crarr: crarr,
  	cross: cross,
  	Cross: Cross,
  	Cscr: Cscr,
  	cscr: cscr,
  	csub: csub,
  	csube: csube,
  	csup: csup,
  	csupe: csupe,
  	ctdot: ctdot,
  	cudarrl: cudarrl,
  	cudarrr: cudarrr,
  	cuepr: cuepr,
  	cuesc: cuesc,
  	cularr: cularr,
  	cularrp: cularrp,
  	cupbrcap: cupbrcap,
  	cupcap: cupcap,
  	CupCap: CupCap,
  	cup: cup,
  	Cup: Cup,
  	cupcup: cupcup,
  	cupdot: cupdot,
  	cupor: cupor,
  	cups: cups,
  	curarr: curarr,
  	curarrm: curarrm,
  	curlyeqprec: curlyeqprec,
  	curlyeqsucc: curlyeqsucc,
  	curlyvee: curlyvee,
  	curlywedge: curlywedge,
  	curren: curren,
  	curvearrowleft: curvearrowleft,
  	curvearrowright: curvearrowright,
  	cuvee: cuvee,
  	cuwed: cuwed,
  	cwconint: cwconint,
  	cwint: cwint,
  	cylcty: cylcty,
  	dagger: dagger,
  	Dagger: Dagger,
  	daleth: daleth,
  	darr: darr,
  	Darr: Darr,
  	dArr: dArr,
  	dash: dash,
  	Dashv: Dashv,
  	dashv: dashv,
  	dbkarow: dbkarow,
  	dblac: dblac,
  	Dcaron: Dcaron,
  	dcaron: dcaron,
  	Dcy: Dcy,
  	dcy: dcy,
  	ddagger: ddagger,
  	ddarr: ddarr,
  	DD: DD,
  	dd: dd,
  	DDotrahd: DDotrahd,
  	ddotseq: ddotseq,
  	deg: deg,
  	Del: Del,
  	Delta: Delta,
  	delta: delta,
  	demptyv: demptyv,
  	dfisht: dfisht,
  	Dfr: Dfr,
  	dfr: dfr,
  	dHar: dHar,
  	dharl: dharl,
  	dharr: dharr,
  	DiacriticalAcute: DiacriticalAcute,
  	DiacriticalDot: DiacriticalDot,
  	DiacriticalDoubleAcute: DiacriticalDoubleAcute,
  	DiacriticalGrave: DiacriticalGrave,
  	DiacriticalTilde: DiacriticalTilde,
  	diam: diam,
  	diamond: diamond,
  	Diamond: Diamond,
  	diamondsuit: diamondsuit,
  	diams: diams,
  	die: die,
  	DifferentialD: DifferentialD,
  	digamma: digamma,
  	disin: disin,
  	div: div$1,
  	divide: divide$1,
  	divideontimes: divideontimes,
  	divonx: divonx,
  	DJcy: DJcy,
  	djcy: djcy,
  	dlcorn: dlcorn,
  	dlcrop: dlcrop,
  	dollar: dollar,
  	Dopf: Dopf,
  	dopf: dopf,
  	Dot: Dot,
  	dot: dot,
  	DotDot: DotDot,
  	doteq: doteq,
  	doteqdot: doteqdot,
  	DotEqual: DotEqual,
  	dotminus: dotminus,
  	dotplus: dotplus,
  	dotsquare: dotsquare,
  	doublebarwedge: doublebarwedge,
  	DoubleContourIntegral: DoubleContourIntegral,
  	DoubleDot: DoubleDot,
  	DoubleDownArrow: DoubleDownArrow,
  	DoubleLeftArrow: DoubleLeftArrow,
  	DoubleLeftRightArrow: DoubleLeftRightArrow,
  	DoubleLeftTee: DoubleLeftTee,
  	DoubleLongLeftArrow: DoubleLongLeftArrow,
  	DoubleLongLeftRightArrow: DoubleLongLeftRightArrow,
  	DoubleLongRightArrow: DoubleLongRightArrow,
  	DoubleRightArrow: DoubleRightArrow,
  	DoubleRightTee: DoubleRightTee,
  	DoubleUpArrow: DoubleUpArrow,
  	DoubleUpDownArrow: DoubleUpDownArrow,
  	DoubleVerticalBar: DoubleVerticalBar,
  	DownArrowBar: DownArrowBar,
  	downarrow: downarrow,
  	DownArrow: DownArrow,
  	Downarrow: Downarrow,
  	DownArrowUpArrow: DownArrowUpArrow,
  	DownBreve: DownBreve,
  	downdownarrows: downdownarrows,
  	downharpoonleft: downharpoonleft,
  	downharpoonright: downharpoonright,
  	DownLeftRightVector: DownLeftRightVector,
  	DownLeftTeeVector: DownLeftTeeVector,
  	DownLeftVectorBar: DownLeftVectorBar,
  	DownLeftVector: DownLeftVector,
  	DownRightTeeVector: DownRightTeeVector,
  	DownRightVectorBar: DownRightVectorBar,
  	DownRightVector: DownRightVector,
  	DownTeeArrow: DownTeeArrow,
  	DownTee: DownTee,
  	drbkarow: drbkarow,
  	drcorn: drcorn,
  	drcrop: drcrop,
  	Dscr: Dscr,
  	dscr: dscr,
  	DScy: DScy,
  	dscy: dscy,
  	dsol: dsol,
  	Dstrok: Dstrok,
  	dstrok: dstrok,
  	dtdot: dtdot,
  	dtri: dtri,
  	dtrif: dtrif,
  	duarr: duarr,
  	duhar: duhar,
  	dwangle: dwangle,
  	DZcy: DZcy,
  	dzcy: dzcy,
  	dzigrarr: dzigrarr,
  	Eacute: Eacute,
  	eacute: eacute,
  	easter: easter,
  	Ecaron: Ecaron,
  	ecaron: ecaron,
  	Ecirc: Ecirc,
  	ecirc: ecirc,
  	ecir: ecir,
  	ecolon: ecolon,
  	Ecy: Ecy,
  	ecy: ecy,
  	eDDot: eDDot,
  	Edot: Edot,
  	edot: edot,
  	eDot: eDot,
  	ee: ee,
  	efDot: efDot,
  	Efr: Efr,
  	efr: efr,
  	eg: eg,
  	Egrave: Egrave,
  	egrave: egrave,
  	egs: egs,
  	egsdot: egsdot,
  	el: el,
  	Element: Element,
  	elinters: elinters,
  	ell: ell,
  	els: els,
  	elsdot: elsdot,
  	Emacr: Emacr,
  	emacr: emacr,
  	empty: empty,
  	emptyset: emptyset,
  	EmptySmallSquare: EmptySmallSquare,
  	emptyv: emptyv,
  	EmptyVerySmallSquare: EmptyVerySmallSquare,
  	emsp13: emsp13,
  	emsp14: emsp14,
  	emsp: emsp,
  	ENG: ENG,
  	eng: eng,
  	ensp: ensp,
  	Eogon: Eogon,
  	eogon: eogon,
  	Eopf: Eopf,
  	eopf: eopf,
  	epar: epar,
  	eparsl: eparsl,
  	eplus: eplus,
  	epsi: epsi,
  	Epsilon: Epsilon,
  	epsilon: epsilon,
  	epsiv: epsiv,
  	eqcirc: eqcirc,
  	eqcolon: eqcolon,
  	eqsim: eqsim,
  	eqslantgtr: eqslantgtr,
  	eqslantless: eqslantless,
  	Equal: Equal,
  	equals: equals,
  	EqualTilde: EqualTilde,
  	equest: equest,
  	Equilibrium: Equilibrium,
  	equiv: equiv,
  	equivDD: equivDD,
  	eqvparsl: eqvparsl,
  	erarr: erarr,
  	erDot: erDot,
  	escr: escr,
  	Escr: Escr,
  	esdot: esdot,
  	Esim: Esim,
  	esim: esim,
  	Eta: Eta,
  	eta: eta,
  	ETH: ETH,
  	eth: eth,
  	Euml: Euml,
  	euml: euml,
  	euro: euro,
  	excl: excl,
  	exist: exist,
  	Exists: Exists,
  	expectation: expectation,
  	exponentiale: exponentiale,
  	ExponentialE: ExponentialE,
  	fallingdotseq: fallingdotseq,
  	Fcy: Fcy,
  	fcy: fcy,
  	female: female,
  	ffilig: ffilig,
  	fflig: fflig,
  	ffllig: ffllig,
  	Ffr: Ffr,
  	ffr: ffr,
  	filig: filig,
  	FilledSmallSquare: FilledSmallSquare,
  	FilledVerySmallSquare: FilledVerySmallSquare,
  	fjlig: fjlig,
  	flat: flat,
  	fllig: fllig,
  	fltns: fltns,
  	fnof: fnof,
  	Fopf: Fopf,
  	fopf: fopf,
  	forall: forall,
  	ForAll: ForAll,
  	fork: fork,
  	forkv: forkv,
  	Fouriertrf: Fouriertrf,
  	fpartint: fpartint,
  	frac12: frac12,
  	frac13: frac13,
  	frac14: frac14,
  	frac15: frac15,
  	frac16: frac16,
  	frac18: frac18,
  	frac23: frac23,
  	frac25: frac25,
  	frac34: frac34,
  	frac35: frac35,
  	frac38: frac38,
  	frac45: frac45,
  	frac56: frac56,
  	frac58: frac58,
  	frac78: frac78,
  	frasl: frasl,
  	frown: frown,
  	fscr: fscr,
  	Fscr: Fscr,
  	gacute: gacute,
  	Gamma: Gamma,
  	gamma: gamma,
  	Gammad: Gammad,
  	gammad: gammad,
  	gap: gap,
  	Gbreve: Gbreve,
  	gbreve: gbreve,
  	Gcedil: Gcedil,
  	Gcirc: Gcirc,
  	gcirc: gcirc,
  	Gcy: Gcy,
  	gcy: gcy,
  	Gdot: Gdot,
  	gdot: gdot,
  	ge: ge,
  	gE: gE,
  	gEl: gEl,
  	gel: gel,
  	geq: geq,
  	geqq: geqq,
  	geqslant: geqslant,
  	gescc: gescc,
  	ges: ges,
  	gesdot: gesdot,
  	gesdoto: gesdoto,
  	gesdotol: gesdotol,
  	gesl: gesl,
  	gesles: gesles,
  	Gfr: Gfr,
  	gfr: gfr,
  	gg: gg,
  	Gg: Gg,
  	ggg: ggg,
  	gimel: gimel,
  	GJcy: GJcy,
  	gjcy: gjcy,
  	gla: gla,
  	gl: gl,
  	glE: glE,
  	glj: glj,
  	gnap: gnap,
  	gnapprox: gnapprox,
  	gne: gne,
  	gnE: gnE,
  	gneq: gneq,
  	gneqq: gneqq,
  	gnsim: gnsim,
  	Gopf: Gopf,
  	gopf: gopf,
  	grave: grave,
  	GreaterEqual: GreaterEqual,
  	GreaterEqualLess: GreaterEqualLess,
  	GreaterFullEqual: GreaterFullEqual,
  	GreaterGreater: GreaterGreater,
  	GreaterLess: GreaterLess,
  	GreaterSlantEqual: GreaterSlantEqual,
  	GreaterTilde: GreaterTilde,
  	Gscr: Gscr,
  	gscr: gscr,
  	gsim: gsim,
  	gsime: gsime,
  	gsiml: gsiml,
  	gtcc: gtcc,
  	gtcir: gtcir,
  	gt: gt,
  	GT: GT,
  	Gt: Gt,
  	gtdot: gtdot,
  	gtlPar: gtlPar,
  	gtquest: gtquest,
  	gtrapprox: gtrapprox,
  	gtrarr: gtrarr,
  	gtrdot: gtrdot,
  	gtreqless: gtreqless,
  	gtreqqless: gtreqqless,
  	gtrless: gtrless,
  	gtrsim: gtrsim,
  	gvertneqq: gvertneqq,
  	gvnE: gvnE,
  	Hacek: Hacek,
  	hairsp: hairsp,
  	half: half,
  	hamilt: hamilt,
  	HARDcy: HARDcy,
  	hardcy: hardcy,
  	harrcir: harrcir,
  	harr: harr,
  	hArr: hArr,
  	harrw: harrw,
  	Hat: Hat,
  	hbar: hbar,
  	Hcirc: Hcirc,
  	hcirc: hcirc,
  	hearts: hearts,
  	heartsuit: heartsuit,
  	hellip: hellip,
  	hercon: hercon,
  	hfr: hfr,
  	Hfr: Hfr,
  	HilbertSpace: HilbertSpace,
  	hksearow: hksearow,
  	hkswarow: hkswarow,
  	hoarr: hoarr,
  	homtht: homtht,
  	hookleftarrow: hookleftarrow,
  	hookrightarrow: hookrightarrow,
  	hopf: hopf,
  	Hopf: Hopf,
  	horbar: horbar,
  	HorizontalLine: HorizontalLine,
  	hscr: hscr,
  	Hscr: Hscr,
  	hslash: hslash,
  	Hstrok: Hstrok,
  	hstrok: hstrok,
  	HumpDownHump: HumpDownHump,
  	HumpEqual: HumpEqual,
  	hybull: hybull,
  	hyphen: hyphen,
  	Iacute: Iacute,
  	iacute: iacute,
  	ic: ic,
  	Icirc: Icirc,
  	icirc: icirc,
  	Icy: Icy,
  	icy: icy,
  	Idot: Idot,
  	IEcy: IEcy,
  	iecy: iecy,
  	iexcl: iexcl,
  	iff: iff,
  	ifr: ifr,
  	Ifr: Ifr,
  	Igrave: Igrave,
  	igrave: igrave,
  	ii: ii,
  	iiiint: iiiint,
  	iiint: iiint,
  	iinfin: iinfin,
  	iiota: iiota,
  	IJlig: IJlig,
  	ijlig: ijlig,
  	Imacr: Imacr,
  	imacr: imacr,
  	image: image,
  	ImaginaryI: ImaginaryI,
  	imagline: imagline,
  	imagpart: imagpart,
  	imath: imath,
  	Im: Im,
  	imof: imof,
  	imped: imped,
  	Implies: Implies,
  	incare: incare,
  	"in": "∈",
  	infin: infin,
  	infintie: infintie,
  	inodot: inodot,
  	intcal: intcal,
  	int: int,
  	Int: Int,
  	integers: integers,
  	Integral: Integral,
  	intercal: intercal,
  	Intersection: Intersection,
  	intlarhk: intlarhk,
  	intprod: intprod,
  	InvisibleComma: InvisibleComma,
  	InvisibleTimes: InvisibleTimes,
  	IOcy: IOcy,
  	iocy: iocy,
  	Iogon: Iogon,
  	iogon: iogon,
  	Iopf: Iopf,
  	iopf: iopf,
  	Iota: Iota,
  	iota: iota,
  	iprod: iprod,
  	iquest: iquest,
  	iscr: iscr,
  	Iscr: Iscr,
  	isin: isin,
  	isindot: isindot,
  	isinE: isinE,
  	isins: isins,
  	isinsv: isinsv,
  	isinv: isinv,
  	it: it,
  	Itilde: Itilde,
  	itilde: itilde,
  	Iukcy: Iukcy,
  	iukcy: iukcy,
  	Iuml: Iuml,
  	iuml: iuml,
  	Jcirc: Jcirc,
  	jcirc: jcirc,
  	Jcy: Jcy,
  	jcy: jcy,
  	Jfr: Jfr,
  	jfr: jfr,
  	jmath: jmath,
  	Jopf: Jopf,
  	jopf: jopf,
  	Jscr: Jscr,
  	jscr: jscr,
  	Jsercy: Jsercy,
  	jsercy: jsercy,
  	Jukcy: Jukcy,
  	jukcy: jukcy,
  	Kappa: Kappa,
  	kappa: kappa,
  	kappav: kappav,
  	Kcedil: Kcedil,
  	kcedil: kcedil,
  	Kcy: Kcy,
  	kcy: kcy,
  	Kfr: Kfr,
  	kfr: kfr,
  	kgreen: kgreen,
  	KHcy: KHcy,
  	khcy: khcy,
  	KJcy: KJcy,
  	kjcy: kjcy,
  	Kopf: Kopf,
  	kopf: kopf,
  	Kscr: Kscr,
  	kscr: kscr,
  	lAarr: lAarr,
  	Lacute: Lacute,
  	lacute: lacute,
  	laemptyv: laemptyv,
  	lagran: lagran,
  	Lambda: Lambda,
  	lambda: lambda,
  	lang: lang,
  	Lang: Lang,
  	langd: langd,
  	langle: langle,
  	lap: lap,
  	Laplacetrf: Laplacetrf,
  	laquo: laquo,
  	larrb: larrb,
  	larrbfs: larrbfs,
  	larr: larr,
  	Larr: Larr,
  	lArr: lArr,
  	larrfs: larrfs,
  	larrhk: larrhk,
  	larrlp: larrlp,
  	larrpl: larrpl,
  	larrsim: larrsim,
  	larrtl: larrtl,
  	latail: latail,
  	lAtail: lAtail,
  	lat: lat,
  	late: late,
  	lates: lates,
  	lbarr: lbarr,
  	lBarr: lBarr,
  	lbbrk: lbbrk,
  	lbrace: lbrace,
  	lbrack: lbrack,
  	lbrke: lbrke,
  	lbrksld: lbrksld,
  	lbrkslu: lbrkslu,
  	Lcaron: Lcaron,
  	lcaron: lcaron,
  	Lcedil: Lcedil,
  	lcedil: lcedil,
  	lceil: lceil,
  	lcub: lcub,
  	Lcy: Lcy,
  	lcy: lcy,
  	ldca: ldca,
  	ldquo: ldquo,
  	ldquor: ldquor,
  	ldrdhar: ldrdhar,
  	ldrushar: ldrushar,
  	ldsh: ldsh,
  	le: le,
  	lE: lE,
  	LeftAngleBracket: LeftAngleBracket,
  	LeftArrowBar: LeftArrowBar,
  	leftarrow: leftarrow,
  	LeftArrow: LeftArrow,
  	Leftarrow: Leftarrow,
  	LeftArrowRightArrow: LeftArrowRightArrow,
  	leftarrowtail: leftarrowtail,
  	LeftCeiling: LeftCeiling,
  	LeftDoubleBracket: LeftDoubleBracket,
  	LeftDownTeeVector: LeftDownTeeVector,
  	LeftDownVectorBar: LeftDownVectorBar,
  	LeftDownVector: LeftDownVector,
  	LeftFloor: LeftFloor,
  	leftharpoondown: leftharpoondown,
  	leftharpoonup: leftharpoonup,
  	leftleftarrows: leftleftarrows,
  	leftrightarrow: leftrightarrow,
  	LeftRightArrow: LeftRightArrow,
  	Leftrightarrow: Leftrightarrow,
  	leftrightarrows: leftrightarrows,
  	leftrightharpoons: leftrightharpoons,
  	leftrightsquigarrow: leftrightsquigarrow,
  	LeftRightVector: LeftRightVector,
  	LeftTeeArrow: LeftTeeArrow,
  	LeftTee: LeftTee,
  	LeftTeeVector: LeftTeeVector,
  	leftthreetimes: leftthreetimes,
  	LeftTriangleBar: LeftTriangleBar,
  	LeftTriangle: LeftTriangle,
  	LeftTriangleEqual: LeftTriangleEqual,
  	LeftUpDownVector: LeftUpDownVector,
  	LeftUpTeeVector: LeftUpTeeVector,
  	LeftUpVectorBar: LeftUpVectorBar,
  	LeftUpVector: LeftUpVector,
  	LeftVectorBar: LeftVectorBar,
  	LeftVector: LeftVector,
  	lEg: lEg,
  	leg: leg,
  	leq: leq,
  	leqq: leqq,
  	leqslant: leqslant,
  	lescc: lescc,
  	les: les,
  	lesdot: lesdot,
  	lesdoto: lesdoto,
  	lesdotor: lesdotor,
  	lesg: lesg,
  	lesges: lesges,
  	lessapprox: lessapprox,
  	lessdot: lessdot,
  	lesseqgtr: lesseqgtr,
  	lesseqqgtr: lesseqqgtr,
  	LessEqualGreater: LessEqualGreater,
  	LessFullEqual: LessFullEqual,
  	LessGreater: LessGreater,
  	lessgtr: lessgtr,
  	LessLess: LessLess,
  	lesssim: lesssim,
  	LessSlantEqual: LessSlantEqual,
  	LessTilde: LessTilde,
  	lfisht: lfisht,
  	lfloor: lfloor,
  	Lfr: Lfr,
  	lfr: lfr,
  	lg: lg,
  	lgE: lgE,
  	lHar: lHar,
  	lhard: lhard,
  	lharu: lharu,
  	lharul: lharul,
  	lhblk: lhblk,
  	LJcy: LJcy,
  	ljcy: ljcy,
  	llarr: llarr,
  	ll: ll,
  	Ll: Ll,
  	llcorner: llcorner,
  	Lleftarrow: Lleftarrow,
  	llhard: llhard,
  	lltri: lltri,
  	Lmidot: Lmidot,
  	lmidot: lmidot,
  	lmoustache: lmoustache,
  	lmoust: lmoust,
  	lnap: lnap,
  	lnapprox: lnapprox,
  	lne: lne,
  	lnE: lnE,
  	lneq: lneq,
  	lneqq: lneqq,
  	lnsim: lnsim,
  	loang: loang,
  	loarr: loarr,
  	lobrk: lobrk,
  	longleftarrow: longleftarrow,
  	LongLeftArrow: LongLeftArrow,
  	Longleftarrow: Longleftarrow,
  	longleftrightarrow: longleftrightarrow,
  	LongLeftRightArrow: LongLeftRightArrow,
  	Longleftrightarrow: Longleftrightarrow,
  	longmapsto: longmapsto,
  	longrightarrow: longrightarrow,
  	LongRightArrow: LongRightArrow,
  	Longrightarrow: Longrightarrow,
  	looparrowleft: looparrowleft,
  	looparrowright: looparrowright,
  	lopar: lopar,
  	Lopf: Lopf,
  	lopf: lopf,
  	loplus: loplus,
  	lotimes: lotimes,
  	lowast: lowast,
  	lowbar: lowbar,
  	LowerLeftArrow: LowerLeftArrow,
  	LowerRightArrow: LowerRightArrow,
  	loz: loz,
  	lozenge: lozenge,
  	lozf: lozf,
  	lpar: lpar,
  	lparlt: lparlt,
  	lrarr: lrarr,
  	lrcorner: lrcorner,
  	lrhar: lrhar,
  	lrhard: lrhard,
  	lrm: lrm,
  	lrtri: lrtri,
  	lsaquo: lsaquo,
  	lscr: lscr,
  	Lscr: Lscr,
  	lsh: lsh,
  	Lsh: Lsh,
  	lsim: lsim,
  	lsime: lsime,
  	lsimg: lsimg,
  	lsqb: lsqb,
  	lsquo: lsquo,
  	lsquor: lsquor,
  	Lstrok: Lstrok,
  	lstrok: lstrok,
  	ltcc: ltcc,
  	ltcir: ltcir,
  	lt: lt,
  	LT: LT,
  	Lt: Lt,
  	ltdot: ltdot,
  	lthree: lthree,
  	ltimes: ltimes,
  	ltlarr: ltlarr,
  	ltquest: ltquest,
  	ltri: ltri,
  	ltrie: ltrie,
  	ltrif: ltrif,
  	ltrPar: ltrPar,
  	lurdshar: lurdshar,
  	luruhar: luruhar,
  	lvertneqq: lvertneqq,
  	lvnE: lvnE,
  	macr: macr,
  	male: male,
  	malt: malt,
  	maltese: maltese,
  	"Map": "⤅",
  	map: map,
  	mapsto: mapsto,
  	mapstodown: mapstodown,
  	mapstoleft: mapstoleft,
  	mapstoup: mapstoup,
  	marker: marker,
  	mcomma: mcomma,
  	Mcy: Mcy,
  	mcy: mcy,
  	mdash: mdash,
  	mDDot: mDDot,
  	measuredangle: measuredangle,
  	MediumSpace: MediumSpace,
  	Mellintrf: Mellintrf,
  	Mfr: Mfr,
  	mfr: mfr,
  	mho: mho,
  	micro: micro,
  	midast: midast,
  	midcir: midcir,
  	mid: mid,
  	middot: middot,
  	minusb: minusb,
  	minus: minus,
  	minusd: minusd,
  	minusdu: minusdu,
  	MinusPlus: MinusPlus,
  	mlcp: mlcp,
  	mldr: mldr,
  	mnplus: mnplus,
  	models: models,
  	Mopf: Mopf,
  	mopf: mopf,
  	mp: mp,
  	mscr: mscr,
  	Mscr: Mscr,
  	mstpos: mstpos,
  	Mu: Mu,
  	mu: mu,
  	multimap: multimap,
  	mumap: mumap,
  	nabla: nabla,
  	Nacute: Nacute,
  	nacute: nacute,
  	nang: nang,
  	nap: nap,
  	napE: napE,
  	napid: napid,
  	napos: napos,
  	napprox: napprox,
  	natural: natural,
  	naturals: naturals,
  	natur: natur,
  	nbsp: nbsp,
  	nbump: nbump,
  	nbumpe: nbumpe,
  	ncap: ncap,
  	Ncaron: Ncaron,
  	ncaron: ncaron,
  	Ncedil: Ncedil,
  	ncedil: ncedil,
  	ncong: ncong,
  	ncongdot: ncongdot,
  	ncup: ncup,
  	Ncy: Ncy,
  	ncy: ncy,
  	ndash: ndash,
  	nearhk: nearhk,
  	nearr: nearr,
  	neArr: neArr,
  	nearrow: nearrow,
  	ne: ne,
  	nedot: nedot,
  	NegativeMediumSpace: NegativeMediumSpace,
  	NegativeThickSpace: NegativeThickSpace,
  	NegativeThinSpace: NegativeThinSpace,
  	NegativeVeryThinSpace: NegativeVeryThinSpace,
  	nequiv: nequiv,
  	nesear: nesear,
  	nesim: nesim,
  	NestedGreaterGreater: NestedGreaterGreater,
  	NestedLessLess: NestedLessLess,
  	NewLine: NewLine,
  	nexist: nexist,
  	nexists: nexists,
  	Nfr: Nfr,
  	nfr: nfr,
  	ngE: ngE,
  	nge: nge,
  	ngeq: ngeq,
  	ngeqq: ngeqq,
  	ngeqslant: ngeqslant,
  	nges: nges,
  	nGg: nGg,
  	ngsim: ngsim,
  	nGt: nGt,
  	ngt: ngt,
  	ngtr: ngtr,
  	nGtv: nGtv,
  	nharr: nharr,
  	nhArr: nhArr,
  	nhpar: nhpar,
  	ni: ni,
  	nis: nis,
  	nisd: nisd,
  	niv: niv,
  	NJcy: NJcy,
  	njcy: njcy,
  	nlarr: nlarr,
  	nlArr: nlArr,
  	nldr: nldr,
  	nlE: nlE,
  	nle: nle,
  	nleftarrow: nleftarrow,
  	nLeftarrow: nLeftarrow,
  	nleftrightarrow: nleftrightarrow,
  	nLeftrightarrow: nLeftrightarrow,
  	nleq: nleq,
  	nleqq: nleqq,
  	nleqslant: nleqslant,
  	nles: nles,
  	nless: nless,
  	nLl: nLl,
  	nlsim: nlsim,
  	nLt: nLt,
  	nlt: nlt,
  	nltri: nltri,
  	nltrie: nltrie,
  	nLtv: nLtv,
  	nmid: nmid,
  	NoBreak: NoBreak,
  	NonBreakingSpace: NonBreakingSpace,
  	nopf: nopf,
  	Nopf: Nopf,
  	Not: Not,
  	not: not,
  	NotCongruent: NotCongruent,
  	NotCupCap: NotCupCap,
  	NotDoubleVerticalBar: NotDoubleVerticalBar,
  	NotElement: NotElement,
  	NotEqual: NotEqual,
  	NotEqualTilde: NotEqualTilde,
  	NotExists: NotExists,
  	NotGreater: NotGreater,
  	NotGreaterEqual: NotGreaterEqual,
  	NotGreaterFullEqual: NotGreaterFullEqual,
  	NotGreaterGreater: NotGreaterGreater,
  	NotGreaterLess: NotGreaterLess,
  	NotGreaterSlantEqual: NotGreaterSlantEqual,
  	NotGreaterTilde: NotGreaterTilde,
  	NotHumpDownHump: NotHumpDownHump,
  	NotHumpEqual: NotHumpEqual,
  	notin: notin,
  	notindot: notindot,
  	notinE: notinE,
  	notinva: notinva,
  	notinvb: notinvb,
  	notinvc: notinvc,
  	NotLeftTriangleBar: NotLeftTriangleBar,
  	NotLeftTriangle: NotLeftTriangle,
  	NotLeftTriangleEqual: NotLeftTriangleEqual,
  	NotLess: NotLess,
  	NotLessEqual: NotLessEqual,
  	NotLessGreater: NotLessGreater,
  	NotLessLess: NotLessLess,
  	NotLessSlantEqual: NotLessSlantEqual,
  	NotLessTilde: NotLessTilde,
  	NotNestedGreaterGreater: NotNestedGreaterGreater,
  	NotNestedLessLess: NotNestedLessLess,
  	notni: notni,
  	notniva: notniva,
  	notnivb: notnivb,
  	notnivc: notnivc,
  	NotPrecedes: NotPrecedes,
  	NotPrecedesEqual: NotPrecedesEqual,
  	NotPrecedesSlantEqual: NotPrecedesSlantEqual,
  	NotReverseElement: NotReverseElement,
  	NotRightTriangleBar: NotRightTriangleBar,
  	NotRightTriangle: NotRightTriangle,
  	NotRightTriangleEqual: NotRightTriangleEqual,
  	NotSquareSubset: NotSquareSubset,
  	NotSquareSubsetEqual: NotSquareSubsetEqual,
  	NotSquareSuperset: NotSquareSuperset,
  	NotSquareSupersetEqual: NotSquareSupersetEqual,
  	NotSubset: NotSubset,
  	NotSubsetEqual: NotSubsetEqual,
  	NotSucceeds: NotSucceeds,
  	NotSucceedsEqual: NotSucceedsEqual,
  	NotSucceedsSlantEqual: NotSucceedsSlantEqual,
  	NotSucceedsTilde: NotSucceedsTilde,
  	NotSuperset: NotSuperset,
  	NotSupersetEqual: NotSupersetEqual,
  	NotTilde: NotTilde,
  	NotTildeEqual: NotTildeEqual,
  	NotTildeFullEqual: NotTildeFullEqual,
  	NotTildeTilde: NotTildeTilde,
  	NotVerticalBar: NotVerticalBar,
  	nparallel: nparallel,
  	npar: npar,
  	nparsl: nparsl,
  	npart: npart,
  	npolint: npolint,
  	npr: npr,
  	nprcue: nprcue,
  	nprec: nprec,
  	npreceq: npreceq,
  	npre: npre,
  	nrarrc: nrarrc,
  	nrarr: nrarr,
  	nrArr: nrArr,
  	nrarrw: nrarrw,
  	nrightarrow: nrightarrow,
  	nRightarrow: nRightarrow,
  	nrtri: nrtri,
  	nrtrie: nrtrie,
  	nsc: nsc,
  	nsccue: nsccue,
  	nsce: nsce,
  	Nscr: Nscr,
  	nscr: nscr,
  	nshortmid: nshortmid,
  	nshortparallel: nshortparallel,
  	nsim: nsim,
  	nsime: nsime,
  	nsimeq: nsimeq,
  	nsmid: nsmid,
  	nspar: nspar,
  	nsqsube: nsqsube,
  	nsqsupe: nsqsupe,
  	nsub: nsub,
  	nsubE: nsubE,
  	nsube: nsube,
  	nsubset: nsubset,
  	nsubseteq: nsubseteq,
  	nsubseteqq: nsubseteqq,
  	nsucc: nsucc,
  	nsucceq: nsucceq,
  	nsup: nsup,
  	nsupE: nsupE,
  	nsupe: nsupe,
  	nsupset: nsupset,
  	nsupseteq: nsupseteq,
  	nsupseteqq: nsupseteqq,
  	ntgl: ntgl,
  	Ntilde: Ntilde,
  	ntilde: ntilde,
  	ntlg: ntlg,
  	ntriangleleft: ntriangleleft,
  	ntrianglelefteq: ntrianglelefteq,
  	ntriangleright: ntriangleright,
  	ntrianglerighteq: ntrianglerighteq,
  	Nu: Nu,
  	nu: nu,
  	num: num,
  	numero: numero,
  	numsp: numsp,
  	nvap: nvap,
  	nvdash: nvdash,
  	nvDash: nvDash,
  	nVdash: nVdash,
  	nVDash: nVDash,
  	nvge: nvge,
  	nvgt: nvgt,
  	nvHarr: nvHarr,
  	nvinfin: nvinfin,
  	nvlArr: nvlArr,
  	nvle: nvle,
  	nvlt: nvlt,
  	nvltrie: nvltrie,
  	nvrArr: nvrArr,
  	nvrtrie: nvrtrie,
  	nvsim: nvsim,
  	nwarhk: nwarhk,
  	nwarr: nwarr,
  	nwArr: nwArr,
  	nwarrow: nwarrow,
  	nwnear: nwnear,
  	Oacute: Oacute,
  	oacute: oacute,
  	oast: oast,
  	Ocirc: Ocirc,
  	ocirc: ocirc,
  	ocir: ocir,
  	Ocy: Ocy,
  	ocy: ocy,
  	odash: odash,
  	Odblac: Odblac,
  	odblac: odblac,
  	odiv: odiv,
  	odot: odot,
  	odsold: odsold,
  	OElig: OElig,
  	oelig: oelig,
  	ofcir: ofcir,
  	Ofr: Ofr,
  	ofr: ofr,
  	ogon: ogon,
  	Ograve: Ograve,
  	ograve: ograve,
  	ogt: ogt,
  	ohbar: ohbar,
  	ohm: ohm,
  	oint: oint,
  	olarr: olarr,
  	olcir: olcir,
  	olcross: olcross,
  	oline: oline,
  	olt: olt,
  	Omacr: Omacr,
  	omacr: omacr,
  	Omega: Omega,
  	omega: omega,
  	Omicron: Omicron,
  	omicron: omicron,
  	omid: omid,
  	ominus: ominus,
  	Oopf: Oopf,
  	oopf: oopf,
  	opar: opar,
  	OpenCurlyDoubleQuote: OpenCurlyDoubleQuote,
  	OpenCurlyQuote: OpenCurlyQuote,
  	operp: operp,
  	oplus: oplus,
  	orarr: orarr,
  	Or: Or,
  	or: or,
  	ord: ord,
  	order: order,
  	orderof: orderof,
  	ordf: ordf,
  	ordm: ordm,
  	origof: origof,
  	oror: oror,
  	orslope: orslope,
  	orv: orv,
  	oS: oS,
  	Oscr: Oscr,
  	oscr: oscr,
  	Oslash: Oslash,
  	oslash: oslash,
  	osol: osol,
  	Otilde: Otilde,
  	otilde: otilde,
  	otimesas: otimesas,
  	Otimes: Otimes,
  	otimes: otimes,
  	Ouml: Ouml,
  	ouml: ouml,
  	ovbar: ovbar,
  	OverBar: OverBar,
  	OverBrace: OverBrace,
  	OverBracket: OverBracket,
  	OverParenthesis: OverParenthesis,
  	para: para,
  	parallel: parallel,
  	par: par,
  	parsim: parsim,
  	parsl: parsl,
  	part: part,
  	PartialD: PartialD,
  	Pcy: Pcy,
  	pcy: pcy,
  	percnt: percnt,
  	period: period,
  	permil: permil,
  	perp: perp,
  	pertenk: pertenk,
  	Pfr: Pfr,
  	pfr: pfr,
  	Phi: Phi,
  	phi: phi,
  	phiv: phiv,
  	phmmat: phmmat,
  	phone: phone,
  	Pi: Pi,
  	pi: pi,
  	pitchfork: pitchfork,
  	piv: piv,
  	planck: planck,
  	planckh: planckh,
  	plankv: plankv,
  	plusacir: plusacir,
  	plusb: plusb,
  	pluscir: pluscir,
  	plus: plus,
  	plusdo: plusdo,
  	plusdu: plusdu,
  	pluse: pluse,
  	PlusMinus: PlusMinus,
  	plusmn: plusmn,
  	plussim: plussim,
  	plustwo: plustwo,
  	pm: pm,
  	Poincareplane: Poincareplane,
  	pointint: pointint,
  	popf: popf,
  	Popf: Popf,
  	pound: pound,
  	prap: prap,
  	Pr: Pr,
  	pr: pr,
  	prcue: prcue,
  	precapprox: precapprox,
  	prec: prec,
  	preccurlyeq: preccurlyeq,
  	Precedes: Precedes,
  	PrecedesEqual: PrecedesEqual,
  	PrecedesSlantEqual: PrecedesSlantEqual,
  	PrecedesTilde: PrecedesTilde,
  	preceq: preceq,
  	precnapprox: precnapprox,
  	precneqq: precneqq,
  	precnsim: precnsim,
  	pre: pre,
  	prE: prE,
  	precsim: precsim,
  	prime: prime,
  	Prime: Prime,
  	primes: primes,
  	prnap: prnap,
  	prnE: prnE,
  	prnsim: prnsim,
  	prod: prod,
  	Product: Product,
  	profalar: profalar,
  	profline: profline,
  	profsurf: profsurf,
  	prop: prop,
  	Proportional: Proportional,
  	Proportion: Proportion,
  	propto: propto,
  	prsim: prsim,
  	prurel: prurel,
  	Pscr: Pscr,
  	pscr: pscr,
  	Psi: Psi,
  	psi: psi,
  	puncsp: puncsp,
  	Qfr: Qfr,
  	qfr: qfr,
  	qint: qint,
  	qopf: qopf,
  	Qopf: Qopf,
  	qprime: qprime,
  	Qscr: Qscr,
  	qscr: qscr,
  	quaternions: quaternions,
  	quatint: quatint,
  	quest: quest,
  	questeq: questeq,
  	quot: quot,
  	QUOT: QUOT,
  	rAarr: rAarr,
  	race: race,
  	Racute: Racute,
  	racute: racute,
  	radic: radic,
  	raemptyv: raemptyv,
  	rang: rang,
  	Rang: Rang,
  	rangd: rangd,
  	range: range,
  	rangle: rangle,
  	raquo: raquo,
  	rarrap: rarrap,
  	rarrb: rarrb,
  	rarrbfs: rarrbfs,
  	rarrc: rarrc,
  	rarr: rarr,
  	Rarr: Rarr,
  	rArr: rArr,
  	rarrfs: rarrfs,
  	rarrhk: rarrhk,
  	rarrlp: rarrlp,
  	rarrpl: rarrpl,
  	rarrsim: rarrsim,
  	Rarrtl: Rarrtl,
  	rarrtl: rarrtl,
  	rarrw: rarrw,
  	ratail: ratail,
  	rAtail: rAtail,
  	ratio: ratio,
  	rationals: rationals,
  	rbarr: rbarr,
  	rBarr: rBarr,
  	RBarr: RBarr,
  	rbbrk: rbbrk,
  	rbrace: rbrace,
  	rbrack: rbrack,
  	rbrke: rbrke,
  	rbrksld: rbrksld,
  	rbrkslu: rbrkslu,
  	Rcaron: Rcaron,
  	rcaron: rcaron,
  	Rcedil: Rcedil,
  	rcedil: rcedil,
  	rceil: rceil,
  	rcub: rcub,
  	Rcy: Rcy,
  	rcy: rcy,
  	rdca: rdca,
  	rdldhar: rdldhar,
  	rdquo: rdquo,
  	rdquor: rdquor,
  	rdsh: rdsh,
  	real: real,
  	realine: realine,
  	realpart: realpart,
  	reals: reals,
  	Re: Re,
  	rect: rect,
  	reg: reg,
  	REG: REG,
  	ReverseElement: ReverseElement,
  	ReverseEquilibrium: ReverseEquilibrium,
  	ReverseUpEquilibrium: ReverseUpEquilibrium,
  	rfisht: rfisht,
  	rfloor: rfloor,
  	rfr: rfr,
  	Rfr: Rfr,
  	rHar: rHar,
  	rhard: rhard,
  	rharu: rharu,
  	rharul: rharul,
  	Rho: Rho,
  	rho: rho,
  	rhov: rhov,
  	RightAngleBracket: RightAngleBracket,
  	RightArrowBar: RightArrowBar,
  	rightarrow: rightarrow,
  	RightArrow: RightArrow,
  	Rightarrow: Rightarrow,
  	RightArrowLeftArrow: RightArrowLeftArrow,
  	rightarrowtail: rightarrowtail,
  	RightCeiling: RightCeiling,
  	RightDoubleBracket: RightDoubleBracket,
  	RightDownTeeVector: RightDownTeeVector,
  	RightDownVectorBar: RightDownVectorBar,
  	RightDownVector: RightDownVector,
  	RightFloor: RightFloor,
  	rightharpoondown: rightharpoondown,
  	rightharpoonup: rightharpoonup,
  	rightleftarrows: rightleftarrows,
  	rightleftharpoons: rightleftharpoons,
  	rightrightarrows: rightrightarrows,
  	rightsquigarrow: rightsquigarrow,
  	RightTeeArrow: RightTeeArrow,
  	RightTee: RightTee,
  	RightTeeVector: RightTeeVector,
  	rightthreetimes: rightthreetimes,
  	RightTriangleBar: RightTriangleBar,
  	RightTriangle: RightTriangle,
  	RightTriangleEqual: RightTriangleEqual,
  	RightUpDownVector: RightUpDownVector,
  	RightUpTeeVector: RightUpTeeVector,
  	RightUpVectorBar: RightUpVectorBar,
  	RightUpVector: RightUpVector,
  	RightVectorBar: RightVectorBar,
  	RightVector: RightVector,
  	ring: ring,
  	risingdotseq: risingdotseq,
  	rlarr: rlarr,
  	rlhar: rlhar,
  	rlm: rlm,
  	rmoustache: rmoustache,
  	rmoust: rmoust,
  	rnmid: rnmid,
  	roang: roang,
  	roarr: roarr,
  	robrk: robrk,
  	ropar: ropar,
  	ropf: ropf,
  	Ropf: Ropf,
  	roplus: roplus,
  	rotimes: rotimes,
  	RoundImplies: RoundImplies,
  	rpar: rpar,
  	rpargt: rpargt,
  	rppolint: rppolint,
  	rrarr: rrarr,
  	Rrightarrow: Rrightarrow,
  	rsaquo: rsaquo,
  	rscr: rscr,
  	Rscr: Rscr,
  	rsh: rsh,
  	Rsh: Rsh,
  	rsqb: rsqb,
  	rsquo: rsquo,
  	rsquor: rsquor,
  	rthree: rthree,
  	rtimes: rtimes,
  	rtri: rtri,
  	rtrie: rtrie,
  	rtrif: rtrif,
  	rtriltri: rtriltri,
  	RuleDelayed: RuleDelayed,
  	ruluhar: ruluhar,
  	rx: rx,
  	Sacute: Sacute,
  	sacute: sacute,
  	sbquo: sbquo,
  	scap: scap,
  	Scaron: Scaron,
  	scaron: scaron,
  	Sc: Sc,
  	sc: sc,
  	sccue: sccue,
  	sce: sce,
  	scE: scE,
  	Scedil: Scedil,
  	scedil: scedil,
  	Scirc: Scirc,
  	scirc: scirc,
  	scnap: scnap,
  	scnE: scnE,
  	scnsim: scnsim,
  	scpolint: scpolint,
  	scsim: scsim,
  	Scy: Scy,
  	scy: scy,
  	sdotb: sdotb,
  	sdot: sdot,
  	sdote: sdote,
  	searhk: searhk,
  	searr: searr,
  	seArr: seArr,
  	searrow: searrow,
  	sect: sect,
  	semi: semi,
  	seswar: seswar,
  	setminus: setminus,
  	setmn: setmn,
  	sext: sext,
  	Sfr: Sfr,
  	sfr: sfr,
  	sfrown: sfrown,
  	sharp: sharp,
  	SHCHcy: SHCHcy,
  	shchcy: shchcy,
  	SHcy: SHcy,
  	shcy: shcy,
  	ShortDownArrow: ShortDownArrow,
  	ShortLeftArrow: ShortLeftArrow,
  	shortmid: shortmid,
  	shortparallel: shortparallel,
  	ShortRightArrow: ShortRightArrow,
  	ShortUpArrow: ShortUpArrow,
  	shy: shy,
  	Sigma: Sigma,
  	sigma: sigma,
  	sigmaf: sigmaf,
  	sigmav: sigmav,
  	sim: sim,
  	simdot: simdot,
  	sime: sime,
  	simeq: simeq,
  	simg: simg,
  	simgE: simgE,
  	siml: siml,
  	simlE: simlE,
  	simne: simne,
  	simplus: simplus,
  	simrarr: simrarr,
  	slarr: slarr,
  	SmallCircle: SmallCircle,
  	smallsetminus: smallsetminus,
  	smashp: smashp,
  	smeparsl: smeparsl,
  	smid: smid,
  	smile: smile,
  	smt: smt,
  	smte: smte,
  	smtes: smtes,
  	SOFTcy: SOFTcy,
  	softcy: softcy,
  	solbar: solbar,
  	solb: solb,
  	sol: sol,
  	Sopf: Sopf,
  	sopf: sopf,
  	spades: spades,
  	spadesuit: spadesuit,
  	spar: spar,
  	sqcap: sqcap,
  	sqcaps: sqcaps,
  	sqcup: sqcup,
  	sqcups: sqcups,
  	Sqrt: Sqrt,
  	sqsub: sqsub,
  	sqsube: sqsube,
  	sqsubset: sqsubset,
  	sqsubseteq: sqsubseteq,
  	sqsup: sqsup,
  	sqsupe: sqsupe,
  	sqsupset: sqsupset,
  	sqsupseteq: sqsupseteq,
  	square: square,
  	Square: Square,
  	SquareIntersection: SquareIntersection,
  	SquareSubset: SquareSubset,
  	SquareSubsetEqual: SquareSubsetEqual,
  	SquareSuperset: SquareSuperset,
  	SquareSupersetEqual: SquareSupersetEqual,
  	SquareUnion: SquareUnion,
  	squarf: squarf,
  	squ: squ,
  	squf: squf,
  	srarr: srarr,
  	Sscr: Sscr,
  	sscr: sscr,
  	ssetmn: ssetmn,
  	ssmile: ssmile,
  	sstarf: sstarf,
  	Star: Star,
  	star: star,
  	starf: starf,
  	straightepsilon: straightepsilon,
  	straightphi: straightphi,
  	strns: strns,
  	sub: sub$1,
  	Sub: Sub,
  	subdot: subdot,
  	subE: subE,
  	sube: sube,
  	subedot: subedot,
  	submult: submult,
  	subnE: subnE,
  	subne: subne,
  	subplus: subplus,
  	subrarr: subrarr,
  	subset: subset,
  	Subset: Subset,
  	subseteq: subseteq,
  	subseteqq: subseteqq,
  	SubsetEqual: SubsetEqual,
  	subsetneq: subsetneq,
  	subsetneqq: subsetneqq,
  	subsim: subsim,
  	subsub: subsub,
  	subsup: subsup,
  	succapprox: succapprox,
  	succ: succ,
  	succcurlyeq: succcurlyeq,
  	Succeeds: Succeeds,
  	SucceedsEqual: SucceedsEqual,
  	SucceedsSlantEqual: SucceedsSlantEqual,
  	SucceedsTilde: SucceedsTilde,
  	succeq: succeq,
  	succnapprox: succnapprox,
  	succneqq: succneqq,
  	succnsim: succnsim,
  	succsim: succsim,
  	SuchThat: SuchThat,
  	sum: sum,
  	Sum: Sum,
  	sung: sung,
  	sup1: sup1,
  	sup2: sup2,
  	sup3: sup3,
  	sup: sup,
  	Sup: Sup,
  	supdot: supdot,
  	supdsub: supdsub,
  	supE: supE,
  	supe: supe,
  	supedot: supedot,
  	Superset: Superset,
  	SupersetEqual: SupersetEqual,
  	suphsol: suphsol,
  	suphsub: suphsub,
  	suplarr: suplarr,
  	supmult: supmult,
  	supnE: supnE,
  	supne: supne,
  	supplus: supplus,
  	supset: supset,
  	Supset: Supset,
  	supseteq: supseteq,
  	supseteqq: supseteqq,
  	supsetneq: supsetneq,
  	supsetneqq: supsetneqq,
  	supsim: supsim,
  	supsub: supsub,
  	supsup: supsup,
  	swarhk: swarhk,
  	swarr: swarr,
  	swArr: swArr,
  	swarrow: swarrow,
  	swnwar: swnwar,
  	szlig: szlig,
  	Tab: Tab,
  	target: target,
  	Tau: Tau,
  	tau: tau,
  	tbrk: tbrk,
  	Tcaron: Tcaron,
  	tcaron: tcaron,
  	Tcedil: Tcedil,
  	tcedil: tcedil,
  	Tcy: Tcy,
  	tcy: tcy,
  	tdot: tdot,
  	telrec: telrec,
  	Tfr: Tfr,
  	tfr: tfr,
  	there4: there4,
  	therefore: therefore,
  	Therefore: Therefore,
  	Theta: Theta,
  	theta: theta,
  	thetasym: thetasym,
  	thetav: thetav,
  	thickapprox: thickapprox,
  	thicksim: thicksim,
  	ThickSpace: ThickSpace,
  	ThinSpace: ThinSpace,
  	thinsp: thinsp,
  	thkap: thkap,
  	thksim: thksim,
  	THORN: THORN,
  	thorn: thorn,
  	tilde: tilde,
  	Tilde: Tilde,
  	TildeEqual: TildeEqual,
  	TildeFullEqual: TildeFullEqual,
  	TildeTilde: TildeTilde,
  	timesbar: timesbar,
  	timesb: timesb,
  	times: times,
  	timesd: timesd,
  	tint: tint,
  	toea: toea,
  	topbot: topbot,
  	topcir: topcir,
  	top: top,
  	Topf: Topf,
  	topf: topf,
  	topfork: topfork,
  	tosa: tosa,
  	tprime: tprime,
  	trade: trade,
  	TRADE: TRADE,
  	triangle: triangle,
  	triangledown: triangledown,
  	triangleleft: triangleleft,
  	trianglelefteq: trianglelefteq,
  	triangleq: triangleq,
  	triangleright: triangleright,
  	trianglerighteq: trianglerighteq,
  	tridot: tridot,
  	trie: trie,
  	triminus: triminus,
  	TripleDot: TripleDot,
  	triplus: triplus,
  	trisb: trisb,
  	tritime: tritime,
  	trpezium: trpezium,
  	Tscr: Tscr,
  	tscr: tscr,
  	TScy: TScy,
  	tscy: tscy,
  	TSHcy: TSHcy,
  	tshcy: tshcy,
  	Tstrok: Tstrok,
  	tstrok: tstrok,
  	twixt: twixt,
  	twoheadleftarrow: twoheadleftarrow,
  	twoheadrightarrow: twoheadrightarrow,
  	Uacute: Uacute,
  	uacute: uacute,
  	uarr: uarr,
  	Uarr: Uarr,
  	uArr: uArr,
  	Uarrocir: Uarrocir,
  	Ubrcy: Ubrcy,
  	ubrcy: ubrcy,
  	Ubreve: Ubreve,
  	ubreve: ubreve,
  	Ucirc: Ucirc,
  	ucirc: ucirc,
  	Ucy: Ucy,
  	ucy: ucy,
  	udarr: udarr,
  	Udblac: Udblac,
  	udblac: udblac,
  	udhar: udhar,
  	ufisht: ufisht,
  	Ufr: Ufr,
  	ufr: ufr,
  	Ugrave: Ugrave,
  	ugrave: ugrave,
  	uHar: uHar,
  	uharl: uharl,
  	uharr: uharr,
  	uhblk: uhblk,
  	ulcorn: ulcorn,
  	ulcorner: ulcorner,
  	ulcrop: ulcrop,
  	ultri: ultri,
  	Umacr: Umacr,
  	umacr: umacr,
  	uml: uml,
  	UnderBar: UnderBar,
  	UnderBrace: UnderBrace,
  	UnderBracket: UnderBracket,
  	UnderParenthesis: UnderParenthesis,
  	Union: Union,
  	UnionPlus: UnionPlus,
  	Uogon: Uogon,
  	uogon: uogon,
  	Uopf: Uopf,
  	uopf: uopf,
  	UpArrowBar: UpArrowBar,
  	uparrow: uparrow,
  	UpArrow: UpArrow,
  	Uparrow: Uparrow,
  	UpArrowDownArrow: UpArrowDownArrow,
  	updownarrow: updownarrow,
  	UpDownArrow: UpDownArrow,
  	Updownarrow: Updownarrow,
  	UpEquilibrium: UpEquilibrium,
  	upharpoonleft: upharpoonleft,
  	upharpoonright: upharpoonright,
  	uplus: uplus,
  	UpperLeftArrow: UpperLeftArrow,
  	UpperRightArrow: UpperRightArrow,
  	upsi: upsi,
  	Upsi: Upsi,
  	upsih: upsih,
  	Upsilon: Upsilon,
  	upsilon: upsilon,
  	UpTeeArrow: UpTeeArrow,
  	UpTee: UpTee,
  	upuparrows: upuparrows,
  	urcorn: urcorn,
  	urcorner: urcorner,
  	urcrop: urcrop,
  	Uring: Uring,
  	uring: uring,
  	urtri: urtri,
  	Uscr: Uscr,
  	uscr: uscr,
  	utdot: utdot,
  	Utilde: Utilde,
  	utilde: utilde,
  	utri: utri,
  	utrif: utrif,
  	uuarr: uuarr,
  	Uuml: Uuml,
  	uuml: uuml,
  	uwangle: uwangle,
  	vangrt: vangrt,
  	varepsilon: varepsilon,
  	varkappa: varkappa,
  	varnothing: varnothing,
  	varphi: varphi,
  	varpi: varpi,
  	varpropto: varpropto,
  	varr: varr,
  	vArr: vArr,
  	varrho: varrho,
  	varsigma: varsigma,
  	varsubsetneq: varsubsetneq,
  	varsubsetneqq: varsubsetneqq,
  	varsupsetneq: varsupsetneq,
  	varsupsetneqq: varsupsetneqq,
  	vartheta: vartheta,
  	vartriangleleft: vartriangleleft,
  	vartriangleright: vartriangleright,
  	vBar: vBar,
  	Vbar: Vbar,
  	vBarv: vBarv,
  	Vcy: Vcy,
  	vcy: vcy,
  	vdash: vdash,
  	vDash: vDash,
  	Vdash: Vdash,
  	VDash: VDash,
  	Vdashl: Vdashl,
  	veebar: veebar,
  	vee: vee,
  	Vee: Vee,
  	veeeq: veeeq,
  	vellip: vellip,
  	verbar: verbar,
  	Verbar: Verbar,
  	vert: vert,
  	Vert: Vert,
  	VerticalBar: VerticalBar,
  	VerticalLine: VerticalLine,
  	VerticalSeparator: VerticalSeparator,
  	VerticalTilde: VerticalTilde,
  	VeryThinSpace: VeryThinSpace,
  	Vfr: Vfr,
  	vfr: vfr,
  	vltri: vltri,
  	vnsub: vnsub,
  	vnsup: vnsup,
  	Vopf: Vopf,
  	vopf: vopf,
  	vprop: vprop,
  	vrtri: vrtri,
  	Vscr: Vscr,
  	vscr: vscr,
  	vsubnE: vsubnE,
  	vsubne: vsubne,
  	vsupnE: vsupnE,
  	vsupne: vsupne,
  	Vvdash: Vvdash,
  	vzigzag: vzigzag,
  	Wcirc: Wcirc,
  	wcirc: wcirc,
  	wedbar: wedbar,
  	wedge: wedge,
  	Wedge: Wedge,
  	wedgeq: wedgeq,
  	weierp: weierp,
  	Wfr: Wfr,
  	wfr: wfr,
  	Wopf: Wopf,
  	wopf: wopf,
  	wp: wp,
  	wr: wr,
  	wreath: wreath,
  	Wscr: Wscr,
  	wscr: wscr,
  	xcap: xcap,
  	xcirc: xcirc,
  	xcup: xcup,
  	xdtri: xdtri,
  	Xfr: Xfr,
  	xfr: xfr,
  	xharr: xharr,
  	xhArr: xhArr,
  	Xi: Xi,
  	xi: xi,
  	xlarr: xlarr,
  	xlArr: xlArr,
  	xmap: xmap,
  	xnis: xnis,
  	xodot: xodot,
  	Xopf: Xopf,
  	xopf: xopf,
  	xoplus: xoplus,
  	xotime: xotime,
  	xrarr: xrarr,
  	xrArr: xrArr,
  	Xscr: Xscr,
  	xscr: xscr,
  	xsqcup: xsqcup,
  	xuplus: xuplus,
  	xutri: xutri,
  	xvee: xvee,
  	xwedge: xwedge,
  	Yacute: Yacute,
  	yacute: yacute,
  	YAcy: YAcy,
  	yacy: yacy,
  	Ycirc: Ycirc,
  	ycirc: ycirc,
  	Ycy: Ycy,
  	ycy: ycy,
  	yen: yen,
  	Yfr: Yfr,
  	yfr: yfr,
  	YIcy: YIcy,
  	yicy: yicy,
  	Yopf: Yopf,
  	yopf: yopf,
  	Yscr: Yscr,
  	yscr: yscr,
  	YUcy: YUcy,
  	yucy: yucy,
  	yuml: yuml,
  	Yuml: Yuml,
  	Zacute: Zacute,
  	zacute: zacute,
  	Zcaron: Zcaron,
  	zcaron: zcaron,
  	Zcy: Zcy,
  	zcy: zcy,
  	Zdot: Zdot,
  	zdot: zdot,
  	zeetrf: zeetrf,
  	ZeroWidthSpace: ZeroWidthSpace,
  	Zeta: Zeta,
  	zeta: zeta,
  	zfr: zfr,
  	Zfr: Zfr,
  	ZHcy: ZHcy,
  	zhcy: zhcy,
  	zigrarr: zigrarr,
  	zopf: zopf,
  	Zopf: Zopf,
  	Zscr: Zscr,
  	zscr: zscr,
  	zwj: zwj,
  	zwnj: zwnj
  };

  var entities$1 = /*#__PURE__*/Object.freeze({
    Aacute: Aacute,
    aacute: aacute,
    Abreve: Abreve,
    abreve: abreve,
    ac: ac,
    acd: acd,
    acE: acE,
    Acirc: Acirc,
    acirc: acirc,
    acute: acute,
    Acy: Acy,
    acy: acy,
    AElig: AElig,
    aelig: aelig,
    af: af,
    Afr: Afr,
    afr: afr,
    Agrave: Agrave,
    agrave: agrave,
    alefsym: alefsym,
    aleph: aleph,
    Alpha: Alpha,
    alpha: alpha,
    Amacr: Amacr,
    amacr: amacr,
    amalg: amalg,
    amp: amp,
    AMP: AMP,
    andand: andand,
    And: And,
    and: and,
    andd: andd,
    andslope: andslope,
    andv: andv,
    ang: ang,
    ange: ange,
    angle: angle,
    angmsdaa: angmsdaa,
    angmsdab: angmsdab,
    angmsdac: angmsdac,
    angmsdad: angmsdad,
    angmsdae: angmsdae,
    angmsdaf: angmsdaf,
    angmsdag: angmsdag,
    angmsdah: angmsdah,
    angmsd: angmsd,
    angrt: angrt,
    angrtvb: angrtvb,
    angrtvbd: angrtvbd,
    angsph: angsph,
    angst: angst,
    angzarr: angzarr,
    Aogon: Aogon,
    aogon: aogon,
    Aopf: Aopf,
    aopf: aopf,
    apacir: apacir,
    ap: ap,
    apE: apE,
    ape: ape,
    apid: apid,
    apos: apos,
    ApplyFunction: ApplyFunction,
    approx: approx,
    approxeq: approxeq,
    Aring: Aring,
    aring: aring,
    Ascr: Ascr,
    ascr: ascr,
    Assign: Assign,
    ast: ast,
    asymp: asymp,
    asympeq: asympeq,
    Atilde: Atilde,
    atilde: atilde,
    Auml: Auml,
    auml: auml,
    awconint: awconint,
    awint: awint,
    backcong: backcong,
    backepsilon: backepsilon,
    backprime: backprime,
    backsim: backsim,
    backsimeq: backsimeq,
    Backslash: Backslash,
    Barv: Barv,
    barvee: barvee,
    barwed: barwed,
    Barwed: Barwed,
    barwedge: barwedge,
    bbrk: bbrk,
    bbrktbrk: bbrktbrk,
    bcong: bcong,
    Bcy: Bcy,
    bcy: bcy,
    bdquo: bdquo,
    becaus: becaus,
    because: because,
    Because: Because,
    bemptyv: bemptyv,
    bepsi: bepsi,
    bernou: bernou,
    Bernoullis: Bernoullis,
    Beta: Beta,
    beta: beta,
    beth: beth,
    between: between,
    Bfr: Bfr,
    bfr: bfr,
    bigcap: bigcap,
    bigcirc: bigcirc,
    bigcup: bigcup,
    bigodot: bigodot,
    bigoplus: bigoplus,
    bigotimes: bigotimes,
    bigsqcup: bigsqcup,
    bigstar: bigstar,
    bigtriangledown: bigtriangledown,
    bigtriangleup: bigtriangleup,
    biguplus: biguplus,
    bigvee: bigvee,
    bigwedge: bigwedge,
    bkarow: bkarow,
    blacklozenge: blacklozenge,
    blacksquare: blacksquare,
    blacktriangle: blacktriangle,
    blacktriangledown: blacktriangledown,
    blacktriangleleft: blacktriangleleft,
    blacktriangleright: blacktriangleright,
    blank: blank,
    blk12: blk12,
    blk14: blk14,
    blk34: blk34,
    block: block,
    bne: bne,
    bnequiv: bnequiv,
    bNot: bNot,
    bnot: bnot,
    Bopf: Bopf,
    bopf: bopf,
    bot: bot,
    bottom: bottom,
    bowtie: bowtie,
    boxbox: boxbox,
    boxdl: boxdl,
    boxdL: boxdL,
    boxDl: boxDl,
    boxDL: boxDL,
    boxdr: boxdr,
    boxdR: boxdR,
    boxDr: boxDr,
    boxDR: boxDR,
    boxh: boxh,
    boxH: boxH,
    boxhd: boxhd,
    boxHd: boxHd,
    boxhD: boxhD,
    boxHD: boxHD,
    boxhu: boxhu,
    boxHu: boxHu,
    boxhU: boxhU,
    boxHU: boxHU,
    boxminus: boxminus,
    boxplus: boxplus,
    boxtimes: boxtimes,
    boxul: boxul,
    boxuL: boxuL,
    boxUl: boxUl,
    boxUL: boxUL,
    boxur: boxur,
    boxuR: boxuR,
    boxUr: boxUr,
    boxUR: boxUR,
    boxv: boxv,
    boxV: boxV,
    boxvh: boxvh,
    boxvH: boxvH,
    boxVh: boxVh,
    boxVH: boxVH,
    boxvl: boxvl,
    boxvL: boxvL,
    boxVl: boxVl,
    boxVL: boxVL,
    boxvr: boxvr,
    boxvR: boxvR,
    boxVr: boxVr,
    boxVR: boxVR,
    bprime: bprime,
    breve: breve,
    Breve: Breve,
    brvbar: brvbar,
    bscr: bscr,
    Bscr: Bscr,
    bsemi: bsemi,
    bsim: bsim,
    bsime: bsime,
    bsolb: bsolb,
    bsol: bsol,
    bsolhsub: bsolhsub,
    bull: bull,
    bullet: bullet,
    bump: bump,
    bumpE: bumpE,
    bumpe: bumpe,
    Bumpeq: Bumpeq,
    bumpeq: bumpeq,
    Cacute: Cacute,
    cacute: cacute,
    capand: capand,
    capbrcup: capbrcup,
    capcap: capcap,
    cap: cap,
    Cap: Cap,
    capcup: capcup,
    capdot: capdot,
    CapitalDifferentialD: CapitalDifferentialD,
    caps: caps,
    caret: caret,
    caron: caron,
    Cayleys: Cayleys,
    ccaps: ccaps,
    Ccaron: Ccaron,
    ccaron: ccaron,
    Ccedil: Ccedil,
    ccedil: ccedil,
    Ccirc: Ccirc,
    ccirc: ccirc,
    Cconint: Cconint,
    ccups: ccups,
    ccupssm: ccupssm,
    Cdot: Cdot,
    cdot: cdot,
    cedil: cedil,
    Cedilla: Cedilla,
    cemptyv: cemptyv,
    cent: cent,
    centerdot: centerdot,
    CenterDot: CenterDot,
    cfr: cfr,
    Cfr: Cfr,
    CHcy: CHcy,
    chcy: chcy,
    check: check,
    checkmark: checkmark,
    Chi: Chi,
    chi: chi,
    circ: circ,
    circeq: circeq,
    circlearrowleft: circlearrowleft,
    circlearrowright: circlearrowright,
    circledast: circledast,
    circledcirc: circledcirc,
    circleddash: circleddash,
    CircleDot: CircleDot,
    circledR: circledR,
    circledS: circledS,
    CircleMinus: CircleMinus,
    CirclePlus: CirclePlus,
    CircleTimes: CircleTimes,
    cir: cir,
    cirE: cirE,
    cire: cire,
    cirfnint: cirfnint,
    cirmid: cirmid,
    cirscir: cirscir,
    ClockwiseContourIntegral: ClockwiseContourIntegral,
    CloseCurlyDoubleQuote: CloseCurlyDoubleQuote,
    CloseCurlyQuote: CloseCurlyQuote,
    clubs: clubs,
    clubsuit: clubsuit,
    colon: colon,
    Colon: Colon,
    Colone: Colone,
    colone: colone,
    coloneq: coloneq,
    comma: comma,
    commat: commat,
    comp: comp,
    compfn: compfn,
    complement: complement,
    complexes: complexes,
    cong: cong,
    congdot: congdot,
    Congruent: Congruent,
    conint: conint,
    Conint: Conint,
    ContourIntegral: ContourIntegral,
    copf: copf,
    Copf: Copf,
    coprod: coprod,
    Coproduct: Coproduct,
    copy: copy,
    COPY: COPY,
    copysr: copysr,
    CounterClockwiseContourIntegral: CounterClockwiseContourIntegral,
    crarr: crarr,
    cross: cross,
    Cross: Cross,
    Cscr: Cscr,
    cscr: cscr,
    csub: csub,
    csube: csube,
    csup: csup,
    csupe: csupe,
    ctdot: ctdot,
    cudarrl: cudarrl,
    cudarrr: cudarrr,
    cuepr: cuepr,
    cuesc: cuesc,
    cularr: cularr,
    cularrp: cularrp,
    cupbrcap: cupbrcap,
    cupcap: cupcap,
    CupCap: CupCap,
    cup: cup,
    Cup: Cup,
    cupcup: cupcup,
    cupdot: cupdot,
    cupor: cupor,
    cups: cups,
    curarr: curarr,
    curarrm: curarrm,
    curlyeqprec: curlyeqprec,
    curlyeqsucc: curlyeqsucc,
    curlyvee: curlyvee,
    curlywedge: curlywedge,
    curren: curren,
    curvearrowleft: curvearrowleft,
    curvearrowright: curvearrowright,
    cuvee: cuvee,
    cuwed: cuwed,
    cwconint: cwconint,
    cwint: cwint,
    cylcty: cylcty,
    dagger: dagger,
    Dagger: Dagger,
    daleth: daleth,
    darr: darr,
    Darr: Darr,
    dArr: dArr,
    dash: dash,
    Dashv: Dashv,
    dashv: dashv,
    dbkarow: dbkarow,
    dblac: dblac,
    Dcaron: Dcaron,
    dcaron: dcaron,
    Dcy: Dcy,
    dcy: dcy,
    ddagger: ddagger,
    ddarr: ddarr,
    DD: DD,
    dd: dd,
    DDotrahd: DDotrahd,
    ddotseq: ddotseq,
    deg: deg,
    Del: Del,
    Delta: Delta,
    delta: delta,
    demptyv: demptyv,
    dfisht: dfisht,
    Dfr: Dfr,
    dfr: dfr,
    dHar: dHar,
    dharl: dharl,
    dharr: dharr,
    DiacriticalAcute: DiacriticalAcute,
    DiacriticalDot: DiacriticalDot,
    DiacriticalDoubleAcute: DiacriticalDoubleAcute,
    DiacriticalGrave: DiacriticalGrave,
    DiacriticalTilde: DiacriticalTilde,
    diam: diam,
    diamond: diamond,
    Diamond: Diamond,
    diamondsuit: diamondsuit,
    diams: diams,
    die: die,
    DifferentialD: DifferentialD,
    digamma: digamma,
    disin: disin,
    div: div$1,
    divide: divide$1,
    divideontimes: divideontimes,
    divonx: divonx,
    DJcy: DJcy,
    djcy: djcy,
    dlcorn: dlcorn,
    dlcrop: dlcrop,
    dollar: dollar,
    Dopf: Dopf,
    dopf: dopf,
    Dot: Dot,
    dot: dot,
    DotDot: DotDot,
    doteq: doteq,
    doteqdot: doteqdot,
    DotEqual: DotEqual,
    dotminus: dotminus,
    dotplus: dotplus,
    dotsquare: dotsquare,
    doublebarwedge: doublebarwedge,
    DoubleContourIntegral: DoubleContourIntegral,
    DoubleDot: DoubleDot,
    DoubleDownArrow: DoubleDownArrow,
    DoubleLeftArrow: DoubleLeftArrow,
    DoubleLeftRightArrow: DoubleLeftRightArrow,
    DoubleLeftTee: DoubleLeftTee,
    DoubleLongLeftArrow: DoubleLongLeftArrow,
    DoubleLongLeftRightArrow: DoubleLongLeftRightArrow,
    DoubleLongRightArrow: DoubleLongRightArrow,
    DoubleRightArrow: DoubleRightArrow,
    DoubleRightTee: DoubleRightTee,
    DoubleUpArrow: DoubleUpArrow,
    DoubleUpDownArrow: DoubleUpDownArrow,
    DoubleVerticalBar: DoubleVerticalBar,
    DownArrowBar: DownArrowBar,
    downarrow: downarrow,
    DownArrow: DownArrow,
    Downarrow: Downarrow,
    DownArrowUpArrow: DownArrowUpArrow,
    DownBreve: DownBreve,
    downdownarrows: downdownarrows,
    downharpoonleft: downharpoonleft,
    downharpoonright: downharpoonright,
    DownLeftRightVector: DownLeftRightVector,
    DownLeftTeeVector: DownLeftTeeVector,
    DownLeftVectorBar: DownLeftVectorBar,
    DownLeftVector: DownLeftVector,
    DownRightTeeVector: DownRightTeeVector,
    DownRightVectorBar: DownRightVectorBar,
    DownRightVector: DownRightVector,
    DownTeeArrow: DownTeeArrow,
    DownTee: DownTee,
    drbkarow: drbkarow,
    drcorn: drcorn,
    drcrop: drcrop,
    Dscr: Dscr,
    dscr: dscr,
    DScy: DScy,
    dscy: dscy,
    dsol: dsol,
    Dstrok: Dstrok,
    dstrok: dstrok,
    dtdot: dtdot,
    dtri: dtri,
    dtrif: dtrif,
    duarr: duarr,
    duhar: duhar,
    dwangle: dwangle,
    DZcy: DZcy,
    dzcy: dzcy,
    dzigrarr: dzigrarr,
    Eacute: Eacute,
    eacute: eacute,
    easter: easter,
    Ecaron: Ecaron,
    ecaron: ecaron,
    Ecirc: Ecirc,
    ecirc: ecirc,
    ecir: ecir,
    ecolon: ecolon,
    Ecy: Ecy,
    ecy: ecy,
    eDDot: eDDot,
    Edot: Edot,
    edot: edot,
    eDot: eDot,
    ee: ee,
    efDot: efDot,
    Efr: Efr,
    efr: efr,
    eg: eg,
    Egrave: Egrave,
    egrave: egrave,
    egs: egs,
    egsdot: egsdot,
    el: el,
    Element: Element,
    elinters: elinters,
    ell: ell,
    els: els,
    elsdot: elsdot,
    Emacr: Emacr,
    emacr: emacr,
    empty: empty,
    emptyset: emptyset,
    EmptySmallSquare: EmptySmallSquare,
    emptyv: emptyv,
    EmptyVerySmallSquare: EmptyVerySmallSquare,
    emsp13: emsp13,
    emsp14: emsp14,
    emsp: emsp,
    ENG: ENG,
    eng: eng,
    ensp: ensp,
    Eogon: Eogon,
    eogon: eogon,
    Eopf: Eopf,
    eopf: eopf,
    epar: epar,
    eparsl: eparsl,
    eplus: eplus,
    epsi: epsi,
    Epsilon: Epsilon,
    epsilon: epsilon,
    epsiv: epsiv,
    eqcirc: eqcirc,
    eqcolon: eqcolon,
    eqsim: eqsim,
    eqslantgtr: eqslantgtr,
    eqslantless: eqslantless,
    Equal: Equal,
    equals: equals,
    EqualTilde: EqualTilde,
    equest: equest,
    Equilibrium: Equilibrium,
    equiv: equiv,
    equivDD: equivDD,
    eqvparsl: eqvparsl,
    erarr: erarr,
    erDot: erDot,
    escr: escr,
    Escr: Escr,
    esdot: esdot,
    Esim: Esim,
    esim: esim,
    Eta: Eta,
    eta: eta,
    ETH: ETH,
    eth: eth,
    Euml: Euml,
    euml: euml,
    euro: euro,
    excl: excl,
    exist: exist,
    Exists: Exists,
    expectation: expectation,
    exponentiale: exponentiale,
    ExponentialE: ExponentialE,
    fallingdotseq: fallingdotseq,
    Fcy: Fcy,
    fcy: fcy,
    female: female,
    ffilig: ffilig,
    fflig: fflig,
    ffllig: ffllig,
    Ffr: Ffr,
    ffr: ffr,
    filig: filig,
    FilledSmallSquare: FilledSmallSquare,
    FilledVerySmallSquare: FilledVerySmallSquare,
    fjlig: fjlig,
    flat: flat,
    fllig: fllig,
    fltns: fltns,
    fnof: fnof,
    Fopf: Fopf,
    fopf: fopf,
    forall: forall,
    ForAll: ForAll,
    fork: fork,
    forkv: forkv,
    Fouriertrf: Fouriertrf,
    fpartint: fpartint,
    frac12: frac12,
    frac13: frac13,
    frac14: frac14,
    frac15: frac15,
    frac16: frac16,
    frac18: frac18,
    frac23: frac23,
    frac25: frac25,
    frac34: frac34,
    frac35: frac35,
    frac38: frac38,
    frac45: frac45,
    frac56: frac56,
    frac58: frac58,
    frac78: frac78,
    frasl: frasl,
    frown: frown,
    fscr: fscr,
    Fscr: Fscr,
    gacute: gacute,
    Gamma: Gamma,
    gamma: gamma,
    Gammad: Gammad,
    gammad: gammad,
    gap: gap,
    Gbreve: Gbreve,
    gbreve: gbreve,
    Gcedil: Gcedil,
    Gcirc: Gcirc,
    gcirc: gcirc,
    Gcy: Gcy,
    gcy: gcy,
    Gdot: Gdot,
    gdot: gdot,
    ge: ge,
    gE: gE,
    gEl: gEl,
    gel: gel,
    geq: geq,
    geqq: geqq,
    geqslant: geqslant,
    gescc: gescc,
    ges: ges,
    gesdot: gesdot,
    gesdoto: gesdoto,
    gesdotol: gesdotol,
    gesl: gesl,
    gesles: gesles,
    Gfr: Gfr,
    gfr: gfr,
    gg: gg,
    Gg: Gg,
    ggg: ggg,
    gimel: gimel,
    GJcy: GJcy,
    gjcy: gjcy,
    gla: gla,
    gl: gl,
    glE: glE,
    glj: glj,
    gnap: gnap,
    gnapprox: gnapprox,
    gne: gne,
    gnE: gnE,
    gneq: gneq,
    gneqq: gneqq,
    gnsim: gnsim,
    Gopf: Gopf,
    gopf: gopf,
    grave: grave,
    GreaterEqual: GreaterEqual,
    GreaterEqualLess: GreaterEqualLess,
    GreaterFullEqual: GreaterFullEqual,
    GreaterGreater: GreaterGreater,
    GreaterLess: GreaterLess,
    GreaterSlantEqual: GreaterSlantEqual,
    GreaterTilde: GreaterTilde,
    Gscr: Gscr,
    gscr: gscr,
    gsim: gsim,
    gsime: gsime,
    gsiml: gsiml,
    gtcc: gtcc,
    gtcir: gtcir,
    gt: gt,
    GT: GT,
    Gt: Gt,
    gtdot: gtdot,
    gtlPar: gtlPar,
    gtquest: gtquest,
    gtrapprox: gtrapprox,
    gtrarr: gtrarr,
    gtrdot: gtrdot,
    gtreqless: gtreqless,
    gtreqqless: gtreqqless,
    gtrless: gtrless,
    gtrsim: gtrsim,
    gvertneqq: gvertneqq,
    gvnE: gvnE,
    Hacek: Hacek,
    hairsp: hairsp,
    half: half,
    hamilt: hamilt,
    HARDcy: HARDcy,
    hardcy: hardcy,
    harrcir: harrcir,
    harr: harr,
    hArr: hArr,
    harrw: harrw,
    Hat: Hat,
    hbar: hbar,
    Hcirc: Hcirc,
    hcirc: hcirc,
    hearts: hearts,
    heartsuit: heartsuit,
    hellip: hellip,
    hercon: hercon,
    hfr: hfr,
    Hfr: Hfr,
    HilbertSpace: HilbertSpace,
    hksearow: hksearow,
    hkswarow: hkswarow,
    hoarr: hoarr,
    homtht: homtht,
    hookleftarrow: hookleftarrow,
    hookrightarrow: hookrightarrow,
    hopf: hopf,
    Hopf: Hopf,
    horbar: horbar,
    HorizontalLine: HorizontalLine,
    hscr: hscr,
    Hscr: Hscr,
    hslash: hslash,
    Hstrok: Hstrok,
    hstrok: hstrok,
    HumpDownHump: HumpDownHump,
    HumpEqual: HumpEqual,
    hybull: hybull,
    hyphen: hyphen,
    Iacute: Iacute,
    iacute: iacute,
    ic: ic,
    Icirc: Icirc,
    icirc: icirc,
    Icy: Icy,
    icy: icy,
    Idot: Idot,
    IEcy: IEcy,
    iecy: iecy,
    iexcl: iexcl,
    iff: iff,
    ifr: ifr,
    Ifr: Ifr,
    Igrave: Igrave,
    igrave: igrave,
    ii: ii,
    iiiint: iiiint,
    iiint: iiint,
    iinfin: iinfin,
    iiota: iiota,
    IJlig: IJlig,
    ijlig: ijlig,
    Imacr: Imacr,
    imacr: imacr,
    image: image,
    ImaginaryI: ImaginaryI,
    imagline: imagline,
    imagpart: imagpart,
    imath: imath,
    Im: Im,
    imof: imof,
    imped: imped,
    Implies: Implies,
    incare: incare,
    infin: infin,
    infintie: infintie,
    inodot: inodot,
    intcal: intcal,
    int: int,
    Int: Int,
    integers: integers,
    Integral: Integral,
    intercal: intercal,
    Intersection: Intersection,
    intlarhk: intlarhk,
    intprod: intprod,
    InvisibleComma: InvisibleComma,
    InvisibleTimes: InvisibleTimes,
    IOcy: IOcy,
    iocy: iocy,
    Iogon: Iogon,
    iogon: iogon,
    Iopf: Iopf,
    iopf: iopf,
    Iota: Iota,
    iota: iota,
    iprod: iprod,
    iquest: iquest,
    iscr: iscr,
    Iscr: Iscr,
    isin: isin,
    isindot: isindot,
    isinE: isinE,
    isins: isins,
    isinsv: isinsv,
    isinv: isinv,
    it: it,
    Itilde: Itilde,
    itilde: itilde,
    Iukcy: Iukcy,
    iukcy: iukcy,
    Iuml: Iuml,
    iuml: iuml,
    Jcirc: Jcirc,
    jcirc: jcirc,
    Jcy: Jcy,
    jcy: jcy,
    Jfr: Jfr,
    jfr: jfr,
    jmath: jmath,
    Jopf: Jopf,
    jopf: jopf,
    Jscr: Jscr,
    jscr: jscr,
    Jsercy: Jsercy,
    jsercy: jsercy,
    Jukcy: Jukcy,
    jukcy: jukcy,
    Kappa: Kappa,
    kappa: kappa,
    kappav: kappav,
    Kcedil: Kcedil,
    kcedil: kcedil,
    Kcy: Kcy,
    kcy: kcy,
    Kfr: Kfr,
    kfr: kfr,
    kgreen: kgreen,
    KHcy: KHcy,
    khcy: khcy,
    KJcy: KJcy,
    kjcy: kjcy,
    Kopf: Kopf,
    kopf: kopf,
    Kscr: Kscr,
    kscr: kscr,
    lAarr: lAarr,
    Lacute: Lacute,
    lacute: lacute,
    laemptyv: laemptyv,
    lagran: lagran,
    Lambda: Lambda,
    lambda: lambda,
    lang: lang,
    Lang: Lang,
    langd: langd,
    langle: langle,
    lap: lap,
    Laplacetrf: Laplacetrf,
    laquo: laquo,
    larrb: larrb,
    larrbfs: larrbfs,
    larr: larr,
    Larr: Larr,
    lArr: lArr,
    larrfs: larrfs,
    larrhk: larrhk,
    larrlp: larrlp,
    larrpl: larrpl,
    larrsim: larrsim,
    larrtl: larrtl,
    latail: latail,
    lAtail: lAtail,
    lat: lat,
    late: late,
    lates: lates,
    lbarr: lbarr,
    lBarr: lBarr,
    lbbrk: lbbrk,
    lbrace: lbrace,
    lbrack: lbrack,
    lbrke: lbrke,
    lbrksld: lbrksld,
    lbrkslu: lbrkslu,
    Lcaron: Lcaron,
    lcaron: lcaron,
    Lcedil: Lcedil,
    lcedil: lcedil,
    lceil: lceil,
    lcub: lcub,
    Lcy: Lcy,
    lcy: lcy,
    ldca: ldca,
    ldquo: ldquo,
    ldquor: ldquor,
    ldrdhar: ldrdhar,
    ldrushar: ldrushar,
    ldsh: ldsh,
    le: le,
    lE: lE,
    LeftAngleBracket: LeftAngleBracket,
    LeftArrowBar: LeftArrowBar,
    leftarrow: leftarrow,
    LeftArrow: LeftArrow,
    Leftarrow: Leftarrow,
    LeftArrowRightArrow: LeftArrowRightArrow,
    leftarrowtail: leftarrowtail,
    LeftCeiling: LeftCeiling,
    LeftDoubleBracket: LeftDoubleBracket,
    LeftDownTeeVector: LeftDownTeeVector,
    LeftDownVectorBar: LeftDownVectorBar,
    LeftDownVector: LeftDownVector,
    LeftFloor: LeftFloor,
    leftharpoondown: leftharpoondown,
    leftharpoonup: leftharpoonup,
    leftleftarrows: leftleftarrows,
    leftrightarrow: leftrightarrow,
    LeftRightArrow: LeftRightArrow,
    Leftrightarrow: Leftrightarrow,
    leftrightarrows: leftrightarrows,
    leftrightharpoons: leftrightharpoons,
    leftrightsquigarrow: leftrightsquigarrow,
    LeftRightVector: LeftRightVector,
    LeftTeeArrow: LeftTeeArrow,
    LeftTee: LeftTee,
    LeftTeeVector: LeftTeeVector,
    leftthreetimes: leftthreetimes,
    LeftTriangleBar: LeftTriangleBar,
    LeftTriangle: LeftTriangle,
    LeftTriangleEqual: LeftTriangleEqual,
    LeftUpDownVector: LeftUpDownVector,
    LeftUpTeeVector: LeftUpTeeVector,
    LeftUpVectorBar: LeftUpVectorBar,
    LeftUpVector: LeftUpVector,
    LeftVectorBar: LeftVectorBar,
    LeftVector: LeftVector,
    lEg: lEg,
    leg: leg,
    leq: leq,
    leqq: leqq,
    leqslant: leqslant,
    lescc: lescc,
    les: les,
    lesdot: lesdot,
    lesdoto: lesdoto,
    lesdotor: lesdotor,
    lesg: lesg,
    lesges: lesges,
    lessapprox: lessapprox,
    lessdot: lessdot,
    lesseqgtr: lesseqgtr,
    lesseqqgtr: lesseqqgtr,
    LessEqualGreater: LessEqualGreater,
    LessFullEqual: LessFullEqual,
    LessGreater: LessGreater,
    lessgtr: lessgtr,
    LessLess: LessLess,
    lesssim: lesssim,
    LessSlantEqual: LessSlantEqual,
    LessTilde: LessTilde,
    lfisht: lfisht,
    lfloor: lfloor,
    Lfr: Lfr,
    lfr: lfr,
    lg: lg,
    lgE: lgE,
    lHar: lHar,
    lhard: lhard,
    lharu: lharu,
    lharul: lharul,
    lhblk: lhblk,
    LJcy: LJcy,
    ljcy: ljcy,
    llarr: llarr,
    ll: ll,
    Ll: Ll,
    llcorner: llcorner,
    Lleftarrow: Lleftarrow,
    llhard: llhard,
    lltri: lltri,
    Lmidot: Lmidot,
    lmidot: lmidot,
    lmoustache: lmoustache,
    lmoust: lmoust,
    lnap: lnap,
    lnapprox: lnapprox,
    lne: lne,
    lnE: lnE,
    lneq: lneq,
    lneqq: lneqq,
    lnsim: lnsim,
    loang: loang,
    loarr: loarr,
    lobrk: lobrk,
    longleftarrow: longleftarrow,
    LongLeftArrow: LongLeftArrow,
    Longleftarrow: Longleftarrow,
    longleftrightarrow: longleftrightarrow,
    LongLeftRightArrow: LongLeftRightArrow,
    Longleftrightarrow: Longleftrightarrow,
    longmapsto: longmapsto,
    longrightarrow: longrightarrow,
    LongRightArrow: LongRightArrow,
    Longrightarrow: Longrightarrow,
    looparrowleft: looparrowleft,
    looparrowright: looparrowright,
    lopar: lopar,
    Lopf: Lopf,
    lopf: lopf,
    loplus: loplus,
    lotimes: lotimes,
    lowast: lowast,
    lowbar: lowbar,
    LowerLeftArrow: LowerLeftArrow,
    LowerRightArrow: LowerRightArrow,
    loz: loz,
    lozenge: lozenge,
    lozf: lozf,
    lpar: lpar,
    lparlt: lparlt,
    lrarr: lrarr,
    lrcorner: lrcorner,
    lrhar: lrhar,
    lrhard: lrhard,
    lrm: lrm,
    lrtri: lrtri,
    lsaquo: lsaquo,
    lscr: lscr,
    Lscr: Lscr,
    lsh: lsh,
    Lsh: Lsh,
    lsim: lsim,
    lsime: lsime,
    lsimg: lsimg,
    lsqb: lsqb,
    lsquo: lsquo,
    lsquor: lsquor,
    Lstrok: Lstrok,
    lstrok: lstrok,
    ltcc: ltcc,
    ltcir: ltcir,
    lt: lt,
    LT: LT,
    Lt: Lt,
    ltdot: ltdot,
    lthree: lthree,
    ltimes: ltimes,
    ltlarr: ltlarr,
    ltquest: ltquest,
    ltri: ltri,
    ltrie: ltrie,
    ltrif: ltrif,
    ltrPar: ltrPar,
    lurdshar: lurdshar,
    luruhar: luruhar,
    lvertneqq: lvertneqq,
    lvnE: lvnE,
    macr: macr,
    male: male,
    malt: malt,
    maltese: maltese,
    map: map,
    mapsto: mapsto,
    mapstodown: mapstodown,
    mapstoleft: mapstoleft,
    mapstoup: mapstoup,
    marker: marker,
    mcomma: mcomma,
    Mcy: Mcy,
    mcy: mcy,
    mdash: mdash,
    mDDot: mDDot,
    measuredangle: measuredangle,
    MediumSpace: MediumSpace,
    Mellintrf: Mellintrf,
    Mfr: Mfr,
    mfr: mfr,
    mho: mho,
    micro: micro,
    midast: midast,
    midcir: midcir,
    mid: mid,
    middot: middot,
    minusb: minusb,
    minus: minus,
    minusd: minusd,
    minusdu: minusdu,
    MinusPlus: MinusPlus,
    mlcp: mlcp,
    mldr: mldr,
    mnplus: mnplus,
    models: models,
    Mopf: Mopf,
    mopf: mopf,
    mp: mp,
    mscr: mscr,
    Mscr: Mscr,
    mstpos: mstpos,
    Mu: Mu,
    mu: mu,
    multimap: multimap,
    mumap: mumap,
    nabla: nabla,
    Nacute: Nacute,
    nacute: nacute,
    nang: nang,
    nap: nap,
    napE: napE,
    napid: napid,
    napos: napos,
    napprox: napprox,
    natural: natural,
    naturals: naturals,
    natur: natur,
    nbsp: nbsp,
    nbump: nbump,
    nbumpe: nbumpe,
    ncap: ncap,
    Ncaron: Ncaron,
    ncaron: ncaron,
    Ncedil: Ncedil,
    ncedil: ncedil,
    ncong: ncong,
    ncongdot: ncongdot,
    ncup: ncup,
    Ncy: Ncy,
    ncy: ncy,
    ndash: ndash,
    nearhk: nearhk,
    nearr: nearr,
    neArr: neArr,
    nearrow: nearrow,
    ne: ne,
    nedot: nedot,
    NegativeMediumSpace: NegativeMediumSpace,
    NegativeThickSpace: NegativeThickSpace,
    NegativeThinSpace: NegativeThinSpace,
    NegativeVeryThinSpace: NegativeVeryThinSpace,
    nequiv: nequiv,
    nesear: nesear,
    nesim: nesim,
    NestedGreaterGreater: NestedGreaterGreater,
    NestedLessLess: NestedLessLess,
    NewLine: NewLine,
    nexist: nexist,
    nexists: nexists,
    Nfr: Nfr,
    nfr: nfr,
    ngE: ngE,
    nge: nge,
    ngeq: ngeq,
    ngeqq: ngeqq,
    ngeqslant: ngeqslant,
    nges: nges,
    nGg: nGg,
    ngsim: ngsim,
    nGt: nGt,
    ngt: ngt,
    ngtr: ngtr,
    nGtv: nGtv,
    nharr: nharr,
    nhArr: nhArr,
    nhpar: nhpar,
    ni: ni,
    nis: nis,
    nisd: nisd,
    niv: niv,
    NJcy: NJcy,
    njcy: njcy,
    nlarr: nlarr,
    nlArr: nlArr,
    nldr: nldr,
    nlE: nlE,
    nle: nle,
    nleftarrow: nleftarrow,
    nLeftarrow: nLeftarrow,
    nleftrightarrow: nleftrightarrow,
    nLeftrightarrow: nLeftrightarrow,
    nleq: nleq,
    nleqq: nleqq,
    nleqslant: nleqslant,
    nles: nles,
    nless: nless,
    nLl: nLl,
    nlsim: nlsim,
    nLt: nLt,
    nlt: nlt,
    nltri: nltri,
    nltrie: nltrie,
    nLtv: nLtv,
    nmid: nmid,
    NoBreak: NoBreak,
    NonBreakingSpace: NonBreakingSpace,
    nopf: nopf,
    Nopf: Nopf,
    Not: Not,
    not: not,
    NotCongruent: NotCongruent,
    NotCupCap: NotCupCap,
    NotDoubleVerticalBar: NotDoubleVerticalBar,
    NotElement: NotElement,
    NotEqual: NotEqual,
    NotEqualTilde: NotEqualTilde,
    NotExists: NotExists,
    NotGreater: NotGreater,
    NotGreaterEqual: NotGreaterEqual,
    NotGreaterFullEqual: NotGreaterFullEqual,
    NotGreaterGreater: NotGreaterGreater,
    NotGreaterLess: NotGreaterLess,
    NotGreaterSlantEqual: NotGreaterSlantEqual,
    NotGreaterTilde: NotGreaterTilde,
    NotHumpDownHump: NotHumpDownHump,
    NotHumpEqual: NotHumpEqual,
    notin: notin,
    notindot: notindot,
    notinE: notinE,
    notinva: notinva,
    notinvb: notinvb,
    notinvc: notinvc,
    NotLeftTriangleBar: NotLeftTriangleBar,
    NotLeftTriangle: NotLeftTriangle,
    NotLeftTriangleEqual: NotLeftTriangleEqual,
    NotLess: NotLess,
    NotLessEqual: NotLessEqual,
    NotLessGreater: NotLessGreater,
    NotLessLess: NotLessLess,
    NotLessSlantEqual: NotLessSlantEqual,
    NotLessTilde: NotLessTilde,
    NotNestedGreaterGreater: NotNestedGreaterGreater,
    NotNestedLessLess: NotNestedLessLess,
    notni: notni,
    notniva: notniva,
    notnivb: notnivb,
    notnivc: notnivc,
    NotPrecedes: NotPrecedes,
    NotPrecedesEqual: NotPrecedesEqual,
    NotPrecedesSlantEqual: NotPrecedesSlantEqual,
    NotReverseElement: NotReverseElement,
    NotRightTriangleBar: NotRightTriangleBar,
    NotRightTriangle: NotRightTriangle,
    NotRightTriangleEqual: NotRightTriangleEqual,
    NotSquareSubset: NotSquareSubset,
    NotSquareSubsetEqual: NotSquareSubsetEqual,
    NotSquareSuperset: NotSquareSuperset,
    NotSquareSupersetEqual: NotSquareSupersetEqual,
    NotSubset: NotSubset,
    NotSubsetEqual: NotSubsetEqual,
    NotSucceeds: NotSucceeds,
    NotSucceedsEqual: NotSucceedsEqual,
    NotSucceedsSlantEqual: NotSucceedsSlantEqual,
    NotSucceedsTilde: NotSucceedsTilde,
    NotSuperset: NotSuperset,
    NotSupersetEqual: NotSupersetEqual,
    NotTilde: NotTilde,
    NotTildeEqual: NotTildeEqual,
    NotTildeFullEqual: NotTildeFullEqual,
    NotTildeTilde: NotTildeTilde,
    NotVerticalBar: NotVerticalBar,
    nparallel: nparallel,
    npar: npar,
    nparsl: nparsl,
    npart: npart,
    npolint: npolint,
    npr: npr,
    nprcue: nprcue,
    nprec: nprec,
    npreceq: npreceq,
    npre: npre,
    nrarrc: nrarrc,
    nrarr: nrarr,
    nrArr: nrArr,
    nrarrw: nrarrw,
    nrightarrow: nrightarrow,
    nRightarrow: nRightarrow,
    nrtri: nrtri,
    nrtrie: nrtrie,
    nsc: nsc,
    nsccue: nsccue,
    nsce: nsce,
    Nscr: Nscr,
    nscr: nscr,
    nshortmid: nshortmid,
    nshortparallel: nshortparallel,
    nsim: nsim,
    nsime: nsime,
    nsimeq: nsimeq,
    nsmid: nsmid,
    nspar: nspar,
    nsqsube: nsqsube,
    nsqsupe: nsqsupe,
    nsub: nsub,
    nsubE: nsubE,
    nsube: nsube,
    nsubset: nsubset,
    nsubseteq: nsubseteq,
    nsubseteqq: nsubseteqq,
    nsucc: nsucc,
    nsucceq: nsucceq,
    nsup: nsup,
    nsupE: nsupE,
    nsupe: nsupe,
    nsupset: nsupset,
    nsupseteq: nsupseteq,
    nsupseteqq: nsupseteqq,
    ntgl: ntgl,
    Ntilde: Ntilde,
    ntilde: ntilde,
    ntlg: ntlg,
    ntriangleleft: ntriangleleft,
    ntrianglelefteq: ntrianglelefteq,
    ntriangleright: ntriangleright,
    ntrianglerighteq: ntrianglerighteq,
    Nu: Nu,
    nu: nu,
    num: num,
    numero: numero,
    numsp: numsp,
    nvap: nvap,
    nvdash: nvdash,
    nvDash: nvDash,
    nVdash: nVdash,
    nVDash: nVDash,
    nvge: nvge,
    nvgt: nvgt,
    nvHarr: nvHarr,
    nvinfin: nvinfin,
    nvlArr: nvlArr,
    nvle: nvle,
    nvlt: nvlt,
    nvltrie: nvltrie,
    nvrArr: nvrArr,
    nvrtrie: nvrtrie,
    nvsim: nvsim,
    nwarhk: nwarhk,
    nwarr: nwarr,
    nwArr: nwArr,
    nwarrow: nwarrow,
    nwnear: nwnear,
    Oacute: Oacute,
    oacute: oacute,
    oast: oast,
    Ocirc: Ocirc,
    ocirc: ocirc,
    ocir: ocir,
    Ocy: Ocy,
    ocy: ocy,
    odash: odash,
    Odblac: Odblac,
    odblac: odblac,
    odiv: odiv,
    odot: odot,
    odsold: odsold,
    OElig: OElig,
    oelig: oelig,
    ofcir: ofcir,
    Ofr: Ofr,
    ofr: ofr,
    ogon: ogon,
    Ograve: Ograve,
    ograve: ograve,
    ogt: ogt,
    ohbar: ohbar,
    ohm: ohm,
    oint: oint,
    olarr: olarr,
    olcir: olcir,
    olcross: olcross,
    oline: oline,
    olt: olt,
    Omacr: Omacr,
    omacr: omacr,
    Omega: Omega,
    omega: omega,
    Omicron: Omicron,
    omicron: omicron,
    omid: omid,
    ominus: ominus,
    Oopf: Oopf,
    oopf: oopf,
    opar: opar,
    OpenCurlyDoubleQuote: OpenCurlyDoubleQuote,
    OpenCurlyQuote: OpenCurlyQuote,
    operp: operp,
    oplus: oplus,
    orarr: orarr,
    Or: Or,
    or: or,
    ord: ord,
    order: order,
    orderof: orderof,
    ordf: ordf,
    ordm: ordm,
    origof: origof,
    oror: oror,
    orslope: orslope,
    orv: orv,
    oS: oS,
    Oscr: Oscr,
    oscr: oscr,
    Oslash: Oslash,
    oslash: oslash,
    osol: osol,
    Otilde: Otilde,
    otilde: otilde,
    otimesas: otimesas,
    Otimes: Otimes,
    otimes: otimes,
    Ouml: Ouml,
    ouml: ouml,
    ovbar: ovbar,
    OverBar: OverBar,
    OverBrace: OverBrace,
    OverBracket: OverBracket,
    OverParenthesis: OverParenthesis,
    para: para,
    parallel: parallel,
    par: par,
    parsim: parsim,
    parsl: parsl,
    part: part,
    PartialD: PartialD,
    Pcy: Pcy,
    pcy: pcy,
    percnt: percnt,
    period: period,
    permil: permil,
    perp: perp,
    pertenk: pertenk,
    Pfr: Pfr,
    pfr: pfr,
    Phi: Phi,
    phi: phi,
    phiv: phiv,
    phmmat: phmmat,
    phone: phone,
    Pi: Pi,
    pi: pi,
    pitchfork: pitchfork,
    piv: piv,
    planck: planck,
    planckh: planckh,
    plankv: plankv,
    plusacir: plusacir,
    plusb: plusb,
    pluscir: pluscir,
    plus: plus,
    plusdo: plusdo,
    plusdu: plusdu,
    pluse: pluse,
    PlusMinus: PlusMinus,
    plusmn: plusmn,
    plussim: plussim,
    plustwo: plustwo,
    pm: pm,
    Poincareplane: Poincareplane,
    pointint: pointint,
    popf: popf,
    Popf: Popf,
    pound: pound,
    prap: prap,
    Pr: Pr,
    pr: pr,
    prcue: prcue,
    precapprox: precapprox,
    prec: prec,
    preccurlyeq: preccurlyeq,
    Precedes: Precedes,
    PrecedesEqual: PrecedesEqual,
    PrecedesSlantEqual: PrecedesSlantEqual,
    PrecedesTilde: PrecedesTilde,
    preceq: preceq,
    precnapprox: precnapprox,
    precneqq: precneqq,
    precnsim: precnsim,
    pre: pre,
    prE: prE,
    precsim: precsim,
    prime: prime,
    Prime: Prime,
    primes: primes,
    prnap: prnap,
    prnE: prnE,
    prnsim: prnsim,
    prod: prod,
    Product: Product,
    profalar: profalar,
    profline: profline,
    profsurf: profsurf,
    prop: prop,
    Proportional: Proportional,
    Proportion: Proportion,
    propto: propto,
    prsim: prsim,
    prurel: prurel,
    Pscr: Pscr,
    pscr: pscr,
    Psi: Psi,
    psi: psi,
    puncsp: puncsp,
    Qfr: Qfr,
    qfr: qfr,
    qint: qint,
    qopf: qopf,
    Qopf: Qopf,
    qprime: qprime,
    Qscr: Qscr,
    qscr: qscr,
    quaternions: quaternions,
    quatint: quatint,
    quest: quest,
    questeq: questeq,
    quot: quot,
    QUOT: QUOT,
    rAarr: rAarr,
    race: race,
    Racute: Racute,
    racute: racute,
    radic: radic,
    raemptyv: raemptyv,
    rang: rang,
    Rang: Rang,
    rangd: rangd,
    range: range,
    rangle: rangle,
    raquo: raquo,
    rarrap: rarrap,
    rarrb: rarrb,
    rarrbfs: rarrbfs,
    rarrc: rarrc,
    rarr: rarr,
    Rarr: Rarr,
    rArr: rArr,
    rarrfs: rarrfs,
    rarrhk: rarrhk,
    rarrlp: rarrlp,
    rarrpl: rarrpl,
    rarrsim: rarrsim,
    Rarrtl: Rarrtl,
    rarrtl: rarrtl,
    rarrw: rarrw,
    ratail: ratail,
    rAtail: rAtail,
    ratio: ratio,
    rationals: rationals,
    rbarr: rbarr,
    rBarr: rBarr,
    RBarr: RBarr,
    rbbrk: rbbrk,
    rbrace: rbrace,
    rbrack: rbrack,
    rbrke: rbrke,
    rbrksld: rbrksld,
    rbrkslu: rbrkslu,
    Rcaron: Rcaron,
    rcaron: rcaron,
    Rcedil: Rcedil,
    rcedil: rcedil,
    rceil: rceil,
    rcub: rcub,
    Rcy: Rcy,
    rcy: rcy,
    rdca: rdca,
    rdldhar: rdldhar,
    rdquo: rdquo,
    rdquor: rdquor,
    rdsh: rdsh,
    real: real,
    realine: realine,
    realpart: realpart,
    reals: reals,
    Re: Re,
    rect: rect,
    reg: reg,
    REG: REG,
    ReverseElement: ReverseElement,
    ReverseEquilibrium: ReverseEquilibrium,
    ReverseUpEquilibrium: ReverseUpEquilibrium,
    rfisht: rfisht,
    rfloor: rfloor,
    rfr: rfr,
    Rfr: Rfr,
    rHar: rHar,
    rhard: rhard,
    rharu: rharu,
    rharul: rharul,
    Rho: Rho,
    rho: rho,
    rhov: rhov,
    RightAngleBracket: RightAngleBracket,
    RightArrowBar: RightArrowBar,
    rightarrow: rightarrow,
    RightArrow: RightArrow,
    Rightarrow: Rightarrow,
    RightArrowLeftArrow: RightArrowLeftArrow,
    rightarrowtail: rightarrowtail,
    RightCeiling: RightCeiling,
    RightDoubleBracket: RightDoubleBracket,
    RightDownTeeVector: RightDownTeeVector,
    RightDownVectorBar: RightDownVectorBar,
    RightDownVector: RightDownVector,
    RightFloor: RightFloor,
    rightharpoondown: rightharpoondown,
    rightharpoonup: rightharpoonup,
    rightleftarrows: rightleftarrows,
    rightleftharpoons: rightleftharpoons,
    rightrightarrows: rightrightarrows,
    rightsquigarrow: rightsquigarrow,
    RightTeeArrow: RightTeeArrow,
    RightTee: RightTee,
    RightTeeVector: RightTeeVector,
    rightthreetimes: rightthreetimes,
    RightTriangleBar: RightTriangleBar,
    RightTriangle: RightTriangle,
    RightTriangleEqual: RightTriangleEqual,
    RightUpDownVector: RightUpDownVector,
    RightUpTeeVector: RightUpTeeVector,
    RightUpVectorBar: RightUpVectorBar,
    RightUpVector: RightUpVector,
    RightVectorBar: RightVectorBar,
    RightVector: RightVector,
    ring: ring,
    risingdotseq: risingdotseq,
    rlarr: rlarr,
    rlhar: rlhar,
    rlm: rlm,
    rmoustache: rmoustache,
    rmoust: rmoust,
    rnmid: rnmid,
    roang: roang,
    roarr: roarr,
    robrk: robrk,
    ropar: ropar,
    ropf: ropf,
    Ropf: Ropf,
    roplus: roplus,
    rotimes: rotimes,
    RoundImplies: RoundImplies,
    rpar: rpar,
    rpargt: rpargt,
    rppolint: rppolint,
    rrarr: rrarr,
    Rrightarrow: Rrightarrow,
    rsaquo: rsaquo,
    rscr: rscr,
    Rscr: Rscr,
    rsh: rsh,
    Rsh: Rsh,
    rsqb: rsqb,
    rsquo: rsquo,
    rsquor: rsquor,
    rthree: rthree,
    rtimes: rtimes,
    rtri: rtri,
    rtrie: rtrie,
    rtrif: rtrif,
    rtriltri: rtriltri,
    RuleDelayed: RuleDelayed,
    ruluhar: ruluhar,
    rx: rx,
    Sacute: Sacute,
    sacute: sacute,
    sbquo: sbquo,
    scap: scap,
    Scaron: Scaron,
    scaron: scaron,
    Sc: Sc,
    sc: sc,
    sccue: sccue,
    sce: sce,
    scE: scE,
    Scedil: Scedil,
    scedil: scedil,
    Scirc: Scirc,
    scirc: scirc,
    scnap: scnap,
    scnE: scnE,
    scnsim: scnsim,
    scpolint: scpolint,
    scsim: scsim,
    Scy: Scy,
    scy: scy,
    sdotb: sdotb,
    sdot: sdot,
    sdote: sdote,
    searhk: searhk,
    searr: searr,
    seArr: seArr,
    searrow: searrow,
    sect: sect,
    semi: semi,
    seswar: seswar,
    setminus: setminus,
    setmn: setmn,
    sext: sext,
    Sfr: Sfr,
    sfr: sfr,
    sfrown: sfrown,
    sharp: sharp,
    SHCHcy: SHCHcy,
    shchcy: shchcy,
    SHcy: SHcy,
    shcy: shcy,
    ShortDownArrow: ShortDownArrow,
    ShortLeftArrow: ShortLeftArrow,
    shortmid: shortmid,
    shortparallel: shortparallel,
    ShortRightArrow: ShortRightArrow,
    ShortUpArrow: ShortUpArrow,
    shy: shy,
    Sigma: Sigma,
    sigma: sigma,
    sigmaf: sigmaf,
    sigmav: sigmav,
    sim: sim,
    simdot: simdot,
    sime: sime,
    simeq: simeq,
    simg: simg,
    simgE: simgE,
    siml: siml,
    simlE: simlE,
    simne: simne,
    simplus: simplus,
    simrarr: simrarr,
    slarr: slarr,
    SmallCircle: SmallCircle,
    smallsetminus: smallsetminus,
    smashp: smashp,
    smeparsl: smeparsl,
    smid: smid,
    smile: smile,
    smt: smt,
    smte: smte,
    smtes: smtes,
    SOFTcy: SOFTcy,
    softcy: softcy,
    solbar: solbar,
    solb: solb,
    sol: sol,
    Sopf: Sopf,
    sopf: sopf,
    spades: spades,
    spadesuit: spadesuit,
    spar: spar,
    sqcap: sqcap,
    sqcaps: sqcaps,
    sqcup: sqcup,
    sqcups: sqcups,
    Sqrt: Sqrt,
    sqsub: sqsub,
    sqsube: sqsube,
    sqsubset: sqsubset,
    sqsubseteq: sqsubseteq,
    sqsup: sqsup,
    sqsupe: sqsupe,
    sqsupset: sqsupset,
    sqsupseteq: sqsupseteq,
    square: square,
    Square: Square,
    SquareIntersection: SquareIntersection,
    SquareSubset: SquareSubset,
    SquareSubsetEqual: SquareSubsetEqual,
    SquareSuperset: SquareSuperset,
    SquareSupersetEqual: SquareSupersetEqual,
    SquareUnion: SquareUnion,
    squarf: squarf,
    squ: squ,
    squf: squf,
    srarr: srarr,
    Sscr: Sscr,
    sscr: sscr,
    ssetmn: ssetmn,
    ssmile: ssmile,
    sstarf: sstarf,
    Star: Star,
    star: star,
    starf: starf,
    straightepsilon: straightepsilon,
    straightphi: straightphi,
    strns: strns,
    sub: sub$1,
    Sub: Sub,
    subdot: subdot,
    subE: subE,
    sube: sube,
    subedot: subedot,
    submult: submult,
    subnE: subnE,
    subne: subne,
    subplus: subplus,
    subrarr: subrarr,
    subset: subset,
    Subset: Subset,
    subseteq: subseteq,
    subseteqq: subseteqq,
    SubsetEqual: SubsetEqual,
    subsetneq: subsetneq,
    subsetneqq: subsetneqq,
    subsim: subsim,
    subsub: subsub,
    subsup: subsup,
    succapprox: succapprox,
    succ: succ,
    succcurlyeq: succcurlyeq,
    Succeeds: Succeeds,
    SucceedsEqual: SucceedsEqual,
    SucceedsSlantEqual: SucceedsSlantEqual,
    SucceedsTilde: SucceedsTilde,
    succeq: succeq,
    succnapprox: succnapprox,
    succneqq: succneqq,
    succnsim: succnsim,
    succsim: succsim,
    SuchThat: SuchThat,
    sum: sum,
    Sum: Sum,
    sung: sung,
    sup1: sup1,
    sup2: sup2,
    sup3: sup3,
    sup: sup,
    Sup: Sup,
    supdot: supdot,
    supdsub: supdsub,
    supE: supE,
    supe: supe,
    supedot: supedot,
    Superset: Superset,
    SupersetEqual: SupersetEqual,
    suphsol: suphsol,
    suphsub: suphsub,
    suplarr: suplarr,
    supmult: supmult,
    supnE: supnE,
    supne: supne,
    supplus: supplus,
    supset: supset,
    Supset: Supset,
    supseteq: supseteq,
    supseteqq: supseteqq,
    supsetneq: supsetneq,
    supsetneqq: supsetneqq,
    supsim: supsim,
    supsub: supsub,
    supsup: supsup,
    swarhk: swarhk,
    swarr: swarr,
    swArr: swArr,
    swarrow: swarrow,
    swnwar: swnwar,
    szlig: szlig,
    Tab: Tab,
    target: target,
    Tau: Tau,
    tau: tau,
    tbrk: tbrk,
    Tcaron: Tcaron,
    tcaron: tcaron,
    Tcedil: Tcedil,
    tcedil: tcedil,
    Tcy: Tcy,
    tcy: tcy,
    tdot: tdot,
    telrec: telrec,
    Tfr: Tfr,
    tfr: tfr,
    there4: there4,
    therefore: therefore,
    Therefore: Therefore,
    Theta: Theta,
    theta: theta,
    thetasym: thetasym,
    thetav: thetav,
    thickapprox: thickapprox,
    thicksim: thicksim,
    ThickSpace: ThickSpace,
    ThinSpace: ThinSpace,
    thinsp: thinsp,
    thkap: thkap,
    thksim: thksim,
    THORN: THORN,
    thorn: thorn,
    tilde: tilde,
    Tilde: Tilde,
    TildeEqual: TildeEqual,
    TildeFullEqual: TildeFullEqual,
    TildeTilde: TildeTilde,
    timesbar: timesbar,
    timesb: timesb,
    times: times,
    timesd: timesd,
    tint: tint,
    toea: toea,
    topbot: topbot,
    topcir: topcir,
    top: top,
    Topf: Topf,
    topf: topf,
    topfork: topfork,
    tosa: tosa,
    tprime: tprime,
    trade: trade,
    TRADE: TRADE,
    triangle: triangle,
    triangledown: triangledown,
    triangleleft: triangleleft,
    trianglelefteq: trianglelefteq,
    triangleq: triangleq,
    triangleright: triangleright,
    trianglerighteq: trianglerighteq,
    tridot: tridot,
    trie: trie,
    triminus: triminus,
    TripleDot: TripleDot,
    triplus: triplus,
    trisb: trisb,
    tritime: tritime,
    trpezium: trpezium,
    Tscr: Tscr,
    tscr: tscr,
    TScy: TScy,
    tscy: tscy,
    TSHcy: TSHcy,
    tshcy: tshcy,
    Tstrok: Tstrok,
    tstrok: tstrok,
    twixt: twixt,
    twoheadleftarrow: twoheadleftarrow,
    twoheadrightarrow: twoheadrightarrow,
    Uacute: Uacute,
    uacute: uacute,
    uarr: uarr,
    Uarr: Uarr,
    uArr: uArr,
    Uarrocir: Uarrocir,
    Ubrcy: Ubrcy,
    ubrcy: ubrcy,
    Ubreve: Ubreve,
    ubreve: ubreve,
    Ucirc: Ucirc,
    ucirc: ucirc,
    Ucy: Ucy,
    ucy: ucy,
    udarr: udarr,
    Udblac: Udblac,
    udblac: udblac,
    udhar: udhar,
    ufisht: ufisht,
    Ufr: Ufr,
    ufr: ufr,
    Ugrave: Ugrave,
    ugrave: ugrave,
    uHar: uHar,
    uharl: uharl,
    uharr: uharr,
    uhblk: uhblk,
    ulcorn: ulcorn,
    ulcorner: ulcorner,
    ulcrop: ulcrop,
    ultri: ultri,
    Umacr: Umacr,
    umacr: umacr,
    uml: uml,
    UnderBar: UnderBar,
    UnderBrace: UnderBrace,
    UnderBracket: UnderBracket,
    UnderParenthesis: UnderParenthesis,
    Union: Union,
    UnionPlus: UnionPlus,
    Uogon: Uogon,
    uogon: uogon,
    Uopf: Uopf,
    uopf: uopf,
    UpArrowBar: UpArrowBar,
    uparrow: uparrow,
    UpArrow: UpArrow,
    Uparrow: Uparrow,
    UpArrowDownArrow: UpArrowDownArrow,
    updownarrow: updownarrow,
    UpDownArrow: UpDownArrow,
    Updownarrow: Updownarrow,
    UpEquilibrium: UpEquilibrium,
    upharpoonleft: upharpoonleft,
    upharpoonright: upharpoonright,
    uplus: uplus,
    UpperLeftArrow: UpperLeftArrow,
    UpperRightArrow: UpperRightArrow,
    upsi: upsi,
    Upsi: Upsi,
    upsih: upsih,
    Upsilon: Upsilon,
    upsilon: upsilon,
    UpTeeArrow: UpTeeArrow,
    UpTee: UpTee,
    upuparrows: upuparrows,
    urcorn: urcorn,
    urcorner: urcorner,
    urcrop: urcrop,
    Uring: Uring,
    uring: uring,
    urtri: urtri,
    Uscr: Uscr,
    uscr: uscr,
    utdot: utdot,
    Utilde: Utilde,
    utilde: utilde,
    utri: utri,
    utrif: utrif,
    uuarr: uuarr,
    Uuml: Uuml,
    uuml: uuml,
    uwangle: uwangle,
    vangrt: vangrt,
    varepsilon: varepsilon,
    varkappa: varkappa,
    varnothing: varnothing,
    varphi: varphi,
    varpi: varpi,
    varpropto: varpropto,
    varr: varr,
    vArr: vArr,
    varrho: varrho,
    varsigma: varsigma,
    varsubsetneq: varsubsetneq,
    varsubsetneqq: varsubsetneqq,
    varsupsetneq: varsupsetneq,
    varsupsetneqq: varsupsetneqq,
    vartheta: vartheta,
    vartriangleleft: vartriangleleft,
    vartriangleright: vartriangleright,
    vBar: vBar,
    Vbar: Vbar,
    vBarv: vBarv,
    Vcy: Vcy,
    vcy: vcy,
    vdash: vdash,
    vDash: vDash,
    Vdash: Vdash,
    VDash: VDash,
    Vdashl: Vdashl,
    veebar: veebar,
    vee: vee,
    Vee: Vee,
    veeeq: veeeq,
    vellip: vellip,
    verbar: verbar,
    Verbar: Verbar,
    vert: vert,
    Vert: Vert,
    VerticalBar: VerticalBar,
    VerticalLine: VerticalLine,
    VerticalSeparator: VerticalSeparator,
    VerticalTilde: VerticalTilde,
    VeryThinSpace: VeryThinSpace,
    Vfr: Vfr,
    vfr: vfr,
    vltri: vltri,
    vnsub: vnsub,
    vnsup: vnsup,
    Vopf: Vopf,
    vopf: vopf,
    vprop: vprop,
    vrtri: vrtri,
    Vscr: Vscr,
    vscr: vscr,
    vsubnE: vsubnE,
    vsubne: vsubne,
    vsupnE: vsupnE,
    vsupne: vsupne,
    Vvdash: Vvdash,
    vzigzag: vzigzag,
    Wcirc: Wcirc,
    wcirc: wcirc,
    wedbar: wedbar,
    wedge: wedge,
    Wedge: Wedge,
    wedgeq: wedgeq,
    weierp: weierp,
    Wfr: Wfr,
    wfr: wfr,
    Wopf: Wopf,
    wopf: wopf,
    wp: wp,
    wr: wr,
    wreath: wreath,
    Wscr: Wscr,
    wscr: wscr,
    xcap: xcap,
    xcirc: xcirc,
    xcup: xcup,
    xdtri: xdtri,
    Xfr: Xfr,
    xfr: xfr,
    xharr: xharr,
    xhArr: xhArr,
    Xi: Xi,
    xi: xi,
    xlarr: xlarr,
    xlArr: xlArr,
    xmap: xmap,
    xnis: xnis,
    xodot: xodot,
    Xopf: Xopf,
    xopf: xopf,
    xoplus: xoplus,
    xotime: xotime,
    xrarr: xrarr,
    xrArr: xrArr,
    Xscr: Xscr,
    xscr: xscr,
    xsqcup: xsqcup,
    xuplus: xuplus,
    xutri: xutri,
    xvee: xvee,
    xwedge: xwedge,
    Yacute: Yacute,
    yacute: yacute,
    YAcy: YAcy,
    yacy: yacy,
    Ycirc: Ycirc,
    ycirc: ycirc,
    Ycy: Ycy,
    ycy: ycy,
    yen: yen,
    Yfr: Yfr,
    yfr: yfr,
    YIcy: YIcy,
    yicy: yicy,
    Yopf: Yopf,
    yopf: yopf,
    Yscr: Yscr,
    yscr: yscr,
    YUcy: YUcy,
    yucy: yucy,
    yuml: yuml,
    Yuml: Yuml,
    Zacute: Zacute,
    zacute: zacute,
    Zcaron: Zcaron,
    zcaron: zcaron,
    Zcy: Zcy,
    zcy: zcy,
    Zdot: Zdot,
    zdot: zdot,
    zeetrf: zeetrf,
    ZeroWidthSpace: ZeroWidthSpace,
    Zeta: Zeta,
    zeta: zeta,
    zfr: zfr,
    Zfr: Zfr,
    ZHcy: ZHcy,
    zhcy: zhcy,
    zigrarr: zigrarr,
    zopf: zopf,
    Zopf: Zopf,
    Zscr: Zscr,
    zscr: zscr,
    zwj: zwj,
    zwnj: zwnj,
    default: entities
  });

  var Aacute$1 = "Á";
  var aacute$1 = "á";
  var Acirc$1 = "Â";
  var acirc$1 = "â";
  var acute$1 = "´";
  var AElig$1 = "Æ";
  var aelig$1 = "æ";
  var Agrave$1 = "À";
  var agrave$1 = "à";
  var amp$1 = "&";
  var AMP$1 = "&";
  var Aring$1 = "Å";
  var aring$1 = "å";
  var Atilde$1 = "Ã";
  var atilde$1 = "ã";
  var Auml$1 = "Ä";
  var auml$1 = "ä";
  var brvbar$1 = "¦";
  var Ccedil$1 = "Ç";
  var ccedil$1 = "ç";
  var cedil$1 = "¸";
  var cent$1 = "¢";
  var copy$1 = "©";
  var COPY$1 = "©";
  var curren$1 = "¤";
  var deg$1 = "°";
  var divide$2 = "÷";
  var Eacute$1 = "É";
  var eacute$1 = "é";
  var Ecirc$1 = "Ê";
  var ecirc$1 = "ê";
  var Egrave$1 = "È";
  var egrave$1 = "è";
  var ETH$1 = "Ð";
  var eth$1 = "ð";
  var Euml$1 = "Ë";
  var euml$1 = "ë";
  var frac12$1 = "½";
  var frac14$1 = "¼";
  var frac34$1 = "¾";
  var gt$1 = ">";
  var GT$1 = ">";
  var Iacute$1 = "Í";
  var iacute$1 = "í";
  var Icirc$1 = "Î";
  var icirc$1 = "î";
  var iexcl$1 = "¡";
  var Igrave$1 = "Ì";
  var igrave$1 = "ì";
  var iquest$1 = "¿";
  var Iuml$1 = "Ï";
  var iuml$1 = "ï";
  var laquo$1 = "«";
  var lt$1 = "<";
  var LT$1 = "<";
  var macr$1 = "¯";
  var micro$1 = "µ";
  var middot$1 = "·";
  var nbsp$1 = " ";
  var not$1 = "¬";
  var Ntilde$1 = "Ñ";
  var ntilde$1 = "ñ";
  var Oacute$1 = "Ó";
  var oacute$1 = "ó";
  var Ocirc$1 = "Ô";
  var ocirc$1 = "ô";
  var Ograve$1 = "Ò";
  var ograve$1 = "ò";
  var ordf$1 = "ª";
  var ordm$1 = "º";
  var Oslash$1 = "Ø";
  var oslash$1 = "ø";
  var Otilde$1 = "Õ";
  var otilde$1 = "õ";
  var Ouml$1 = "Ö";
  var ouml$1 = "ö";
  var para$1 = "¶";
  var plusmn$1 = "±";
  var pound$1 = "£";
  var quot$1 = "\"";
  var QUOT$1 = "\"";
  var raquo$1 = "»";
  var reg$1 = "®";
  var REG$1 = "®";
  var sect$1 = "§";
  var shy$1 = "­";
  var sup1$1 = "¹";
  var sup2$1 = "²";
  var sup3$1 = "³";
  var szlig$1 = "ß";
  var THORN$1 = "Þ";
  var thorn$1 = "þ";
  var times$1 = "×";
  var Uacute$1 = "Ú";
  var uacute$1 = "ú";
  var Ucirc$1 = "Û";
  var ucirc$1 = "û";
  var Ugrave$1 = "Ù";
  var ugrave$1 = "ù";
  var uml$1 = "¨";
  var Uuml$1 = "Ü";
  var uuml$1 = "ü";
  var Yacute$1 = "Ý";
  var yacute$1 = "ý";
  var yen$1 = "¥";
  var yuml$1 = "ÿ";
  var legacy = {
  	Aacute: Aacute$1,
  	aacute: aacute$1,
  	Acirc: Acirc$1,
  	acirc: acirc$1,
  	acute: acute$1,
  	AElig: AElig$1,
  	aelig: aelig$1,
  	Agrave: Agrave$1,
  	agrave: agrave$1,
  	amp: amp$1,
  	AMP: AMP$1,
  	Aring: Aring$1,
  	aring: aring$1,
  	Atilde: Atilde$1,
  	atilde: atilde$1,
  	Auml: Auml$1,
  	auml: auml$1,
  	brvbar: brvbar$1,
  	Ccedil: Ccedil$1,
  	ccedil: ccedil$1,
  	cedil: cedil$1,
  	cent: cent$1,
  	copy: copy$1,
  	COPY: COPY$1,
  	curren: curren$1,
  	deg: deg$1,
  	divide: divide$2,
  	Eacute: Eacute$1,
  	eacute: eacute$1,
  	Ecirc: Ecirc$1,
  	ecirc: ecirc$1,
  	Egrave: Egrave$1,
  	egrave: egrave$1,
  	ETH: ETH$1,
  	eth: eth$1,
  	Euml: Euml$1,
  	euml: euml$1,
  	frac12: frac12$1,
  	frac14: frac14$1,
  	frac34: frac34$1,
  	gt: gt$1,
  	GT: GT$1,
  	Iacute: Iacute$1,
  	iacute: iacute$1,
  	Icirc: Icirc$1,
  	icirc: icirc$1,
  	iexcl: iexcl$1,
  	Igrave: Igrave$1,
  	igrave: igrave$1,
  	iquest: iquest$1,
  	Iuml: Iuml$1,
  	iuml: iuml$1,
  	laquo: laquo$1,
  	lt: lt$1,
  	LT: LT$1,
  	macr: macr$1,
  	micro: micro$1,
  	middot: middot$1,
  	nbsp: nbsp$1,
  	not: not$1,
  	Ntilde: Ntilde$1,
  	ntilde: ntilde$1,
  	Oacute: Oacute$1,
  	oacute: oacute$1,
  	Ocirc: Ocirc$1,
  	ocirc: ocirc$1,
  	Ograve: Ograve$1,
  	ograve: ograve$1,
  	ordf: ordf$1,
  	ordm: ordm$1,
  	Oslash: Oslash$1,
  	oslash: oslash$1,
  	Otilde: Otilde$1,
  	otilde: otilde$1,
  	Ouml: Ouml$1,
  	ouml: ouml$1,
  	para: para$1,
  	plusmn: plusmn$1,
  	pound: pound$1,
  	quot: quot$1,
  	QUOT: QUOT$1,
  	raquo: raquo$1,
  	reg: reg$1,
  	REG: REG$1,
  	sect: sect$1,
  	shy: shy$1,
  	sup1: sup1$1,
  	sup2: sup2$1,
  	sup3: sup3$1,
  	szlig: szlig$1,
  	THORN: THORN$1,
  	thorn: thorn$1,
  	times: times$1,
  	Uacute: Uacute$1,
  	uacute: uacute$1,
  	Ucirc: Ucirc$1,
  	ucirc: ucirc$1,
  	Ugrave: Ugrave$1,
  	ugrave: ugrave$1,
  	uml: uml$1,
  	Uuml: Uuml$1,
  	uuml: uuml$1,
  	Yacute: Yacute$1,
  	yacute: yacute$1,
  	yen: yen$1,
  	yuml: yuml$1
  };

  var legacy$1 = /*#__PURE__*/Object.freeze({
    Aacute: Aacute$1,
    aacute: aacute$1,
    Acirc: Acirc$1,
    acirc: acirc$1,
    acute: acute$1,
    AElig: AElig$1,
    aelig: aelig$1,
    Agrave: Agrave$1,
    agrave: agrave$1,
    amp: amp$1,
    AMP: AMP$1,
    Aring: Aring$1,
    aring: aring$1,
    Atilde: Atilde$1,
    atilde: atilde$1,
    Auml: Auml$1,
    auml: auml$1,
    brvbar: brvbar$1,
    Ccedil: Ccedil$1,
    ccedil: ccedil$1,
    cedil: cedil$1,
    cent: cent$1,
    copy: copy$1,
    COPY: COPY$1,
    curren: curren$1,
    deg: deg$1,
    divide: divide$2,
    Eacute: Eacute$1,
    eacute: eacute$1,
    Ecirc: Ecirc$1,
    ecirc: ecirc$1,
    Egrave: Egrave$1,
    egrave: egrave$1,
    ETH: ETH$1,
    eth: eth$1,
    Euml: Euml$1,
    euml: euml$1,
    frac12: frac12$1,
    frac14: frac14$1,
    frac34: frac34$1,
    gt: gt$1,
    GT: GT$1,
    Iacute: Iacute$1,
    iacute: iacute$1,
    Icirc: Icirc$1,
    icirc: icirc$1,
    iexcl: iexcl$1,
    Igrave: Igrave$1,
    igrave: igrave$1,
    iquest: iquest$1,
    Iuml: Iuml$1,
    iuml: iuml$1,
    laquo: laquo$1,
    lt: lt$1,
    LT: LT$1,
    macr: macr$1,
    micro: micro$1,
    middot: middot$1,
    nbsp: nbsp$1,
    not: not$1,
    Ntilde: Ntilde$1,
    ntilde: ntilde$1,
    Oacute: Oacute$1,
    oacute: oacute$1,
    Ocirc: Ocirc$1,
    ocirc: ocirc$1,
    Ograve: Ograve$1,
    ograve: ograve$1,
    ordf: ordf$1,
    ordm: ordm$1,
    Oslash: Oslash$1,
    oslash: oslash$1,
    Otilde: Otilde$1,
    otilde: otilde$1,
    Ouml: Ouml$1,
    ouml: ouml$1,
    para: para$1,
    plusmn: plusmn$1,
    pound: pound$1,
    quot: quot$1,
    QUOT: QUOT$1,
    raquo: raquo$1,
    reg: reg$1,
    REG: REG$1,
    sect: sect$1,
    shy: shy$1,
    sup1: sup1$1,
    sup2: sup2$1,
    sup3: sup3$1,
    szlig: szlig$1,
    THORN: THORN$1,
    thorn: thorn$1,
    times: times$1,
    Uacute: Uacute$1,
    uacute: uacute$1,
    Ucirc: Ucirc$1,
    ucirc: ucirc$1,
    Ugrave: Ugrave$1,
    ugrave: ugrave$1,
    uml: uml$1,
    Uuml: Uuml$1,
    uuml: uuml$1,
    Yacute: Yacute$1,
    yacute: yacute$1,
    yen: yen$1,
    yuml: yuml$1,
    default: legacy
  });

  var amp$2 = "&";
  var apos$1 = "'";
  var gt$2 = ">";
  var lt$2 = "<";
  var quot$2 = "\"";
  var xml = {
  	amp: amp$2,
  	apos: apos$1,
  	gt: gt$2,
  	lt: lt$2,
  	quot: quot$2
  };

  var xml$1 = /*#__PURE__*/Object.freeze({
    amp: amp$2,
    apos: apos$1,
    gt: gt$2,
    lt: lt$2,
    quot: quot$2,
    default: xml
  });

  var entityMap = getCjsExportFromNamespace(entities$1);

  var legacyMap = getCjsExportFromNamespace(legacy$1);

  var xmlMap = getCjsExportFromNamespace(xml$1);

  var Tokenizer_1 = Tokenizer;

  var i = 0,

      TEXT                      = i++,
      BEFORE_TAG_NAME           = i++, //after <
      IN_TAG_NAME               = i++,
      IN_SELF_CLOSING_TAG       = i++,
      BEFORE_CLOSING_TAG_NAME   = i++,
      IN_CLOSING_TAG_NAME       = i++,
      AFTER_CLOSING_TAG_NAME    = i++,

      //attributes
      BEFORE_ATTRIBUTE_NAME     = i++,
      IN_ATTRIBUTE_NAME         = i++,
      AFTER_ATTRIBUTE_NAME      = i++,
      BEFORE_ATTRIBUTE_VALUE    = i++,
      IN_ATTRIBUTE_VALUE_DQ     = i++, // "
      IN_ATTRIBUTE_VALUE_SQ     = i++, // '
      IN_ATTRIBUTE_VALUE_NQ     = i++,

      //declarations
      BEFORE_DECLARATION        = i++, // !
      IN_DECLARATION            = i++,

      //processing instructions
      IN_PROCESSING_INSTRUCTION = i++, // ?

      //comments
      BEFORE_COMMENT            = i++,
      IN_COMMENT                = i++,
      AFTER_COMMENT_1           = i++,
      AFTER_COMMENT_2           = i++,

      //cdata
      BEFORE_CDATA_1            = i++, // [
      BEFORE_CDATA_2            = i++, // C
      BEFORE_CDATA_3            = i++, // D
      BEFORE_CDATA_4            = i++, // A
      BEFORE_CDATA_5            = i++, // T
      BEFORE_CDATA_6            = i++, // A
      IN_CDATA                  = i++, // [
      AFTER_CDATA_1             = i++, // ]
      AFTER_CDATA_2             = i++, // ]

      //special tags
      BEFORE_SPECIAL            = i++, //S
      BEFORE_SPECIAL_END        = i++,   //S

      BEFORE_SCRIPT_1           = i++, //C
      BEFORE_SCRIPT_2           = i++, //R
      BEFORE_SCRIPT_3           = i++, //I
      BEFORE_SCRIPT_4           = i++, //P
      BEFORE_SCRIPT_5           = i++, //T
      AFTER_SCRIPT_1            = i++, //C
      AFTER_SCRIPT_2            = i++, //R
      AFTER_SCRIPT_3            = i++, //I
      AFTER_SCRIPT_4            = i++, //P
      AFTER_SCRIPT_5            = i++, //T

      BEFORE_STYLE_1            = i++, //T
      BEFORE_STYLE_2            = i++, //Y
      BEFORE_STYLE_3            = i++, //L
      BEFORE_STYLE_4            = i++, //E
      AFTER_STYLE_1             = i++, //T
      AFTER_STYLE_2             = i++, //Y
      AFTER_STYLE_3             = i++, //L
      AFTER_STYLE_4             = i++, //E

      BEFORE_ENTITY             = i++, //&
      BEFORE_NUMERIC_ENTITY     = i++, //#
      IN_NAMED_ENTITY           = i++,
      IN_NUMERIC_ENTITY         = i++,
      IN_HEX_ENTITY             = i++, //X

      j = 0,

      SPECIAL_NONE              = j++,
      SPECIAL_SCRIPT            = j++,
      SPECIAL_STYLE             = j++;

  function whitespace(c){
  	return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
  }

  function characterState(char, SUCCESS){
  	return function(c){
  		if(c === char) this._state = SUCCESS;
  	};
  }

  function ifElseState(upper, SUCCESS, FAILURE){
  	var lower = upper.toLowerCase();

  	if(upper === lower){
  		return function(c){
  			if(c === lower){
  				this._state = SUCCESS;
  			} else {
  				this._state = FAILURE;
  				this._index--;
  			}
  		};
  	} else {
  		return function(c){
  			if(c === lower || c === upper){
  				this._state = SUCCESS;
  			} else {
  				this._state = FAILURE;
  				this._index--;
  			}
  		};
  	}
  }

  function consumeSpecialNameChar(upper, NEXT_STATE){
  	var lower = upper.toLowerCase();

  	return function(c){
  		if(c === lower || c === upper){
  			this._state = NEXT_STATE;
  		} else {
  			this._state = IN_TAG_NAME;
  			this._index--; //consume the token again
  		}
  	};
  }

  function Tokenizer(options, cbs){
  	this._state = TEXT;
  	this._buffer = "";
  	this._sectionStart = 0;
  	this._index = 0;
  	this._bufferOffset = 0; //chars removed from _buffer
  	this._baseState = TEXT;
  	this._special = SPECIAL_NONE;
  	this._cbs = cbs;
  	this._running = true;
  	this._ended = false;
  	this._xmlMode = !!(options && options.xmlMode);
  	this._decodeEntities = !!(options && options.decodeEntities);
  }

  Tokenizer.prototype._stateText = function(c){
  	if(c === "<"){
  		if(this._index > this._sectionStart){
  			this._cbs.ontext(this._getSection());
  		}
  		this._state = BEFORE_TAG_NAME;
  		this._sectionStart = this._index;
  	} else if(this._decodeEntities && this._special === SPECIAL_NONE && c === "&"){
  		if(this._index > this._sectionStart){
  			this._cbs.ontext(this._getSection());
  		}
  		this._baseState = TEXT;
  		this._state = BEFORE_ENTITY;
  		this._sectionStart = this._index;
  	}
  };

  Tokenizer.prototype._stateBeforeTagName = function(c){
  	if(c === "/"){
  		this._state = BEFORE_CLOSING_TAG_NAME;
  	} else if(c === "<"){
  		this._cbs.ontext(this._getSection());
  		this._sectionStart = this._index;
  	} else if(c === ">" || this._special !== SPECIAL_NONE || whitespace(c)) {
  		this._state = TEXT;
  	} else if(c === "!"){
  		this._state = BEFORE_DECLARATION;
  		this._sectionStart = this._index + 1;
  	} else if(c === "?"){
  		this._state = IN_PROCESSING_INSTRUCTION;
  		this._sectionStart = this._index + 1;
  	} else {
  		this._state = (!this._xmlMode && (c === "s" || c === "S")) ?
  						BEFORE_SPECIAL : IN_TAG_NAME;
  		this._sectionStart = this._index;
  	}
  };

  Tokenizer.prototype._stateInTagName = function(c){
  	if(c === "/" || c === ">" || whitespace(c)){
  		this._emitToken("onopentagname");
  		this._state = BEFORE_ATTRIBUTE_NAME;
  		this._index--;
  	}
  };

  Tokenizer.prototype._stateBeforeCloseingTagName = function(c){
  	if(whitespace(c));
  	else if(c === ">"){
  		this._state = TEXT;
  	} else if(this._special !== SPECIAL_NONE){
  		if(c === "s" || c === "S"){
  			this._state = BEFORE_SPECIAL_END;
  		} else {
  			this._state = TEXT;
  			this._index--;
  		}
  	} else {
  		this._state = IN_CLOSING_TAG_NAME;
  		this._sectionStart = this._index;
  	}
  };

  Tokenizer.prototype._stateInCloseingTagName = function(c){
  	if(c === ">" || whitespace(c)){
  		this._emitToken("onclosetag");
  		this._state = AFTER_CLOSING_TAG_NAME;
  		this._index--;
  	}
  };

  Tokenizer.prototype._stateAfterCloseingTagName = function(c){
  	//skip everything until ">"
  	if(c === ">"){
  		this._state = TEXT;
  		this._sectionStart = this._index + 1;
  	}
  };

  Tokenizer.prototype._stateBeforeAttributeName = function(c){
  	if(c === ">"){
  		this._cbs.onopentagend();
  		this._state = TEXT;
  		this._sectionStart = this._index + 1;
  	} else if(c === "/"){
  		this._state = IN_SELF_CLOSING_TAG;
  	} else if(!whitespace(c)){
  		this._state = IN_ATTRIBUTE_NAME;
  		this._sectionStart = this._index;
  	}
  };

  Tokenizer.prototype._stateInSelfClosingTag = function(c){
  	if(c === ">"){
  		this._cbs.onselfclosingtag();
  		this._state = TEXT;
  		this._sectionStart = this._index + 1;
  	} else if(!whitespace(c)){
  		this._state = BEFORE_ATTRIBUTE_NAME;
  		this._index--;
  	}
  };

  Tokenizer.prototype._stateInAttributeName = function(c){
  	if(c === "=" || c === "/" || c === ">" || whitespace(c)){
  		this._cbs.onattribname(this._getSection());
  		this._sectionStart = -1;
  		this._state = AFTER_ATTRIBUTE_NAME;
  		this._index--;
  	}
  };

  Tokenizer.prototype._stateAfterAttributeName = function(c){
  	if(c === "="){
  		this._state = BEFORE_ATTRIBUTE_VALUE;
  	} else if(c === "/" || c === ">"){
  		this._cbs.onattribend();
  		this._state = BEFORE_ATTRIBUTE_NAME;
  		this._index--;
  	} else if(!whitespace(c)){
  		this._cbs.onattribend();
  		this._state = IN_ATTRIBUTE_NAME;
  		this._sectionStart = this._index;
  	}
  };

  Tokenizer.prototype._stateBeforeAttributeValue = function(c){
  	if(c === "\""){
  		this._state = IN_ATTRIBUTE_VALUE_DQ;
  		this._sectionStart = this._index + 1;
  	} else if(c === "'"){
  		this._state = IN_ATTRIBUTE_VALUE_SQ;
  		this._sectionStart = this._index + 1;
  	} else if(!whitespace(c)){
  		this._state = IN_ATTRIBUTE_VALUE_NQ;
  		this._sectionStart = this._index;
  		this._index--; //reconsume token
  	}
  };

  Tokenizer.prototype._stateInAttributeValueDoubleQuotes = function(c){
  	if(c === "\""){
  		this._emitToken("onattribdata");
  		this._cbs.onattribend();
  		this._state = BEFORE_ATTRIBUTE_NAME;
  	} else if(this._decodeEntities && c === "&"){
  		this._emitToken("onattribdata");
  		this._baseState = this._state;
  		this._state = BEFORE_ENTITY;
  		this._sectionStart = this._index;
  	}
  };

  Tokenizer.prototype._stateInAttributeValueSingleQuotes = function(c){
  	if(c === "'"){
  		this._emitToken("onattribdata");
  		this._cbs.onattribend();
  		this._state = BEFORE_ATTRIBUTE_NAME;
  	} else if(this._decodeEntities && c === "&"){
  		this._emitToken("onattribdata");
  		this._baseState = this._state;
  		this._state = BEFORE_ENTITY;
  		this._sectionStart = this._index;
  	}
  };

  Tokenizer.prototype._stateInAttributeValueNoQuotes = function(c){
  	if(whitespace(c) || c === ">"){
  		this._emitToken("onattribdata");
  		this._cbs.onattribend();
  		this._state = BEFORE_ATTRIBUTE_NAME;
  		this._index--;
  	} else if(this._decodeEntities && c === "&"){
  		this._emitToken("onattribdata");
  		this._baseState = this._state;
  		this._state = BEFORE_ENTITY;
  		this._sectionStart = this._index;
  	}
  };

  Tokenizer.prototype._stateBeforeDeclaration = function(c){
  	this._state = c === "[" ? BEFORE_CDATA_1 :
  					c === "-" ? BEFORE_COMMENT :
  						IN_DECLARATION;
  };

  Tokenizer.prototype._stateInDeclaration = function(c){
  	if(c === ">"){
  		this._cbs.ondeclaration(this._getSection());
  		this._state = TEXT;
  		this._sectionStart = this._index + 1;
  	}
  };

  Tokenizer.prototype._stateInProcessingInstruction = function(c){
  	if(c === ">"){
  		this._cbs.onprocessinginstruction(this._getSection());
  		this._state = TEXT;
  		this._sectionStart = this._index + 1;
  	}
  };

  Tokenizer.prototype._stateBeforeComment = function(c){
  	if(c === "-"){
  		this._state = IN_COMMENT;
  		this._sectionStart = this._index + 1;
  	} else {
  		this._state = IN_DECLARATION;
  	}
  };

  Tokenizer.prototype._stateInComment = function(c){
  	if(c === "-") this._state = AFTER_COMMENT_1;
  };

  Tokenizer.prototype._stateAfterComment1 = function(c){
  	if(c === "-"){
  		this._state = AFTER_COMMENT_2;
  	} else {
  		this._state = IN_COMMENT;
  	}
  };

  Tokenizer.prototype._stateAfterComment2 = function(c){
  	if(c === ">"){
  		//remove 2 trailing chars
  		this._cbs.oncomment(this._buffer.substring(this._sectionStart, this._index - 2));
  		this._state = TEXT;
  		this._sectionStart = this._index + 1;
  	} else if(c !== "-"){
  		this._state = IN_COMMENT;
  	}
  	// else: stay in AFTER_COMMENT_2 (`--->`)
  };

  Tokenizer.prototype._stateBeforeCdata1 = ifElseState("C", BEFORE_CDATA_2, IN_DECLARATION);
  Tokenizer.prototype._stateBeforeCdata2 = ifElseState("D", BEFORE_CDATA_3, IN_DECLARATION);
  Tokenizer.prototype._stateBeforeCdata3 = ifElseState("A", BEFORE_CDATA_4, IN_DECLARATION);
  Tokenizer.prototype._stateBeforeCdata4 = ifElseState("T", BEFORE_CDATA_5, IN_DECLARATION);
  Tokenizer.prototype._stateBeforeCdata5 = ifElseState("A", BEFORE_CDATA_6, IN_DECLARATION);

  Tokenizer.prototype._stateBeforeCdata6 = function(c){
  	if(c === "["){
  		this._state = IN_CDATA;
  		this._sectionStart = this._index + 1;
  	} else {
  		this._state = IN_DECLARATION;
  		this._index--;
  	}
  };

  Tokenizer.prototype._stateInCdata = function(c){
  	if(c === "]") this._state = AFTER_CDATA_1;
  };

  Tokenizer.prototype._stateAfterCdata1 = characterState("]", AFTER_CDATA_2);

  Tokenizer.prototype._stateAfterCdata2 = function(c){
  	if(c === ">"){
  		//remove 2 trailing chars
  		this._cbs.oncdata(this._buffer.substring(this._sectionStart, this._index - 2));
  		this._state = TEXT;
  		this._sectionStart = this._index + 1;
  	} else if(c !== "]") {
  		this._state = IN_CDATA;
  	}
  	//else: stay in AFTER_CDATA_2 (`]]]>`)
  };

  Tokenizer.prototype._stateBeforeSpecial = function(c){
  	if(c === "c" || c === "C"){
  		this._state = BEFORE_SCRIPT_1;
  	} else if(c === "t" || c === "T"){
  		this._state = BEFORE_STYLE_1;
  	} else {
  		this._state = IN_TAG_NAME;
  		this._index--; //consume the token again
  	}
  };

  Tokenizer.prototype._stateBeforeSpecialEnd = function(c){
  	if(this._special === SPECIAL_SCRIPT && (c === "c" || c === "C")){
  		this._state = AFTER_SCRIPT_1;
  	} else if(this._special === SPECIAL_STYLE && (c === "t" || c === "T")){
  		this._state = AFTER_STYLE_1;
  	}
  	else this._state = TEXT;
  };

  Tokenizer.prototype._stateBeforeScript1 = consumeSpecialNameChar("R", BEFORE_SCRIPT_2);
  Tokenizer.prototype._stateBeforeScript2 = consumeSpecialNameChar("I", BEFORE_SCRIPT_3);
  Tokenizer.prototype._stateBeforeScript3 = consumeSpecialNameChar("P", BEFORE_SCRIPT_4);
  Tokenizer.prototype._stateBeforeScript4 = consumeSpecialNameChar("T", BEFORE_SCRIPT_5);

  Tokenizer.prototype._stateBeforeScript5 = function(c){
  	if(c === "/" || c === ">" || whitespace(c)){
  		this._special = SPECIAL_SCRIPT;
  	}
  	this._state = IN_TAG_NAME;
  	this._index--; //consume the token again
  };

  Tokenizer.prototype._stateAfterScript1 = ifElseState("R", AFTER_SCRIPT_2, TEXT);
  Tokenizer.prototype._stateAfterScript2 = ifElseState("I", AFTER_SCRIPT_3, TEXT);
  Tokenizer.prototype._stateAfterScript3 = ifElseState("P", AFTER_SCRIPT_4, TEXT);
  Tokenizer.prototype._stateAfterScript4 = ifElseState("T", AFTER_SCRIPT_5, TEXT);

  Tokenizer.prototype._stateAfterScript5 = function(c){
  	if(c === ">" || whitespace(c)){
  		this._special = SPECIAL_NONE;
  		this._state = IN_CLOSING_TAG_NAME;
  		this._sectionStart = this._index - 6;
  		this._index--; //reconsume the token
  	}
  	else this._state = TEXT;
  };

  Tokenizer.prototype._stateBeforeStyle1 = consumeSpecialNameChar("Y", BEFORE_STYLE_2);
  Tokenizer.prototype._stateBeforeStyle2 = consumeSpecialNameChar("L", BEFORE_STYLE_3);
  Tokenizer.prototype._stateBeforeStyle3 = consumeSpecialNameChar("E", BEFORE_STYLE_4);

  Tokenizer.prototype._stateBeforeStyle4 = function(c){
  	if(c === "/" || c === ">" || whitespace(c)){
  		this._special = SPECIAL_STYLE;
  	}
  	this._state = IN_TAG_NAME;
  	this._index--; //consume the token again
  };

  Tokenizer.prototype._stateAfterStyle1 = ifElseState("Y", AFTER_STYLE_2, TEXT);
  Tokenizer.prototype._stateAfterStyle2 = ifElseState("L", AFTER_STYLE_3, TEXT);
  Tokenizer.prototype._stateAfterStyle3 = ifElseState("E", AFTER_STYLE_4, TEXT);

  Tokenizer.prototype._stateAfterStyle4 = function(c){
  	if(c === ">" || whitespace(c)){
  		this._special = SPECIAL_NONE;
  		this._state = IN_CLOSING_TAG_NAME;
  		this._sectionStart = this._index - 5;
  		this._index--; //reconsume the token
  	}
  	else this._state = TEXT;
  };

  Tokenizer.prototype._stateBeforeEntity = ifElseState("#", BEFORE_NUMERIC_ENTITY, IN_NAMED_ENTITY);
  Tokenizer.prototype._stateBeforeNumericEntity = ifElseState("X", IN_HEX_ENTITY, IN_NUMERIC_ENTITY);

  //for entities terminated with a semicolon
  Tokenizer.prototype._parseNamedEntityStrict = function(){
  	//offset = 1
  	if(this._sectionStart + 1 < this._index){
  		var entity = this._buffer.substring(this._sectionStart + 1, this._index),
  		    map = this._xmlMode ? xmlMap : entityMap;

  		if(map.hasOwnProperty(entity)){
  			this._emitPartial(map[entity]);
  			this._sectionStart = this._index + 1;
  		}
  	}
  };


  //parses legacy entities (without trailing semicolon)
  Tokenizer.prototype._parseLegacyEntity = function(){
  	var start = this._sectionStart + 1,
  	    limit = this._index - start;

  	if(limit > 6) limit = 6; //the max length of legacy entities is 6

  	while(limit >= 2){ //the min length of legacy entities is 2
  		var entity = this._buffer.substr(start, limit);

  		if(legacyMap.hasOwnProperty(entity)){
  			this._emitPartial(legacyMap[entity]);
  			this._sectionStart += limit + 1;
  			return;
  		} else {
  			limit--;
  		}
  	}
  };

  Tokenizer.prototype._stateInNamedEntity = function(c){
  	if(c === ";"){
  		this._parseNamedEntityStrict();
  		if(this._sectionStart + 1 < this._index && !this._xmlMode){
  			this._parseLegacyEntity();
  		}
  		this._state = this._baseState;
  	} else if((c < "a" || c > "z") && (c < "A" || c > "Z") && (c < "0" || c > "9")){
  		if(this._xmlMode);
  		else if(this._sectionStart + 1 === this._index);
  		else if(this._baseState !== TEXT){
  			if(c !== "="){
  				this._parseNamedEntityStrict();
  			}
  		} else {
  			this._parseLegacyEntity();
  		}

  		this._state = this._baseState;
  		this._index--;
  	}
  };

  Tokenizer.prototype._decodeNumericEntity = function(offset, base){
  	var sectionStart = this._sectionStart + offset;

  	if(sectionStart !== this._index){
  		//parse entity
  		var entity = this._buffer.substring(sectionStart, this._index);
  		var parsed = parseInt(entity, base);

  		this._emitPartial(decode_codepoint(parsed));
  		this._sectionStart = this._index;
  	} else {
  		this._sectionStart--;
  	}

  	this._state = this._baseState;
  };

  Tokenizer.prototype._stateInNumericEntity = function(c){
  	if(c === ";"){
  		this._decodeNumericEntity(2, 10);
  		this._sectionStart++;
  	} else if(c < "0" || c > "9"){
  		if(!this._xmlMode){
  			this._decodeNumericEntity(2, 10);
  		} else {
  			this._state = this._baseState;
  		}
  		this._index--;
  	}
  };

  Tokenizer.prototype._stateInHexEntity = function(c){
  	if(c === ";"){
  		this._decodeNumericEntity(3, 16);
  		this._sectionStart++;
  	} else if((c < "a" || c > "f") && (c < "A" || c > "F") && (c < "0" || c > "9")){
  		if(!this._xmlMode){
  			this._decodeNumericEntity(3, 16);
  		} else {
  			this._state = this._baseState;
  		}
  		this._index--;
  	}
  };

  Tokenizer.prototype._cleanup = function (){
  	if(this._sectionStart < 0){
  		this._buffer = "";
  		this._index = 0;
  		this._bufferOffset += this._index;
  	} else if(this._running){
  		if(this._state === TEXT){
  			if(this._sectionStart !== this._index){
  				this._cbs.ontext(this._buffer.substr(this._sectionStart));
  			}
  			this._buffer = "";
  			this._bufferOffset += this._index;
  			this._index = 0;
  		} else if(this._sectionStart === this._index){
  			//the section just started
  			this._buffer = "";
  			this._bufferOffset += this._index;
  			this._index = 0;
  		} else {
  			//remove everything unnecessary
  			this._buffer = this._buffer.substr(this._sectionStart);
  			this._index -= this._sectionStart;
  			this._bufferOffset += this._sectionStart;
  		}

  		this._sectionStart = 0;
  	}
  };

  //TODO make events conditional
  Tokenizer.prototype.write = function(chunk){
  	if(this._ended) this._cbs.onerror(Error(".write() after done!"));

  	this._buffer += chunk;
  	this._parse();
  };

  Tokenizer.prototype._parse = function(){
  	while(this._index < this._buffer.length && this._running){
  		var c = this._buffer.charAt(this._index);
  		if(this._state === TEXT) {
  			this._stateText(c);
  		} else if(this._state === BEFORE_TAG_NAME){
  			this._stateBeforeTagName(c);
  		} else if(this._state === IN_TAG_NAME) {
  			this._stateInTagName(c);
  		} else if(this._state === BEFORE_CLOSING_TAG_NAME){
  			this._stateBeforeCloseingTagName(c);
  		} else if(this._state === IN_CLOSING_TAG_NAME){
  			this._stateInCloseingTagName(c);
  		} else if(this._state === AFTER_CLOSING_TAG_NAME){
  			this._stateAfterCloseingTagName(c);
  		} else if(this._state === IN_SELF_CLOSING_TAG){
  			this._stateInSelfClosingTag(c);
  		}

  		/*
  		*	attributes
  		*/
  		else if(this._state === BEFORE_ATTRIBUTE_NAME){
  			this._stateBeforeAttributeName(c);
  		} else if(this._state === IN_ATTRIBUTE_NAME){
  			this._stateInAttributeName(c);
  		} else if(this._state === AFTER_ATTRIBUTE_NAME){
  			this._stateAfterAttributeName(c);
  		} else if(this._state === BEFORE_ATTRIBUTE_VALUE){
  			this._stateBeforeAttributeValue(c);
  		} else if(this._state === IN_ATTRIBUTE_VALUE_DQ){
  			this._stateInAttributeValueDoubleQuotes(c);
  		} else if(this._state === IN_ATTRIBUTE_VALUE_SQ){
  			this._stateInAttributeValueSingleQuotes(c);
  		} else if(this._state === IN_ATTRIBUTE_VALUE_NQ){
  			this._stateInAttributeValueNoQuotes(c);
  		}

  		/*
  		*	declarations
  		*/
  		else if(this._state === BEFORE_DECLARATION){
  			this._stateBeforeDeclaration(c);
  		} else if(this._state === IN_DECLARATION){
  			this._stateInDeclaration(c);
  		}

  		/*
  		*	processing instructions
  		*/
  		else if(this._state === IN_PROCESSING_INSTRUCTION){
  			this._stateInProcessingInstruction(c);
  		}

  		/*
  		*	comments
  		*/
  		else if(this._state === BEFORE_COMMENT){
  			this._stateBeforeComment(c);
  		} else if(this._state === IN_COMMENT){
  			this._stateInComment(c);
  		} else if(this._state === AFTER_COMMENT_1){
  			this._stateAfterComment1(c);
  		} else if(this._state === AFTER_COMMENT_2){
  			this._stateAfterComment2(c);
  		}

  		/*
  		*	cdata
  		*/
  		else if(this._state === BEFORE_CDATA_1){
  			this._stateBeforeCdata1(c);
  		} else if(this._state === BEFORE_CDATA_2){
  			this._stateBeforeCdata2(c);
  		} else if(this._state === BEFORE_CDATA_3){
  			this._stateBeforeCdata3(c);
  		} else if(this._state === BEFORE_CDATA_4){
  			this._stateBeforeCdata4(c);
  		} else if(this._state === BEFORE_CDATA_5){
  			this._stateBeforeCdata5(c);
  		} else if(this._state === BEFORE_CDATA_6){
  			this._stateBeforeCdata6(c);
  		} else if(this._state === IN_CDATA){
  			this._stateInCdata(c);
  		} else if(this._state === AFTER_CDATA_1){
  			this._stateAfterCdata1(c);
  		} else if(this._state === AFTER_CDATA_2){
  			this._stateAfterCdata2(c);
  		}

  		/*
  		* special tags
  		*/
  		else if(this._state === BEFORE_SPECIAL){
  			this._stateBeforeSpecial(c);
  		} else if(this._state === BEFORE_SPECIAL_END){
  			this._stateBeforeSpecialEnd(c);
  		}

  		/*
  		* script
  		*/
  		else if(this._state === BEFORE_SCRIPT_1){
  			this._stateBeforeScript1(c);
  		} else if(this._state === BEFORE_SCRIPT_2){
  			this._stateBeforeScript2(c);
  		} else if(this._state === BEFORE_SCRIPT_3){
  			this._stateBeforeScript3(c);
  		} else if(this._state === BEFORE_SCRIPT_4){
  			this._stateBeforeScript4(c);
  		} else if(this._state === BEFORE_SCRIPT_5){
  			this._stateBeforeScript5(c);
  		}

  		else if(this._state === AFTER_SCRIPT_1){
  			this._stateAfterScript1(c);
  		} else if(this._state === AFTER_SCRIPT_2){
  			this._stateAfterScript2(c);
  		} else if(this._state === AFTER_SCRIPT_3){
  			this._stateAfterScript3(c);
  		} else if(this._state === AFTER_SCRIPT_4){
  			this._stateAfterScript4(c);
  		} else if(this._state === AFTER_SCRIPT_5){
  			this._stateAfterScript5(c);
  		}

  		/*
  		* style
  		*/
  		else if(this._state === BEFORE_STYLE_1){
  			this._stateBeforeStyle1(c);
  		} else if(this._state === BEFORE_STYLE_2){
  			this._stateBeforeStyle2(c);
  		} else if(this._state === BEFORE_STYLE_3){
  			this._stateBeforeStyle3(c);
  		} else if(this._state === BEFORE_STYLE_4){
  			this._stateBeforeStyle4(c);
  		}

  		else if(this._state === AFTER_STYLE_1){
  			this._stateAfterStyle1(c);
  		} else if(this._state === AFTER_STYLE_2){
  			this._stateAfterStyle2(c);
  		} else if(this._state === AFTER_STYLE_3){
  			this._stateAfterStyle3(c);
  		} else if(this._state === AFTER_STYLE_4){
  			this._stateAfterStyle4(c);
  		}

  		/*
  		* entities
  		*/
  		else if(this._state === BEFORE_ENTITY){
  			this._stateBeforeEntity(c);
  		} else if(this._state === BEFORE_NUMERIC_ENTITY){
  			this._stateBeforeNumericEntity(c);
  		} else if(this._state === IN_NAMED_ENTITY){
  			this._stateInNamedEntity(c);
  		} else if(this._state === IN_NUMERIC_ENTITY){
  			this._stateInNumericEntity(c);
  		} else if(this._state === IN_HEX_ENTITY){
  			this._stateInHexEntity(c);
  		}

  		else {
  			this._cbs.onerror(Error("unknown _state"), this._state);
  		}

  		this._index++;
  	}

  	this._cleanup();
  };

  Tokenizer.prototype.pause = function(){
  	this._running = false;
  };
  Tokenizer.prototype.resume = function(){
  	this._running = true;

  	if(this._index < this._buffer.length){
  		this._parse();
  	}
  	if(this._ended){
  		this._finish();
  	}
  };

  Tokenizer.prototype.end = function(chunk){
  	if(this._ended) this._cbs.onerror(Error(".end() after done!"));
  	if(chunk) this.write(chunk);

  	this._ended = true;

  	if(this._running) this._finish();
  };

  Tokenizer.prototype._finish = function(){
  	//if there is remaining data, emit it in a reasonable way
  	if(this._sectionStart < this._index){
  		this._handleTrailingData();
  	}

  	this._cbs.onend();
  };

  Tokenizer.prototype._handleTrailingData = function(){
  	var data = this._buffer.substr(this._sectionStart);

  	if(this._state === IN_CDATA || this._state === AFTER_CDATA_1 || this._state === AFTER_CDATA_2){
  		this._cbs.oncdata(data);
  	} else if(this._state === IN_COMMENT || this._state === AFTER_COMMENT_1 || this._state === AFTER_COMMENT_2){
  		this._cbs.oncomment(data);
  	} else if(this._state === IN_NAMED_ENTITY && !this._xmlMode){
  		this._parseLegacyEntity();
  		if(this._sectionStart < this._index){
  			this._state = this._baseState;
  			this._handleTrailingData();
  		}
  	} else if(this._state === IN_NUMERIC_ENTITY && !this._xmlMode){
  		this._decodeNumericEntity(2, 10);
  		if(this._sectionStart < this._index){
  			this._state = this._baseState;
  			this._handleTrailingData();
  		}
  	} else if(this._state === IN_HEX_ENTITY && !this._xmlMode){
  		this._decodeNumericEntity(3, 16);
  		if(this._sectionStart < this._index){
  			this._state = this._baseState;
  			this._handleTrailingData();
  		}
  	} else if(
  		this._state !== IN_TAG_NAME &&
  		this._state !== BEFORE_ATTRIBUTE_NAME &&
  		this._state !== BEFORE_ATTRIBUTE_VALUE &&
  		this._state !== AFTER_ATTRIBUTE_NAME &&
  		this._state !== IN_ATTRIBUTE_NAME &&
  		this._state !== IN_ATTRIBUTE_VALUE_SQ &&
  		this._state !== IN_ATTRIBUTE_VALUE_DQ &&
  		this._state !== IN_ATTRIBUTE_VALUE_NQ &&
  		this._state !== IN_CLOSING_TAG_NAME
  	){
  		this._cbs.ontext(data);
  	}
  	//else, ignore remaining data
  	//TODO add a way to remove current tag
  };

  Tokenizer.prototype.reset = function(){
  	Tokenizer.call(this, {xmlMode: this._xmlMode, decodeEntities: this._decodeEntities}, this._cbs);
  };

  Tokenizer.prototype.getAbsoluteIndex = function(){
  	return this._bufferOffset + this._index;
  };

  Tokenizer.prototype._getSection = function(){
  	return this._buffer.substring(this._sectionStart, this._index);
  };

  Tokenizer.prototype._emitToken = function(name){
  	this._cbs[name](this._getSection());
  	this._sectionStart = -1;
  };

  Tokenizer.prototype._emitPartial = function(value){
  	if(this._baseState !== TEXT){
  		this._cbs.onattribdata(value); //TODO implement the new event
  	} else {
  		this._cbs.ontext(value);
  	}
  };

  var inherits_browser = createCommonjsModule(function (module) {
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
  } else {
    // old school shim for old browsers
    module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    };
  }
  });

  var inherits = createCommonjsModule(function (module) {
  try {
    var util$1 = util;
    if (typeof util$1.inherits !== 'function') throw '';
    module.exports = util$1.inherits;
  } catch (e) {
    module.exports = inherits_browser;
  }
  });

  var Tokenizer$1 = Tokenizer_1;

  /*
  	Options:

  	xmlMode: Disables the special behavior for script/style tags (false by default)
  	lowerCaseAttributeNames: call .toLowerCase for each attribute name (true if xmlMode is `false`)
  	lowerCaseTags: call .toLowerCase for each tag name (true if xmlMode is `false`)
  */

  /*
  	Callbacks:

  	oncdataend,
  	oncdatastart,
  	onclosetag,
  	oncomment,
  	oncommentend,
  	onerror,
  	onopentag,
  	onprocessinginstruction,
  	onreset,
  	ontext
  */

  var formTags = {
  	input: true,
  	option: true,
  	optgroup: true,
  	select: true,
  	button: true,
  	datalist: true,
  	textarea: true
  };

  var openImpliesClose = {
  	tr      : { tr:true, th:true, td:true },
  	th      : { th:true },
  	td      : { thead:true, th:true, td:true },
  	body    : { head:true, link:true, script:true },
  	li      : { li:true },
  	p       : { p:true },
  	h1      : { p:true },
  	h2      : { p:true },
  	h3      : { p:true },
  	h4      : { p:true },
  	h5      : { p:true },
  	h6      : { p:true },
  	select  : formTags,
  	input   : formTags,
  	output  : formTags,
  	button  : formTags,
  	datalist: formTags,
  	textarea: formTags,
  	option  : { option:true },
  	optgroup: { optgroup:true }
  };

  var voidElements = {
  	__proto__: null,
  	area: true,
  	base: true,
  	basefont: true,
  	br: true,
  	col: true,
  	command: true,
  	embed: true,
  	frame: true,
  	hr: true,
  	img: true,
  	input: true,
  	isindex: true,
  	keygen: true,
  	link: true,
  	meta: true,
  	param: true,
  	source: true,
  	track: true,
  	wbr: true,

  	//common self closing svg elements
  	path: true,
  	circle: true,
  	ellipse: true,
  	line: true,
  	rect: true,
  	use: true,
  	stop: true,
  	polyline: true,
  	polygon: true
  };

  var re_nameEnd = /\s|\//;

  function Parser(cbs, options){
  	this._options = options || {};
  	this._cbs = cbs || {};

  	this._tagname = "";
  	this._attribname = "";
  	this._attribvalue = "";
  	this._attribs = null;
  	this._stack = [];

  	this.startIndex = 0;
  	this.endIndex = null;

  	this._lowerCaseTagNames = "lowerCaseTags" in this._options ?
  									!!this._options.lowerCaseTags :
  									!this._options.xmlMode;
  	this._lowerCaseAttributeNames = "lowerCaseAttributeNames" in this._options ?
  									!!this._options.lowerCaseAttributeNames :
  									!this._options.xmlMode;

  	if(this._options.Tokenizer) {
  		Tokenizer$1 = this._options.Tokenizer;
  	}
  	this._tokenizer = new Tokenizer$1(this._options, this);

  	if(this._cbs.onparserinit) this._cbs.onparserinit(this);
  }

  inherits(Parser, events.EventEmitter);

  Parser.prototype._updatePosition = function(initialOffset){
  	if(this.endIndex === null){
  		if(this._tokenizer._sectionStart <= initialOffset){
  			this.startIndex = 0;
  		} else {
  			this.startIndex = this._tokenizer._sectionStart - initialOffset;
  		}
  	}
  	else this.startIndex = this.endIndex + 1;
  	this.endIndex = this._tokenizer.getAbsoluteIndex();
  };

  //Tokenizer event handlers
  Parser.prototype.ontext = function(data){
  	this._updatePosition(1);
  	this.endIndex--;

  	if(this._cbs.ontext) this._cbs.ontext(data);
  };

  Parser.prototype.onopentagname = function(name){
  	if(this._lowerCaseTagNames){
  		name = name.toLowerCase();
  	}

  	this._tagname = name;

  	if(!this._options.xmlMode && name in openImpliesClose) {
  		for(
  			var el;
  			(el = this._stack[this._stack.length - 1]) in openImpliesClose[name];
  			this.onclosetag(el)
  		);
  	}

  	if(this._options.xmlMode || !(name in voidElements)){
  		this._stack.push(name);
  	}

  	if(this._cbs.onopentagname) this._cbs.onopentagname(name);
  	if(this._cbs.onopentag) this._attribs = {};
  };

  Parser.prototype.onopentagend = function(){
  	this._updatePosition(1);

  	if(this._attribs){
  		if(this._cbs.onopentag) this._cbs.onopentag(this._tagname, this._attribs);
  		this._attribs = null;
  	}

  	if(!this._options.xmlMode && this._cbs.onclosetag && this._tagname in voidElements){
  		this._cbs.onclosetag(this._tagname);
  	}

  	this._tagname = "";
  };

  Parser.prototype.onclosetag = function(name){
  	this._updatePosition(1);

  	if(this._lowerCaseTagNames){
  		name = name.toLowerCase();
  	}

  	if(this._stack.length && (!(name in voidElements) || this._options.xmlMode)){
  		var pos = this._stack.lastIndexOf(name);
  		if(pos !== -1){
  			if(this._cbs.onclosetag){
  				pos = this._stack.length - pos;
  				while(pos--) this._cbs.onclosetag(this._stack.pop());
  			}
  			else this._stack.length = pos;
  		} else if(name === "p" && !this._options.xmlMode){
  			this.onopentagname(name);
  			this._closeCurrentTag();
  		}
  	} else if(!this._options.xmlMode && (name === "br" || name === "p")){
  		this.onopentagname(name);
  		this._closeCurrentTag();
  	}
  };

  Parser.prototype.onselfclosingtag = function(){
  	if(this._options.xmlMode || this._options.recognizeSelfClosing){
  		this._closeCurrentTag();
  	} else {
  		this.onopentagend();
  	}
  };

  Parser.prototype._closeCurrentTag = function(){
  	var name = this._tagname;

  	this.onopentagend();

  	//self-closing tags will be on the top of the stack
  	//(cheaper check than in onclosetag)
  	if(this._stack[this._stack.length - 1] === name){
  		if(this._cbs.onclosetag){
  			this._cbs.onclosetag(name);
  		}
  		this._stack.pop();
  	}
  };

  Parser.prototype.onattribname = function(name){
  	if(this._lowerCaseAttributeNames){
  		name = name.toLowerCase();
  	}
  	this._attribname = name;
  };

  Parser.prototype.onattribdata = function(value){
  	this._attribvalue += value;
  };

  Parser.prototype.onattribend = function(){
  	if(this._cbs.onattribute) this._cbs.onattribute(this._attribname, this._attribvalue);
  	if(
  		this._attribs &&
  		!Object.prototype.hasOwnProperty.call(this._attribs, this._attribname)
  	){
  		this._attribs[this._attribname] = this._attribvalue;
  	}
  	this._attribname = "";
  	this._attribvalue = "";
  };

  Parser.prototype._getInstructionName = function(value){
  	var idx = value.search(re_nameEnd),
  	    name = idx < 0 ? value : value.substr(0, idx);

  	if(this._lowerCaseTagNames){
  		name = name.toLowerCase();
  	}

  	return name;
  };

  Parser.prototype.ondeclaration = function(value){
  	if(this._cbs.onprocessinginstruction){
  		var name = this._getInstructionName(value);
  		this._cbs.onprocessinginstruction("!" + name, "!" + value);
  	}
  };

  Parser.prototype.onprocessinginstruction = function(value){
  	if(this._cbs.onprocessinginstruction){
  		var name = this._getInstructionName(value);
  		this._cbs.onprocessinginstruction("?" + name, "?" + value);
  	}
  };

  Parser.prototype.oncomment = function(value){
  	this._updatePosition(4);

  	if(this._cbs.oncomment) this._cbs.oncomment(value);
  	if(this._cbs.oncommentend) this._cbs.oncommentend();
  };

  Parser.prototype.oncdata = function(value){
  	this._updatePosition(1);

  	if(this._options.xmlMode || this._options.recognizeCDATA){
  		if(this._cbs.oncdatastart) this._cbs.oncdatastart();
  		if(this._cbs.ontext) this._cbs.ontext(value);
  		if(this._cbs.oncdataend) this._cbs.oncdataend();
  	} else {
  		this.oncomment("[CDATA[" + value + "]]");
  	}
  };

  Parser.prototype.onerror = function(err){
  	if(this._cbs.onerror) this._cbs.onerror(err);
  };

  Parser.prototype.onend = function(){
  	if(this._cbs.onclosetag){
  		for(
  			var i = this._stack.length;
  			i > 0;
  			this._cbs.onclosetag(this._stack[--i])
  		);
  	}
  	if(this._cbs.onend) this._cbs.onend();
  };


  //Resets the parser to a blank state, ready to parse a new HTML document
  Parser.prototype.reset = function(){
  	if(this._cbs.onreset) this._cbs.onreset();
  	this._tokenizer.reset();

  	this._tagname = "";
  	this._attribname = "";
  	this._attribs = null;
  	this._stack = [];

  	if(this._cbs.onparserinit) this._cbs.onparserinit(this);
  };

  //Parses a complete HTML document and pushes it to the handler
  Parser.prototype.parseComplete = function(data){
  	this.reset();
  	this.end(data);
  };

  Parser.prototype.write = function(chunk){
  	this._tokenizer.write(chunk);
  };

  Parser.prototype.end = function(chunk){
  	this._tokenizer.end(chunk);
  };

  Parser.prototype.pause = function(){
  	this._tokenizer.pause();
  };

  Parser.prototype.resume = function(){
  	this._tokenizer.resume();
  };

  //alias for backwards compat
  Parser.prototype.parseChunk = Parser.prototype.write;
  Parser.prototype.done = Parser.prototype.end;

  var Parser_1 = Parser;

  //Types of elements found in the DOM
  var domelementtype = {
  	Text: "text", //Text
  	Directive: "directive", //<? ... ?>
  	Comment: "comment", //<!-- ... -->
  	Script: "script", //<script> tags
  	Style: "style", //<style> tags
  	Tag: "tag", //Any tag
  	CDATA: "cdata", //<![CDATA[ ... ]]>
  	Doctype: "doctype",

  	isTag: function(elem){
  		return elem.type === "tag" || elem.type === "script" || elem.type === "style";
  	}
  };

  var node = createCommonjsModule(function (module) {
  // This object will be used as the prototype for Nodes when creating a
  // DOM-Level-1-compliant structure.
  var NodePrototype = module.exports = {
  	get firstChild() {
  		var children = this.children;
  		return children && children[0] || null;
  	},
  	get lastChild() {
  		var children = this.children;
  		return children && children[children.length - 1] || null;
  	},
  	get nodeType() {
  		return nodeTypes[this.type] || nodeTypes.element;
  	}
  };

  var domLvl1 = {
  	tagName: "name",
  	childNodes: "children",
  	parentNode: "parent",
  	previousSibling: "prev",
  	nextSibling: "next",
  	nodeValue: "data"
  };

  var nodeTypes = {
  	element: 1,
  	text: 3,
  	cdata: 4,
  	comment: 8
  };

  Object.keys(domLvl1).forEach(function(key) {
  	var shorthand = domLvl1[key];
  	Object.defineProperty(NodePrototype, key, {
  		get: function() {
  			return this[shorthand] || null;
  		},
  		set: function(val) {
  			this[shorthand] = val;
  			return val;
  		}
  	});
  });
  });
  var node_1 = node.firstChild;
  var node_2 = node.lastChild;
  var node_3 = node.nodeType;

  var element = createCommonjsModule(function (module) {
  // DOM-Level-1-compliant structure

  var ElementPrototype = module.exports = Object.create(node);

  var domLvl1 = {
  	tagName: "name"
  };

  Object.keys(domLvl1).forEach(function(key) {
  	var shorthand = domLvl1[key];
  	Object.defineProperty(ElementPrototype, key, {
  		get: function() {
  			return this[shorthand] || null;
  		},
  		set: function(val) {
  			this[shorthand] = val;
  			return val;
  		}
  	});
  });
  });

  var re_whitespace = /\s+/g;



  function DomHandler(callback, options, elementCB){
  	if(typeof callback === "object"){
  		elementCB = options;
  		options = callback;
  		callback = null;
  	} else if(typeof options === "function"){
  		elementCB = options;
  		options = defaultOpts;
  	}
  	this._callback = callback;
  	this._options = options || defaultOpts;
  	this._elementCB = elementCB;
  	this.dom = [];
  	this._done = false;
  	this._tagStack = [];
  	this._parser = this._parser || null;
  }

  //default options
  var defaultOpts = {
  	normalizeWhitespace: false, //Replace all whitespace with single spaces
  	withStartIndices: false, //Add startIndex properties to nodes
  };

  DomHandler.prototype.onparserinit = function(parser){
  	this._parser = parser;
  };

  //Resets the handler back to starting state
  DomHandler.prototype.onreset = function(){
  	DomHandler.call(this, this._callback, this._options, this._elementCB);
  };

  //Signals the handler that parsing is done
  DomHandler.prototype.onend = function(){
  	if(this._done) return;
  	this._done = true;
  	this._parser = null;
  	this._handleCallback(null);
  };

  DomHandler.prototype._handleCallback =
  DomHandler.prototype.onerror = function(error){
  	if(typeof this._callback === "function"){
  		this._callback(error, this.dom);
  	} else {
  		if(error) throw error;
  	}
  };

  DomHandler.prototype.onclosetag = function(){
  	//if(this._tagStack.pop().name !== name) this._handleCallback(Error("Tagname didn't match!"));
  	var elem = this._tagStack.pop();
  	if(this._elementCB) this._elementCB(elem);
  };

  DomHandler.prototype._addDomElement = function(element$1){
  	var parent = this._tagStack[this._tagStack.length - 1];
  	var siblings = parent ? parent.children : this.dom;
  	var previousSibling = siblings[siblings.length - 1];

  	element$1.next = null;

  	if(this._options.withStartIndices){
  		element$1.startIndex = this._parser.startIndex;
  	}

  	if (this._options.withDomLvl1) {
  		element$1.__proto__ = element$1.type === "tag" ? element : node;
  	}

  	if(previousSibling){
  		element$1.prev = previousSibling;
  		previousSibling.next = element$1;
  	} else {
  		element$1.prev = null;
  	}

  	siblings.push(element$1);
  	element$1.parent = parent || null;
  };

  DomHandler.prototype.onopentag = function(name, attribs){
  	var element = {
  		type: name === "script" ? domelementtype.Script : name === "style" ? domelementtype.Style : domelementtype.Tag,
  		name: name,
  		attribs: attribs,
  		children: []
  	};

  	this._addDomElement(element);

  	this._tagStack.push(element);
  };

  DomHandler.prototype.ontext = function(data){
  	//the ignoreWhitespace is officially dropped, but for now,
  	//it's an alias for normalizeWhitespace
  	var normalize = this._options.normalizeWhitespace || this._options.ignoreWhitespace;

  	var lastTag;

  	if(!this._tagStack.length && this.dom.length && (lastTag = this.dom[this.dom.length-1]).type === domelementtype.Text){
  		if(normalize){
  			lastTag.data = (lastTag.data + data).replace(re_whitespace, " ");
  		} else {
  			lastTag.data += data;
  		}
  	} else {
  		if(
  			this._tagStack.length &&
  			(lastTag = this._tagStack[this._tagStack.length - 1]) &&
  			(lastTag = lastTag.children[lastTag.children.length - 1]) &&
  			lastTag.type === domelementtype.Text
  		){
  			if(normalize){
  				lastTag.data = (lastTag.data + data).replace(re_whitespace, " ");
  			} else {
  				lastTag.data += data;
  			}
  		} else {
  			if(normalize){
  				data = data.replace(re_whitespace, " ");
  			}

  			this._addDomElement({
  				data: data,
  				type: domelementtype.Text
  			});
  		}
  	}
  };

  DomHandler.prototype.oncomment = function(data){
  	var lastTag = this._tagStack[this._tagStack.length - 1];

  	if(lastTag && lastTag.type === domelementtype.Comment){
  		lastTag.data += data;
  		return;
  	}

  	var element = {
  		data: data,
  		type: domelementtype.Comment
  	};

  	this._addDomElement(element);
  	this._tagStack.push(element);
  };

  DomHandler.prototype.oncdatastart = function(){
  	var element = {
  		children: [{
  			data: "",
  			type: domelementtype.Text
  		}],
  		type: domelementtype.CDATA
  	};

  	this._addDomElement(element);
  	this._tagStack.push(element);
  };

  DomHandler.prototype.oncommentend = DomHandler.prototype.oncdataend = function(){
  	this._tagStack.pop();
  };

  DomHandler.prototype.onprocessinginstruction = function(name, data){
  	this._addDomElement({
  		name: name,
  		data: data,
  		type: domelementtype.Directive
  	});
  };

  var domhandler = DomHandler;

  /**
   * Module dependencies.
   */



  /**
   * Parses HTML string to DOM nodes (server).
   *
   * This is the same method as `require('htmlparser2').parseDOM`
   * https://github.com/fb55/htmlparser2/blob/v3.9.1/lib/index.js#L39-L43
   *
   * @param  {String} html      - The HTML string.
   * @param  {Object} [options] - The parser options.
   * @return {Array}            - The DOM nodes.
   */
  var htmlToDomServer = function parseDOM(html, options) {
      if (typeof html !== 'string') {
          throw new TypeError('First argument must be a string.');
      }
      var handler = new domhandler(options);
      new Parser_1(handler, options).end(html);
      return handler.dom;
  };

  /**
   * Use the server/node parser by default.
   *
   * But use the client parser when bundling for the browser:
   * https://github.com/substack/node-browserify#browser-field
   */
  var htmlDomParser = htmlToDomServer;

  // decode HTML entities by default for `htmlparser2`
  var domParserOptions = { decodeEntities: true, lowerCaseAttributeNames: false };

  /**
   * Convert HTML string to React elements.
   *
   * @param  {String}   html              - The HTML string.
   * @param  {Object}   [options]         - The additional options.
   * @param  {Function} [options.replace] - The replace method.
   * @return {ReactElement|Array}
   */
  function HTMLReactParser(html, options) {
    if (typeof html !== 'string') {
      throw new TypeError('First argument must be a string');
    }
    return domToReact_1(htmlDomParser(html, domParserOptions), options);
  }

  /**
   * Export HTML to React parser.
   */
  var htmlReactParser = HTMLReactParser;

  //
  // Main
  //

  function memoize (fn, options) {
    var cache = options && options.cache
      ? options.cache
      : cacheDefault;

    var serializer = options && options.serializer
      ? options.serializer
      : serializerDefault;

    var strategy = options && options.strategy
      ? options.strategy
      : strategyDefault;

    return strategy(fn, {
      cache: cache,
      serializer: serializer
    })
  }

  //
  // Strategy
  //

  function isPrimitive (value) {
    return value == null || typeof value === 'number' || typeof value === 'boolean' // || typeof value === "string" 'unsafe' primitive for our needs
  }

  function monadic (fn, cache, serializer, arg) {
    var cacheKey = isPrimitive(arg) ? arg : serializer(arg);

    var computedValue = cache.get(cacheKey);
    if (typeof computedValue === 'undefined') {
      computedValue = fn.call(this, arg);
      cache.set(cacheKey, computedValue);
    }

    return computedValue
  }

  function variadic (fn, cache, serializer) {
    var args = Array.prototype.slice.call(arguments, 3);
    var cacheKey = serializer(args);

    var computedValue = cache.get(cacheKey);
    if (typeof computedValue === 'undefined') {
      computedValue = fn.apply(this, args);
      cache.set(cacheKey, computedValue);
    }

    return computedValue
  }

  function assemble (fn, context, strategy, cache, serialize) {
    return strategy.bind(
      context,
      fn,
      cache,
      serialize
    )
  }

  function strategyDefault (fn, options) {
    var strategy = fn.length === 1 ? monadic : variadic;

    return assemble(
      fn,
      this,
      strategy,
      options.cache.create(),
      options.serializer
    )
  }

  function strategyVariadic (fn, options) {
    var strategy = variadic;

    return assemble(
      fn,
      this,
      strategy,
      options.cache.create(),
      options.serializer
    )
  }

  function strategyMonadic (fn, options) {
    var strategy = monadic;

    return assemble(
      fn,
      this,
      strategy,
      options.cache.create(),
      options.serializer
    )
  }

  //
  // Serializer
  //

  function serializerDefault () {
    return JSON.stringify(arguments)
  }

  //
  // Cache
  //

  function ObjectWithoutPrototypeCache () {
    this.cache = Object.create(null);
  }

  ObjectWithoutPrototypeCache.prototype.has = function (key) {
    return (key in this.cache)
  };

  ObjectWithoutPrototypeCache.prototype.get = function (key) {
    return this.cache[key]
  };

  ObjectWithoutPrototypeCache.prototype.set = function (key, value) {
    this.cache[key] = value;
  };

  var cacheDefault = {
    create: function create () {
      return new ObjectWithoutPrototypeCache()
    }
  };

  //
  // API
  //

  var src = memoize;
  var strategies = {
    variadic: strategyVariadic,
    monadic: strategyMonadic
  };
  src.strategies = strategies;

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

    return dateFns_50(value, dateFormat);
  }
  function formatDateTime(value) {
    return formatDate(value, DATE_FORMATS.date_at_time);
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


    var unitCounts = Object.entries(lib_2(iso8601)); // Remove 0 entries
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

    return htmlReactParser(preserveNewLines(lodash.escape(body)));
  }
  function getDisplayName(component) {
    if (!component) {
      return undefined;
    }

    return component.displayName || component.name || 'Component';
  }

  function _varToLabel(str) {
    // Sourced significantly from https://github.com/gouch/to-title-case/blob/master/to-title-case.js
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i,
        suffix = str.split('.').pop() || '',
        formatted = lodash.startCase(suffix);
    return formatted.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
      var notFirstWord = index > 0,
          notOnlyWord = index + match.length !== title.length,
          hasSmallWords = match.search(smallWords) > -1;

      if (notFirstWord && notOnlyWord && hasSmallWords) {
        return match.toLowerCase();
      }

      return match.charAt(0).toUpperCase() + match.substr(1).toLowerCase();
    });
  }

  var varToLabel = src(_varToLabel);
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
    return htmlReactParser(formatAddress(address).replace(', ', '<br/>'));
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
          var classNames = classnames(this.props.className, 'disabled');
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

  function isValidDate(value) {
    return !value || value.length === '####-##-##'.length // ISO date
    && moment(value).isValid() // Real day
    ;
  }
  function isValidPastDate(value) {
    return !value || isValidDate(value) && moment(value).isBefore(moment()) // In the past
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
  exports.formatDateTime = formatDateTime;
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
  exports.isValidDate = isValidDate;
  exports.isValidPastDate = isValidPastDate;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
