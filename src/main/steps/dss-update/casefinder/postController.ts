import autobind from 'autobind-decorator';
import { Response } from 'express';

import { getCase } from '../../../app/case/api';
import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../../app/controller/PostController';
import { Form } from '../../../app/form/Form';
import { DATA_VERIFICATION } from '../../urls';
import { CaseWithId } from '../../../app/case/case';

@autobind
export default class UploadDocumentController extends PostController<AnyObject> {

  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const fields = typeof this.fields === 'function' ? this.fields(req.session.userCase) : this.fields;
    const form = new Form(fields);

    if (!req.session.userCase) {
      req.session.userCase = {} as CaseWithId;
    }

    const { ...formData } = form.getParsedBody(req.body);
    req.session.errors = form.getErrors(formData);

    let nextUrl: string;
    if (req.session.errors.length === 0) {
      try {
        const responseFromServerCall = await getCase(req, String(req.body.applicantCaseId));
        if (responseFromServerCall.status === 200) {
          req.session.userCase.id = responseFromServerCall.data.id;
          nextUrl = DATA_VERIFICATION;
        }
      } catch (error) {
        req.session.errors.push({ propertyName: 'caseNotFound', errorType: 'required' });
        nextUrl = req.originalUrl;
      }
    } else {
      nextUrl = req.originalUrl;
    }

    req.session.save(err => {
      if (err) {
        throw err;
      }
      res.redirect(nextUrl);
    });
  }
}
