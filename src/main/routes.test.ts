import { Application } from 'express';

import { Routes, restrictContentType } from './routes';
import {
  ACCESSIBILITY_STATEMENT,
  APPLICATION_CONFIRMATION,
  CASE_SEARCH_URL,
  CHECK_YOUR_ANSWERS,
  CONTACT_US,
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

    expect(appMock.get).toHaveBeenCalledWith(PRIVACY_POLICY, undefined);
    expect(appMock.get).toHaveBeenCalledWith(TERMS_AND_CONDITIONS, undefined);
    expect(appMock.get).toHaveBeenCalledWith(ACCESSIBILITY_STATEMENT, undefined);
    expect(appMock.get).toHaveBeenCalledWith(TIMED_OUT_URL, undefined);
    expect(appMock.get).toHaveBeenCalledWith(CONTACT_US, undefined);

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

describe('restrictContentType', () => {
  it('should return a function that checks content type and sends 403 if it matches', () => {
    const req = {
      headers: {
        'content-type': 'application/json',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const next = jest.fn();

    const middleware = restrictContentType(['application/json']);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if content type does not match', () => {
    const req = {
      headers: {
        'content-type': 'text/html',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const next = jest.fn();
    const middleware = restrictContentType(['application/json']);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
