import { Sections, Step } from '../constants';
import {
  APPLICATION_CONFIRMATION,
  CASE_SEARCH_URL,
  CHECK_YOUR_ANSWERS,
  DATA_VERIFICATION,
  START_HOME,
  UPLOAD_DOCUMENT,
} from '../urls';

export const dss_update_steps: Step[] = [
  {
    url: CASE_SEARCH_URL,
    showInSection: Sections.dss_update,
    getNextStep: () => DATA_VERIFICATION,
  },
  {
    url: DATA_VERIFICATION,
    showInSection: Sections.dss_update,
    getNextStep: () => APPLICATION_CONFIRMATION,
  },
  {
    url: UPLOAD_DOCUMENT,
    showInSection: Sections.dss_update,
    getNextStep: () => CHECK_YOUR_ANSWERS,
  },
  {
    url: CHECK_YOUR_ANSWERS,
    showInSection: Sections.dss_update,
    getNextStep: () => APPLICATION_CONFIRMATION,
  },
  {
    url: APPLICATION_CONFIRMATION,
    showInSection: Sections.dss_update,
    getNextStep: () => START_HOME,
  },
];
