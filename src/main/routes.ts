import fs from 'fs';

import { Application, NextFunction, Request, RequestHandler, Response } from 'express';
import rateLimit from 'express-rate-limit';

import { AppRequest } from './app/controller/AppRequest';
import { GetController } from './app/controller/GetController';
import { PostController } from './app/controller/PostController';
import { KeepAliveController } from './app/keepalive/KeepAliveController';
import { stepsWithContent } from './steps';
import { AccessibilityStatementGetController } from './steps/accessibility-statement/get';
import { ContactUsGetController } from './steps/contact-us/get';
import { requireSelectedCase, requireVerifiedCase } from './steps/dss-update/requireVerifiedCase';
import { ErrorController } from './steps/error/error.controller';
import { PrivacyPolicyGetController } from './steps/privacy-policy/get';
import { TermsAndConditionsGetController } from './steps/terms-and-conditions/get';
import { TimedOutGetController } from './steps/timed-out/get';
import {
  ACCESSIBILITY_STATEMENT,
  CHECK_YOUR_ANSWERS,
  CONTACT_US,
  DATA_VERIFICATION,
  KEEP_ALIVE_URL,
  PRIVACY_POLICY,
  TERMS_AND_CONDITIONS,
  TIMED_OUT_URL,
  UPLOAD_DOCUMENT,
} from './steps/urls';

export const restrictContentType = (contentType: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const headerValue = req.headers['content-type'];
    if (headerValue && contentType.includes(headerValue)) {
      res.status(403).send();
    } else {
      next();
    }
  };
};

export class Routes {
  public enableFor(app: Application): void {
    const { errorHandler } = app.locals;
    const errorController = new ErrorController();

    app.get(PRIVACY_POLICY, errorHandler(new PrivacyPolicyGetController().get));
    app.get(TERMS_AND_CONDITIONS, errorHandler(new TermsAndConditionsGetController().get));
    app.get(ACCESSIBILITY_STATEMENT, errorHandler(new AccessibilityStatementGetController().get));
    app.get(TIMED_OUT_URL, errorHandler(new TimedOutGetController().get));
    app.get(CONTACT_US, errorHandler(new ContactUsGetController().get));

    app.use(UPLOAD_DOCUMENT, requireVerifiedCase);
    app.use(CHECK_YOUR_ANSWERS, requireVerifiedCase);
    app.use(DATA_VERIFICATION, requireSelectedCase);
    app.use(
      DATA_VERIFICATION,
      rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 10,
        skip: req => req.method !== 'POST',
        keyGenerator: req => {
          const request = req as AppRequest;
          return `${request.session.user.id}:${request.session.userCase?.id || 'no-case'}`;
        },
        standardHeaders: 'draft-7',
        legacyHeaders: false,
      })
    );

    for (const step of stepsWithContent) {
      const files = fs.readdirSync(`${step.stepDir}`);

      const getControllerFileName = files.find(item => /get/i.test(item) && !/test/i.test(item));
      const getController = getControllerFileName
        ? require(`${step.stepDir}/${getControllerFileName}`).default
        : GetController;

      app.get(step.url, errorHandler(new getController(step.view, step.generateContent).get));

      if (step.form) {
        const postControllerFileName = files.find(item => /post/i.test(item) && !/test/i.test(item));
        const postController = postControllerFileName
          ? require(`${step.stepDir}/${postControllerFileName}`).default
          : PostController;
        app.use(step.url, restrictContentType(['application/json']));
        app.post(step.url, errorHandler(new postController(step.form.fields).post));
      }
    }

    app.get(KEEP_ALIVE_URL, errorHandler(new KeepAliveController().get));

    app.use(errorController.notFound as unknown as RequestHandler);
  }
}
