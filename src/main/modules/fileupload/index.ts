import config from 'config';
import { Application } from 'express';
import fileUpload from 'express-fileupload';
/**
 * @FileUpload
 * sets up the fileUpload
 */
export class FileUpload {
  public enableFor(app: Application): void {
    const DefaultFileUploadSize = Number(config.get<number>('documentManagement.uploadSizeinMB'));

    app.use(
      fileUpload({
        limits: { fileSize: 1024 * 1024 * DefaultFileUploadSize },
      })
    );
  }
}
