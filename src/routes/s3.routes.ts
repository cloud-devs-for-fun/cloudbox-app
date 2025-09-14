import express from "express";
import multer from "multer";

import { S3Controller } from "~/controller/s3.controller";
import { FileUploadInteractor } from "~/interactor/FileUpload";
import { FileUploadRepository } from "~/repositories/FileUplaodRepository";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const repository = FileUploadRepository;
const interactor = FileUploadInteractor(repository);
const fileUpload = S3Controller(interactor);

router.post("/s3/upload", upload.single("file"), fileUpload.onUpload);
// .get("/s3/list", S3Controller.onList)
// .get("/s3/object/:filename", S3Controller.onGetObject)
// .get("/s3/stream/:filename", S3Controller.onGetStream)
// .get("/sample", S3Controller.onGetDbSample);

export default router;
