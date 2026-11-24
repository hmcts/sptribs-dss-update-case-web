import languageAssertions from '../../../../test/unit/utils/languageAssertions';
import { CommonContent, generatePageContent } from '../../common/common.content';

import { cy, en, generateContent } from './content';

jest.mock('../../../app/form/validation');

describe('dss-update > case-not-found > content', () => {
  const commonContent = generatePageContent({
    language: 'en',
    userCase: { applicantCaseId: '1234567890123456' },
  }) as CommonContent;

  test('should return correct english content', () => {
    languageAssertions('en', en(), () => generateContent(commonContent));
    expect(generateContent(commonContent)).toEqual(expect.objectContaining(en()));
  });

  test('should return correct welsh content', () => {
    languageAssertions('cy', cy(), () => generateContent({ ...commonContent, language: 'cy' }));
    expect(generateContent({ ...commonContent, language: 'cy' })).toEqual(expect.objectContaining(cy()));
  });

  test('should include the entered reference number in line1', () => {
    const generated = generateContent(commonContent);
    expect(generated.line1).toBe(
      'The reference number you entered (1234567890123456) does not match any appeal in our records.'
    );
  });
});
