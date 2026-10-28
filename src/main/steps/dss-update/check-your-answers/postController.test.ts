import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { updateCase, verifyCaseSubject } from '../../../app/case/api';
import { FormContent } from '../../../app/form/Form';
import { APPLICATION_CONFIRMATION, CHECK_YOUR_ANSWERS, DATA_VERIFICATION } from '../../urls';

import CheckYourAnswersController from './postController';

jest.mock('../../../app/case/api');
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
  const mockedUpdateCase = updateCase as jest.MockedFn<typeof updateCase>;
  const mockedVerifyCaseSubject = verifyCaseSubject as jest.MockedFn<typeof verifyCaseSubject>;
  const mockedRequest = mockRequest({
    session: {
      user: {
        id: 'user-id',
        accessToken: 'token',
      },
      isDataVerified: true,
      verifiedCaseId: '1709056435297860',
      verifiedUserId: 'user-id',
      userCase: {
        id: '1709056435297860',
        subjectFullName: 'subject name',
        subjectDOB: { year: '2000', month: '01', day: '01' },
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
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
    mockedVerifyCaseSubject.mockResolvedValue({ status: 200, data: { verified: true } } as any);
  });

  test('Should submit the case and navigate to confirmation page', async () => {
    mockedUpdateCase.mockResolvedValue({ status: 201, id: 1709056435297860, caseData: {} } as any);
    req = mockRequest({
      session: {
        user: {
          id: 'user-id',
          accessToken: 'token',
        },
        isDataVerified: true,
        verifiedCaseId: '1709056435297860',
        verifiedUserId: 'user-id',
        documentDetail: 'some info about doc',
        userCase: {
          id: '1709056435297860',
          subjectFullName: 'subject name',
          subjectDOB: { year: '2000', month: '01', day: '01' },
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
    expect(mockedVerifyCaseSubject).toHaveBeenCalledWith('token', '1709056435297860', 'subject name', '2000-01-01');
  });

  test('Should redirect back to check your answers page if call to submit event is unsuccessful', async () => {
    mockedUpdateCase.mockResolvedValue({ status: 500, id: 1709056435297860, caseData: {} } as any);
    req = mockedRequest;
    req.originalUrl = CHECK_YOUR_ANSWERS;

    const controller = new CheckYourAnswersController(mockFormContent.fields);
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS);
  });

  test('Should redirect back to check your answers page if call to submit event throws error', async () => {
    mockedUpdateCase.mockRejectedValue(new Error('not found'));
    req = mockedRequest;
    req.originalUrl = CHECK_YOUR_ANSWERS;

    const controller = new CheckYourAnswersController(mockFormContent.fields);
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS);
  });

  test('does not submit when verification is for another case', async () => {
    req = mockRequest({
      session: {
        user: { id: 'user-id', accessToken: 'token' },
        userCase: { id: '1709056435297860' },
        verifiedCaseId: '1234567891234567',
        verifiedUserId: 'user-id',
        isDataVerified: true,
      },
    });

    await new CheckYourAnswersController(mockFormContent.fields).post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(DATA_VERIFICATION);
    expect(mockedUpdateCase).not.toHaveBeenCalled();
  });

  test('does not submit if verification fails at submission time', async () => {
    const session = mockedRequest.session;
    mockedVerifyCaseSubject.mockResolvedValue({ status: 200, data: { verified: false } } as any);
    req = mockRequest({ session });

    await new CheckYourAnswersController(mockFormContent.fields).post(req, res);
    expect(req.session.isDataVerified).toBe(false);
    expect(res.redirect).toHaveBeenCalledWith(DATA_VERIFICATION);
    expect(mockedUpdateCase).not.toHaveBeenCalled();
  });
});
