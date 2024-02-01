import { CaseWithId } from '../app/case/case';
import { AppRequest } from '../app/controller/AppRequest';

import { PageLink } from './urls';

export enum Sections {
  dss_update = 'dss_update',
  uploadDocuments = 'upload-documents',
}

export interface Step {
  url: string;
  showInSection?: Sections;
  showInCompleteSection?: Sections;
  excludeFromContinueApplication?: boolean;
  getNextStep: (data: Partial<CaseWithId>, req?: AppRequest) => PageLink;
  getController?: any;
  postController?: any;
  sanitizeQueryString?: (fromurl: string, toUrl: string, queryString: Record<string, string>) => Record<string, string>;
}

export const ApplicantUploadFiles = 'applicantUploadFiles';
export const RespondentUploadFiles = 'respondentUploadFiles';
export const UploadDocumentSucess = 'upload-documents-success';
export const UploadDocument = 'upload-document';
