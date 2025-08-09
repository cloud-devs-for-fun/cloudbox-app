import express from "express";

import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import s3Router from "~/routes/s3.routes";

import server from "./utils/server";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", s3Router);

server(app);
