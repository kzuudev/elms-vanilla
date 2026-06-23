"use strict";

var _mocha = require("mocha");
var _chai = require("chai");
var _parsePhoneNumberCharacter = _interopRequireDefault(require("./parsePhoneNumberCharacter.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
(0, _mocha.describe)('parsePhoneNumberCharacter', function () {
  (0, _mocha.it)('should work with a new `context` argument in `parsePhoneNumberCharacter()` function (international number)', function () {
    var context = {};
    (0, _chai.expect)((0, _parsePhoneNumberCharacter["default"])('+', undefined, context)).to.equal('+');
    (0, _chai.expect)(context).to.deep.equal({});
    (0, _chai.expect)((0, _parsePhoneNumberCharacter["default"])('1', '+', context)).to.equal('1');
    (0, _chai.expect)(context).to.deep.equal({});
    (0, _chai.expect)((0, _parsePhoneNumberCharacter["default"])('+', '+1', context)).to.equal(undefined);
    (0, _chai.expect)(context).to.deep.equal({
      ignoreRest: true
    });
    (0, _chai.expect)((0, _parsePhoneNumberCharacter["default"])('2', '+1', context)).to.equal(undefined);
    (0, _chai.expect)(context).to.deep.equal({
      ignoreRest: true
    });
  });
  (0, _mocha.it)('should work with a new `context` argument in `parsePhoneNumberCharacter()` function (national number)', function () {
    var context = {};
    (0, _chai.expect)((0, _parsePhoneNumberCharacter["default"])('2', undefined, context)).to.equal('2');
    (0, _chai.expect)(context).to.deep.equal({});
    (0, _chai.expect)((0, _parsePhoneNumberCharacter["default"])('+', '2', context)).to.equal(undefined);
    (0, _chai.expect)(context).to.deep.equal({
      ignoreRest: true
    });
    (0, _chai.expect)((0, _parsePhoneNumberCharacter["default"])('1', '2', context)).to.equal(undefined);
    (0, _chai.expect)(context).to.deep.equal({
      ignoreRest: true
    });
  });
});
//# sourceMappingURL=parsePhoneNumberCharacter.test.js.map