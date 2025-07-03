import autobind from 'autobind-decorator';
import { Response } from 'express';

import { getCase } from '../../../app/case/api';
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

    req.session.userCase.subjectFullName = formData.subjectFullName as string;
    req.session.userCase.subjectDOB = formData.subjectDOB as CaseDate;

    if (req.session.errors.length === 0) {
      try {
        const responseFromServerCall = await getCase(req.session.userCase.id);
        if (responseFromServerCall.status === 200) {
          const cicCaseFullName = responseFromServerCall.data.data.cicCaseFullName.trim();
          const cicCaseDateOfBirth = responseFromServerCall.data.data.cicCaseDateOfBirth;

          const subjectFullNameToVerify = String(req.body.subjectFullName).trim();
          const dateToVerify = `${formData.subjectDOB?.year}-${formData.subjectDOB?.month?.padStart(2, '0')}-${formData.subjectDOB?.day?.padStart(2, '0')}`;

          if (cicCaseFullName === subjectFullNameToVerify && cicCaseDateOfBirth === dateToVerify) {
            req.session.isDataVerified = true;
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
