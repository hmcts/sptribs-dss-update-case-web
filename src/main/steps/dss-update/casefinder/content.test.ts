/* eslint-disable @typescript-eslint/no-unused-vars */
import { cy, en } from './content';

const enContent = {
  serviceName: 'Update an existing First-tier Tribunal case',
  title: 'Existing case details',
  line1: 'You can find this information in the email you received after submitting your tribunal forms.',
  subtitle: 'Case reference number',
  caseNumberHint: 'This number will be 16 digits long.',
  errorSummaryMessage: 'There is a problem',
  errors: {
    applicantCaseId: {
      required: 'Please enter a reference number',
      invalid: 'Please enter a valid reference number',
    },
  },
};

const cyContent = {
  serviceName: 'Update an existing First-tier Tribunal case - welsh',
  title: 'Existing case details - welsh',
  line1:
    'You can find this information in the email you received after submitting your tribunal forms. - welsh',
  subtitle: 'Case reference number - welsh',
  caseNumberHint: 'This number will be 16 digits long - welsh.',
  errorSummaryMessage: 'There is a problem - welsh',
  errors: {
    applicantCaseId: {
      required: 'Please enter a reference number - welsh',
      invalid: 'Please enter a valid reference number - welsh',
    },
  },
};

/* eslint-disable @typescript-eslint/ban-types */
describe('match respective translations', () => {
  // eslint-disable-next-line jest/expect-expect
  test('should return correct english content', () => {
    expect(en()).toEqual(enContent);
  });

  test('should return correct welsh content', () => {
    expect(cy()).toEqual(cyContent);
  });
});
