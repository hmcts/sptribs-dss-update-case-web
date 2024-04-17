import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { isFieldFilledIn, isNotNumeric } from '../../../app/form/validation';

export const en = () => ({
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Existing case details',
  line1: 'You can find this information in the email you received after submitting your tribunal forms.',
  subtitle: 'Case reference number',
  caseNumberHint:
    'This number will be 16 digits long. It should not include spaces or any of these characters: - * (  )  &  !  /  ;',
  errorSummaryMessage: 'There is a problem',
  errors: {
    applicantCaseId: {
      required: 'Please enter a reference number',
      notNumeric:
        'Please enter a valid reference number. The reference number should not include spaces or any characters - * ( ) & ! /  ;',
      caseNotFound: 'Please enter a valid reference number',
    },
  },
});

export const cy = () => ({
  serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
  title: 'Manylion achos sy’n bodoli’n barod',
  line1: "Gallwch ddod o hyd i'r wybodaeth hon yn yr e-bost a gawsoch ar ôl cyflwyno eich ffurflenni tribiwnlys.",
  subtitle: 'Cyfeirnod yr achos',
  caseNumberHint:
    "Bydd y rhif hwn yn cynnwys 16 digid. Ni ddylai gynnwys bylchau neu unrhyw un o'r nodau canlynol: - * (  )  &  !  /  ;",
  errorSummaryMessage: 'Mae yna broblem',
  errors: {
    applicantCaseId: {
      required: 'Rhowch gyfeirnod',
      notNumeric:
        'Rhowch gyfeirnod dilys. Ni ddylai’r cyfeirnod gynnwys bylchau neu unrhyw un o’r nodau canlynol - * ( ) & ! /  ;',
      caseNotFound: 'Rhowch gyfeirnod dilys',
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
