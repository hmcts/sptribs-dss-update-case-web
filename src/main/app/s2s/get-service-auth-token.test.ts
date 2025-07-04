jest.mock('axios');
jest.mock('@hmcts/nodejs-logging');
jest.useFakeTimers();

import { Logger } from '@hmcts/nodejs-logging';
import axios from 'axios';

import { AnyType } from '../form/validation';

const logger = {
  info: jest.fn(),
  error: jest.fn(),
};

(Logger.getLogger as jest.Mock).mockReturnValue(logger);

import { getServiceAuthToken } from './get-service-auth-token';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getServiceAuthToken', () => {
  test('Should call api with correct data when fetching a token', () => {
    mockedAxios.post.mockResolvedValue('token');

    getServiceAuthToken();

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal/lease',
      {
        microservice: 'sptribs_case_api',
        oneTimePassword: expect.any(String),
      }
    );
  });

  test('Should return a token', async () => {
    mockedAxios.post.mockResolvedValue({ data: 'token' } as unknown as Promise<AnyType>);

    const response = await getServiceAuthToken();

    expect(response).not.toBeUndefined();
    expect(response).toEqual('token');
  });

  test('Token should not be populated in event of error', async () => {
    mockedAxios.post.mockRejectedValue({ response: { status: 500, data: 'Error' } });

    const response = await getServiceAuthToken();

    expect(response).not.toBeUndefined();
    expect(response).toEqual('');
  });
});
