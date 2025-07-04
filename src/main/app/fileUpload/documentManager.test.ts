import axios from 'axios';
import FormData from 'form-data';

import { mockRequest } from '../../../test/unit/utils/mockRequest';

import { deleteDocument, uploadDocument } from './documentManager';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create = jest.fn(() => mockedAxios);

describe('Test case for document upload', () => {
  const formData = new FormData();
  const req = mockRequest();
  req.session.user = { accessToken: 'TEST_ACCESS_TOKEN' };
  test('should upload document', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { documents: [{ document: 'test' }] } });
    const actual = await uploadDocument(formData, 'dummyToken', req);
    expect(actual.data).toEqual({ documents: [{ document: 'test' }] });
  });
});

describe('Test case for document removals', () => {
  test('should remove document', async () => {
    const req = mockRequest();
    req.session.user = { accessToken: 'TEST_ACCESS_TOKEN' };
    mockedAxios.delete.mockResolvedValueOnce({ data: {} });
    await deleteDocument('dummyToken', 'documentId', req);
    expect(mockedAxios.delete).toHaveBeenCalledWith('/cases/documents/documentId');
  });
});
