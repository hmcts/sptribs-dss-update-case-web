import axios from 'axios';
import FormData from 'form-data';

import { mockRequest } from '../../../test/unit/utils/mockRequest';

import { deleteDocument, uploadDocument } from './documentManager';
jest.mock('axios');
type uploadedDocument = {
  data: string;
};
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create = jest.fn(() => mockedAxios);

describe('Test case for document upload', () => {
  const formData = new FormData();
  const req = mockRequest();
  req.session.user = { accessToken: 'TEST_ACCESS_TOKEN' };
  test('should upload document', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { document: 'test' } });
    expect(await (await uploadDocument(formData, 'dummyToken', req)).data).toEqual({ document: 'test' });
  });
});

describe('Test case for document removals', () => {
  test('should remove document', async () => {
    const req = mockRequest();
    req.session.user = { accessToken: 'TEST_ACCESS_TOKEN' };
    mockedAxios.post.mockReturnValueOnce({ data: {} } as unknown as Promise<uploadedDocument>);
    expect(await deleteDocument('dummyToken', 'documentId', req)).not.toBe(200);
  });
});
