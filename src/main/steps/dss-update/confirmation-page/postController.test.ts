import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { FormContent } from '../../../app/form/Form';
import { HOME_URL } from '../../urls';

import ConfirmationPagePostController from './postController';

describe('ConfirmationPagePostController post controller test cases', () => {
  test('Should navigate to home page and clear session', async () => {
    const mockFormContent = {
      fields: {},
    } as unknown as FormContent;

    const req = mockRequest();
    const res = mockResponse();

    const controller = new ConfirmationPagePostController(mockFormContent.fields);

    await controller.post(req, res);
    expect(req.session.destroy).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(HOME_URL);
  });
});
