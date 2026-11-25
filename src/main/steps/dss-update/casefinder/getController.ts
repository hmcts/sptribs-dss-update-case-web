import autobind from 'autobind-decorator';
import { Response } from 'express';

import { AppRequest } from '../../../app/controller/AppRequest';
import { GetController } from '../../../app/controller/GetController';

import { form } from './content';

@autobind
export default class CaseFinderGetController extends GetController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const { caseReferenceForRetry } = req.session;
    delete req.session.caseReferenceForRetry;

    if (caseReferenceForRetry === undefined) {
      return super.get(req, res);
    }

    return super.get(req, res, {
      form: {
        ...form,
        fields: {
          ...form.fields,
          applicantCaseId: { ...form.fields.applicantCaseId, value: caseReferenceForRetry },
        },
      },
    });
  }
}
