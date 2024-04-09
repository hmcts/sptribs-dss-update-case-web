import autobind from 'autobind-decorator';
import { Response } from 'express';

import { AppRequest } from '../../app/controller/AppRequest';
import { GetController, TranslationFn } from '../../app/controller/GetController';
import { deleteDocument } from '../../app/fileUpload/documentManager';
import { getServiceAuthToken } from '../../app/s2s/get-service-auth-token';
import { UPLOAD_DOCUMENT } from '../../steps/urls';

import { getErrors } from './content';
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any;

@autobind
export default class DocumentUpload extends GetController {
  constructor(
    protected readonly view: string,
    protected readonly content: TranslationFn
  ) {
    super(view, content);
  }

  public async get(req: AppRequest, res: Response): Promise<void> {
    if (!req.session.hasOwnProperty('caseDocuments')) {
      req.session['caseDocuments'] = [];
    }
    if (req.query.hasOwnProperty('removeId')) {
      await this.removeExistingConsentDocument(req.query.removeId as string, req, res);
    } else {
      await super.get(req, res, {
        uploadedDocuments: req.session['caseDocuments'],
        documentDetail: req.session?.['documentDetail'],
      });
    }
  }

  public removeExistingConsentDocument = async (documentId: string, req: AppRequest, res: Response): Promise<void> => {
    try {
      const s2sToken = await getServiceAuthToken();
      await deleteDocument(s2sToken, documentId, req);
      req.session['caseDocuments'] = req.session['caseDocuments'].filter(
        document => document.documentId !== documentId
      );
      req.session.save(error => {
        if (error) {
          throw error;
        }
        res.redirect(`${UPLOAD_DOCUMENT}`);
      });
    } catch (err) {
      const documentUploadErrors = getErrors(req.session['lang']);
      req.session.fileErrors = [{ text: documentUploadErrors.documentUpload.uploadDeleteError, href: '#' }];

      req.session.save(error => {
        if (error) {
          throw error;
        }
        res.redirect(UPLOAD_DOCUMENT);
      });
    }
  };
}
