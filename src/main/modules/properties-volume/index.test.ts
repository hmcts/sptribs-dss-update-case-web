import { Application } from 'express';
import lodash from 'lodash';

import { PropertiesVolume } from './index';

const propertiesVolume = new PropertiesVolume();
const setSpy = jest.spyOn(lodash, 'set');

describe('PropertiesVolume', () => {
  it('configures secrets for local development env', () => {
    const appMock = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
      use: jest.fn(),
      locals: {
        ENV: 'development',
        errorHandler: jest.fn(),
      },
    } as unknown as Application;

    propertiesVolume.enableFor(appMock);

    expect(setSpy).toHaveBeenCalledTimes(4);
  });
});
