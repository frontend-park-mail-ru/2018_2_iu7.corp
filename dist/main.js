/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/node-libs-browser/node_modules/punycode/punycode.js":
/*!**************************************************************************!*\
  !*** ./node_modules/node-libs-browser/node_modules/punycode/punycode.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */\n;(function(root) {\n\n\t/** Detect free variables */\n\tvar freeExports = typeof exports == 'object' && exports &&\n\t\t!exports.nodeType && exports;\n\tvar freeModule = typeof module == 'object' && module &&\n\t\t!module.nodeType && module;\n\tvar freeGlobal = typeof global == 'object' && global;\n\tif (\n\t\tfreeGlobal.global === freeGlobal ||\n\t\tfreeGlobal.window === freeGlobal ||\n\t\tfreeGlobal.self === freeGlobal\n\t) {\n\t\troot = freeGlobal;\n\t}\n\n\t/**\n\t * The `punycode` object.\n\t * @name punycode\n\t * @type Object\n\t */\n\tvar punycode,\n\n\t/** Highest positive signed 32-bit float value */\n\tmaxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1\n\n\t/** Bootstring parameters */\n\tbase = 36,\n\ttMin = 1,\n\ttMax = 26,\n\tskew = 38,\n\tdamp = 700,\n\tinitialBias = 72,\n\tinitialN = 128, // 0x80\n\tdelimiter = '-', // '\\x2D'\n\n\t/** Regular expressions */\n\tregexPunycode = /^xn--/,\n\tregexNonASCII = /[^\\x20-\\x7E]/, // unprintable ASCII chars + non-ASCII chars\n\tregexSeparators = /[\\x2E\\u3002\\uFF0E\\uFF61]/g, // RFC 3490 separators\n\n\t/** Error messages */\n\terrors = {\n\t\t'overflow': 'Overflow: input needs wider integers to process',\n\t\t'not-basic': 'Illegal input >= 0x80 (not a basic code point)',\n\t\t'invalid-input': 'Invalid input'\n\t},\n\n\t/** Convenience shortcuts */\n\tbaseMinusTMin = base - tMin,\n\tfloor = Math.floor,\n\tstringFromCharCode = String.fromCharCode,\n\n\t/** Temporary variable */\n\tkey;\n\n\t/*--------------------------------------------------------------------------*/\n\n\t/**\n\t * A generic error utility function.\n\t * @private\n\t * @param {String} type The error type.\n\t * @returns {Error} Throws a `RangeError` with the applicable error message.\n\t */\n\tfunction error(type) {\n\t\tthrow new RangeError(errors[type]);\n\t}\n\n\t/**\n\t * A generic `Array#map` utility function.\n\t * @private\n\t * @param {Array} array The array to iterate over.\n\t * @param {Function} callback The function that gets called for every array\n\t * item.\n\t * @returns {Array} A new array of values returned by the callback function.\n\t */\n\tfunction map(array, fn) {\n\t\tvar length = array.length;\n\t\tvar result = [];\n\t\twhile (length--) {\n\t\t\tresult[length] = fn(array[length]);\n\t\t}\n\t\treturn result;\n\t}\n\n\t/**\n\t * A simple `Array#map`-like wrapper to work with domain name strings or email\n\t * addresses.\n\t * @private\n\t * @param {String} domain The domain name or email address.\n\t * @param {Function} callback The function that gets called for every\n\t * character.\n\t * @returns {Array} A new string of characters returned by the callback\n\t * function.\n\t */\n\tfunction mapDomain(string, fn) {\n\t\tvar parts = string.split('@');\n\t\tvar result = '';\n\t\tif (parts.length > 1) {\n\t\t\t// In email addresses, only the domain name should be punycoded. Leave\n\t\t\t// the local part (i.e. everything up to `@`) intact.\n\t\t\tresult = parts[0] + '@';\n\t\t\tstring = parts[1];\n\t\t}\n\t\t// Avoid `split(regex)` for IE8 compatibility. See #17.\n\t\tstring = string.replace(regexSeparators, '\\x2E');\n\t\tvar labels = string.split('.');\n\t\tvar encoded = map(labels, fn).join('.');\n\t\treturn result + encoded;\n\t}\n\n\t/**\n\t * Creates an array containing the numeric code points of each Unicode\n\t * character in the string. While JavaScript uses UCS-2 internally,\n\t * this function will convert a pair of surrogate halves (each of which\n\t * UCS-2 exposes as separate characters) into a single code point,\n\t * matching UTF-16.\n\t * @see `punycode.ucs2.encode`\n\t * @see <https://mathiasbynens.be/notes/javascript-encoding>\n\t * @memberOf punycode.ucs2\n\t * @name decode\n\t * @param {String} string The Unicode input string (UCS-2).\n\t * @returns {Array} The new array of code points.\n\t */\n\tfunction ucs2decode(string) {\n\t\tvar output = [],\n\t\t    counter = 0,\n\t\t    length = string.length,\n\t\t    value,\n\t\t    extra;\n\t\twhile (counter < length) {\n\t\t\tvalue = string.charCodeAt(counter++);\n\t\t\tif (value >= 0xD800 && value <= 0xDBFF && counter < length) {\n\t\t\t\t// high surrogate, and there is a next character\n\t\t\t\textra = string.charCodeAt(counter++);\n\t\t\t\tif ((extra & 0xFC00) == 0xDC00) { // low surrogate\n\t\t\t\t\toutput.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);\n\t\t\t\t} else {\n\t\t\t\t\t// unmatched surrogate; only append this code unit, in case the next\n\t\t\t\t\t// code unit is the high surrogate of a surrogate pair\n\t\t\t\t\toutput.push(value);\n\t\t\t\t\tcounter--;\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\toutput.push(value);\n\t\t\t}\n\t\t}\n\t\treturn output;\n\t}\n\n\t/**\n\t * Creates a string based on an array of numeric code points.\n\t * @see `punycode.ucs2.decode`\n\t * @memberOf punycode.ucs2\n\t * @name encode\n\t * @param {Array} codePoints The array of numeric code points.\n\t * @returns {String} The new Unicode string (UCS-2).\n\t */\n\tfunction ucs2encode(array) {\n\t\treturn map(array, function(value) {\n\t\t\tvar output = '';\n\t\t\tif (value > 0xFFFF) {\n\t\t\t\tvalue -= 0x10000;\n\t\t\t\toutput += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);\n\t\t\t\tvalue = 0xDC00 | value & 0x3FF;\n\t\t\t}\n\t\t\toutput += stringFromCharCode(value);\n\t\t\treturn output;\n\t\t}).join('');\n\t}\n\n\t/**\n\t * Converts a basic code point into a digit/integer.\n\t * @see `digitToBasic()`\n\t * @private\n\t * @param {Number} codePoint The basic numeric code point value.\n\t * @returns {Number} The numeric value of a basic code point (for use in\n\t * representing integers) in the range `0` to `base - 1`, or `base` if\n\t * the code point does not represent a value.\n\t */\n\tfunction basicToDigit(codePoint) {\n\t\tif (codePoint - 48 < 10) {\n\t\t\treturn codePoint - 22;\n\t\t}\n\t\tif (codePoint - 65 < 26) {\n\t\t\treturn codePoint - 65;\n\t\t}\n\t\tif (codePoint - 97 < 26) {\n\t\t\treturn codePoint - 97;\n\t\t}\n\t\treturn base;\n\t}\n\n\t/**\n\t * Converts a digit/integer into a basic code point.\n\t * @see `basicToDigit()`\n\t * @private\n\t * @param {Number} digit The numeric value of a basic code point.\n\t * @returns {Number} The basic code point whose value (when used for\n\t * representing integers) is `digit`, which needs to be in the range\n\t * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is\n\t * used; else, the lowercase form is used. The behavior is undefined\n\t * if `flag` is non-zero and `digit` has no uppercase form.\n\t */\n\tfunction digitToBasic(digit, flag) {\n\t\t//  0..25 map to ASCII a..z or A..Z\n\t\t// 26..35 map to ASCII 0..9\n\t\treturn digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);\n\t}\n\n\t/**\n\t * Bias adaptation function as per section 3.4 of RFC 3492.\n\t * https://tools.ietf.org/html/rfc3492#section-3.4\n\t * @private\n\t */\n\tfunction adapt(delta, numPoints, firstTime) {\n\t\tvar k = 0;\n\t\tdelta = firstTime ? floor(delta / damp) : delta >> 1;\n\t\tdelta += floor(delta / numPoints);\n\t\tfor (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {\n\t\t\tdelta = floor(delta / baseMinusTMin);\n\t\t}\n\t\treturn floor(k + (baseMinusTMin + 1) * delta / (delta + skew));\n\t}\n\n\t/**\n\t * Converts a Punycode string of ASCII-only symbols to a string of Unicode\n\t * symbols.\n\t * @memberOf punycode\n\t * @param {String} input The Punycode string of ASCII-only symbols.\n\t * @returns {String} The resulting string of Unicode symbols.\n\t */\n\tfunction decode(input) {\n\t\t// Don't use UCS-2\n\t\tvar output = [],\n\t\t    inputLength = input.length,\n\t\t    out,\n\t\t    i = 0,\n\t\t    n = initialN,\n\t\t    bias = initialBias,\n\t\t    basic,\n\t\t    j,\n\t\t    index,\n\t\t    oldi,\n\t\t    w,\n\t\t    k,\n\t\t    digit,\n\t\t    t,\n\t\t    /** Cached calculation results */\n\t\t    baseMinusT;\n\n\t\t// Handle the basic code points: let `basic` be the number of input code\n\t\t// points before the last delimiter, or `0` if there is none, then copy\n\t\t// the first basic code points to the output.\n\n\t\tbasic = input.lastIndexOf(delimiter);\n\t\tif (basic < 0) {\n\t\t\tbasic = 0;\n\t\t}\n\n\t\tfor (j = 0; j < basic; ++j) {\n\t\t\t// if it's not a basic code point\n\t\t\tif (input.charCodeAt(j) >= 0x80) {\n\t\t\t\terror('not-basic');\n\t\t\t}\n\t\t\toutput.push(input.charCodeAt(j));\n\t\t}\n\n\t\t// Main decoding loop: start just after the last delimiter if any basic code\n\t\t// points were copied; start at the beginning otherwise.\n\n\t\tfor (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {\n\n\t\t\t// `index` is the index of the next character to be consumed.\n\t\t\t// Decode a generalized variable-length integer into `delta`,\n\t\t\t// which gets added to `i`. The overflow checking is easier\n\t\t\t// if we increase `i` as we go, then subtract off its starting\n\t\t\t// value at the end to obtain `delta`.\n\t\t\tfor (oldi = i, w = 1, k = base; /* no condition */; k += base) {\n\n\t\t\t\tif (index >= inputLength) {\n\t\t\t\t\terror('invalid-input');\n\t\t\t\t}\n\n\t\t\t\tdigit = basicToDigit(input.charCodeAt(index++));\n\n\t\t\t\tif (digit >= base || digit > floor((maxInt - i) / w)) {\n\t\t\t\t\terror('overflow');\n\t\t\t\t}\n\n\t\t\t\ti += digit * w;\n\t\t\t\tt = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);\n\n\t\t\t\tif (digit < t) {\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\n\t\t\t\tbaseMinusT = base - t;\n\t\t\t\tif (w > floor(maxInt / baseMinusT)) {\n\t\t\t\t\terror('overflow');\n\t\t\t\t}\n\n\t\t\t\tw *= baseMinusT;\n\n\t\t\t}\n\n\t\t\tout = output.length + 1;\n\t\t\tbias = adapt(i - oldi, out, oldi == 0);\n\n\t\t\t// `i` was supposed to wrap around from `out` to `0`,\n\t\t\t// incrementing `n` each time, so we'll fix that now:\n\t\t\tif (floor(i / out) > maxInt - n) {\n\t\t\t\terror('overflow');\n\t\t\t}\n\n\t\t\tn += floor(i / out);\n\t\t\ti %= out;\n\n\t\t\t// Insert `n` at position `i` of the output\n\t\t\toutput.splice(i++, 0, n);\n\n\t\t}\n\n\t\treturn ucs2encode(output);\n\t}\n\n\t/**\n\t * Converts a string of Unicode symbols (e.g. a domain name label) to a\n\t * Punycode string of ASCII-only symbols.\n\t * @memberOf punycode\n\t * @param {String} input The string of Unicode symbols.\n\t * @returns {String} The resulting Punycode string of ASCII-only symbols.\n\t */\n\tfunction encode(input) {\n\t\tvar n,\n\t\t    delta,\n\t\t    handledCPCount,\n\t\t    basicLength,\n\t\t    bias,\n\t\t    j,\n\t\t    m,\n\t\t    q,\n\t\t    k,\n\t\t    t,\n\t\t    currentValue,\n\t\t    output = [],\n\t\t    /** `inputLength` will hold the number of code points in `input`. */\n\t\t    inputLength,\n\t\t    /** Cached calculation results */\n\t\t    handledCPCountPlusOne,\n\t\t    baseMinusT,\n\t\t    qMinusT;\n\n\t\t// Convert the input in UCS-2 to Unicode\n\t\tinput = ucs2decode(input);\n\n\t\t// Cache the length\n\t\tinputLength = input.length;\n\n\t\t// Initialize the state\n\t\tn = initialN;\n\t\tdelta = 0;\n\t\tbias = initialBias;\n\n\t\t// Handle the basic code points\n\t\tfor (j = 0; j < inputLength; ++j) {\n\t\t\tcurrentValue = input[j];\n\t\t\tif (currentValue < 0x80) {\n\t\t\t\toutput.push(stringFromCharCode(currentValue));\n\t\t\t}\n\t\t}\n\n\t\thandledCPCount = basicLength = output.length;\n\n\t\t// `handledCPCount` is the number of code points that have been handled;\n\t\t// `basicLength` is the number of basic code points.\n\n\t\t// Finish the basic string - if it is not empty - with a delimiter\n\t\tif (basicLength) {\n\t\t\toutput.push(delimiter);\n\t\t}\n\n\t\t// Main encoding loop:\n\t\twhile (handledCPCount < inputLength) {\n\n\t\t\t// All non-basic code points < n have been handled already. Find the next\n\t\t\t// larger one:\n\t\t\tfor (m = maxInt, j = 0; j < inputLength; ++j) {\n\t\t\t\tcurrentValue = input[j];\n\t\t\t\tif (currentValue >= n && currentValue < m) {\n\t\t\t\t\tm = currentValue;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,\n\t\t\t// but guard against overflow\n\t\t\thandledCPCountPlusOne = handledCPCount + 1;\n\t\t\tif (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {\n\t\t\t\terror('overflow');\n\t\t\t}\n\n\t\t\tdelta += (m - n) * handledCPCountPlusOne;\n\t\t\tn = m;\n\n\t\t\tfor (j = 0; j < inputLength; ++j) {\n\t\t\t\tcurrentValue = input[j];\n\n\t\t\t\tif (currentValue < n && ++delta > maxInt) {\n\t\t\t\t\terror('overflow');\n\t\t\t\t}\n\n\t\t\t\tif (currentValue == n) {\n\t\t\t\t\t// Represent delta as a generalized variable-length integer\n\t\t\t\t\tfor (q = delta, k = base; /* no condition */; k += base) {\n\t\t\t\t\t\tt = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);\n\t\t\t\t\t\tif (q < t) {\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tqMinusT = q - t;\n\t\t\t\t\t\tbaseMinusT = base - t;\n\t\t\t\t\t\toutput.push(\n\t\t\t\t\t\t\tstringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))\n\t\t\t\t\t\t);\n\t\t\t\t\t\tq = floor(qMinusT / baseMinusT);\n\t\t\t\t\t}\n\n\t\t\t\t\toutput.push(stringFromCharCode(digitToBasic(q, 0)));\n\t\t\t\t\tbias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);\n\t\t\t\t\tdelta = 0;\n\t\t\t\t\t++handledCPCount;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t++delta;\n\t\t\t++n;\n\n\t\t}\n\t\treturn output.join('');\n\t}\n\n\t/**\n\t * Converts a Punycode string representing a domain name or an email address\n\t * to Unicode. Only the Punycoded parts of the input will be converted, i.e.\n\t * it doesn't matter if you call it on a string that has already been\n\t * converted to Unicode.\n\t * @memberOf punycode\n\t * @param {String} input The Punycoded domain name or email address to\n\t * convert to Unicode.\n\t * @returns {String} The Unicode representation of the given Punycode\n\t * string.\n\t */\n\tfunction toUnicode(input) {\n\t\treturn mapDomain(input, function(string) {\n\t\t\treturn regexPunycode.test(string)\n\t\t\t\t? decode(string.slice(4).toLowerCase())\n\t\t\t\t: string;\n\t\t});\n\t}\n\n\t/**\n\t * Converts a Unicode string representing a domain name or an email address to\n\t * Punycode. Only the non-ASCII parts of the domain name will be converted,\n\t * i.e. it doesn't matter if you call it with a domain that's already in\n\t * ASCII.\n\t * @memberOf punycode\n\t * @param {String} input The domain name or email address to convert, as a\n\t * Unicode string.\n\t * @returns {String} The Punycode representation of the given domain name or\n\t * email address.\n\t */\n\tfunction toASCII(input) {\n\t\treturn mapDomain(input, function(string) {\n\t\t\treturn regexNonASCII.test(string)\n\t\t\t\t? 'xn--' + encode(string)\n\t\t\t\t: string;\n\t\t});\n\t}\n\n\t/*--------------------------------------------------------------------------*/\n\n\t/** Define the public API */\n\tpunycode = {\n\t\t/**\n\t\t * A string representing the current Punycode.js version number.\n\t\t * @memberOf punycode\n\t\t * @type String\n\t\t */\n\t\t'version': '1.4.1',\n\t\t/**\n\t\t * An object of methods to convert from JavaScript's internal character\n\t\t * representation (UCS-2) to Unicode code points, and back.\n\t\t * @see <https://mathiasbynens.be/notes/javascript-encoding>\n\t\t * @memberOf punycode\n\t\t * @type Object\n\t\t */\n\t\t'ucs2': {\n\t\t\t'decode': ucs2decode,\n\t\t\t'encode': ucs2encode\n\t\t},\n\t\t'decode': decode,\n\t\t'encode': encode,\n\t\t'toASCII': toASCII,\n\t\t'toUnicode': toUnicode\n\t};\n\n\t/** Expose `punycode` */\n\t// Some AMD build optimizers, like r.js, check for specific condition patterns\n\t// like the following:\n\tif (\n\t\ttrue\n\t) {\n\t\t!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {\n\t\t\treturn punycode;\n\t\t}).call(exports, __webpack_require__, exports, module),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\t} else {}\n\n}(this));\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module), __webpack_require__(/*! ./../../../webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./node_modules/node-libs-browser/node_modules/punycode/punycode.js?");

/***/ }),

/***/ "./node_modules/pug-runtime/index.js":
/*!*******************************************!*\
  !*** ./node_modules/pug-runtime/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar pug_has_own_property = Object.prototype.hasOwnProperty;\n\n/**\n * Merge two attribute objects giving precedence\n * to values in object `b`. Classes are special-cased\n * allowing for arrays and merging/joining appropriately\n * resulting in a string.\n *\n * @param {Object} a\n * @param {Object} b\n * @return {Object} a\n * @api private\n */\n\nexports.merge = pug_merge;\nfunction pug_merge(a, b) {\n  if (arguments.length === 1) {\n    var attrs = a[0];\n    for (var i = 1; i < a.length; i++) {\n      attrs = pug_merge(attrs, a[i]);\n    }\n    return attrs;\n  }\n\n  for (var key in b) {\n    if (key === 'class') {\n      var valA = a[key] || [];\n      a[key] = (Array.isArray(valA) ? valA : [valA]).concat(b[key] || []);\n    } else if (key === 'style') {\n      var valA = pug_style(a[key]);\n      valA = valA && valA[valA.length - 1] !== ';' ? valA + ';' : valA;\n      var valB = pug_style(b[key]);\n      valB = valB && valB[valB.length - 1] !== ';' ? valB + ';' : valB;\n      a[key] = valA + valB;\n    } else {\n      a[key] = b[key];\n    }\n  }\n\n  return a;\n};\n\n/**\n * Process array, object, or string as a string of classes delimited by a space.\n *\n * If `val` is an array, all members of it and its subarrays are counted as\n * classes. If `escaping` is an array, then whether or not the item in `val` is\n * escaped depends on the corresponding item in `escaping`. If `escaping` is\n * not an array, no escaping is done.\n *\n * If `val` is an object, all the keys whose value is truthy are counted as\n * classes. No escaping is done.\n *\n * If `val` is a string, it is counted as a class. No escaping is done.\n *\n * @param {(Array.<string>|Object.<string, boolean>|string)} val\n * @param {?Array.<string>} escaping\n * @return {String}\n */\nexports.classes = pug_classes;\nfunction pug_classes_array(val, escaping) {\n  var classString = '', className, padding = '', escapeEnabled = Array.isArray(escaping);\n  for (var i = 0; i < val.length; i++) {\n    className = pug_classes(val[i]);\n    if (!className) continue;\n    escapeEnabled && escaping[i] && (className = pug_escape(className));\n    classString = classString + padding + className;\n    padding = ' ';\n  }\n  return classString;\n}\nfunction pug_classes_object(val) {\n  var classString = '', padding = '';\n  for (var key in val) {\n    if (key && val[key] && pug_has_own_property.call(val, key)) {\n      classString = classString + padding + key;\n      padding = ' ';\n    }\n  }\n  return classString;\n}\nfunction pug_classes(val, escaping) {\n  if (Array.isArray(val)) {\n    return pug_classes_array(val, escaping);\n  } else if (val && typeof val === 'object') {\n    return pug_classes_object(val);\n  } else {\n    return val || '';\n  }\n}\n\n/**\n * Convert object or string to a string of CSS styles delimited by a semicolon.\n *\n * @param {(Object.<string, string>|string)} val\n * @return {String}\n */\n\nexports.style = pug_style;\nfunction pug_style(val) {\n  if (!val) return '';\n  if (typeof val === 'object') {\n    var out = '';\n    for (var style in val) {\n      /* istanbul ignore else */\n      if (pug_has_own_property.call(val, style)) {\n        out = out + style + ':' + val[style] + ';';\n      }\n    }\n    return out;\n  } else {\n    return val + '';\n  }\n};\n\n/**\n * Render the given attribute.\n *\n * @param {String} key\n * @param {String} val\n * @param {Boolean} escaped\n * @param {Boolean} terse\n * @return {String}\n */\nexports.attr = pug_attr;\nfunction pug_attr(key, val, escaped, terse) {\n  if (val === false || val == null || !val && (key === 'class' || key === 'style')) {\n    return '';\n  }\n  if (val === true) {\n    return ' ' + (terse ? key : key + '=\"' + key + '\"');\n  }\n  if (typeof val.toJSON === 'function') {\n    val = val.toJSON();\n  }\n  if (typeof val !== 'string') {\n    val = JSON.stringify(val);\n    if (!escaped && val.indexOf('\"') !== -1) {\n      return ' ' + key + '=\\'' + val.replace(/'/g, '&#39;') + '\\'';\n    }\n  }\n  if (escaped) val = pug_escape(val);\n  return ' ' + key + '=\"' + val + '\"';\n};\n\n/**\n * Render the given attributes object.\n *\n * @param {Object} obj\n * @param {Object} terse whether to use HTML5 terse boolean attributes\n * @return {String}\n */\nexports.attrs = pug_attrs;\nfunction pug_attrs(obj, terse){\n  var attrs = '';\n\n  for (var key in obj) {\n    if (pug_has_own_property.call(obj, key)) {\n      var val = obj[key];\n\n      if ('class' === key) {\n        val = pug_classes(val);\n        attrs = pug_attr(key, val, false, terse) + attrs;\n        continue;\n      }\n      if ('style' === key) {\n        val = pug_style(val);\n      }\n      attrs += pug_attr(key, val, false, terse);\n    }\n  }\n\n  return attrs;\n};\n\n/**\n * Escape the given string of `html`.\n *\n * @param {String} html\n * @return {String}\n * @api private\n */\n\nvar pug_match_html = /[\"&<>]/;\nexports.escape = pug_escape;\nfunction pug_escape(_html){\n  var html = '' + _html;\n  var regexResult = pug_match_html.exec(html);\n  if (!regexResult) return _html;\n\n  var result = '';\n  var i, lastIndex, escape;\n  for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {\n    switch (html.charCodeAt(i)) {\n      case 34: escape = '&quot;'; break;\n      case 38: escape = '&amp;'; break;\n      case 60: escape = '&lt;'; break;\n      case 62: escape = '&gt;'; break;\n      default: continue;\n    }\n    if (lastIndex !== i) result += html.substring(lastIndex, i);\n    lastIndex = i + 1;\n    result += escape;\n  }\n  if (lastIndex !== i) return result + html.substring(lastIndex, i);\n  else return result;\n};\n\n/**\n * Re-throw the given `err` in context to the\n * the pug in `filename` at the given `lineno`.\n *\n * @param {Error} err\n * @param {String} filename\n * @param {String} lineno\n * @param {String} str original source\n * @api private\n */\n\nexports.rethrow = pug_rethrow;\nfunction pug_rethrow(err, filename, lineno, str){\n  if (!(err instanceof Error)) throw err;\n  if ((typeof window != 'undefined' || !filename) && !str) {\n    err.message += ' on line ' + lineno;\n    throw err;\n  }\n  try {\n    str = str || __webpack_require__(/*! fs */ 0).readFileSync(filename, 'utf8')\n  } catch (ex) {\n    pug_rethrow(err, null, lineno)\n  }\n  var context = 3\n    , lines = str.split('\\n')\n    , start = Math.max(lineno - context, 0)\n    , end = Math.min(lines.length, lineno + context);\n\n  // Error context\n  var context = lines.slice(start, end).map(function(line, i){\n    var curr = i + start + 1;\n    return (curr == lineno ? '  > ' : '    ')\n      + curr\n      + '| '\n      + line;\n  }).join('\\n');\n\n  // Alter exception message\n  err.path = filename;\n  err.message = (filename || 'Pug') + ':' + lineno\n    + '\\n' + context + '\\n\\n' + err.message;\n  throw err;\n};\n\n\n//# sourceURL=webpack:///./node_modules/pug-runtime/index.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\r\n\r\n// This works in non-strict mode\r\ng = (function() {\r\n\treturn this;\r\n})();\r\n\r\ntry {\r\n\t// This works if eval is allowed (see CSP)\r\n\tg = g || Function(\"return this\")() || (1, eval)(\"this\");\r\n} catch (e) {\r\n\t// This works if the window reference is available\r\n\tif (typeof window === \"object\") g = window;\r\n}\r\n\r\n// g can still be undefined, but nothing to do about it...\r\n// We return undefined, instead of nothing here, so it's\r\n// easier to handle this case. if(!global) { ...}\r\n\r\nmodule.exports = g;\r\n\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(module) {\r\n\tif (!module.webpackPolyfill) {\r\n\t\tmodule.deprecate = function() {};\r\n\t\tmodule.paths = [];\r\n\t\t// module.parent = undefined by default\r\n\t\tif (!module.children) module.children = [];\r\n\t\tObject.defineProperty(module, \"loaded\", {\r\n\t\t\tenumerable: true,\r\n\t\t\tget: function() {\r\n\t\t\t\treturn module.l;\r\n\t\t\t}\r\n\t\t});\r\n\t\tObject.defineProperty(module, \"id\", {\r\n\t\t\tenumerable: true,\r\n\t\t\tget: function() {\r\n\t\t\t\treturn module.i;\r\n\t\t\t}\r\n\t\t});\r\n\t\tmodule.webpackPolyfill = 1;\r\n\t}\r\n\treturn module;\r\n};\r\n\n\n//# sourceURL=webpack:///(webpack)/buildin/module.js?");

/***/ }),

/***/ "./src/js/controllers/FormController.js":
/*!**********************************************!*\
  !*** ./src/js/controllers/FormController.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return FormController; });\n/* harmony import */ var _modules_Bus_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/Bus.js */ \"./src/js/modules/Bus.js\");\n\n\nclass FormController {\n    constructor(formName, Validator = null) {\n        if (Validator) {\n            this._validator = new Validator();\n        }\n\n        this._formName = formName;\n\n    }\n\n    callbackSubmit(event) {\n        event.preventDefault();\n        console.log(this);\n\n        if (this._validator && !this._validator.validate(event.target)) {\n            return;\n        }\n\n        // TODO сделать валидации \n        // TODO универсальный сборщик данныз из формы\n\n\t\tconst username = form.elements[ 'username' ].value;\n\t\tconst email = form.elements[ 'email' ].value;\n\t\tconst password = form.elements[ 'password' ].value;\n\t\tconst passwordRepeat = form.elements[ 'password_repeat' ].value;\n\n        _modules_Bus_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].emit(\n            \"submit-data-\" + this._formName,\n            {\n                username,\n                email,\n                password\n            }\n        );\n    }\n}\n\n//# sourceURL=webpack:///./src/js/controllers/FormController.js?");

/***/ }),

/***/ "./src/js/controllers/NavigationController.js":
/*!****************************************************!*\
  !*** ./src/js/controllers/NavigationController.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return NavigationController; });\n/* harmony import */ var _modules_Router_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/Router.js */ \"./src/js/modules/Router.js\");\n/* harmony import */ var _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/Bus.js */ \"./src/js/modules/Bus.js\");\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ \"./src/js/utils.js\");\n\n\n\n\nclass NavigationController {\n    keyPressedCallback(event) {\n        let link = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__[\"getEventTarget\"])(event.target);\n        if (!link) {\n            return;\n        }\n\n        event.preventDefault();\n\n        if (link.dataset.href === \"/logout\") {\n            _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].emit(\"user-logout\")\n        }\n\n        _modules_Router_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].open(link.dataset.href);\n    }\n}\n\n//# sourceURL=webpack:///./src/js/controllers/NavigationController.js?");

/***/ }),

/***/ "./src/js/models/UserModel.js":
/*!************************************!*\
  !*** ./src/js/models/UserModel.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return UserModel; });\n/* harmony import */ var _modules_ajax_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/ajax.js */ \"./src/js/modules/ajax.js\");\n/* harmony import */ var _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/Bus.js */ \"./src/js/modules/Bus.js\");\n\n\n\n\n// TODO вместо is_authenticated сделать функцию вовзращающую Promise\n\nclass UserModel {\n    static Fetch() {\n        if (UserModel._data !== null) { // если пользователь уже был получен\n            _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].emit('done-get-user', UserModel._data);\n            return;\n        }\n\n        console.log(\"server fetchiung user\", UserModel._data);\n\n        _modules_ajax_js__WEBPACK_IMPORTED_MODULE_0__[\"fetchModule\"].doGet({path: '/profiles/current'})\n            .then( response => {\n                if (response.status === 200) {\n                    return response.json();\n                }\n                return Promise.reject(new Error('not auth'));\n            })\n            .then( (user) => {\n                console.log('FETCH USER THEN');\n                console.log(user);\n                UserModel._data = user;\n                UserModel._data.is_authenticated = true;\n                _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].emit('done-get-user', UserModel._data);\n            })\n            .catch( (err) => {\n                console.log('FETCH USER CATCH');\n                console.log(err);\n                UserModel._data = {is_authenticated: false};\n                _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].emit('done-get-user', UserModel._data);\n            });\n    }\n\n    static Register(data) {\n        return _modules_ajax_js__WEBPACK_IMPORTED_MODULE_0__[\"fetchModule\"].doPost({path: '/auth/register', body: data})\n            .then( response => {\n                if (response.status === 400) {\n                    return Promise.reject(response.status);\n                }\n                if (response.status === 200) {\n                    UserModel._data = null;\n                    Emitter.emit(\"wipe-views\");\n                }\n            })\n            .catch( (err) => {\n                console.log(err);\n            });\n    }\n\n    static Signin(data) {\n        return _modules_ajax_js__WEBPACK_IMPORTED_MODULE_0__[\"fetchModule\"].doPost({path: '/auth/login', body: data})\n            .then( response => {\n                if (response.status === 400) {\n                    return Promise.reject(response.status);\n                }\n                if (resp.status === 200) {\n                    UserModel._data = null;\n                    Emitter.emit(\"wipe-views\");\n                }\n            })\n            .catch( (err) => {\n                console.log(err);\n            });\n    }\n}\n\n//# sourceURL=webpack:///./src/js/models/UserModel.js?");

/***/ }),

/***/ "./src/js/modules/Bus.js":
/*!*******************************!*\
  !*** ./src/js/modules/Bus.js ***!
  \*******************************/
/*! exports provided: Bus, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Bus\", function() { return Bus; });\nclass Bus {\n    constructor() {\n        this._listeners = {};\n    }\n\n    on(event, callback) {\n        if (!this._listeners[event]) {\n            this._listeners[event] = [];\n        }\n        this._listeners[event].push({callback});\n    }\n\n    off(event, callback) {\n        this._listeners[event] = this._listeners[event].filter( (listener) => {\n            return listener !== callback;\n        });\n    }\n\n    emit(event, data) {\n        console.log(this._listeners[event]);\n        this._listeners[event].forEach((listener) => {\n            listener.callback(data); \n        });\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (new Bus());\n\n//# sourceURL=webpack:///./src/js/modules/Bus.js?");

/***/ }),

/***/ "./src/js/modules/Router.js":
/*!**********************************!*\
  !*** ./src/js/modules/Router.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Bus_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bus.js */ \"./src/js/modules/Bus.js\");\n/* harmony import */ var punycode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! punycode */ \"./node_modules/node-libs-browser/node_modules/punycode/punycode.js\");\n/* harmony import */ var punycode__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(punycode__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nclass Router {\n    constructor() {\n        this._routes = {};\n        this._currentRoute = null;\n    }\n\n    /**\n     * Register a new path\n     */\n    register(path, View) {\n        this._routes[path] = {\n            View: View,\n            viewEntity: null\n        };\n\n        return this;\n    }\n\n    /**\n     * Run action by path\n     * \n     * @return {Router}\n     */\n    open(path = '/') {\n        let fullPath = path;\n        let aPath = path.split('/');\n        path = '/' + aPath[1];\n        \n        if (!this._routes[path]) {\n            console.log('Router.js: no such page');\n            return;\n        }\n        console.log(this._routes[path]);\n\n        if (this._routes[path].viewEntity === null) {\n            console.log('ROUTER if 1');\n            this._routes[path].viewEntity = new this._routes[path].View();\n        }\n\n        // TODO открытие лидерборда\n\n        window.history.pushState({lastRoute: this._currentRoute}, \"\", fullPath);\n        this._currentRoute = path;\n\n        if (!this._routes[path].viewEntity.isShown) {\n            console.log('ROUTER if 3');\n            Object.values(this._routes).forEach(({viewEntity}) => {\n                if (viewEntity && viewEntity.isShown) {\n                    console.log('VIEW IS SHOWN', viewEntity);\n                    viewEntity.hide();\n                }     \n            });\n\n            this._routes[path].viewEntity.show();\n        } else {\n            if (path === this._currentRoute) {\n                this.rerender();\n            }\n        }\n        return this;\n    }\n\n\n    rerender() {\n        this._routes[this._currentRoute].viewEntity.show();\n    }\n\n    getPathTo(View) {\n        for (let key in Object.getOwnPropertyNames(this._routes)) {\n            if (this._routes[key].View === View) {\n                return key;\n            }\n        }\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (new Router());\n\nwindow.addEventListener('popstate', function (event) {\n    event.preventDefault();\n\n    if (event.state.lastRoute) {\n        router.open(event.state.lastRoute);\n    }\n\n});\n\n//# sourceURL=webpack:///./src/js/modules/Router.js?");

/***/ }),

/***/ "./src/js/modules/ajax.js":
/*!********************************!*\
  !*** ./src/js/modules/ajax.js ***!
  \********************************/
/*! exports provided: fetchModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fetchModule\", function() { return fetchModule; });\nconst serverUrl = 'https://strategio-api.now.sh';\n\nclass fetchModule {\n\tstatic _ajax ({ method = 'GET', path = '/', body } = {}) {\n\t\tconst url = serverUrl + path;\n\n\t\tconst options = {\n\t\t\tmode: 'cors',\n\t\t\tcredentials: 'include',\n\t\t\tmethod: method\n\t\t};\n\n\t\tif (body) {\n\t\t\toptions.headers = { 'Content-Type': 'application/json; charset=utf-8' };\n\t\t\toptions.body = JSON.stringify(body);\n\t\t}\n\t\treturn fetch(url, options);\n\t}\n\n\tstatic doGet (params = {}) {\n\t\treturn this._ajax({ ...params, method: 'GET' });\n\t}\n\n\tstatic doPost (params = {}) {\n\t\treturn this._ajax({ ...params, method: 'POST' });\n\t}\n\n\tstatic doDelete (params = {}) {\n\t\treturn this._ajax({ ...params, method: 'DELETE' });\n\t}\n\n\tstatic doPut (params = {}) {\n\t\treturn this._ajax({ ...params, method: 'PUT' });\n\t}\n}\n\n\n//# sourceURL=webpack:///./src/js/modules/ajax.js?");

/***/ }),

/***/ "./src/js/script.js":
/*!**************************!*\
  !*** ./src/js/script.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_Router_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/Router.js */ \"./src/js/modules/Router.js\");\n/* harmony import */ var _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/Bus.js */ \"./src/js/modules/Bus.js\");\n/* harmony import */ var _models_UserModel_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models/UserModel.js */ \"./src/js/models/UserModel.js\");\n/* harmony import */ var _views_MenuView_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views/MenuView.js */ \"./src/js/views/MenuView.js\");\n/* harmony import */ var _views_SignupView_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./views/SignupView.js */ \"./src/js/views/SignupView.js\");\n/* harmony import */ var _views_SigninView_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./views/SigninView.js */ \"./src/js/views/SigninView.js\");\n/* harmony import */ var _views_ProfileView_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./views/ProfileView.js */ \"./src/js/views/ProfileView.js\");\n\n\n\n\n\n\n\n\n\n_models_UserModel_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]._data = null;\n\n_modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].on('get-user', () => {_models_UserModel_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].Fetch()});\n_modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].on('submit-data-signup', (data) => {_models_UserModel_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].Register(data)});\n_modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].on('submit-data-signin', (data) => {_models_UserModel_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].Signin(data)});\n_modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].on('wipe-views', () => {\n    _modules_Router_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].open('/');\n    _modules_Router_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].rerender();\n});\n\n\nfunction main() {\n    _modules_Router_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\n        .register('/', _views_MenuView_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])\n        .register('/signup', _views_SignupView_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"])\n        .register('/signin', _views_SigninView_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"])\n        .register('/profile', _views_ProfileView_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"]);\n        \n    _modules_Router_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].open(window.location.pathname);\n}\n\nmain();\n\n//# sourceURL=webpack:///./src/js/script.js?");

/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/*! exports provided: getEventTarget */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getEventTarget\", function() { return getEventTarget; });\nfunction getEventTarget(target) {\n    if (!(target instanceof HTMLAnchorElement)) {\n        target = target.closest(\"a\");\n\n        if (!target) {\n            return null;\n        }\n    }\n\n    return target;\n}\n\n//# sourceURL=webpack:///./src/js/utils.js?");

/***/ }),

/***/ "./src/js/views/BaseView.js":
/*!**********************************!*\
  !*** ./src/js/views/BaseView.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return BaseView; });\nclass BaseView {\n    constructor() {\n        console.log('BASE CONSTRUCTOR');\n        this.viewDiv = document.createElement('div');\n        BaseView.rootToRender.appendChild(this.viewDiv);\n        this.viewDiv.hidden = true;\n    }\n\n    get isShown() {\n        return this.viewDiv.hidden === false;\n    }\n\n    static get rootToRender() {\n        return document.getElementById('root');\n    }\n\n    show() {\n        console.log('BASE SHOW');\n        this.viewDiv.hidden = false;\n    }\n\n    hide() {\n        this.viewDiv.hidden = true;\n    }\n\n    render() {\n        this.viewDiv.innerHTML = '';\n    }\n}\n\n//# sourceURL=webpack:///./src/js/views/BaseView.js?");

/***/ }),

/***/ "./src/js/views/MenuView.js":
/*!**********************************!*\
  !*** ./src/js/views/MenuView.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return MenuView; });\n/* harmony import */ var _BaseView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseView.js */ \"./src/js/views/BaseView.js\");\n/* harmony import */ var _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/Bus.js */ \"./src/js/modules/Bus.js\");\n/* harmony import */ var _modules_Router_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/Router.js */ \"./src/js/modules/Router.js\");\n/* harmony import */ var _controllers_NavigationController_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../controllers/NavigationController.js */ \"./src/js/controllers/NavigationController.js\");\n\n\n\n\n\nconst menu = __webpack_require__(/*! ./templates/menu.pug */ \"./src/js/views/templates/menu.pug\");\n\nconst notAuthLinks = [\n    {\n        label: 'Вход',\n        href: '/signin'        \n    },\n    {\n        label: 'Регистрация',\n        href: '/signup'        \n    },\n    {\n        label: 'Лидеры',\n        href: '/leaders'        \n    }\n]\n\n\nconst authLinks = [\n    {\n        label: 'Лидеры',\n        href: '/leaders'        \n    },\n    {\n        label: 'Мой профиль',\n        href: '/profile'        \n    },\n    {\n        label: 'Выйти',\n        href: '/signout'        \n    }\n]\n\n\n\nclass MenuView extends _BaseView_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor() {\n        console.log('MENU CONSTRUCTOR');\n        super()\n        _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].on('done-get-user', this.render.bind(this));\n    }\n\n    show() {\n        console.log('MENU SHOW');\n        _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].emit('get-user');\n        super.show();\n    }\n\n    render(user) {\n        console.log('MENU RENDER');\n        super.render();\n        this._navigationController = new _controllers_NavigationController_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"]();\n\n        let main = document.createElement('main');\n        if (user.is_authenticated) {\n            main.innerHTML += menu({values: authLinks})\n        } else {\n            main.innerHTML += menu({values: notAuthLinks})\n        }\n        this.viewDiv.appendChild(main);\n\n        this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);\n        _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].off('done-get-user', this.render.bind(this));\n    }\n}\n\n\n//# sourceURL=webpack:///./src/js/views/MenuView.js?");

/***/ }),

/***/ "./src/js/views/ProfileView.js":
/*!*************************************!*\
  !*** ./src/js/views/ProfileView.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ProfileView; });\n/* harmony import */ var _BaseView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseView.js */ \"./src/js/views/BaseView.js\");\n/* harmony import */ var _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/Bus.js */ \"./src/js/modules/Bus.js\");\n/* harmony import */ var _controllers_NavigationController_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../controllers/NavigationController.js */ \"./src/js/controllers/NavigationController.js\");\n\n\n\nconst profileTmpl = __webpack_require__(/*! ./templates/profile.pug */ \"./src/js/views/templates/profile.pug\");\nconst header = __webpack_require__(/*! ./templates/header.pug */ \"./src/js/views/templates/header.pug\");\n\n\nclass ProfileView extends _BaseView_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor() {\n        console.log('PROFILE CONSTRUCTOR');        \n        super();\n        _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].on('done-get-user', this.render.bind(this));\n    }\n\n    show() {\n        _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].emit('get-user');\n        console.log('PROFILE SHOW');\n        super.show();\n    } \n     \n    render(user) {\n        console.log('PROFILE RENDER');\n        super.render();\n\n        if (user.is_authenticated) {\n            console.log(\"You are not logged in!\");\n            return;\n        }\n\n        this.viewDiv.innerHTML += header({title: 'Профиль'});\n\n        this._navigationController = new _controllers_NavigationController_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]();\n\n        let main = document.createElement('main');\n        main.innerHTML += profileTmpl({usr: user});\n\n        this.viewDiv .appendChild(main);\n\n        this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);\n\n        _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].off('done-get-user', this.render.bind(this));\n    }\n\n}\n\n\n//# sourceURL=webpack:///./src/js/views/ProfileView.js?");

/***/ }),

/***/ "./src/js/views/SigninView.js":
/*!************************************!*\
  !*** ./src/js/views/SigninView.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SigninView; });\n/* harmony import */ var _BaseView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseView.js */ \"./src/js/views/BaseView.js\");\n/* harmony import */ var _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/Bus.js */ \"./src/js/modules/Bus.js\");\n/* harmony import */ var _modules_Router_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/Router.js */ \"./src/js/modules/Router.js\");\n/* harmony import */ var _controllers_NavigationController_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../controllers/NavigationController.js */ \"./src/js/controllers/NavigationController.js\");\n/* harmony import */ var _controllers_FormController_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../controllers/FormController.js */ \"./src/js/controllers/FormController.js\");\n\n\n\n\n\nconst signinForm = __webpack_require__(/*! ./templates/login.pug */ \"./src/js/views/templates/login.pug\");\nconst header = __webpack_require__(/*! ./templates/header.pug */ \"./src/js/views/templates/header.pug\");\n\n\nclass SigninView extends _BaseView_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor() {\n        console.log('LOGIN CONSTRUCTOR');        \n        super();\n        _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].on('done-get-user', this.render.bind(this));\n    }\n\n    show() {\n        _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].emit('get-user');\n        console.log('LOGIN SHOW');\n        super.show();\n    }\n\n    render(user) {\n        console.log('LOGIN RENDER');\n        super.render();\n\n        if (user.is_authenticated) {\n            console.log(\"You are already registered and even logged in!\");\n            return;\n        }\n\n        this.viewDiv.innerHTML += header({title: 'Вход'});\n\n        this._navigationController = new _controllers_NavigationController_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"]();\n        this._formController = new _controllers_FormController_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"]('signin'); \n\n        let main = document.createElement('main');\n        main.innerHTML += signinForm();\n\n        this.viewDiv .appendChild(main);\n\n        main.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));\n        this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);\n\n        _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].off('done-get-user', this.render.bind(this));\n    }\n}\n\n//# sourceURL=webpack:///./src/js/views/SigninView.js?");

/***/ }),

/***/ "./src/js/views/SignupView.js":
/*!************************************!*\
  !*** ./src/js/views/SignupView.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SignupView; });\n/* harmony import */ var _BaseView_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseView.js */ \"./src/js/views/BaseView.js\");\n/* harmony import */ var _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/Bus.js */ \"./src/js/modules/Bus.js\");\n/* harmony import */ var _modules_Router_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/Router.js */ \"./src/js/modules/Router.js\");\n/* harmony import */ var _controllers_NavigationController_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../controllers/NavigationController.js */ \"./src/js/controllers/NavigationController.js\");\n/* harmony import */ var _controllers_FormController_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../controllers/FormController.js */ \"./src/js/controllers/FormController.js\");\n\n\n\n\n\nconst signupForm = __webpack_require__(/*! ./templates/register.pug */ \"./src/js/views/templates/register.pug\");\nconst header = __webpack_require__(/*! ./templates/header.pug */ \"./src/js/views/templates/header.pug\");\n\n\nclass SignupView extends _BaseView_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n    constructor() {\n        console.log('REGISTER CONSTRUCTOR');\n        super();\n        _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].on('done-get-user', this.render.bind(this));\n    }\n\n    show() {\n        console.log('REGISTER SHOW');\n        _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].emit('get-user');\n        super.show();\n    }\n\n    render(user) {\n        console.log('REGISTER RENDER');\n        super.render();\n\n        if (user.is_authenticated) {\n            console.log(\"You are already registered and even logged in!\");\n            return;\n        }\n\n        this.viewDiv.innerHTML += header({title: 'Регистрация'});\n\n        this._navigationController = new _controllers_NavigationController_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"]();\n        this._formController = new _controllers_FormController_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"](\"signup\"); \n\n        let main = document.createElement('main');\n        main.innerHTML += signupForm();\n\n        this.viewDiv .appendChild(main);\n\n        main.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));\n        this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);\n\n        _modules_Bus_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].off('done-get-user', this.render.bind(this));\n    }\n}\n\n//# sourceURL=webpack:///./src/js/views/SignupView.js?");

/***/ }),

/***/ "./src/js/views/templates/header.pug":
/*!*******************************************!*\
  !*** ./src/js/views/templates/header.pug ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var pug = __webpack_require__(/*! ../../../../node_modules/pug-runtime/index.js */ \"./node_modules/pug-runtime/index.js\");\n\nfunction template(locals) {var pug_html = \"\", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (title) {pug_html = pug_html + \"\\u003Cdiv class=\\\"block\\\" id=\\\"header\\\"\\u003E\\u003Ch1\\u003E\\u003Ca href=\\\"\\u002F\\\" data-href=\\\"\\u002F\\\"\\u003EГлавная\\u003C\\u002Fa\\u003E\\u003C\\u002Fh1\\u003E\\u003Ch1\\u003E\" + (pug.escape(null == (pug_interp = title) ? \"\" : pug_interp)) + \"\\u003C\\u002Fh1\\u003E\\u003Chr\\u003E\\u003C\\u002Fdiv\\u003E\";}.call(this,\"title\" in locals_for_with?locals_for_with.title:typeof title!==\"undefined\"?title:undefined));;return pug_html;};\nmodule.exports = template;\n\n//# sourceURL=webpack:///./src/js/views/templates/header.pug?");

/***/ }),

/***/ "./src/js/views/templates/login.pug":
/*!******************************************!*\
  !*** ./src/js/views/templates/login.pug ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var pug = __webpack_require__(/*! ../../../../node_modules/pug-runtime/index.js */ \"./node_modules/pug-runtime/index.js\");\n\nfunction template(locals) {var pug_html = \"\", pug_mixins = {}, pug_interp;pug_html = pug_html + \"\\u003Cdiv\\u003E\\u003Cform id=\\\"signin\\\"\\u003E\\u003Cp\\u003E\\u003Cb\\u003EUsername\\u003C\\u002Fb\\u003E\\u003Cdiv\\u003E\\u003Cinput name=\\\"username\\\" type=\\\"text\\\"\\u003E\\u003C\\u002Fdiv\\u003E\\u003C\\u002Fp\\u003E\\u003Cp\\u003E\\u003Cb\\u003EPassword\\u003C\\u002Fb\\u003E\\u003Cdiv\\u003E\\u003Cinput name=\\\"password\\\" type=\\\"password\\\"\\u003E\\u003C\\u002Fdiv\\u003E\\u003C\\u002Fp\\u003E\\u003Cinput name=\\\"submit\\\" type=\\\"submit\\\"\\u003E\\u003C\\u002Fform\\u003E\\u003C\\u002Fdiv\\u003E\";;return pug_html;};\nmodule.exports = template;\n\n//# sourceURL=webpack:///./src/js/views/templates/login.pug?");

/***/ }),

/***/ "./src/js/views/templates/menu.pug":
/*!*****************************************!*\
  !*** ./src/js/views/templates/menu.pug ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var pug = __webpack_require__(/*! ../../../../node_modules/pug-runtime/index.js */ \"./node_modules/pug-runtime/index.js\");\n\nfunction template(locals) {var pug_html = \"\", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (values) {pug_html = pug_html + \"\\u003Ch1\\u003EМеню\\u003C\\u002Fh1\\u003E\";\n// iterate values\n;(function(){\n  var $$obj = values;\n  if ('number' == typeof $$obj.length) {\n      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {\n        var val = $$obj[pug_index0];\npug_html = pug_html + \"\\u003Cdiv\\u003E\\u003Ca\" + (pug.attr(\"href\", val.href, true, true)+pug.attr(\"data-href\", val.href, true, true)) + \"\\u003E\" + (pug.escape(null == (pug_interp = val.label) ? \"\" : pug_interp)) + \"\\u003C\\u002Fa\\u003E\\u003C\\u002Fdiv\\u003E\";\n      }\n  } else {\n    var $$l = 0;\n    for (var pug_index0 in $$obj) {\n      $$l++;\n      var val = $$obj[pug_index0];\npug_html = pug_html + \"\\u003Cdiv\\u003E\\u003Ca\" + (pug.attr(\"href\", val.href, true, true)+pug.attr(\"data-href\", val.href, true, true)) + \"\\u003E\" + (pug.escape(null == (pug_interp = val.label) ? \"\" : pug_interp)) + \"\\u003C\\u002Fa\\u003E\\u003C\\u002Fdiv\\u003E\";\n    }\n  }\n}).call(this);\n}.call(this,\"values\" in locals_for_with?locals_for_with.values:typeof values!==\"undefined\"?values:undefined));;return pug_html;};\nmodule.exports = template;\n\n//# sourceURL=webpack:///./src/js/views/templates/menu.pug?");

/***/ }),

/***/ "./src/js/views/templates/profile.pug":
/*!********************************************!*\
  !*** ./src/js/views/templates/profile.pug ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var pug = __webpack_require__(/*! ../../../../node_modules/pug-runtime/index.js */ \"./node_modules/pug-runtime/index.js\");\n\nfunction template(locals) {var pug_html = \"\", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (usr) {pug_html = pug_html + \"\\u003Cdiv\\u003E\\u003Cdiv\\u003E\\u003Ch3\\u003E\" + (pug.escape(null == (pug_interp = 'Username: ' + usr.username) ? \"\" : pug_interp)) + \"\\u003C\\u002Fh3\\u003E\\u003C\\u002Fdiv\\u003E\\u003Cdiv\\u003E\\u003Ch3\\u003E\" + (pug.escape(null == (pug_interp = 'Email: ' + usr.email) ? \"\" : pug_interp)) + \"\\u003C\\u002Fh3\\u003E\\u003C\\u002Fdiv\\u003E\\u003Cdiv\\u003E\\u003Ch3\\u003E\" + (pug.escape(null == (pug_interp = 'Очки: ' + usr.score) ? \"\" : pug_interp)) + \"\\u003C\\u002Fh3\\u003E\\u003C\\u002Fdiv\\u003E\\u003Cp\\u003E\\u003Ca href=\\\"\\u002Fchange\\\" data-href=\\\"\\u002Fchange\\\"\\u003EИзменить данные\\u003C\\u002Fa\\u003E\\u003C\\u002Fp\\u003E\\u003Cp\\u003E\\u003Ca href=\\\"\\u002Fsignout\\\" data-href=\\\"\\u002Fsignout\\\"\\u003EВыйти\\u003C\\u002Fa\\u003E\\u003C\\u002Fp\\u003E\\u003C\\u002Fdiv\\u003E\";}.call(this,\"usr\" in locals_for_with?locals_for_with.usr:typeof usr!==\"undefined\"?usr:undefined));;return pug_html;};\nmodule.exports = template;\n\n//# sourceURL=webpack:///./src/js/views/templates/profile.pug?");

/***/ }),

/***/ "./src/js/views/templates/register.pug":
/*!*********************************************!*\
  !*** ./src/js/views/templates/register.pug ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var pug = __webpack_require__(/*! ../../../../node_modules/pug-runtime/index.js */ \"./node_modules/pug-runtime/index.js\");\n\nfunction template(locals) {var pug_html = \"\", pug_mixins = {}, pug_interp;pug_html = pug_html + \"\\u003Cdiv\\u003E\\u003Cform id=\\\"signup\\\"\\u003E\\u003Cp\\u003E\\u003Cb\\u003EUsername\\u003C\\u002Fb\\u003E\\u003Cdiv\\u003E\\u003Cinput name=\\\"username\\\" type=\\\"text\\\"\\u003E\\u003C\\u002Fdiv\\u003E\\u003C\\u002Fp\\u003E\\u003Cp\\u003E\\u003Cb\\u003EEmail\\u003C\\u002Fb\\u003E\\u003Cdiv\\u003E\\u003Cinput name=\\\"email\\\" type=\\\"email\\\"\\u003E\\u003C\\u002Fdiv\\u003E\\u003C\\u002Fp\\u003E\\u003Cp\\u003E\\u003Cb\\u003EPassword\\u003C\\u002Fb\\u003E\\u003Cdiv\\u003E\\u003Cinput name=\\\"password\\\" type=\\\"password\\\"\\u003E\\u003C\\u002Fdiv\\u003E\\u003C\\u002Fp\\u003E\\u003Cp\\u003E\\u003Cb\\u003ERepeat Password\\u003C\\u002Fb\\u003E\\u003Cdiv\\u003E\\u003Cinput name=\\\"password_repeat\\\" type=\\\"password\\\"\\u003E\\u003C\\u002Fdiv\\u003E\\u003C\\u002Fp\\u003E\\u003Cinput name=\\\"submit\\\" type=\\\"submit\\\"\\u003E\\u003C\\u002Fform\\u003E\\u003C\\u002Fdiv\\u003E\";;return pug_html;};\nmodule.exports = template;\n\n//# sourceURL=webpack:///./src/js/views/templates/register.pug?");

/***/ }),

/***/ 0:
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///fs_(ignored)?");

/***/ })

/******/ });