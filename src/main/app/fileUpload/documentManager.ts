//import https from 'https';

import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios';
import config from 'config';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const uploadDocument = async (formData, s2sToken, req) => {
  const CASE_API_URL: string = config.get('services.case.url');
  const formHeaders = formData.getHeaders();

  const headers = {
    Authorization: `Bearer ${req.session.user.accessToken}`,
    ServiceAuthorization: s2sToken,
  };
  return uploadDocumentInstance(CASE_API_URL, headers).post(
    '/case-documents',
    formData,
    {
      headers: {
        ...formHeaders,
        ServiceAuthorization: s2sToken,
      },
    }
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deleteDocument = async (s2sToken, documentID, req) => {
  const CASE_API_URL: string = config.get('services.case.url');
  const deleteUrl = `/case-documents/${documentID}`;
  const headers = {
    Authorization: `Bearer ${req.session.user.accessToken}`,
    ServiceAuthorization: s2sToken,
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
