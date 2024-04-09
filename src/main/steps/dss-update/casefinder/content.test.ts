import { cy, en } from './content';

const enContent = {
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Existing case details',
  line1: 'You can find this information in the email you received after submitting your tribunal forms.',
  subtitle: 'Case reference number',
  caseNumberHint:
    'This number will be 16 digits long. It should not include spaces or any of these characters: - * (  )  &  !  /  ;',
  errorSummaryMessage: 'There is a problem',
  errors: {
    applicantCaseId: {
      required: 'Please enter a reference number',
      notNumeric:
        'Please enter a valid reference number. The reference number should not include spaces or any characters - * ( ) & ! /  ;',
      caseNotFound: 'Please enter a valid reference number',
    },
  },
};

const cyContent = {
  serviceName: 'Update an appeal to the First-tier Tribunal - welsh',
  title: 'Existing case details - welsh',
  line1: 'You can find this information in the email you received after submitting your tribunal forms. - welsh',
  subtitle: 'Case reference number - welsh',
  caseNumberHint:
    'This number will be 16 digits long. It should not include spaces or any of these characters: - * (  )  &  !  /  ; - welsh.',
  errorSummaryMessage: 'There is a problem - welsh',
  errors: {
    applicantCaseId: {
      required: 'Please enter a reference number - welsh',
      notNumeric:
        'Please enter a valid reference number. The reference number should not include spaces or any characters - * ( ) & ! /  ; - welsh',
      caseNotFound: 'Please enter a valid reference number - welsh',
    },
  },
};

describe('match respective translations', () => {
  test('should return correct english content', () => {
    expect(en()).toEqual(enContent);
  });

  test('should return correct welsh content', () => {
    expect(cy()).toEqual(cyContent);
  });
});
