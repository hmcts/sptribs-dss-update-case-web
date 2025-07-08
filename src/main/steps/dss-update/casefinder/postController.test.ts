import axios, { AxiosInstance } from 'axios';
import config from 'config';
import { set } from 'lodash';

import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { FormContent } from '../../../app/form/Form';
import { isFieldFilledIn } from '../../../app/form/validation';
import { CASE_SEARCH_URL, DATA_VERIFICATION } from '../../urls';

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
});

const mockFormContent = {
  fields: {
    applicantCaseId: {
      type: 'text',
      validator: isFieldFilledIn,
    },
  },
} as unknown as FormContent;

const caseData = {
  status: 200,
  data: {
    id: '1675676483319900',
    data: {
      cicCaseFullName: 'subject name',
      cicCaseDateOfBirth: '2000-01-01',
    },
  },
};

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAxiosGet = jest.fn();
mockedAxios.post.mockImplementation(url => {
  switch (url) {
    case 'https://idam-api.aat.platform.hmcts.net/o/token':
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

const controller = new CaseFinderController(mockFormContent.fields);

describe('case finder post controller test cases', () => {
  test('Should navigate to data verification page if valid case reference entered', async () => {
    req = mockRequest({
      body: {
        saveAndContinue: true,
        applicantCaseId: '1675676483319900',
      },
      session: {
        userCase: {
          id: 'caseRefId',
        },
      },
    });

    mockedAxiosGet.mockImplementation(() => Promise.resolve(caseData));

    await controller.post(req, res);
    expect(req.session.userCase.id).toEqual('1675676483319900');
    expect(res.redirect).toHaveBeenCalledWith(DATA_VERIFICATION);
  });

  test('Should navigate to data verification page if valid case reference entered and userCase not initialised', async () => {
    req = mockRequest({
      body: {
        saveAndContinue: true,
        applicantCaseId: '1675676483319900',
      },
      session: {},
    });

    mockedAxiosGet.mockImplementation(() => Promise.resolve(caseData));

    await controller.post(req, res);
    expect(req.session.userCase.id).toEqual('1675676483319900');
    expect(res.redirect).toHaveBeenCalledWith(DATA_VERIFICATION);
  });

  test('Should navigate to original url if invalid case reference entered and return errors', async () => {
    req = mockRequest({
      body: {
        saveAndContinue: true,
        applicantCaseId: '1675676483319900',
      },
      session: {
        userCase: {
          id: 'applicantCaseId',
        },
      },
    });
    req.originalUrl = CASE_SEARCH_URL;

    mockedAxiosGet.mockImplementation(() => Promise.reject(new Error('invalid case reference')));

    await controller.post(req, res);
    expect(req.session.errors).toStrictEqual([{ propertyName: 'applicantCaseId', errorType: 'caseNotFound' }]);
    expect(res.redirect).toHaveBeenCalledWith(CASE_SEARCH_URL);
  });

  test('Should navigate to original url if no case reference entered and return errors', async () => {
    req = mockRequest({
      body: {
        saveAndContinue: true,
        applicantCaseId: '',
      },
      session: {
        userCase: {},
      },
    });
    req.originalUrl = CASE_SEARCH_URL;

    await controller.post(req, res);
    expect(req.session.errors).toStrictEqual([{ propertyName: 'applicantCaseId', errorType: 'required' }]);
    expect(res.redirect).toHaveBeenCalledWith(CASE_SEARCH_URL);
  });
});
