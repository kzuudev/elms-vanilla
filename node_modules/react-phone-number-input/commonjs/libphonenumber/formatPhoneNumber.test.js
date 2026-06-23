"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _mocha = require("mocha");
var _chai = require("chai");
var _formatPhoneNumber2 = _interopRequireWildcard(require("./formatPhoneNumber.js"));
var _metadata = _interopRequireDefault(require("libphonenumber-js/min/metadata"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function call(func, _arguments) {
  var args = Array.prototype.slice.call(_arguments);
  args.push(_metadata["default"]);
  return func.apply(this, args);
}
function formatPhoneNumber() {
  return call(_formatPhoneNumber2["default"], arguments);
}
function formatPhoneNumberIntl() {
  return call(_formatPhoneNumber2.formatPhoneNumberIntl, arguments);
}
(0, _mocha.describe)('formatPhoneNumber', function () {
  (0, _mocha.it)('should format phone numbers', function () {
    (0, _chai.expect)(function () {
      return formatPhoneNumber();
    }).to["throw"]('must be a string');
    // expect(formatPhoneNumber()).to.equal('')
    (0, _chai.expect)(formatPhoneNumber(null)).to.equal('');
    (0, _chai.expect)(formatPhoneNumber('')).to.equal('');
    (0, _chai.expect)(function () {
      return (0, _formatPhoneNumber2["default"])('+1', 'NATIONAL');
    }).to["throw"]('`metadata` argument not passed');
    (0, _chai.expect)(function () {
      return (0, _formatPhoneNumber2["default"])('+12133734253', undefined, _metadata["default"]);
    }).to["throw"]('Unknown "format"');
    (0, _chai.expect)(function () {
      return (0, _formatPhoneNumber2["default"])('+12133734253', '123', _metadata["default"]);
    }).to["throw"]('Unknown "format"');
    (0, _chai.expect)(formatPhoneNumber('+1', 'NATIONAL')).to.equal('');
    (0, _chai.expect)(formatPhoneNumber('+12133734253', 'NATIONAL')).to.equal('(213) 373-4253');
    (0, _chai.expect)(formatPhoneNumber('+12133734253')).to.equal('(213) 373-4253');
    (0, _chai.expect)(formatPhoneNumber('+12133734253', 'INTERNATIONAL')).to.equal('+1 213 373 4253');
    // Deprecated.
    // Legacy `format`s.
    (0, _chai.expect)(formatPhoneNumber('+12133734253', 'National')).to.equal('(213) 373-4253');
    (0, _chai.expect)(formatPhoneNumber('+12133734253', 'International')).to.equal('+1 213 373 4253');
  });
  (0, _mocha.it)('should format international phone numbers', function () {
    (0, _chai.expect)(formatPhoneNumberIntl('+12133734253')).to.equal('+1 213 373 4253');
  });
});
//# sourceMappingURL=formatPhoneNumber.test.js.map