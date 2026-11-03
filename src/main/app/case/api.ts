import axios from 'axios';
import config from 'config';

import { getSystemUser } from '../auth/oidc';
import { getServiceAuthToken } from '../s2s/get-service-auth-token';

export interface CaseUpdate {
  additional_information: string | null;
  documents: {
    document_url: string;
    document_binary_url: string;
    document_filename: string;
    comment: string | null;
  }[];
}

export const getCase = async (caseId: string) => {
  const s2sToken = await getServiceAuthToken();
  const systemUserDetails = await getSystemUser();
  const client = getClient(systemUserDetails.accessToken, s2sToken);

  return client.get(`/cases/${caseId}`);
};

export const updateCase = async (userToken: string, caseId: string, caseData: CaseUpdate) => {
  const client = getClient(userToken, await getServiceAuthToken(), config.get('services.sptribs.url'));
  return client.post(`/cases/cica/${caseId}/updates`, caseData);
};

const getClient = (userToken: string, s2sToken: string, baseURL: string = config.get('services.case.url')) => {
  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${userToken}`,
      ServiceAuthorization: `${s2sToken}`,
      experimental: 'true',
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });
};
