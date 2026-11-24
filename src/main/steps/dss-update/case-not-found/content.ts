import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';

export const en = () => ({
  title: "Your HMCTS reference number doesn't match an existing appeal",
  heading: "Your HMCTS reference number doesn't match an existing appeal",
  line1Part1: 'The reference number you entered (',
  line1Part2: ') does not match any appeal in our records.',
  line2:
    'Check that you have entered the correct 16-digit reference number. You can find this in the email you received after submitting your tribunal forms.',
  reEnterReference: 'Re-enter your HMCTS reference number',
  contactSupport: 'Contact support',
  back: 'Back',
});

export const cy = () => ({
  title: "Nid yw eich cyfeirnod GLlTEF yn cyfateb i apêl sy'n bodoli eisoes",
  heading: "Nid yw eich cyfeirnod GLlTEF yn cyfateb i apêl sy'n bodoli eisoes",
  line1Part1: "Nid yw'r cyfeirnod a nodwyd gennych (",
  line1Part2: ') yn cyfateb i unrhyw apêl yn ein cofnodion.',
  line2:
    "Gwiriwch eich bod wedi nodi'r cyfeirnod 16 digid cywir. Gallwch ddod o hyd i'r wybodaeth hon yn yr e-bost a gawsoch ar ôl cyflwyno eich ffurflenni tribiwnlys.",
  reEnterReference: 'Nodwch eich cyfeirnod GLlTEF eto',
  contactSupport: 'Cysylltu am gymorth',
  back: 'Yn ôl',
});

export const form: FormContent = {
  fields: {},
  submit: {
    text: l => l.onlyContinue,
  },
};

const languages = { en, cy };

export const generateContent: TranslationFn = content => {
  const referenceNumber = content.userCase?.applicantCaseId || '';
  const translations = languages[content.language]();
  return {
    ...translations,
    line1: `${translations.line1Part1}${referenceNumber}${translations.line1Part2}`,
    form,
  };
};
