import { mockRequest } from '../../test/unit/utils/mockRequest';
import { AppRequest } from '../app/controller/AppRequest';

import { Step } from './constants';
import { dss_update_steps } from './dss-update/dss-sequence';
import { CASE_SEARCH_URL, DATA_VERIFICATION } from './urls';

import { getNextStepUrl, getPathAndQueryStringFromUrl } from './index';

jest.mock('./dss-update/dss-sequence', () => ({
  dss_update_steps: [
    {
      url: '/current-step',
      getNextStep: jest.fn(),
      sanitizeQueryString: jest.fn(),
    },
  ],
}));

describe('Steps', () => {
  describe('getPathAndQueryStringFromUrl()', () => {
    it('returns the path and an empty query string when there are no parameters', () => {
      expect(getPathAndQueryStringFromUrl(DATA_VERIFICATION)).toEqual({
        path: DATA_VERIFICATION,
        queryString: '',
      });
    });

    it('separates the path from its query string', () => {
      expect(getPathAndQueryStringFromUrl(`${DATA_VERIFICATION}?caseId=123&flag`)).toEqual({
        path: DATA_VERIFICATION,
        queryString: '?caseId=123&flag',
      });
    });
  });

  describe('getNextStepUrl()', () => {
    let mockReq: AppRequest;
    const step = dss_update_steps[0] as jest.Mocked<Step>;
    const sanitizeQueryString = jest.mocked(step.sanitizeQueryString!);

    beforeEach(() => {
      jest.clearAllMocks();
      mockReq = mockRequest();
      mockReq.route = { path: step.url };
      mockReq.originalUrl = step.url;
      step.getNextStep.mockReturnValue(DATA_VERIFICATION);
      sanitizeQueryString.mockImplementation((_from, _to, query) => query);
    });

    it('returns the next step without adding an empty query string', () => {
      const data = {};

      expect(getNextStepUrl(mockReq, data)).toBe(DATA_VERIFICATION);
      expect(step.getNextStep).toHaveBeenCalledWith(data, mockReq);
    });

    it('merges current and destination parameters, preferring destination values', () => {
      mockReq.originalUrl = `${step.url}?shared=original&keep=1`;
      step.getNextStep.mockReturnValue(`${DATA_VERIFICATION}?shared=destination&added=2`);

      expect(getNextStepUrl(mockReq, {})).toBe(`${DATA_VERIFICATION}?added=2&keep=1&shared=destination`);
    });

    it.each([
      ['duplicate parameters', 'tag=first&tag=second', 'tag=first&tag=second'],
      ['empty values and bare flags', 'flag&empty=', 'empty=&flag'],
      ['Unicode and encoded characters', 'value=caf%C3%A9%20%26%20tea', 'value=caf%C3%A9%20%26%20tea'],
      ['plus signs used as spaces', 'value=hello+world', 'value=hello%20world'],
      ['encoded percent signs', 'value=%25', 'value=%25'],
      ['malformed percent encoding', 'value=%E0%A4%A', 'value=%25E0%25A4%25A'],
    ])('preserves query handling for %s', (_description, input, expected) => {
      mockReq.originalUrl = `${step.url}?${input}`;

      expect(getNextStepUrl(mockReq, {})).toBe(`${DATA_VERIFICATION}?${expected}`);
    });

    it('sanitises the merged parameters before building the next URL', () => {
      mockReq.originalUrl = `${step.url}?keep=1&internal=2`;
      step.getNextStep.mockReturnValue(`${DATA_VERIFICATION}?added=3`);
      sanitizeQueryString.mockImplementation((_from, _to, query) => ({ keep: query.keep }));

      expect(getNextStepUrl(mockReq, {})).toBe(`${DATA_VERIFICATION}?keep=1`);
      expect(sanitizeQueryString).toHaveBeenCalledWith(step.url, DATA_VERIFICATION, {
        added: '3',
        internal: '2',
        keep: '1',
      });
    });

    it('falls back to case search for an unknown step, preserving query parameters', () => {
      mockReq.route.path = '/unknown-step';
      mockReq.originalUrl = '/unknown-step?caseId=123';

      expect(getNextStepUrl(mockReq, {})).toBe(`${CASE_SEARCH_URL}?caseId=123`);
      expect(step.sanitizeQueryString).not.toHaveBeenCalled();
    });

    it('returns case search without query parameters when saving a draft', () => {
      mockReq = mockRequest({ body: { saveAsDraft: true } });
      mockReq.originalUrl = `${step.url}?caseId=123`;

      expect(getNextStepUrl(mockReq, {})).toBe(CASE_SEARCH_URL);
      expect(step.getNextStep).not.toHaveBeenCalled();
    });
  });
});
