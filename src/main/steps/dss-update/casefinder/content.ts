/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { isFieldFilledIn, isNotNumeric } from '../../../app/form/validation';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const en = () => ({
  serviceName: 'Update an existing First-tier Tribunal case',
  title: 'Existing case details',
  line1: 'You can find this information in the email you received after submitting your tribunal forms.',
  subtitle: 'Case reference number',
  caseNumberHint: 'This number will be 16 digits long.',
  errorSummaryMessage: 'There is a problem',
  errors: {
    applicantCaseId: {
      required: 'There is a problem. Please enter a case reference number',
      notNumeric: 'There is a problem. Please enter numeric case reference number of upto 16 digits',
    },
    caseNotFound: {
      required:
        "Some of the information you have given doesn't match our records. Please enter the right value and retry.",
    },
  },
});

export const cy = () => ({
  serviceName: 'Update an existing First-tier Tribunal case - welsh',
  title: 'Existing case details - welsh',
  line1:
    'You can find this information in the email you received after submitting your tribunal forms. - welsh',
  subtitle: 'Case reference number - welsh',
  caseNumberHint: 'This number will be 16 digits long - welsh.',
  errorSummaryMessage: 'There is a problem',
  errors: {
    applicantCaseId: {
      required: 'There is a problem. Please enter a case reference number - welsh',
      notNumeric: 'There is a problem. Please enter numeric case reference number of upto 16 digits - welsh',
    },
    caseNotFound: {
      required:
        "Some of the information you have given doesn't match our records. Please enter the right value and retry - welsh",
    },
  },
});

export const form: FormContent = {
  fields: {
    applicantCaseId: {
      type: 'text',
      classes: 'govuk-input--width-20',
      label: l => l.subtitle,
      hint: l => l.caseNumberHint,
      validator: value => isFieldFilledIn(value) || isNotNumeric(value),
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
