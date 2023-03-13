import { APPLICATION_CONFIRMATION, CASE_SEARCH_URL, DATA_VERIFICATION, START_HOME } from '../urls';

import { edgeCase_Sequence } from './edgecase-sequence';

describe('Sequence must match respective path', () => {
  test('must match the path', () => {
    expect(edgeCase_Sequence).toHaveLength(5);

    expect(edgeCase_Sequence[0].url).toBe(START_HOME);
    expect(edgeCase_Sequence[0].getNextStep({})).toBe(CASE_SEARCH_URL);

    expect(edgeCase_Sequence[1].url).toBe(CASE_SEARCH_URL);
    expect(edgeCase_Sequence[1].getNextStep({})).toBe(DATA_VERIFICATION);

    expect(edgeCase_Sequence[2].url).toBe(DATA_VERIFICATION);
    expect(edgeCase_Sequence[2].getNextStep({})).toBe(APPLICATION_CONFIRMATION);
  });
});