import { FileUpload } from "~/dto/FileDto";
import {
  IFileUploadInteractor,
  IFileUploadRepositories,
  onUploadInteractor,
} from "~/interfaces/FIleUpload";
import s3Objects from "~/service/aws/s3";

export const FileUploadInteractor = (
  repository: IFileUploadRepositories
): IFileUploadInteractor => {
  const onUpload = async (
    uploadObject: onUploadInteractor
  ): Promise<FileUpload> => {
    await s3Objects.uploadObject(uploadObject.s3Object);

    const result = await repository.onUpload(uploadObject.file);

    return result;
  };

  return { onUpload };
};
