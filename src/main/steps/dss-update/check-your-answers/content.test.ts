import languageAssertions from '../../../../test/unit/utils/languageAssertions';
import { FormContent } from '../../../app/form/Form';
import { CommonContent, generatePageContent } from '../../common/common.content';

import { generateContent, getErrors } from './content';

const enContent = {
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Check answers before submitting your update',
  change: 'Change',
  continue: 'Accept and send',
  statementOfTruth: 'By updating this case you are confirming that, to the best of your knowledge, the details you are providing are correct.',
  submitApplicationText: 'Now submit your Application',
  errorSummaryMessage: 'There is a problem',
  keys: {
    information: 'Additional information',
    documents: 'Additional documents',
    documentDescription: 'Why is this relevant to the case?',
  },
  errors: {
    submissionError: {
      content: 'Your application is not submitted. Please try again',
    },
  },
};

const cyContent = {
  serviceName: 'Update an appeal to the First-tier Tribunal - welsh',
  title: 'Check answers before submitting your update - welsh',
  change: 'Change - welsh',
  continue: 'Accept and send - welsh',
  statementOfTruth: 'By updating this case you are confirming that, to the best of your knowledge, the details you are providing are correct. - welsh',
  submitApplicationText: 'Now submit your Application - welsh',
  errorSummaryMessage: 'There is a problem - welsh',
  keys: {
    information: 'Additional information - welsh',
    documents: 'Additional documents - welsh',
    documentDescription: 'Why is this relevant to the case? - welsh',
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

describe('getErrors() function Test', () => {
  test('getErrors English', () => {
    const englishErrors = getErrors('en');
    expect(englishErrors).toEqual(enContent.errors);
  });

  test('getErrors Welsh', () => {
    const welshErrors = getErrors('cy');
    expect(welshErrors).toEqual(cyContent.errors);
  });
});
/* eslint-enable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
