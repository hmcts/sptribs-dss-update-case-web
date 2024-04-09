import { Application } from 'express';

import { Routes } from './routes';
import {
  ACCESSIBILITY_STATEMENT,
  APPLICATION_CONFIRMATION,
  CASE_SEARCH_URL,
  CHECK_YOUR_ANSWERS,
  COOKIES_PAGE,
  DATA_VERIFICATION,
  PRIVACY_POLICY,
  TERMS_AND_CONDITIONS,
  TIMED_OUT_URL,
  UPLOAD_DOCUMENT,
} from './steps/urls';

describe('Routes', () => {
  it('sets up dynamic step sequence routes', () => {
    const appMock = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
      use: jest.fn(),
      locals: {
        errorHandler: jest.fn(),
      },
    } as unknown as Application;

    new Routes().enableFor(appMock);

    expect(appMock.locals.errorHandler).toHaveBeenCalled();

    expect(appMock.get).toHaveBeenCalledWith(COOKIES_PAGE, undefined);
    expect(appMock.get).toHaveBeenCalledWith(PRIVACY_POLICY, undefined);
    expect(appMock.get).toHaveBeenCalledWith(TERMS_AND_CONDITIONS, undefined);
    expect(appMock.get).toHaveBeenCalledWith(ACCESSIBILITY_STATEMENT, undefined);
    expect(appMock.get).toHaveBeenCalledWith(TIMED_OUT_URL, undefined);

    expect(appMock.get).toHaveBeenCalledWith(CASE_SEARCH_URL, undefined);
    expect(appMock.get).toHaveBeenCalledWith(DATA_VERIFICATION, undefined);
    expect(appMock.get).toHaveBeenCalledWith(UPLOAD_DOCUMENT, undefined);
    expect(appMock.get).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS, undefined);
    expect(appMock.get).toHaveBeenCalledWith(APPLICATION_CONFIRMATION, undefined);

    expect(appMock.post).toHaveBeenCalledWith(CASE_SEARCH_URL, undefined);
    expect(appMock.post).toHaveBeenCalledWith(DATA_VERIFICATION, undefined);
    expect(appMock.post).toHaveBeenCalledWith(UPLOAD_DOCUMENT, undefined);
    expect(appMock.post).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS, undefined);
    expect(appMock.post).toHaveBeenCalledWith(APPLICATION_CONFIRMATION, undefined);

    expect(appMock.use).toHaveBeenCalled();
  });
});
