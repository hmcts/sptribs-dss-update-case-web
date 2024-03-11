import axios from 'axios';

import { mockRequest } from '../../../test/unit/mocks/mockRequest';
import { mockResponse } from '../../../test/unit/mocks/mockResponse';
import { FieldPrefix } from '../../app/case/case';
import { UPLOAD_DOCUMENT } from '../../steps/urls';

import DocumentUpload from './getController';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create = jest.fn(() => mockedAxios);

describe('Test URL endpoints', () => {
  const controller = new DocumentUpload('page', () => ({}), FieldPrefix.APPLICANT);
  const res = mockResponse();
  const req = mockRequest();
  test('should be able to render the page and not show error page', async () => {
    await controller.get(req, res);
    expect(res.render).not.toHaveBeenCalledWith('error');
  });

  test('should be able to remove the documents from session, async', async () => {
    req.query['removeId'] = '1';
    req.session.caseDocuments = [{ documentId: '1' }, { documentId: '2' }];
    const data = {
      status: 'Success',
    };
    mockedAxios.delete.mockResolvedValue({ data });
    await controller.removeExistingConsentDocument('1', req, res);
    expect(mockedAxios.delete).toHaveBeenCalled();
    expect(req.session.caseDocuments).toEqual([{ documentId: '2' }]);
    expect(res.redirect).toHaveBeenCalledWith(UPLOAD_DOCUMENT);
  });
});
