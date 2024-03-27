import { TranslationFn } from '../../app/controller/GetController';

export const en = {
  title: 'Update an existing First-tier Tribunal case',
  email: 'Email',
  emailAddress:
    'Email us at <a href="mailto:CIC.enquiries@justice.gov.uk" class="govuk-link">CIC.enquiries@justice.gov.uk.</a>',
};

export const cy: typeof en = {
  title: 'Diweddaru achos sy’n bodoli’n barod yn y Tribiwnlys Haen Gyntaf',
  email: 'E-bost',
  emailAddress:
    'Anfonwch neges e-bost i <a href="mailto:CIC.enquiries@justice.gov.uk" class="govuk-link">CIC.enquiries@justice.gov.uk.</a>',
};

const languages = {
  en,
  cy,
};

export const generateContent: TranslationFn = content => {
  return languages[content.language];
};
