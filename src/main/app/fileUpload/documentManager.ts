//import https from 'https';

import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios';
import config from 'config';

export enum DOCUMENT_MANAGEMENT_CONFIGURATIONS {
  UPLOAD_URL = '/doc/dss-orchestration/upload?caseTypeOfApplication=CIC',
  REMOVE_URL = '/doc/dss-orhestration/{documentId}/delete',
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const uploadDocument = async (formData, s2sToken, req) => {
  const CASE_API_URL: string = config.get('services.sptribs.url')
  const formHeaders = formData.getHeaders();

  const headers = {
    authorization: `Bearer ${req.session.user.accessToken}`,
    serviceAuthorization: s2sToken,
  };
  return uploadDocumentInstance(CASE_API_URL, headers).post(
    DOCUMENT_MANAGEMENT_CONFIGURATIONS.UPLOAD_URL,
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
