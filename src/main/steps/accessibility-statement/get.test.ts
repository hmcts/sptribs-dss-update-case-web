import { mockRequest } from '../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../test/unit/utils/mockResponse';

import { cy, en } from './content';
import { AccessibilityStatementGetController } from './get';

describe('AccessibilityStatementGetController', () => {
  const controller = new AccessibilityStatementGetController();

  test('Should render the accessibility statement page for the CICA service', async () => {
    const req = mockRequest();
    const res = mockResponse();
    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      expect.stringContaining(__dirname + '/template'),
      expect.objectContaining(en)
    );
  });

  test('Should render the accessibility statement page for the CICA service Welsh', async () => {
    const req = mockRequest();
    const res = mockResponse();
    req.session.lang = 'cy';
    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      expect.stringContaining(__dirname + '/template'),
      expect.objectContaining(cy)
    );
  });
});
