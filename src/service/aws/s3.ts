import { UploadObject } from "./type";

import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { S3 } from "~/config/aws";

const s3Objects = {
  uploadObject: async ({ key, body, ContentType }: UploadObject) => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: ContentType,
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

    const { Body } = await S3.send(command);

    return Body?.transformToString();
  },

  getList: async () => {
    const list = new ListObjectsCommand({
      Bucket: process.env.BUCKET_NAME,
    });

    return S3.send(list);
  },
};

export default s3Objects;
