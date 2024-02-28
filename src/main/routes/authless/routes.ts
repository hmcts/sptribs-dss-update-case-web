import { Application } from 'express';

import { LandingGetController } from './landing/get';

export class PublicRoutes {
  public enableFor(app: Application): void {
    const { errorHandler } = app.locals;

    app.get('/', errorHandler(new LandingGetController().get));
  }
}
