import { UploadObject } from "./type";

import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { S3 } from "~/config/aws";

const s3Objects = {
  uploadObject: async (fileObject: UploadObject) => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileObject.key,
      Body: fileObject.body,
      ContentType: fileObject.ContentType,
    };

    const command = new PutObjectCommand(params);

    return await S3.send(command);
  },

  getObject: async (key: string) => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    };

    const command = new GetObjectCommand(params);

    const response = await S3.send(command);

    return response.Body?.transformToString();
  },

  getStream: async (key: string) => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    };

    const command = new GetObjectCommand(params);

    const response = await S3.send(command);
    return response.Body?.transformToByteArray();
  },

  getList: async () => {
    const list = new ListObjectsCommand({
      Bucket: process.env.BUCKET_NAME,
    });

    return S3.send(list);
  },
};

export default s3Objects;
