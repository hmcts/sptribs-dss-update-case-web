import languageAssertions from '../../../../test/unit/utils/languageAssertions';
import { CommonContent } from '../../common/common.content';

import { generateContent, getErrors } from './content';

const enContent = {
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Check answers before submitting your update',
  change: 'change',
  continue: 'Accept and send',
  statementOfTruth:
    'By updating this case you are confirming that, to the best of your knowledge, the details you are providing are correct.',
  submitApplicationText: 'Now update your case',
  errorSummaryMessage: 'There is a problem',
  keys: {
    information: 'Additional information',
    document: 'Additional document',
    documentRelevance: 'Document relevance',
  },
  errors: {
    submissionError: {
      required: 'Your application is not submitted. Please try again',
    },
  },
};

const cyContent = {
  serviceName: 'Update an appeal to the First-tier Tribunal - welsh',
  title: 'Check answers before submitting your update - welsh',
  change: 'change - welsh',
  continue: 'Accept and send - welsh',
  statementOfTruth:
    'By updating this case you are confirming that, to the best of your knowledge, the details you are providing are correct. - welsh',
  submitApplicationText: 'Now update your case - welsh',
  errorSummaryMessage: 'There is a problem - welsh',
  keys: {
    information: 'Additional information - welsh',
    document: 'Additional document - welsh',
    documentRelevance: 'Document relevance - welsh',
  },
  errors: {
    submissionError: {
      required: 'Your application is not submitted. Please try again - welsh',
    },
  },
};

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

  test('should return correct english content', () => {
    languageAssertions('en', enContent, () => generateContent(commonContent));
  });

  test('should return correct welsh content', () => {
    languageAssertions('en', cyContent, () =>
      generateContent({
        ...commonContent,
        language: 'cy',
      })
    );
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
