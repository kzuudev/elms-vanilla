function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { getPreSelectedCountry, getCountrySelectOptions, parsePhoneNumber, generateNationalNumberDigits, getPhoneDigitsForNewCountry, e164, getCountryForPartialE164Number, onPhoneDigitsChange, getInitialPhoneDigits,
// Private functions
getCountryFromPossiblyIncompleteInternationalPhoneNumber, compareStrings, stripCountryCallingCode, getNationalSignificantNumberDigits, couldNumberBelongToCountry, trimNumber } from './phoneInputHelpers.js';
import metadata from 'libphonenumber-js/min/metadata';
describe('phoneInputHelpers', function () {
  it('should get pre-selected country', function () {
    // Can't return "International". Return the first country available.
    expect(getPreSelectedCountry({
      value: '+11111111111',
      phoneNumber: {},
      countries: ['US', 'RU'],
      getAnyCountry: function getAnyCountry() {
        return 'US';
      },
      required: true,
      metadata: metadata
    })).to.equal('US');

    // Can return "International".
    // Country can't be derived from the phone number.
    // https://github.com/catamphetamine/react-phone-number-input/issues/378
    expect(getPreSelectedCountry({
      value: '+11111111111',
      phoneNumber: {},
      countries: ['US', 'RU'],
      getAnyCountry: function getAnyCountry() {
        return 'US';
      },
      required: false,
      metadata: metadata
    })).to.be.undefined;

    // Can return "International".
    // Country can't be derived from the phone number.
    // Has `defaultCountry`.
    // Has `value`.
    // https://github.com/catamphetamine/react-phone-number-input/issues/378
    expect(getPreSelectedCountry({
      value: '+11111111111',
      phoneNumber: {},
      defaultCountry: 'RU',
      countries: ['RU', 'FR'],
      required: false,
      metadata: metadata
    })).to.be.undefined;

    // Can return "International".
    // Country can be derived from the phone number.
    // Has `defaultCountry`.
    // Has a valid partial `value`.
    // https://github.com/catamphetamine/react-phone-number-input/issues/378
    expect(getPreSelectedCountry({
      value: '+7800',
      defaultCountry: 'RU',
      countries: ['RU', 'FR'],
      required: false,
      metadata: metadata
    })).to.equal('RU');

    // Derive country from the phone number.
    expect(getPreSelectedCountry({
      value: '+78005553535',
      phoneNumber: {
        country: 'RU',
        phone: '8005553535'
      },
      countries: ['US', 'RU'],
      getAnyCountry: function getAnyCountry() {
        return 'US';
      },
      required: true,
      metadata: metadata
    })).to.equal('RU');

    // Country derived from the phone number overrides the supplied one.
    expect(getPreSelectedCountry({
      value: '+78005553535',
      phoneNumber: {
        country: 'RU',
        phone: '8005553535'
      },
      defaultCountry: 'US',
      countries: ['US', 'RU'],
      required: true,
      metadata: metadata
    })).to.equal('RU');

    // Only pre-select a country if it's in the available `countries` list.
    expect(getPreSelectedCountry({
      value: '+78005553535',
      phoneNumber: {
        country: 'RU',
        phone: '8005553535'
      },
      countries: ['US', 'DE'],
      getAnyCountry: function getAnyCountry() {
        return 'US';
      },
      required: true,
      metadata: metadata
    })).to.equal('US');
    expect(getPreSelectedCountry({
      value: '+78005553535',
      phoneNumber: {
        country: 'RU',
        phone: '8005553535'
      },
      defaultCountry: 'US',
      countries: ['US', 'DE'],
      required: false,
      metadata: metadata
    })).to.be.undefined;
  });
  it('should generate country select options', function () {
    var defaultLabels = {
      'RU': 'Russia (Россия)',
      'US': 'United States',
      'ZZ': 'International'
    };

    // Without custom country names.
    expect(getCountrySelectOptions({
      countries: ['US', 'RU'],
      countryNames: defaultLabels
    })).to.deep.equal([{
      value: 'RU',
      label: 'Russia (Россия)'
    }, {
      value: 'US',
      label: 'United States'
    }]);

    // With custom country names.
    expect(getCountrySelectOptions({
      countries: ['US', 'RU'],
      countryNames: _objectSpread(_objectSpread({}, defaultLabels), {}, {
        'RU': 'Russia'
      })
    })).to.deep.equal([{
      value: 'RU',
      label: 'Russia'
    }, {
      value: 'US',
      label: 'United States'
    }]);

    // Should substitute missing country names with country codes.
    expect(getCountrySelectOptions({
      countries: ['US', 'RU'],
      countryNames: _objectSpread(_objectSpread({}, defaultLabels), {}, {
        'RU': undefined
      })
    })).to.deep.equal([{
      value: 'RU',
      label: 'RU'
    }, {
      value: 'US',
      label: 'United States'
    }]);

    // With "International" (without custom country names).
    expect(getCountrySelectOptions({
      countries: ['US', 'RU'],
      countryNames: defaultLabels,
      addInternationalOption: true
    })).to.deep.equal([{
      label: 'International'
    }, {
      value: 'RU',
      label: 'Russia (Россия)'
    }, {
      value: 'US',
      label: 'United States'
    }]);

    // With "International" (with custom country names).
    expect(getCountrySelectOptions({
      countries: ['US', 'RU'],
      countryNames: _objectSpread(_objectSpread({}, defaultLabels), {}, {
        'RU': 'Russia',
        ZZ: 'Intl'
      }),
      addInternationalOption: true
    })).to.deep.equal([{
      label: 'Intl'
    }, {
      value: 'RU',
      label: 'Russia'
    }, {
      value: 'US',
      label: 'United States'
    }]);
  });
  it('should generate country select options (custom `compareStrings`)', function () {
    var defaultLabels = {
      'RU': 'Russia (Россия)',
      'US': 'United States',
      'ZZ': 'International'
    };

    // Without custom country names.
    expect(getCountrySelectOptions({
      countries: ['US', 'RU'],
      countryNames: defaultLabels,
      // Reverse order.
      compareStrings: function compareStrings(a, b) {
        return a < b ? 1 : a > b ? -1 : 0;
      }
    })).to.deep.equal([{
      value: 'US',
      label: 'United States'
    }, {
      value: 'RU',
      label: 'Russia (Россия)'
    }]);
  });

  // it('should generate country select options (Chinese locale)', () => {
  // 	// https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/20
  //
  // 	const defaultLabels = {
  // 		'RU': 'Russia (Россия)',
  // 		'US': 'United States',
  // 		'ZZ': 'International'
  // 	}
  //
  // 	// Without custom country names.
  // 	expect(getCountrySelectOptions({
  // 		countries: ['US', 'RU'],
  // 		countryNames: defaultLabels,
  // 		compareStringsLocales: 'zh-CN-u-co-pinyin'
  // 	})).to.deep.equal([{
  // 		value: 'US',
  // 		label: 'United States'
  // 	}, {
  // 		value: 'RU',
  // 		label: 'Russia (Россия)'
  // 	}])
  // })

  it('should parse phone numbers', function () {
    var phoneNumber = parsePhoneNumber('+78005553535', metadata);
    expect(phoneNumber.country).to.equal('RU');
    expect(phoneNumber.nationalNumber).to.equal('8005553535');

    // No `value` passed.
    expect(parsePhoneNumber(null, metadata)).to.be.undefined;
  });
  it('should generate national number digits', function () {
    var phoneNumber = parsePhoneNumber('+33509758351', metadata);
    expect(generateNationalNumberDigits(phoneNumber)).to.equal('0509758351');
  });
  it('should migrate parsed input for new country', function () {
    // Country didn't change. Return the same digits.
    expect(getPhoneDigitsForNewCountry('', {
      prevCountry: 'US',
      newCountry: 'US',
      metadata: metadata,
      useNationalFormat: true
    })).to.equal('');

    // Country didn't change. Return the same digits.
    expect(getPhoneDigitsForNewCountry('123', {
      prevCountry: 'US',
      newCountry: 'US',
      metadata: metadata,
      useNationalFormat: true
    })).to.equal('123');

    // Country didn't change. Return the same digits.
    expect(getPhoneDigitsForNewCountry('+123', {
      prevCountry: 'US',
      newCountry: 'US',
      metadata: metadata
    })).to.equal('+123');

    // No input. Returns `undefined`.
    expect(getPhoneDigitsForNewCountry('', {
      prevCountry: 'RU',
      newCountry: 'US',
      metadata: metadata,
      useNationalFormat: true
    })).to.equal('');

    // Switching from "International" to a country
    // to which the phone number already belongs to.
    // No changes. Returns `undefined`.
    expect(getPhoneDigitsForNewCountry('+18005553535', {
      newCountry: 'US',
      metadata: metadata
    })).to.equal('+18005553535');

    // Switching between countries. National number. No changes.
    expect(getPhoneDigitsForNewCountry('8005553535', {
      prevCountry: 'RU',
      newCountry: 'US',
      metadata: metadata
    })).to.equal('8005553535');

    // Switching from "International" to a country. Calling code not matches. Resets parsed input.
    expect(getPhoneDigitsForNewCountry('+78005553535', {
      newCountry: 'US',
      metadata: metadata
    })).to.equal('+1');

    // Switching from "International" to a country. Calling code matches. Doesn't reset parsed input.
    expect(getPhoneDigitsForNewCountry('+12223333333', {
      newCountry: 'US',
      metadata: metadata
    })).to.equal('+12223333333');

    // Switching countries. International number. Calling code doesn't match.
    expect(getPhoneDigitsForNewCountry('+78005553535', {
      prevCountry: 'RU',
      newCountry: 'US',
      metadata: metadata
    })).to.equal('+1');

    // Switching countries. International number. Calling code matches.
    expect(getPhoneDigitsForNewCountry('+18005553535', {
      prevCountry: 'CA',
      newCountry: 'US',
      metadata: metadata
    })).to.equal('+18005553535');

    // Switching countries. International number.
    // Country calling code is longer than the amount of digits available.
    expect(getPhoneDigitsForNewCountry('+99', {
      prevCountry: 'KG',
      newCountry: 'US',
      metadata: metadata
    })).to.equal('+1');

    // Switching countries. International number. No such country code.
    expect(getPhoneDigitsForNewCountry('+99', {
      prevCountry: 'KG',
      newCountry: 'US',
      metadata: metadata
    })).to.equal('+1');

    // Switching to "International". National number.
    expect(getPhoneDigitsForNewCountry('8800555', {
      prevCountry: 'RU',
      metadata: metadata
    })).to.equal('+7800555');

    // Switching to "International". No national (significant) number digits entered.
    expect(getPhoneDigitsForNewCountry('8', {
      prevCountry: 'RU',
      metadata: metadata
      // })).to.equal('')
    })).to.equal('+7');

    // Switching to "International". International number. No changes.
    expect(getPhoneDigitsForNewCountry('+78005553535', {
      prevCountry: 'RU',
      metadata: metadata
    })).to.equal('+78005553535');

    // Prefer national format. Country matches. Leaves the "national (significant) number".
    expect(getPhoneDigitsForNewCountry('+78005553535', {
      newCountry: 'RU',
      metadata: metadata,
      useNationalFormat: true
    })).to.equal('8005553535');

    // Prefer national format. Country doesn't match, but country calling code does. Leaves the "national (significant) number".
    expect(getPhoneDigitsForNewCountry('+12133734253', {
      newCountry: 'CA',
      metadata: metadata,
      useNationalFormat: true
    })).to.equal('2133734253');

    // Prefer national format. Country doesn't match, neither does country calling code. Clears the value.
    expect(getPhoneDigitsForNewCountry('+78005553535', {
      newCountry: 'US',
      metadata: metadata,
      useNationalFormat: true
    })).to.equal('');

    // Force international format. `phoneDigits` is empty. From no country to a country.
    expect(getPhoneDigitsForNewCountry(null, {
      newCountry: 'US',
      metadata: metadata,
      useNationalFormat: false
    })).to.equal('+1');

    // Force international format. `phoneDigits` is not empty. From a country to a country with the same calling code.
    expect(getPhoneDigitsForNewCountry('+1222', {
      prevCountry: 'CA',
      newCountry: 'US',
      metadata: metadata
    })).to.equal('+1222');

    // Force international format. `phoneDigits` is not empty. From a country to a country with another calling code.
    expect(getPhoneDigitsForNewCountry('+1222', {
      prevCountry: 'CA',
      newCountry: 'RU',
      metadata: metadata
    })).to.equal('+7');

    // Force international format. `phoneDigits` is not empty. From no country to a country.
    expect(getPhoneDigitsForNewCountry('+1222', {
      newCountry: 'US',
      metadata: metadata
    })).to.equal('+1222');

    // `newCountry` is `undefined`.
    // `phoneDigits` are `undefined`.
    // `useNationalFormat` is `undefined`.
    expect(getPhoneDigitsForNewCountry(undefined, {
      prevCountry: 'US',
      metadata: metadata
    })).to.equal('');
  });
  it('should format phone number in e164', function () {
    // No number.
    expect(e164()).to.be.undefined;

    // International number. Just a '+' sign.
    expect(e164('+')).to.be.undefined;

    // International number.
    expect(e164('+7800', null, metadata)).to.equal('+7800');

    // National number. Without country.
    expect(e164('8800', null, metadata)).to.be.undefined;

    // National number. With country. Just national prefix.
    // expect(e164('8', 'RU', metadata)).to.be.undefined
    expect(e164('8', 'RU', metadata)).to.equal('+7');

    // National number. With country.
    expect(e164('8800', 'RU', metadata)).to.equal('+7800');
  });
  it('should trim the phone number if it exceeds the maximum length', function () {
    // // No number.
    // expect(trimNumber()).to.be.undefined

    // Empty number.
    expect(trimNumber('', 'RU', metadata)).to.equal('');

    // // International number. Without country.
    // expect(trimNumber('+780055535351')).to.equal('+780055535351')

    // // National number. Without country.
    // expect(trimNumber('880055535351', null)).to.equal('880055535351')

    // National number. Doesn't exceed the maximum length.
    expect(trimNumber('2135553535', 'US', metadata)).to.equal('2135553535');
    // National number. Exceeds the maximum length.
    expect(trimNumber('21355535351', 'US', metadata)).to.equal('2135553535');

    // International number. Doesn't exceed the maximum length.
    expect(trimNumber('+12135553535', 'US', metadata)).to.equal('+12135553535');
    // International number. Exceeds the maximum length.
    expect(trimNumber('+121355535351', 'US', metadata)).to.equal('+12135553535');
  });
  it('should get country when inputting a national phone number for +1 calling code (`defaultCountry`)', function () {
    // Issue:
    // https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/228#note_1888308944

    // Starts inputting a phone number for default country `US`,
    // but then input value becomes `3107385` which is considered valid for `CA` country,
    // as per Google's metadata.
    expect(onPhoneDigitsChange('3107385', {
      prevPhoneDigits: '310738',
      country: 'US',
      defaultCountry: 'US',
      latestCountrySelectedByUser: undefined,
      countryRequired: false,
      getAnyCountry: function getAnyCountry() {
        return 'RU';
      },
      international: undefined,
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '3107385',
      country: 'CA',
      value: '+13107385'
    });

    // Continues inputting the phone number  for default country `US`,
    // and the input value becomes `31073850` which is no longer considered valid for `CA` country,
    // so it should switch the country back to `US`.
    expect(onPhoneDigitsChange('31073850', {
      prevPhoneDigits: '3107385',
      country: 'CA',
      defaultCountry: 'US',
      latestCountrySelectedByUser: undefined,
      countryRequired: false,
      getAnyCountry: function getAnyCountry() {
        return 'RU';
      },
      international: undefined,
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '31073850',
      country: 'US',
      value: '+131073850'
    });
  });
  it('should get country when inputting a national phone number for +1 calling code (`latestCountrySelectedByUser`)', function () {
    // Issue:
    // https://gitlab.com/catamphetamine/react-phone-number-input/-/issues/228#note_1888308944

    // Starts inputting a phone number for default country `US`,
    // but then input value becomes `3107385` which is considered valid for `CA` country,
    // as per Google's metadata.
    expect(onPhoneDigitsChange('3107385', {
      prevPhoneDigits: '310738',
      country: 'US',
      defaultCountry: undefined,
      latestCountrySelectedByUser: 'US',
      countryRequired: false,
      getAnyCountry: function getAnyCountry() {
        return 'RU';
      },
      international: undefined,
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '3107385',
      country: 'CA',
      value: '+13107385'
    });

    // Continues inputting the phone number  for default country `US`,
    // and the input value becomes `31073850` which is no longer considered valid for `CA` country,
    // so it should switch the country back to `US`.
    expect(onPhoneDigitsChange('31073850', {
      prevPhoneDigits: '3107385',
      country: 'CA',
      defaultCountry: undefined,
      latestCountrySelectedByUser: 'US',
      countryRequired: false,
      getAnyCountry: function getAnyCountry() {
        return 'RU';
      },
      international: undefined,
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '31073850',
      country: 'US',
      value: '+131073850'
    });
  });
  it('should get country for partial E.164 number', function () {
    // Just a '+' sign.
    // Early return.
    expect(getCountryForPartialE164Number('+', {
      country: 'RU',
      countries: ['US', 'RU'],
      metadata: metadata
    })).to.equal('RU');

    // Just a '+' sign.
    // Early return.
    expect(getCountryForPartialE164Number('+', {
      countries: ['US', 'RU'],
      metadata: metadata
    })).to.be.undefined;

    // A country can be derived.
    expect(getCountryForPartialE164Number('+78005553535', {
      countries: ['US', 'RU'],
      metadata: metadata
    })).to.equal('RU');

    // A country can be derived.
    // But that country is not allowed.
    expect(getCountryForPartialE164Number('+78005553535', {
      countries: ['US'],
      metadata: metadata
    })).to.be.undefined;

    // A country can't be derived yet.
    // And the currently selected country does fit the number.
    // And the country is not ambiguous.
    expect(getCountryForPartialE164Number('+33', {
      country: 'FR',
      countries: ['FR', 'RU'],
      metadata: metadata
    })).to.equal('FR');

    // A country can't be derived yet.
    // And the currently selected country does fit the number.
    // And the country is ambiguous.
    expect(getCountryForPartialE164Number('+7', {
      country: 'RU',
      countries: ['RU'],
      metadata: metadata
    })).to.be.undefined;

    // A country can't be derived yet.
    // And the currently selected country does fit the number.
    // And the country is ambiguous.
    // But some country is required to be selected.
    expect(getCountryForPartialE164Number('+7', {
      country: 'RU',
      countries: ['RU'],
      required: true,
      metadata: metadata
    })).to.equal('RU');

    // A country can't be derived yet.
    // And the currently selected country does fit the number.
    // And the country is ambiguous.
    // And the user has manually selected that country.
    expect(getCountryForPartialE164Number('+7', {
      country: 'RU',
      countries: ['RU'],
      latestCountrySelectedByUser: 'RU',
      metadata: metadata
    })).to.equal('RU');

    // A country can't be derived yet.
    // And the currently selected country does fit the number.
    // And the country is ambiguous.
    // And the user has manually selected some country
    // but that country doesn't fit the number.
    expect(getCountryForPartialE164Number('+7', {
      country: 'RU',
      countries: ['RU'],
      latestCountrySelectedByUser: 'FR',
      metadata: metadata
    })).to.be.undefined;

    // A country can't be derived yet.
    // But the currently selected country does fit the number.
    // And the country is ambiguous.
    // And the country is a default one.
    expect(getCountryForPartialE164Number('+7', {
      country: 'RU',
      countries: ['RU'],
      defaultCountry: 'RU',
      metadata: metadata
    })).to.equal('RU');

    // A country can't be derived yet.
    // And the currently selected country does fit the number.
    // And the country is ambiguous.
    // And there is some default country
    // but that country doesn't fit the number.
    expect(getCountryForPartialE164Number('+7', {
      country: 'RU',
      countries: ['RU'],
      defaultCountry: 'FR',
      metadata: metadata
    })).to.be.undefined;

    // A country can't be derived yet.
    // And the currently selected country doesn't fit the number.
    expect(getCountryForPartialE164Number('+7', {
      country: 'FR',
      countries: ['FR', 'RU'],
      metadata: metadata
    })).to.be.undefined;

    // A country can't be derived yet.
    // And the currently selected country doesn't fit the number.
    expect(getCountryForPartialE164Number('+12', {
      country: 'FR',
      countries: ['FR', 'US'],
      metadata: metadata
    })).to.be.undefined;

    // A country can't be derived yet.
    // And the currently selected country doesn't fit the number.
    // Bit "International" option is not available
    // so some country is required to be selected.
    expect(getCountryForPartialE164Number('+7', {
      country: 'FR',
      countries: ['FR', 'RU'],
      required: true,
      metadata: metadata
    })).to.equal('FR');

    // A country can't be derived yet.
    // And the currently selected country doesn't fit the number.
    // Bit "International" option is not available
    // so some country is required to be selected.
    expect(getCountryForPartialE164Number('+12', {
      country: 'FR',
      countries: ['FR', 'US'],
      required: true,
      metadata: metadata
    })).to.equal('FR');
  });
  it('should get country from possibly incomplete international phone number', function () {
    // // `001` country calling code.
    // // Non-geographic numbering plan.
    // expect(getCountryFromPossiblyIncompleteInternationalPhoneNumber('+800', metadata)).to.be.undefined

    // Country can be derived.
    expect(getCountryFromPossiblyIncompleteInternationalPhoneNumber('+33', metadata)).to.equal('FR');

    // Country can't be derived yet.
    expect(getCountryFromPossiblyIncompleteInternationalPhoneNumber('+12', metadata)).to.be.undefined;
  });
  it('should compare strings', function () {
    expect(compareStrings('aa', 'ab')).to.equal(-1);
    expect(compareStrings('aa', 'aa')).to.equal(0);
    expect(compareStrings('aac', 'aab')).to.equal(1);
  });
  it('should strip country calling code from a number', function () {
    // Number is longer than country calling code prefix.
    expect(stripCountryCallingCode('+7800', 'RU', metadata)).to.equal('800');

    // Number is shorter than (or equal to) country calling code prefix.
    expect(stripCountryCallingCode('+3', 'FR', metadata)).to.equal('');
    expect(stripCountryCallingCode('+7', 'FR', metadata)).to.equal('');

    // `country` doesn't fit the actual `number`.
    // Iterates through all available country calling codes.
    expect(stripCountryCallingCode('+7800', 'FR', metadata)).to.equal('800');

    // No `country`.
    // And the calling code doesn't belong to any country.
    expect(stripCountryCallingCode('+999', null, metadata)).to.equal('');
  });
  it('should get national significant number part', function () {
    // International number.
    expect(getNationalSignificantNumberDigits('+7800555', null, metadata)).to.equal('800555');

    // International number.
    // No national (significant) number digits.
    expect(getNationalSignificantNumberDigits('+', null, metadata)).to.be.undefined;
    expect(getNationalSignificantNumberDigits('+7', null, metadata)).to.be.undefined;

    // National number.
    expect(getNationalSignificantNumberDigits('8800555', 'RU', metadata)).to.equal('800555');

    // National number.
    // No national (significant) number digits.
    expect(getNationalSignificantNumberDigits('8', 'RU', metadata)).to.be.undefined;
    expect(getNationalSignificantNumberDigits('', 'RU', metadata)).to.be.undefined;
  });
  it('should determine of a number could belong to a country', function () {
    // Matching.
    expect(couldNumberBelongToCountry('+7800', 'RU', metadata)).to.equal(true);

    // First digit already not matching.
    expect(couldNumberBelongToCountry('+7800', 'FR', metadata)).to.equal(false);

    // First digit matching, second - not matching.
    expect(couldNumberBelongToCountry('+33', 'AM', metadata)).to.equal(false);

    // Number is shorter than country calling code.
    expect(couldNumberBelongToCountry('+99', 'KG', metadata)).to.equal(true);
  });
  it('should handle phone digits change (should choose new "value" based on phone digits)', function () {
    expect(onPhoneDigitsChange('+', {
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+',
      country: undefined,
      value: undefined
    });
    expect(onPhoneDigitsChange('+', {
      metadata: metadata,
      countryRequired: true,
      getAnyCountry: function getAnyCountry() {
        return 'US';
      }
    })).to.deep.equal({
      phoneDigits: '+',
      country: 'US',
      value: undefined
    });
    expect(onPhoneDigitsChange('+7', {
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+7',
      country: undefined,
      value: '+7'
    });
    expect(onPhoneDigitsChange('+7', {
      metadata: metadata,
      country: 'RU'
    })).to.deep.equal({
      phoneDigits: '+7',
      country: 'RU',
      value: undefined
    });
    expect(onPhoneDigitsChange('+330', {
      metadata: metadata,
      country: 'FR'
    })).to.deep.equal({
      phoneDigits: '+330',
      country: 'FR',
      value: '+33'
    });
  });
  it('should handle phone digits change', function () {
    // Doesn't really support passing an `undefined` value.
    // I dunno why doesn't it throw an error here.
    // Anyway, since this test already existed, I didn't remove it.
    expect(onPhoneDigitsChange(undefined, {
      country: 'RU',
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: undefined,
      country: 'RU',
      value: undefined
    });
    expect(onPhoneDigitsChange('', {
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '',
      country: undefined,
      value: undefined
    });
    expect(onPhoneDigitsChange('1213', {
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+1213',
      country: undefined,
      value: '+1213'
    });
    expect(onPhoneDigitsChange('+1213', {
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+1213',
      country: undefined,
      value: '+1213'
    });

    // Will reset an automatically selected country when it's ambiguous.
    expect(onPhoneDigitsChange('213', {
      country: 'US',
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '213',
      country: undefined,
      value: '+1213'
    });

    // Won't reset a default selected country when it's ambiguous.
    expect(onPhoneDigitsChange('213', {
      country: 'US',
      defaultCountry: 'US',
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '213',
      country: 'US',
      value: '+1213'
    });

    // Won't reset a manually selected country when it's ambiguous.
    expect(onPhoneDigitsChange('213', {
      country: 'US',
      latestCountrySelectedByUser: 'US',
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '213',
      country: 'US',
      value: '+1213'
    });

    // When inputting a valid number for another country
    // it should switch to that other country.
    expect(onPhoneDigitsChange('+78005553535', {
      country: 'US',
      defaultCountry: 'US',
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+78005553535',
      country: 'RU',
      value: '+78005553535'
    });

    // Won't reset an already selected default country when it is ambiguous.
    // Full number entered.
    expect(onPhoneDigitsChange('+15555555555', {
      country: 'US',
      defaultCountry: 'US',
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+15555555555',
      country: 'US',
      value: '+15555555555'
    });

    // Won't reset an already manually selected country when it is ambiguous.
    // Full number entered.
    expect(onPhoneDigitsChange('+15555555555', {
      country: 'US',
      latestCountrySelectedByUser: 'US',
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+15555555555',
      country: 'US',
      value: '+15555555555'
    });

    // Will reset an automatically selected country when it is ambiguous.
    // Full number entered.
    expect(onPhoneDigitsChange('+15555555555', {
      country: 'US',
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+15555555555',
      country: undefined,
      value: '+15555555555'
    });

    // Should reset the country if it has likely been automatically
    // selected based on international phone number input,
    // and the user decides to erase all input,
    // and the country neither was selected manually by either not it is a default one.
    expect(onPhoneDigitsChange('', {
      prevPhoneDigits: '+78005553535',
      country: 'RU',
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '',
      country: undefined,
      value: undefined
    });

    // Should reset the country if it has likely been automatically
    // selected based on international phone number input,
    // and the user decides to erase all input,
    // and the country neither was selected manually by either not it is a default one.
    // Should reset the country to the default one.
    expect(onPhoneDigitsChange('', {
      prevPhoneDigits: '+78005553535',
      country: 'RU',
      defaultCountry: 'US',
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '',
      country: 'US',
      value: undefined
    });

    // Should reset the country if it has likely been automatically
    // selected based on international phone number input
    // and the user decides to erase all input up to the `+` sign.
    expect(onPhoneDigitsChange('+', {
      prevPhoneDigits: '+78005553535',
      country: 'RU',
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+',
      country: undefined,
      value: undefined
    });
  });
  it('should handle phone digits change (limitMaxLength: true)', function () {
    expect(onPhoneDigitsChange('21337342530', {
      country: 'US',
      limitMaxLength: true,
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '2133734253',
      country: 'US',
      value: '+12133734253'
    });
    expect(onPhoneDigitsChange('+121337342530', {
      country: 'US',
      limitMaxLength: true,
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+12133734253',
      country: 'US',
      value: '+12133734253'
    });

    // This case is intentionally ignored to simplify the code.
    expect(onPhoneDigitsChange('+121337342530', {
      limitMaxLength: true,
      metadata: metadata
    })).to.deep.equal({
      // phoneDigits: '+12133734253',
      // country: 'US',
      // value: '+12133734253'
      phoneDigits: '+121337342530',
      country: undefined,
      value: '+121337342530'
    });
  });
  it('should handle phone digits change (`international: true`)', function () {
    // Shouldn't set `country` to `defaultCountry`
    // when erasing parsed input starting with a `+`
    // when `international` is `true`.
    expect(onPhoneDigitsChange('', {
      prevPhoneDigits: '+78005553535',
      country: 'RU',
      defaultCountry: 'US',
      international: true,
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '',
      country: undefined,
      value: undefined
    });

    // Should support forcing international phone number input format.
    expect(onPhoneDigitsChange('2', {
      prevPhoneDigits: '+78005553535',
      country: 'RU',
      international: true,
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+2',
      country: undefined,
      value: '+2'
    });
  });
  it('should handle phone digits change (`international: true` and `countryCallingCodeEditable: false`) (reset incompatible international input)', function () {
    // With `country`.
    expect(onPhoneDigitsChange('+1', {
      prevPhoneDigits: '+78005553535',
      country: 'RU',
      international: true,
      countryCallingCodeEditable: false,
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+7',
      country: 'RU',
      value: undefined
    });

    // Without `country`.
    // Not possible because passing `countryCallingCodeEditable: false` flag
    // automatically means that some country calling code is specified
    // meaning that there is a `country`.
    // Still, test coverage requires the "else path" to be covered.
    expect(onPhoneDigitsChange('+1', {
      prevPhoneDigits: '+78005553535',
      country: undefined,
      international: true,
      countryCallingCodeEditable: false,
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+1',
      country: undefined,
      value: '+1'
    });
  });
  it('should handle phone digits change (`international: true` and `countryCallingCodeEditable: false`) (append national input)', function () {
    expect(onPhoneDigitsChange('8', {
      prevPhoneDigits: '+78005553535',
      country: 'RU',
      international: true,
      countryCallingCodeEditable: false,
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+78',
      country: 'RU',
      value: '+78'
    });
  });
  it('should handle phone digits change (`international: true` and `countryCallingCodeEditable: false`) (compatible input)', function () {
    expect(onPhoneDigitsChange('+7', {
      prevPhoneDigits: '+78005553535',
      country: 'RU',
      international: true,
      countryCallingCodeEditable: false,
      metadata: metadata
    })).to.deep.equal({
      phoneDigits: '+7',
      country: 'RU',
      value: undefined
    });
  });
  it('should handle phone digits change (`international: false`)', function () {
    var onChange = function onChange(phoneDigits, prevPhoneDigits, country, rest) {
      return onPhoneDigitsChange(phoneDigits, _objectSpread(_objectSpread({}, rest), {}, {
        prevPhoneDigits: prevPhoneDigits,
        country: country,
        international: false,
        metadata: metadata
      }));
    };

    // `phoneDigits` in international format.
    // Just country calling code.
    expect(onChange('+7', '', 'RU')).to.deep.equal({
      phoneDigits: '',
      country: 'RU',
      value: undefined
    });

    // `phoneDigits` in international format.
    // Country calling code and first digit.
    // (which is assumed a "national prefix").
    // Reset an automatically selected country.
    expect(onChange('+78', '', 'RU')).to.deep.equal({
      phoneDigits: '8',
      country: undefined,
      // value: undefined
      value: '+7'
    });

    // `phoneDigits` in international format.
    // Country calling code and first digit.
    // (which is assumed a "national prefix").
    // Won't reset a manually selected country.
    expect(onChange('+78', '', 'RU', {
      latestCountrySelectedByUser: 'RU'
    })).to.deep.equal({
      phoneDigits: '8',
      country: 'RU',
      // value: undefined
      value: '+7'
    });

    // `phoneDigits` in international format.
    // Country calling code and first digit.
    // (which is assumed a "national prefix").
    // Won't reset an automatically selected default country.
    expect(onChange('+78', '', 'RU', {
      defaultCountry: 'RU'
    })).to.deep.equal({
      phoneDigits: '8',
      country: 'RU',
      // value: undefined
      value: '+7'
    });

    // `phoneDigits` in international format.
    // Country calling code and first two digits.
    // Reset an automatically selected country.
    expect(onChange('+121', '', 'US')).to.deep.equal({
      phoneDigits: '21',
      country: undefined,
      value: '+121'
    });

    // `phoneDigits` in international format.
    // Country calling code and first two digits.
    // Won't reset a manually selected country.
    expect(onChange('+121', '', 'US', {
      latestCountrySelectedByUser: 'US'
    })).to.deep.equal({
      phoneDigits: '21',
      country: 'US',
      value: '+121'
    });

    // `phoneDigits` in international format.
    // Country calling code and first two digits.
    // Won't reset an automatically selected default country.
    expect(onChange('+121', '', 'US', {
      defaultCountry: 'US'
    })).to.deep.equal({
      phoneDigits: '21',
      country: 'US',
      value: '+121'
    });

    // `phoneDigits` in international format.
    expect(onChange('+78005553535', '', 'RU')).to.deep.equal({
      phoneDigits: '88005553535',
      country: 'RU',
      value: '+78005553535'
    });

    // `phoneDigits` in international format.
    // Another country: just trims the `+`.
    // Reset an automatically selected country.
    expect(onChange('+78005553535', '', 'US')).to.deep.equal({
      phoneDigits: '78005553535',
      country: undefined,
      value: '+178005553535'
    });

    // `phoneDigits` in international format.
    // Another country: just trims the `+`.
    // Won't reset a manually selected country.
    expect(onChange('+78005553535', '', 'US', {
      latestCountrySelectedByUser: 'US'
    })).to.deep.equal({
      phoneDigits: '78005553535',
      country: 'US',
      value: '+178005553535'
    });

    // `phoneDigits` in international format.
    // Another country: just trims the `+`.
    // Won't reset an automatically selected default country.
    expect(onChange('+78005553535', '', 'US', {
      defaultCountry: 'US'
    })).to.deep.equal({
      phoneDigits: '78005553535',
      country: 'US',
      value: '+178005553535'
    });

    // `phoneDigits` in national format.
    expect(onChange('88005553535', '', 'RU')).to.deep.equal({
      phoneDigits: '88005553535',
      country: 'RU',
      value: '+78005553535'
    });

    // `phoneDigits` in national format.
    expect(onChange('88005553535', '8800555353', 'RU')).to.deep.equal({
      phoneDigits: '88005553535',
      country: 'RU',
      value: '+78005553535'
    });

    // Empty `phoneDigits`.
    expect(onChange('', '88005553535', 'RU')).to.deep.equal({
      phoneDigits: '',
      country: 'RU',
      value: undefined
    });
  });
  it('should handle phone digits change (`international: false` and no country selected)', function () {
    // If `international` is `false` then it means that
    // "International" option should not be available,
    // so it doesn't handle the cases when it is available.

    var onChange = function onChange(phoneDigits) {
      return onPhoneDigitsChange(phoneDigits, {
        prevPhoneDigits: '',
        international: false,
        metadata: metadata
      });
    };

    // `phoneDigits` in international format.
    // No country calling code.
    expect(onChange('+')).to.deep.equal({
      phoneDigits: '+',
      country: undefined,
      value: undefined
    });

    // `phoneDigits` in international format.
    // Just country calling code.
    expect(onChange('+7')).to.deep.equal({
      phoneDigits: '+7',
      country: undefined,
      value: '+7'
    });

    // `phoneDigits` in international format.
    // Country calling code and first digit.
    // (which is assumed a "national prefix").
    expect(onChange('+330')).to.deep.equal({
      phoneDigits: '',
      country: 'FR',
      value: undefined
    });

    // `phoneDigits` in international format.
    // Country calling code, national prefix and first "significant" digit.
    expect(onChange('+3301')).to.deep.equal({
      phoneDigits: '1',
      country: 'FR',
      value: '+331'
    });

    // `phoneDigits` in international format.
    // Full number.
    expect(onChange('+78005553535')).to.deep.equal({
      phoneDigits: '88005553535',
      country: 'RU',
      value: '+78005553535'
    });
  });
  it('should get initial parsed input', function () {
    expect(getInitialPhoneDigits({
      value: '+78005553535',
      defaultCountry: 'RU',
      international: false,
      metadata: metadata
    })).to.equal('+78005553535');
    expect(getInitialPhoneDigits({
      value: '+78005553535',
      defaultCountry: 'RU',
      international: true,
      metadata: metadata
    })).to.equal('+78005553535');
    expect(getInitialPhoneDigits({
      value: undefined,
      defaultCountry: 'RU',
      international: true,
      metadata: metadata
    })).to.equal('+7');
    expect(getInitialPhoneDigits({
      value: undefined,
      defaultCountry: 'RU',
      international: false,
      metadata: metadata
    })).to.be.undefined;
    expect(getInitialPhoneDigits({
      value: undefined,
      international: false,
      metadata: metadata
    })).to.be.undefined;
  });
  it('should get initial parsed input (has `phoneNumber` that has `country`)', function () {
    var phoneNumber = parsePhoneNumber('+78005553535', metadata);
    expect(getInitialPhoneDigits({
      value: phoneNumber.number,
      defaultCountry: 'RU',
      useNationalFormat: true,
      phoneNumber: phoneNumber,
      metadata: metadata
    })).to.equal('88005553535');
  });
  it('should get initial parsed input (has `phoneNumber` that has no `country`)', function () {
    var phoneNumber = parsePhoneNumber('+870773111632', metadata);
    expect(getInitialPhoneDigits({
      value: phoneNumber.number,
      defaultCountry: 'RU',
      useNationalFormat: true,
      phoneNumber: phoneNumber,
      metadata: metadata
    })).to.equal('+870773111632');
  });
});
//# sourceMappingURL=phoneInputHelpers.test.js.map