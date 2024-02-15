import axios from 'axios';

import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { FormContent } from '../../../app/form/Form';

import CaseFinderController from './postController';
import { CASE_SEARCH_URL, DATA_VERIFICATION } from '../../urls';
import { isFieldFilledIn } from '../../../app/form/validation';

jest.mock('axios');
let req, res;

beforeEach(() => {
  req = mockRequest();
  res = mockResponse();
});

const mockFormContent = {
  fields: {
    applicantCaseId: {
      type: 'text',
      validator: isFieldFilledIn,
    }
  },
} as unknown as FormContent;

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJmYW1pbHlfbmFtZSI6IkRvcmlhbiIsInVpZCI6IjEyMyJ9.KaDIFSDdD3ZIYCl_qavvYbQ3a4abk47iBOZhB1-9mUQ';

const caseData = {
  status: 200,
  data: {
    id: '1675676483319900',
    data: {
      cicCaseFullName: 'subject name',
      cicCaseDateOfBirth: '2000-01-01'
    }
  }
};

const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockImplementation((url) => {
  switch (url) {
    case 'https://idam-api.aat.platform.hmcts.net/o/token':
      return Promise.resolve({data: {id_token: token, access_token: token}}
      )
    case 'http://rpe-service-auth-provider-aat.service.core-compute-demo.internal/testing-support/lease':
      return Promise.resolve({ data: 'TOKEN'})
    default:
      return Promise.reject(new Error('not found'))
  }
});

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
          id: 'caseRefId'
        }
      },
    });

    mockedAxios.get.mockImplementation(() => Promise.resolve(caseData));

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

    mockedAxios.get.mockImplementation(() => Promise.resolve(caseData));

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
          id: 'applicantCaseId'
        }
      },
    });
    req.originalUrl = CASE_SEARCH_URL;

    mockedAxios.get.mockImplementation(() => Promise.reject(new Error('invalid case reference')));

    await controller.post(req, res);
    expect(req.session.errors).toStrictEqual([{ propertyName: 'caseNotFound', errorType: 'required' }]);
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
