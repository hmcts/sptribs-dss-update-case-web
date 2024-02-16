/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AnyType } from '../../../app/form/validation';

import { cy, en, generateContent } from './content';

const englishContent = () => ({
  serviceName: 'DSS Update Case',
  title: '[title]',
  errorSummaryMessage: 'There is a problem',
  errors: {
    subjectFullName: {
      required: 'Some of the form fields are empty. Please enter the values and retry',
    },
    subjectDOB: {
      required: 'Some of the date fields are empty. Please enter the values and retry.',
      invalid: 'Invalid date'
    },
    inputFields: {
      required: 'Data entered doesn\'t match'
    },
    caseError: {
      required: 'Error verifying case'
    },
  },
});
const welshContent = () => ({
  serviceName: 'DSS Update Case - welsh',
  title: '[title] - welsh',
  errorSummaryMessage: 'There is a problem - welsh',
  errors: {
    subjectFullName: {
      required: 'Some of the form fields are empty. Please enter the values and retry - welsh',
    },
    subjectDOB: {
      required: 'Some of the date fields are empty. Please enter the values and retry. - welsh',
      invalid: 'Invalid date - welsh'
    },
    inputFields: {
      required: 'Data entered doesn\'t match - welsh'
    },
    caseError: {
      required: 'Error verifying case - welsh'
    },
  },
});

describe('Matching Language content', () => {
  test('matching english content', () => {
    expect(en()).toEqual(englishContent());
  });

  test('matching welsh content', () => {
    expect(cy()).toEqual(welshContent());
  });
});

//generateContent
describe('generateContent() function Test', () => {
  test('generateContent', () => {
    const content: AnyType = {
      language: 'en',
      additionalData: {
        req: {
          session: {
            verificationData: {
              dssQuestionAnswerPairs: [{ question: 'what is the name', answer: 'johndoe' }],
              dssQuestionAnswerDatePairs: [{ question: 'what is the DOB', answer: '27-10-1990' }],
            },
            isDataVerified: false,
          },
        },
      },
    };
    // const genCON: AnyType = generateContent;
    expect(generateContent(content)).not.toEqual({});
  });
});

//generateContent
describe('generateContent() with tempvalidation data', () => {
  test('generateContent', () => {
    const content: AnyType = {
      language: 'en',
      additionalData: {
        req: {
          session: {
            verificationData: {
              dssQuestionAnswerPairs: [{ question: 'what is the name', answer: 'johndoe' }],
              dssQuestionAnswerDatePairs: [{ question: 'what is the DOB', answer: '27-10-1990' }],
            },
            isDataVerified: false,
            tempValidationData: {
              dssQuestionAnswerPairs: [{ question: 'what is the name', answer: 's' }],
              dssQuestionAnswerDatePairs: [{ question: 'what is the DOB', answer: '27-10-1990' }],
            },
          },
        },
      },
    };
    // const genCON: AnyType = generateContent;
    expect(generateContent(content)).not.toEqual({});
  });
});

//generateContent
describe('generateContent() with no tempdata', () => {
  test('generateContent', () => {
    const content: AnyType = {
      language: 'en',
      additionalData: {
        req: {
          session: {
            verificationData: {
              dssQuestionAnswerPairs: [{ question: 'what is the name', answer: 'johndoe' }],
              dssQuestionAnswerDatePairs: [{ question: 'what is the DOB', answer: '27-10-1990' }],
            },
            isDataVerified: false,
            tempValidationData: {},
          },
        },
      },
    };
    // const genCON: AnyType = generateContent;
    expect(generateContent(content)).not.toEqual({});
  });
});
