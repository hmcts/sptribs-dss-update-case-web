import autobind from 'autobind-decorator';
import { Response } from 'express';

import { getCase } from '../../../app/case/api';
import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../../app/controller/PostController';
import { Form, FormFields } from '../../../app/form/Form';
import { DATA_VERIFICATION } from '../../urls';

@autobind
export default class UploadDocumentController extends PostController<AnyObject> {
  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const form = new Form(<FormFields>this.fields);
    const { ...formData } = form.getParsedBody(req.body);
    req.session.errors = form.getErrors(formData);

    let nextUrl: string;
    if (req.session.errors.length === 0) {
      try {
        const responseFromServerCall = await getCase(req);
        if (responseFromServerCall.status === 200) {
          req.session.caseRefId = responseFromServerCall.data.id;
          nextUrl = DATA_VERIFICATION;
        }
      } catch (error) {
        req.session.errors.push({ propertyName: 'applicantCaseId', errorType: 'notNumeric' });
        req.session.caseRefId = <string>req.body['applicantCaseId'];
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
