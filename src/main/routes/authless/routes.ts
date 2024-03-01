import { Application } from 'express';

import { HOME_URL } from '../../steps/urls';

import { LandingGetController } from './landing/get';

export class PublicRoutes {
  public enableFor(app: Application): void {
    const { errorHandler } = app.locals;

    app.get(HOME_URL, errorHandler(new LandingGetController().get));
  }
}
