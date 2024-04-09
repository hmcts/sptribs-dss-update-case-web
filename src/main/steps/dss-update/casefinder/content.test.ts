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
  serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
  title: 'Manylion achos sy’n bodoli’n barod',
  line1:
    'Gallwch ddod o hyd i\'r wybodaeth hon yn yr e-bost a gawsoch ar ôl cyflwyno eich ffurflenni tribiwnlys.',
  subtitle: 'Cyfeirnod yr achos',
  caseNumberHint: 'Bydd y rhif hwn yn cynnwys 16 digid. It should not include spaces or any of these characters: - * (  )  &  !  /  ; - welsh.',
  errorSummaryMessage: 'Mae yna broblem',
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
