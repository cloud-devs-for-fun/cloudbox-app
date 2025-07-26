import { UploadObject } from "~/service/aws/type";

import { NextFunction, Request, Response } from "express";

import { StatusCodes } from "http-status-codes";

import s3Objects from "~/service/aws/s3";

import logger from "~/utils/logger";

export const S3Controller = {
  onUpload: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const params: UploadObject = {
        key: file.originalname,
        body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3Objects.uploadObject(params);

      return res
        .status(StatusCodes.CREATED)
        .json({ file: params.key, message: "S3 Object created successfully" });
    } catch (error) {
      logger.error("Failed to upload file in s S3", error);
      return next(error);
    }
  },

  onList: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await s3Objects.getList();
      return res.status(200).json({ content: data.Contents });
    } catch (error) {
      logger.error("Failed to interact with S3", error);
      return next(error);
    }
  },

  onGetObject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;
      if (!filename) {
        return res.status(400).json({ message: "Filename is required" });
      }

      const object = await s3Objects.getObject(filename);

      return res.status(200).json({ object });
    } catch (error) {
      logger.error("Failed to interact with S3", error);
      return next(error);
    }
  },
};
