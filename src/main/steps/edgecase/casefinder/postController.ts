/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
import autobind from 'autobind-decorator';
//import config from 'config';
import axios from 'axios';
import { Response } from 'express';

import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../../app/controller/PostController';
import { Form, FormFields, FormFieldsFn } from '../../../app/form/Form';
import { DATA_VERIFICATION } from '../../urls';
/* The UploadDocumentController class extends the PostController class and overrides the
PostDocumentUploader method */
@autobind
export default class UploadDocumentController extends PostController<AnyObject> {
  constructor(protected readonly fields: FormFields | FormFieldsFn) {
    super(fields);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async serverCallForCaseIdValidations(req: AppRequest<AnyObject>) {
    const baseURL = `https://fis-ds-update-web-pr-68.service.core-compute-preview.internal/case/dss-orchestration/${req.body.applicantCaseId}`;
    const fetchRequest = await axios.get(baseURL);
    return fetchRequest;
  }

  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const fields = typeof this.fields === 'function' ? this.fields(req.session.userCase) : this.fields;
    const form = new Form(fields);
    const { ...formData } = form.getParsedBody(req.body);
    req.session.errors = form.getErrors(formData);
    if (req.session.errors && req.session.errors.length) {
      return super.redirect(req, res, req.originalUrl);
    }

    if (req.body['applicantCaseId'] === '') {
      req.session.errors.push({ propertyName: 'applicantCaseId', errorType: 'required' });
      req.session['caseRefId'] = '';
      super.redirect(req, res, req.originalUrl);
    } else {
      try {
        const responseFromServerCall = await this.serverCallForCaseIdValidations(req);
        if (responseFromServerCall.status === 200) {
          req.session['caseRefId'] = req.body.applicantCaseId;
          req.session['verificationData'] = responseFromServerCall.data;
          super.redirect(req, res, DATA_VERIFICATION);
        }
      } catch (error) {
        req.session.errors.push({ propertyName: 'caseNotFound', errorType: 'required' });
        req.session['caseRefId'] = req.body['applicantCaseId'];
        super.redirect(req, res, req.originalUrl);
      }
    }
  }
}
