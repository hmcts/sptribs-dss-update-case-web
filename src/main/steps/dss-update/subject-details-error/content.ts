import { TranslationFn } from '../../../app/controller/GetController';
import { FormContent } from '../../../app/form/Form';

export const en = () => ({
  title: 'You are not authorised to view this appeal',
  heading: 'You are not authorised to view this appeal',
  line1: 'The name or date of birth entered does not match our records. This might be because:',
  bullet1: 'the appeal belongs to someone else',
  bullet2:
    "you are not using the name and date of birth provided when the appeal was registered. If you are a representative, ensure you're using the name and date of birth for the person who the appeal is about",
  line2: 'You can try another name or date of birth or contact support if you think this is a mistake.',
  tryAnotherDetails: 'Try another name or date of birth',
  contactSupport: 'Contact support',
  back: 'Back',
});

export const cy = () => ({
  title: 'Nid oes gennych awdurdod i weld yr apêl hon',
  heading: 'Nid oes gennych awdurdod i weld yr apêl hon',
  line1: "Nid yw’r enw na'r dyddiad geni a roddwyd gennych yr un fath â’n cofnodion ni. Gallai hyn fod oherwydd:",
  bullet1: "mae'r apêl yn perthyn i rywun arall",
  bullet2:
    "nid ydych yn defnyddio'r enw a'r dyddiad geni a ddarparwyd pan gofrestrwyd yr apêl. Os ydych chi'n gynrychiolydd, gwnewch yn siŵr eich bod chi'n defnyddio'r enw a'r dyddiad geni ar gyfer yr unigolyn y mae'r apêl yn ymwneud ag ef.",
  line2:
    "Gallwch geisio defnyddio enw neu ddyddiad geni arall neu gysylltu â'r adran gymorth os ydych chi'n meddwl bod hwn yn gamgymeriad",
  tryAnotherDetails: 'Rhowch gynnig ar nodi enw a dyddiad geni gwahanol',
  contactSupport: 'Cysylltu â’r adran gymorth',
  back: 'Yn ôl',
});

export const form: FormContent = {
  fields: {},
  submit: {
    text: l => l.onlyContinue,
  },
};

const languages = { en, cy };

export const generateContent: TranslationFn = content => {
  const translations = languages[content.language]();
  return {
    ...translations,
    form,
  };
};
