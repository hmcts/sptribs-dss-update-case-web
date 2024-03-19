import { TranslationFn } from '../../../app/controller/GetController';
import { CommonContent } from '../../common/common.content';
import { FormContent } from '../../../app/form/Form';

const en = (content: CommonContent) => {
  return {
    serviceName: 'Update an appeal to the First-tier Tribunal',
    title: 'Case Updated:',
    successMessage: `<strong>${getHyphenatedCaseId(content)}</strong>`,
    line1: 'Thank you for updating your case.',
    line2: 'The additional information that you have submitted will be sent to the Tribunal.',
    line3: 'An email will be sent to you that explains what will happen next.',
    feedback: 'Feedback',
    feedbackBody: "<b>We would like to hear your thoughts</b><br>Complete this short 5-minutes survey to help improve our services for you and others <a class='govuk-link' href='https://www.smartsurvey.co.uk/s/SurveyExit/?service=Specials'target=_blank><br>Please leave your your feedback</a>",
    closeAndExit: 'Close and exit'
  };
};

const cy = (content: CommonContent) => {
  return {
    serviceName: 'Update an appeal to the First-tier Tribunal - welsh',
    title: 'Case Updated: - welsh',
    successMessage: `<strong>${getHyphenatedCaseId(content)}</strong> - welsh`,
    line1: 'Thank you for updating your case. - welsh',
    line2: 'The additional information that you have submitted will be sent to the Tribunal. - welsh',
    line3: 'An email will be sent to you that explains what will happen next. - welsh',
    feedback: 'Adborth',
    feedbackBody: "<b>We would like to hear your thoughts</b><br>Complete this short 5-minutes survey to help improve our services for you and others <a class='govuk-link' href='https://www.smartsurvey.co.uk/s/SurveyExit/?service=Specials'target=_blank><br>Please leave your your feedback</a> - welsh",
    closeAndExit: 'Close and exit - welsh'
  };
};

export const getHyphenatedCaseId = content => {
  const userCase = content.userCase!;
  return userCase?.id?.toString().replace(/.{4}/g, '$& - ').substring(0, 25);
}

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
    form
  };
};
