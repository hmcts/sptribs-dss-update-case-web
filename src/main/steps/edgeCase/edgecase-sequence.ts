/* eslint-disable import/order */
import { Sections, Step } from '../constants';
import { APPLICATION_CONFIRMATION, CHECK_YOUR_ANSWERS, CITIZEN_HOME_URL, DATA_VERIFICATION, START_HOME } from '../urls';

export const edgeCase_Sequence: Step[] = [
  {
    url: START_HOME,
    showInSection: Sections.EdgeCase,
    getNextStep: () => CITIZEN_HOME_URL,
  },
  {
    url: CITIZEN_HOME_URL,
    showInSection: Sections.EdgeCase,
    getNextStep: () => DATA_VERIFICATION,
  },
  {
    url: DATA_VERIFICATION,
    showInSection: Sections.EdgeCase,
    getNextStep: () => APPLICATION_CONFIRMATION,
  },
  {
    url: APPLICATION_CONFIRMATION,
    showInSection: Sections.EdgeCase,
    getNextStep: () => START_HOME,
  },
  {
    url: CHECK_YOUR_ANSWERS,
    showInSection: Sections.EdgeCase,
    getNextStep: () => START_HOME,
  },
];
