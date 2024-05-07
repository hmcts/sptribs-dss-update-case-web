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
      required: 'Enter a reference number',
      notNumeric:
        'Enter a valid reference number. The reference number should not include spaces or any characters - * ( ) & ! /  ;',
      caseNotFound: 'Enter a valid reference number',
    },
  },
};

const cyContent = {
  serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
  title: 'Manylion achos sy’n bodoli’n barod',
  line1: "Gallwch ddod o hyd i'r wybodaeth hon yn yr e-bost a gawsoch ar ôl cyflwyno eich ffurflenni tribiwnlys.",
  subtitle: 'Cyfeirnod yr achos',
  caseNumberHint:
    "Bydd y rhif hwn yn cynnwys 16 digid. Ni ddylai gynnwys bylchau neu unrhyw un o'r nodau canlynol: - * (  )  &  !  /  ;",
  errorSummaryMessage: 'Mae yna broblem',
  errors: {
    applicantCaseId: {
      required: 'Rhowch gyfeirnod',
      notNumeric:
        'Rhowch gyfeirnod dilys. Ni ddylai’r cyfeirnod gynnwys bylchau neu unrhyw un o’r nodau canlynol - * ( ) & ! /  ;',
      caseNotFound: 'Rhowch gyfeirnod dilys',
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
