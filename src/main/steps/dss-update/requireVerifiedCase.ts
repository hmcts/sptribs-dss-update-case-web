import { NextFunction, Request, Response } from 'express';

import { AppRequest } from '../../app/controller/AppRequest';
import { CASE_SEARCH_URL, DATA_VERIFICATION } from '../urls';

export const requireSelectedCase = (request: Request, res: Response, next: NextFunction): void => {
  const req = request as AppRequest;
  if (/^\d{16}$/.test(req.session.userCase?.id || '')) {
    next();
  } else {
    res.redirect(CASE_SEARCH_URL);
  }
};

export const requireVerifiedCase = (request: Request, res: Response, next: NextFunction): void => {
  const req = request as AppRequest;
  if (
    req.session.isDataVerified &&
    req.session.userCase?.id &&
    req.session.verifiedCaseId === req.session.userCase.id &&
    req.session.verifiedUserId === req.session.user?.id
  ) {
    next();
  } else {
    res.redirect(DATA_VERIFICATION);
  }
};
