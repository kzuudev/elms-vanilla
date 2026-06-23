"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _mocha = require("mocha");
var _chai = require("chai");
var _isE164Number = _interopRequireWildcard(require("./isE164Number.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
(0, _mocha.describe)('isE164Number', function () {
  (0, _mocha.it)('should tell if a value is an E.164 phone number', function () {
    (0, _chai.expect)((0, _isE164Number["default"])('')).to.equal(false);
    (0, _chai.expect)((0, _isE164Number["default"])('a')).to.equal(false);
    (0, _chai.expect)((0, _isE164Number["default"])('aa')).to.equal(false);
    (0, _chai.expect)((0, _isE164Number["default"])('1')).to.equal(false);
    (0, _chai.expect)((0, _isE164Number["default"])('11')).to.equal(false);
    (0, _chai.expect)((0, _isE164Number["default"])('111')).to.equal(false);
    (0, _chai.expect)((0, _isE164Number["default"])('+')).to.equal(false);
    (0, _chai.expect)((0, _isE164Number["default"])('+1')).to.equal(true);
    (0, _chai.expect)((0, _isE164Number["default"])('+11')).to.equal(true);
    (0, _chai.expect)((0, _isE164Number["default"])('+111')).to.equal(true);
    (0, _chai.expect)((0, _isE164Number["default"])('+1a')).to.equal(false);
    (0, _chai.expect)((0, _isE164Number["default"])('+aa')).to.equal(false);
    (0, _chai.expect)((0, _isE164Number["default"])('+a1')).to.equal(false);
  });
  (0, _mocha.it)('should validate that a value is an E.164 phone number', function () {
    (0, _isE164Number.validateE164Number)('a');
    (0, _isE164Number.validateE164Number)('+78005553535');
  });
});
//# sourceMappingURL=isE164Number.test.js.map