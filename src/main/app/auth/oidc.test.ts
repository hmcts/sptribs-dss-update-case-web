import axios, { AxiosRequestHeaders, AxiosResponse, AxiosStatic } from 'axios';

import { CALLBACK_URL } from '../../steps/urls';
import { UserDetails } from '../controller/AppRequest';

import { OidcResponse, getRedirectUrl, getSystemUser, getUserDetails } from './oidc';

const config = require('config');

jest.mock('config');

jest.mock('axios');
const mockedConfig = config as jest.Mocked<typeof config>;
const mockedAxios = axios as jest.Mocked<AxiosStatic>;

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
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJmYW1pbHlfbmFtZSI6IkRvcmlhbiIsInVpZCI6IjEyMyIsInJvbGVzIjpbImNpdGl6ZW4iXX0.rxjx6XsSNNYavVppwKAqWiNWT_GxN4vjVzdLRe6q14I';

  test('should exchange a code for a token and decode a JWT to get the user details', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        access_token: token,
        id_token: token,
      },
    });

    const result = await getUserDetails('http://localhost', '123', CALLBACK_URL);
    expect(result).toStrictEqual({
      accessToken: token,
      email: 'test@test.com',
      givenName: 'John',
      familyName: 'Dorian',
      id: '123',
      roles: ['citizen'],
    });
  });
});

describe('getSystemUser', () => {
  const getSystemUserTestToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJmYW1pbHlfbmFtZSI6IkRvcmlhbiIsInVpZCI6IjEyMyIsInJvbGVzIjpbImNhc2V3b3JrZXItc3B0cmlicy1zeXN0ZW11cGRhdGUiLCJjYXNld29ya2VyLXN0X2NpYy1jYXNld29ya2VyIl19.2oMuSQ6eC_fS0Dwijs_UIRsKwZpvjJTk-nSG8WPfbaM';

  const accessTokenResponse: AxiosResponse<OidcResponse> = {
    status: 200,
    data: {
      id_token: getSystemUserTestToken,
      access_token: getSystemUserTestToken,
    },
    statusText: 'wsssw',
    headers: { test: 'now' },
    config: { headers: [] as unknown as AxiosRequestHeaders },
  };

  const expectedGetSystemUserResponse: UserDetails = {
    accessToken: getSystemUserTestToken,
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
