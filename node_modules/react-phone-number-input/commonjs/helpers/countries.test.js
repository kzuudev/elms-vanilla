"use strict";

var _mocha = require("mocha");
var _chai = require("chai");
var _metadata = _interopRequireDefault(require("libphonenumber-js/min/metadata"));
var _countries = require("./countries.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
(0, _mocha.describe)('sortCountryOptions', function () {
  (0, _mocha.it)('should sort country options (no `order`)', function () {
    (0, _chai.expect)((0, _countries.sortCountryOptions)([{
      value: 'RU',
      label: 'Russia'
    }, {
      value: 'US',
      label: 'United States'
    }])).to.deep.equal([{
      value: 'RU',
      label: 'Russia'
    }, {
      value: 'US',
      label: 'United States'
    }]);
  });
  (0, _mocha.it)('should sort country options (with a divider)', function () {
    (0, _chai.expect)((0, _countries.sortCountryOptions)([{
      value: 'RU',
      label: 'Russia'
    }, {
      value: 'US',
      label: 'United States'
    }], ['US', '|', 'RU'])).to.deep.equal([{
      value: 'US',
      label: 'United States'
    }, {
      divider: true
    }, {
      value: 'RU',
      label: 'Russia'
    }]);
  });
  (0, _mocha.it)('should sort country options (with "...")', function () {
    (0, _chai.expect)((0, _countries.sortCountryOptions)([{
      value: 'RU',
      label: 'Russia'
    }, {
      value: 'US',
      label: 'United States'
    }], ['US', '|', '...'])).to.deep.equal([{
      value: 'US',
      label: 'United States'
    }, {
      divider: true
    }, {
      value: 'RU',
      label: 'Russia'
    }]);
  });
  (0, _mocha.it)('should sort country options (with "…")', function () {
    (0, _chai.expect)((0, _countries.sortCountryOptions)([{
      value: 'RU',
      label: 'Russia'
    }, {
      value: 'US',
      label: 'United States'
    }], ['US', '|', '…'])).to.deep.equal([{
      value: 'US',
      label: 'United States'
    }, {
      divider: true
    }, {
      value: 'RU',
      label: 'Russia'
    }]);
  });
  (0, _mocha.it)('should sort country options (with "🌐")', function () {
    (0, _chai.expect)((0, _countries.sortCountryOptions)([{
      value: 'RU',
      label: 'Russia'
    }, {
      label: 'International'
    }, {
      value: 'US',
      label: 'United States'
    }], ['US', '🌐', '…'])).to.deep.equal([{
      value: 'US',
      label: 'United States'
    }, {
      label: 'International'
    }, {
      value: 'RU',
      label: 'Russia'
    }]);
  });
});
(0, _mocha.describe)('getSupportedCountryOptions', function () {
  (0, _mocha.it)('should get supported country options', function () {
    (0, _chai.expect)((0, _countries.getSupportedCountryOptions)(['🌐', 'RU', 'XX', '@', '|', '…', '...', '.'], _metadata["default"])).to.deep.equal(['🌐', 'RU', '|', '…', '...']);
  });
  (0, _mocha.it)('should get supported country options (none supported)', function () {
    (0, _chai.expect)((0, _countries.getSupportedCountryOptions)(['XX', '@', '.'], _metadata["default"])).to.be.undefined;
  });
  (0, _mocha.it)('should get supported country options (none supplied)', function () {
    (0, _chai.expect)((0, _countries.getSupportedCountryOptions)(undefined, _metadata["default"])).to.be.undefined;
  });
  (0, _mocha.it)('should tell is country is supported with error', function () {
    (0, _chai.expect)((0, _countries.isCountrySupportedWithError)('RU', _metadata["default"])).to.equal(true);
    (0, _chai.expect)((0, _countries.isCountrySupportedWithError)('XX', _metadata["default"])).to.equal(false);
  });
  (0, _mocha.it)('should get supported countries', function () {
    (0, _chai.expect)((0, _countries.getSupportedCountries)(['RU', 'XX'], _metadata["default"])).to.deep.equal(['RU']);
  });
  (0, _mocha.it)('should get supported countries (none supported)', function () {
    (0, _chai.expect)((0, _countries.getSupportedCountries)(['XX'], _metadata["default"])).to.be.undefined;
  });
});
//# sourceMappingURL=countries.test.js.map