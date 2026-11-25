import { cy, en } from './content';

const enContent = {
  serviceName: 'Update an appeal to the First-tier Tribunal',
  title: 'Existing appeal details',
  line1: 'You can find this information in the email you received after submitting your tribunal forms.',
  subtitle: 'HMCTS reference number',
  caseNumberHint:
    'This number will be 16 digits long. It should not include spaces or any of these characters: - * (  )  &  !  /  ;',
  errorSummaryMessage: 'There is a problem',
  errors: {
    applicantCaseId: {
      required: 'Enter your HMCTS reference number',
      containsMarkdownLink: 'HMCTS number must not include a link',
      containsInvalidCharacters: 'HMCTS reference number must not include HTML',
      invalidCaseReference: 'HMCTS reference number must be 16 digits long',
    },
  },
};

const cyContent = {
  serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
  title: 'Manylion apêl presennol',
  line1: "Gallwch ddod o hyd i'r wybodaeth hon yn yr e-bost a gawsoch ar ôl cyflwyno eich ffurflenni tribiwnlys.",
  subtitle: 'Cyfeirnod GLlTEF',
  caseNumberHint:
    "Bydd y rhif hwn yn cynnwys 16 digid. Ni ddylai gynnwys bylchau neu unrhyw un o'r nodau canlynol: - * (  )  &  !  /  ;",
  errorSummaryMessage: 'Mae yna broblem',
  errors: {
    applicantCaseId: {
      required: 'Nodwch eich cyfeirnod GLlTEF',
      containsMarkdownLink: 'Ni ddylai’r rhif GLlTEF gynnwys dolen',
      containsInvalidCharacters: 'Ni ddylai cyfeirnod GLlTEF gynnwys HTML',
      invalidCaseReference: 'Rhaid i gyfeirnod GLlTEF fod yn 16 digid o hyd',
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
