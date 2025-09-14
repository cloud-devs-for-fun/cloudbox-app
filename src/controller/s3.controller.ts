import { UploadObject } from "~/service/aws/type";

import { NextFunction, Request, Response } from "express";

import { StatusCodes } from "http-status-codes";

import logger from "~/utils/logger";

import { FileUpload } from "~/dto/FileDto";
import {
  IFileUploadInteractor,
  onUploadInteractor,
} from "~/interfaces/FIleUpload";
import moment from "moment";
import path from "path";

export const S3Controller = (interactor: IFileUploadInteractor) => {
  const onUpload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      if (!file) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "No file uploaded" });
      }
      const time = moment().format("YYYYMMDDHHmmss");
      const withoutExt = path.parse(file.originalname).name;
      const ext = path.extname(file.originalname);
      const originalname = `${withoutExt}-${time}${ext}`;

      const s3UploadObject: UploadObject = {
        key: originalname,
        body: file.buffer,
        ContentType: file.mimetype,
      };

      const fileUploadParams: FileUpload = {
        filename: originalname,
        fileUrl: s3UploadObject.key,
        mimeType: file.mimetype,
      };

      const uploadObjectParams: onUploadInteractor = {
        file: fileUploadParams,
        s3Object: s3UploadObject,
      };

      const result = await interactor.onUpload(uploadObjectParams);

      return res.status(StatusCodes.CREATED).json({
        result: result,
        message: "S3 Object created successfully",
      });
    } catch (error) {
      logger.error("Failed to upload file in S3", error);
      return next(error);
    }
  };

  return { onUpload };
  // onList: async (_req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const data = await s3Objects.getList();

  //     return res.status(StatusCodes.OK).json({ content: data });
  //   } catch (error) {
  //     logger.error("Failed to interact with S3", error);
  //     return next(error);
  //   }
  // },

  // onGetObject: async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { filename } = req.params;

  //     if (!filename) {
  //       return res
  //         .status(StatusCodes.BAD_REQUEST)
  //         .json({ message: "Filename is required" });
  //     }

  //     const response = await s3Objects.getObject(filename);

  //     res.setHeader("Content-Type", "application/octet-stream");

  //     return res.status(StatusCodes.OK).json(response);
  //   } catch (error) {
  //     logger.error("Failed to interact with S3", error);
  //     return next(error);
  //   }
  // },

  // onGetStream: async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { filename } = req.params;

  //     if (!filename) {
  //       return res
  //         .status(StatusCodes.BAD_REQUEST)
  //         .json({ message: "Filename is required" });
  //     }

  //     const response = await s3Objects.getObject(filename);

  //     res.setHeader("Content-Type", "application/octet-stream");

  //     return res.status(StatusCodes.OK).json(response);
  //   } catch (error) {
  //     logger.error("Failed to interact with S3", error);
  //     return next(error);
  //   }
  // },

  // onGetDbSample: async (_req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const query = "SELECT * FROM s3_files";

  //     const result = await pool.query(query);

  //     return res
  //       .status(StatusCodes.OK)
  //       .json({ results: result.rows, message: "Sample DB interaction" });
  //   } catch (error) {
  //     logger.error("Failed to interact with the database", error);
  //     return next(error);
  //   }
  // },
};
