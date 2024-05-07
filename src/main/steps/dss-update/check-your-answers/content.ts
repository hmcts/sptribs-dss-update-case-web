import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { CommonContent, Language } from '../../common/common.content';

import { UploadFormSummary } from './utils';

export const enContent = {
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
      required: 'Your application is not submitted. Try again',
    },
  },
};

const en = (content: any) => {
  const caseDocuments = content['additionalData']!['req']['session']['caseDocuments'] || [];
  const caseInformation = content['additionalData']!['req']['session']['documentDetail'] || '';
  return {
    ...enContent,
    language: content.language,
    sections: [UploadFormSummary(enContent, caseDocuments, caseInformation)],
  };
};

const cyContent: typeof enContent = {
  serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
  title: 'Gwiriwch eich atebion cyn cyflwyno eich diweddariad',
  change: 'newid',
  continue: 'Derbyn ac anfon',
  statementOfTruth:
    'Trwy ddiweddaru’r achos hwn rydych yn cadarnhau, hyd eithaf eich gwybodaeth, bod y manylion rydych yn eu darparu yn gywir.',
  submitApplicationText: 'Diweddarwch eich achos nawr',
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
  },
};

const cy: typeof en = (content: CommonContent) => {
  const caseDocuments = content['additionalData']!['req']['session']['caseDocuments'] || [];
  const caseInformation = content['additionalData']!['req']['session']['documentDetail'] || '';
  return {
    ...cyContent,
    language: content.language,
    sections: [UploadFormSummary(cyContent, caseDocuments, caseInformation)],
  };
};

export const form: FormContent = {
  fields: {},
  submit: {
    text: l => l.continue,
  },
};

const languages = {
  en,
  cy,
};

export const generateContent: TranslationFn = content => {
  const translations = languages[content.language](content);
  return {
    ...translations,
    form,
  };
};

export function getErrors(language: Language) {
  let errors: any;
  switch (language) {
    case 'cy':
      errors = cyContent.errors;
      break;
    case 'en':
    default:
      errors = enContent.errors;
  }

  return errors;
}
