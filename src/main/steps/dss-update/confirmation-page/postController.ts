import autobind from 'autobind-decorator';
import { Response } from 'express';

import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../../app/controller/PostController';
import { HOME_URL } from '../../urls';

@autobind
export default class ConfirmationPagePostController extends PostController<AnyObject> {
  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    req.session.destroy(err => {
      if (err) {
        throw err;
      }
      res.redirect(HOME_URL);
    });
  }
}
