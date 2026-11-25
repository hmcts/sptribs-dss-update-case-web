import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';

import { cy, en } from './content';
import { SubjectDetailsErrorGetController } from './get';

describe('SubjectDetailsErrorGetController', () => {
  const controller = new SubjectDetailsErrorGetController();

  test('Should render the subject details error page in English', async () => {
    const req = mockRequest();
    const res = mockResponse();
    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      expect.stringContaining(__dirname + '/template'),
      expect.objectContaining(en())
    );
  });

  test('Should render the subject details error page in Welsh', async () => {
    const req = mockRequest();
    const res = mockResponse();
    req.session.lang = 'cy';
    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      expect.stringContaining(__dirname + '/template'),
      expect.objectContaining(cy())
    );
  });
});
