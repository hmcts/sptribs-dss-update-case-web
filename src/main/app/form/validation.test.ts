import { CaseDate } from '../case/case';

import {
  areDateFieldsFilledIn,
  atLeastOneFieldIsChecked,
  containsInvalidCharacters,
  isAlphaNumeric,
  isDateInputInvalid,
  isDateInputNotFilled,
  isFieldFilledIn,
  isFieldLetters,
  isMarkDownLinkIncluded,
  isNotNumeric,
} from './validation';

describe('isFieldFilledIn()', () => {
  test('Should check if value exist', async () => {
    const isValid = isFieldFilledIn('Yes');

    expect(isValid).toStrictEqual(undefined);
  });

  test('Should check if value does not exist', async () => {
    let value;
    const isValid = isFieldFilledIn(value);

    expect(isValid).toStrictEqual('required');
  });

  test('Should check if value is only whitespaces', async () => {
    const isValid = isFieldFilledIn('    ');

    expect(isValid).toStrictEqual('required');
  });
});
describe('areFieldsFilledIn()', () => {
  test('Should check if values in object exist', async () => {
    const isValid = areDateFieldsFilledIn({ day: '1', month: '1', year: '1' });
    expect(isValid).toStrictEqual(undefined);
  });

  test('Should check if all values in object does not exist', async () => {
    const isValid = areDateFieldsFilledIn({ day: '', month: '', year: '' });
    expect(isValid).toStrictEqual('required');
  });

  test('Should check if day does not exist', async () => {
    const isValid = areDateFieldsFilledIn({ day: '', month: '12', year: '' });
    expect(isValid).toStrictEqual('incompleteDay');
  });

  test('Should check if month does not exist', async () => {
    const isValid = areDateFieldsFilledIn({ day: '12', month: '', year: '' });
    expect(isValid).toStrictEqual('incompleteMonth');
  });

  test('Should check if year does not exist', async () => {
    const isValid = areDateFieldsFilledIn({ day: '21', month: '12', year: '' });
    expect(isValid).toStrictEqual('incompleteYear');
  });

  test('Should check if object does not exist', async () => {
    const isValid = areDateFieldsFilledIn(undefined);
    expect(isValid).toStrictEqual('required');
  });
});

describe('isDateInputInvalid()', () => {
  test.each([
    { date: { day: 1, month: 1, year: 1970 }, expected: undefined },
    { date: { day: 31, month: 12, year: 2000 }, expected: undefined },
    { date: { day: 31, month: 12, year: 123 }, expected: 'invalidDate' },
    { date: { day: 1, month: 1, year: 1 }, expected: 'invalidDate' },
    { date: { day: -31, month: 12, year: 2000 }, expected: 'invalidDate' },
    { date: { day: 31, month: -12, year: 2000 }, expected: 'invalidDate' },
    { date: { day: 32, month: 12, year: 2000 }, expected: 'invalidDate' },
    { date: { day: 31, month: 13, year: 2000 }, expected: 'invalidDate' },
    { date: { day: 'no', month: '!%', year: 'way' }, expected: 'invalidDate' },
    { date: { day: '29', month: '2', year: '2000' }, expected: undefined },
    { date: { day: '31', month: '2', year: '2000' }, expected: 'invalidDate' },
    { date: { day: ' ', month: ' ', year: ' ' }, expected: 'invalidDate' },
    { expected: 'invalidDate' },
  ])('checks dates validity when %o', ({ date, expected }) => {
    const isValid = isDateInputInvalid(date as unknown as CaseDate);

    expect(isValid).toStrictEqual(expected);
  });
});

describe('atLeastOneFieldIsChecked()', () => {
  test('Should check if value exist', async () => {
    const isValid = atLeastOneFieldIsChecked(['Yes']);

    expect(isValid).toStrictEqual(undefined);
  });

  test('Should check if value does not exist', async () => {
    const isValid = atLeastOneFieldIsChecked([]);

    expect(isValid).toStrictEqual('required');
  });
});

describe('isAlphaNumeric()', () => {
  test('Should allow letters', async () => {
    const isValid = isAlphaNumeric('Test');
    expect(isValid).toStrictEqual(undefined);
  });

  test('Should allow numbers', async () => {
    const isValid = isAlphaNumeric('123');
    expect(isValid).toStrictEqual(undefined);
  });

  test('Should allow letters and numbers', async () => {
    const isValid = isAlphaNumeric('Test123');
    expect(isValid).toStrictEqual(undefined);
  });

  test('Should not allow any special characters', async () => {
    const isValid = isAlphaNumeric('*test*');
    expect(isValid).toStrictEqual('invalid');
  });
});

describe('isNotNumeric()', () => {
  test('Should allow numbers', async () => {
    const isValid = isNotNumeric('123');
    expect(isValid).toStrictEqual(undefined);
  });

  test('Should not allow letters', async () => {
    const isValid = isNotNumeric('Test');
    expect(isValid).toStrictEqual('notNumeric');
  });

  test('Should not allow any special characters', async () => {
    const isValid = isNotNumeric('*');
    expect(isValid).toStrictEqual('notNumeric');
  });
});

describe('isDateInputNotFilled()', () => {
  test('Should allow a valid date', async () => {
    const date = {
      day: '1',
      month: '1',
      year: '2000',
    };

    const isValid = isDateInputNotFilled(date);
    expect(isValid).toStrictEqual(undefined);
  });

  test('Should not allow no date', async () => {
    const isValid = isDateInputNotFilled(undefined);
    expect(isValid).toStrictEqual('invalidDate');
  });

  test('Should not allow no day', async () => {
    const date = {
      day: '',
      month: '1',
      year: '2000',
    };
    const isValid = isDateInputNotFilled(date);
    expect(isValid).toStrictEqual('invalidDate');
  });

  test('Should not allow no month', async () => {
    const date = {
      day: '1',
      month: '',
      year: '2000',
    };
    const isValid = isDateInputNotFilled(date);
    expect(isValid).toStrictEqual('invalidDate');
  });

  test('Should not allow no year', async () => {
    const date = {
      day: '1',
      month: '1',
      year: '',
    };
    const isValid = isDateInputNotFilled(date);
    expect(isValid).toStrictEqual('invalidDate');
  });
});

describe('isMarkDownLinkIncluded()', () => {
  test('should return error if value contains markdown link and additional text before', async () => {
    const isValid = isMarkDownLinkIncluded('info [Text](https://www.google.co.uk)');
    expect(isValid).toStrictEqual('containsMarkdownLink');
  });

  test('should return error if value contains markdown link and additional text before and after', async () => {
    const isValid = isMarkDownLinkIncluded('info [Text](https://www.google.co.uk) some info');
    expect(isValid).toStrictEqual('containsMarkdownLink');
  });

  test('should return error if value is a markdown link', async () => {
    const isValid = isMarkDownLinkIncluded('[Text](https://www.google.co.uk)');
    expect(isValid).toStrictEqual('containsMarkdownLink');
  });

  test('should return null if value passed contains []() and is valid', async () => {
    const isValid = isMarkDownLinkIncluded('[hello](test)');
    expect(isValid).toStrictEqual(undefined);
  });

  test('should return null if value passed contains ) before [ and is valid', async () => {
    const isValid = isMarkDownLinkIncluded('(some)  [tests]');
    expect(isValid).toStrictEqual(undefined);
  });

  test('should return null if value passed is valid', async () => {
    const isValid = isMarkDownLinkIncluded('Some document info');
    expect(isValid).toStrictEqual(undefined);
  });

  test('should return null if value passed is empty', async () => {
    const isValid = isMarkDownLinkIncluded('');
    expect(isValid).toStrictEqual(undefined);
  });

  test('should return null if value passed is undefined', async () => {
    const isValid = isMarkDownLinkIncluded(undefined);
    expect(isValid).toStrictEqual(undefined);
  });
});

describe('isFieldLetters()', () => {
  test('Should allow letters', async () => {
    const isValid = isFieldLetters('Test');
    expect(isValid).toStrictEqual(undefined);
  });

  test('Should allow not numbers', async () => {
    const isValid = isFieldLetters('123');
    expect(isValid).toStrictEqual('invalid');
  });

  test('Should not allow any special characters', async () => {
    const isValid = isFieldLetters('*');
    expect(isValid).toStrictEqual('invalid');
  });
});

describe('containsInvalidCharacters()', () => {
  test('Should allow letters', async () => {
    const isValid = containsInvalidCharacters('Test');
    expect(isValid).toStrictEqual(undefined);
  });

  test('Should not allow string containing html tags', async () => {
    const isValid = containsInvalidCharacters('some text <a href="www.google.com">click here</a>');
    expect(isValid).toStrictEqual('invalid');
  });
});
