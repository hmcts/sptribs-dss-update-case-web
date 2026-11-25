import { mockRequest } from '../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../test/unit/utils/mockResponse';
import { AppRequest } from '../../app/controller/AppRequest';
import { AnyObject } from '../../app/controller/PostController';
import { FormFields } from '../../app/form/Form';
import { isFieldFilledIn } from '../../app/form/validation';
import { PageLink } from '../urls';

import { VerificationPostController } from './VerificationPostController';

class TestVerificationController extends VerificationPostController {
  protected readonly defaultUrl: PageLink = '/default-url' as PageLink;
  public handleVerificationMock = jest.fn();

  protected async handleVerification(req: AppRequest<AnyObject>, formData: Record<string, unknown>): Promise<PageLink> {
    return this.handleVerificationMock(req, formData);
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
    controller.handleVerificationMock.mockResolvedValue('/next-step' as PageLink);

    const req = mockRequest({
      body: { testField: 'someValue', otherField: 'ignore-me' },
      session: {
        verifiedCaseId: '123',
        verifiedUserId: '456',
        isDataVerified: true,
        errors: [],
      },
    });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.verifiedCaseId).toBeUndefined();
    expect(req.session.verifiedUserId).toBeUndefined();
    expect(req.session.isDataVerified).toBe(false);
    expect(controller.handleVerificationMock).toHaveBeenCalledWith(req, { testField: 'someValue' });
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
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.verifiedCaseId).toBeUndefined();
    expect(req.session.verifiedUserId).toBeUndefined();
    expect(req.session.isDataVerified).toBe(false);
    expect(req.session.errors).toEqual([{ propertyName: 'testField', errorType: 'required' }]);
    expect(req.session.userCase).toEqual(expect.objectContaining({ testField: '' }));
    expect(controller.handleVerificationMock).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/default-url');
  });

  test('should preserve declared fields without replacing case metadata when validation fails', async () => {
    const controller = new TestVerificationController(mockFields);

    const req = mockRequest({
      body: { testField: '', id: 'submitted-id', otherField: 'ignore-me' },
      session: {
        userCase: { id: 'caseId' },
      },
    });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toEqual({
      id: 'caseId',
      testField: '',
    });
  });

  test('should resolve fields if passed as a function', async () => {
    const fieldsFn = jest.fn().mockReturnValue(mockFields);
    const controller = new TestVerificationController(fieldsFn);
    controller.handleVerificationMock.mockResolvedValue('/next-step' as PageLink);

    const req = mockRequest({
      body: { testField: 'value' },
      session: { userCase: { id: 'caseId' } },
    });
    const res = mockResponse();

    await controller.post(req, res);

    expect(fieldsFn).toHaveBeenCalledWith({ id: 'caseId' });
    expect(controller.handleVerificationMock).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/next-step');
  });

  test('should await session save and reject if session save fails', async () => {
    const controller = new TestVerificationController(mockFields);
    controller.handleVerificationMock.mockResolvedValue('/next-step' as PageLink);

    const mockSave = jest.fn(done => done(new Error('session save error')));
    const req = mockRequest({
      body: { testField: 'value' },
      session: { save: mockSave },
    });
    const res = mockResponse();

    await expect(controller.post(req, res)).rejects.toThrow('session save error');
    expect(res.redirect).not.toHaveBeenCalled();
  });

  test('should handle request without session save function', async () => {
    const controller = new TestVerificationController(mockFields);
    controller.handleVerificationMock.mockResolvedValue('/next-step' as PageLink);

    const req = mockRequest({
      body: { testField: 'value' },
    });
    delete req.session.save;
    const res = mockResponse();

    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/next-step');
  });
});
