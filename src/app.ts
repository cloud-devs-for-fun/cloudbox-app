import express from "express";

import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import { ReasonPhrases } from "http-status-codes";

dotenv.config();

import logger from "./utils/logger";

import s3Router from "~/routes/s3.routes";

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", s3Router);

const server = app.listen(port, () => {
  logger.info(`Server running at port:${port}`);
});

server.on("error", (err) => {
  logger.error(ReasonPhrases.INTERNAL_SERVER_ERROR, err);
  process.exit(1);
});
