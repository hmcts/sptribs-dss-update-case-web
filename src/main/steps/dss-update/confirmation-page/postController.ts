import autobind from 'autobind-decorator';
import { AnyObject, PostController } from '../../../app/controller/PostController';
import { AppRequest } from '../../../app/controller/AppRequest';
import { Response } from 'express';
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
