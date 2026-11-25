import autobind from 'autobind-decorator';

import { checkCaseAccess } from '../../../app/case/api';
import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject } from '../../../app/controller/PostController';
import { CASE_NOT_FOUND_URL, CASE_SEARCH_URL, DATA_VERIFICATION, NOT_AUTHORISED, PageLink } from '../../urls';
import { VerificationPostController } from '../VerificationPostController';

@autobind
export default class CaseFinderController extends VerificationPostController {
  protected readonly defaultUrl: PageLink = CASE_SEARCH_URL;

  protected resetVerification(req: AppRequest<AnyObject>): void {
    super.resetVerification(req);
    req.session.userCase = { id: '' } as typeof req.session.userCase;
  }

  protected async handleVerification(req: AppRequest<AnyObject>, formData: Record<string, unknown>): Promise<PageLink> {
    const caseId = formData.applicantCaseId as string;
    try {
      const responseFromServerCall = await checkCaseAccess(req.session.user.accessToken, caseId);
      if (responseFromServerCall.status === 200) {
        req.session.userCase.id = caseId;
        return DATA_VERIFICATION;
      }
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403) {
        return NOT_AUTHORISED;
      }
      if (status === 404) {
        return CASE_NOT_FOUND_URL;
      }
    }

    // Link to the retry button rather than marking a well-formed reference invalid.
    req.session.errors?.push({ propertyName: 'main-form-submit', errorType: 'caseLookupFailed' });
    return this.defaultUrl;
  }
}
