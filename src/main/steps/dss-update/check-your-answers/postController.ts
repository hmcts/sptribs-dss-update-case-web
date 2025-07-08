import autobind from 'autobind-decorator';
import { Response } from 'express';

import { updateCase } from '../../../app/case/api';
import { DocumentUpload } from '../../../app/case/case';
import { AppRequest, DocumentRequest } from '../../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../../app/controller/PostController';
import { Form } from '../../../app/form/Form';
import { APPLICATION_CONFIRMATION } from '../../urls';

@autobind
export default class CheckYourAnswersController extends PostController<AnyObject> {
  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const fields = typeof this.fields === 'function' ? this.fields(req.session.userCase) : this.fields;
    const form = new Form(fields);

    const { ...formData } = form.getParsedBody(req.body);
    req.session.errors = form.getErrors(formData);

    let nextUrl = req.originalUrl;
    if (req.session.errors.length === 0) {
      try {
        const responseFromServerCall = await this.serverCallForCaseSubmission(req);

        if (responseFromServerCall.status === 201) {
          nextUrl = APPLICATION_CONFIRMATION;
        } else {
          req.session.errors?.push({
            propertyName: 'submissionError',
            errorType: 'required',
          });
        }
      } catch (error) {
        req.locals.logger.error('Error during server call:', error.response?.data || error.message);
        req.session.errors?.push({
          propertyName: 'submissionError',
          errorType: 'required',
        });
      }
    }

    req.session.save(err => {
      if (err) {
        throw err;
      }
      res.redirect(nextUrl);
    });
  }

  public async serverCallForCaseSubmission(req: AppRequest<AnyObject>) {
    const caseDocuments = req.session['caseDocuments'];
    const allUploadedDocuments: DocumentRequest = caseDocuments.map((document: DocumentUpload) => {
      return {
        id: document.documentId,
        value: {
          documentLink: {
            document_url: document.url,
            document_binary_url: document.binaryUrl,
            document_filename: document.fileName,
          },
          comment: document.description ? document.description : null,
        },
      };
    });

    const data = {
      dssCaseDataCaseTypeOfApplication: 'CIC',
      dssCaseDataAdditionalInformation: req.session['documentDetail'] ? req.session['documentDetail'] : null,
      dssCaseDataOtherInfoDocuments: allUploadedDocuments,
    };

    const caseId = req.session.userCase.id;
    return updateCase(req.session.user.accessToken, caseId, data);
  }
}
