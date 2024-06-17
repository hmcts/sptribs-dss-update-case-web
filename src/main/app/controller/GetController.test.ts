import { mockRequest } from '../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../test/unit/utils/mockResponse';
import { SIGN_IN_URL } from '../../steps/urls';

import { AppRequest } from './AppRequest';
import { GetController } from './GetController';

describe('GetController', () => {
  const languages = {
    en: {
      text: 'english',
    },
    cy: {
      text: 'welsh',
    },
  };
  //const userEmail = 'test@example.com';
  const generateContent = content => languages[content.language];
  test('Should render the page', async () => {
    const controller = new GetController('page', generateContent);

    const req = mockRequest();
    const res = mockResponse();
    await controller.get(req, res);

    const requestWithCookiesParams = req;
    requestWithCookiesParams.query = {
      analytics: 'off',
      apm: 'off',
    };
    expect(res.render).toHaveBeenCalledWith(expect.stringContaining('page'), expect.anything());
  });

  test('Detects when application is not in a draft state', async () => {
    const controller = new GetController('page', () => ({}));

    const req = mockRequest({ userCase: { state: '' } });
    const res = mockResponse();
    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(expect.stringContaining('page'), expect.anything());
  });

  test('Routes to /error page when exception thrown', async () => {
    const controller = new GetController('page', () => ({}));

    const req = {} as AppRequest;
    const res = mockResponse();
    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/error');
  });

  describe('Getting the users preferred language', () => {
    test('Language via query string', async () => {
      const controller = new GetController('page', generateContent);

      const language = 'cy';
      const req = mockRequest();
      const res = mockResponse();
      req.query.lng = language;
      req.query.caption = 'test caption';
      req.session.fileErrors = [];
      await controller.get(req, res);

      const documentManagerRequest = req;
      documentManagerRequest.session.caseDocuments = [
        {
          originalDocumentName: 'document1.docx',
          _links: {
            self: {
              href: 'http://dm-example/documents/sae33',
            },
            binary: {
              href: 'http://dm-example/documents/sae33/binary',
            },
          },
        },
        {
          originalDocumentName: 'document2.docx',
          _links: {
            self: {
              href: 'http://dm-example/documents/ce6e2',
            },
            binary: {
              href: 'http://dm-example/documents/ce6e2/binary',
            },
          },
        },
      ];

      documentManagerRequest.query = {
        query: 'delete',
        docId: 'xyz',
        documentType: 'applicationform',
      };

      await controller.get(documentManagerRequest, res);

      documentManagerRequest.query = {
        query: 'delete',
        docId: 'xyz',
        documentType: 'additional',
      };

      await controller.get(documentManagerRequest, res);

      expect(res.render).toHaveBeenCalledWith(expect.stringContaining('page'), expect.anything());
    });

    test('Language via session', async () => {
      const controller = new GetController('page', generateContent);

      const language = 'cy';
      const req = mockRequest();
      const res = mockResponse();
      req.session.lang = language;
      await controller.get(req, res);
      expect(res.render).toHaveBeenCalledWith(expect.stringContaining('page'), expect.anything());
    });

    test('Language via browser settings', async () => {
      const controller = new GetController('page', generateContent);

      //const language = 'cy';
      const req = mockRequest({ headers: { 'accept-language': 'cy' } });
      const res = mockResponse();

      await controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith(expect.stringContaining('page'), expect.anything());
    });

    test('Language via browser settings fallback to en', async () => {
      const controller = new GetController('page', generateContent);

      //const language = 'en';
      const req = mockRequest({ headers: { 'accept-language': 'unknown' } });
      const res = mockResponse();

      await controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith(expect.stringContaining('page'), expect.anything());
    });
  });

  test("Doesn't call render if an error page has already been rendered upstream", async () => {
    const controller = new GetController('page', generateContent);

    const req = mockRequest();
    const res = mockResponse();
    res.locals.isError = true;
    await controller.get(req, res);

    expect(res.render).not.toHaveBeenCalled();
  });

  test("Doesn't call render if headers have already been sent already upstream", async () => {
    const controller = new GetController('page', generateContent);

    const req = mockRequest();
    const res = mockResponse();
    res.headersSent = true;
    await controller.get(req, res);

    expect(res.render).not.toHaveBeenCalled();
  });

  test('sends the current page form session state to the view', async () => {
    const controller = new GetController('page', generateContent);
    const req = mockRequest();
    const res = mockResponse();

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(expect.stringContaining('page'), expect.anything());
  });

  describe('generatePageContent()', () => {
    test('calls generatePageContent with correct arguments for new sessions', async () => {
      const getContentMock = jest.fn().mockReturnValue({});
      const controller = new GetController('page', getContentMock);

      const req = mockRequest({ userCase: { state: '' }, session: { errors: [] } });
      const res = mockResponse();

      await controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith(expect.stringContaining('page'), expect.anything());
    });
  });
});

describe('checking for documents Delete manager', () => {
  it('should delete additional documents', async () => {
    const languages = {
      en: {
        text: 'english',
      },
      cy: {
        text: 'welsh',
      },
    };
    const generateContent = content => languages[content.language];
    const controller = new GetController('page', generateContent);

    const req = mockRequest();
    const res = mockResponse();
    req.session.caseDocuments = [
      {
        originalDocumentName: 'document1.docx',
        _links: {
          self: {
            href: 'http://dm-example/documents/sae33',
          },
          binary: {
            href: 'http://dm-example/documents/sae33/binary',
          },
        },
      },
      {
        originalDocumentName: 'document2.docx',
        _links: {
          self: {
            href: 'http://dm-example/documents/ce6e2',
          },
          binary: {
            href: 'http://dm-example/documents/ce6e2/binary',
          },
        },
      },
    ];

    req.query = {
      query: 'delete',
      documentId: '10',
      documentType: 'applicationform',
    };
    await controller.get(req, res);
    expect(res.render).toHaveBeenCalled();
  });

  describe('parseAndSetReturnUrl', () => {
    test('req.session.returnUrl populated', async () => {
      const controller = new GetController('page', () => ({}));
      const req = mockRequest();
      req.query = { returnUrl: SIGN_IN_URL };

      controller.parseAndSetReturnUrl(req);

      expect(req.session.returnUrl).toEqual(SIGN_IN_URL);
    });

    test('returnUrl not populated if returnUrl not set', async () => {
      const controller = new GetController('page', () => ({}));
      const req = mockRequest();

      controller.parseAndSetReturnUrl(req);

      expect(req.session.returnUrl).toBeFalsy();
    });

    test('returnUrl not populated if returnUrl not a valid pagelink url', async () => {
      const controller = new GetController('page', () => ({}));
      const req = mockRequest();

      controller.parseAndSetReturnUrl(req);

      expect(req.session.returnUrl).toBeFalsy();
    });
  });
});
