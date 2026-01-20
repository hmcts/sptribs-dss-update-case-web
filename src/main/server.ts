import * as path from 'path';

import * as bodyParser from 'body-parser';
import config from 'config';
import cookies from 'cookie-parser';
import cors from 'cors';
import express, { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import favicon from 'serve-favicon';
import toobusy from 'toobusy-js';
import type { LoggerInstance } from 'winston';

import { AppInsights } from './modules/appinsights';
import { ErrorHandler } from './modules/error-handler';
import { FileUpload } from './modules/fileupload';
import { HealthCheck } from './modules/health';
import { Helmet } from './modules/helmet';
import { LanguageToggle } from './modules/i18n';
import { Nunjucks } from './modules/nunjucks';
import { OidcMiddleware } from './modules/oidc';
import { PropertiesVolume } from './modules/properties-volume';
import { SessionStorage } from './modules/session';
import { Webpack } from './modules/webpack';
import { Routes } from './routes';
import { PublicRoutes } from './routes/authless/routes';

const { Logger } = require('@hmcts/nodejs-logging');

const { setupDev } = require('./development');

const env = process.env.NODE_ENV || 'development';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const developmentMode = env === 'development';
const logger: LoggerInstance = Logger.getLogger('server');
export const app = express();

app.locals.ENV = env;
app.locals.developmentMode = process.env.NODE_ENV !== 'production';

const corsOptions = {
  origin: ['https://js-cdn.dynatrace.com'],
  methods: 'GET',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(bodyParser.json() as RequestHandler);
app.use(bodyParser.urlencoded({ extended: false }) as RequestHandler);
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});
app.disable('x-powered-by');
app.disable('X-Powered-By');
app.use(cookies());

const rateLimiterDisabled = process.env.RATE_LIMITER_DISABLED;
if (!rateLimiterDisabled) {
  const limiter = rateLimit({
    windowMs: 15000,
    limit: 30,
  });
  app.use(limiter);
}

new PropertiesVolume().enableFor(app);
new SessionStorage().enableFor(app);
new AppInsights().enable();
new HealthCheck().enableFor(app);
new ErrorHandler().enableFor(app, logger);
new Nunjucks().enableFor(app);
new Webpack().enableFor(app);
new FileUpload().enableFor(app);
new Helmet(config.get('security')).enableFor(app);
new LanguageToggle().enableFor(app);
new PublicRoutes().enableFor(app);
new OidcMiddleware().enableFor(app);
new Routes().enableFor(app);
new ErrorHandler().handleNextErrorsFor(app);

setupDev(app, developmentMode);

const port = config.get('port');
const server = app.listen(port, () => {
  logger.info(`Application started: http://localhost:${port}`);
});

process.on('SIGINT', function () {
  server.close();
  toobusy.shutdown();
  process.exit();
});
