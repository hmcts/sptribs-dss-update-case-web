import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { CommonContent } from '../../common/common.content';

const en = (content: CommonContent) => {
  return {
    serviceName: 'Update an appeal to the First-tier Tribunal',
    title: 'Case Updated:',
    successMessage: `<strong>${getHyphenatedCaseId(content)}</strong>`,
    line1: 'Thank you for updating your case.',
    line2: 'The additional information that you have submitted will be sent to the Tribunal.',
    line3: 'An email will be sent to you that explains what will happen next.',
    feedback: 'Feedback',
    feedbackBody:
      "<b>We would like to hear your thoughts</b><br>Complete this short 5-minutes survey to help improve our services for you and others <a class='govuk-link' href='https://www.smartsurvey.co.uk/s/SurveyExit/?service=Specials'target=_blank><br>Please leave your your feedback</a>",
    closeAndExit: 'Close and exit',
  };
};

const cy = (content: CommonContent) => {
  return {
    serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
    title: 'Achos wedi’i ddiweddaru',
    successMessage: `<strong>${getHyphenatedCaseId(content)}</strong>`,
    line1: 'Diolch i chi am ddiweddaru eich achos.',
    line2: 'Fe anfonir yr wybodaeth ychwanegol rydych wedi’i chyflwyno i’r Tribiwnlys.',
    line3: 'Fe anfonir neges e-bost atoch i esbonio beth fydd yn digwydd nesaf.',
    feedback: 'Adborth',
    feedbackBody:
      "<b>Hoffwn gael adborth gennych</b><br>Cwblhewch yr arolwg byr hwn fydd ond yn cymryd 5 munud o’ch amser i’n helpu ni i wella ein gwasanaethau i chi ac eraill <a class='govuk-link' href='https://www.smartsurvey.co.uk/s/SurveyExit/?service=Specials'target=_blank><br>Gadewch eich adborth</a>",
    closeAndExit: 'Cau a gadael',
  };
};

export const getHyphenatedCaseId = (content: CommonContent): string | undefined => {
  const userCase = content.userCase!;
  return userCase?.id?.toString().replace(/.{4}/g, '$& - ').substring(0, 25);
};

export const form: FormContent = {
  fields: {},
  submit: {
    text: l => l.closeAndExit,
  },
};
const languages = {
  en,
  cy,
};

export const generateContent: TranslationFn = content => {
  const translations = languages[content.language](content);
  return {
    ...translations,
    form,
  };
};
