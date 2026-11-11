import { Logger } from '@hmcts/nodejs-logging';
import config from 'config';
import RedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import session from 'express-session';
import * as redis from 'redis';
import FileStoreFactory from 'session-file-store';
import { LoggerInstance } from 'winston';

const FileStore = FileStoreFactory(session);
const logger: LoggerInstance = Logger.getLogger('session');

export const cookieMaxAge = 21 * (60 * 1000); // 21 minutes

export class SessionStorage {
  public enableFor(app: Application): void {
    app.use(cookieParser());
    app.set('trust proxy', 1);

    app.use(
      session({
        name: 'sptribs-dss-update-case-web-session',
        resave: false,
        saveUninitialized: false,
        secret: config.get('session.secret'),
        cookie: {
          httpOnly: true,
          maxAge: config.get('session.maxAge'),
          sameSite: 'lax', // required for the oauth2 redirect
          secure: !app.locals.developmentMode,
        },
        rolling: true, // Renew the cookie for another 20 minutes on each request
        store: this.getStore(app),
      })
    );
  }

  private getStore(app: Application) {
    const redisHost = config.get('session.redis.host') as string;
    if (redisHost) {
      const redisService = redisHost.endsWith('.redis.azure.net') ? 'Azure Managed Redis' : 'Redis';
      logger.info(`Using ${redisService} for session storage`);

      const client = redis.createClient({
        socket: {
          host: redisHost,
          port: Number(config.get('session.redis.port')),
          connectTimeout: 15000,
          tls: true,
        },
        password: config.get('session.redis.key') as string,
      });

      client.on('error', err => logger.error(`Redis Client Error: ${err}`));
      client.on('ready', () => logger.info(`Redis Client connected to ${redisService}`));
      client.connect().catch(err => logger.error('Redis connection failed', err));

      app.locals.redisClient = client;
      return new RedisStore({ client });
    }

    return new FileStore({ path: '/tmp' });
  }
}
