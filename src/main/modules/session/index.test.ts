jest.mock('config');

const mockClient = {
  connect: jest.fn(),
  on: jest.fn(),
};
const mockFileStore = jest.fn().mockImplementation(() => ({}));

jest.mock('redis', () => ({ createClient: jest.fn(() => mockClient) }));
jest.mock('connect-redis', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({})),
}));
jest.mock('express-session', () => ({ __esModule: true, default: jest.fn(() => jest.fn()) }));
jest.mock('session-file-store', () => ({
  __esModule: true,
  default: jest.fn(() => mockFileStore),
}));

import { Logger } from '@hmcts/nodejs-logging';
import config from 'config';
import RedisStore from 'connect-redis';
import { Application } from 'express';
import * as redis from 'redis';

import { SessionStorage } from '.';

const logger = Logger.getLogger('session');

describe('SessionStorage Redis configuration', () => {
  let app: Application;
  let values: Record<string, unknown>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.connect.mockResolvedValue(undefined);
    app = { locals: { developmentMode: false }, use: jest.fn(), set: jest.fn() } as unknown as Application;
    values = {
      'session.secret': 'MOCK_SESSION_SECRET',
      'session.maxAge': 1260000,
      'session.redis.host': 'sptribs-aat.redis.cache.windows.net',
      'session.redis.port': 6380,
      'session.redis.key': 'MOCK_REDIS_KEY',
    };
    config.get = jest.fn((key: string) => values[key]) as typeof config.get;
  });

  test('should preserve classic Redis port and session prefix', () => {
    new SessionStorage().enableFor(app);

    expect(redis.createClient).toHaveBeenCalledWith({
      socket: { host: 'sptribs-aat.redis.cache.windows.net', port: 6380, connectTimeout: 15000, tls: true },
      password: 'MOCK_REDIS_KEY',
    });
    expect(RedisStore).toHaveBeenCalledWith({ client: mockClient });
  });

  test('should use the Managed Redis TLS port without changing the session namespace', () => {
    values['session.redis.host'] = 'sptribs-frontend-aat.uksouth.redis.azure.net';
    values['session.redis.port'] = '10000';

    new SessionStorage().enableFor(app);

    expect(redis.createClient).toHaveBeenCalledWith({
      socket: { host: 'sptribs-frontend-aat.uksouth.redis.azure.net', port: 10000, connectTimeout: 15000, tls: true },
      password: 'MOCK_REDIS_KEY',
    });
    expect(RedisStore).toHaveBeenCalledWith({ client: mockClient });
    expect(app.locals.redisClient).toBe(mockClient);
    expect(logger.info).toHaveBeenCalledWith('Using Azure Managed Redis for session storage');

    const readyHandler = mockClient.on.mock.calls.find(call => call[0] === 'ready')[1];
    readyHandler();

    expect(logger.info).toHaveBeenCalledWith('Redis Client connected to Azure Managed Redis');
  });

  test('should report connection rejection', async () => {
    const error = new Error('Connection failed');
    mockClient.connect.mockRejectedValue(error);

    new SessionStorage().enableFor(app);
    await Promise.resolve();

    expect(logger.error).toHaveBeenCalledWith('Redis connection failed', error);
  });

  test('should retain file storage when no Redis host is configured', () => {
    values['session.redis.host'] = '';

    new SessionStorage().enableFor(app);

    expect(redis.createClient).not.toHaveBeenCalled();
    expect(mockFileStore).toHaveBeenCalledWith({ path: '/tmp' });
  });
});
