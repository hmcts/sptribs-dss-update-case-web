import languageAssertions from '../../../../test/unit/utils/languageAssertions';
import { CommonContent } from '../../common/common.content';

import { generateContent } from './content';

const en = {
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Case Updated:',
  successMessage: `<strong>1234 - 1234 - 1234 - 1234</strong>`,
  line1: 'Thank you for updating your case.',
  line2: 'The additional information that you have submitted will be sent to the Tribunal.',
  line3: 'An email will be sent to you that explains what will happen next.',
  feedback: 'Feedback',
  feedbackBody: "<b>We would like to hear your thoughts</b><br>Complete this short 5-minutes survey to help improve our services for you and others <a class='govuk-link' href='https://www.smartsurvey.co.uk/s/SurveyExit/?service=Specials'target=_blank><br>Please leave your your feedback</a>",
  closeAndExit: 'Close and exit'
};

const cy = {
  serviceName: 'Update an appeal to the First-tier Tribunal - welsh',
  title: 'Case Updated: - welsh',
  successMessage: '<strong>1234 - 1234 - 1234 - 1234</strong> - welsh',
  line1: 'Thank you for updating your case. - welsh',
  line2: 'The additional information that you have submitted will be sent to the Tribunal. - welsh',
  line3: 'An email will be sent to you that explains what will happen next. - welsh',
  feedback: 'Adborth',
  feedbackBody: "<b>We would like to hear your thoughts</b><br>Complete this short 5-minutes survey to help improve our services for you and others <a class='govuk-link' href='https://www.smartsurvey.co.uk/s/SurveyExit/?service=Specials'target=_blank><br>Please leave your your feedback</a> - welsh",
  closeAndExit: 'Close and exit - welsh'
};

/* eslint-disable @typescript-eslint/ban-types */
describe('application confirmation', () => {
  const commonContent = { language: 'en', userCase: { applyingWith: 'alone', id: '1234123412341234' } } as unknown as CommonContent;
  // eslint-disable-next-line jest/expect-expect
  test('should return correct english content', () => {
    languageAssertions('en', en, () => generateContent(commonContent));
  });

  // eslint-disable-next-line jest/expect-expect
  test('should return correct welsh content', () => {
    languageAssertions('cy', cy, () => generateContent({ ...commonContent, language: 'cy' }));
  });
});
