import { AppRequest } from '../controller/AppRequest';
import { AnyObject } from '../controller/PostController';
import config from 'config';
import { RpeApi } from '../s2s/rpeAuth';
import { getSystemUser } from '../auth/oidc';
import axios from 'axios';

export const getCase = async (req: AppRequest<AnyObject>) => {
  const baseURL = `${config.get('services.case.url')}/cases/${req.body.applicantCaseId}`;
  const serviceAuthToken = await RpeApi.getRpeToken();
  const systemUserDetails = await getSystemUser();
  const s2sToken = serviceAuthToken.data;

  return axios.get(baseURL, {
    headers: {
      Authorization: 'Bearer ' + systemUserDetails.accessToken,
      ServiceAuthorization: `Bearer ${s2sToken}`,
      experimental: 'true',
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });
}
