import autobind from 'autobind-decorator';
import { Response } from 'express';

import { verifyCaseSubject } from '../../../app/case/api';
import { CaseDate } from '../../../app/case/case';
import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../../app/controller/PostController';
import { Form } from '../../../app/form/Form';
import { UPLOAD_DOCUMENT } from '../../urls';

@autobind
export default class CitizenDataVerificationPostController extends PostController<AnyObject> {
  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const fields = typeof this.fields === 'function' ? this.fields(req.session.userCase) : this.fields;
    const form = new Form(fields);

    const { ...formData } = form.getParsedBody(req.body);
    req.session.errors = form.getErrors(formData);

    let nextUrl = req.originalUrl;

    req.session.verifiedCaseId = undefined;
    req.session.verifiedUserId = undefined;
    req.session.isDataVerified = false;

    req.session.userCase.subjectFullName = formData.subjectFullName as string;
    req.session.userCase.subjectDOB = formData.subjectDOB as CaseDate;

    if (req.session.errors.length === 0) {
      try {
        const subjectFullNameToVerify = String(formData.subjectFullName).trim();
        const dateToVerify = `${formData.subjectDOB?.year}-${formData.subjectDOB?.month?.padStart(2, '0')}-${formData.subjectDOB?.day?.padStart(2, '0')}`;
        const responseFromServerCall = await verifyCaseSubject(
          req.session.user.accessToken,
          req.session.userCase.id,
          subjectFullNameToVerify,
          dateToVerify
        );
        if (responseFromServerCall.status === 200) {
          if (responseFromServerCall.data.verified === true) {
            req.session.isDataVerified = true;
            req.session.verifiedCaseId = req.session.userCase.id;
            req.session.verifiedUserId = req.session.user.id;
            nextUrl = UPLOAD_DOCUMENT;
          } else {
            req.session.errors.push({ propertyName: 'inputFields', errorType: 'required' });
          }
        }
      } catch (error) {
        req.session.errors.push({ propertyName: 'caseError', errorType: 'required' });
      }
    }

    req.session.save(err => {
      if (err) {
        throw err;
      }
      res.redirect(nextUrl);
    });
  }
}
