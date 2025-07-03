import axios from 'axios';
import config from 'config';
import { set } from 'lodash';

import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { FormContent } from '../../../app/form/Form';
import { covertToDateObject } from '../../../app/form/parser';
import { isDateInputNotFilled, isFieldFilledIn } from '../../../app/form/validation';
import { DATA_VERIFICATION, UPLOAD_DOCUMENT } from '../../urls';

import CitizenDataVerificationPostController from './postController';

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

describe('citizenDataVerification post controller test cases', () => {
  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  const mockFormContent = {
    fields: {
      subjectFullName: {
        type: 'text',
        validator: isFieldFilledIn,
      },
      subjectDOB: {
        type: 'date',
        values: [
          { label: l => l.dateFormat['day'], name: 'day' },
          { label: l => l.dateFormat['month'], name: 'month' },
          { label: l => l.dateFormat['year'], name: 'year' },
        ],
        parser: body => covertToDateObject('subjectDOB', body as Record<string, unknown>),
        validator: isDateInputNotFilled,
      },
    },
  } as unknown as FormContent;

  const caseData = {
    status: 201,
    data: {
      data: {
        cicCaseFullName: 'subject name',
        cicCaseDateOfBirth: '2000-01-01',
      },
    },
  };

  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.post.mockImplementation(url => {
    switch (url) {
      case 'https://idam-api.aat.platform.hmcts.net/o/token':
        return Promise.resolve({ data: { id_token: 'token', access_token: 'token' } });
      case 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal/lease':
        return Promise.resolve('TOKEN');
      default:
        return Promise.reject(new Error('not found'));
    }
  });

  test('Should navigate to upload document page if data entered matched those stored on case', async () => {
    const controller = new CitizenDataVerificationPostController(mockFormContent.fields);

    req = mockRequest({
      body: {
        saveAndContinue: true,
        'subjectDOB-day': '01',
        'subjectDOB-month': '01',
        'subjectDOB-year': '2000',
        subjectDOB: {
          year: '2000',
          month: '01',
          day: '01',
        },
        subjectFullName: 'subject name',
      },
      session: {
        isDataVerified: false,
        errors: [],
      },
    });

    mockedAxios.get.mockImplementation(() => Promise.resolve(caseData));

    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(UPLOAD_DOCUMENT);
  });

  test('Should navigate to original url if data does not match and return errors', async () => {
    const controller = new CitizenDataVerificationPostController(mockFormContent.fields);

    req = mockRequest({
      body: {
        saveAndContinue: true,
        'subjectDOB-day': '02',
        'subjectDOB-month': '02',
        'subjectDOB-year': '1990',
        subjectDOB: {
          year: '1990',
          month: '02',
          day: '02',
        },
        subjectFullName: 'bob smith',
      },
      session: {
        isDataVerified: false,
        errors: [],
      },
    });
    req.originalUrl = DATA_VERIFICATION;

    mockedAxios.get.mockImplementation(() => Promise.resolve(caseData));

    await controller.post(req, res);
    expect(req.session.errors).toStrictEqual([{ propertyName: 'inputFields', errorType: 'required' }]);
    expect(res.redirect).toHaveBeenCalledWith(DATA_VERIFICATION);
  });

  test('Should navigate to original url and return errors if exception thrown from http request', async () => {
    const controller = new CitizenDataVerificationPostController(mockFormContent.fields);

    req = mockRequest({
      body: {
        saveAndContinue: true,
        'subjectDOB-day': '02',
        'subjectDOB-month': '02',
        'subjectDOB-year': '1990',
        subjectDOB: {
          year: '1990',
          month: '02',
          day: '02',
        },
        subjectFullName: 'bob smith',
      },
      session: {
        isDataVerified: false,
        errors: [],
      },
    });
    req.originalUrl = DATA_VERIFICATION;

    mockedAxios.get.mockImplementation(() => Promise.reject(new Error('case not found')));

    await controller.post(req, res);
    expect(req.session.errors).toStrictEqual([{ propertyName: 'caseError', errorType: 'required' }]);
    expect(res.redirect).toHaveBeenCalledWith(DATA_VERIFICATION);
  });

  test('Should navigate to original url if session errors is not empty', async () => {
    const controller = new CitizenDataVerificationPostController(mockFormContent.fields);
    req = mockRequest({
      body: {
        saveAndContinue: true,
        'subjectDOB-day': '01',
        'subjectDOB-month': '01',
        'subjectDOB-year': '2020',
        subjectFullName: '',
      },
      session: {},
    });
    req.originalUrl = DATA_VERIFICATION;

    await controller.post(req, res);
    expect(req.session.errors).toStrictEqual([{ propertyName: 'subjectFullName', errorType: 'required' }]);
    expect(res.redirect).toHaveBeenCalledWith(DATA_VERIFICATION);
  });
});
