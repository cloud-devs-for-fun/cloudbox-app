import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

const s3ClientCredentials: S3ClientConfig = {
  region: process.env.BUCKET_REGION as string,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
  },
};

export const S3 = new S3Client(s3ClientCredentials);