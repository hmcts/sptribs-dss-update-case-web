import axios from 'axios';
import config from 'config';

import { getSystemUser } from '../auth/oidc';
import { AppRequest } from '../controller/AppRequest';
import { AnyObject } from '../controller/PostController';
import { getServiceAuthToken } from '../s2s/get-service-auth-token';
import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('case-api');
const serviceUrl = config.get('services.case.url');

export const getCase = async (req: AppRequest<AnyObject>, caseId: string) => {
  const s2sToken = await getServiceAuthToken();
  const systemUserDetails = await getSystemUser();

  return axios.get(`${serviceUrl}/cases/${caseId}`, getHeaders(systemUserDetails.accessToken, s2sToken));
};

export const updateCase = async (
  userToken: string,
  caseId: string,
  caseData: Record<string, unknown>
) => {
  const eventName = 'citizen-cic-dss-update-case';
  const s2sToken = await getServiceAuthToken();
  const headers = getHeaders(userToken, s2sToken);
  const token = await getEventToken(s2sToken, userToken, caseId, eventName);
  const data = {
    event: { id: eventName },
    data: caseData,
    event_token: token,
  };

  return axios.post(`${serviceUrl}/cases/${caseId}/events`, data, headers);
};

const getEventToken = async (
  s2sToken: string,
  userToken: string,
  caseId: string,
  eventName: string
): Promise<string> => {
  try {
    const url = `${serviceUrl}/cases/${caseId}/event-triggers/${eventName}`;
    const response = await axios.get(url, getHeaders(userToken, s2sToken));

    return response.data.token;
  } catch (err) {
    logger.error(`Error getting event token: ${err}`);
    logger.error(err.response?.data || err.message || 'Unknown error');
    
    throw err;
  }
};

const getHeaders = (userToken: string, s2sToken: string) => {
  return { 
    headers:{
      Authorization: `Bearer ${userToken}`,
      ServiceAuthorization: `${s2sToken}`,
      experimental: 'true',
      Accept: '*/*',
      'Content-Type': 'application/json',
    }
  };
};