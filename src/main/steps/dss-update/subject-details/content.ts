import { CaseDate } from '../../../app/case/case';
import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { covertToDateObject } from '../../../app/form/parser';
import {
  isDateInputInvalid,
  isDateInputNotFilled,
  isFieldFilledIn,
  isFieldLetters,
} from '../../../app/form/validation';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const en = () => ({
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Subject of this case',
  errorSummaryMessage: 'There is a problem',
  subjectFullNameLabel: 'Full name',
  subjectDOBLabel: 'Date of birth',
  day: 'Day',
  month: 'Month',
  year: 'Year',
  errors: {
    subjectFullName: {
      required: 'Please enter full name',
      invalid: 'Please enter a valid name',
    },
    subjectDOB: {
      required: 'Please enter date of birth',
      invalid: 'Please enter valid date of birth',
    },
    inputFields: {
      required:
        "Some of the information you have given doesn't match our records. Please enter the right value and try again.",
    },
    caseError: {
      required: 'Error verifying case',
    },
  },
});

export const cy = () => ({
  serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
  title: 'Testun yr achos hwn',
  errorSummaryMessage: 'Mae yna broblem',
  subjectFullNameLabel: 'Enw llawn',
  subjectDOBLabel: 'Dyddiad geni',
  day: 'Diwrnod',
  month: 'Mis',
  year: 'Blwyddyn',
  errors: {
    subjectFullName: {
      required: 'Nodwch enw llawn',
      invalid: 'Rhowch enw dilys',
    },
    subjectDOB: {
      required: 'Nodwch ddyddiad geni',
      invalid: 'Nodwch ddyddiad geni dilys',
    },
    inputFields: {
      required:
        "Some of the information you have given doesn't match our records. Please enter the right value and try again. - welsh",
    },
    caseError: {
      required: 'Error verifying case - welsh',
    },
  },
});

export const form: FormContent = {
  fields: {
    subjectFullName: {
      type: 'text',
      classes: 'govuk-input--width-20',
      label: l => l.subjectFullNameLabel,
      validator: value => isFieldFilledIn(value) || isFieldLetters(value),
    },
    subjectDOB: {
      type: 'date',
      classes: 'govuk-date-input',
      label: l => l.subjectDOBLabel,
      values: [
        {
          label: l => l.day,
          name: 'day',
          classes: 'govuk-input--width-2',
          attributes: { maxLength: 2, pattern: '[0-9]*', inputMode: 'numeric' },
        },
        {
          label: l => l.month,
          name: 'month',
          classes: 'govuk-input--width-2',
          attributes: { maxLength: 2, pattern: '[0-9]*', inputMode: 'numeric' },
        },
        {
          label: l => l.year,
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
    text: l => l.onlyContinue,
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
