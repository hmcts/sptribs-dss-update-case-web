import { Application } from 'express';

import { CALLBACK_URL, SIGN_IN_URL, SIGN_OUT_URL } from '../../steps/urls';

import { OidcMiddleware } from './index';

describe('OidcMiddleware', () => {
  it('configures oidc middleware', () => {
    const appMock = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
      use: jest.fn(),
      locals: {
        errorHandler: jest.fn(),
      },
    } as unknown as Application;

    new OidcMiddleware().enableFor(appMock);

    expect(appMock.locals.errorHandler).toHaveBeenCalled();

    expect(appMock.get).toHaveBeenCalledWith(SIGN_IN_URL, expect.any(Function));
    expect(appMock.get).toHaveBeenCalledWith(SIGN_OUT_URL, expect.any(Function));
    expect(appMock.get).toHaveBeenCalledWith(CALLBACK_URL, undefined);
    expect(appMock.use).toHaveBeenCalled();
  });
});
