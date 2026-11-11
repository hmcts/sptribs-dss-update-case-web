import axios from 'axios';
import config from 'config';

import { getServiceAuthToken } from '../s2s/get-service-auth-token';

import { checkCaseAccess, updateCase, verifyCaseSubject } from './api';

jest.mock('axios');
jest.mock('../s2s/get-service-auth-token');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetServiceAuthToken = getServiceAuthToken as jest.MockedFunction<typeof getServiceAuthToken>;

describe('case-api', () => {
  const userToken = 'user-token';
  const serviceAuthToken = 'service-auth-token';
  const caseId = '1234567890123456';

  beforeEach(() => mockedGetServiceAuthToken.mockResolvedValue(serviceAuthToken));

  test('checks case access without fetching case data', async () => {
    const get = jest.fn().mockResolvedValue({ status: 200 });
    mockedAxios.create.mockReturnValue({ get } as unknown as jest.Mocked<typeof axios>);

    expect(await checkCaseAccess(userToken, caseId)).toEqual({ status: 200 });
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: config.get('services.sptribs.url'),
      headers: {
        Authorization: `Bearer ${userToken}`,
        ServiceAuthorization: serviceAuthToken,
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    });
    expect(get).toHaveBeenCalledWith(`/cases/cica/${caseId}/access`);
  });

  test('sends only subject details for verification', async () => {
    const post = jest.fn().mockResolvedValue({ status: 200, data: { verified: true } });
    mockedAxios.create.mockReturnValue({ post } as unknown as jest.Mocked<typeof axios>);

    expect(await verifyCaseSubject(userToken, caseId, 'subject name', '2000-01-01')).toEqual({
      status: 200,
      data: { verified: true },
    });
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: config.get('services.sptribs.url'),
      headers: {
        Authorization: `Bearer ${userToken}`,
        ServiceAuthorization: serviceAuthToken,
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    });
    expect(post).toHaveBeenCalledWith(`/cases/cica/${caseId}/subject-verifications`, {
      subject_full_name: 'subject name',
      subject_date_of_birth: '2000-01-01',
    });
  });

  test('encodes case references in both verification paths', async () => {
    const get = jest.fn().mockResolvedValue({ status: 200 });
    const post = jest.fn().mockResolvedValue({ status: 200, data: { verified: false } });
    mockedAxios.create.mockReturnValue({ get, post } as unknown as jest.Mocked<typeof axios>);

    await checkCaseAccess(userToken, '1234/5678');
    await verifyCaseSubject(userToken, '1234/5678', 'subject name', '2000-01-01');

    expect(get).toHaveBeenCalledWith('/cases/cica/1234%2F5678/access');
    expect(post).toHaveBeenCalledWith('/cases/cica/1234%2F5678/subject-verifications', {
      subject_full_name: 'subject name',
      subject_date_of_birth: '2000-01-01',
    });
  });

  describe('updateCase', () => {
    const caseData = {
      additional_information: 'Further information',
      documents: [],
    };

    test('should submit the update to the case API using the citizen token', async () => {
      const mockPost = jest.fn().mockResolvedValue({ data: { id: caseId, data: caseData } });
      mockedAxios.create.mockReturnValue({ post: mockPost } as unknown as jest.Mocked<typeof axios>);
      mockedGetServiceAuthToken.mockResolvedValue(serviceAuthToken);

      const result = await updateCase(userToken, caseId, caseData);

      expect(mockedGetServiceAuthToken).toHaveBeenCalled();
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: config.get('services.sptribs.url'),
        headers: {
          Authorization: `Bearer ${userToken}`,
          ServiceAuthorization: serviceAuthToken,
          experimental: 'true',
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      });
      expect(mockPost).toHaveBeenCalledWith(`/cases/cica/${caseId}/updates`, caseData);
      expect(result).toEqual({ data: { id: caseId, data: caseData } });
    });

    test('should propagate update failures without retrying in the frontend', async () => {
      const mockPost = jest.fn().mockRejectedValue(new Error('Update error'));
      mockedAxios.create.mockReturnValue({ post: mockPost } as unknown as jest.Mocked<typeof axios>);
      mockedGetServiceAuthToken.mockResolvedValue(serviceAuthToken);

      await expect(updateCase(userToken, caseId, caseData)).rejects.toThrow('Update error');
      expect(mockPost).toHaveBeenCalledTimes(1);
    });
  });
});
