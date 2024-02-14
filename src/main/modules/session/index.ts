import config from 'config';
import RedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import session from 'express-session';
import * as redis from 'redis';
import FileStoreFactory from 'session-file-store';

const FileStore = FileStoreFactory(session);

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
          secure: false,
        },
        rolling: true, // Renew the cookie for another 20 minutes on each request
        store: this.getStore(app),
      })
    );
  }

  private getStore(app: Application) {
    const redisHost = config.get('session.redis.host');
    if (redisHost) {
      const client = redis.createClient({
        socket: {
          host: redisHost as string,
          port: 6380,
          connectTimeout: 15000,
          tls: true,
        },
        password: config.get('session.redis.key') as string,
      });

      client.connect();

      app.locals.redisClient = client;
      return new RedisStore({ client });
    }

    return new FileStore({ path: '/tmp/sptribs-dss-update-case-web-session' });
  }
}
