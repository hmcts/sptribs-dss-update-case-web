import axios, { AxiosInstance } from 'axios';
import config from 'config';
import { set } from 'lodash';

import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { CASE_NOT_FOUND_URL, CASE_SEARCH_URL, DATA_VERIFICATION, NOT_AUTHORISED } from '../../urls';

import { form } from './content';
import CaseFinderController from './postController';

jest.mock('axios');
jest.mock('jwt-decode', () => ({
  jwtDecode: () => ({
    accessToken: 'token',
    sub: 'test@test.com',
    given_name: 'John',
    family_name: 'Dorian',
    uid: '123',
    roles: ['citizen'],
  }),
}));
let req, res;

set(config, 'services.idam.systemPassword', 'DUMMY_VALUE_REPLACE');

beforeEach(() => {
  req = mockRequest();
  res = mockResponse();
  mockedAxiosGet.mockReset();
});

const caseData = { status: 200 };

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAxiosGet = jest.fn();
mockedAxios.post.mockImplementation(url => {
  switch (url) {
    case 'https://idam-web-public.aat.platform.hmcts.net/o/token':
      return Promise.resolve({ data: { id_token: 'token', access_token: 'token' } });
    case 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal/lease':
      return Promise.resolve({ data: 'TOKEN' });
    default:
      process.exit(1);
      return Promise.reject(new Error('not found'));
  }
});
mockedAxios.create.mockReturnValue({
  get: mockedAxiosGet,
} as unknown as AxiosInstance);

const controller = new CaseFinderController(form.fields);

describe('case finder post controller test cases', () => {
  test('Should navigate to data verification page if valid case reference entered', async () => {
    req = mockRequest({
      body: {
        saveAndContinue: true,
        applicantCaseId: '0675676483319900',
      },
      session: {
        user: { accessToken: 'token' },
        userCase: {
          id: 'caseRefId',
        },
      },
    });

    mockedAxiosGet.mockImplementation(() => Promise.resolve(caseData));

    await controller.post(req, res);
    expect(mockedAxiosGet).toHaveBeenCalledWith('/cases/cica/0675676483319900/access');
    expect(req.session.userCase).toStrictEqual({ id: '0675676483319900', applicantCaseId: '0675676483319900' });
    expect(res.redirect).toHaveBeenCalledWith(DATA_VERIFICATION);
  });

  test('Should navigate to data verification page if valid case reference entered and userCase not initialised', async () => {
    req = mockRequest({
      body: {
        saveAndContinue: true,
        applicantCaseId: '1675676483319900',
      },
      session: { user: { accessToken: 'token' } },
    });

    mockedAxiosGet.mockImplementation(() => Promise.resolve(caseData));

    await controller.post(req, res);
    expect(req.session.userCase.id).toEqual('1675676483319900');
    expect(res.redirect).toHaveBeenCalledWith(DATA_VERIFICATION);
  });

  test('Should save the cleared selection before sending an unexpected lookup failure to the error handler', async () => {
    req = mockRequest({
      body: {
        saveAndContinue: true,
        applicantCaseId: '1675676483319900',
      },
      session: {
        user: { accessToken: 'token' },
        userCase: {
          id: '1234567890123456',
        },
      },
    });
    mockedAxiosGet.mockRejectedValue(new Error('lookup unavailable'));

    await expect(controller.post(req, res)).rejects.toThrow('Appeal access lookup failed');
    expect(req.session.errors).toEqual([]);
    expect(req.session.save).toHaveBeenCalledTimes(1);
    expect(req.session.userCase).toStrictEqual({ id: '', applicantCaseId: '1675676483319900' });
    expect(res.redirect).not.toHaveBeenCalled();
  });

  test.each([
    ['', 'required'],
    ['123*456', 'invalidCaseReference'],
    [['1234567890123456'], 'invalidCaseReference'],
    ['123456789012345', 'invalidCaseReference'],
    ['12345678901234567', 'invalidCaseReference'],
    ['[reference](https://example.com)', 'containsMarkdownLink'],
    ['<em>reference</em>', 'containsInvalidCharacters'],
  ])('Should retain an invalid reference %p without checking case access', async (applicantCaseId, errorType) => {
    req = mockRequest({
      body: { applicantCaseId },
      session: {
        userCase: { id: '1234567890123456' },
        isDataVerified: true,
        verifiedCaseId: '1234567890123456',
        verifiedUserId: 'user-id',
      },
    });

    await controller.post(req, res);

    expect(mockedAxiosGet).not.toHaveBeenCalled();
    expect(req.session.errors).toStrictEqual([{ propertyName: 'applicantCaseId', errorType }]);
    expect(req.session.userCase).toStrictEqual({ id: '', applicantCaseId });
    expect(req.session.isDataVerified).toBe(false);
    expect(req.session.verifiedCaseId).toBeUndefined();
    expect(req.session.verifiedUserId).toBeUndefined();
    expect(res.redirect).toHaveBeenCalledWith(CASE_SEARCH_URL);
  });

  test('Should navigate to not authorised page if user not allowed (403)', async () => {
    req = mockRequest({
      body: {
        saveAndContinue: true,
        applicantCaseId: '1675676483319900',
      },
      session: {
        user: { accessToken: 'token' },
        userCase: { id: '1234567890123456' },
      },
    });

    const error = { response: { status: 403 } };
    mockedAxiosGet.mockImplementation(() => Promise.reject(error));

    await controller.post(req, res);
    expect(req.session.userCase).toStrictEqual({ id: '', applicantCaseId: '1675676483319900' });
    expect(res.redirect).toHaveBeenCalledWith(NOT_AUTHORISED);
  });

  test('Should keep the entered reference and clear the selected case on a 404', async () => {
    req = mockRequest({
      body: {
        saveAndContinue: true,
        applicantCaseId: '1675676483319900',
      },
      session: {
        user: { accessToken: 'token' },
        userCase: { id: '1234567890123456' },
      },
    });

    const error = { response: { status: 404 } };
    mockedAxiosGet.mockImplementation(() => Promise.reject(error));

    await controller.post(req, res);
    expect(req.session.userCase).toStrictEqual({ id: '', applicantCaseId: '1675676483319900' });
    expect(res.redirect).toHaveBeenCalledWith(CASE_NOT_FOUND_URL);
  });
});
