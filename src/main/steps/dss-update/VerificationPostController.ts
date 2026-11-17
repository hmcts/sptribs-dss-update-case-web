import autobind from 'autobind-decorator';
import { Response } from 'express';

import { AppRequest } from '../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../app/controller/PostController';
import { Form, FormFields, FormFieldsFn } from '../../app/form/Form';

@autobind
export abstract class VerificationPostController extends PostController<AnyObject> {
  constructor(protected readonly fields: FormFields | FormFieldsFn) {
    super(fields);
  }

  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const fields = typeof this.fields === 'function' ? this.fields(req.session.userCase) : this.fields;
    const form = new Form(fields);

    const { ...formData } = form.getParsedBody(req.body);
    req.session.errors = form.getErrors(formData);

    this.resetVerification(req);

    let nextUrl = req.originalUrl;
    if (req.session.errors.length === 0) {
      nextUrl = await this.handleVerification(req, formData, nextUrl);
    }

    req.session.save(err => {
      if (err) {
        throw err;
      }
      res.redirect(nextUrl);
    });
  }

  protected resetVerification(req: AppRequest<AnyObject>): void {
    req.session.verifiedCaseId = undefined;
    req.session.verifiedUserId = undefined;
    req.session.isDataVerified = false;
  }

  protected abstract handleVerification(
    req: AppRequest<AnyObject>,
    formData: Record<string, unknown>,
    fallbackUrl: string
  ): Promise<string>;
}
