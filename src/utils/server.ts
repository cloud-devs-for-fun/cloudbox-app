import type { Express } from "express";
import { ReasonPhrases } from "http-status-codes";

import pool from "~/config/db";

import logger from "./logger";

const server = async (app: Express) => {
  const port = process.env.SERVER_PORT || 3000;

  try {
    await pool.connect();
    logger.info("✅ Connected to PostgreSQL");

    const httpServer = app.listen(port, () => {
      logger.info(`🚀 Server running at port:${port}`);
    });

    httpServer.on("error", (err) => {
      logger.error(ReasonPhrases.INTERNAL_SERVER_ERROR, err);
      process.exit(1);
    });
  } catch (err) {
    logger.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

export default server;
