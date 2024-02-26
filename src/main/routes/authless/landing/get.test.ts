import { mockRequest } from '../../../../test/unit/mocks/mockRequest';
import { mockResponse } from '../../../../test/unit/mocks/mockResponse';
import { CASE_SEARCH_URL } from '../../../steps/urls';

import { LandingGetController } from './get';

describe('Test URL endpoints', () => {
  const controller = new LandingGetController();

  const res = mockResponse();
  const req = mockRequest();

  test('should redirect user to case finder page if already authenticated with idam', async () => {
    await controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith(CASE_SEARCH_URL);
  });

  test('should redirect user to landing page if user not authenticated with idam', async () => {
    delete req.session.user;
    await controller.get(req, res);
    expect(res.render).toHaveBeenCalledWith('landing.njk', expect.any(Object));
  });
});
