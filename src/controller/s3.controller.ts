import { UploadObject } from "~/service/aws/type";

import { NextFunction, Request, Response } from "express";

import path from "path";

import { StatusCodes } from "http-status-codes";

import s3Objects from "~/service/aws/s3";

import logger from "~/utils/logger";
import pool from "~/config/db";
import { v4 as uuidv4 } from "uuid";

export const S3Controller = {
  onUpload: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post =
        "INSERT INTO s3_files (filename, file_url, mime_type) VALUES ($1, $2, $3) RETURNING *";

      const file = req.file;

      if (!file) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "No file uploaded" });
      }

      const ext = path.extname(file.originalname);
      const originalname = `${uuidv4()}${ext}`;
      const filenameWithoutExt = path.parse(file.originalname).name;

      const params: UploadObject = {
        key: originalname,
        body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3Objects.uploadObject(params);

      const result = await pool.query(post, [
        originalname,
        filenameWithoutExt,
        file.mimetype,
      ]);

      return res.status(StatusCodes.CREATED).json({
        result: result.rows[0],
        message: "S3 Object created successfully",
      });
    } catch (error) {
      logger.error("Failed to upload file in s S3", error);
      return next(error);
    }
  },

  onList: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await s3Objects.getList();

      return res.status(StatusCodes.OK).json({ content: data.Contents });
    } catch (error) {
      logger.error("Failed to interact with S3", error);
      return next(error);
    }
  },

  onGetObject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;

      if (!filename) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Filename is required" });
      }

      const response = await s3Objects.getObject(filename);

      res.setHeader("Content-Type", "application/octet-stream");

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      logger.error("Failed to interact with S3", error);
      return next(error);
    }
  },

  onGetStream: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;

      if (!filename) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Filename is required" });
      }

      const response = await s3Objects.getObject(filename);

      res.setHeader("Content-Type", "application/octet-stream");

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      logger.error("Failed to interact with S3", error);
      return next(error);
    }
  },

  onGetDbSample: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const query = "SELECT * FROM s3_files";

      const result = await pool.query(query);

      return res
        .status(StatusCodes.OK)
        .json({ results: result.rows, message: "Sample DB interaction" });
    } catch (error) {
      logger.error("Failed to interact with the database", error);
      return next(error);
    }
  },
};
