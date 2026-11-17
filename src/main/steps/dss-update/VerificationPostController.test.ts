import { mockRequest } from '../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../test/unit/utils/mockResponse';
import { AppRequest } from '../../app/controller/AppRequest';
import { AnyObject } from '../../app/controller/PostController';
import { FormFields } from '../../app/form/Form';
import { isFieldFilledIn } from '../../app/form/validation';

import { VerificationPostController } from './VerificationPostController';

class TestVerificationController extends VerificationPostController {
  public handleVerificationMock = jest.fn();

  protected async handleVerification(
    req: AppRequest<AnyObject>,
    formData: Record<string, unknown>,
    fallbackUrl: string
  ): Promise<string> {
    return this.handleVerificationMock(req, formData, fallbackUrl);
  }
}

describe('VerificationPostController', () => {
  const mockFields: FormFields = {
    testField: {
      type: 'text',
      validator: isFieldFilledIn,
    },
  };

  test('should reset verification state and call handleVerification when there are no errors', async () => {
    const controller = new TestVerificationController(mockFields);
    controller.handleVerificationMock.mockResolvedValue('/next-step');

    const req = mockRequest({
      body: { testField: 'someValue' },
      session: {
        verifiedCaseId: '123',
        verifiedUserId: '456',
        isDataVerified: true,
        errors: [],
      },
    });
    req.originalUrl = '/current-step';
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.verifiedCaseId).toBeUndefined();
    expect(req.session.verifiedUserId).toBeUndefined();
    expect(req.session.isDataVerified).toBe(false);
    expect(controller.handleVerificationMock).toHaveBeenCalledWith(
      req,
      expect.objectContaining({ testField: 'someValue' }),
      '/current-step'
    );
    expect(res.redirect).toHaveBeenCalledWith('/next-step');
  });

  test('should reset verification state and bypass handleVerification when there are validation errors', async () => {
    const controller = new TestVerificationController(mockFields);

    const req = mockRequest({
      body: { testField: '' },
      session: {
        verifiedCaseId: '123',
        verifiedUserId: '456',
        isDataVerified: true,
      },
    });
    req.originalUrl = '/current-step';
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.verifiedCaseId).toBeUndefined();
    expect(req.session.verifiedUserId).toBeUndefined();
    expect(req.session.isDataVerified).toBe(false);
    expect(req.session.errors).toEqual([{ propertyName: 'testField', errorType: 'required' }]);
    expect(controller.handleVerificationMock).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/current-step');
  });

  test('should resolve fields if passed as a function', async () => {
    const fieldsFn = jest.fn().mockReturnValue(mockFields);
    const controller = new TestVerificationController(fieldsFn);
    controller.handleVerificationMock.mockResolvedValue('/next-step');

    const req = mockRequest({
      body: { testField: 'value' },
      session: { userCase: { id: 'caseId' } },
    });
    const res = mockResponse();

    await controller.post(req, res);

    expect(fieldsFn).toHaveBeenCalledWith(req.session.userCase);
    expect(controller.handleVerificationMock).toHaveBeenCalled();
  });
});
