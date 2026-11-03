import { mockRequest } from '../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../test/unit/utils/mockResponse';
import { CASE_SEARCH_URL, DATA_VERIFICATION } from '../urls';

import { requireSelectedCase, requireVerifiedCase } from './requireVerifiedCase';

describe('requireVerifiedCase', () => {
  it('requires a selected case before collecting subject details', () => {
    const res = mockResponse();
    const next = jest.fn();
    requireSelectedCase(mockRequest({ session: { userCase: {} } }), res, next);
    expect(res.redirect).toHaveBeenCalledWith(CASE_SEARCH_URL);
    expect(next).not.toHaveBeenCalled();
  });
  it('lets the verified user continue with the verified case', () => {
    const req = mockRequest({
      session: {
        isDataVerified: true,
        verifiedCaseId: '1234567891234567',
        verifiedUserId: 'user-id',
        user: { id: 'user-id' },
        userCase: { id: '1234567891234567' },
      },
    });
    const next = jest.fn();
    requireVerifiedCase(req, mockResponse(), next);
    expect(next).toHaveBeenCalled();
  });

  it('blocks access after switching cases', () => {
    const req = mockRequest({
      session: {
        isDataVerified: true,
        verifiedCaseId: '1234567891234567',
        verifiedUserId: 'user-id',
        user: { id: 'user-id' },
        userCase: { id: '9876543210987654' },
      },
    });
    const res = mockResponse();
    const next = jest.fn();
    requireVerifiedCase(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(DATA_VERIFICATION);
    expect(next).not.toHaveBeenCalled();
  });
});
