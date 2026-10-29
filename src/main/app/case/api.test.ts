import axios from 'axios';
import config from 'config';

import { getSystemUser } from '../auth/oidc';
import { getServiceAuthToken } from '../s2s/get-service-auth-token';

import { getCase, updateCase } from './api';

jest.mock('axios');
jest.mock('../auth/oidc');
jest.mock('../s2s/get-service-auth-token');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedGetSystemUser = getSystemUser as jest.MockedFunction<typeof getSystemUser>;
const mockedGetServiceAuthToken = getServiceAuthToken as jest.MockedFunction<typeof getServiceAuthToken>;

describe('case-api', () => {
  const userToken = 'user-token';
  const serviceAuthToken = 'service-auth-token';
  const caseId = '1234567890123456';

  describe('getCase', () => {
    test('should make a GET request to /cases/:caseId', async () => {
      const mockData = { id: caseId, data: {} };
      const mockGet = jest.fn().mockResolvedValue({ data: mockData });
      mockedAxios.create.mockReturnValue({ get: mockGet } as unknown as jest.Mocked<typeof axios>);
      mockedGetSystemUser.mockResolvedValue({ accessToken: userToken } as any);
      mockedGetServiceAuthToken.mockResolvedValue(serviceAuthToken);

      const result = await getCase(caseId);

      expect(mockedGetSystemUser).toHaveBeenCalled();
      expect(mockedGetServiceAuthToken).toHaveBeenCalled();
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: expect.any(String),
        headers: {
          Authorization: `Bearer ${userToken}`,
          ServiceAuthorization: serviceAuthToken,
          experimental: 'true',
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      });
      expect(mockGet).toHaveBeenCalledWith(`/cases/${caseId}`);
      expect(result).toEqual({ data: mockData });
    });
  });

  describe('updateCase', () => {
    const caseData = {
      firstName: 'test',
      lastName: 'user',
    };
    const eventName = 'citizen-cic-dss-update-case';

    test('should send the event data to the CICA update endpoint without fetching a CCD token', async () => {
      const mockPost = jest.fn().mockResolvedValue({ data: { id: caseId, data: caseData } });
      const mockGet = jest.fn();
      mockedAxios.create.mockReturnValue({ get: mockGet, post: mockPost } as unknown as jest.Mocked<typeof axios>);
      mockedGetServiceAuthToken.mockResolvedValue(serviceAuthToken);

      const result = await updateCase(userToken, caseId, caseData);

      expect(mockedGetServiceAuthToken).toHaveBeenCalled();
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: expect.any(String),
        headers: {
          Authorization: `Bearer ${userToken}`,
          ServiceAuthorization: serviceAuthToken,
          experimental: 'true',
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      });
      expect(mockGet).not.toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith(`${config.get('services.sptribs.url')}/cases/cica/${caseId}/updates`, {
        event: { id: eventName },
        data: caseData,
      });
      expect(result).toEqual({ data: { id: caseId, data: caseData } });
    });

    test('should propagate a failed update request', async () => {
      const mockPost = jest.fn().mockRejectedValue(new Error('Update error'));
      mockedAxios.create.mockReturnValue({ post: mockPost } as unknown as jest.Mocked<typeof axios>);
      mockedGetServiceAuthToken.mockResolvedValue(serviceAuthToken);

      await expect(updateCase(userToken, caseId, caseData)).rejects.toThrow('Update error');
    });
  });
});
