import autobind from 'autobind-decorator';

import { verifyCaseSubject } from '../../../app/case/api';
import { CaseDate } from '../../../app/case/case';
import { AppRequest } from '../../../app/controller/AppRequest';
import { AnyObject } from '../../../app/controller/PostController';
import { NOT_AUTHORISED, SUBJECT_DETAILS_ERROR_URL, UPLOAD_DOCUMENT } from '../../urls';
import { VerificationPostController } from '../VerificationPostController';

@autobind
export default class CitizenDataVerificationPostController extends VerificationPostController {
  protected async handleVerification(
    req: AppRequest<AnyObject>,
    formData: Record<string, unknown>,
    fallbackUrl: string
  ): Promise<string> {
    const subjectDOB = formData.subjectDOB as CaseDate;
    req.session.userCase.subjectFullName = formData.subjectFullName as string;
    req.session.userCase.subjectDOB = subjectDOB;

    try {
      const subjectFullNameToVerify = String(formData.subjectFullName).trim();
      const dateToVerify = `${subjectDOB?.year}-${subjectDOB?.month?.padStart(2, '0')}-${subjectDOB?.day?.padStart(2, '0')}`;
      const responseFromServerCall = await verifyCaseSubject(
        req.session.user.accessToken,
        req.session.userCase.id,
        subjectFullNameToVerify,
        dateToVerify
      );
      if (responseFromServerCall.status === 200) {
        if (responseFromServerCall.data.verified) {
          req.session.isDataVerified = true;
          req.session.verifiedCaseId = req.session.userCase.id;
          req.session.verifiedUserId = req.session.user.id;
          return UPLOAD_DOCUMENT;
        } else {
          return SUBJECT_DETAILS_ERROR_URL;
        }
      }
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403) {
        return NOT_AUTHORISED;
      } else if (status === 401) {
        return SUBJECT_DETAILS_ERROR_URL;
      } else {
        req.session.errors = req.session.errors || [];
        req.session.errors.push({ propertyName: 'caseError', errorType: 'required' });
      }
    }
    return fallbackUrl;
  }
}
