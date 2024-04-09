import config from 'config';
import { Application, NextFunction, Response } from 'express';

import { getRedirectUrl, getUserDetails } from '../../app/auth/oidc';
import { CaseWithId } from '../../app/case/case';
import { AppRequest } from '../../app/controller/AppRequest';
import { signInNotRequired } from '../../steps/url-utils';
import { CALLBACK_URL, CASE_SEARCH_URL, HOME_URL, SIGN_IN_URL, SIGN_OUT_URL } from '../../steps/urls';

export class OidcMiddleware {
  public enableFor(app: Application): void {
    const protocol = app.locals.developmentMode ? 'http://' : 'https://';
    const port = app.locals.developmentMode ? `:${config.get('port')}` : '';
    const { errorHandler } = app.locals;

    app.get(SIGN_IN_URL, (req, res) =>
      res.redirect(getRedirectUrl(`${protocol}${res.locals.host}${port}`, CALLBACK_URL))
    );

    app.get(SIGN_OUT_URL, (req, res) => req.session.destroy(() => res.redirect(HOME_URL)));

    app.get(
      CALLBACK_URL,
      errorHandler(async (req, res) => {
        if (typeof req.query.code === 'string') {
          req.session.user = await getUserDetails(`${protocol}${res.locals.host}${port}`, req.query.code, CALLBACK_URL);
          req.session.userCase = {} as CaseWithId;
          req.session.save(() => res.redirect(CASE_SEARCH_URL));
        } else {
          res.redirect(SIGN_IN_URL);
        }
      })
    );

    app.use(
      errorHandler(async (req: AppRequest, res: Response, next: NextFunction) => {
        if (req.session?.user.roles.includes('citizen')) {
          res.locals.isLoggedIn = true;
          return next();
        } else if (signInNotRequired(req.path)) {
          return next();
        } else {
          res.redirect(SIGN_IN_URL);
        }
      })
    );
  }
}
