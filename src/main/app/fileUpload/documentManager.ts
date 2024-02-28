//import https from 'https';

import { getServiceAuthToken } from '../../app/auth/service/get-service-auth-token';
import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios';
import config from 'config';

export enum DOCUMENT_MANAGEMENT_CONFIGURATIONS {
  UPLOAD_URL = '/doc/dss-orhestration/upload?caseTypeOfApplication=CIC',
  REMOVE_URL = '/doc/dss-orhestration/{documentId}/delete',
}

export const CASE_API_URL: string = config.get('services.sptribs.url');
export const UPLOAD_URL: string = '/doc/dss-orhestration/upload?caseTypeOfApplication=CIC';
export const DELETE_URL: string = '/doc/dss-orhestration/{documentId}/delete';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const uploadDocument = async (formData, s2sToken, req) => {
  // const baseURL = config.get('services.sptribs.url') + DOCUMENT_MANAGEMENT_CONFIGURATIONS.UPLOAD_URL;
  // const response = await axios.post(baseURL, formData, {
  //   headers: {
  //     ServiceAuthorization: `Bearer ${s2sToken}`,
  //     ...formData.getHeaders(),
  //   },
  //   // httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  //   maxContentLength: Infinity,
  //   maxBodyLength: Infinity,
  // });
  // return response;

  // const headers = {
  //   authorization: `Bearer ${req.session.user['accessToken']}`,
  //   serviceAuthorization: getServiceAuthToken(),
  // };
  const headers = {
    authorization: `Bearer ${s2sToken}`,
    serviceAuthorization: getServiceAuthToken(),
  }

  const formHeaders = formData.getHeaders();

  return uploadDocumentInstance(CASE_API_URL, headers).post(
    UPLOAD_URL,
    formData,
    {
      headers: {
        ...formHeaders,
        serviceAuthorization: getServiceAuthToken(),
      },
    }
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deleteDocument = async (s2sToken, documentID) => {
  const doucmentRemovalendpoint =
    config.get('services.sptribs.url') +
    DOCUMENT_MANAGEMENT_CONFIGURATIONS.REMOVE_URL.split('{documentId}').join(documentID);
  const response = await axios.delete(doucmentRemovalendpoint, {
    headers: {
      ServiceAuthorization: `Bearer ${s2sToken}`,
    },
    data: {},
    // httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  });
  return response;
};

function uploadDocumentInstance(baseUrl: string, header: RawAxiosRequestHeaders): AxiosInstance {
  return axios.create({
    baseURL: baseUrl,
    headers: header,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}
