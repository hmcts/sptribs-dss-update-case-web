import { TranslationFn } from '../../app/controller/GetController';

export const en = () => ({
  title: 'Cookies',
  paragraph1:
    'A cookie is a small piece of data that&rsquo;s stored on your computer, tablet, or phone when you visit a website. Most websites need cookies to work properly.',
  howAreCookiesUsedParagraph1: 'This service uses them to:',
  howAreCookiesUsedItem1: 'measure how you use the service so it can be updated and improved based on your needs',
  howAreCookiesUsedItem2: 'remember the notifications you&rsquo;ve seen so that you&rsquo;re not shown them again',
  howAreCookiesUsedItem3: 'temporarily store the answers you give',
  howAreCookiesUsedParagraph2:
    "Find out more about <a class='govuk-link' href='http://www.aboutcookies.org/'>how to manage cookies</a>.",
  howAreCookiesUsedHeading2: 'How cookies are used in this service',
  websiteUsageCookiesHeading3: 'To measure website usage',
  websiteUsageCookiesParagraph1:
    'We use Google Analytics software to collect information about how you use this service. We do this to help make sure the service is meeting the needs of its users and to help us make improvements, for example improving site search.',
  websiteUsageCookiesParagraph2: 'Google Analytics stores information about:',
  websiteUsageCookiesItem1: 'the pages you visit',
  websiteUsageCookiesItem2: 'how long you spend on each page',
  websiteUsageCookiesItem3: 'how you got to the service',
  websiteUsageCookiesItem4: 'what you click on while you&rsquo;re visiting the service',
  websiteUsageCookiesParagraph3:
    "We allow Google to use or share our analytics data. You can find out more about how Google use this information in their <a class='govuk-link' href='https://www.google.com/policies/privacy/partners/'>Privacy Policy</a>.",
  websiteUsageCookiesParagraph4:
    "You can <a class='govuk-link' href='https://tools.google.com/dlpage/gaoptout'>opt out of Google Analytics</a> if you do not want Google to have access to your information.",
  websiteUsageCookiesParagraph5: 'List of google analytics cookies used.',
  websiteUsageCookiesAriaDescribedby: 'Google Analytics sets the following cookies',
  cookieNameHeader: 'Name',
  cookiePurposeHeader: 'Purpose',
  cookieExpiryHeader: 'Expires',
  googleAnalyticsCookieName1: '_ga',
  googleAnalyticsCookiePurpose1:
    'This helps us count how many people visit the service by tracking if you&rsquo;ve visited before',
  googleAnalyticsCookieExpiry1: '2 years',
  googleAnalyticsCookieName2: '_gat',
  googleAnalyticsCookiePurpose2: 'Manages the rate at which page view requests are made',
  googleAnalyticsCookieExpiry2: '10 minutes',
  googleAnalyticsCookieName3: '_gid',
  googleAnalyticsCookiePurpose3: 'Identifies you to the service',
  googleAnalyticsCookieExpiry3: '24 hours',
  introMessageCookiesHeading1: 'To turn our introductory message off',
  introMessageCookiesParagraph1:
    'You may see a pop-up welcome message when you first visit the service. We’ll store a cookie so that your computer knows you’ve seen it and knows not to show it again.',
  introMessageCookiesAriaDescribedby: 'List of introductory cookies used.',
  introMessageCookieName1: 'seen_cookie_message',
  introMessageCookiePurpose1: 'Saves a message to let us know that you&rsquo;ve seen our cookie message',
  introMessageCookieExpiry1: '1 month',
  sessionCookiesHeading1:
    'To store the answers you&rsquo;ve given during your visit (known as a &lsquo;session&rsquo;)',
  sessionCookiesParagraph1:
    'Session cookies are stored on your computer as you travel through a website, and let the website know what you&rsquo;ve seen and done so far. These are temporary cookies and are automatically deleted a short while after you leave the website.',
  sessionCookiesAriaDescribedby: 'List of session cookies used.',
  sessionCookieName1: 'connect.sid',
  sessionCookiePurpose1: 'Carries details of your current session',
  identityCookiesHeading1: 'To identify you when you come back to the service',
  identityCookiesParagraph1: 'We use authentication cookies to identify you when you return to the service.',
  identityCookiesAriaDescribedby: 'List of authorisation cookies used.',
  identityCookieName1: '__auth-token',
  identityCookiePurpose1: 'Identifies you to the service',
  securityCookiesHeading1: 'To make the service more secure',
  securityCookiesParagraph1:
    'We set cookies which prevent attackers from modifying the contents of the other cookies we set. This makes the service more secure and protects your personal information.',
  securityCookiesAriaDescribedby: 'List of security cookies used.',
  securityCookieName1: 'TSxxxxxxxx',
  securityCookiePurpose1: 'Protects your session from tampering',
  securityCookieName2: '__state',
  securityCookiePurpose2: 'Identifies you to the service and secures your authentication',
  whenYouCloseYourBrowser: 'When you close your browser',
  dynatraceCookiesHeading1: 'To measure application performance',
  dynatraceCookiesParagraph1:
    'We use Dynatrace Software Intelligence Platform to provide an Application Performance Monitoring Service to collect information about how you use HMCTS services. We do this to monitor HMCTS services in order to resolve issues within our services as well as collect data on how our services can be improved. HMCTS store information about:',
  dynatraceCookiesItem1: 'Site performance',
  dynatraceCookiesItem2: 'Website usage',
  dynatraceCookiesItem3: 'User behaviour',
  dynatraceCookiesParagraph2:
    'Information is presented within the Application Performance Monitoring service for the purposes detailed above. We do not use or share the information for any other purpose. We do not allow Dynatrace to use or share the information for any other purposes.',
  dynatraceCookiesPurpose1: 'Tracks a visit across multiple request',
  dynatraceCookiesPurpose2: 'Measures server latency for performance monitoring',
  dynatraceCookiesPurpose3:
    'Required to identify proper endpoints for beacon transmission; includes session ID for correlation',
  dynatraceCookiesPurpose4: 'Intermediate store for page-spanning actions',
  dynatraceCookiesPurpose5: 'Visitor ID to correlate sessions',
  dynatraceCookiesPurpose6: 'Session timeout',
  dynatraceCookieName1: 'dtCookie',
  dynatraceCookieName2: 'dtLatC',
  dynatraceCookieName3: 'dtPC',
  dynatraceCookieName4: 'dtSa',
  dynatraceCookieName5: 'rxVisitor',
  dynatraceCookieName6: 'rxvt',
  sessionEnd: 'Session end',
  dynatraceCookiesAriaDescribedby: 'List of dynatrace cookies used.',
  oneYear: '1 year',
});

export const cy: typeof en = () => ({
  title: 'Cwcis',
  paragraph1:
    "Darn bach o ddata sy'n cael ei storio ar eich cyfrifiadur, eich tabled neu eich ffôn symudol pan fyddwch yn ymweld â gwefan yw cwci. Mae angen cwcis ar y rhan fwyaf o wefannau i weithio'n iawn.",
  howAreCookiesUsedParagraph1: 'Mae’r gwasanaeth hwn yn eu defnyddio i:',
  howAreCookiesUsedItem1:
    'fesur sut ydych yn defnyddio’r gwasanaeth fel y gallwn ei wella a’i ddiweddaru ar sail eich anghenion',
  howAreCookiesUsedItem2: 'cofio’r hysbysiadau rydych wedi’u gweld fel na fyddwch yn eu gweld eto',
  howAreCookiesUsedItem3: 'storio’r atebion a roddwch dros dro',
  howAreCookiesUsedParagraph2:
    "Mwy o wybodaeth am  <a class='govuk-link' href='http://www.aboutcookies.org/'>sut i reoli cwcis</a>.",
  howAreCookiesUsedHeading2: 'Sut mae cwcis yn cael eu defnyddio yn y gwasanaeth cyflwyno dogfennau',
  websiteUsageCookiesHeading3: "Mesur y defnydd o'r wefan",
  websiteUsageCookiesParagraph1:
    "Rydym yn defnyddio meddalwedd Google Analytics i gasglu gwybodaeth am sut rydych yn defnyddio'r gwasanaeth hwn. Rydym yn gwneud hyn i helpu i sicrhau bod y gwasanaeth yn diwallu anghenion defnyddwyr ac i'n helpu i wneud gwelliannau, er enghraifft gwella’r cyfleuster chwilio.",
  websiteUsageCookiesParagraph2: 'Mae Google Analytics yn storio gwybodaeth am:',
  websiteUsageCookiesItem1: 'y tudalennau yr ydych yn ymweld â hwy',
  websiteUsageCookiesItem2: 'faint o amser y byddwch yn ei dreulio ar bob tudalen',
  websiteUsageCookiesItem3: 'sut y daethoch o hyd i’r gwasanaeth',
  websiteUsageCookiesItem4: "yr hyn rydych chi'n clicio arno wrth ddefnyddio'r gwasanaeth",
  websiteUsageCookiesParagraph3:
    "Rydym yn caniatáu i Google ddefnyddio neu rannu ein data dadansoddol. Gallwch ganfod mwy am sut mae Google yn defnyddio’r wybodaeth hon yn eu <a class='govuk-link' href='https://www.google.com/policies/privacy/partners/'>Polisi Preifatrwydd</a>.",
  websiteUsageCookiesParagraph4:
    "Gallwch <a class='govuk-link' href='https://tools.google.com/dlpage/gaoptout'> optio allan o Google Analytics</a> os nad ydych eisiau i Google gael mynediad at eich gwybodaeth.",
  websiteUsageCookiesParagraph5: 'Rhestr o’r cwcis Google Analytics a ddefnyddir.',
  websiteUsageCookiesAriaDescribedby: 'Mae Google Analytics yn gosod y cwcis canlynol',
  cookieNameHeader: 'Enw',
  cookiePurposeHeader: 'Pwrpas',
  cookieExpiryHeader: 'Dyddiad dod i ben',
  googleAnalyticsCookieName1: '_ga',
  googleAnalyticsCookiePurpose1:
    "Mae’n ein helpu i gyfrif faint o bobl sy’n ymweld â’r gwasanaeth drwy olrhain os ydych wedi ymweld o'r blaen",
  googleAnalyticsCookieExpiry1: '2 flynedd',
  googleAnalyticsCookieName2: '_gat',
  googleAnalyticsCookiePurpose2: 'Rheoli faint o bobl sy’n ymweld â’r dudalen',
  googleAnalyticsCookieExpiry2: '10 munud',
  googleAnalyticsCookieName3: '_gid',
  googleAnalyticsCookiePurpose3: "Gadael i'r gwasanaeth wybod pwy ydych chi",
  googleAnalyticsCookieExpiry3: '24 awr',
  introMessageCookiesHeading1: 'Troi ein neges gyflwyno i ffwrdd',
  introMessageCookiesParagraph1:
    "Efallai y byddwch yn gweld neges yn eich croesawu pan fyddwch yn ymweld â'r gwasanaeth am y tro cyntaf. Byddwn yn storio cwci ar eich cyfrifiadur fel ei fod yn gwybod eich bod wedi’i gweld ac yn gwybod i beidio â'i dangos eto.",
  introMessageCookiesAriaDescribedby: 'Rhestr o’r cwcis rhagarweiniol a ddefnyddir.',
  introMessageCookieName1: 'seen_cookie_message',
  introMessageCookiePurpose1:
    'Cadw neges ar eich dyfais i roi gwybod inni eich bod wedi gweld ein neges ynglŷn â chwcis',
  introMessageCookieExpiry1: '1 mis',
  sessionCookiesHeading1: 'Storio’r atebion a roesoch yn ystod eich ymweliad (gelwir hyn yn ‘sesiwn’)',
  sessionCookiesParagraph1:
    "Caiff cwcis sesiwn eu storio ar eich dyfais wrth ichi fynd drwy wefan, ac maent yn gadael i'r wefan wybod beth rydych wedi'i weld a'i wneud hyd yn hyn. Cwcis dros dro yw'r rhain ac fe'u dilëir yn awtomatig ychydig ar ôl ichi adael y wefan.",
  sessionCookiesAriaDescribedby: 'Rhestr o’r cwcis sesiwn a ddefnyddir.',
  sessionCookieName1: 'connect.sid',
  sessionCookiePurpose1: 'Cynnal manylion am eich sesiwn gyfredol',
  identityCookiesHeading1: 'Eich adnabod pan fyddwch yn dod yn ôl at y gwasanaeth',
  identityCookiesParagraph1: 'Rydym yn defnyddio cwcis dilysu i’ch adnabod pan fyddwch yn dod yn ôl i’r gwasanaeth.',
  identityCookiesAriaDescribedby: 'Rhestr o’r cwcis awdurdodi a ddefnyddir.',
  identityCookieName1: '__auth-token',
  identityCookiePurpose1: 'Bydd y gwasanaeth yn eich adnabod',
  securityCookiesHeading1: 'Gwneud y gwasanaeth yn fwy diogel',
  securityCookiesParagraph1:
    'Rydym yn gosod cwcis er mwyn rhwystro hacwyr rhag addasu cynnwys y cwcis eraill rydym yn eu gosod. Mae hyn yn gwneud y gwasanaeth yn fwy diogel ac yn diogelu eich gwybodaeth bersonol.',
  securityCookiesAriaDescribedby: 'Rhestr o’r cwcis diogelwch a ddefnyddir.',
  securityCookieName1: 'TSxxxxxxxx',
  securityCookiePurpose1: 'Amddiffyn eich sesiwn rhag ymyrraeth',
  securityCookieName2: '__state',
  securityCookiePurpose2: "Gadael i'r gwasanaeth wybod pwy ydych chi a diogelu eich manylion",
  whenYouCloseYourBrowser: 'Pan fyddwch yn cau eich porwr',
  dynatraceCookiesHeading1: 'Mesur perfformiad y rhaglen',
  dynatraceCookiesParagraph1:
    'Rydym yn defnyddio Platfform Deallusrwydd Meddalwedd Dynatrace i ddarparu Gwasanaeth Monitro Perfformiad Gwasanaeth i gasglu gwybodaeth am sut yr ydych yn defnyddio gwasanaethau GLlTEF. Rydym yn gwneud hyn i fonitro gwasanaethau GLlTEF er mwyn datrys materion o fewn ein gwasanaethau yn ogystal â chasglu data ar sut y gellir gwella ein gwasanaethau. Mae GLlTEF yn cadw gwybodaeth am:',
  dynatraceCookiesItem1: 'Perfformiad y wefan',
  dynatraceCookiesItem2: "Defnydd o'r wefan",
  dynatraceCookiesItem3: 'Ymddygiad defnyddwyr',
  dynatraceCookiesParagraph2:
    "Cyflwynir yr wybodaeth angenrheidiol yn y Gwasanaeth Monitro Perfformiad Gwasanaeth at y dibenion a nodwyd uchod. Nid ydym yn defnyddio nac yn rhannu'r wybodaeth at unrhyw ddiben arall. Nid ydym yn caniatáu i Dynatrace ddefnyddio na rhannu'r wybodaeth at unrhyw ddibenion eraill.",
  dynatraceCookiesPurpose1: 'Olrhain ymweliad ar draws ceisiadau amryfal',
  dynatraceCookiesPurpose2: 'Mesur natur gudd y gweinydd er mwyn monitro perfformiad y gwasanaeth',
  dynatraceCookiesPurpose3:
    'Er mwyn canfod pwyntiau terfyn priodol ar gyfer trosglwyddo tywysydd: mae’n cynnwys rhif adnabod y sesiwn at ddibenion cydberthyniad',
  dynatraceCookiesPurpose4: "Storfa ganolradd ar gyfer gweithredoedd sy'n rhychwantu tudalennau",
  dynatraceCookiesPurpose5: 'ID Ymwelwyr i sesiynau cydberthynol',
  dynatraceCookiesPurpose6: 'Terfyn amser y sesiwn',
  dynatraceCookieName1: 'dtCookie',
  dynatraceCookieName2: 'dtLatC',
  dynatraceCookieName3: 'dtPC',
  dynatraceCookieName4: 'dtSa',
  dynatraceCookieName5: 'rxVisitor',
  dynatraceCookieName6: 'rxvt',
  sessionEnd: 'Diwedd y sesiwn',
  dynatraceCookiesAriaDescribedby: 'Rhestr o’r cwcis Dynatrace a ddefnyddir.',
  oneYear: '1 lwyddyn',
});

const languages = {
  en,
  cy,
};

export const generateContent: TranslationFn = content => {
  return languages[content.language]();
};
