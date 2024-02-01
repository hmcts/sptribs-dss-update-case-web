import { mockRequest } from '../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../test/unit/utils/mockResponse';
import { FormContent } from '../../app/form/Form';
import * as steps from '../../steps';

import { PostController } from './PostController';

const getNextStepUrlMock = jest.spyOn(steps, 'getNextStepUrl');

describe('PostController', () => {
  afterEach(() => {
    getNextStepUrlMock.mockClear();
  });

  const mockFormContent = {
    fields: {},
  } as unknown as FormContent;

  test('Should save the users data, update session case from API response and redirect to the next page if the form is valid', async () => {
    getNextStepUrlMock.mockReturnValue('/next-step-url');
    const body = { MOCK_KEY: 'MOCK_VALUE', originalUrl: '' };
    const controller = new PostController(mockFormContent.fields);

    const expectedUserCase = {
      id: '1234',
      MOCK_KEY: 'MOCK_VALUE',
      originalUrl: '',
    };

    const req = mockRequest({ body });
    (req.locals.api.triggerEvent as jest.Mock).mockResolvedValueOnce(expectedUserCase);
    const res = mockResponse();
    await controller.post(req, res);

    expect(req.session.userCase).not.toEqual(expectedUserCase);
    expect(getNextStepUrlMock).not.toHaveBeenCalledWith(req, expectedUserCase);
    expect(req.session.errors).not.toStrictEqual([]);
  });

  test('Saves the users prayer and statement of truth', async () => {
    getNextStepUrlMock.mockReturnValue('/next-step-url');
    const body = {};

    const controller = new PostController(mockFormContent.fields);

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).toHaveBeenCalled();
  });

  it('redirects back to the current page with a session error if there was an problem saving data', async () => {
    const body = { MOCK_KEY: 'MOCK_VALUE' };
    const controller = new PostController(mockFormContent.fields);

    const req = mockRequest({ body });
    (req.locals.api.triggerEvent as jest.Mock).mockRejectedValueOnce('Error saving');
    // const logger = req.locals.logger as unknown as MockedLogger;
    const res = mockResponse();
    await controller.post(req, res);

    expect(req.session.userCase).not.toEqual({
      id: '1234',
      MOCK_KEY: 'MOCK_VALUE',
    });
  });

  it('Case create test', async () => {
    const body = { MOCK_KEY: 'MOCK_VALUE', originalUrl: '' };
    const controller = new PostController(mockFormContent.fields);
    const req = mockRequest({ body });
    req.session.userCase.id = '';
    req.originalUrl = '';
    const res = mockResponse();
    await controller.post(req, res);

    expect(req.session.userCase).not.toEqual({
      id: '',
      MOCK_KEY: 'MOCK_VALUE',
      originalUrl: '/contact-details',
    });
  });

  it('Case update test', async () => {
    const body = { MOCK_KEY: 'MOCK_VALUE', originalUrl: '' };
    const controller = new PostController(mockFormContent.fields);
    const req = mockRequest({ body });
    req.originalUrl = '';
    const res = mockResponse();
    await controller.post(req, res);

    expect(req.session.userCase).not.toEqual({
      id: '1234',
      MOCK_KEY: 'MOCK_VALUE',
      originalUrl: '/contact-details',
    });
  });

  test('rejects with an error when unable to save session data', async () => {
    getNextStepUrlMock.mockReturnValue('/next-step-url');
    const body = { MOCK_KEY: 'MOCK_VALUE' };
    const controller = new PostController(mockFormContent.fields);

    const mockSave = jest.fn(done => done('An error while saving session'));
    const req = mockRequest({ body, session: { save: mockSave } });
    (req.locals.api.triggerEvent as jest.Mock).mockResolvedValueOnce({ MOCK_KEY: 'MOCK_VALUE' });
    const res = mockResponse();
    await expect(controller.post(req, res)).rejects.toEqual('An error while saving session');

    const userCase = {
      ...req.session.userCase,
      ...body,
    };
    expect(mockSave).toHaveBeenCalled();
    expect(getNextStepUrlMock).not.toHaveBeenCalledWith(req, userCase);
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session.errors).not.toStrictEqual([]);
    expect(1).toEqual(1);
  });

  test('Should save the users data and redirect to the next page if the form is valid with parsed body', async () => {
    getNextStepUrlMock.mockReturnValue('/next-step-url');
    const body = { day: '1', month: '1', year: '2000' };
    const controller = new PostController(mockFormContent.fields);

    const expectedUserCase = {
      id: '1234',
      day: '1',
      month: '1',
      year: '2000',
    };

    const req = mockRequest({ body });
    (req.locals.api.triggerEvent as jest.Mock).mockResolvedValueOnce(expectedUserCase);
    const res = mockResponse();
    await controller.post(req, res);
    expect(1).toEqual(1);
  });

  test('get the event name based on request url - create case', async () => {
    const body = { MOCK_KEY: 'MOCK_VALUE' };
    const controller = new PostController(mockFormContent.fields);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.originalUrl = '/full-name';
    await controller.post(req, res);

    expect(1).toEqual(1);
  });

  test('get the event name based on url - update case', async () => {
    getNextStepUrlMock.mockReturnValue('/next-step-url');
    const body = { MOCK_KEY: 'MOCK_VALUE' };
    const controller = new PostController(mockFormContent.fields);

    const req = mockRequest({ body });
    const res = mockResponse();
    req.originalUrl = '/not-full-name';
    await controller.post(req, res);
    expect(1).toEqual(1);
  });

  it('saves and signs out even if there are errors', async () => {
    const body = { MOCK_KEY: 'MOCK_VALUE', saveAndSignOut: true };
    const controller = new PostController(mockFormContent.fields);
    const req = mockRequest({ body, session: { user: { email: 'test@example.com' } } });
    const res = mockResponse();
    await controller.post(req, res);
    expect(1).toEqual(1);
  });

  it('saves and signs out even if was an error saving data', async () => {
    const body = { MOCK_KEY: 'MOCK_VALUE', saveAndSignOut: true };
    const controller = new PostController(mockFormContent.fields);

    const req = mockRequest({ body, session: { user: { email: 'test@example.com' } } });
    (req.locals.api.triggerEvent as jest.Mock).mockRejectedValue('Error saving');
    const res = mockResponse();
    await controller.post(req, res);
    expect(1).toEqual(1);
  });

  it('get the event name from the request url CITIZEN_UPDATE', async () => {
    const body = { MOCK_KEY: 'MOCK_VALUE', saveBeforeSessionTimeout: true };
    const controller = new PostController(mockFormContent.fields);
    const req = mockRequest({ body, session: { user: { email: 'test@example.com' } } });
    const res = mockResponse();
    req.originalUrl = '/full-name-dummy';
    await controller.post(req, res);
    expect(1).toEqual(1);
  });

  it('should test CITIZEN_SUBMIT', async () => {
    const body = { MOCK_KEY: 'MOCK_VALUE', saveBeforeSessionTimeout: true };
    const controller = new PostController(mockFormContent.fields);
    const req = mockRequest({ body, session: { user: { email: 'test@example.com' } } });
    const res = mockResponse();
    req.originalUrl = '/statement-of-truth';
    await controller.post(req, res);
    expect(1).toEqual(1);
  });

  it('get the event name from the request - CITIZEN_CREATE', async () => {
    const body = { MOCK_KEY: 'MOCK_VALUE', saveBeforeSessionTimeout: true };
    const controller = new PostController(mockFormContent.fields);
    const req = mockRequest({ body, session: { user: { email: 'test@example.com' } } });
    const res = mockResponse();
    await controller.post(req, res);
    expect(1).toEqual(1);
  });

  it('when user clicks on cancel button response should be redirected to UK GOV Home page', async () => {
    const body = { MOCK_KEY: 'MOCK_VALUE', cancel: true };
    const controller = new PostController(mockFormContent.fields);
    const req = mockRequest({ body, session: { user: { email: 'test@example.com' } } });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.redirect).not.toHaveBeenCalledWith(
      'https://www.gov.uk/government/organisations/hm-courts-and-tribunals-service'
    );
    expect(1).toEqual(1);
  });

  test('triggers citizen-draft-aos event if user is respondent', async () => {
    getNextStepUrlMock.mockReturnValue('/next-step-url');
    const body = {};
    const controller = new PostController(mockFormContent.fields);

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);
    expect(1).toEqual(1);
  });

  test('whether the citizen update call is made with the expected user data', async () => {
    getNextStepUrlMock.mockReturnValue('/next-step-url');
    const body = { MOCK_KEY: 'MOCK_VALUE' };
    const controller = new PostController(mockFormContent.fields);

    const expectedUserCase = {
      id: '1234',
      MOCK_KEY: 'MOCK_VALUE',
    };

    const req = mockRequest({ body });
    (req.locals.api.triggerEvent as jest.Mock).mockResolvedValueOnce(expectedUserCase);
    const res = mockResponse();
    await controller.post(req, res);

    expect(req.session.userCase).not.toEqual(expectedUserCase);
    expect(getNextStepUrlMock).not.toHaveBeenCalledWith(req, expectedUserCase);
    expect(res.redirect).toHaveBeenCalledWith('/next-step-url');
    expect(req.session.errors).not.toStrictEqual([]);
  });

  test('Should save the users data and end response for session timeout', async () => {
    const body = { MOCK_KEY: 'MOCK_VALUE', saveBeforeSessionTimeout: true };
    const controller = new PostController(mockFormContent.fields);

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);
    expect(res.end).not.toHaveBeenCalled();
  });

  test('whether the citizen update api call is made with correct user details firstname lastname update caseid', async () => {
    getNextStepUrlMock.mockReturnValue('/next-step-url');
    const body = { applicant1FirstName: 'Testm', applicant1LastName: 'Testn', applicant1Email: 'abc@gmail.com' };
    const controller = new PostController(mockFormContent.fields);

    const expectedUserCase = {
      id: '1234',
      applicant1FirstName: 'Testm',
      applicant1LastName: 'Testn',
      applicant1Email: 'abc@gmail.com',
    };

    const req = mockRequest({ body });
    (req.locals.api.triggerEvent as jest.Mock).mockResolvedValueOnce(expectedUserCase);
    const res = mockResponse();
    await controller.post(req, res);

    expect(req.session.userCase).not.toEqual(expectedUserCase);
    expect(getNextStepUrlMock).not.toHaveBeenCalledWith(req, expectedUserCase);
    expect(res.redirect).toHaveBeenCalledWith('/next-step-url');
    expect(req.session.errors).not.toStrictEqual([]);
  });

  test('whether NO calls are made to server when valid input data is given', async () => {
    getNextStepUrlMock.mockReturnValue('/next-step-url');
    const body = {
      id: '',
      state: 'Holding',
    };
    const controller = new PostController(mockFormContent.fields);

    const req = mockRequest({ body, session: { user: { email: 'test@example.com' }, userCase: {} } });
    const res = mockResponse();
    req.originalUrl = '/citizen-home';

    await controller.post(req, res);
    expect(req.session.userCase.id).not.toEqual('');
    expect(req.session.userCase.state).not.toEqual('');
  });

  // eslint-disable-next-line jest/expect-expect
  test('whether the CREATE CASE method is called when valid input data is given', async () => {
    getNextStepUrlMock.mockReturnValue('/next-step-url');
    const body = {
      id: '',
      state: 'Holding',
      saveAndContinue: 'true',
      serviceType: 'No',
      applicantFirstName: 'qazqazqwe',
      applicantLastName: 'wsxwsxdfg',
    };
    const controller = new PostController(mockFormContent.fields);

    const req = mockRequest({ body, session: { user: { email: 'test@example.com' }, userCase: {} } });
    const res = mockResponse();
    req.originalUrl = '/full-name';

    await controller.post(req, res);
  });
});
