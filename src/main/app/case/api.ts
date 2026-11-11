import axios from 'axios';
import config from 'config';

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
