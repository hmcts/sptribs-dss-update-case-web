import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import { mockLogger } from '../../../test/unit/mocks/hmcts/nodejs-logging';
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
    const eventToken = 'event-token';

    test('should make a POST request to /cases/:caseId/events', async () => {
      const mockPost = jest.fn().mockResolvedValue({ data: { id: caseId, data: caseData } });
      const mockGet = jest.fn().mockResolvedValue({ data: { token: eventToken } });
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
      expect(mockGet).toHaveBeenCalledWith(`/cases/${caseId}/event-triggers/${eventName}`);
      expect(mockPost).toHaveBeenCalledWith(`/cases/${caseId}/events`, {
        event: { id: eventName },
        data: caseData,
        event_token: eventToken,
      });
      expect(result).toEqual({ data: { id: caseId, data: caseData } });
    });

    test('should throw an error when getting event token fails', async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error('Event token error'));
      mockedAxios.create.mockReturnValue({ get: mockGet } as unknown as jest.Mocked<typeof axios>);
      mockedGetServiceAuthToken.mockResolvedValue(serviceAuthToken);

      await expect(updateCase(userToken, caseId, caseData)).rejects.toThrow('Event token error');
    });

    test('should preserve a forbidden response when requesting the event token', async () => {
      mockLogger.error.mockClear();
      const forbidden = Object.assign(new Error('Forbidden'), {
        response: { status: StatusCodes.FORBIDDEN, data: { message: 'Sensitive response details' } },
      });
      const mockGet = jest.fn().mockRejectedValue(forbidden);
      mockedAxios.create.mockReturnValue({ get: mockGet } as unknown as jest.Mocked<typeof axios>);
      mockedGetServiceAuthToken.mockResolvedValue(serviceAuthToken);

      await expect(updateCase(userToken, caseId, caseData)).rejects.toBe(forbidden);
      expect(mockLogger.error).toHaveBeenLastCalledWith('Forbidden');
    });

    test('should preserve a forbidden response when submitting the event', async () => {
      const forbidden = Object.assign(new Error('Forbidden'), { response: { status: StatusCodes.FORBIDDEN } });
      const mockGet = jest.fn().mockResolvedValue({ data: { token: eventToken } });
      const mockPost = jest.fn().mockRejectedValue(forbidden);
      mockedAxios.create.mockReturnValue({ get: mockGet, post: mockPost } as unknown as jest.Mocked<typeof axios>);
      mockedGetServiceAuthToken.mockResolvedValue(serviceAuthToken);

      await expect(updateCase(userToken, caseId, caseData)).rejects.toBe(forbidden);
    });
  });
});
