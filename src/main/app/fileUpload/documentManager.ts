//import https from 'https';

import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios';
import config from 'config';
import { Logger } from '../../../test/unit/mocks/hmcts/nodejs-logging';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const uploadDocument = async (formData, s2sToken, req) => {
  const logger = Logger.getLogger('documentManager');
  const CASE_API_URL: string = config.get('services.sptribs.url')
  const formHeaders = formData.getHeaders();

  const headers = {
    authorization: `Bearer ${req.session.user.accessToken}`,
    serviceAuthorization: s2sToken,
  };
  logger.info("Document Upload: Upload start");
  return uploadDocumentInstance(CASE_API_URL, headers).post(
    '/doc/dss-orchestration/upload?caseTypeOfApplication=CIC',
    formData,
    {
      headers: {
        ...formHeaders,
        serviceAuthorization: s2sToken,
      },
    }
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deleteDocument = async (s2sToken, documentID, req) => {
  const CASE_API_URL: string = config.get('services.sptribs.url')
  const deleteUrl = `/doc/dss-orchestration/${documentID}/delete`;
  const headers = {
    authorization: `Bearer ${req.session.user.accessToken}`,
    serviceAuthorization: s2sToken,
  };

  await uploadDocumentInstance(CASE_API_URL, headers).delete(deleteUrl);
};

function uploadDocumentInstance(baseUrl: string, header: RawAxiosRequestHeaders): AxiosInstance {
  return axios.create({
    baseURL: baseUrl,
    headers: header,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}
