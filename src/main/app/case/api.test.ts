import axios from 'axios';

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
      baseURL: expect.any(String),
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
      baseURL: expect.any(String),
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

  test('encodes case references in both case-api paths', async () => {
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

  test('submits using the citizen token and CCD event token', async () => {
    const post = jest.fn().mockResolvedValue({ status: 201 });
    const get = jest.fn().mockResolvedValue({ data: { token: 'event-token' } });
    mockedAxios.create.mockReturnValue({ post, get } as unknown as jest.Mocked<typeof axios>);

    expect(await updateCase(userToken, caseId, { firstName: 'test' })).toEqual({ status: 201 });
    expect(get).toHaveBeenCalledWith(`/cases/${caseId}/event-triggers/citizen-cic-dss-update-case`);
    expect(post).toHaveBeenCalledWith(`/cases/${caseId}/events`, {
      event: { id: 'citizen-cic-dss-update-case' },
      data: { firstName: 'test' },
      event_token: 'event-token',
    });
  });

  test('propagates a failed CCD event-token request', async () => {
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockRejectedValue(new Error('Event token error')),
    } as unknown as jest.Mocked<typeof axios>);
    await expect(updateCase(userToken, caseId, {})).rejects.toThrow('Event token error');
  });
});
