/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AnyType } from '../../../app/form/validation';

import { cy, en, generateContent } from './content';

const englishContent = () => ({
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Subject of this case',
  errorSummaryMessage: 'There is a problem',
  subjectFullNameLabel: "Full name",
  subjectDOBLabel: "Date of birth",
  day: "Day",
  month: "Month",
  year: "Year",
  errors: {
    subjectFullName: {
      required: 'Please enter full name',
      invalid: 'Please enter a valid name',
    },
    subjectDOB: {
      required: 'Please enter date of birth',
      invalid: 'Please enter valid date of birth'
    },
    inputFields: {
      required: 'Some of the information you have given doesn\'t match our records. Please enter the right value and try again.'
    },
    caseError: {
      required: 'Error verifying case'
    },
  },
});
const welshContent = () => ({
  serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
  title: 'Testun yr achos hwn',
  errorSummaryMessage: 'Mae yna broblem',
  subjectFullNameLabel: "Enw llawn",
  subjectDOBLabel: "Dyddiad geni",
  day: "Diwrnod",
  month: "Mis",
  year: "Blwyddyn",
  errors: {
    subjectFullName: {
      required: 'Nodwch enw llawn',
      invalid: 'Rhowch enw dilys',
    },
    subjectDOB: {
      required: 'Nodwch ddyddiad geni',
      invalid: 'Nodwch ddyddiad geni dilys'
    },
    inputFields: {
      required: 'Some of the information you have given doesn\'t match our records. Please enter the right value and try again. - welsh'
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
            }
          }
        }
      }
    };
    // const genCON: AnyType = generateContent;
    expect(generateContent(content)).not.toEqual({});
  });
});
