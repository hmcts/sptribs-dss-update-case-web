import axios, { AxiosRequestHeaders, AxiosResponse, AxiosStatic } from 'axios';
import * as jwtDecode from 'jwt-decode';

import { CALLBACK_URL } from '../../steps/urls';
import { UserDetails } from '../controller/AppRequest';

import { OidcResponse, getRedirectUrl, getSystemUser, getUserDetails } from './oidc';

const config = require('config');

jest.mock('config');

jest.mock('axios');
const mockedConfig = config as jest.Mocked<typeof config>;
const mockedAxios = axios as jest.Mocked<AxiosStatic>;
jest.spyOn(jwtDecode, 'jwtDecode').mockImplementation((argument: string) => {
  if (argument === 'token') {
    return {
      accessToken: 'token',
      sub: 'test@test.com',
      given_name: 'John',
      family_name: 'Dorian',
      uid: '123',
      roles: ['citizen'],
    };
  } else if (argument === 'systemUserTestToken') {
    return {
      accessToken: 'token',
      sub: 'test@test.com',
      given_name: 'John',
      family_name: 'Dorian',
      uid: '123',
      roles: ['caseworker-sptribs-systemupdate', 'caseworker-st_cic-caseworker'],
    };
  }
});

describe('getRedirectUrl', () => {
  test('should create a valid URL to redirect to the login screen', () => {
    mockedConfig.get.mockReturnValueOnce('sptribs-dss-update-case-web');
    mockedConfig.get.mockReturnValueOnce('https://idam-web-public.aat.platform.hmcts.net/login');

    expect(getRedirectUrl('http://localhost', CALLBACK_URL)).toBe(
      'https://idam-web-public.aat.platform.hmcts.net/login?client_id=sptribs-dss-update-case-web&response_type=code&redirect_uri=http://localhost/receiver'
    );
  });
});

describe('getUserDetails', () => {
  test('should exchange a code for a token and decode a JWT to get the user details', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        access_token: 'token',
        id_token: 'token',
      },
    });

    const result = await getUserDetails('http://localhost', '123', CALLBACK_URL);
    expect(result).toStrictEqual({
      accessToken: 'token',
      email: 'test@test.com',
      givenName: 'John',
      familyName: 'Dorian',
      id: '123',
      roles: ['citizen'],
    });
  });
});

describe('getSystemUser', () => {
  const accessTokenResponse: AxiosResponse<OidcResponse> = {
    status: 200,
    data: {
      id_token: 'systemUserTestToken',
      access_token: 'systemUserTestToken',
    },
    statusText: 'wsssw',
    headers: { test: 'now' },
    config: { headers: [] as unknown as AxiosRequestHeaders },
  };

  const expectedGetSystemUserResponse: UserDetails = {
    accessToken: 'systemUserTestToken',
    email: 'test@test.com',
    givenName: 'John',
    familyName: 'Dorian',
    id: '123',
    roles: ['caseworker-sptribs-systemupdate', 'caseworker-st_cic-caseworker'],
  };

  test('Cache enabled', async () => {
    mockedConfig.get.mockReturnValueOnce('user');
    mockedConfig.get.mockReturnValueOnce('password');
    mockedConfig.get.mockReturnValueOnce('true');
    mockedAxios.post.mockResolvedValue(accessTokenResponse);

    const result = await getSystemUser();
    expect(result).toStrictEqual(expectedGetSystemUserResponse);
  });

  test('Cache disabled', async () => {
    mockedConfig.get.mockReturnValueOnce('user');
    mockedConfig.get.mockReturnValueOnce('password');
    mockedConfig.get.mockReturnValue('false');
    mockedConfig.get.mockReturnValue('clientID');
    mockedConfig.get.mockReturnValue('clientSecret');
    mockedConfig.get.mockReturnValueOnce('https://idam-web-public.aat.platform.hmcts.net/loginwddwdw');
    mockedAxios.post.mockResolvedValue(accessTokenResponse);

    const result = await getSystemUser();
    expect(result).toStrictEqual(expectedGetSystemUserResponse);
  });
});
