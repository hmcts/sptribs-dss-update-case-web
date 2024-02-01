/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { isDateInputInvalid, isFieldFilledIn } from '../../../app/form/validation';
import { CaseDate } from '../../../app/case/case';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const en = () => ({
  serviceName: 'DSS Update Case',
  title: '[title]',
  errorSummaryMessage: 'There is a problem',
  errors: {
    dataNotMatched: {
      required:
        "Some of the information you have given doesn't match our records. Please enter the right value and retry.",
    },
    isEmptyFields: {
      required: 'Some of the form fields are empty. Please enter the values and retry.',
    },
    inputFields: {
      notAlphaNumeric: 'Some of the form fields have a invalid character. Please enter letters and numbers only.',
    },
  },
});

export const cy = () => ({
  serviceName: 'DSS Update Case',
  title: '[title]',
  errorSummaryMessage: 'There is a problem',
  errors: {
    dataNotMatched: {
      required: 'Some of the form fields are empty. Please enter the values and retry - welsh',
    },
    isEmptyFields: {
      required: 'Some of the form fields are empty. Please enter the values and retry.',
    },
    inputFields: {
      notAlphaNumeric:
        'Some of the form fields have a invalid character. Please enter letters and numbers only. - welsh',
    },
  },
});

export const form: FormContent = {
  fields: {
    applicantFirstName: {
      type: 'text',
      classes: 'govuk-input--width-20',
      label: 'Enter your first name',
      validator: value => isFieldFilledIn(value),
    },
    applicantSurname: {
      type: 'text',
      classes: 'govuk-input--width-20',
      label: 'Enter your surname',
      validator: value => isFieldFilledIn(value),
    },
    applicantDateOfBirth: {
      type: 'date',
      classes: 'govuk-date-input',
      label: 'Enter your date of birth',
      values: [
        {
          label: l => l.dateFormat['day'],
          name: 'day',
          classes: 'govuk-input--width-2',
          attributes: { maxLength: 2, pattern: '[0-9]*', inputMode: 'numeric' },
        },
        {
          label: l => l.dateFormat['month'],
          name: 'month',
          classes: 'govuk-input--width-2',
          attributes: { maxLength: 2, pattern: '[0-9]*', inputMode: 'numeric' },
        },
        {
          label: l => l.dateFormat['year'],
          name: 'year',
          classes: 'govuk-input--width-4',
          attributes: { maxLength: 4, pattern: '[0-9]*', inputMode: 'numeric' },
        },
      ],
      validator: (value, formData) => (formData['DOB'] === '' ? isDateInputInvalid(value as CaseDate) : ''),
    },
  },
  submit: {
    text: l => l.continue,
  },
};

const languages = {
  en,
  cy,
};

export const generateContent: TranslationFn = content => {
  const translations = languages[content.language]();
  return {
    ...translations,
    form,
  };
};
