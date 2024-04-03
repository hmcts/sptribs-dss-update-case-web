import axios from 'axios';
import config from 'config';

import { getSystemUser } from '../auth/oidc';
import { AppRequest } from '../controller/AppRequest';
import { AnyObject } from '../controller/PostController';
import { getServiceAuthToken } from '../s2s/get-service-auth-token';

export const getCase = async (req: AppRequest<AnyObject>, caseId: string) => {
  const baseURL = `${config.get('services.case.url')}/cases/${caseId}`;
  const s2sToken = await getServiceAuthToken();
  const systemUserDetails = await getSystemUser();

  return axios.get(baseURL, {
    headers: {
      Authorization: 'Bearer ' + systemUserDetails.accessToken,
      ServiceAuthorization: `Bearer ${s2sToken}`,
      experimental: 'true',
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });
};
