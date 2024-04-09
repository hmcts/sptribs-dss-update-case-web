import { TranslationFn } from '../../app/controller/GetController';
import { FormContent } from '../../app/form/Form';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const en = () => ({
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Add information to a case',
  paragraph1:
    "Please provide any additional relevant information that you would like to add to this case. Don't include any personal financial information, such as your banking details.",
  additionalDocumentsHeading: 'Additional documents',
  paragraph2:
    'You may want to submit other documents, files, or evidence that provides the Tribunal with more information about your case.',
  paragraph3:
    'This will depend on the nature of your appeal, application or claim. Specific examples can be found in your completed tribunal form.',
  uploadedDocumentsSubTitle: 'These may include:',
  uploadDocumentsBullets: [
    'copies of any relevant correspondence or documentation',
    'audio or video recordings',
    'written statements',
    'related reports',
  ],
  caseRelevancySubTitle:
    'For each piece of additional information or evidence you are submitting, please state why it is relevant to your case.',
  fileUploadRequirementsLabel: 'File uploads requirements',
  uploadHelpBullets: [
    'File formats: MS Word, MS Excel, PDF, JPG, PNG, TXT, RTF, MP4, MP3',
    'File size per document: up to 500 megabytes (MB)',
    'File size per multimedia file: up to 500 megabytes (MB)',
    'Files cannot be password protected',
  ],
  guideText: "You can't upload executable (.exe), zip or other archive files due to virus risks.",
  titleForFile: 'Select documents to upload',
  uploadButton: 'Upload file',
  documentListLabel: 'Please explain why you feel this document is relevant to your case.',
  delete: 'Delete',
  documentInLanguage: 'Document',
  errorSummaryMessage: 'There is a problem',
  uploadAFile: 'Upload a file',
  uploadFileHint: 'Once you have selected the file click "Upload file" to upload it.',
  errors: {
    documentUpload: {
      noInput: 'You cannot continue without providing additional information or a document',
      fileSize: 'File size exceeds the maximum permitted value. Please upload a file that is less than 500MB',
      fileFormat:
        'This service only accepts files in the formats - MS Word, MS Excel, PDF, JPG, PNG, TXT, RTF, MP4, MP3',
      selectFileToUpload: 'Select a file to upload',
      uploadDeleteError: 'Document upload or deletion has failed. Please try again',
      maxFileError: 'You can only select up to 20 files at the same time',
    },
  },
});

export const cy = () => ({
  serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
  title: 'Ychwanegu gwybodaeth at achos',
  paragraph1:
    'Darparwch unrhyw wybodaeth berthnasol ychwanegol yr hoffech ei hychwanegu at yr achos hwn. Peidiwch â chynnwys unrhyw wybodaeth ariannol bersonol, megis eich manylion banc.',
  additionalDocumentsHeading: 'Dogfennau ychwanegol',
  paragraph2:
    'Efallai y byddwch eisiau cyflwyno dogfennau, ffeiliau neu dystiolaeth arall sy’n rhoi mwy o wybodaeth i’r Tribiwnlys am eich achos.',
  paragraph3:
    'Bydd hyn yn dibynnu ar natur eich apêl, cais neu hawliad. Gellir dod o hyd i enghreifftiau penodol yn y ffurflen tribiwnlys rydych wedi’i llenwi.',
  uploadedDocumentsSubTitle: "Gallai'r rhain gynnwys:",
  uploadDocumentsBullets: [
    'copïau o unrhyw ohebiaeth neu ddogfennaeth berthnasol',
    'recordiadau sain neu fideo',
    'datganiadau ysgrifenedig',
    'adroddiadau cysylltiedig',
  ],
  caseRelevancySubTitle:
    'Ar gyfer pob darn o wybodaeth neu dystiolaeth ychwanegol rydych yn ei chyflwyno, nodwch pam ei bod yn berthnasol i’ch achos.',
  fileUploadRequirementsLabel: 'Gofynion llwytho ffeil',
  uploadHelpBullets: [
    'Fformatau ffeiliau: MS Word, MS Excel, PDF, JPG, PNG, TXT, RFT, MP4, MP3',
    'Maint ffeil pob dogfen: hyd at 20 megabeit (MB)',
    'Maint pob ffeil amlgyfrwng: 30 megabeit (MB)',
    'Ni ellir llwytho ffeiliau sydd wedi’u diogelu â chyfrinair',
  ],
  guideText:
    'Ni allwch lwytho ffeiliau gweithredu (.exe), ffeiliau zip neu ffeiliau archif eraill oherwydd y risg o firws.',
  titleForFile: "Dewiswch ddogfennau i'w huwchlwytho",
  uploadButton: 'Llwytho ffeil',
  documentListLabel: 'Eglurwch pam eich bod yn teimlo bod y ddogfen hon yn berthnasol i’ch achos.',
  delete: 'Dileu',
  documentInLanguage: 'Dogfen',
  errorSummaryMessage: 'Mae yna broblem',
  uploadAFile: 'Llwythwch ffeil i fyny',
  uploadFileHint: 'Unwaith y byddwch wedi dewis y ffeil, cliciwch ar ”Upload file” i’w llwytho.',
  errors: {
    documentUpload: {
      noInput: 'You cannot continue without providing additional information or a document - welsh',
      fileSize: 'File size exceeds the maximum permitted value. Please upload a file that is less than 500MB - welsh',
      fileFormat:
        'This service only accepts files in the formats - MS Word, MS Excel, PDF, JPG, PNG, TXT, RTF, MP4, MP3 - welsh',
      selectFileToUpload: 'Select a file to upload - welsh',
      uploadDeleteError: 'Document upload or deletion has failed. Please try again - welsh',
      maxFileError: 'You can only select up to 20 files at the same time - welsh',
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
  let errors: any;
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
