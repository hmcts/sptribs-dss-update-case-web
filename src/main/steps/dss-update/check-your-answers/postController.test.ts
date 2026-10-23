import { AxiosError, AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { getCaseAsUser, updateCase } from '../../../app/case/api';
import { FormContent } from '../../../app/form/Form';
import { APPLICATION_CONFIRMATION, CHECK_YOUR_ANSWERS } from '../../urls';

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
  const mockedGetCaseAsUser = getCaseAsUser as jest.MockedFn<typeof getCaseAsUser>;
  const mockedUpdateCase = updateCase as jest.MockedFn<typeof updateCase>;
  const mockedRequest = mockRequest({
    session: {
      user: {
        accessToken: 'token',
      },
      userCase: {
        id: '1709056435297860',
      },
      isDataVerified: true,
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
    mockedGetCaseAsUser.mockReset();
    mockedGetCaseAsUser.mockResolvedValue({ status: StatusCodes.OK } as AxiosResponse);
    mockedUpdateCase.mockReset();
    req = mockRequest();
    res = mockResponse();
  });

  test('Should submit the case and navigate to confirmation page', async () => {
    mockedUpdateCase.mockResolvedValue({ status: 201, id: 1709056435297860, caseData: {} } as any);
    req = mockRequest({
      session: {
        user: {
          accessToken: 'token',
        },
        documentDetail: 'some info about doc',
        userCase: {
          id: '1709056435297860',
        },
        isDataVerified: true,
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
    expect(mockedGetCaseAsUser).toHaveBeenCalledWith('token', '1709056435297860');
    expect(mockedUpdateCase).toHaveBeenCalledTimes(1);
    expect(req.session.errors).toEqual([]);
  });

  test('Should redirect back to check your answers page if call to submit event is unsuccessful', async () => {
    mockedUpdateCase.mockResolvedValue({ status: 500, id: 1709056435297860, caseData: {} } as any);
    req = mockedRequest;
    req.originalUrl = CHECK_YOUR_ANSWERS;

    const controller = new CheckYourAnswersController(mockFormContent.fields);
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS);
    expect(req.session.errors).toEqual([{ propertyName: 'submissionError', errorType: 'required' }]);
  });

  test.each([StatusCodes.FORBIDDEN, StatusCodes.NOT_FOUND])(
    'Should show a case access error when the citizen case lookup returns HTTP %s',
    async status => {
      mockedGetCaseAsUser.mockRejectedValue(
        new AxiosError('Case not accessible', 'ERR_BAD_REQUEST', undefined, undefined, {
          status,
          data: { message: 'Sensitive response details' },
        } as AxiosResponse)
      );
      req = mockedRequest;
      req.originalUrl = CHECK_YOUR_ANSWERS;

      const controller = new CheckYourAnswersController(mockFormContent.fields);
      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS);
      expect(req.session.errors).toEqual([{ propertyName: 'submissionError', errorType: 'caseNotAccessible' }]);
      expect(req.locals.logger.error).toHaveBeenCalledWith('Error during server call:', 'Case access denied');
      expect(mockedUpdateCase).not.toHaveBeenCalled();
    }
  );

  test('Should keep the generic error if the case lookup fails for another reason', async () => {
    mockedGetCaseAsUser.mockRejectedValue(
      new AxiosError('Unavailable', 'ERR_BAD_RESPONSE', undefined, undefined, {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      } as AxiosResponse)
    );
    req = mockedRequest;
    req.originalUrl = CHECK_YOUR_ANSWERS;

    const controller = new CheckYourAnswersController(mockFormContent.fields);
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS);
    expect(req.session.errors).toEqual([{ propertyName: 'submissionError', errorType: 'required' }]);
    expect(mockedUpdateCase).not.toHaveBeenCalled();
  });

  test.each([
    [StatusCodes.UNAUTHORIZED, 'Request failed'],
    [StatusCodes.FORBIDDEN, 'Forbidden'],
    [StatusCodes.NOT_FOUND, 'Request failed'],
  ])('Should keep the generic error for HTTP %s from the event request', async (status, loggedError) => {
    mockedUpdateCase.mockRejectedValue(
      new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
        status,
      } as AxiosResponse)
    );
    req = mockedRequest;
    req.originalUrl = CHECK_YOUR_ANSWERS;

    const controller = new CheckYourAnswersController(mockFormContent.fields);
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS);
    expect(req.session.errors).toEqual([{ propertyName: 'submissionError', errorType: 'required' }]);
    expect(mockedUpdateCase).toHaveBeenCalledTimes(1);
    expect(req.locals.logger.error).toHaveBeenCalledWith('Error during server call:', loggedError);
  });

  test('Should not disclose case access or submit if the subject details have not been verified', async () => {
    req = mockRequest({
      session: {
        userCase: { id: '1709056435297860' },
        caseDocuments: [],
        isDataVerified: false,
      },
    });
    req.originalUrl = CHECK_YOUR_ANSWERS;

    const controller = new CheckYourAnswersController(mockFormContent.fields);
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS);
    expect(req.session.errors).toEqual([{ propertyName: 'submissionError', errorType: 'required' }]);
    expect(mockedGetCaseAsUser).not.toHaveBeenCalled();
    expect(mockedUpdateCase).not.toHaveBeenCalled();
  });

  test('Should redirect back to check your answers page if call to submit event throws error', async () => {
    mockedUpdateCase.mockRejectedValue(new Error('not found'));
    req = mockedRequest;
    req.originalUrl = CHECK_YOUR_ANSWERS;

    const controller = new CheckYourAnswersController(mockFormContent.fields);
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS);
    expect(req.session.errors).toEqual([{ propertyName: 'submissionError', errorType: 'required' }]);
  });
});
