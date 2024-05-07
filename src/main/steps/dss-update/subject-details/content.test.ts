import { AnyType } from '../../../app/form/validation';

import { cy, en, generateContent } from './content';

const englishContent = () => ({
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Subject of this case',
  errorSummaryMessage: 'There is a problem',
  subjectFullNameLabel: 'Full name',
  subjectFullNameHint: 'This name must match exactly with the case record',
  subjectDOBLabel: 'Date of birth',
  subjectDOBHint: 'For example, 31 3 1980',
  day: 'Day',
  month: 'Month',
  year: 'Year',
  errors: {
    subjectFullName: {
      required: 'Please enter a full name. This name must match exactly with the case record',
      invalid: 'Please enter a valid name. This name must match exactly with the case record',
    },
    subjectDOB: {
      required: 'Please enter a full date of birth. For example, 31 3 1980',
      invalid: 'Please enter a valid date of birth. For example, 31 3 1980',
    },
    inputFields: {
      required:
        "Some of the information you have given doesn't match our records. Please enter the right value and try again.",
    },
    caseError: {
      required: 'Error verifying case',
    },
  },
});
const welshContent = () => ({
  serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
  title: 'Testun yr achos hwn',
  errorSummaryMessage: 'Mae yna broblem',
  subjectFullNameLabel: 'Enw llawn',
  subjectFullNameHint: "Rhaid i'r enw hwn gyd-fynd yn union â chofnod yr achos",
  subjectDOBLabel: 'Dyddiad geni',
  subjectDOBHint: 'Er enghraifft, 31 3 1980',
  day: 'Diwrnod',
  month: 'Mis',
  year: 'Blwyddyn',
  errors: {
    subjectFullName: {
      required: "Nodwch enw llawn. Rhaid i'r enw hwn gyd-fynd yn union â chofnod yr achos",
      invalid: "Rhowch enw dilys. Rhaid i'r enw hwn gyd-fynd yn union â chofnod yr achos",
    },
    subjectDOB: {
      required: 'Nodwch ddyddiad geni. Er enghraifft, 31 3 1980',
      invalid: 'Nodwch ddyddiad geni dilys. Er enghraifft, 31 3 1980',
    },
    inputFields: {
      required:
        'Nid yw rhywfaint o’r wybodaeth rydych wedi’i rhoi yn cyd-fynd â’n cofnodion. Darparwch yr wybodaeth gywir a rhowch gynnig arall arni.',
    },
    caseError: {
      required: 'Gwall wrth ddilysu’r achos',
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
            },
          },
        },
      },
    };
    // const genCON: AnyType = generateContent;
    expect(generateContent(content)).not.toEqual({});
  });
});
