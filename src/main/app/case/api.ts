import axios from 'axios';
import config from 'config';

import { getSystemUser } from '../auth/oidc';
import { getServiceAuthToken } from '../s2s/get-service-auth-token';

export const getCase = async (caseId: string) => {
  const s2sToken = await getServiceAuthToken();
  const systemUserDetails = await getSystemUser();
  const client = getClient(systemUserDetails.accessToken, s2sToken);

  return client.get(`/cases/${caseId}`);
};

export const updateCase = async (userToken: string, caseId: string, caseData: Record<string, unknown>) => {
  const client = getClient(userToken, await getServiceAuthToken());
  const eventName = 'citizen-cic-dss-update-case';
  const data = {
    event: { id: eventName },
    data: caseData,
  };

  return client.post(`${config.get('services.sptribs.url')}/cases/cica/${caseId}/updates`, data);
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
