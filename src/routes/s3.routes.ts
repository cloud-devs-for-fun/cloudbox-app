import express from "express";
import multer from "multer";

import { S3Controller } from "~/controller/s3.controller";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router
  .post("/s3/upload", upload.single("file"), S3Controller.onUpload)
  .get("/s3/list", S3Controller.onList)
  .get("/s3/object/:filename", S3Controller.onGetObject)
  .get("/s3/stream/:filename", S3Controller.onGetStream)
  .get("/sample", S3Controller.onGetDbSample);

export default router;
