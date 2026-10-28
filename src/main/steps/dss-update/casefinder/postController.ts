import autobind from 'autobind-decorator';
import { Response } from 'express';

import { checkCaseAccess } from '../../../app/case/api';
import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../../app/controller/PostController';
import { Form } from '../../../app/form/Form';
import { DATA_VERIFICATION } from '../../urls';

@autobind
export default class CaseFinderController extends PostController<AnyObject> {
  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const fields = typeof this.fields === 'function' ? this.fields(req.session.userCase) : this.fields;
    const form = new Form(fields);

    const { ...formData } = form.getParsedBody(req.body);
    req.session.errors = form.getErrors(formData);

    let nextUrl = req.originalUrl;
    req.session.verifiedCaseId = undefined;
    req.session.verifiedUserId = undefined;
    req.session.isDataVerified = false;
    if (req.session.errors.length === 0) {
      try {
        const caseId = String(req.body.applicantCaseId);
        if (!/^\d{16}$/.test(caseId)) {
          throw new Error('Invalid case reference');
        }
        const responseFromServerCall = await checkCaseAccess(req.session.user.accessToken, caseId);
        if (responseFromServerCall.status === 200) {
          req.session.userCase = { id: caseId } as typeof req.session.userCase;
          nextUrl = DATA_VERIFICATION;
        }
      } catch (error) {
        req.session.errors.push({ propertyName: 'applicantCaseId', errorType: 'caseNotFound' });
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
