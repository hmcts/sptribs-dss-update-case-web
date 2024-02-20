import languageAssertions from '../../../../test/unit/utils/languageAssertions';
import { FormContent } from '../../../app/form/Form';
import { CommonContent, generatePageContent } from '../../common/common.content';

import { generateContent } from './content';

const enContent = {
  serviceName: 'Update an existing First-tier Tribunal case',
  title: 'Check answers before submitting your update',
  change: 'Change',
  continue: 'Accept and continue',
  statementOfTruth: 'By updating this case you are confirming that, to the best of your knowledge, the details you are providing are correct.',
  submitApplicationText: 'Now submit your Application',
  errorSummaryMessage: 'There is a problem',
  keys: {
    infomation: 'Additional information',
    fileName: 'Additional documents',
    description: 'Why is this relevant to the case?',
  },
  errors: {
    submissionError: {
      content: 'Your application is not submitted. Please try again',
    },
  },
};

const cyContent = {
  serviceName: 'Update an existing First-tier Tribunal case - welsh',
  title: 'Check answers before submitting your update - welsh',
  change: 'Change - welsh',
  continue: 'Accept and send - welsh',
  statementOfTruth: 'By updating this case you are confirming that, to the best of your knowledge, the details you are providing are correct. - welsh',
  submitApplicationText: 'Now submit your Application - welsh',
  errorSummaryMessage: 'There is a problem - welsh',
  keys: {
    infomation: 'Additional information',
    fileName: 'Additional documents - welsh',
    description: 'Why is this relevant to the case? - welsh',
  },
  errors: {
    submissionError: {
      content: 'Your application is not submitted. Please try again - welsh',
    },
  },
};

/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
describe('check-your-answer > content', () => {
  const commonContent = {
    language: 'en',
    additionalData: {
      req: {
        session: {
          caseDocuments: [{ documentId: 'abc' }, { documentId: 'ubc' }],
        },
      },
    },
  } as unknown as CommonContent;

  // eslint-disable-next-line jest/expect-expect
  test('should return correct english content', () => {
    languageAssertions('en', enContent, () => generateContent(commonContent));
  });

  // eslint-disable-next-line jest/expect-expect
  test('should return correct welsh content', () => {
    languageAssertions('en', cyContent, () =>
      generateContent({
        ...commonContent,
        language: 'cy',
      })
    );
  });
  test('should contain submit button', () => {
    const generatedContent = generateContent(commonContent);
    const form = generatedContent.form as FormContent;
    expect((form.submit!.text as Function)(generatePageContent({ language: 'en' }))).toBe('Save and continue');
  });
});
/* eslint-enable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
