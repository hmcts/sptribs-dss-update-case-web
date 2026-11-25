import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { ValidationError, isFieldFilledIn, normaliseCaseReference } from '../../../app/form/validation';

export const en = () => ({
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Enter your HMCTS reference number',
  line2:
    "You can find this on any correspondence that you've received from HMCTS. HMCTS reference numbers are 16 digits long.",
  subtitle: 'HMCTS reference number',
  errorSummaryMessage: 'There is a problem',
  errors: {
    applicantCaseId: {
      required: 'Enter your HMCTS reference number',
      invalid: 'HMCTS reference number must be 16 digits long',
      caseNotFound: 'Please enter a valid reference number',
    },
  },
});

export const cy = () => ({
  serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
  title: 'Nodwch eich cyfeirnod GLlTEF',
  line2:
    "Gallwch ddod o hyd i hyn ar unrhyw ohebiaeth rydych chi wedi'i derbyn gan GLlTEF. Mae cyfeirnodau GLlTEF yn 16 rhif o hyd.",
  subtitle: 'Cyfeirnod GLlTEF',
  errorSummaryMessage: 'Mae yna broblem',
  errors: {
    applicantCaseId: {
      required: 'Nodwch eich cyfeirnod GLlTEF',
      invalid: 'Rhaid i gyfeirnod GLlTEF fod yn 16 digid o hyd',
      caseNotFound: 'Rhowch gyfeirnod dilys',
    },
  },
});

export const form = {
  fields: {
    applicantCaseId: {
      type: 'text',
      classes: 'govuk-input--width-20',
      label: l => l.subtitle,
      validator: value =>
        isFieldFilledIn(value) || (normaliseCaseReference(value) === undefined ? ValidationError.INVALID : undefined),
    },
  },
  submit: {
    text: l => l.onlyContinue,
  },
} satisfies FormContent;

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
