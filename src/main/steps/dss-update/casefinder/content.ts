/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { isFieldFilledIn, isNotNumeric } from '../../../app/form/validation';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const en = () => ({
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Existing case details',
  line1: 'You can find this information in the email you received after submitting your tribunal forms.',
  subtitle: 'Case reference number',
  caseNumberHint: 'This number will be 16 digits long. It should not include spaces or any of these characters: - * (  )  &  !  /  ;',
  errorSummaryMessage: 'There is a problem',
  errors: {
    applicantCaseId: {
      required: 'Please enter a reference number',
      notNumeric: 'Please enter a valid reference number. The reference number should not include spaces or any characters - * ( ) & ! /  ;',
      caseNotFound: 'Please enter a valid reference number',
    },
  },
});

export const cy = () => ({
  serviceName: 'Update an appeal to the First-tier Tribunal - welsh',
  title: 'Existing case details - welsh',
  line1:
    'You can find this information in the email you received after submitting your tribunal forms. - welsh',
  subtitle: 'Case reference number - welsh',
  caseNumberHint: 'This number will be 16 digits long. It should not include spaces or any of these characters: - * (  )  &  !  /  ; - welsh.',
  errorSummaryMessage: 'There is a problem - welsh',
  errors: {
    applicantCaseId: {
      required: 'Please enter a reference number - welsh',
      notNumeric: 'Please enter a valid reference number. The reference number should not include spaces or any characters - * ( ) & ! /  ; - welsh',
      caseNotFound: 'Please enter a valid reference number - welsh',
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
