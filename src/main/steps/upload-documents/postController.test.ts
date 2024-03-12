import axios from 'axios';

import { FormContent } from '../../../main/app/form/Form';
import { mockRequest } from '../../../test/unit/utils/mockRequest';
import { mockResponse } from '../../../test/unit/utils/mockResponse';

import UploadDocumentController, { documentExtensions, multimediaExtensions } from './postController';

jest.mock('axios');
let req, res;

const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create = jest.fn(() => mockedAxios);
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
      ['jpg', 'jpeg', 'bmp', 'png', 'pdf', 'doc', 'docx', 'rtf', 'xlsx', 'xls', 'txt'].toString()
    );
  });

  test('Checking filevalidation type for multimedia', async () => {
    expect(multimediaExtensions().toString()).toEqual(['mp3', 'mp4'].toString());
  });

  test.each(
    [
      'sample.jpg',
      'sample.jpeg',
      'sample.bmp',
      'sample.png',
      'sample.pdf',
      'sample.doc',
      'sample.docx',
      'sample.rtf',
      'sample.xlsx',
      'sample.xls',
      'sample.txt',
    ]
  )('isValidFileFormat - valid file %s', async (fileName:string) => {
    expect(controller.isValidFileFormat({ documents: { name: fileName} })).toBe(true);
  });

  test.each(
    [
      'sample.dmg',
      'sample.wav'
    ]
  )('isValidFileFormat - invalid file %s', async (fileName:string) => {
    expect(controller.isValidFileFormat({ documents: { name: fileName} })).toBe(false);
  });

  test('isFileSizeGreaterThanMaxAllowed - valid document file size', async () => {
    const fileSizeCheck = controller.isFileSizeGreaterThanMaxAllowed({ documents: { size: 524288000, name: 'm.docx' } });
    expect(fileSizeCheck).toBe(false);
  });

  test('isFileSizeGreaterThanMaxAllowed - invalid document file size', async () => {
    const fileSizeCheck = controller.isFileSizeGreaterThanMaxAllowed({ documents: { size: 524288001, name: 'm.docx' } });
    expect(fileSizeCheck).toBe(true);
  });

  test('isFileSizeGreaterThanMaxAllowed - valid multimedia file', async () => {
    const fileSizeCheck = controller.isFileSizeGreaterThanMaxAllowed({ documents: { size: 524288000, name: 'm.mp4' } });
    expect(fileSizeCheck).toBe(false);
  });

  test('isFileSizeGreaterThanMaxAllowed - invalid multimedia file', async () => {
    const fileSizeCheck = controller.isFileSizeGreaterThanMaxAllowed({ documents: { size: 524288001, name: 'm.mp4' } });
    expect(fileSizeCheck).toBe(true);
  });

  test('fileNullCheck - file not null', async () => {
    expect(controller.fileNullCheck({})).toBe(false);
  });

  test.each(
    [
      undefined,
      null
    ]
  )('fileNullCheck - no file', async (files) => {
    expect(controller.fileNullCheck(files)).toBe(true);
  });

  test('File validations', async () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
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

  test('checkFileValidation - file size error', async () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    newRequest.files = { documents: { name: 'sample.mp3', size: 31, mimetype: 'audio/mpeg', data: '' } };
    const data = {};
    mockedAxios.post.mockRejectedValue({ data });
    await controller.checkFileValidation(
      { documents: { name: 'sample.mp3', size: 524288001, mimetype: 'audio/mpeg', data: '' } },
      newRequest,
      res,
      ''
    );
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session?.fileErrors).toHaveLength(1);
    expect(req.session?.fileErrors[0].text).toEqual('File size exceeds the maximum permitted value. Please upload a file that is less than 500MB');
  });

  test('checkFileValidation - no file error', async () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    newRequest.files = null;
    const data = {};
    mockedAxios.post.mockRejectedValue({ data });
    await controller.checkFileValidation(
      null,
      newRequest,
      res,
      ''
    );
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session?.fileErrors).toHaveLength(1);
    expect(req.session?.fileErrors[0].text).toEqual('Select a file to upload');
  });

  test('File validations - file uploading successful', async () => {
    const newRequest = req;
    newRequest.body['eventName'] = "TEST"
    newRequest.session.caseDocuments = []
    newRequest.session.fileErrors = []
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
    mockedAxios.post.mockResolvedValue({ data });
    await controller.checkFileValidation(
      { documents: { name: 'sample.pdf', size: 10, mimetype: 'application/pdf', data: '' } },
      newRequest,
      res,
      ''
    );
    const expectedCaseDocuments = {
      ...data.document,
      description: "TEST"
    };

    expect(mockedAxios.create).toHaveBeenCalled();
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalled();
    expect(req.session.caseDocuments).toHaveLength(1);
    expect(req.session.caseDocuments[0]).toEqual(expectedCaseDocuments);
    expect(req.session?.fileErrors).toHaveLength(0);
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
    expect(req.session?.fileErrors[0].text).toEqual('File size exceeds the maximum permitted value. Please upload a file that is less than 500MB');
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
    expect(req.session?.fileErrors[0].text).toEqual('Document upload or deletion has failed. Please try again');
    expect(req.session?.fileErrors[0].href).toEqual('#file-upload-1');
  });

  test('uploadFileError maxFileError', () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    controller.uploadFileError(newRequest, res, '', 'maxFileError');
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session?.fileErrors).toHaveLength(1);
    expect(req.session?.fileErrors[0].text).toEqual('You can only select up to 20 files at the same time');
    expect(req.session?.fileErrors[0].href).toEqual('#file-upload-1');
  });

  test('uploadFileError fileFormat', () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    controller.uploadFileError(newRequest, res, '', 'fileFormat');
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.session?.fileErrors).toHaveLength(1);
    expect(req.session?.fileErrors[0].text).toEqual('This service only accepts files in the formats - MS Word, MS Excel, PDF, JPG, PNG, TXT, RTF, MP4, MP3');
    expect(req.session?.fileErrors[0].href).toEqual('#file-upload-1');
  });

  test('checkFileCondition with no file selected for upload', () => {
    const newRequest = req;
    newRequest.session['save'] = () => '';
    req.session['caseDocuments'] = [];
    controller.checkFileCondition(newRequest, res, '', { files: { document: {} } });
    expect(req.session?.fileErrors).toHaveLength(1);
    expect(req.session?.fileErrors[0].text).toEqual('Select a file to upload');
    expect(req.session?.fileErrors[0].href).toEqual('#file-upload-1');
  });

  test('checkFileCondition with more than max number of files', () => {
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
    expect(req.session?.fileErrors).toHaveLength(1);
    expect(req.session?.fileErrors[0].text).toEqual('You can only select up to 20 files at the same time');
    expect(req.session?.fileErrors[0].href).toEqual('#file-upload-1');
  });

  test('Continuing without document upload or additional infomation', async () => {
    const newRequest = req;
    newRequest.body['documentDetail'] = '';
    newRequest.session.caseDocuments = [];
    newRequest.session['save'] = () => '';
    newRequest.body.continue = true;
    controller.post(newRequest, res);
    expect(req.session?.fileErrors).toHaveLength(1);
    expect(req.session?.fileErrors[0].text).toEqual('You cannot continue without providing additional information or a document');
    expect(req.session?.fileErrors[0].href).toEqual('#file-upload-1');
  });

  test('Continuing with only additional infomation', async () => {
    const newRequest = req;
    newRequest.body['documentDetail'] = 'test';
    newRequest.session.caseDocuments = [];
    newRequest.session['save'] = () => '';
    newRequest.body.continue = true;
    controller.post(newRequest, res);
    expect(req.session?.fileErrors).toHaveLength(0);
  });

  test('Continuing with only uploaded documents', async () => {
    const newRequest = req;
    newRequest.body['documentDetail'] = '';
    newRequest.session.caseDocuments = ['doc1', 'doc2'];
    newRequest.session['save'] = () => '';
    newRequest.body.continue = true;
    controller.post(newRequest, res);
    expect(req.session?.fileErrors).toHaveLength(0);
  });

  test('Continuing with additional infomation and uploaded documents', async () => {
    const newRequest = req;
    newRequest.body['documentDetail'] = 'test';
    newRequest.session.caseDocuments = ['doc1', 'doc2'];
    newRequest.session['save'] = () => '';
    newRequest.body.continue = true;
    controller.post(newRequest, res);
    expect(req.session?.fileErrors).toHaveLength(0);
  });
});
