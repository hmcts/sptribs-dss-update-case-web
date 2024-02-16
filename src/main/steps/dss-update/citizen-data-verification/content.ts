/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CaseDate } from '../../../app/case/case';
import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { isDateInputInvalid, isDateInputNotFilled, isFieldFilledIn } from '../../../app/form/validation';
import { covertToDateObject } from '../../../app/form/parser';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const en = () => ({
  serviceName: 'DSS Update Case',
  title: '[title]',
  errorSummaryMessage: 'There is a problem',
  errors: {
    subjectFullName: {
      required: 'Some of the form fields are empty. Please enter the values and retry',
    },
    subjectDOB: {
      required: 'Some of the date fields are empty. Please enter the values and retry.',
      invalid: 'Invalid date'
    },
    inputFields: {
      required: 'Data entered doesn\'t match'
    },
    caseError: {
      required: 'Error verifying case'
    },
  },
});

export const cy = () => ({
  serviceName: 'DSS Update Case - welsh',
  title: '[title] - welsh',
  errorSummaryMessage: 'There is a problem - welsh',
  errors: {
    subjectFullName: {
      required: 'Some of the form fields are empty. Please enter the values and retry - welsh',
    },
    subjectDOB: {
      required: 'Some of the date fields are empty. Please enter the values and retry. - welsh',
      invalid: 'Invalid date - welsh'
    },
    inputFields: {
      required: 'Data entered doesn\'t match - welsh'
    },
    caseError: {
      required: 'Error verifying case - welsh'
    },
  },
});

export const form: FormContent = {
  fields: {
    subjectFullName: {
      type: 'text',
      classes: 'govuk-input--width-20',
      label: 'Enter your name',
      validator: value => isFieldFilledIn(value),
    },
    subjectDOB: {
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
      parser: body => covertToDateObject('subjectDOB', body as Record<string, unknown>),
      validator: value => {
        if (isDateInputNotFilled(value as CaseDate)) {
          return 'required';
        }
        if (isDateInputInvalid(value as CaseDate)) {
          return 'invalid';
        }
      },
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
