import axios from 'axios';

import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { FormContent } from '../../../app/form/Form';
import { APPLICATION_CONFIRMATION, CHECK_YOUR_ANSWERS } from '../../urls';

import CheckYourAnswersController from './postController';

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

describe('CheckYourAnswersController test cases', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedRequest = mockRequest({
    session: {
      user: {
        accessToken: 'token',
      },
      userCase: {
        id: '1709056435297860',
      },
      caseDocuments: [
        {
          url: 'http://dm-store-aat.service.core-compute-aat.internal/documents/770fe5b7-77d6-41e8-81aa-d16730c440c5',
          fileName: 'test.pdf',
          documentId: '770fe5b7-77d6-41e8-81aa-d16730c440c5',
          binaryUrl:
            'http://dm-store-aat.service.core-compute-aat.internal/documents/770fe5b7-77d6-41e8-81aa-d16730c440c5/binary',
          description: 'Test1',
        },
      ],
    },
  });
  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  test('Should submit the case and navigate to confirmation page', async () => {
    mockedAxios.put.mockImplementation(url => {
      switch (url) {
        case 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal/lease':
          return Promise.resolve({ data: 'TOKEN' });
        case 'http://sptribs-case-api-aat.service.core-compute-aat.internal/case/dss-orchestration/1709056435297860/update?event=UPDATE_CASE':
          return Promise.resolve({ status: 200, id: 1709056435297860, caseData: {} });
        default:
          return Promise.reject(new Error('not found'));
      }
    });
    req = mockRequest({
      session: {
        user: {
          accessToken: 'token',
        },
        documentDetail: 'some info about doc',
        userCase: {
          id: '1709056435297860',
        },
        caseDocuments: [
          {
            url: 'http://dm-store-aat.service.core-compute-aat.internal/documents/770fe5b7-77d6-41e8-81aa-d16730c440c5',
            fileName: 'test.pdf',
            documentId: '770fe5b7-77d6-41e8-81aa-d16730c440c5',
            binaryUrl:
              'http://dm-store-aat.service.core-compute-aat.internal/documents/770fe5b7-77d6-41e8-81aa-d16730c440c5/binary',
            description: 'Test1',
          },
        ],
      },
    });
    const controller = new CheckYourAnswersController(mockFormContent.fields);
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(APPLICATION_CONFIRMATION);
  });

  test('Should redirect back to check your answers page if call to submit event is unsuccessful', async () => {
    mockedAxios.put.mockImplementation(url => {
      switch (url) {
        case 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal/lease':
          return Promise.resolve({ data: 'TOKEN' });
        case 'http://sptribs-case-api-aat.service.core-compute-aat.internal/case/dss-orchestration/1709056435297860/update?event=UPDATE_CASE':
          return Promise.resolve({ status: 500, id: 1709056435297860, caseData: {} });
        default:
          return Promise.reject(new Error('not found'));
      }
    });
    req = mockedRequest;
    req.originalUrl = CHECK_YOUR_ANSWERS;

    const controller = new CheckYourAnswersController(mockFormContent.fields);
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS);
  });

  test('Should redirect back to check your answers page if call to submit event throws error', async () => {
    mockedAxios.put.mockImplementation(url => {
      switch (url) {
        case 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal/lease':
          return Promise.resolve({ data: 'TOKEN' });
        case 'http://sptribs-case-api-aat.service.core-compute-aat.internal/case/dss-orchestration/1709056435297860/update?event=UPDATE_CASE':
          return Promise.reject(new Error('not found'));
        default:
          return Promise.reject(new Error('not found'));
      }
    });
    req = mockedRequest;
    req.originalUrl = CHECK_YOUR_ANSWERS;

    const controller = new CheckYourAnswersController(mockFormContent.fields);
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS);
  });
});
