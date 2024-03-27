import languageAssertions from '../../../../test/unit/utils/languageAssertions';
import { FormContent } from '../../../app/form/Form';
import { CommonContent, generatePageContent } from '../../common/common.content';

import { generateContent, getErrors } from './content';

const enContent = {
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Check answers before submitting your update',
  change: 'change',
  continue: 'Accept and send',
  statementOfTruth: 'By updating this case you are confirming that, to the best of your knowledge, the details you are providing are correct.',
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
  serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
  title: 'Gwiriwch eich atebion cyn cyflwyno eich diweddariad',
  change: 'newid',
  continue: 'Derbyn ac anfon',
  statementOfTruth: 'Trwy ddiweddaru’r achos hwn rydych yn cadarnhau, hyd eithaf eich gwybodaeth, bod y manylion rydych yn eu darparu yn gywir.',
  submitApplicationText: 'Diweddarwch eich achos nawr',
  errorSummaryMessage: 'Mae yna broblem',
  keys: {
    information: 'Gwybodaeth ychwanegol',
    document: 'Dogfennau ychwanegol',
    documentRelevance: 'Perthnasedd y ddogfen',
  },
  errors: {
    submissionError: {
      required: 'Your application is not submitted. Please try again - welsh',
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
