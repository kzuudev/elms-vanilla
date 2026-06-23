import { describe, it } from 'mocha';
import { expect } from 'chai';
import metadata from 'libphonenumber-js/min/metadata';
import { getPrefixForFormattingValueAsPhoneNumber, removePrefixFromFormattedPhoneNumber } from './inputValuePrefix.js';
describe('inputValuePrefix', function () {
  it('should get input value prefix', function () {
    expect(getPrefixForFormattingValueAsPhoneNumber({
      country: 'RU',
      metadata: metadata
    })).to.equal('');
    expect(getPrefixForFormattingValueAsPhoneNumber({
      country: 'RU',
      inputFormat: 'INTERNATIONAL',
      metadata: metadata
    })).to.equal('');
    expect(getPrefixForFormattingValueAsPhoneNumber({
      country: 'RU',
      inputFormat: 'NATIONAL_PART_OF_INTERNATIONAL',
      metadata: metadata
    })).to.equal('+7');
  });
  it('should remove input value prefix', function () {
    expect(removePrefixFromFormattedPhoneNumber('+78005553535', '+7')).to.equal('8005553535');
    expect(removePrefixFromFormattedPhoneNumber('+7 800 555 35 35', '+7')).to.equal('800 555 35 35');
    expect(removePrefixFromFormattedPhoneNumber('8 (800) 555-35-35', '')).to.equal('8 (800) 555-35-35');
  });
});
//# sourceMappingURL=inputValuePrefix.test.js.map