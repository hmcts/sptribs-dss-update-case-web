import { Logger } from '@hmcts/nodejs-logging';
import axios, { AxiosResponse } from 'axios';
import config from 'config';
import { authenticator } from 'otplib';

const logger = Logger.getLogger('service-auth-token');

export const getServiceAuthToken = async (): Promise<string> => {
  logger.info('Refreshing service auth token');

  const url: string = config.get('services.authProvider.url') + '/lease';
  const microservice: string = config.get('services.authProvider.microservice');
  const secret: string = config.get('services.authProvider.secret');
  const oneTimePassword = authenticator.generate(secret);
  const body = { microservice, oneTimePassword };

  try {
    const response: AxiosResponse = await axios.post(url, body);
    return response.data;
  } catch (err) {
    logger.error(err.response?.status, err.response?.data);
    return '';
  }
};
