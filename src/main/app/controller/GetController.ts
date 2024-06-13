import autobind from 'autobind-decorator';
import { Response } from 'express';
import Negotiator from 'negotiator';

import { LanguageToggle } from '../../modules/i18n';
import { CommonContent, Language, generatePageContent } from '../../steps/common/common.content';
import * as Urls from '../../steps/urls';

import { AppRequest } from './AppRequest';

export type PageContent = Record<string, unknown>;
export type TranslationFn = (content: CommonContent) => PageContent;

@autobind
export class GetController {
  constructor(
    protected readonly view: string,
    protected readonly content: TranslationFn
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async get(req: AppRequest, res: Response, renderableContents?): Promise<void> {
    if (res.locals.isError || res.headersSent) {
      // If there's an async error, it will have already rendered an error page upstream,
      // so we don't want to call render again
      return;
    }

    try {
      const name = this.getName(req) as string;
      const language = this.getPreferredLanguage(req) as Language;
      const captionValue = this.getCaption(req) as string;
      const document_type = this.getDocumentType(req) as string;
      const byApplicant = req.query['byApplicant'] as string;
      const addresses = req.session?.addresses;
      const content = generatePageContent({
        language,
        pageContent: this.content,
        userCase: req.session?.userCase,
        userEmail: req.session?.user?.email,
        caption: captionValue,
        document_type,
        userCaseList: req.session?.userCaseList,
        addresses,
        name,
        userIdamId: req.session?.user?.id,
        byApplicant,
        additionalData: {
          req,
        },
      });

      const viewData = {
        ...content,
        ...renderableContents,
        sessionErrors: req.session?.hasOwnProperty('errors') ? req.session.errors : [],
        fileErrors: req.session?.hasOwnProperty('fileErrors') ? req.session.fileErrors : [],
        caseId: req.session?.userCase?.id,
      };

      if (req.session?.errors) {
        req.session.errors = undefined;
      }
      if (req.session?.fileErrors) {
        req.session.fileErrors = [];
      }
      //Add caption only if it exists else it will be rendered by specific page
      if (captionValue) {
        Object.assign(viewData, { caption: captionValue });
      }
      res.render(this.view, viewData);
    } catch (error) {
      res.redirect('/error');
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected getPreferredLanguage(req: AppRequest) {
    // User selected language
    const requestedLanguage = req.query['lng'] as string;
    if (LanguageToggle.supportedLanguages.includes(requestedLanguage)) {
      return requestedLanguage;
    }

    // Saved session language
    if (req.session?.lang) {
      return req.session.lang;
    }

    // Browsers default language
    const negotiator = new Negotiator(req);
    return negotiator.language(LanguageToggle.supportedLanguages) || 'en';
  }

  private getCaption(req: AppRequest) {
    const caption = req.query['caption'] as string;
    return caption;
  }
  private getDocumentType(req: AppRequest) {
    const caption = req.query['document_type'] as string;
    return caption;
  }

  public parseAndSetReturnUrl(req: AppRequest): void {
    if (req.query.returnUrl) {
      if (Object.values(Urls).find(item => item === `${req.query.returnUrl}`)) {
        req.session.returnUrl = `${req.query.returnUrl}`;
      }
    }
  }

  private getName(req: AppRequest) {
    const caption = req.query['name'] as string;
    return caption;
  }
}
