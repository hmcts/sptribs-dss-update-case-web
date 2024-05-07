import axios from 'axios';

import { mockRequest } from '../../../test/unit/mocks/mockRequest';
import { mockResponse } from '../../../test/unit/mocks/mockResponse';
import { UPLOAD_DOCUMENT } from '../urls';

import DocumentUpload from './getController';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create = jest.fn(() => mockedAxios);

describe('Test URL endpoints', () => {
  const controller = new DocumentUpload('page', () => ({}));
  const res = mockResponse();
  const req = mockRequest();

  function initiateTestData() {
    req.query['removeId'] = '1';
    req.session.caseDocuments = [{ documentId: '1' }, { documentId: '2' }];
    req.session.save = jest.fn(done => done());
    return {
      status: 'Success',
    };
  }

  test('should be able to render the page and not show error page', async () => {
    await controller.get(req, res);
    expect(res.redirect).not.toHaveBeenCalledWith(UPLOAD_DOCUMENT);
  });

  test('should be able to handle document deletion request', async () => {
    const data = initiateTestData();
    mockedAxios.delete.mockResolvedValue({ data });

    await controller.get(req, res);
    expect(mockedAxios.delete).toHaveBeenCalled();
    expect(req.session.caseDocuments).toEqual([{ documentId: '2' }]);
    expect(res.redirect).toHaveBeenCalledWith(UPLOAD_DOCUMENT);
  });

  test('should be able to remove the documents from session, async', async () => {
    const data = initiateTestData();
    mockedAxios.delete.mockResolvedValue({ data });

    await controller.removeExistingDocument('1', req, res);
    expect(mockedAxios.delete).toHaveBeenCalled();
    expect(req.session.caseDocuments).toEqual([{ documentId: '2' }]);
    expect(res.redirect).toHaveBeenCalledWith(UPLOAD_DOCUMENT);
  });

  test('should handle when document deletion fails', async () => {
    const data = initiateTestData();
    mockedAxios.delete.mockRejectedValue({ data });

    await controller.removeExistingDocument('1', req, res);
    expect(mockedAxios.delete).toHaveBeenCalled();
    expect(req.session.caseDocuments).toEqual([{ documentId: '1' }, { documentId: '2' }]);
    expect(res.redirect).toHaveBeenCalledWith(UPLOAD_DOCUMENT);
    expect(req.session.fileErrors).toHaveLength(1);
    expect(req.session.fileErrors[0].text).toEqual('Document upload or deletion has failed. Try again');
    expect(req.session.fileErrors[0].href).toEqual('#');
  });
});
