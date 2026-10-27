import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { assignCreatorRole, updateCase } from '../../../app/case/api';
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
  const mockedUpdateCase = updateCase as jest.MockedFn<typeof updateCase>;
  const mockedAssignCreatorRole = assignCreatorRole as jest.MockedFn<typeof assignCreatorRole>;
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
    jest.clearAllMocks();
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

  test('assigns the creator role after data verification without submitting the case', async () => {
    mockedAssignCreatorRole.mockResolvedValue({ status: 204 } as any);
    req = mockRequest({
      body: { assignCreatorRole: 'true' },
      session: {
        isDataVerified: true,
        userCase: { id: '1709056435297860' },
      },
    });
    req.originalUrl = CHECK_YOUR_ANSWERS;

    await new CheckYourAnswersController(mockFormContent.fields).post(req, res);

    expect(mockedAssignCreatorRole).toHaveBeenCalledWith('mock-user-access-token', '1709056435297860');
    expect(mockedUpdateCase).not.toHaveBeenCalled();
    expect(req.session.isCreatorRoleAssigned).toBe(true);
    expect(res.redirect).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS);
  });

  test.each([
    ['unverified', false, '1709056435297860'],
    ['invalid reference', true, 'invalid'],
  ])('does not assign a role for %s sessions', async (_, isDataVerified, id) => {
    req = mockRequest({
      body: { assignCreatorRole: 'true' },
      session: { isDataVerified, userCase: { id } },
    });
    req.originalUrl = CHECK_YOUR_ANSWERS;

    await new CheckYourAnswersController(mockFormContent.fields).post(req, res);

    expect(mockedAssignCreatorRole).not.toHaveBeenCalled();
    expect(mockedUpdateCase).not.toHaveBeenCalled();
    expect(req.session.errors).toEqual([{ propertyName: 'roleAssignmentError', errorType: 'required' }]);
    expect(res.redirect).toHaveBeenCalledWith(CHECK_YOUR_ANSWERS);
  });

  test('shows an error if the case API refuses to assign the role', async () => {
    mockedAssignCreatorRole.mockRejectedValue({ response: { status: 403 } });
    req = mockRequest({
      body: { assignCreatorRole: 'true' },
      session: { isDataVerified: true, userCase: { id: '1709056435297860' } },
    });
    req.originalUrl = CHECK_YOUR_ANSWERS;

    await new CheckYourAnswersController(mockFormContent.fields).post(req, res);

    expect(req.session.errors).toEqual([{ propertyName: 'roleAssignmentError', errorType: 'required' }]);
    expect(req.session.isCreatorRoleAssigned).toBeUndefined();
    expect(mockedUpdateCase).not.toHaveBeenCalled();
  });
});
