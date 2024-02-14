import { CASE_SEARCH_URL, CHECK_YOUR_ANSWERS, DATA_VERIFICATION, START_HOME, UPLOAD_DOCUMENT } from '../../steps/urls';

const backLink: HTMLAnchorElement | null = document.querySelector('.govuk-back-link');
if (backLink) {
  backLink.onclick = function (e) {
    console.log('TEST');
    e.preventDefault();
    if (location.pathname === CASE_SEARCH_URL) {
      console.log('HERE');
      location.pathname = START_HOME;
    } else if (location.pathname === DATA_VERIFICATION) {
      location.pathname = CASE_SEARCH_URL;
    } else if (location.pathname === UPLOAD_DOCUMENT) {
      location.pathname = DATA_VERIFICATION;
    } else if (location.pathname === CHECK_YOUR_ANSWERS) {
      location.pathname = UPLOAD_DOCUMENT;
    } else {
      history.go(-1);
    }
  };
}
