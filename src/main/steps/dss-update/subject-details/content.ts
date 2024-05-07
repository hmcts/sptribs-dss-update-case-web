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
  subjectFullNameHint: 'This name must match exactly with the case record',
  subjectDOBLabel: 'Date of birth',
  subjectDOBHint: 'For example, 31 3 1980',
  day: 'Day',
  month: 'Month',
  year: 'Year',
  errors: {
    subjectFullName: {
      required: 'Enter a full name. This name must match exactly with the case record',
      invalid: 'Enter a valid name. This name must match exactly with the case record',
    },
    subjectDOB: {
      required: 'Enter a full date of birth. For example, 31 3 1980',
      invalid: 'Enter a valid date of birth. For example, 31 3 1980',
    },
    inputFields: {
      required:
        "Some of the information you have given doesn't match our records. Enter the right value and try again.",
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
  subjectFullNameHint: "Rhaid i'r enw hwn gyd-fynd yn union â chofnod yr achos",
  subjectDOBLabel: 'Dyddiad geni',
  subjectDOBHint: 'Er enghraifft, 31 3 1980',
  day: 'Diwrnod',
  month: 'Mis',
  year: 'Blwyddyn',
  errors: {
    subjectFullName: {
      required: "Nodwch enw llawn. Rhaid i'r enw hwn gyd-fynd yn union â chofnod yr achos",
      invalid: "Rhowch enw dilys. Rhaid i'r enw hwn gyd-fynd yn union â chofnod yr achos",
    },
    subjectDOB: {
      required: 'Nodwch ddyddiad geni. Er enghraifft, 31 3 1980',
      invalid: 'Nodwch ddyddiad geni dilys. Er enghraifft, 31 3 1980',
    },
    inputFields: {
      required:
        'Nid yw rhywfaint o’r wybodaeth rydych wedi’i rhoi yn cyd-fynd â’n cofnodion. Darparwch yr wybodaeth gywir a rhowch gynnig arall arni.',
    },
    caseError: {
      required: 'Gwall wrth ddilysu’r achos',
    },
  },
});

export const form: FormContent = {
  fields: {
    subjectFullName: {
      type: 'text',
      classes: 'govuk-input--width-20',
      label: l => l.subjectFullNameLabel,
      hint: l => l.subjectFullNameHint,
      validator: value => isFieldFilledIn(value) || isFieldLetters(value),
    },
    subjectDOB: {
      type: 'date',
      classes: 'govuk-date-input',
      label: l => l.subjectDOBLabel,
      hint: l => l.subjectDOBHint,
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
