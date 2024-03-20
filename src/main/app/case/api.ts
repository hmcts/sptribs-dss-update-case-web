import axios from 'axios';
import config from 'config';

import { getSystemUser } from '../auth/oidc';
import { AppRequest } from '../controller/AppRequest';
import { AnyObject } from '../controller/PostController';
import { RpeApi } from '../s2s/rpeAuth';

export const getCase = async (req: AppRequest<AnyObject>, caseId: string) => {
  const baseURL = `${config.get('services.case.url')}/cases/${caseId}`;
  const serviceAuthToken = await RpeApi.getRpeToken();
  const systemUserDetails = await getSystemUser();
  const s2sToken = serviceAuthToken.data;

  return axios.get(baseURL, {
    headers: {
      Authorization: 'Bearer ' + systemUserDetails.accessToken,
      ServiceAuthorization: `Bearer ${s2sToken}`,
      experimental: 'true',
      Accept: '*/*',
      'Content-Type': 'application/json'
    },
  });
};
