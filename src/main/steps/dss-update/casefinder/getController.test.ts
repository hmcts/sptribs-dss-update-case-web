import express from 'express';

import { mockRequest } from '../../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../../test/unit/utils/mockResponse';
import { Nunjucks } from '../../../modules/nunjucks';

import { en, generateContent } from './content';
import CaseFinderGetController from './getController';

describe('case finder get controller', () => {
  const view = 'dss-update/casefinder/template.njk';
  const controller = new CaseFinderGetController(view, generateContent);
  const app = express();
  new Nunjucks().enableFor(app);

  test('shows the original reference safely alongside the field error for one retry', async () => {
    const submittedReference = '<0675 - 6764 - 8331 - 9900>';
    const req = mockRequest({
      session: {
        caseReferenceForRetry: submittedReference,
        errors: [{ propertyName: 'applicantCaseId', errorType: 'invalid' }],
      },
    });
    const res = mockResponse();
    const originalCase = req.session.userCase;

    await controller.get(req, res);

    const [template, viewData] = jest.mocked(res.render).mock.calls[0];
    const html = await new Promise<string>((resolve, reject) => {
      app.render(template, viewData, (error, rendered) => (error ? reject(error) : resolve(rendered)));
    });
    const referenceInput = html.match(/<input[^>]+id="applicantCaseId"[^>]*>/)?.[0];
    expect(referenceInput).toContain('value="&lt;0675 - 6764 - 8331 - 9900&gt;"');
    expect(referenceInput).toContain('applicantCaseId-error');
    expect(html).toContain(`href="#applicantCaseId">${en().errors.applicantCaseId.invalid}</a>`);
    expect(req.session.caseReferenceForRetry).toBeUndefined();
    expect(req.session.userCase).toBe(originalCase);

    await controller.get(req, res);

    const [, freshViewData] = jest.mocked(res.render).mock.calls[1];
    expect(freshViewData).not.toHaveProperty('form.fields.applicantCaseId.value');
  });
});
