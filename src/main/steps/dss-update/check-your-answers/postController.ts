/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */

import autobind from 'autobind-decorator';
import axios from 'axios';
import config from 'config';
import { Response } from 'express';

import { AppRequest, DocumentRequest } from '../../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../../app/controller/PostController';
import { Form } from '../../../app/form/Form';
import { RpeApi } from '../../../app/s2s/rpeAuth';
import { APPLICATION_CONFIRMATION } from '../../urls';
import { DocumentUpload } from '../../../app/case/case';
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
        if (responseFromServerCall.status === 200) {
          nextUrl = APPLICATION_CONFIRMATION;
        } else {
          req.session.errors?.push({
            propertyName: 'submissionError',
            errorType: 'required',
          });
        }
      } catch (error) {
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
      CaseTypeOfApplication: 'CIC',
      AdditionalInformation: req.session['documentDetail'] ? req.session['documentDetail'] : null,
      OtherInfoDocuments: allUploadedDocuments,
    };

    const caseId = req.session.userCase.id;
    const baseURL = `${config.get('services.sptribs.url')}/case/dss-orchestration/${caseId}/update?event=UPDATE_CASE`;
    const serviceAuthToken = await RpeApi.getRpeToken();
    const s2sToken = serviceAuthToken.data;
    return await axios.put(baseURL, data, {
      headers: {
        Authorization: `Bearer ${req.session.user.accessToken}`,
        ServiceAuthorization: `Bearer ${s2sToken}`,
        Accept: '*/*',
        'Content-Type': 'application/json'
      },
    });
  }
}
