import { FileUpload } from "~/dto/FileDto";
import { UploadObject } from "~/service/aws/type";

export interface onUploadInteractor {
  file: FileUpload;
  s3Object: UploadObject;
}

export interface IFileUploadRepositories {
  onUpload(file: FileUpload): Promise<FileUpload>;
}

export interface IFileUploadInteractor {
  onUpload(uploadObject: onUploadInteractor): Promise<FileUpload>;
}
