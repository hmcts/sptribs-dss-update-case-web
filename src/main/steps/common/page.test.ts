import path from 'path';

import { configure } from 'nunjucks';

const mainPath = path.resolve(__dirname, '../..');
const env = configure([
  path.join(mainPath, 'steps'),
  path.resolve('node_modules/govuk-frontend/dist'),
  path.join(mainPath, 'views'),
  path.join(mainPath, 'routes/authless/landing'),
]);

const commonContent = {
  serviceName: 'Update an appeal',
  phase: 'Beta',
  feedback: 'Give feedback',
  back: 'Back',
  signOut: 'Sign out',
  signIn: 'Sign in',
  globals: { dynatrace: { dynatraceUrl: '/dynatrace.js' } },
  fileErrors: [],
  sessionErrors: [],
};

function expectPageStructure(html: string): void {
  const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0] ?? '';

  expect(html.match(/<header\b/g)).toHaveLength(1);
  expect(html.match(/<footer\b/g)).toHaveLength(1);
  expect(html).toContain('href="/assets/images/favicon.ico"');
  expect(html).toContain('href="/assets/images/favicon.svg"');
  expect(html).toContain('href="/assets/manifest.json"');
  expect(header).not.toContain('govuk-service-navigation');
  expect(html).toContain('govuk-footer');
  expect(html).toContain('href="//gov.uk" class="govuk-header__homepage-link"');
  expect(header.match(/class="app-header"/g)).toHaveLength(1);
  expect(header).toContain('govuk-width-container app-header__container');
  expect(header).toContain('app-header__logo-container');
  expect(header.indexOf('govuk-header__logo')).toBeLessThan(header.indexOf('app-header__service-name'));
  expect(header.indexOf('app-header__service-name')).toBeLessThan(header.indexOf('govuk-phase-banner'));
  expect(header).toContain('govuk-link--inverse app-header__service-name');
  expect(header).toMatch(/<\/nav>\s*<\/div>\s*<\/div>\s*<div class="govuk-phase-banner/);
}

describe('GOV.UK page templates', () => {
  describe.each([
    {
      language: 'English',
      title: 'Existing appeal details',
      serviceName: 'Update an appeal to the First-tier Tribunal',
      errorPrefix: 'Error:',
    },
    {
      language: 'Welsh',
      title: 'Manylion apêl presennol',
      serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
      errorPrefix: 'Gwall:',
    },
  ])('$language page titles', ({ title, serviceName, errorPrefix }) => {
    test.each([
      { state: 'without errors', hasSessionErrors: false, hasFileErrors: false },
      { state: 'with form errors', hasSessionErrors: true, hasFileErrors: false },
      { state: 'with file upload errors', hasSessionErrors: false, hasFileErrors: true },
      { state: 'with both form and file upload errors', hasSessionErrors: true, hasFileErrors: true },
    ])('renders the page title before the service name $state', ({ hasSessionErrors, hasFileErrors }) => {
      const html = env.render('common/page.njk', {
        ...commonContent,
        title,
        serviceName,
        errorPrefix,
        govUk: 'GOV.UK',
        sessionErrors: hasSessionErrors ? [{ propertyName: 'applicantCaseId', errorType: 'required' }] : [],
        fileErrors: hasFileErrors ? [{ propertyName: 'documents', errorType: 'required' }] : [],
        errors: { applicantCaseId: { required: 'Enter a reference number' } },
      });
      const pageTitle = html.match(/<title>([\s\S]*?)<\/title>/)?.[1].trim();
      const expectedPrefix = hasSessionErrors || hasFileErrors ? `${errorPrefix} ` : '';

      expect(pageTitle).toBe(`${expectedPrefix}${title} - ${serviceName} - GOV.UK`);
    });
  });

  test.each([
    { isLoggedIn: true, languageToggle: '<a href="?lng=cy">Cymraeg</a>', expectedLanguage: 'Cymraeg' },
    { isLoggedIn: false, languageToggle: '<a href="?lng=en">English</a>', expectedLanguage: 'English' },
  ])('renders the main page with the existing navigation and $expectedLanguage link', variant => {
    const html = env.render('common/page.njk', { ...commonContent, ...variant });

    expectPageStructure(html);
    expect(html).toContain('app-header__service-name" href="/"');
    expect(html).toContain(`>${variant.expectedLanguage}</a>`);
    expect(html).toContain('govuk-phase-banner');
    expect(html).toContain('govuk-cookie-banner');
    expect(html.indexOf('govuk-skip-link')).toBeLessThan(html.indexOf('govuk-cookie-banner'));
    expect(html.indexOf('govuk-cookie-banner')).toBeLessThan(html.indexOf('<header'));
    expect(html.indexOf('govuk-phase-banner')).toBeLessThan(html.indexOf('</header>'));
    expect(html.indexOf('govuk-back-link')).toBeGreaterThan(html.indexOf('</header>'));
    expect(html.indexOf('govuk-back-link')).toBeLessThan(html.indexOf('<main'));
    expect(html.includes('href="/logout"')).toBe(variant.isLoggedIn);
    expect(html.includes('Sign out')).toBe(variant.isLoggedIn);
    expect(html.includes('Sign in')).toBe(!variant.isLoggedIn);
    expect(html).toContain('app-header__account-link');
  });

  test('renders the timed-out page without sign-out navigation', () => {
    const html = env.render('timed-out/template.njk', { ...commonContent, signBackInAndContinue: 'Sign back in' });

    expectPageStructure(html);
    expect(html).toContain('href="/login"');
    expect(html).toContain('govuk-cookie-banner');
    expect(html).not.toContain('href="/logout"');
    expect(html).not.toContain('app-header__account-link');
    expect(html).not.toContain('govuk-back-link');
  });

  test('keeps a configured service base path', () => {
    const html = env.render('common/page.njk', {
      ...commonContent,
      globals: { ...commonContent.globals, basePath: '/appeals' },
    });

    expect(html).toContain('app-header__service-name" href="/appeals/"');
  });

  test('keeps the Welsh service name in the same header row as the logo', () => {
    const html = env.render('common/page.njk', {
      ...commonContent,
      serviceName: 'Diweddaru apêl i’r Tribiwnlys Haen Gyntaf',
      languageToggle: '<a href="?lng=en">English</a>',
      isLoggedIn: true,
      signOut: 'Allgofnodi',
    });
    const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0] ?? '';

    expectPageStructure(html);
    expect(header).toContain('Diweddaru apêl i’r Tribiwnlys Haen Gyntaf');
    expect(header).toContain('Allgofnodi');
    expect(header).toContain('aria-label="Diweddaru apêl i’r Tribiwnlys Haen Gyntaf"');
    expect(html).toContain('href="?lng=en"');
  });

  test.each([
    { ToggleLanguage: 'cy', expectedLanguage: 'Cymraeg' },
    { ToggleLanguage: 'en', expectedLanguage: 'English' },
  ])('renders the authless landing page with the $expectedLanguage link', variant => {
    const html = env.render('landing.njk', {
      ...commonContent,
      ...variant,
      content: { serviceName: 'Update an appeal', banner: 'Give feedback', title: 'Welcome' },
      loginURL: '/login',
    });

    expectPageStructure(html);
    expect(html).toContain(`>${variant.expectedLanguage}</a>`);
    expect(html).toContain(`href="?lang=${variant.ToggleLanguage}"`);
    expect(html).toContain('href="/login"');
    expect(html).not.toContain('href="/logout"');
    expect(html.indexOf('govuk-phase-banner')).toBeLessThan(html.indexOf('</header>'));
  });

  test('renders date and file upload errors with the installed component macros', () => {
    const html = env.renderString(
      `{% from "govuk/components/date-input/macro.njk" import govukDateInput %}
       {% from "govuk/components/file-upload/macro.njk" import govukFileUpload %}
       {{ govukDateInput({ namePrefix: "date", errorMessage: { text: "Enter a date" } }) }}
       {{ govukFileUpload({ name: "documents", id: "documents", label: { text: "Upload a file" }, errorMessage: { text: "Choose a file" } }) }}`,
      {}
    );

    expect(html).toContain('Enter a date');
    expect(html).toContain('Choose a file');
    expect(html).toContain('govuk-form-group--error');
  });
});
