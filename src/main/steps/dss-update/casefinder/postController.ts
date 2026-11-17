import autobind from 'autobind-decorator';

import { checkCaseAccess } from '../../../app/case/api';
import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject } from '../../../app/controller/PostController';
import { CASE_NOT_FOUND_URL, CASE_SEARCH_URL, DATA_VERIFICATION, NOT_AUTHORISED, PageLink } from '../../urls';
import { VerificationPostController } from '../VerificationPostController';

@autobind
export default class CaseFinderController extends VerificationPostController {
  protected readonly defaultUrl: PageLink = CASE_SEARCH_URL;

  protected async handleVerification(req: AppRequest<AnyObject>, formData: Record<string, unknown>): Promise<PageLink> {
    try {
      const caseId = String(formData.applicantCaseId || req.body.applicantCaseId);
      if (!/^\d{16}$/.test(caseId)) {
        throw new Error('Invalid case reference');
      }
      const responseFromServerCall = await checkCaseAccess(req.session.user.accessToken, caseId);
      if (responseFromServerCall.status === 200) {
        req.session.userCase = { id: caseId } as typeof req.session.userCase;
        return DATA_VERIFICATION;
      }
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403) {
        return NOT_AUTHORISED;
      } else if (status === 404) {
        req.session.userCase = { id: '', ccdReferenceNumber: req.body.applicantCaseId } as any;
        return CASE_NOT_FOUND_URL;
      } else {
        req.session.errors = req.session.errors || [];
        req.session.errors.push({ propertyName: 'applicantCaseId', errorType: 'caseNotFound' });
      }
    }
    return this.defaultUrl;
  }
}
