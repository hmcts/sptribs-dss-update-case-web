/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TranslationFn } from '../../app/controller/GetController';
import { FormContent } from '../../app/form/Form';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const en = () => ({
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Add information to a case',
  paragraph1:
    'Please provide any additional relevant information that you would like to add to this case. Don\'t include any personal financial information, such as your banking details.',
  additionalDocumentsHeading: 'Additional documents',
  paragraph2: 'You may want to submit other documents, files, or evidence that provides the Tribunal with more information about your case.',
  paragraph3: 'This will depend on the nature of your appeal, application or claim. Specific examples can be found in your completed tribunal form.',
  uploadedDocumentsSubTitle: 'These may include:',
  uploadDocumentsBullets: [
    'copies of any relevant correspondence or documentation',
    'audio or video recordings',
    'written statements',
    'related reports',
  ],
  caseRelevancySubTitle: 'For each piece of additional information or evidence you are submitting, please state why it is relevant to your case.',
  fileUploadRequirementsLabel: 'File upload requirements',
  uploadHelpBullets: [
    'File formats: MS Word, MS Excel, PDF, JPG, PNG, TXT, RTF, MP4, MP3',
    'File size per document: up to 20 megabytes (MB)',
    'File size per multimedia file: up to 30 megabytes (MB)',
    'Files cannot be password protected',
  ],
  guideText:
    'You can\'t upload executable (.exe), zip or other archive files due to virus risks.',
  titleForFile: 'Select documents to upload',
  uploadButton: 'Upload file',
  documentListLabel:
    'Please explain why you feel this document is relevant to your case.',
  delete: 'Delete',
  documentInLanguage: 'Document',
  fileuploaded: 'Files uploaded',
  errorSummaryMessage: 'There is a problem',
  uploadAFile: 'Upload a file',
  uploadFileHint: 'Once you have selected the file click "Upload file" to upload it.',
  errors: {
    documentUpload: {
      noInput: 'You cannot continue without providing additional information or a document',
      fileSize: `File size exceeds the maximum permitted value. Please upload a file that is less than 20MB (documents) or less than 30MB (multimedia files)`,
      fileFormat: `This service only accepts files in the formats - Ms Word, MS Excel, PDF, JPG, PNG, TXT, RTF, MP4, MP3`,
      selectFileToUpload: 'Select a file to upload',
      uploadDeleteError: 'Document upload or deletion has failed. Please try again',
      maxFileError: 'You can only select up to 20 files at the same time',
    },
    documentDetail: {
      notAlphaNumeric: 'You have entered an invalid character. Please enter letters and numbers only.',
    },
    eventName: {
      notAlphaNumeric: 'You have entered an invalid character. Please enter letters and numbers only.',
    },
  },
});

export const cy = () => ({
  serviceName: 'Update an appeal to the First-tier Tribunal - welsh',
  title: 'Add information to a case - welsh',
  paragraph1:
    'Please provide any additional relevant information that you would like to add to this case. Don\'t include any personal financial information, such as your banking details. - welsh',
  additionalDocumentsHeading: 'Additional documents - welsh',
  paragraph2: 'You may want to submit other documents, files, or evidence that provides the Tribunal with more information about your case. - welsh',
  paragraph3: 'This will depend on the nature of your appeal, application or claim. Specific examples can be found in your completed tribunal form. - welsh',
  uploadedDocumentsSubTitle: 'These may include: - welsh',
  uploadDocumentsBullets: [
    'copies of any relevant correspondence or documentation - welsh',
    'audio or video recordings - welsh',
    'written statements - welsh',
    'related reports - welsh',
  ],
  caseRelevancySubTitle: 'For each piece of additional information or evidence you are submitting, please state why it is relevant to your case. - welsh',
  fileUploadRequirementsLabel: 'File upload requirements - welsh',
  uploadHelpBullets: [
    'File formats: MS Word, MS Excel, PDF, JPG, PNG, TXT, RTF, MP4, MP3 - welsh',
    'File size per document: up to 20 megabytes (MB) - welsh',
    'File size per multimedia file: up to 30 megabytes (MB) - welsh',
    'Files cannot be password protected - welsh',
  ],
  guideText:
    'You can\'t upload executable (.exe), zip or other archive files due to virus risks. - welsh',
  titleForFile: 'Select documents to upload - welsh',
  uploadButton: 'Upload file - welsh',
  documentListLabel:
    'Please explain why you feel this document is relevant to your case. - welsh',
  delete: 'Delete - welsh',
  documentInLanguage: 'Document - welsh',
  fileuploaded: 'Files uploaded - welsh',
  errorSummaryMessage: 'There is a problem - welsh',
  uploadAFile: 'Upload a file - welsh',
  uploadFileHint: 'Once you have selected the file click "Upload file" to upload it. - welsh',
  errors: {
    documentUpload: {
      noInput: 'You cannot continue without providing additional information or a document - welsh',
      fileSize: `File size exceeds the maximum permitted value. Please upload a file that is less than 20MB (documents) or less than 30MB (multimedia files) - welsh`,
      fileFormat: `This service only accepts files in the formats - Ms Word, MS Excel, PDF, JPG, PNG, TXT, RTF, MP4, MP3 - welsh`,
      selectFileToUpload: 'Select a file to upload - welsh',
      uploadDeleteError: 'Document upload or deletion has failed. Please try again - welsh',
      maxFileError: 'You can only select up to 20 files at the same time - welsh',
    },
    documentDetail: {
      notAlphaNumeric: 'You have entered an invalid character. Please enter letters and numbers only. - welsh',
    },
    eventName: {
      notAlphaNumeric: 'You have entered an invalid character. Please enter letters and numbers only. - welsh',
    },
  },
});

const languages = {
  en,
  cy,
};

export const form: FormContent = {
  fields: {
    documentUpload: {
      type: 'hidden',
      label: l => l.uploadFiles,
      labelHidden: true,
      value: 'true',
    },
  },
};

export const generateContent: TranslationFn = content => {
  const translations = languages[content.language]();
  return {
    ...translations,
    form,
  };
};         

export function getErrors(language: any) {
  let errors: any
  switch (language) {
    case 'cy':
      errors = cy().errors;
      break;
    case 'en':
    default:
      errors = en().errors;
  }

  return errors;
}

