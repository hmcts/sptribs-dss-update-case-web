import autobind from 'autobind-decorator';
import { Response } from 'express';

import { getCase } from '../../../app/case/api';
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
    if (req.session.errors.length === 0) {
      try {
        const responseFromServerCall = await getCase(String(req.body.applicantCaseId));
        if (responseFromServerCall.status === 200) {
          req.session.userCase.id = responseFromServerCall.data.id;
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
