import {
  ACCESSIBILITY_STATEMENT,
  CONTACT_US,
  COOKIES_PAGE,
  PRIVACY_POLICY,
  PageLink,
  TERMS_AND_CONDITIONS,
  TIMED_OUT_URL,
} from './urls';
export const signInNotRequired = (reqPath: string): boolean =>
  [ACCESSIBILITY_STATEMENT, CONTACT_US, COOKIES_PAGE, PRIVACY_POLICY, TERMS_AND_CONDITIONS, TIMED_OUT_URL].includes(
    reqPath as PageLink
  );
