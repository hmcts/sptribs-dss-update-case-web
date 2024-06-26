import * as fs from 'fs';

import { NextFunction, Response } from 'express';

import { Case } from '../app/case/case';
import { AppRequest } from '../app/controller/AppRequest';
import { TranslationFn } from '../app/controller/GetController';
import { FormContent } from '../app/form/Form';

import { parseUrl } from './common/url-parser';
import { Step } from './constants';
import { dss_update_steps } from './dss-update/dss-sequence';
import { uploadDocumentsSequence } from './upload-documents/uploadDocumentsSequence';
import { CASE_SEARCH_URL, PageLink } from './urls';

const QueryString = require('query-string');
export const getNextStepUrl = (req: AppRequest, data: Partial<Case>): string => {
  if ((req.body as any).saveAsDraft) {
    return CASE_SEARCH_URL;
  }
  const { path, queryString: queryStr } = getPathAndQueryString(req);
  const nextStep = [...(dss_update_steps as Step[]), ...uploadDocumentsSequence].find(s => s.url === path);
  const url = nextStep ? nextStep.getNextStep(data, req) : CASE_SEARCH_URL;
  const { path: urlPath, queryString: urlQueryStr } = getPathAndQueryStringFromUrl(url);
  let queryString = '';
  let finalQueryString = {
    ...QueryString.parse(queryStr),
    ...QueryString.parse(urlQueryStr),
  } as Record<string, string>;

  if (nextStep?.sanitizeQueryString) {
    finalQueryString = nextStep?.sanitizeQueryString(path, urlPath, { ...finalQueryString });
  }

  if (Object.values(finalQueryString).length) {
    queryString = `?${QueryString.stringify(finalQueryString)}`;
  }

  return `${urlPath}${queryString}`;
};

const getPathAndQueryString = (req: AppRequest): { path: string; queryString: string } => {
  const path = req.route.path;
  const [, searchParams] = req.originalUrl.split('?');
  const queryString = searchParams ? `?${searchParams}` : '';
  return { path, queryString };
};

const getStepFiles = (stepDir: string) => {
  const stepContentFile = `${stepDir}/content.ts`;
  const content = fs.existsSync(stepContentFile) ? require(stepContentFile) : {};
  const stepViewFile = `${stepDir}/template.njk`;
  const view = fs.existsSync(stepViewFile) ? stepViewFile : `${stepDir}/../../common/template.njk`;

  return { content, view };
};

type RouteGuard = {
  get?: (req: AppRequest, res: Response, next: NextFunction) => Promise<void>;
  post?: (req: AppRequest, res: Response, next: NextFunction) => Promise<void>;
};

export type StepWithContent = Step & {
  stepDir: string;
  generateContent: TranslationFn;
  form: FormContent;
  view: string;
  routeGuard?: RouteGuard;
};
const getStepsWithContent = (sequence: Step[], subDir = ''): StepWithContent[] => {
  const dir = __dirname;
  const results: StepWithContent[] = [];
  if (sequence?.length) {
    for (const step of sequence) {
      const { url } = parseUrl(step.url);
      const stepDir = `${dir}${url.startsWith(subDir) ? url : `${subDir}${url}`}`;
      const { content, view } = getStepFiles(stepDir);
      results.push({ stepDir, ...step, ...content, view });
    }
  }
  return results;
};
export const dss_updateSequenceOrder = getStepsWithContent(dss_update_steps, '');
export const uploadDocumentSequence = getStepsWithContent(uploadDocumentsSequence);
export const stepsWithContent = [...dss_updateSequenceOrder, ...uploadDocumentSequence];

export const getPathAndQueryStringFromUrl = (url: PageLink): { path: string; queryString: string } => {
  const [path, searchParams] = url.split('?');
  const queryString = searchParams ? `?${searchParams}` : '';
  return { path, queryString };
};
