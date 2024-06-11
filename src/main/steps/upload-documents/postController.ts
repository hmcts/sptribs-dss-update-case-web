import autobind from 'autobind-decorator';
import config from 'config';
import { Response } from 'express';
import FormData from 'form-data';

import { C100DocumentInfo } from '../../app/case/definition';
import { AppRequest } from '../../app/controller/AppRequest';
import { AnyObject, PostController } from '../../app/controller/PostController';
import { uploadDocument } from '../../app/fileUpload/documentManager';
import { FormFields, FormFieldsFn } from '../../app/form/Form';
import { containsInvalidCharacters, isMarkDownLinkIncluded } from '../../app/form/validation';
import { getServiceAuthToken } from '../../app/s2s/get-service-auth-token';
import { CHECK_YOUR_ANSWERS } from '../urls';

import { getErrors } from './content';

export const documentExtensions = ['jpg', 'jpeg', 'bmp', 'png', 'pdf', 'doc', 'docx', 'rtf', 'xlsx', 'xls', 'txt'];
export const multimediaExtensions = ['mp3', 'mp4'];

@autobind
export default class UploadDocumentController extends PostController<AnyObject> {
  constructor(protected readonly fields: FormFields | FormFieldsFn) {
    super(fields);
  }
  public async post(req: AppRequest<AnyObject>, res: Response): Promise<void> {
    const { files }: AppRequest<AnyObject> = req;
    const ContinueFromPage = req['body'].hasOwnProperty('continue');

    if (req.session) {
      req.session.errors = [];
      req.session.fileErrors = [];
    }

    req.session['documentDetail'] = req.body['documentDetail'];
    req.session.save();

    if (ContinueFromPage) {
      const numDocsUploaded: number = req.session.hasOwnProperty('caseDocuments')
        ? req.session['caseDocuments'].length
        : 0;

      if (numDocsUploaded === 0 && req.session['documentDetail'] === '') {
        this.uploadFileError(req, res, req.originalUrl, 'noInput');
      } else if (isMarkDownLinkIncluded(req.session['documentDetail'])) {
        this.uploadFileError(req, res, req.originalUrl, 'containsMarkdownLink');
      } else if (containsInvalidCharacters(req.session['documentDetail'])) {
        this.uploadFileError(req, res, req.originalUrl, 'invalid');
      } else {
        super.redirect(req, res, CHECK_YOUR_ANSWERS);
      }
    } else {
      await this.checkFileCondition(req, res, req.originalUrl, files);
    }
  }

  public checkIfMaxDocumentUploaded = (document: C100DocumentInfo[]): boolean => {
    return document.length > Number(config.get('uploadPolicy.maxNoOfFiles')) - 1;
  };

  public async checkFileCondition(
    req: AppRequest<AnyObject>,
    res: Response<any, Record<string, any>>,
    redirectUrl: string,
    files: any
  ): Promise<void> {
    if (req.session['caseDocuments'] && this.checkIfMaxDocumentUploaded(req.session['caseDocuments'])) {
      const documentUploadErrors = getErrors(req.session['lang']);
      req.session.fileErrors = [{ text: documentUploadErrors.documentUpload.maxFileError, href: '#file-upload-1' }];
      req.session.save(err => {
        if (err) {
          throw err;
        }
        res.redirect(redirectUrl);
      });
    } else {
      await this.checkFileValidation(files, req, res, redirectUrl);
    }
  }

  public async checkFileValidation(
    files: any,
    req: AppRequest<AnyObject>,
    res: Response<any, Record<string, any>>,
    redirectUrl: string
  ): Promise<void> {
    if (req.files) {
      const { documents } = files;
      if (isMarkDownLinkIncluded(req.body['eventName'] as string)) {
        this.uploadFileError(req, res, redirectUrl, 'containsMarkdownLink');
      } else if (containsInvalidCharacters(req.body['eventName'] as string)) {
        this.uploadFileError(req, res, redirectUrl, 'invalid');
      } else if (!this.isValidFileFormat(files)) {
        this.uploadFileError(req, res, redirectUrl, 'fileFormat');
      } else if (this.isFileSizeGreaterThanMaxAllowed(files)) {
        this.uploadFileError(req, res, redirectUrl, 'fileSize');
      } else {
        const formData: FormData = new FormData();
        formData.append('file', documents.data, {
          contentType: documents.mimetype,
          filename: documents.name,
        });
        try {
          const s2sToken = await getServiceAuthToken();
          const uploadDocumentResponseBody = await uploadDocument(formData, s2sToken, req);
          const { url, fileName, documentId, binaryUrl } = uploadDocumentResponseBody['data']['document'];
          req.session['caseDocuments'].push({
            url,
            fileName,
            documentId,
            binaryUrl,
            description: req.body['eventName'],
          });
          req.session.save(() => res.redirect(redirectUrl));
        } catch (error) {
          this.uploadFileError(req, res, redirectUrl, 'uploadError');
        }
      }
    } else {
      this.uploadFileError(req, res, redirectUrl, 'selectFileToUpload');
    }
  }

  public uploadFileError(
    req: AppRequest<AnyObject>,
    res: Response<any, Record<string, any>>,
    redirectUrl: string,
    errorCode: string
  ): void {
    const documentUploadErrors = getErrors(req.session['lang']);
    let errorMessage: string;
    switch (errorCode) {
      case 'noInput':
        errorMessage = documentUploadErrors.documentUpload.noInput;
        break;
      case 'fileSize':
        errorMessage = documentUploadErrors.documentUpload.fileSize;
        break;
      case 'selectFileToUpload':
        errorMessage = documentUploadErrors.documentUpload.selectFileToUpload;
        break;
      case 'uploadError':
        errorMessage = documentUploadErrors.documentUpload.uploadDeleteError;
        break;
      case 'maxFileError':
        errorMessage = documentUploadErrors.documentUpload.maxFileError;
        break;
      case 'fileFormat':
        errorMessage = documentUploadErrors.documentUpload.fileFormat;
        break;
      case 'containsMarkdownLink':
        errorMessage = documentUploadErrors.documentUpload.containsMarkdownLink;
        break;
      case 'invalid':
        errorMessage = documentUploadErrors.documentUpload.invalid;
        break;
      default:
        errorMessage = '';
    }
    req.session.fileErrors = [{ text: errorMessage, href: '#file-upload-1' }];
    req.session.save(err => {
      if (err) {
        throw err;
      }
      res.redirect(redirectUrl);
    });
  }

  public isValidFileFormat(files): boolean {
    const { documents } = files;
    const extension = documents.name.toLowerCase().split('.')[documents.name.split('.').length - 1];
    const AllowedFileExtensionList = [...documentExtensions, ...multimediaExtensions];
    return AllowedFileExtensionList.indexOf(extension) > -1;
  }

  public isFileSizeGreaterThanMaxAllowed(files): boolean {
    const uploadPolicySizeForFiles = Number(config.get('uploadPolicy.documentSize')) * 1024 * 1024;
    const { documents } = files;
    return documents.size > uploadPolicySizeForFiles;
  }
}
