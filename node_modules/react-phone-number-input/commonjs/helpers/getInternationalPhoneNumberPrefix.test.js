"use strict";

var _mocha = require("mocha");
var _chai = require("chai");
var _metadata = _interopRequireDefault(require("libphonenumber-js/min/metadata"));
var _getInternationalPhoneNumberPrefix = _interopRequireDefault(require("./getInternationalPhoneNumberPrefix.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
(0, _mocha.describe)('getInternationalPhoneNumberPrefix', function () {
  (0, _mocha.it)('should prepend leading digits when generating international phone number prefix', function () {
    // No leading digits.
    (0, _chai.expect)((0, _getInternationalPhoneNumberPrefix["default"])('RU', _metadata["default"])).to.equal('+7');

    // The "pre-fill with leading digits on country selection" feature had to be reverted.
    // https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/10#note_1231042367
    // // Has "fixed" leading digits.
    // // https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/10
    // expect(getInternationalPhoneNumberPrefix('AS', metadata)).to.equal('+1684')
  });
});
//# sourceMappingURL=getInternationalPhoneNumberPrefix.test.js.map