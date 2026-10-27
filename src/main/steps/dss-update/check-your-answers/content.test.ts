import languageAssertions from '../../../../test/unit/utils/languageAssertions';
import { CommonContent } from '../../common/common.content';

import { generateContent, getErrors } from './content';

const enContent = {
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Check answers before submitting your update',
  change: 'change',
  continue: 'Accept and send',
  statementOfTruth:
    'By updating this appeal you are confirming that, to the best of your knowledge, the details you are providing are correct.',
  submitApplicationText: 'Now update your appeal',
  assignCreatorRole: 'Give user creator role',
  creatorRoleAssigned: 'Creator role assigned. You can now send your update.',
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
    roleAssignmentError: {
      required: 'We could not assign the creator role. Please try again.',
    },
  },
};

const cyContent = {
  serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
  title: 'Gwiriwch eich atebion cyn cyflwyno eich diweddariad',
  change: 'newid',
  continue: 'Derbyn ac anfon',
  statementOfTruth:
    'Drwy ddiweddaru’r apêl hon rydych yn cadarnhau, hyd eithaf eich gwybodaeth, bod y manylion a ddarperir gennych yn gywir.',
  submitApplicationText: 'Diweddarwch eich apêl nawr',
  assignCreatorRole: 'Rhowch rôl creawdwr i’r defnyddiwr',
  creatorRoleAssigned: 'Mae’r rôl creawdwr wedi’i neilltuo. Gallwch anfon eich diweddariad nawr.',
  errorSummaryMessage: 'Mae yna broblem',
  keys: {
    information: 'Gwybodaeth ychwanegol',
    document: 'Dogfennau ychwanegol',
    documentRelevance: 'Perthnasedd y ddogfen',
  },
  errors: {
    submissionError: {
      required: 'Nid yw eich cais wedi’i gyflwyno. Rhowch gynnig arall arni',
    },
    roleAssignmentError: {
      required: 'Nid oedd modd inni neilltuo’r rôl creawdwr. Rhowch gynnig arall arni.',
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

  test('shows the creator role action only after data verification', () => {
    const content = generateContent({
      ...commonContent,
      additionalData: { req: { session: { isDataVerified: true, isCreatorRoleAssigned: false } } },
    } as unknown as CommonContent);

    expect(content.isDataVerified).toBe(true);
    expect(content.isCreatorRoleAssigned).toBe(false);
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
