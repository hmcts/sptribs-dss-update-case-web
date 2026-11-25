import autobind from 'autobind-decorator';
import { Response } from 'express';
import { pick } from 'lodash';

import { AppRequest } from '../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../app/controller/PostController';
import { Form, FormFields, FormFieldsFn } from '../../app/form/Form';
import { PageLink } from '../urls';

@autobind
export abstract class VerificationPostController extends PostController<AnyObject> {
  protected abstract readonly defaultUrl: PageLink;

  constructor(protected readonly fields: FormFields | FormFieldsFn) {
    super(fields);
  }

  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const fields = typeof this.fields === 'function' ? this.fields(req.session.userCase) : this.fields;
    const form = new Form(fields);

    const formData = pick(form.getParsedBody(req.body), [...form.getFieldNames()]);
    req.session.errors = form.getErrors(formData);

    this.resetVerification(req);

    req.session.userCase = {
      ...(req.session.userCase || {}),
      ...formData,
    };

    let nextUrl: PageLink = this.defaultUrl;
    if (req.session.errors.length === 0) {
      nextUrl = await this.handleVerification(req, formData);
    }

    if (req.session?.save) {
      await new Promise<void>((resolve, reject) => {
        req.session.save(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    }

    res.redirect(nextUrl);
  }

  protected resetVerification(req: AppRequest<AnyObject>): void {
    req.session.verifiedCaseId = undefined;
    req.session.verifiedUserId = undefined;
    req.session.isDataVerified = false;
  }

  protected abstract handleVerification(
    req: AppRequest<AnyObject>,
    formData: Record<string, unknown>
  ): Promise<PageLink>;
}
