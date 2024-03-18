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
    expect(res.redirect).not.toHaveBeenCalledWith(UPLOAD_DOCUMENT);
  });

  test('should be able to handle document deletion request', async () => {
    req.query['removeId'] = '1';
    req.session.caseDocuments = [{ documentId: '1' }, { documentId: '2' }];
    const data = {
      status: 'Success',
    };
    mockedAxios.delete.mockResolvedValue({ data });
    await controller.get(req, res);
    expect(mockedAxios.delete).toHaveBeenCalled();
    expect(req.session.caseDocuments).toEqual([{ documentId: '2' }])
    expect(res.redirect).toHaveBeenCalledWith(UPLOAD_DOCUMENT);
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

  test('should handle when document deletion fails', async () => {
    req.query['removeId'] = '1';
    req.session.caseDocuments = [{ documentId: '1' }, { documentId: '2' }];
    const data = {
      status: 'Success',
    };
    mockedAxios.delete.mockRejectedValue({ data })
    await controller.removeExistingConsentDocument('1', req, res);
    expect(mockedAxios.delete).toHaveBeenCalled();
    expect(req.session.caseDocuments).toEqual([{ documentId: '1' }, { documentId: '2' }]);
    expect(res.redirect).toHaveBeenCalledWith(UPLOAD_DOCUMENT);
    expect(req.session.fileErrors.length).toEqual(1);
    expect(req.session.fileErrors[0].text).toEqual('Document upload or deletion has failed. Please try again');
    expect(req.session.fileErrors[0].href).toEqual('#');
  
  });
});
