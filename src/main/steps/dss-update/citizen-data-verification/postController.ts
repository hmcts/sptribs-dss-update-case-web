/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
import autobind from 'autobind-decorator';
import { Response } from 'express';

import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../../app/controller/PostController';
import { Form, FormFields } from '../../../app/form/Form';
import { UPLOAD_DOCUMENT } from '../../urls';
import { getCase } from '../../../app/case/api';

/* The UploadDocumentController class extends the PostController class and overrides the
PostDocumentUploader method */
@autobind
export default class CitizenDataVerificationPostController extends PostController<AnyObject> {

  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {

    const form = new Form(<FormFields>this.fields);
    const { ...formData } = form.getParsedBody(req.body);
    req.session.errors = form.getErrors(formData);

    let nextUrl: string;
    console.log(req.body.applicantCaseId);

    if (req.session.errors.length === 0) {
      try {
        const responseFromServerCall = await getCase(req);
        if (responseFromServerCall.status === 200) {

          const cicCaseFullName = responseFromServerCall.data.data.cicCaseFullName.trim();
          const cicCaseDateOfBirth = responseFromServerCall.data.data.cicCaseDateOfBirth;

          const subjectFullNameToVerify = String(req.body.subjectFullName).trim();
          const dateToVerify =
            `${String(req.body['subjectDOB-year'])}-${String(req.body['subjectDOB-month']).padStart(2, '0')}-${String(req.body['subjectDOB-day']).padStart(2, '0')}`;

          if (cicCaseFullName === subjectFullNameToVerify && cicCaseDateOfBirth === dateToVerify) {
            nextUrl = UPLOAD_DOCUMENT;
          } else {
            nextUrl = req.originalUrl;
            //TODO: Add error below related to incorrect data having been entered
            req.session.errors.push({ propertyName: 'subjectFullName', errorType: 'required' });
          }
        }
      } catch (error) {
        //TODO: Add error below related to error fetching case
        req.session.errors.push({ propertyName: 'caseNotFound', errorType: 'required' });

        req.session.subjectFullName = <string>req.body['subjectFullName'];
        req.session.subjectDOB = <string>req.body['subjectDOB'];

        nextUrl = req.originalUrl;
      }
    } else {
      req.session.subjectFullName = <string>req.body['subjectFullName'];
      req.session.subjectDOB = <string>req.body['subjectDOB'];
      nextUrl = req.originalUrl;
    }

    req.session.save(err => {
      if (err) {
        console.log(err);
        throw err;
      }
      res.redirect(nextUrl);
    });
  }
}
