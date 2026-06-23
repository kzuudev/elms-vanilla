import { describe, it } from 'mocha';
import { expect } from 'chai';
import metadata from 'libphonenumber-js/min/metadata';
import { sortCountryOptions, getSupportedCountryOptions, isCountrySupportedWithError, getSupportedCountries } from './countries.js';
describe('sortCountryOptions', function () {
  it('should sort country options (no `order`)', function () {
    expect(sortCountryOptions([{
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
  it('should sort country options (with a divider)', function () {
    expect(sortCountryOptions([{
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
  it('should sort country options (with "...")', function () {
    expect(sortCountryOptions([{
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
  it('should sort country options (with "…")', function () {
    expect(sortCountryOptions([{
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
  it('should sort country options (with "🌐")', function () {
    expect(sortCountryOptions([{
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
describe('getSupportedCountryOptions', function () {
  it('should get supported country options', function () {
    expect(getSupportedCountryOptions(['🌐', 'RU', 'XX', '@', '|', '…', '...', '.'], metadata)).to.deep.equal(['🌐', 'RU', '|', '…', '...']);
  });
  it('should get supported country options (none supported)', function () {
    expect(getSupportedCountryOptions(['XX', '@', '.'], metadata)).to.be.undefined;
  });
  it('should get supported country options (none supplied)', function () {
    expect(getSupportedCountryOptions(undefined, metadata)).to.be.undefined;
  });
  it('should tell is country is supported with error', function () {
    expect(isCountrySupportedWithError('RU', metadata)).to.equal(true);
    expect(isCountrySupportedWithError('XX', metadata)).to.equal(false);
  });
  it('should get supported countries', function () {
    expect(getSupportedCountries(['RU', 'XX'], metadata)).to.deep.equal(['RU']);
  });
  it('should get supported countries (none supported)', function () {
    expect(getSupportedCountries(['XX'], metadata)).to.be.undefined;
  });
});
//# sourceMappingURL=countries.test.js.map