import axios from 'axios';

import { FormContent } from '../../../main/app/form/Form';
import { mockRequest } from '../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../test/unit/utils/mockResponse';

import UploadDocumentController, { documentExtensions, multimediaExtensions } from './postController';

jest.mock('axios');
let req, res;

const mockedAxios = axios as jest.Mocked<typeof axios>;
beforeEach(() => {
  req = mockRequest();
  res = mockResponse();
});
const mockFormContent = {
  fields: {},
} as unknown as FormContent;

const controller = new UploadDocumentController(mockFormContent.fields);

describe('Testing the post controller', () => {
  // eslint-disable-next-line jest/no-done-callback
  test('upload document sequence', async () => {
    req = mockRequest({
      body: {
        continue: true,
        files: { documents: {} },
      },
      session: {
        caseDocuments: [],
        caseTypeId: 'caseRefId',
        jurisdiction: 'ADOPTION',
        userCase: {
          id: 'caseRefId'
        }
      },
    });
    const data = {
      status: 'Success',
      document: {
        url: 'http://demo.com',
        fileName: 'Screenshot 2023-01-24 at 11.52.19.png',
        documentId: '93de8780-e3f3',
        binaryUrl: 'http://demon.com',
      },
    };
    mockedAxios.post.mockResolvedValue({ data });
    // await controller.post(req, res);
    expect(res.redirect).not.toHaveBeenCalled();
  });

  test('Checking filevalidation type for documents', async () => {
    expect(documentExtensions().toString()).toEqual(
      ['jpg', 'jpeg', 'bmp', 'png', 'pdf', 'doc', 'docx', 'rtf', 'xlsx', 'txt'].toString()
    );
  });

  test('Checking filevalidation type for multimedia', async () => {
    expect(multimediaExtensions().toString()).toEqual(['mp3', 'mp4', 'wav'].toString());
  });

  test('Checking file valid format - true scenario', async () => {
    const filetypeCheck = controller.isValidFileFormat({ documents: { name: 'smple.docx' } });
    expect(filetypeCheck).toBe(true);
  });

  test('Checking file valid format - false scenario', async () => {
    const filetypeCheck = controller.isValidFileFormat({ documents: { name: 'smple.dmg' } });
    expect(filetypeCheck).toBe(false);
  });

  test('Checking file size - false scenario', async () => {
    const fileSizeCheck = controller.isFileSizeGreaterThanMaxAllowed({ documents: { size: 30, name: 'm.docx' } });
    expect(fileSizeCheck).toBe(false);
  });

  test('Checking file size for multimedia files', async () => {
    const fileSizeCheck = controller.isFileSizeGreaterThanMaxAllowed({ documents: { size: 200, name: 'm.mp4' } });
    expect(fileSizeCheck).toBe(false);
  });

  test('Checking file size for multimedia files - false scenario', async () => {
    const fileSizeCheck = controller.isFileSizeGreaterThanMaxAllowed({ documents: { size: 510, name: 'm.mp4' } });
    expect(fileSizeCheck).toBe(false);
  });

  test('Checking file is null', async () => {
    const fileNullCheck = controller.fileNullCheck({});
    expect(fileNullCheck).toBe(false);
  });

  test('File validations', async () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    newRequest.session['caseTypeId'] = 'caseTypeId';
    newRequest.session['jurisdiction'] = 'jurisdiction';
    newRequest.files = { documents: { name: 'smple.pdf', size: 10, mimetype: 'application/pdf', data: '' } };
    const data = {
      status: 'Success',
      document: {
        url: 'http://demo.com',
        fileName: 'Screenshot 2023-01-24 at 11.52.19.png',
        documentId: '93de8780-e3f3',
        binaryUrl: 'http://demon.com',
      },
    };
    mockedAxios.post.mockResolvedValue({ data });
    await controller.checkFileValidation(
      { documents: { name: 'smple.pdf', size: 10, mimetype: 'application/pdf', data: '' } },
      newRequest,
      res,
      ''
    );
    expect(res.redirect).not.toHaveBeenCalled();
  });

  test('File validations - multimedia file error', async () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    newRequest.session['caseTypeId'] = 'caseTypeId';
    newRequest.session['jurisdiction'] = 'jurisdiction';
    newRequest.files = { documents: { name: 'sample.mp3', size: 510, mimetype: 'audio/mpeg', data: '' } };
    const data = {};
    mockedAxios.post.mockRejectedValue({ data });
    await controller.checkFileValidation(
      { documents: { name: 'sample.mp3', size: 510, mimetype: 'audio/mpeg', data: '' } },
      newRequest,
      res,
      ''
    );
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session?.fileErrors).toHaveLength(1);
  });

  test('File validations - file uploading successfull', async () => {
    const newRequest = req;
    newRequest.session['caseTypeId'] = 'caseTypeId';
    newRequest.session['jurisdiction'] = 'jurisdiction';
    newRequest.session['save'] = () => '';
    newRequest.files = { documents: { name: 'sample.pdf', size: 10, mimetype: 'application/pdf', data: '' } };
    const data = {
      status: 'Success',
      document: {
        url: 'http://demo.com',
        fileName: 'sample.mp3',
        documentId: '93de8780-e3f3',
        binaryUrl: 'http://demon.com',
      },
    };
    mockedAxios.post.mockRejectedValue({ data });
    await controller.checkFileValidation(
      { documents: { name: 'sample.pdf', size: 10, mimetype: 'application/pdf', data: '' } },
      newRequest,
      res,
      ''
    );
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session?.fileErrors).toHaveLength(1);
  });

  test('uploadFileError noInput', () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    controller.uploadFileError(newRequest, res, '', 'noInput');
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session?.fileErrors).toHaveLength(1);
    expect(req.session?.fileErrors[0].text).toEqual('You cannot continue without providing additional information or a document');
    expect(req.session?.fileErrors[0].href).toEqual('#file-upload-1');
  });

  test('uploadFileError fileSize', () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    controller.uploadFileError(newRequest, res, '', 'fileSize');
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session?.fileErrors).toHaveLength(1);
    expect(req.session?.fileErrors[0].text).toEqual('File size exceeds the maximum permitted value. Please upload a file that is less than 20MB (documents) or less than 30MB (multimedia files)');
    expect(req.session?.fileErrors[0].href).toEqual('#file-upload-1');
  });

  test('uploadFileError selectFileToUpload', () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    controller.uploadFileError(newRequest, res, '', 'selectFileToUpload');
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session?.fileErrors).toHaveLength(1);
    expect(req.session?.fileErrors[0].text).toEqual('Select a file to upload');
    expect(req.session?.fileErrors[0].href).toEqual('#file-upload-1');
  });

  test('uploadFileError uploadError', () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    controller.uploadFileError(newRequest, res, '', 'uploadError');
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session?.fileErrors).toHaveLength(1);
    expect(req.session?.fileErrors[0].text).toEqual('The selected file could not be uploaded – try again');
    expect(req.session?.fileErrors[0].href).toEqual('#file-upload-1');
  });

  test('uploadFileError maxFileError', () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    controller.uploadFileError(newRequest, res, '', 'maxFileError');
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session?.fileErrors).toHaveLength(1);
    expect(req.session?.fileErrors[0].text).toEqual('You can only select up to 10 files at the same time');
    expect(req.session?.fileErrors[0].href).toEqual('#file-upload-1');
  });

  test('uploadFileError fileFormat', () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    controller.uploadFileError(newRequest, res, '', 'fileFormat');
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session?.fileErrors).toHaveLength(1);
    expect(req.session?.fileErrors[0].text).toEqual('This service only accepts files in the formats - Ms Word, MS Excel, PDF, JPG, PNG, TXT, RTF, MP4, MP3');
    expect(req.session?.fileErrors[0].href).toEqual('#file-upload-1');
  });


  test('checkFileCondition', () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    req.session['caseDocuments'] = [];
    controller.checkFileCondition(newRequest, res, '', { files: { document: {} } });
    expect(res.redirect).not.toHaveBeenCalled();
  });
  test('checkFileCondition with max number of files', () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    req.session['caseDocuments'] = [
      { name: 'f.png' },
      { name: 'f.png' },
      { name: 'f.png' },
      { name: 'f.png' },
      { name: 'f.png' },
      { name: 'f.png' },
      { name: 'f.png' },
      { name: 'f.png' },
      { name: 'f.png' },
      { name: 'f.png' },
      { name: 'f.png' },
    ];
    controller.checkFileCondition(newRequest, res, '', { files: { document: {} } });
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
