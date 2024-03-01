import { Application } from 'express';

const healthCheck = require('@hmcts/nodejs-healthcheck');

export class HealthCheck {
  public enableFor(app: Application): void {
    const healthCheckConfig = {
      checks: {
        // TODO: replace this sample check with proper checks for your application
        sampleCheck: healthCheck.raw(() => healthCheck.up()),
      },
    };
    healthCheck.addTo(app, healthCheckConfig);
  }
}
