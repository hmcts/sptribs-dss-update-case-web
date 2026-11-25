import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';

import { cy, en } from './content';
import { CaseNotFoundGetController } from './get';

describe('CaseNotFoundGetController', () => {
  const controller = new CaseNotFoundGetController();

  test('Should render the case not found page in English', async () => {
    const req = mockRequest({
      session: {
        userCase: { applicantCaseId: '1234567890123456' },
      },
    });
    const res = mockResponse();
    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      expect.stringContaining(__dirname + '/template'),
      expect.objectContaining(en())
    );
  });

  test('Should render the case not found page in Welsh', async () => {
    const req = mockRequest({
      session: {
        lang: 'cy',
        userCase: { applicantCaseId: '1234567890123456' },
      },
    });
    const res = mockResponse();
    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      expect.stringContaining(__dirname + '/template'),
      expect.objectContaining(cy())
    );
  });
});
