import { Response } from 'express';

import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { checkCaseAccess } from '../../../app/case/api';
import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject } from '../../../app/controller/PostController';
import { CASE_SEARCH_URL, DATA_VERIFICATION } from '../../urls';

import { form } from './content';
import CaseFinderController from './postController';

jest.mock('../../../app/case/api');

describe('case finder post controller', () => {
  const controller = new CaseFinderController(form.fields);
  const mockCheckCaseAccess = jest.mocked(checkCaseAccess);
  let req: AppRequest<AnyObject>;
  let res: Response;

  beforeEach(() => {
    mockCheckCaseAccess.mockReset();
    req = mockRequest();
    req.originalUrl = CASE_SEARCH_URL;
    res = mockResponse();
  });

  test.each(['0675676483319900', '0675-6764-8331-9900', '0675 6764 8331 9900', ' 0675 - 6764 - 8331 - 9900 '])(
    'uses only the digits and continues to data verification for %p',
    async applicantCaseId => {
      req.body = { applicantCaseId };
      req.session.caseReferenceForRetry = '0675-6764';
      req.session.verifiedCaseId = '0675676483319900';
      req.session.verifiedUserId = req.session.user.id;
      req.session.isDataVerified = true;
      mockCheckCaseAccess.mockResolvedValue({ status: 200 } as Awaited<ReturnType<typeof checkCaseAccess>>);

      await controller.post(req, res);

      expect(mockCheckCaseAccess).toHaveBeenCalledWith(req.session.user.accessToken, '0675676483319900');
      expect(req.session.userCase.id).toBe('0675676483319900');
      expect(req.session.errors).toEqual([]);
      expect(req.session.caseReferenceForRetry).toBeUndefined();
      expect(req.session.verifiedCaseId).toBeUndefined();
      expect(req.session.verifiedUserId).toBeUndefined();
      expect(req.session.isDataVerified).toBe(false);
      expect(res.redirect).toHaveBeenCalledWith(DATA_VERIFICATION);
    }
  );

  test('continues to data verification when no case has been initialised', async () => {
    req = mockRequest({ body: { applicantCaseId: '0675-6764-8331-9900' }, session: { userCase: undefined } });
    mockCheckCaseAccess.mockResolvedValue({ status: 200 } as Awaited<ReturnType<typeof checkCaseAccess>>);

    await controller.post(req, res);

    expect(req.session.userCase.id).toBe('0675676483319900');
    expect(res.redirect).toHaveBeenCalledWith(DATA_VERIFICATION);
  });

  test.each([
    [undefined, 'required'],
    ['', 'required'],
    ['   ', 'required'],
    ['0675-6764-8331-990', 'invalid'],
    ['0675-6764-8331-99001', 'invalid'],
    ['0675a - 6764 - 8331 - 9900', 'invalid'],
    ['0675/6764-8331-9900', 'invalid'],
    ['0675\t6764-8331-9900', 'invalid'],
    [' - ', 'invalid'],
    [['0675676483319900'], 'invalid'],
  ])('returns a field error without checking case access for %p', async (applicantCaseId, errorType) => {
    req.body = { applicantCaseId };
    const originalCase = req.session.userCase;

    await expect(controller.post(req, res)).resolves.toBeUndefined();

    expect(mockCheckCaseAccess).not.toHaveBeenCalled();
    expect(req.session.errors).toEqual([{ propertyName: 'applicantCaseId', errorType }]);
    expect(req.session.caseReferenceForRetry).toBe(typeof applicantCaseId === 'string' ? applicantCaseId : undefined);
    expect(req.session.userCase).toBe(originalCase);
    expect(res.redirect).toHaveBeenCalledWith(CASE_SEARCH_URL);
  });

  test('returns to the case finder with the original input if the case lookup fails', async () => {
    req.body = { applicantCaseId: '0675 - 6764 - 8331 - 9900' };
    mockCheckCaseAccess.mockRejectedValue(new Error('Case not found'));

    await controller.post(req, res);

    expect(mockCheckCaseAccess).toHaveBeenCalledWith(req.session.user.accessToken, '0675676483319900');
    expect(req.session.errors).toEqual([{ propertyName: 'applicantCaseId', errorType: 'caseNotFound' }]);
    expect(req.session.caseReferenceForRetry).toBe('0675 - 6764 - 8331 - 9900');
    expect(res.redirect).toHaveBeenCalledWith(CASE_SEARCH_URL);
  });
});
