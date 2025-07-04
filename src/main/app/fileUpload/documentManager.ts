
import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios';
import config from 'config';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const uploadDocument = async (formData, s2sToken, req) => {
  formData.append('caseTypeId', config.get('caseType'));
  formData.append('jurisdictionId', config.get('jurisdiction'));
  formData.append('classification', 'PUBLIC');

  const headers = {
    authorization: `Bearer ${req.session.user.accessToken}`,
    serviceAuthorization: s2sToken,
    'user-id': req.session.user.id,
    ...formData.getHeaders()
  };

  return uploadDocumentInstance(headers).post('/cases/documents', formData);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-token
export const deleteDocument = async (s2sToken, documentID, req) => {
  const deleteUrl = `/cases/documents/${documentID}`;
  const headers = {
    authorization: `Bearer ${req.session.user.accessToken}`,
    serviceAuthorization: s2sToken,
    'user-id': req.session.user.id
  };

  await uploadDocumentInstance(headers).delete(deleteUrl);
};

function uploadDocumentInstance(header: RawAxiosRequestHeaders): AxiosInstance {
  return axios.create({
    baseURL: config.get('services.cdam.url'),
    headers: header,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
}
