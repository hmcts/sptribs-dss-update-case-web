import languageAssertions from '../../../../test/unit/utils/languageAssertions';
import { CommonContent, generatePageContent } from '../../common/common.content';

import { cy, en, generateContent } from './content';

describe('dss-update > subject-details-error > content', () => {
  const commonContent = generatePageContent({
    language: 'en',
    userCase: {},
  }) as CommonContent;

  test('should return correct english content', () => {
    languageAssertions('en', en(), () => generateContent(commonContent));
    expect(generateContent(commonContent)).toEqual(expect.objectContaining(en()));
  });

  test('should return correct welsh content', () => {
    languageAssertions('cy', cy(), () => generateContent({ ...commonContent, language: 'cy' }));
    expect(generateContent({ ...commonContent, language: 'cy' })).toEqual(expect.objectContaining(cy()));
  });
});
