import pool from "~/config/db";
import { FileUpload } from "~/dto/FileDto";
import { IFileUploadRepositories } from "~/interfaces/FIleUpload";

export const FileUploadRepository: IFileUploadRepositories = {
  async onUpload(file: FileUpload): Promise<FileUpload> {
    const onUploadQuery =
      "INSERT INTO s3_files (filename, file_url, mime_type) VALUES ($1, $2, $3) RETURNING *";

    const result = await pool.query(onUploadQuery, [
      file.filename,
      file.fileUrl,
      file.mimeType,
    ]);

    return result.rows[0];
  },
};
