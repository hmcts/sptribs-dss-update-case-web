import path from 'path';

import { configure } from 'nunjucks';

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
  errorSummaryMessage: 'There is a problem',
  keys: {
    information: 'Additional information',
    document: 'Additional document',
    documentRelevance: 'Document relevance',
  },
  errors: {
    submissionError: {
      required: 'Your application is not submitted. Please try again',
      caseNotAccessible:
        'You cannot update this appeal with this account. Check that you are signed in with the account used to create it.',
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
  errorSummaryMessage: 'Mae yna broblem',
  keys: {
    information: 'Gwybodaeth ychwanegol',
    document: 'Dogfennau ychwanegol',
    documentRelevance: 'Perthnasedd y ddogfen',
  },
  errors: {
    submissionError: {
      required: 'Nid yw eich cais wedi’i gyflwyno. Rhowch gynnig arall arni',
      caseNotAccessible:
        'Ni allwch ddiweddaru’r apêl hon gyda’r cyfrif hwn. Gwiriwch eich bod wedi mewngofnodi gyda’r cyfrif a ddefnyddiwyd i’w chreu.',
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

describe('case access error summary', () => {
  const templates = configure(
    [
      path.resolve(__dirname, '../..'),
      path.resolve('node_modules/govuk-frontend/dist'),
      path.resolve('node_modules/govuk-frontend'),
    ],
    { autoescape: true }
  );

  test.each(['en', 'cy'] as const)('renders the %s access message with a link to the page heading', language => {
    const html = templates.render('common/error/summary.njk', {
      sessionErrors: [{ propertyName: 'submissionError', errorType: 'caseNotAccessible' }],
      errors: getErrors(language),
      errorSummaryHeading: language === 'en' ? 'There is a problem' : 'Mae yna broblem',
    });

    expect(html).toContain(getErrors(language).submissionError.caseNotAccessible);
    expect(html).toContain('href="#submissionError"');
  });
});
