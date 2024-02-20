/* eslint-disable @typescript-eslint/no-explicit-any */
//import { isFieldFilledIn } from '../../../app/form/validation';
import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';
import { CommonContent } from '../../common/common.content';

import { UploadFormSummary } from './utils';

export const enContent = {
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Check answers before submitting your update',
  change: 'Change',
  continue: 'Accept and send',
  statementOfTruth: 'By updating this case you are confirming that, to the best of your knowledge, the details you are providing are correct.',
  submitApplicationText: 'Now submit your Application',
  errorSummaryMessage: 'There is a problem',
  keys: {
    information: 'Additional information',
    fileName: 'Additional documents',
    description: 'Why is this relevant to the case?',
  },
  errors: {
    submissionError: {
      content: 'Your application is not submitted. Please try again',
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
  serviceName: 'Update an appeal to the First-tier Tribunal - welsh',
  title: 'Check answers before submitting your update - welsh',
  change: 'Change - welsh',
  continue: 'Accept and send - welsh',
  statementOfTruth: 'By updating this case you are confirming that, to the best of your knowledge, the details you are providing are correct. - welsh',
  submitApplicationText: 'Now submit your Application - welsh',
  errorSummaryMessage: 'There is a problem - welsh',
  keys: {
    information: 'Additional information - welsh',
    fileName: 'Additional documents - welsh',
    description: 'Why is this relevant to the case? - welsh',
  },
  errors: {
    submissionError: {
      content: 'Your application is not submitted. Please try again - welsh',
    },
  },
};

const cy: typeof en = (content: CommonContent) => {
  const caseDocuments = content['additionalData']!['req']['session']['caseDocuments'] || [];
  const caseInformation = content['additionalData']!['req']['session']['documentDetail'] || '';
  return {
    ...cyContent,
    language: content.language,
    sections: [UploadFormSummary(enContent, caseDocuments, caseInformation)],
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
