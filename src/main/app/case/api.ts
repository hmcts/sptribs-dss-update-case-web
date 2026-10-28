import { Logger } from '@hmcts/nodejs-logging';
import axios, { AxiosInstance } from 'axios';
import config from 'config';

import { getServiceAuthToken } from '../s2s/get-service-auth-token';

const logger = Logger.getLogger('case-api');

export const checkCaseAccess = async (userToken: string, caseId: string) => {
  const s2sToken = await getServiceAuthToken();
  const client = getVerificationClient(userToken, s2sToken);

  return client.get(`/cases/cica/${encodeURIComponent(caseId)}/access`);
};

export const verifyCaseSubject = async (userToken: string, caseId: string, name: string, dob: string) => {
  const client = getVerificationClient(userToken, await getServiceAuthToken());

  return client.post<{ verified: boolean }>(`/cases/cica/${encodeURIComponent(caseId)}/subject-verifications`, {
    subject_full_name: name,
    subject_date_of_birth: dob,
  });
};

const getVerificationClient = (userToken: string, s2sToken: string) => {
  return axios.create({
    baseURL: config.get('services.sptribs.url'),
    headers: {
      Authorization: `Bearer ${userToken}`,
      ServiceAuthorization: s2sToken,
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });
};

export const updateCase = async (userToken: string, caseId: string, caseData: Record<string, unknown>) => {
  const client = getClient(userToken, await getServiceAuthToken());
  const eventName = 'citizen-cic-dss-update-case';
  const token = await getEventToken(client, caseId, eventName);
  const data = {
    event: { id: eventName },
    data: caseData,
    event_token: token,
  };

  return client.post(`/cases/${caseId}/events`, data);
};

const getEventToken = async (client: AxiosInstance, caseId: string, eventName: string): Promise<string> => {
  try {
    const response = await client.get(`/cases/${caseId}/event-triggers/${eventName}`);

    return response.data.token;
  } catch (err) {
    logger.error(`Error getting event token: ${err}`);
    logger.error(err.response?.data || err.message || 'Unknown error');

    throw err;
  }
};

const getClient = (userToken: string, s2sToken: string) => {
  return axios.create({
    baseURL: config.get('services.case.url'),
    headers: {
      Authorization: `Bearer ${userToken}`,
      ServiceAuthorization: `${s2sToken}`,
      experimental: 'true',
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });
};
