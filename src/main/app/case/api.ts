import axios, { AxiosInstance } from 'axios';
import config from 'config';

import { getSystemUser } from '../auth/oidc';
import { AppRequest } from '../controller/AppRequest';
import { AnyObject } from '../controller/PostController';
import { getServiceAuthToken } from '../s2s/get-service-auth-token';
import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('case-api');

export const getCase = async (req: AppRequest<AnyObject>, caseId: string) => {
  const s2sToken = await getServiceAuthToken();
  const systemUserDetails = await getSystemUser();
  const client = getClient(systemUserDetails.accessToken, s2sToken);

  return client.get(`/cases/${caseId}`);
};

export const updateCase = async (
  userToken: string,
  caseId: string,
  caseData: Record<string, unknown>
) => {
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

const getEventToken = async (
  client: AxiosInstance,
  caseId: string,
  eventName: string
): Promise<string> => {
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
